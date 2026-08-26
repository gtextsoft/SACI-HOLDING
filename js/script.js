// SACI Holdings — interactions

(function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const markReady = () => document.body.classList.add('is-ready');

    if (!preloader) {
        markReady();
        return;
    }

    const MIN_MS = 900;
    const MAX_MS = 2200;
    const started = Date.now();
    let hidden = false;

    const hide = () => {
        if (hidden) return;
        hidden = true;
        preloader.classList.add('fade-out');
        preloader.setAttribute('aria-hidden', 'true');
        markReady();
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 350);
    };

    const hideAfterMin = () => {
        setTimeout(hide, Math.max(0, MIN_MS - (Date.now() - started)));
    };

    if (document.readyState === 'complete') {
        hideAfterMin();
    } else {
        window.addEventListener('load', hideAfterMin, { once: true });
    }

    setTimeout(hide, MAX_MS);
})();

function loadLazyBackgrounds() {
    const apply = (el) => {
        const src = el.getAttribute('data-bg');
        if (!src) return;
        el.style.backgroundImage = `url("${src}")`;
        el.removeAttribute('data-bg');
    };

    const nodes = document.querySelectorAll('[data-bg]');
    if (!nodes.length) return;

    if (!('IntersectionObserver' in window)) {
        nodes.forEach(apply);
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            apply(entry.target);
            obs.unobserve(entry.target);
        });
    }, { rootMargin: '240px 0px' });

    nodes.forEach((el) => observer.observe(el));
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initMotion() {
    const reduced = prefersReducedMotion();
    const targets = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale, .media-clip, .fade-copy, .stagger-item, .draw-rule, .sector-tile, .caption-slide, .line-rise'
    );

    if (reduced) {
        targets.forEach((el) => {
            el.classList.add('is-in', 'active');
        });
        document.body.classList.add('is-ready');
        return;
    }

    if (!('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-in', 'active'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in', 'active');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    targets.forEach((el) => observer.observe(el));
}

function animateCount(el, target, prefix, suffix, duration) {
    const start = performance.now();
    const isFloat = !Number.isInteger(target);

    const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = target * eased;
        const shown = isFloat ? current.toFixed(0) : Math.round(current);
        el.textContent = `${prefix}${shown}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = el.dataset.countFinal || `${prefix}${shown}${suffix}`;
    };

    requestAnimationFrame(tick);
}

function initStatCounts() {
    const nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;

    const run = (el) => {
        if (el.dataset.counted) return;
        el.dataset.counted = '1';
        if (prefersReducedMotion()) {
            el.textContent = el.getAttribute('data-count-display') || el.getAttribute('data-count');
            return;
        }
        const raw = el.getAttribute('data-count') || '0';
        const display = el.getAttribute('data-count-display') || raw;
        el.dataset.countFinal = display.replace(/[^\d.+]/g, '') ? display : raw;
        const numeric = parseFloat(raw.replace(/[^\d.]/g, '')) || 0;
        const prefix = display.match(/^[^\d]*/)?.[0] || '';
        const suffix = display.replace(prefix, '').replace(/[\d.,]+/, '') || '';
        animateCount(el, numeric, prefix, suffix, 900);
    };

    if (!('IntersectionObserver' in window)) {
        nodes.forEach(run);
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            run(entry.target);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.4 });

    nodes.forEach((el) => observer.observe(el));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLazyBackgrounds);
} else {
    loadLazyBackgrounds();
}

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    const handleScroll = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (menuToggle && navLinks) {
        const backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.hidden = true;
        document.body.appendChild(backdrop);

        const setMenu = (open) => {
            menuToggle.classList.toggle('active', open);
            navLinks.classList.toggle('active', open);
            backdrop.hidden = !open;
            document.body.classList.toggle('menu-open', open);
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            document.body.style.overflow = open ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('active')));
        backdrop.addEventListener('click', () => setMenu(false));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navLinks.classList.contains('active')) {
                setMenu(false);
            }
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setMenu(false));
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
                setMenu(false);
            }
        });
    }

    initMotion();
    initStatCounts();

    const pathname = window.location.pathname;
    const pathSegments = pathname.replace(/\/$/, '').split('/').filter(Boolean);
    const currentPath = pathSegments[pathSegments.length - 1] || 'index.html';
    const isCommunityPage = pathname === '/community' || pathname === '/community/' || pathname.startsWith('/community/');
    document.querySelectorAll('.nav-links a').forEach((link) => {
        const href = link.getAttribute('href') || '';
        const isCommunityLink = href === '/community/' || href.endsWith('community/');
        const isActive = isCommunityLink
            ? isCommunityPage
            : (href === currentPath || href === currentPath + '.html' || href.endsWith('/' + currentPath));
        link.classList.toggle('active', isActive);
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            e.preventDefault();
            window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
        });
    });

    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('visible', window.pageYOffset > 500);
        }, { passive: true });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const communityForm = document.getElementById('community-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    const volunteerForm = document.getElementById('volunteer-form');
    const volunteerSuccess = document.getElementById('volunteer-success');
    const volunteerSubmitBtn = document.getElementById('volunteer-submit');

    const hasDangerousChars = (value) => {
        if (!value) return false;
        return /[<>`{}]/.test(value);
    };

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');

    const isValidPhone = (value) => {
        if (!value) return true;
        return /^[0-9+\-\s().]{6,30}$/.test(value);
    };

    if (communityForm) {
        communityForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Submitting...';
            }

            const formValues = {
                role: communityForm.elements['role']?.value?.trim() || '',
                stage: communityForm.elements['stage']?.value?.trim() || '',
                industry: communityForm.elements['industry']?.value?.trim() || '',
                name: communityForm.elements['name']?.value?.trim() || '',
                email: communityForm.elements['email']?.value?.trim() || '',
                phone: communityForm.elements['phone']?.value?.trim() || '',
                location: communityForm.elements['location']?.value?.trim() || '',
            };

            if (!formValues.role || !formValues.industry || !formValues.name || !formValues.email) {
                alert('Please fill in all required fields.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Submit';
                }
                return;
            }

            const communityFieldsToCheck = ['name', 'email', 'phone', 'location'];
            for (const field of communityFieldsToCheck) {
                if (hasDangerousChars(formValues[field])) {
                    alert('Please remove special characters like <, >, {, } or backticks from your input.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = 'Submit';
                    }
                    return;
                }
            }

            if (!isValidEmail(formValues.email)) {
                alert('Please enter a valid email address.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Submit';
                }
                return;
            }

            if (!isValidPhone(formValues.phone)) {
                alert('Please enter a valid phone number (digits, spaces, +, -, (, ) only).');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Submit';
                }
                return;
            }

            const formData = new FormData(communityForm);

            try {
                const response = await fetch(communityForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { Accept: 'application/json' }
                });

                if (response.ok) {
                    communityForm.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.style.display = 'block';
                        formSuccess.classList.add('active', 'is-in');
                    }
                    window.scrollTo({ top: communityForm.offsetTop - 100, behavior: 'smooth' });
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data.errors.map((error) => error.message).join(', '));
                    } else {
                        alert('There was a problem submitting your form. Please try again.');
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = 'Submit';
                    }
                }
            } catch (error) {
                alert('There was a problem submitting your form. Please check your connection.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Submit';
                }
            }
        });
    }

    if (volunteerForm) {
        volunteerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (volunteerSubmitBtn) {
                volunteerSubmitBtn.disabled = true;
                volunteerSubmitBtn.innerText = 'Submitting...';
            }

            const vValues = {
                full_name: volunteerForm.elements['full_name']?.value?.trim() || '',
                location: volunteerForm.elements['location']?.value?.trim() || '',
                availability: volunteerForm.elements['availability']?.value?.trim() || '',
                background_experience: volunteerForm.elements['background_experience']?.value?.trim() || '',
                vc_pe_comfortable: volunteerForm.elements['vc_pe_comfortable']?.value || '',
                email: volunteerForm.elements['email']?.value?.trim() || '',
                phone: volunteerForm.elements['phone']?.value?.trim() || '',
            };

            if (!vValues.full_name || !vValues.location || !vValues.availability || !vValues.background_experience || !vValues.vc_pe_comfortable || !vValues.email) {
                alert('Please fill in all required fields.');
                if (volunteerSubmitBtn) {
                    volunteerSubmitBtn.disabled = false;
                    volunteerSubmitBtn.innerText = 'Submit Application';
                }
                return;
            }

            const volunteerFieldsToCheck = ['full_name', 'location', 'availability', 'background_experience', 'email', 'phone'];
            for (const field of volunteerFieldsToCheck) {
                if (hasDangerousChars(vValues[field])) {
                    alert('Please remove special characters like <, >, {, } or backticks from your input.');
                    if (volunteerSubmitBtn) {
                        volunteerSubmitBtn.disabled = false;
                        volunteerSubmitBtn.innerText = 'Submit Application';
                    }
                    return;
                }
            }

            if (!isValidEmail(vValues.email)) {
                alert('Please enter a valid email address.');
                if (volunteerSubmitBtn) {
                    volunteerSubmitBtn.disabled = false;
                    volunteerSubmitBtn.innerText = 'Submit Application';
                }
                return;
            }

            if (!isValidPhone(vValues.phone)) {
                alert('Please enter a valid phone number (digits, spaces, +, -, (, ) only).');
                if (volunteerSubmitBtn) {
                    volunteerSubmitBtn.disabled = false;
                    volunteerSubmitBtn.innerText = 'Submit Application';
                }
                return;
            }

            const vFormData = new FormData(volunteerForm);

            try {
                const response = await fetch(volunteerForm.action, {
                    method: 'POST',
                    body: vFormData,
                    headers: { Accept: 'application/json' }
                });

                if (response.ok) {
                    volunteerForm.style.display = 'none';
                    if (volunteerSuccess) {
                        volunteerSuccess.style.display = 'block';
                        volunteerSuccess.classList.add('active', 'is-in');
                    }
                    window.scrollTo({ top: volunteerForm.offsetTop - 100, behavior: 'smooth' });
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data.errors.map((error) => error.message).join(', '));
                    } else {
                        alert('There was a problem submitting your form. Please try again.');
                    }
                    if (volunteerSubmitBtn) {
                        volunteerSubmitBtn.disabled = false;
                        volunteerSubmitBtn.innerText = 'Submit Application';
                    }
                }
            } catch (error) {
                alert('There was a problem submitting your form. Please check your connection.');
                if (volunteerSubmitBtn) {
                    volunteerSubmitBtn.disabled = false;
                    volunteerSubmitBtn.innerText = 'Submit Application';
                }
            }
        });
    }
});
