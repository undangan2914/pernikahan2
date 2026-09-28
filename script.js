document.addEventListener('DOMContentLoaded', () => {
  // ==================== ELEMENTS ====================
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelope = document.querySelector('.envelope');
  const openBtn = document.getElementById('open-invitation');
  const mainContent = document.getElementById('main-content');
  const musicBtn = document.getElementById('music-btn');
  const bgMusic = document.getElementById('bg-music');
  const themeToggle = document.getElementById('theme-toggle');
  const guestNameEl = document.getElementById('guest-name');
  const calendarBtn = document.getElementById('calendar-btn');
  const calendarDropdown = document.getElementById('calendar-dropdown');
  const copyAddressBtn = document.getElementById('copy-address');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const petalsContainer = document.getElementById('petals-container');

  let currentImageIndex = 0;
  let isMusicPlaying = false;
  const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

  // ==================== PERSONALISasi NAMA ====================
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  if (guestName) {
    guestNameEl.textContent = `Kepada Yth. ${decodeURIComponent(guestName.replace(/\+/g, ' '))}`;
  }

  // ==================== THEME ====================
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  updateThemeIcon();

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next === 'dark' ? null : 'light');
    if (next === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.querySelector('.icon-sun').classList.toggle('hidden', isLight);
    document.querySelector('.icon-moon').classList.toggle('hidden', !isLight);
  }

  // ==================== OPEN ENVELOPE ====================
  openBtn.addEventListener('click', () => {
    envelope.classList.add('opened');
    
    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      mainContent.classList.remove('hidden');
      mainContent.classList.add('visible');
      
      // Start music
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        updateMusicIcon();
      }).catch(() => {});

      // Start petals
      createPetals();
      
      // Trigger hero animation
      document.querySelector('.hero').classList.add('visible');
    }, 900);
  });

  // ==================== MUSIC ====================
  musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      isMusicPlaying = false;
    } else {
      bgMusic.play();
      isMusicPlaying = true;
    }
    updateMusicIcon();
  });

  function updateMusicIcon() {
    document.querySelector('.icon-play').classList.toggle('hidden', isMusicPlaying);
    document.querySelector('.icon-pause').classList.toggle('hidden', !isMusicPlaying);
  }

  // ==================== COUNTDOWN ====================
  const targetDate = new Date('2026-12-21T10:00:00+07:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==================== COPY TO CLIPBOARD ====================
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-rek');
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = 'Tersalin!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        alert('Gagal menyalin');
      }
    });
  });

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('Jl. Contoh No. 123, Yogyakarta');
        const original = copyAddressBtn.innerHTML;
        copyAddressBtn.innerHTML = '✓ Tersalin';
        setTimeout(() => {
          copyAddressBtn.innerHTML = original;
        }, 2000);
      } catch (err) {}
    });
  }

  // ==================== CALENDAR ====================
  calendarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    calendarDropdown.classList.add('hidden');
  });

  // Google Calendar
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan%20Arga%20%26%20Larasati&dates=20261221T030000Z/20261221T070000Z&details=Akad%20%26%20Resepsi%20Pernikahan&location=Yogyakarta`;
  document.getElementById('google-calendar').href = googleCalUrl;

  // ICS Download
  document.getElementById('download-ics').addEventListener('click', (e) => {
    e.preventDefault();
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20261221T030000Z
DTEND:20261221T070000Z
SUMMARY:Pernikahan Arga & Larasati
DESCRIPTION:Akad & Resepsi Pernikahan
LOCATION:Yogyakarta
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pernikahan-arga-larasati.ics';
    a.click();
    URL.revokeObjectURL(url);
  });

  // ==================== GALLERY & LIGHTBOX ====================
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentImageIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    lightboxImg.src = images[currentImageIndex];
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-prev').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentImageIndex];
  });
  document.querySelector('.lightbox-next').addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImg.src = images[currentImageIndex];
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      lightboxImg.src = images[currentImageIndex];
    }
    if (e.key === 'ArrowRight') {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      lightboxImg.src = images[currentImageIndex];
    }
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ==================== SCROLL REVEAL ====================
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));

  // ==================== FLOATING PETALS ====================
  function createPetals() {
    setInterval(() => {
      if (document.hidden) return;
      
      const petal = document.createElement('div');
      petal.classList.add('petal');
      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.animationDuration = (Math.random() * 4 + 6) + 's';
      petal.style.width = petal.style.height = (Math.random() * 8 + 8) + 'px';
      petal.style.opacity = Math.random() * 0.3 + 0.15;
      
      petalsContainer.appendChild(petal);
      
      setTimeout(() => petal.remove(), 10000);
    }, 400);
  }
});
