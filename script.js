document.addEventListener('DOMContentLoaded', () => {
  const config = window.APP_CONFIG;

  // 1. POPULATE CONFIG DATA
  document.querySelectorAll('.family-name').forEach(el => el.textContent = config.familyName);
  document.getElementById('venueAddressText').textContent = config.venueAddress;
  document.getElementById('mapIframe').src = config.googleMapsEmbedUrl;
  document.getElementById('getDirectionsBtn').href = config.googleMapsUrl;
  
  // RSVP Buttons
  const encodedMessage = encodeURIComponent(`Hi ${config.hostNames},\n\nI would love to attend your Housewarming Ceremony on ${config.eventDateString}!`);
  const maybeMessage = encodeURIComponent(`Hi ${config.hostNames},\n\nThank you for the invitation! I will try my best to attend and will confirm soon.`);
  const noMessage = encodeURIComponent(`Hi ${config.hostNames},\n\nThank you for the invitation. Unfortunately, I won't be able to make it, but sending my best wishes!`);
  
  document.getElementById('btnRsvpYes').href = `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;
  document.getElementById('btnRsvpMaybe').href = `https://wa.me/${config.whatsappNumber}?text=${maybeMessage}`;
  document.getElementById('btnRsvpNo').href = `https://wa.me/${config.whatsappNumber}?text=${noMessage}`;

  // 2. ENVELOPE OPENING ANIMATION SEQUENCE
  const btnOpenEnvelope = document.getElementById('btnOpenEnvelope');
  const envelopeScene = document.getElementById('envelopeScene');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSeal = document.getElementById('waxSeal');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const invitationCardInside = document.getElementById('invitationCardInside');
  
  const mainInvitation = document.getElementById('mainInvitation');

  function createParticles() {
    const container = document.getElementById('particles-container');
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 15 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${100 + Math.random() * 20}vh`;
      
      const duration = Math.random() * 3 + 4;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      
      container.appendChild(particle);
    }
  }

  btnOpenEnvelope.addEventListener('click', () => {
    // Hide button
    btnOpenEnvelope.style.opacity = '0';
    btnOpenEnvelope.style.pointerEvents = 'none';

    // 1. Envelope moves towards user
    envelopeWrapper.classList.add('scale-up');
    
    // 2. Break wax seal & open flap
    setTimeout(() => {
      waxSeal.classList.add('break');
      envelopeFlap.classList.add('open');
    }, 800);

    // 3. Card slides out
    setTimeout(() => {
      invitationCardInside.classList.add('slide-out');
    }, 2000);

    // 4. Burst particles
    setTimeout(() => {
      createParticles();
    }, 3500);

    // 5. Fade out envelope scene, reveal main site, scroll up
    setTimeout(() => {
      envelopeScene.style.opacity = '0';
      mainInvitation.classList.remove('hidden');
      window.scrollTo(0, 0);
      
      setTimeout(() => {
        envelopeScene.style.display = 'none';
        
        // Trigger initial intersection observer elements
        document.querySelectorAll('.scene').forEach(el => {
          const rect = el.getBoundingClientRect();
          if(rect.top < window.innerHeight) el.classList.add('visible');
        });
        
        // Trigger sequence text in hero
        document.getElementById('scene1').classList.add('visible');
      }, 2000);
    }, 4500);
  });

  // 4. INTERSECTION OBSERVER FOR CINEMATIC SCROLLING
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scene, .reveal').forEach(el => observer.observe(el));

  // 5. COUNTDOWN TIMER
  const targetDate = new Date(config.countdownTarget).getTime();
  const cdInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(cdInterval);
      document.getElementById('countdownActive').classList.add('hidden');
      document.getElementById('countdownFinished').classList.remove('hidden');
      return;
    }

    document.getElementById('cd-days').textContent = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById('cd-hours').textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById('cd-minutes').textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById('cd-seconds').textContent = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
  }, 1000);

  // 6. ULTRA-PREMIUM INTERACTIVE EFFECTS
  
  // A. Magical Custom Cursor & Trail
  const cursor = document.getElementById('customCursor');
  const cursorTrail = document.getElementById('cursorTrail');
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor update
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Smooth trail animation using RequestAnimationFrame
  function animateTrail() {
    // Lerp (Linear Interpolation) for smooth following
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    
    cursorTrail.style.left = `${trailX}px`;
    cursorTrail.style.top = `${trailY}px`;
    
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // B. Magnetic / Hover Effects for Buttons
  const interactiveElements = document.querySelectorAll('a, button, .rsvp-btn');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorTrail.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursorTrail.classList.remove('hovering');
      el.style.transform = ''; // reset magnetic if applied
    });
    
    // Magnetic pull effect
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull button slightly towards mouse
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
  });

  // C. 3D Mouse-Move Parallax Tilt
  const tiltElements = [document.getElementById('envelopeWrapper'), document.getElementById('houseIllustration')];
  
  document.addEventListener('mousemove', (e) => {
    const xPos = (e.clientX / window.innerWidth) - 0.5;
    const yPos = (e.clientY / window.innerHeight) - 0.5;
    
    tiltElements.forEach(el => {
      if(el && !el.classList.contains('scale-up')) { // don't tilt if animating
        // Tilt up to 15 degrees based on mouse position
        el.style.transform = `rotateY(${xPos * 30}deg) rotateX(${-yPos * 30}deg)`;
      }
    });
  });

});
