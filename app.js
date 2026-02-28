/**
 * AI Nexus | Core Logic & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initMagneticButtons();
    initParticleSystem();
    initScrollAnimations();
    initPageTransitions();
    initHeaderScroll();
    initHexagonInteractions();
    initSimulatedCode();
    initStatsCounters();
    initPromoCountdown();
    initPartnerLogs();
    initHeadingVibrations();
    initGSAPAndThree();
});

/* =========================================================================
   1. Custom Liquid Cursor
   ========================================================================= */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');

    // Check for touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediate update for the dot
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    // Smooth follow for the outer ring using requestAnimationFrame
    function animateCursor() {
        let dx = mouseX - cursorX;
        let dy = mouseY - cursorY;

        cursorX += dx * 0.15; // Ease factor
        cursorY += dy * 0.15;

        follower.style.left = `${cursorX}px`;
        follower.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states for interactive elements
    const hoverElements = document.querySelectorAll('a, button, .magnetic-hover, .hex-inner, .orb-core');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
            cursor.style.transform = `translate(-50%, -50%) scale(1)`;
        });
    });

    // 3D Core Reaction
    const orb = document.querySelector('.ai-heart-orb');
    if (orb) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.clientX) / 25;
            const yAxis = (window.innerHeight / 2 - e.clientY) / 25;
            orb.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
    }
}

/* =========================================================================
   2. Magnetic Buttons & 360-Degree Click Ripple
   ========================================================================= */
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic-btn, .magnetic-hover');

    magneticElements.forEach(el => {
        // Magnetic Pull
        el.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const h = rect.width / 2;
            const w = rect.height / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - w;

            // Subtle pull
            const pullX = x * 0.3;
            const pullY = y * 0.3;

            this.style.transform = `translate(${pullX}px, ${pullY}px)`;

            const textSpan = this.querySelector('span');
            if (textSpan) {
                textSpan.style.transform = `translate(${pullX * 0.5}px, ${pullY * 0.5}px)`;
            }
        });

        el.addEventListener('mouseleave', function () {
            this.style.transform = `translate(0px, 0px)`;
            const textSpan = this.querySelector('span');
            if (textSpan) {
                textSpan.style.transform = `translate(0px, 0px)`;
            }
        });

        // 360-Degree Rotation & Ripple on Click
        if (this.classList.contains('magnetic-btn') || this.classList.contains('hex-inner')) {
            this.addEventListener('click', function (e) {
                // Prevent interfering with navigation immediately
                if (this.tagName.toLowerCase() === 'a' && this.getAttribute('href').startsWith('#')) {
                    // Let navigation handle it
                } else if (this.tagName.toLowerCase() === 'a') {
                    e.preventDefault();
                    setTimeout(() => { window.location = this.getAttribute('href'); }, 800);
                }

                // Add Ripple Pulse
                this.classList.remove('btn-clicked');
                void this.offsetWidth; // Trigger reflow
                this.classList.add('btn-clicked');

                // Add Dynamic internal Wave Pulse
                if (window.getComputedStyle(this).position === 'static') {
                    this.style.position = 'relative';
                }
                const wave = document.createElement('div');
                wave.className = 'wave-pulse';
                this.appendChild(wave);
                setTimeout(() => wave.remove(), 1000);

                // 360 Rotation
                this.classList.add('rotating');
                this.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                this.style.transform = `rotateY(360deg)`;

                setTimeout(() => {
                    this.classList.remove('rotating');
                    this.style.transition = 'var(--transition-fast)';
                    this.style.transform = `translate(0px, 0px) rotateY(0deg)`;
                }, 800);
            });
        }
    });
}

/* =========================================================================
   3. Background-Aware Dynamic Particle System
   ========================================================================= */
