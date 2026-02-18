// Saci Holdings - Main Script

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simple fade-in animation on scroll (optional enhancement)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Apply to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-section'); // Add CSS class for transition if needed
        observer.observe(section);
    });

    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top when clicked
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Typing Effect Function
    function typeWriter(element, text, speed = 50, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                element.textContent = '';
                element.style.opacity = '1';
                element.classList.add('typing-cursor');
                let i = 0;
                
                function type() {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, speed);
                    } else {
                        element.classList.remove('typing-cursor');
                        resolve();
                    }
                }
                type();
            }, delay);
        });
    }

    // Typing Effect with HTML preservation
    function typeWriterWithHTML(element, speed = 50, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const originalHTML = element.innerHTML;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = originalHTML;
                const plainText = tempDiv.textContent || tempDiv.innerText || '';
                
                element.innerHTML = '';
                element.style.opacity = '1';
                element.classList.add('typing-cursor');
                let i = 0;
                
                function type() {
                    if (i < plainText.length) {
                        element.textContent = plainText.substring(0, i + 1);
                        i++;
                        setTimeout(type, speed);
                    } else {
                        element.classList.remove('typing-cursor');
                        // Restore original HTML after typing completes
                        element.innerHTML = originalHTML;
                        resolve();
                    }
                }
                type();
            }, delay);
        });
    }

    // Initialize typing effects on page load - ONLY for hero section
    function initTypingEffects() {
        // Only apply typing effect to hero section elements for maximum impact
        // Hero title typing effect (preserve HTML)
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            typeWriterWithHTML(heroTitle, 30, 300);
        }

        // Hero subtitle typing effect
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            const originalText = heroSubtitle.textContent;
            heroSubtitle.style.opacity = '0';
            typeWriter(heroSubtitle, originalText, 40, 100);
        }

        // Hero description typing effect
        const heroDesc = document.querySelector('.hero-desc');
        if (heroDesc) {
            const originalText = heroDesc.textContent;
            heroDesc.style.opacity = '0';
            typeWriter(heroDesc, originalText, 20, 800);
        }
    }

    // Countdown Timer
    function initCountdown() {
        const countdownElement = document.getElementById('launchCountdown');
        if (!countdownElement) return;

        // Set launch date to 12 days from now to simulate the "Until Launch" state
        const launchDate = new Date();
        launchDate.setDate(launchDate.getDate() + 12);
        launchDate.setHours(launchDate.getHours() + 3);
        launchDate.setMinutes(0);
        launchDate.setSeconds(11);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = launchDate.getTime() - now;

            if (distance < 0) {
                daysEl.innerText = "00";
                hoursEl.innerText = "00";
                minutesEl.innerText = "00";
                secondsEl.innerText = "00";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if(daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
            if(hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
            if(minutesEl) minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
            if(secondsEl) secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    initCountdown();

    // Run typing effects when page loads
    initTypingEffects();
});
