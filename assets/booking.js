(function () {
  var form = document.getElementById('bookingForm');
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll('.bk-step'));
  var dots = Array.prototype.slice.call(form.querySelectorAll('.bk-dot'));
  var backBtn = document.getElementById('bkBack');
  var nextBtn = document.getElementById('bkNext');
  var submitBtn = document.getElementById('bkSubmit');
  var errorEl = document.getElementById('bkError');
  var successEl = document.getElementById('bkSuccess');
  var summaryEl = document.getElementById('bkSummary');
  var current = 0;

  // Year dropdown: next model year down to 1990
  var yearSel = document.getElementById('bkYear');
  var thisYear = new Date().getFullYear();
  for (var y = thisYear + 1; y >= 1990; y--) {
    var o = document.createElement('option');
    o.value = o.textContent = String(y);
    yearSel.appendChild(o);
  }

  // Earliest date = tomorrow (local time)
  var dateEl = document.getElementById('bkDate');
  var t = new Date();
  t.setDate(t.getDate() + 1);
  dateEl.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');


  // ── Address autocomplete (Photon / OpenStreetMap, free, no key) ──
  var addrInput = document.getElementById('bkAddress');
  var addrList = document.getElementById('bkAddrList');
  var addrTimer = null, addrAbort = null, addrItems = [], addrActive = -1;

  function closeList() {
    addrList.hidden = true;
    addrList.innerHTML = '';
    addrItems = [];
    addrActive = -1;
    addrInput.setAttribute('aria-expanded', 'false');
  }

  function formatAddr(p) {
    var street = [p.housenumber, p.street || (p.housenumber ? '' : p.name)].filter(Boolean).join(' ');
    var city = p.city || p.town || p.village || p.locality || p.district || '';
    var rest = [city, p.state, p.postcode].filter(Boolean).join(', ');
    return [street, rest].filter(Boolean).join(', ');
  }

  function renderList(features) {
    var seen = {};
    addrItems = [];
    features.forEach(function (f) {
      var p = f.properties || {};
      if (p.countrycode && p.countrycode !== 'CA') return;
      var text = formatAddr(p);
      if (!text || seen[text]) return;
      seen[text] = true;
      addrItems.push(text);
    });
    addrList.innerHTML = '';
    if (!addrItems.length) { closeList(); return; }
    addrItems.forEach(function (text, n) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.textContent = text;
      li.addEventListener('mousedown', function (e) { e.preventDefault(); pick(n); });
      addrList.appendChild(li);
    });
    addrActive = -1;
    addrList.hidden = false;
    addrInput.setAttribute('aria-expanded', 'true');
  }

  function pick(n) {
    addrInput.value = addrItems[n];
    closeList();
    document.getElementById('bkUnit').focus();
  }

  function highlight(n) {
    var lis = addrList.children;
    for (var i = 0; i < lis.length; i++) lis[i].classList.toggle('active', i === n);
    addrActive = n;
  }

  function search(q) {
    if (addrAbort) addrAbort.abort();
    addrAbort = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var url = 'https://photon.komoot.io/api/?limit=8&lang=en&lat=43.65&lon=-79.6&q=' + encodeURIComponent(q + ' Ontario');
    fetch(url, addrAbort ? { signal: addrAbort.signal } : undefined)
      .then(function (r) { return r.ok ? r.json() : { features: [] }; })
      .then(function (d) { renderList(d.features || []); })
      .catch(function () { /* offline or blocked: user can still type freely */ });
  }

  addrInput.addEventListener('input', function () {
    clearTimeout(addrTimer);
    var q = addrInput.value.trim();
    if (q.length < 4) { closeList(); return; }
    addrTimer = setTimeout(function () { search(q); }, 300);
  });
  addrInput.addEventListener('keydown', function (e) {
    if (addrList.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); highlight((addrActive + 1) % addrItems.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); highlight((addrActive - 1 + addrItems.length) % addrItems.length); }
    else if (e.key === 'Enter' && addrActive >= 0) { e.preventDefault(); e.stopPropagation(); pick(addrActive); }
    else if (e.key === 'Escape') { closeList(); }
  });
  addrInput.addEventListener('blur', function () { setTimeout(closeList, 150); });

  function showError(msg) {
    errorEl.querySelector('span').textContent = msg;
    errorEl.classList.add('show');
  }

  function stepValid(i) {
    var fields = steps[i].querySelectorAll('input, select, textarea');
    for (var n = 0; n < fields.length; n++) {
      var f = fields[n];
      if (f.type === 'radio') continue;
      if (!f.checkValidity()) {
        f.focus();
        showError(i === 4 && f.type === 'email' ? 'Please enter a valid email address.' : 'Please complete the required fields.');
        return false;
      }
    }
    if (i === 1 && !form.querySelector('input[name="Package"]:checked')) {
      showError('Please choose a package.');
      return false;
    }
    return true;
  }

  function selected() {
    var pkg = form.querySelector('input[name="Package"]:checked');
    var addons = Array.prototype.slice.call(form.querySelectorAll('.bk-addon:checked'));
    var total = (pkg ? Number(pkg.dataset.price) : 0);
    addons.forEach(function (a) { total += Number(a.dataset.price); });
    return { pkg: pkg, addons: addons, total: total, custom: pkg && Number(pkg.dataset.price) === 0 };
  }

  function decode(s) { var d = document.createElement('textarea'); d.innerHTML = s; return d.value; }

  function buildSummary() {
    var s = selected();
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var vehicle = [v('bkYear'), v('bkMake'), v('bkModel')].join(' ') + (v('bkColor') ? ' (' + v('bkColor') + ')' : '') + ' · ' + v('bkBody');
    var addonNames = s.addons.map(function (a) { return decode(a.value); });
    var totalText = s.custom ? 'Custom quote' : '$' + s.total + '+ (starting estimate)';
    var lines = [
      ['Vehicle', vehicle],
      ['Package', s.pkg ? decode(s.pkg.value) : ''],
      ['Add-ons', addonNames.length ? addonNames.join(', ') : 'None'],
      ['When', v('bkDate') + ' at ' + v('bkTime')],
      ['Where', v('bkAddress') + (v('bkUnit') ? ' — ' + v('bkUnit') : '')],
      ['Estimate', totalText]
    ];
    summaryEl.innerHTML = '';
    lines.forEach(function (l) {
      var row = document.createElement('div');
      var b = document.createElement('strong'); b.textContent = l[0];
      var sp = document.createElement('span'); sp.textContent = l[1];
      row.appendChild(b); row.appendChild(sp);
      summaryEl.appendChild(row);
    });
    document.getElementById('bkSummaryField').value = lines.map(function (l) { return l[0] + ': ' + l[1]; }).join('\n');
    document.getElementById('bkAddonsField').value = addonNames.join(', ');
    document.getElementById('bkTotalField').value = totalText;
  }

  function go(i) {
    current = i;
    steps.forEach(function (st, n) { st.hidden = n !== i; });
    dots.forEach(function (d, n) { d.classList.toggle('active', n <= i); });
    backBtn.hidden = i === 0;
    nextBtn.hidden = i === steps.length - 1;
    submitBtn.hidden = i !== steps.length - 1;
    errorEl.classList.remove('show');
    if (i === steps.length - 1) buildSummary();
    var top = form.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  nextBtn.addEventListener('click', function () {
    errorEl.classList.remove('show');
    if (stepValid(current)) go(current + 1);
  });
  backBtn.addEventListener('click', function () { go(current - 1); });

  // Enter key advances instead of submitting early
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && current < steps.length - 1) {
      e.preventDefault();
      nextBtn.click();
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (current !== steps.length - 1 || !stepValid(current)) return;
    errorEl.classList.remove('show');
    buildSummary();
    submitBtn.disabled = true;
    var label = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.hidden = true;
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        return res.json().catch(function () { return null; }).then(function (data) {
          showError(data && data.errors && data.errors.length
            ? data.errors.map(function (x) { return x.message; }).join(', ')
            : 'Something went wrong — please try again or call/text us at 437-345-0034.');
        });
      }
    }).catch(function () {
      showError('Something went wrong — please check your connection or call/text us at 437-345-0034.');
    }).then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = label;
    });
  });

  document.getElementById('bkAgain').addEventListener('click', function () {
    form.reset();
    form.hidden = false;
    successEl.hidden = true;
    go(0);
  });
})();