function initParticleSystem() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const particleCount = 40;
    const particles = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'particle';

        // Random properties
        const size = Math.random() * 4 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const opacity = Math.random() * 0.4 + 0.1;

        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.opacity = opacity;

        // Custom attributes for animation
        p.dataset.speedX = (Math.random() - 0.5) * 0.5;
        p.dataset.speedY = (Math.random() - 0.5) * 0.5;
        p.dataset.x = x;
        p.dataset.y = y;
        p.dataset.depth = Math.random() * 3 + 1; // For parallax depth

        container.appendChild(p);
        particles.push(p);
    }

    // Mouse interaction parallax variables
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation loop
    function animateParticles() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        // Calculate mouse offset from center (-1 to 1)
        const mouseOffX = (mouseX / w) * 2 - 1;
        const mouseOffY = (mouseY / h) * 2 - 1;

        particles.forEach(p => {
            let x = parseFloat(p.dataset.x);
            let y = parseFloat(p.dataset.y);
            const depth = parseFloat(p.dataset.depth);

            // Float movement
            x += parseFloat(p.dataset.speedX);
            y += parseFloat(p.dataset.speedY);

            // Screen wrap
            if (x < -10) x = w + 10;
            if (x > w + 10) x = -10;
            if (y < -10) y = h + 10;
            if (y > h + 10) y = -10;

            p.dataset.x = x;
            p.dataset.y = y;

            // Apply parallax based on mouse position and depth
            const parallaxX = mouseOffX * depth * 15;
            const parallaxY = mouseOffY * depth * 15;

            p.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

/* =========================================================================
   4. Scroll Animations (Text Reveal & Header)
   ========================================================================= */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-text, .type-writer-text');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));

    // Fallback: force reveal all items within the active section immediately
    setTimeout(() => {
        document.querySelectorAll('.active-section .reveal-text, .active-section .type-writer-text').forEach(el => el.classList.add('visible'));
    }, 150);
}

function initHeaderScroll() {
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* =========================================================================
   5. Seamless Page Transitions (AJAX-style visual logic)
   ========================================================================= */
function initPageTransitions() {
    const navLinks = document.querySelectorAll('.nav-link, .hero-actions a');
    const sections = document.querySelectorAll('.page-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('data-target');
            if (!targetId) return;

            e.preventDefault();

            // Handle Navigation Active State
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            // If it's a header nav link, make active
            if (this.classList.contains('nav-link')) {
                this.classList.add('active');
            } else {
                // If clicked from somewhere else, update header nav
                const correspondingNav = document.querySelector(`.nav-link[data-target="${targetId}"]`);
                if (correspondingNav) correspondingNav.classList.add('active');
            }

            // Handle Section Transitions (Fade-Zoom)
            const currentSection = document.querySelector('.page-section.active-section');
            const targetSection = document.getElementById(targetId);

            if (currentSection && targetSection && currentSection !== targetSection) {
                // Fade-and-Slide Out current
                currentSection.style.opacity = '0';
                currentSection.style.transform = 'translateY(-20px) scale(0.98)';

                setTimeout(() => {
                    currentSection.classList.remove('active-section');
                    targetSection.classList.add('active-section');

                    // Reset scroll to top
                    window.scrollTo({ top: 0, behavior: 'instant' });

                    // Trigger reflow
                    void targetSection.offsetWidth;

                    // Fade-and-Slide In target
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0) scale(1)';

                    // Trigger text reveals again if they exist in new section
                    const reveals = targetSection.querySelectorAll('.reveal-text');
                    reveals.forEach(r => {
                        r.classList.remove('visible');
                        setTimeout(() => r.classList.add('visible'), 50);
                    });

                }, 800); // matches CSS transition timing
            }
        });
    });
}

/* =========================================================================
   6. Hexagon Services Interactions
   ========================================================================= */
function initHexagonInteractions() {
    const hexagons = document.querySelectorAll('.hex-inner');

    hexagons.forEach(hex => {
        hex.addEventListener('click', function (e) {
            e.preventDefault();

            // Generate Ripple Wave Pulse internally
            const wave = document.createElement('div');
            wave.className = 'wave-pulse';

            // Adjust to click coordinates
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            wave.style.left = `${x}px`;
            wave.style.top = `${y}px`;

            this.appendChild(wave);
            setTimeout(() => wave.remove(), 1000);

            // Apply Neural Pulse visual effect (Scale & Glow via CSS class expected)
            this.classList.add('neural-pulse-active');
            setTimeout(() => this.classList.remove('neural-pulse-active'), 800);

            // Remove flip from other hexagons to give exclusive focus
            hexagons.forEach(h => {
                if (h !== this) h.classList.remove('flipped');
            });

            setTimeout(() => this.classList.toggle('flipped'), 150);
        });
    });
}

/* =========================================================================
   7. Simulated Code generation in About Section
   ========================================================================= */
function initSimulatedCode() {
    const codeContainer = document.getElementById('simulated-code');
    if (!codeContainer) return;

    const codeLines = [
        "const SYSTEM_START = true;",
        "import { NeuralEngine } from '@ai-nexus/core';",
        "async function init() {",
        "  await NeuralEngine.boot();",
        "  console.log('Gravity sequence initialized.');",
        "}",
        "init();"
    ];

    codeLines.forEach((line, index) => {
        const span = document.createElement('div');
        span.className = 'code-line';
        span.textContent = line;
        span.style.animationDelay = `${index * 0.2}s`;
        codeContainer.appendChild(span);
    });
}

/* =========================================================================
   8. Animated Stats Counter
   ========================================================================= */
