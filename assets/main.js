    /* Video playback */
    const video = document.getElementById('hero-video');
    if (video) {
      video.addEventListener('loadedmetadata', () => { video.playbackRate = 0.8; });
      video.playbackRate = 0.8;
    }

    /* Navbar scroll state */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    /* Mobile menu */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
    });
    closeMenu.addEventListener('click', closeMobileMenu);
    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    /* Pricing tabs */
    document.querySelectorAll('.pricing-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pricing-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.pricing-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
      });
    });

    /* GSAP entrance + scroll reveal */
    gsap.registerPlugin(ScrollTrigger);

    if (document.getElementById('hero')) {
      const heroTl = gsap.timeline({ delay: .2 });
      heroTl
        .to('#heroLogo', { opacity: 1, y: 0, scale: 1, duration: .9, ease: 'power3.out' })
        .to('#heroHeadline', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, '-=.5')
        .to('#heroSub', { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, '-=.5')
        .to('#heroBody', { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, '-=.5')
        .to('#heroBtns', { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, '-=.45')
        .to('#heroTrust', { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, '-=.45');

      gsap.to('.hero-video-wrap', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
      });

      gsap.to('.hero-content', {
        opacity: 0, y: -40,
        scrollTrigger: { trigger: '#hero', start: '30% top', end: 'bottom top', scrub: true }
      });
    }

    document.querySelectorAll('[data-reveal]').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: .8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    /* Quote form — AJAX submit to Formspree, inline success/error, no page navigation */
    document.querySelectorAll('.quote-form').forEach(form => {
      const box = form.closest('.quote-form-box') || form.parentElement;
      const successEl = box.querySelector('.quote-form-success');
      const errorEl = form.querySelector('.form-error-msg');
      const submitBtn = form.querySelector('button[type="submit"]');
      const submitLabel = submitBtn ? submitBtn.textContent : '';

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (errorEl) errorEl.classList.remove('show');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

        try {
          const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
          });

          if (res.ok) {
            form.hidden = true;
            if (successEl) successEl.hidden = false;
          } else {
            const data = await res.json().catch(() => null);
            const msg = data && data.errors && data.errors.length
              ? data.errors.map(err => err.message).join(', ')
              : 'Something went wrong — please try again or call/text us at 437-345-0034.';
            if (errorEl) { errorEl.querySelector('span').textContent = msg; errorEl.classList.add('show'); }
          }
        } catch (err) {
          if (errorEl) {
            errorEl.querySelector('span').textContent = 'Something went wrong — please check your connection and try again, or call/text us at 437-345-0034.';
            errorEl.classList.add('show');
          }
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
        }
      });
    });

    document.querySelectorAll('.quote-form-reset').forEach(btn => {
      btn.addEventListener('click', () => {
        const successEl = btn.closest('.quote-form-success');
        const box = successEl.closest('.quote-form-box') || successEl.parentElement;
        const form = box.querySelector('.quote-form');
        if (form) { form.reset(); form.hidden = false; }
        successEl.hidden = true;
      });
    });
