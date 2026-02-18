// Saci Holdings - Premium VC Interactions

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Intersection Observer for Reveal Animations
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Parallax Effect for Images
    const parallaxImages = document.querySelectorAll('.visual-image');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxImages.forEach(img => {
            const parent = img.parentElement;
            const speed = 0.2;
            const rect = parent.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(rect.top * speed);
                img.style.transform = `scale(1.1) translateY(${yPos}px)`;
            }
        });
    });

    // 4. Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 6. Magnetic Effect for Buttons (Subtle)
    const magneticBtns = document.querySelectorAll('.btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });
    });
    // 7. Countdown Timer
    const countdownTarget = new Date();
    countdownTarget.setDate(countdownTarget.getDate() + 15); // 15 days from now

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownTarget.getTime() - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const dayEl = document.querySelector('.countdown-item:nth-child(1) .countdown-number');
        const hourEl = document.querySelector('.countdown-item:nth-child(2) .countdown-number');
        const minEl = document.querySelector('.countdown-item:nth-child(3) .countdown-number');
        const secEl = document.querySelector('.countdown-item:nth-child(4) .countdown-number');

        if (dayEl) dayEl.innerText = days.toString().padStart(2, '0');
        if (hourEl) hourEl.innerText = hours.toString().padStart(2, '0');
        if (minEl) minEl.innerText = minutes.toString().padStart(2, '0');
        if (secEl) secEl.innerText = seconds.toString().padStart(2, '0');
    };

    if (document.querySelector('.countdown-container')) {
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // 8. Hero Image Slider
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 5000; // 5 seconds per slide

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        setInterval(nextSlide, slideInterval);
    }
});
