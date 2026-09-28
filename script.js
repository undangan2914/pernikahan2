document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. PERSONALISASI NAMA TAMU (URL Parameter ?to=Nama)
       ========================================================================== */
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to');
    const guestNameEl = document.getElementById('guest-name');
    
    if (guestParam && guestNameEl) {
        guestNameEl.textContent = guestParam.replace(/\+/g, ' ');
    }

    /* ==========================================================================
       2. BUKA UNDANGAN & AUTOPLAY AUDIO
       ========================================================================== */
    const openingOverlay = document.getElementById('opening-overlay');
    const mainContent = document.getElementById('main-content');
    const btnOpen = document.getElementById('btn-open-invitation');
    const bgMusic = document.getElementById('bg-music');
    const btnMusic = document.getElementById('btn-music');

    btnOpen.addEventListener('click', () => {
        openingOverlay.classList.add('fade-out');
        mainContent.classList.remove('hidden');

        // Play audio native HTML5
        if (bgMusic) {
            bgMusic.play().then(() => {
                btnMusic.classList.remove('paused');
                btnMusic.classList.add('playing');
            }).catch(err => console.log('Autoplay prevented:', err));
        }
    });

    btnMusic.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            btnMusic.classList.remove('paused');
            btnMusic.classList.add('playing');
        } else {
            bgMusic.pause();
            btnMusic.classList.add('paused');
            btnMusic.classList.remove('playing');
        }
    });

    /* ==========================================================================
       3. DARK / LIGHT MODE SWITCH & PERSISTENT STATE
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    const savedTheme = localStorage.getItem('invitation-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const activeTheme = htmlEl.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('invitation-theme', theme);
        themeToggleBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }

    /* ==========================================================================
       4. COUNTDOWN TIMER REAL-TIME
       ========================================================================== */
    const eventDate = new Date('2026-12-20T08:00:00+07:00').getTime();

    const timerDays = document.getElementById('timer-days');
    const timerHours = document.getElementById('timer-hours');
    const timerMinutes = document.getElementById('timer-minutes');
    const timerSeconds = document.getElementById('timer-seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            timerDays.textContent = '00';
            timerHours.textContent = '00';
            timerMinutes.textContent = '00';
            timerSeconds.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerDays.textContent = days < 10 ? '0' + days : days;
        timerHours.textContent = hours < 10 ? '0' + hours : hours;
        timerMinutes.textContent = minutes < 10 ? '0' + minutes : minutes;
        timerSeconds.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* ==========================================================================
       5. FLOATING PETALS GENERATOR
       ========================================================================== */
    const petalsContainer = document.getElementById('petals-container');
    const petalCount = 15;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        const size = Math.random() * 12 + 8; // 8px - 20px
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.animationDuration = `${Math.random() * 8 + 6}s`; // 6s - 14s
        petal.style.animationDelay = `${Math.random() * 5}s`;
        
        petalsContainer.appendChild(petal);
    }

    /* ==========================================================================
       6. SCROLL-TRIGGERED REVEAL ANIMATION (Intersection Observer)
       ========================================================================== */
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));

    /* ==========================================================================
       7. KALENDER INTEGRATION (.ics & Google Calendar)
       ========================================================================== */
    const btnCalendarDropdown = document.getElementById('btn-calendar-dropdown');
    const calendarMenu = document.getElementById('calendar-menu');
    const linkGcal = document.getElementById('link-gcal');
    const linkIcs = document.getElementById('link-ics');

    btnCalendarDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        calendarMenu.classList.add('hidden');
    });

    // Google Calendar Link
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=The+Wedding+of+Romeo+%26+Juliet&dates=20261220T010000Z/20261220T070000Z&details=Pernikahan+Romeo+%26+Juliet.+Kami+menunggu+kehadiran+Anda!&location=Grand+Ballroom+Hotel+Mulia,+Jakarta`;
    linkGcal.href = gCalUrl;

    // Download .ics File
    linkIcs.addEventListener('click', (e) => {
        e.preventDefault();
        const icsData = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Romeo Juliet Wedding//ID
BEGIN:VEVENT
SUMMARY:The Wedding of Romeo & Juliet
DESCRIPTION:Pernikahan Romeo & Juliet. Kami menunggu kehadiran Anda!
LOCATION:Grand Ballroom Hotel Mulia, Jakarta
DTSTART:20261220T080000
DTEND:20261220T140000
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Reminder: 1 jam sebelum pernikahan Romeo & Juliet
END:VALARM
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'romeo-juliet-wedding.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    /* ==========================================================================
       8. LIGHTBOX GALLERY FULLSCREEN
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentIndex = 0;

    galleryItems.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentIndex = index;
            showLightboxImage();
            lightbox.classList.remove('hidden');
        });
    });

    function showLightboxImage() {
        lightboxImg.src = galleryItems[currentIndex].src;
    }

    lightboxClose.addEventListener('click', () => lightbox.classList.add('hidden'));
    lightboxPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        showLightboxImage();
    });
    lightboxNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        showLightboxImage();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') lightbox.classList.add('hidden');
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
        }
    });

    /* ==========================================================================
       9. COPY TO CLIPBOARD & TOAST NOTIFICATION
       ========================================================================== */
    const toast = document.getElementById('toast');

    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2500);
    }

    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            let textToCopy = '';

            if (targetId === 'physical-gift-address') {
                textToCopy = 'Jl. Kebon Jeruk No. 12, Kebayoran Baru, Jakarta Selatan (UP: Romeo & Juliet - 08123456789)';
            } else {
                const targetEl = document.getElementById(targetId);
                textToCopy = targetEl ? targetEl.textContent.trim() : '';
            }

            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('Teks berhasil disalin!');
                }).catch(() => {
                    showToast('Gagal menyalin teks');
                });
            }
        });
    });

    const btnCopyAddress = document.getElementById('btn-copy-address');
    if (btnCopyAddress) {
        btnCopyAddress.addEventListener('click', () => {
            const address = btnCopyAddress.getAttribute('data-address');
            navigator.clipboard.writeText(address).then(() => {
                showToast('Alamat berhasil disalin!');
            });
        });
    }
});
