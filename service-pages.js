/**
 * Service Pages - Shared JavaScript
 * Scroll reveals, animated counters, timeline stagger, button effects
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // =====================================================
        // Scroll Reveal Animations
        // =====================================================
        const revealElements = document.querySelectorAll(
            '.sp-problem-card, .sp-service-card, .sp-process-step, ' +
            '.sp-stat-card, .sp-testimonial-card, .sp-pricing-card, .sp-reveal'
        );

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach((el, index) => {
            // Add stagger delay for grid items
            if (el.classList.contains('sp-process-step')) {
                el.style.transitionDelay = `${index * 0.12}s`;
            }
            revealObserver.observe(el);
        });

        // =====================================================
        // Service Card Mouse Tracking Glow
        // =====================================================
        const serviceCards = document.querySelectorAll('.sp-service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', `${x}%`);
                card.style.setProperty('--mouse-y', `${y}%`);
            });
        });

        // =====================================================
        // Animated Counters
        // =====================================================
        const statNumbers = document.querySelectorAll('.sp-stat-number[data-value]');
        let countersAnimated = false;

        const animateCounters = () => {
            if (countersAnimated) return;

            statNumbers.forEach(stat => {
                const target = stat.getAttribute('data-value');
                const suffix = stat.getAttribute('data-suffix') || '';
                const prefix = stat.getAttribute('data-prefix') || '';
                const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
                const duration = 1800;
                const startTime = Date.now();

                const updateCounter = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out cubic
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
        const statsSection = document.querySelector('.sp-stats-grid');
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(statsSection);
                }
            }, { threshold: 0.25 });
            statsObserver.observe(statsSection);
        }

        // =====================================================
        // Process Timeline Stagger Animation
        // =====================================================
        const timelineSteps = document.querySelectorAll('.sp-process-step');
        timelineSteps.forEach((step, index) => {
            step.style.transitionDelay = `${index * 0.15}s`;
        });

        // =====================================================
        // Button Ripple Effect
        // =====================================================
        const buttons = document.querySelectorAll('.sp-btn-primary, .sp-btn-outline, .sp-hero-cta, .sp-cta-btn');
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
                    animation: spRipple 0.6s ease-out;
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

        // Add ripple animation keyframes if not present
        if (!document.querySelector('#sp-ripple-style')) {
            const style = document.createElement('style');
            style.id = 'sp-ripple-style';
            style.textContent = `
                @keyframes spRipple {
                    to {
                        transform: scale(2.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // =====================================================
        // Pricing Card Hover Enhancement
        // =====================================================
        const pricingCards = document.querySelectorAll('.sp-pricing-card');
        pricingCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Dim other cards slightly
                pricingCards.forEach(c => {
                    if (c !== card && !c.classList.contains('featured')) {
                        c.style.opacity = '0.7';
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                pricingCards.forEach(c => {
                    c.style.opacity = '1';
                });
            });
        });

        // =====================================================
        // Smooth Scroll for Internal Links
        // =====================================================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    });
})();
