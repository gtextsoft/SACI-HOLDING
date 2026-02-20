// Saci Holdings - Premium VC Interactions

document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }
    });

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
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Enhanced Parallax Effect
    const parallaxElements = document.querySelectorAll('.featured-image-bg, .visual-card, .pillar-img img, .globe-image-container img');

    const handleParallax = () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            const parent = el.parentElement;
            const speed = 0.15;
            const rect = parent.getBoundingClientRect();

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (rect.top * speed);
                // Handle both img tags and background-images
                if (el.tagName === 'IMG') {
                    el.style.transform = `scale(1.1) translateY(${yPos}px)`;
                } else {
                    el.style.backgroundPositionY = `${50 + (yPos * 0.1)}%`;
                }
            }
        });
    };
    window.addEventListener('scroll', handleParallax);

    // 3.5 Auto-Active Navbar Links
    const pathname = window.location.pathname;
    const pathSegments = pathname.replace(/\/$/, '').split('/').filter(Boolean);
    const currentPath = pathSegments[pathSegments.length - 1] || 'index.html';
    const isCommunityPage = pathname === '/community' || pathname === '/community/' || pathname.startsWith('/community/');
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href') || '';
        const isCommunityLink = href === '/community/' || href.endsWith('community/');
        const isActive = isCommunityLink ? isCommunityPage : (href === currentPath || href === currentPath + '.html');
        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
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
    countdownTarget.setDate(countdownTarget.getDate() + 24); // 24 days from now - UNTIL LAUNCH

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

    // 8.5. Trust Strip Carousel (Mobile)
    const trustCarousel = document.querySelector('.trust-carousel');
    const trustItems = document.querySelectorAll('.trust-item');
    const trustDotsContainer = document.querySelector('.trust-carousel-dots');
    
    if (trustCarousel && trustItems.length > 0 && window.innerWidth <= 768) {
        let currentTrustSlide = 0;
        let touchStartX = 0;
        let touchEndX = 0;
        let autoSlideInterval;

        // Create dots
        trustItems.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `trust-carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToTrustSlide(index));
            trustDotsContainer.appendChild(dot);
        });

        const goToTrustSlide = (index) => {
            currentTrustSlide = index;
            const translateX = -(index * 100) / trustItems.length;
            trustCarousel.style.transform = `translateX(${translateX}%)`;
            
            // Update active dot
            trustDotsContainer.querySelectorAll('.trust-carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        // Auto-slide functionality
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                currentTrustSlide = (currentTrustSlide + 1) % trustItems.length;
                goToTrustSlide(currentTrustSlide);
            }, 4000); // 4 seconds per slide
        };

        const stopAutoSlide = () => {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        };

        // Touch/swipe support
        trustCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        });

        trustCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    currentTrustSlide = (currentTrustSlide + 1) % trustItems.length;
                } else {
                    // Swipe right - previous slide
                    currentTrustSlide = (currentTrustSlide - 1 + trustItems.length) % trustItems.length;
                }
                goToTrustSlide(currentTrustSlide);
            }
        };

        // Initialize
        goToTrustSlide(0);
        startAutoSlide();

        // Pause on hover (if mouse/touch device)
        trustCarousel.addEventListener('mouseenter', stopAutoSlide);
        trustCarousel.addEventListener('mouseleave', startAutoSlide);

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    stopAutoSlide();
                    trustCarousel.style.transform = 'none';
                } else {
                    goToTrustSlide(currentTrustSlide);
                    startAutoSlide();
                }
            }, 250);
        });
    }

    // 9. Community Form Submission (AJAX)
    const communityForm = document.getElementById('community-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    if (communityForm) {
        communityForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Disable button and show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Submitting...';
            }

            const formData = new FormData(communityForm);

            try {
                const response = await fetch(communityForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success: Hide form and show success message with WhatsApp button
                    communityForm.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.style.display = 'block';
                        // Trigger reveal for success message
                        formSuccess.classList.add('active');
                    }
                    window.scrollTo({
                        top: communityForm.offsetTop - 100,
                        behavior: 'smooth'
                    });
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert("Oops! There was a problem submitting your form. Please try again.");
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = 'Submit';
                    }
                }
            } catch (error) {
                alert("Oops! There was a problem submitting your form. Please check your connection.");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Submit';
                }
            }
        });
    }
});