function initStatsCounters() {
    const counters = document.querySelectorAll('.counter-val');

    // Fallback manual count up 
    const speed = 200; // The lower the slower

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const inc = Math.max(1, Math.ceil(target / speed));
                let count = 0;

                // Reset inner content to 0 immediately when visible
                counter.innerText = '0';

                const updateCount = () => {
                    count += inc;
                    if (count < target) {
                        counter.innerText = count.toLocaleString();
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };

                requestAnimationFrame(updateCount);
                obs.unobserve(counter); // only animate once
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => {
        counter.innerText = '0'; // Initialize to 0 so it counts up distinctly
        observer.observe(counter);
    });
}

/* =========================================================================
   9. Promo Countdown Timer
   ========================================================================= */
function initPromoCountdown() {
    const timerElement = document.getElementById('promo-countdown');
    if (!timerElement) return;

    // Read or set LocalStorage for persistent countdowns
    let storedEndTime = localStorage.getItem('nexusTimerEnd');
    let endTime;

    if (storedEndTime) {
        endTime = parseInt(storedEndTime, 10);
    } else {
        // 48 hours from now
        endTime = Date.now() + (48 * 60 * 60 * 1000);
        localStorage.setItem('nexusTimerEnd', endTime.toString());
    }

    function updateTimer() {
        const now = Date.now();
        let timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));

        if (timeRemaining <= 0) {
            timerElement.textContent = "00:00:00";
            return;
        }

        const h = Math.floor(timeRemaining / 3600);
        const m = Math.floor((timeRemaining % 3600) / 60);
        const s = timeRemaining % 60;

        const displayH = h < 10 ? '0' + h : h;
        const displayM = m < 10 ? '0' + m : m;
        const displayS = s < 10 ? '0' + s : s;

        timerElement.textContent = `${displayH}:${displayM}:${displayS}`;

        // Critical UX: If timer falls below 24 hours, change to Electric Red with Pulse Element
        if (timeRemaining < (24 * 60 * 60)) {
            timerElement.style.color = '#FF1010'; // Electric red
            timerElement.style.textShadow = '0 0 15px rgba(255, 16, 16, 0.8)';
            timerElement.classList.add('red-pulse');
        }

        requestAnimationFrame(updateTimer); // Highly performance optimized
    }

    // Start loop
    requestAnimationFrame(updateTimer);
}

/* =========================================================================
   10. Global Partner Logos Hover & Click interactions
   ========================================================================= */
function initPartnerLogs() {
    const logos = document.querySelectorAll('.partner-logo');
    logos.forEach(logo => {
        logo.addEventListener('click', function (e) {
            e.preventDefault();
            this.classList.remove('clicked');
            void this.offsetWidth; // trigger reflow
            this.classList.add('clicked');

            // Add Ripple Wave Pulse
            if (window.getComputedStyle(this).position === 'static') {
                this.style.position = 'relative';
            }
            const wave = document.createElement('div');
            wave.className = 'wave-pulse';
            const rect = this.getBoundingClientRect();
            wave.style.left = `${e.clientX - rect.left}px`;
            wave.style.top = `${e.clientY - rect.top}px`;

            this.appendChild(wave);
            setTimeout(() => wave.remove(), 1000);
        });
    });
}

/* =========================================================================
   11. Neural Vibration Headings
   ========================================================================= */
function initHeadingVibrations() {
    // Target all major headings
    const headings = document.querySelectorAll('h1, h2, h3, .section-title, .text-gradient, .vibrate-heading-target');

    headings.forEach(heading => {
        // Prevent interfering with links if the heading contains one
        heading.style.cursor = 'pointer';

        heading.addEventListener('click', function () {
            // Remove in case it was clicked too quickly
            this.classList.remove('vibrate-heading');
            this.classList.remove('vibrate-heading-active');
            void this.offsetWidth; // Trigger DOM reflow to restart animation

            // Add vibrate class
            this.classList.add('vibrate-heading');
            this.classList.add('vibrate-heading-active');

            // Remove after animation finishes
            setTimeout(() => {
                this.classList.remove('vibrate-heading');
                this.classList.remove('vibrate-heading-active');
            }, 400); // 400ms matching CSS shake
        });
    });
}

/* =========================================================================
   12. Force GSAP and Three.js Init
   ========================================================================= */
function initGSAPAndThree() {
    if (typeof gsap !== 'undefined') {
        gsap.to('.hero-content h1', { opacity: 1, duration: 1, y: 0 });
        gsap.to('.hex-service-card', { opacity: 1, stagger: 0.2, duration: 1, y: 0 });
        console.log('GSAP forcefully initialized');
    }
    if (typeof THREE !== 'undefined') {
        console.log('Three.js initialized');
    }
}

