(function () {
  var PHONE = '437-345-0034';
  var TEL = 'tel:+14373450034';

  var QUICK = ['Pricing', 'Services', 'Ceramic coating', 'Service area', 'Book a detail'];

  var link = function (href, text) { return '<a href="' + href + '">' + text + '</a>'; };
  var callLine = 'Call or text us at ' + link(TEL, PHONE) + '.';
  var callInline = 'call or text us at ' + link(TEL, PHONE);
  var bookLine = link('/book-now', 'Get a free quote') + ' and we\'ll reply within 24–48 hours.';

  var callGeneral = 'For specific inquiries, ' + callInline + '.';

  // low: true = generic section word; only wins when nothing more specific matches
  var INTENTS = [
    { keys: ['hello', 'hi', 'hey', 'yo', 'good morning', 'good afternoon', 'good evening', 'sup'], exact: true,
      reply: 'Hi! 👋 I\'m the Five Star assistant. I can help with pricing, services, our service area, or getting you a quote. ' + callGeneral },
    { keys: ['thanks', 'thank you', 'thx', 'appreciate'],
      reply: 'Anytime! Anything else I can help with?' },
    { keys: ['bye', 'goodbye', 'see you', 'cya'],
      reply: 'Thanks for stopping by! Whenever you\'re ready, ' + link('/book-now', 'book a detail') + '. 🚗✨' },

    // ── Policies we don't publish: send to phone ──
    { keys: ['cancel', 'cancellation', 'reschedule', 'deposit', 'refund', 'guarantee', 'warranty', 'insured', 'insurance', 'satisfied', 'satisfaction', 'touch up', 'touch-up', 'late', 'running late', 'discount', 'coupon', 'promo', 'first time', 'monthly', 'recurring', 'membership', 'subscription', 'eco', 'eco-friendly', 'products', 'chemicals', 'safe for', 'rain', 'weather', 'keys', 'car seat', 'carseat', 'belongings', 'personal items', 'be home', 'multiple cars', 'multiple vehicles', 'two cars', 'someone else', 'mold', 'mildew', 'vomit', 'biohazard', 'smoke', 'smell', 'odor', 'odour', 'spill', 'mud', 'salt'],
      reply: 'Good question. That one depends on your vehicle and situation, so it\'s best to ask us directly. ' + callGeneral + ' Or ' + link('/book-now', 'send a quote request') + ' with details and we\'ll reply within 24–48 hours.' },

    { keys: ['book', 'booking', 'appointment', 'schedule', 'reserve', 'quote', 'estimate', 'available', 'availability', 'today', 'tomorrow', 'advance'],
      reply: 'Easiest way is our quote form: ' + bookLine + ' For same-day or next-day availability, ' + callInline + '.' },
    { keys: ['pay', 'payment', 'cash', 'card', 'etransfer', 'e-transfer', 'debit', 'credit'],
      reply: 'For payment methods, ' + callInline + ' or mention it in your ' + link('/book-now', 'quote request') + '.' },

    // ── Services ──
    { keys: ['ceramic', 'coating', 'nano', 'sealant', 'protection'],
      reply: '<strong>Ceramic coating</strong> (starting prices):<br>• 1 Year: $299+<br>• 3 Year: $599+<br>• 5 Year: $999+<br>All include paint correction &amp; prep, with certified Nano-Brite &amp; System X coatings. ' + link('/paintcorrection', 'Paint Correction &amp; Ceramic Coating') + '.' },
    { keys: ['correction', 'polish', 'swirl', 'scratch', 'scratches', 'buff', 'oxidation', 'faded', 'dull', 'restore'],
      reply: '<strong>Paint correction</strong> removes swirls &amp; light scratches and restores shine:<br>• One stage: $400+<br>• Two &amp; three stage: custom quote<br>Deep scratches vary, so ' + callInline + ' or ' + link('/paintcorrection', 'see details') + '.' },
    { keys: ['interior', 'inside', 'seat', 'seats', 'leather', 'carpet', 'carpets', 'mats', 'upholstery', 'stain', 'stains', 'shampoo', 'steam', 'trunk', 'dashboard', 'vents'],
      reply: '<strong>Interior detail</strong> (Complete Interior Detail $100+): full vacuum incl. trunk, brush &amp; wipe down, floor/carpet/seat steam, shampoo &amp; extraction, leather conditioning, vents cleaned. Stubborn stains vary, so ' + callInline + ' if it\'s heavy. ' + link('/services#pricing', 'See packages') + '.' },
    { keys: ['exterior', 'outside', 'wash', 'wax', 'hand wash', 'window', 'windows', 'wheel', 'wheels', 'rim', 'rims', 'tire', 'tires', 'brake dust'],
      reply: '<strong>Exterior options</strong>: Premium Hand Wash, Wax &amp; Dry from $60+, Clay &amp; Seal $200+. Wheels, tires, wheel wells and windows are cleaned as part of our detail packages. ' + link('/services#pricing', 'See pricing') + '.' },
    { keys: ['add on', 'add-on', 'addon', 'addons', 'add-ons', 'headlight', 'headlights', 'pet hair', 'pet', 'dog hair', 'engine', 'engine bay', 'clay', 'sap', 'bug', 'bugs', 'fall out', 'fallout'],
      reply: '<strong>Add-ons</strong>:<br>• Headlight restoration: $50<br>• Pet hair removal: $40<br>• Engine bay detail: $50<br>• Fall out removal &amp; clay bar: $199<br>• Tree sap &amp; bug removal: $40<br>' + link('/services#pricing', 'All add-ons') + '.' },
    { keys: ['tire swap', 'caliper', 'oil change', 'chrome', 'tint', 'customization', 'vehicle service', 'vehicle services', 'vehicleservices'],
      reply: '<strong>Vehicle Service &amp; Customization</strong>:<br>• Seasonal tire swap: $50+<br>• Caliper paint: $199<br>• Oil change: $50<br>• Headlight/taillight tint: $80<br>• Chrome delete: custom quote<br>' + link('/services#vehicle-services', 'See it on our services page') + ' or ' + callInline + '.' },
    { keys: ['fleet', 'fleets', 'company', 'commercial', 'business', 'businesses', 'work truck', 'work trucks', 'dealership', 'dealer', 'dealerships'],
      reply: 'Yes! We detail company fleets and dealership inventory on-site with no disruption to your operations. ' + link('/book-now', 'Request a fleet quote') + ' or ' + callInline + '.' },
    { keys: ['semi', 'rig', 'cab', 'sleeper'],
      reply: 'We detail semi trucks: day cab, sleeper cab and full rigs, on-site. ' + link('/book-now', 'Get a quote') + ' or ' + callInline + '.' },
    { keys: ['boat', 'marine', 'jet ski', 'seadoo', 'sea-doo', 'rv', 'camper', 'watercraft'],
      reply: 'We detail boats, jet skis and RVs: exterior washing plus interior detailing. ' + link('/book-now', 'Get a quote') + ' or ' + callInline + '.' },
    { keys: ['suv', 'suvs', 'van', 'minivan', 'vans', 'pickup', 'sedan', 'ev', 'electric', 'tesla', 'luxury', 'exotic', 'new car', 'brand new', 'used car', 'sell', 'selling', 'lease', 'leased', 'vehicle type', 'vehicles', 'what vehicles', 'what cars', 'oversized', 'size'],
      reply: 'We detail all kinds of vehicles: daily drivers, SUVs, trucks, luxury &amp; collector cars, fleets, semis and boats. See examples in our ' + link('/gallary', 'gallery') + '. Final price depends on vehicle size &amp; condition. ' + callGeneral + ' Or ' + link('/book-now', 'get a custom quote') + '.' },

    { keys: ['price', 'prices', 'pricing', 'cost', 'costs', 'how much', 'rates', 'rate', 'package', 'packages', 'cheap', 'expensive', 'fee', 'fees', 'hidden fees', 'full detail', 'complete'],
      reply: '<strong>Popular packages</strong> (starting prices):<br>• Standard In &amp; Out: $100+<br>• Complete In &amp; Out: $199+<br>• Complete Plus: $349+<br>• Hand Wash, Wax &amp; Dry: $60+<br>Final price depends on vehicle size &amp; condition. ' + link('/services#pricing', 'See full pricing') + ' or ' + link('/book-now', 'get an exact quote') + '.' },

    // ── How it works / location ──
    { keys: ['area', 'areas', 'where', 'location', 'locations', 'located', 'city', 'cities', 'neighborhood', 'neighbourhood', 'mississauga', 'brampton', 'oakville', 'toronto', 'gta', 'travel', 'travel fee', 'come to', 'distance', 'serve', 'service area', 'near me', 'nearby', 'markham', 'burlington', 'milton', 'vaughan', 'etobicoke', 'scarborough'],
      reply: 'We\'re fully mobile and serve <strong>Mississauga, Brampton, Oakville and the Greater Toronto Area</strong>. We come to your home, office or lot. Not sure we cover you or about a travel fee? ' + callInline + '.' },
    { keys: ['mobile', 'water', 'power', 'electricity', 'bring', 'driveway', 'my house', 'my home', 'apartment', 'condo', 'garage', 'parking', 'underground', 'workplace', 'office', 'work', 'at home'],
      reply: 'We come to you: home, office or lot. Our units bring their own <strong>water and power</strong>, so you don\'t need to provide anything. For tight spots like apartment or underground garages, ' + callInline + ' so we can confirm.' },
    { keys: ['hour', 'hours', 'open', 'close', 'closed', 'weekend', 'saturday', 'sunday', 'when'],
      reply: 'Availability depends on the day, so the quickest way to confirm a time is to ' + link('/book-now', 'request a quote') + ' or ' + callInline + '.' },
    { keys: ['how long', 'duration', 'take', 'time does', 'long does'],
      reply: 'It depends on the package and vehicle. A standard detail is shorter, while paint correction and ceramic coating take longer. Tell us your vehicle &amp; package for an estimate: ' + link('/book-now', 'get a quote') + ' or ' + callInline + '.' },

    // ── Trust / info ──
    { keys: ['review', 'reviews', 'rating', 'ratings', 'trust', 'legit', 'reputation', 'testimonial', 'testimonials'],
      reply: 'We\'re rated <strong>5.0★ from 57 Google reviews</strong> and have detailed 2,000+ vehicles since 2021. ' + link('/#reviews', 'Read what customers say') + '.' },
    { keys: ['certified', 'certification', 'trained', 'experienced', 'installer', 'installers'],
      reply: 'We\'re <strong>certified ceramic coating installers</strong> (Nano-Brite &amp; System X) with 2,000+ vehicles detailed since 2021. ' + link('/about', 'More about us') + '.' },
    { keys: ['photo', 'photos', 'gallery', 'gallary', 'portfolio', 'example', 'examples', 'before and after', 'our work', 'pictures'],
      reply: 'See our recent work in the ' + link('/gallary', 'gallery') + '.' },
    { keys: ['phone', 'call', 'text', 'number', 'contact', 'email', 'reach', 'talk to', 'human', 'person', 'speak', 'owner', 'ryan', 'questions', 'question', 'help', 'support'],
      reply: 'You can reach us at ' + link(TEL, PHONE) + ' (call or text) or ' + link('mailto:Ryan@FiveStarMobileDetailing.ca', 'Ryan@FiveStarMobileDetailing.ca') + '. Or ' + link('/book-now', 'send a quote request') + '.' },

    // ── Generic section words (low priority) ──
    { low: true, keys: ['detailing', 'detail', 'details', 'detailed'],
      reply: '<strong>Detailing</strong> options:<br>• Standard In &amp; Out: $100+<br>• Complete In &amp; Out: $199+<br>• Complete Plus: $349+<br>• Interior only: $100+<br>' + link('/services#detailing', 'See Interior / Exterior Detailing') + ' · ' + link('/services#pricing', 'full pricing') + ' · ' + link('/book-now', 'get a quote') + '.' },
    { low: true, keys: ['service', 'services', 'offer', 'offers', 'do you do', 'what do you'],
      reply: 'We offer:<br>• Interior / exterior detailing<br>• Paint correction &amp; ceramic coating<br>• Fleet, dealership &amp; semi truck detailing<br>• Boat, marine &amp; RV detailing<br>• Add-ons &amp; vehicle services<br>' + link('/services', 'See all services') + '.' },
    { low: true, keys: ['about', 'about us', 'who are you', 'who', 'company info', 'story', 'since', 'history'],
      reply: 'Five Star Mobile Detailing has served the GTA since 2021, with 2,000+ vehicles detailed. ' + link('/about', 'More about us') + '.' },
    { low: true, keys: ['pricing page', 'ceramic coating page', 'paint', 'paintcorrection'],
      reply: 'See ' + link('/paintcorrection', 'Paint Correction &amp; Ceramic Coating') + ' or ' + link('/services#pricing', 'all pricing') + '.' }
  ];

  var FALLBACK = 'I\'m not sure about that one. 🤔 For specific inquiries, ' + callInline + ', or ' + bookLine.charAt(0).toLowerCase() + bookLine.slice(1);

  function normalize(s) { return ' ' + s.toLowerCase().replace(/[^a-z0-9\- ]/g, ' ').replace(/\s+/g, ' ').trim() + ' '; }

  function answer(text) {
    var t = normalize(text);
    var best = null, bestScore = 0;
    INTENTS.forEach(function (intent) {
      var score = 0;
      intent.keys.forEach(function (k) {
        if (t.indexOf(' ' + k + ' ') !== -1 || (!intent.exact && k.length > 4 && t.indexOf(k) !== -1)) score += k.length;
      });
      if (intent.low) score = score * 0.3;
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    return best ? best.reply : FALLBACK;
  }

  function init() {
    var root = document.createElement('div');
    root.className = 'fs-chat';
    root.innerHTML =
      '<button class="fs-chat-toggle" aria-label="Open chat" aria-expanded="false">' +
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
      '</button>' +
      '<div class="fs-chat-panel" role="dialog" aria-label="Chat with Five Star" hidden>' +
        '<div class="fs-chat-head"><div><strong>Five Star Assistant</strong><span>Ask about pricing, services &amp; booking</span></div>' +
        '<button class="fs-chat-close" aria-label="Close chat">&#x2715;</button></div>' +
        '<div class="fs-chat-body" aria-live="polite"></div>' +
        '<div class="fs-chat-quick"></div>' +
        '<form class="fs-chat-form"><input type="text" placeholder="Type a message..." aria-label="Message" autocomplete="off" maxlength="200" /><button type="submit" aria-label="Send">&#10148;</button></form>' +
      '</div>';
    document.body.appendChild(root);

    var toggle = root.querySelector('.fs-chat-toggle');
    var panel = root.querySelector('.fs-chat-panel');
    var body = root.querySelector('.fs-chat-body');
    var quick = root.querySelector('.fs-chat-quick');
    var form = root.querySelector('.fs-chat-form');
    var input = form.querySelector('input');
    var greeted = false;

    function add(html, who, asText) {
      var m = document.createElement('div');
      m.className = 'fs-msg fs-' + who;
      if (asText) m.textContent = html; else m.innerHTML = html;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
    }

    function botReply(text) {
      var typing = document.createElement('div');
      typing.className = 'fs-msg fs-bot fs-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;
      setTimeout(function () {
        typing.remove();
        add(answer(text), 'bot');
      }, 450);
    }

    function send(text) {
      text = text.trim();
      if (!text) return;
      add(text, 'user', true);
      botReply(text);
    }

    QUICK.forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = q;
      b.addEventListener('click', function () { send(q); });
      quick.appendChild(b);
    });

    function setOpen(open) {
      panel.hidden = !open;
      root.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        if (!greeted) {
          greeted = true;
          add('Hi! 👋 Welcome to Five Star Mobile Detailing. How can I help? For specific inquiries, you can always call or text us at <a href="' + TEL + '">' + PHONE + '</a>.', 'bot');
        }
        input.focus();
      }
    }

    toggle.addEventListener('click', function () { setOpen(panel.hidden); });
    root.querySelector('.fs-chat-close').addEventListener('click', function () { setOpen(false); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      send(input.value);
      input.value = '';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
