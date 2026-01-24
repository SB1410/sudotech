/**
 * SUDOtech Premium Homepage Animations
 * Scroll-driven animations, parallax, and interactive effects
 */

class PremiumAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollReveal();
        this.setupParallax();
        this.setupCardTilt();
        this.setupCounterAnimation();
        this.setupSmoothScroll();
        this.setupNavbarScroll();
        this.setupMouseGlow();
    }

    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    setupScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');

        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optional: unobserve after reveal for performance
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // ==========================================
    // PARALLAX EFFECTS
    // ==========================================
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (!parallaxElements.length) return;

        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const rect = el.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const offset = (centerY - viewportCenter) * speed * 0.1;

                el.style.transform = `translateY(${offset}px)`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // ==========================================
    // CARD TILT EFFECT
    // ==========================================
    setupCardTilt() {
        const tiltCards = document.querySelectorAll('.bento-card, .transform-card, .stat-card, [data-tilt]');
        if (!tiltCards.length) return;

        // Don't apply on touch devices
        if ('ontouchstart' in window) return;

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    setupCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length) return;

        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.target);
            const suffix = counter.dataset.suffix || '';
            const prefix = counter.dataset.prefix || '';
            const duration = 2000;
            const start = 0;
            const startTime = Date.now();

            const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

            const update = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = easeOutQuart(progress);
                const current = Math.floor(start + (target - start) * eased);

                counter.textContent = prefix + current.toLocaleString() + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };

            update();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    setupNavbarScroll() {
        const header = document.querySelector('header');
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll direction
            if (currentScroll > lastScroll && currentScroll > scrollThreshold * 3) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ==========================================
    // MOUSE GLOW EFFECT
    // ==========================================
    setupMouseGlow() {
        const glowContainers = document.querySelectorAll('.mouse-glow-container');
        if (!glowContainers.length || 'ontouchstart' in window) return;

        glowContainers.forEach(container => {
            const glow = document.createElement('div');
            glow.className = 'mouse-glow';
            glow.style.cssText = `
                position: absolute;
                width: 400px;
                height: 400px;
                background: radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                transform: translate(-50%, -50%);
                z-index: 0;
            `;
            container.style.position = 'relative';
            container.style.overflow = 'hidden';
            container.appendChild(glow);

            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                glow.style.left = `${x}px`;
                glow.style.top = `${y}px`;
                glow.style.opacity = '1';
            });

            container.addEventListener('mouseleave', () => {
                glow.style.opacity = '0';
            });
        });
    }
}

// ==========================================
// PARTICLE BACKGROUND FOR HERO
// ==========================================
class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.particleCount = window.innerWidth < 768 ? 50 : 100;

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        this.setupEventListeners();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.ctx.scale(dpr, dpr);
    }

    createParticles() {
        this.particles = [];
        const width = window.innerWidth;
        const height = window.innerHeight;

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        this.ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        this.particles.forEach((p, i) => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around screen
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = isDark
                ? `rgba(249, 115, 22, ${p.opacity})`
                : `rgba(249, 115, 22, ${p.opacity * 0.8})`;
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[j].x - p.x;
                const dy = this.particles[j].y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    const opacity = (1 - dist / 150) * 0.15;
                    this.ctx.strokeStyle = isDark
                        ? `rgba(249, 115, 22, ${opacity})`
                        : `rgba(249, 115, 22, ${opacity * 0.6})`;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Attract nearby particles
            this.particles.forEach(p => {
                const dx = this.mouseX - p.x;
                const dy = this.mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200) {
                    const force = (200 - dist) / 200 * 0.03;
                    p.vx += dx * force * 0.01;
                    p.vy += dy * force * 0.01;
                }
            });
        });
    }
}

// ==========================================
// GRADIENT BACKGROUND MORPH
// ==========================================
class GradientMorph {
    constructor(element) {
        this.element = element;
        if (!this.element) return;

        this.colors = [
            { c1: '#0a0a0f', c2: '#1a1a2e', c3: '#16213e' },
            { c1: '#0a0a0f', c2: '#2d1f3d', c3: '#1a1a2e' },
            { c1: '#050505', c2: '#1a1a2e', c3: '#2d1f3d' }
        ];
        this.currentIndex = 0;
        this.nextIndex = 1;
        this.progress = 0;
        this.speed = 0.002;

        this.animate();
    }

    animate() {
        this.progress += this.speed;

        if (this.progress >= 1) {
            this.progress = 0;
            this.currentIndex = this.nextIndex;
            this.nextIndex = (this.nextIndex + 1) % this.colors.length;
        }

        const current = this.colors[this.currentIndex];
        const next = this.colors[this.nextIndex];

        const c1 = this.lerpColor(current.c1, next.c1, this.progress);
        const c2 = this.lerpColor(current.c2, next.c2, this.progress);
        const c3 = this.lerpColor(current.c3, next.c3, this.progress);

        this.element.style.background = `linear-gradient(135deg, ${c1}, ${c2}, ${c3})`;

        requestAnimationFrame(() => this.animate());
    }

    lerpColor(a, b, amount) {
        const ah = parseInt(a.replace('#', ''), 16);
        const bh = parseInt(b.replace('#', ''), 16);

        const ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
        const br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff;

        const rr = ar + amount * (br - ar);
        const rg = ag + amount * (bg - ag);
        const rb = ab + amount * (bb - ab);

        return `rgb(${Math.round(rr)}, ${Math.round(rg)}, ${Math.round(rb)})`;
    }
}

// ==========================================
// INITIALIZE ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize premium animations
    window.premiumAnimations = new PremiumAnimations();

    // Initialize particle background if canvas exists
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) {
        window.particleBackground = new ParticleBackground('particle-canvas');
    }

    // Initialize gradient morph if element exists
    const gradientBg = document.querySelector('.gradient-morph-bg');
    if (gradientBg) {
        window.gradientMorph = new GradientMorph(gradientBg);
    }
});

// ==========================================
// EXPORT FOR MODULE USE
// ==========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PremiumAnimations, ParticleBackground, GradientMorph };
}
