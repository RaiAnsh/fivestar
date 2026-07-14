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
