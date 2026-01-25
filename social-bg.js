/**
 * Social Media Management Page - Animated Background
 * Creates flowing gradient waves inspired by social media feeds
 * with floating platform icons and theme-aware colors
 */

(function () {
    'use strict';

    class SocialBgAnimation {
        constructor() {
            this.canvas = document.getElementById('social-bg-canvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.width = 0;
            this.height = 0;
            this.time = 0;
            this.mouseX = 0;
            this.mouseY = 0;
            this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            // Colors
            this.colors = {
                light: {
                    bg1: '#faf7f2',
                    bg2: '#f5f0e8',
                    wave1: 'rgba(249, 115, 22, 0.08)',
                    wave2: 'rgba(251, 146, 60, 0.06)',
                    wave3: 'rgba(139, 92, 246, 0.04)',
                    accent: 'rgba(249, 115, 22, 0.15)'
                },
                dark: {
                    bg1: '#0a0a0a',
                    bg2: '#0f0f15',
                    wave1: 'rgba(249, 115, 22, 0.12)',
                    wave2: 'rgba(251, 146, 60, 0.08)',
                    wave3: 'rgba(139, 92, 246, 0.06)',
                    accent: 'rgba(249, 115, 22, 0.2)'
                }
            };

            // Floating particles
            this.particles = [];
            this.particleCount = window.innerWidth < 768 ? 15 : 30;

            // Social icons for floating effect
            this.socialIcons = ['📷', '💼', '🐦', '▶️', '🎵', '📘'];

            this.init();
        }

        init() {
            this.resize();
            this.createParticles();
            this.bindEvents();
            this.animate();
        }

        resize() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }

        createParticles() {
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.3 + 0.1
                });
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => {
                this.resize();
                this.createParticles();
            });

            window.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });

            // Theme change observer
            const observer = new MutationObserver(() => {
                this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            });
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        }

        getColors() {
            return this.isDark ? this.colors.dark : this.colors.light;
        }

        drawBackground() {
            const colors = this.getColors();

            // Gradient background
            const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
            gradient.addColorStop(0, colors.bg1);
            gradient.addColorStop(1, colors.bg2);
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        drawWaves() {
            const colors = this.getColors();
            const waveConfigs = [
                { color: colors.wave1, amplitude: 80, frequency: 0.003, speed: 0.0008, yOffset: 0.3 },
                { color: colors.wave2, amplitude: 60, frequency: 0.004, speed: 0.001, yOffset: 0.5 },
                { color: colors.wave3, amplitude: 100, frequency: 0.002, speed: 0.0006, yOffset: 0.7 }
            ];

            waveConfigs.forEach((config, index) => {
                this.ctx.beginPath();
                this.ctx.moveTo(0, this.height);

                for (let x = 0; x <= this.width; x += 5) {
                    const y = this.height * config.yOffset +
                        Math.sin(x * config.frequency + this.time * config.speed) * config.amplitude +
                        Math.sin(x * config.frequency * 2 + this.time * config.speed * 1.5) * (config.amplitude * 0.5);

                    if (x === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }

                this.ctx.lineTo(this.width, this.height);
                this.ctx.lineTo(0, this.height);
                this.ctx.closePath();

                this.ctx.fillStyle = config.color;
                this.ctx.fill();
            });
        }

        drawParticles() {
            const colors = this.getColors();

            this.particles.forEach(particle => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Wrap around edges
                if (particle.x < 0) particle.x = this.width;
                if (particle.x > this.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.height;
                if (particle.y > this.height) particle.y = 0;

                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = colors.accent;
                this.ctx.fill();
            });
        }

        drawGlowSpots() {
            const colors = this.getColors();

            // Mouse follow glow
            const glowGradient = this.ctx.createRadialGradient(
                this.mouseX, this.mouseY, 0,
                this.mouseX, this.mouseY, 300
            );
            glowGradient.addColorStop(0, this.isDark ? 'rgba(249, 115, 22, 0.08)' : 'rgba(249, 115, 22, 0.05)');
            glowGradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = glowGradient;
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Animated accent glows
            const time = this.time * 0.0005;
            const glowPositions = [
                { x: this.width * 0.2, y: this.height * 0.3 + Math.sin(time) * 50 },
                { x: this.width * 0.8, y: this.height * 0.6 + Math.cos(time * 1.2) * 40 },
                { x: this.width * 0.5, y: this.height * 0.8 + Math.sin(time * 0.8) * 60 }
            ];

            glowPositions.forEach(pos => {
                const glow = this.ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 200);
                glow.addColorStop(0, this.isDark ? 'rgba(139, 92, 246, 0.06)' : 'rgba(139, 92, 246, 0.03)');
                glow.addColorStop(1, 'transparent');
                this.ctx.fillStyle = glow;
                this.ctx.fillRect(0, 0, this.width, this.height);
            });
        }

        animate() {
            this.time++;

            this.ctx.clearRect(0, 0, this.width, this.height);

            this.drawBackground();
            this.drawWaves();
            this.drawGlowSpots();
            this.drawParticles();

            requestAnimationFrame(() => this.animate());
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new SocialBgAnimation());
    } else {
        new SocialBgAnimation();
    }

    // =====================================================
    // Social Media Management Page Interactions
    // =====================================================

    document.addEventListener('DOMContentLoaded', () => {
        // Scroll reveal animations
        const revealElements = document.querySelectorAll('.smm-problem-card, .smm-service-card, .smm-process-step, .smm-stat-card, .smm-testimonial-card, .smm-pricing-card, .smm-reveal, .smm-reveal-left, .smm-reveal-right');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // Service card mouse tracking for glow effect
        const serviceCards = document.querySelectorAll('.smm-service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
        });

        // Animated counters
        const statNumbers = document.querySelectorAll('.smm-stat-number[data-value]');
        let countersAnimated = false;

        const animateCounters = () => {
            if (countersAnimated) return;

            statNumbers.forEach(stat => {
                const target = stat.getAttribute('data-value');
                const suffix = stat.getAttribute('data-suffix') || '';
                const prefix = stat.getAttribute('data-prefix') || '';
                const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
                const duration = 2000;
                const startTime = Date.now();

                const updateCounter = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(numericValue * easeOut);

                    stat.textContent = prefix + current.toLocaleString() + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = prefix + target + suffix;
                    }
                };

                updateCounter();
            });

            countersAnimated = true;
        };

        // Observe stats section for counter animation
        const statsSection = document.querySelector('.smm-stats-grid');
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(statsSection);
                }
            }, { threshold: 0.3 });
            statsObserver.observe(statsSection);
        }

        // Popup functionality
        const popupOverlay = document.querySelector('.smm-popup-overlay');
        const popupTriggers = document.querySelectorAll('[data-popup-trigger]');
        const popupClose = document.querySelector('.smm-popup-close');

        const openPopup = () => {
            if (popupOverlay) {
                popupOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };

        const closePopup = () => {
            if (popupOverlay) {
                popupOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        popupTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openPopup();
            });
        });

        if (popupClose) {
            popupClose.addEventListener('click', closePopup);
        }

        if (popupOverlay) {
            popupOverlay.addEventListener('click', (e) => {
                if (e.target === popupOverlay) {
                    closePopup();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popupOverlay?.classList.contains('active')) {
                closePopup();
            }
        });

        // Popup form submission
        const popupForm = document.querySelector('.smm-popup-form');
        if (popupForm) {
            popupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = popupForm.querySelector('button');
                const originalText = btn.textContent;

                btn.textContent = 'Sending...';
                btn.disabled = true;

                setTimeout(() => {
                    btn.textContent = 'Sent! We\'ll be in touch.';
                    btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

                    setTimeout(() => {
                        closePopup();
                        popupForm.reset();
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 2000);
                }, 1500);
            });
        }

        // Timeline step reveal stagger
        const timelineSteps = document.querySelectorAll('.smm-process-step');
        timelineSteps.forEach((step, index) => {
            step.style.transitionDelay = `${index * 0.15}s`;
        });

        // Button ripple effect
        const buttons = document.querySelectorAll('.smm-btn-primary, .smm-btn-outline');
        buttons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    left: ${e.clientX - rect.left - size / 2}px;
                    top: ${e.clientY - rect.top - size / 2}px;
                    pointer-events: none;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation keyframes
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    });
})();
