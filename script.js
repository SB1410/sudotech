document.addEventListener('DOMContentLoaded', () => {
    // Welcome Screen Animation
    const welcomeScreen = document.getElementById('welcome-screen');
    const text1 = "We are the SUDOs,";
    const text2 = "But the real Super User are you";
    const element1 = document.getElementById('welcome-text-1');
    const element2 = document.getElementById('welcome-text-2');

    // Check if first visit (Session storage for demo purposes, switch to localStorage for persistent)
    if (welcomeScreen && !sessionStorage.getItem('visited')) {
        // Prevent scrolling while welcome screen is active
        document.body.style.overflow = 'hidden';

        element1.classList.add('cursor-blink');

        // Typewriter function
        const typeWriter = (text, element, speed = 50, callback) => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                } else {
                    clearInterval(interval);
                    if (callback) callback();
                }
            }, speed);
        };

        // Sequence
        setTimeout(() => {
            typeWriter(text1, element1, 50, () => {
                element1.classList.remove('cursor-blink');
                element2.classList.add('cursor-blink');
                setTimeout(() => {
                    typeWriter(text2, element2, 50, () => {
                        setTimeout(() => {
                            welcomeScreen.classList.add('fade-out');
                            document.body.style.overflow = ''; // Restore scrolling
                            setTimeout(() => {
                                welcomeScreen.classList.add('hidden');
                            }, 500);
                            sessionStorage.setItem('visited', 'true');
                        }, 1500);
                    });
                }, 500);
            });
        }, 500);

    } else if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.querySelector('i').classList.remove('fa-times');
                mobileToggle.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // =====================================================
    // Theme Toggle (Light/Dark Mode)
    // =====================================================
    // Theme Toggle (Light/Dark Mode)
    // =====================================================
    // Select all theme toggle buttons (desktop and mobile)
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        updatePlasmaWaveTheme('dark');
    }

    if (themeToggles.length > 0) {
        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const currentTheme = htmlElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                htmlElement.setAttribute('data-theme', newTheme === 'dark' ? 'dark' : '');
                localStorage.setItem('theme', newTheme);

                // Update PlasmaWave background colors
                updatePlasmaWaveTheme(newTheme);
            });
        });
    }

    // Function to update PlasmaWave background colors
    function updatePlasmaWaveTheme(theme) {
        // Access the global PlasmaWave instance if it exists
        if (window.plasmaWaveInstance) {
            if (theme === 'dark') {
                // Dark mode: black background
                window.plasmaWaveInstance.options.bgColor1 = [0.04, 0.04, 0.04, 1.0];
                window.plasmaWaveInstance.options.bgColor2 = [0.08, 0.06, 0.04, 1.0];
            } else {
                // Light mode: cream background
                window.plasmaWaveInstance.options.bgColor1 = [0.98, 0.97, 0.95, 1.0];
                window.plasmaWaveInstance.options.bgColor2 = [0.96, 0.94, 0.91, 1.0];
            }
        }
    }

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });

    // Smooth Scroll for Anchor Links (Polyfill-like behavior if needed)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dynamic Counter Animation for Stats
    const statsSection = document.querySelector('.stats-section');
    let statsAnimated = false;

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsAnimated) {
                statsAnimated = true;
                document.querySelectorAll('.stat-number').forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    const speed = 200;
                    const updateCount = () => {
                        const count = +stat.innerText;
                        const inc = target / speed;
                        if (count < target) {
                            stat.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 20);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCount();
                });
            }
        });
        statsObserver.observe(statsSection);
    }

    // Contact Form Handling (Simulation)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.background = '#10b981'; // Success green
                btn.style.borderColor = '#10b981';
                btn.style.opacity = '1';

                contactForm.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = ''; // Revert to CSS default
                    btn.style.borderColor = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
    // Service Modal Functionality
    const modalOverlay = document.getElementById('service-modal-overlay');
    const heroBadges = document.querySelectorAll('.hero-badge[data-service]');

    // Open modal when badge is clicked with transition effect
    heroBadges.forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const serviceType = badge.getAttribute('data-service');
            const targetModal = document.getElementById(`modal-${serviceType}`);

            if (targetModal && modalOverlay) {
                // Get badge position for transition
                const badgeRect = badge.getBoundingClientRect();
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                // Calculate offset from badge to center
                const badgeCenterX = badgeRect.left + badgeRect.width / 2;
                const badgeCenterY = badgeRect.top + badgeRect.height / 2;
                const translateX = centerX - badgeCenterX;
                const translateY = centerY - badgeCenterY;

                // Clone badge for transition animation
                const badgeClone = badge.cloneNode(true);
                badgeClone.classList.add('badge-transition-clone');
                badgeClone.style.position = 'fixed';
                badgeClone.style.left = badgeRect.left + 'px';
                badgeClone.style.top = badgeRect.top + 'px';
                badgeClone.style.width = badgeRect.width + 'px';
                badgeClone.style.height = badgeRect.height + 'px';
                badgeClone.style.zIndex = '10001';
                badgeClone.style.animation = 'none';
                badgeClone.style.margin = '0';
                document.body.appendChild(badgeClone);

                // Hide original badge temporarily
                badge.style.opacity = '0';

                // Animate clone to center while scaling
                requestAnimationFrame(() => {
                    badgeClone.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    badgeClone.style.transform = `translate(${translateX}px, ${translateY}px) scale(3)`;
                    badgeClone.style.opacity = '0';
                    badgeClone.style.borderRadius = '24px';
                });

                // Show overlay with blur
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Hide all modals first
                document.querySelectorAll('.service-modal').forEach(modal => {
                    modal.classList.remove('active');
                });

                // After badge transition, show modal
                setTimeout(() => {
                    targetModal.classList.add('active');
                    // Remove clone
                    badgeClone.remove();
                    // Restore original badge opacity
                    badge.style.opacity = '';
                }, 350);
            }
        });
    });

    // Close modal function
    const closeModal = () => {
        const activeModal = document.querySelector('.service-modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }

        setTimeout(() => {
            if (modalOverlay) {
                modalOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }, 300);
    };

    // Close modal when clicking overlay background
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Close modal when clicking close button
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    });

    // Close modal when clicking CTA button and select service in contact form
    document.querySelectorAll('.modal-cta').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceName = btn.getAttribute('data-service-name');

            // Find the service dropdown in contact form
            const serviceSelect = document.querySelector('.contact-form select');
            if (serviceSelect && serviceName) {
                // Find and select the matching option
                for (let option of serviceSelect.options) {
                    if (option.text === serviceName) {
                        serviceSelect.value = option.value;
                        serviceSelect.style.color = '#000'; // Change color to show selection
                        break;
                    }
                }
            }

            closeModal();
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // =====================================================
    // Marquee Drag-to-Scroll Functionality
    // =====================================================
    const marqueeWrapper = document.querySelector('.marquee-wrapper');
    const marqueeTrack = document.querySelector('.marquee-track');

    if (marqueeWrapper && marqueeTrack) {
        let isDown = false;
        let startX;
        let currentTransform = 0;
        const animationDuration = 40; // seconds - must match CSS

        const getTransformX = () => {
            const style = window.getComputedStyle(marqueeTrack);
            const matrix = style.transform;
            if (matrix === 'none') return 0;
            const values = matrix.match(/matrix.*\((.+)\)/);
            if (values && values[1]) {
                const parts = values[1].split(', ');
                return parseFloat(parts[4]) || 0;
            }
            return 0;
        };

        // Calculate animation delay to resume from current position
        const getAnimationDelay = (currentX) => {
            const trackWidth = marqueeTrack.scrollWidth / 2; // Half width since content is duplicated
            const progress = Math.abs(currentX) / trackWidth; // 0 to 1
            const delay = -(progress * animationDuration); // Negative delay = start from that point
            return delay;
        };

        const resumeAnimation = () => {
            const currentX = getTransformX();
            const delay = getAnimationDelay(currentX);
            marqueeTrack.style.transform = '';
            marqueeTrack.style.animation = `scrollMarquee ${animationDuration}s linear infinite`;
            marqueeTrack.style.animationDelay = `${delay}s`;
        };

        const handleMouseDown = (e) => {
            // Only start drag if clicking on a CARD, not empty space
            const card = e.target.closest('.marquee-card');
            if (!card) return;

            // Don't start drag if clicking on a link
            if (e.target.tagName === 'A' || e.target.closest('a')) return;

            isDown = true;
            marqueeWrapper.classList.add('dragging');
            startX = e.pageX || e.touches?.[0]?.pageX;

            // Pause animation and lock current position
            currentTransform = getTransformX();
            marqueeTrack.style.animation = 'none';
            marqueeTrack.style.animationDelay = '';
            marqueeTrack.style.transform = `translateX(${currentTransform}px)`;

            e.preventDefault();
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();

            const x = e.pageX || e.touches?.[0]?.pageX;
            const walk = x - startX; // 1:1 ratio
            marqueeTrack.style.transform = `translateX(${currentTransform + walk}px)`;
        };

        const handleMouseUp = () => {
            if (!isDown) return;
            isDown = false;
            marqueeWrapper.classList.remove('dragging');

            // Save current position - DON'T resume if still hovering
            currentTransform = getTransformX();
            // Keep it paused at current position while hovering
            marqueeTrack.style.transform = `translateX(${currentTransform}px)`;
        };

        const handleTouchEnd = () => {
            if (!isDown) return;
            isDown = false;
            marqueeWrapper.classList.remove('dragging');

            // For touch, we resume immediately since there's no "hover" state
            resumeAnimation();
        };

        // Mouse events - listen on cards only for mousedown
        marqueeWrapper.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        // Touch events
        marqueeWrapper.addEventListener('touchstart', handleMouseDown, { passive: false });
        window.addEventListener('touchmove', handleMouseMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        // Pause ONLY when hovering directly over a card
        marqueeWrapper.addEventListener('mouseover', (e) => {
            const card = e.target.closest('.marquee-card');
            if (card && !isDown) {
                // Pause and hold current position
                currentTransform = getTransformX();
                marqueeTrack.style.animation = 'none';
                marqueeTrack.style.animationDelay = '';
                marqueeTrack.style.transform = `translateX(${currentTransform}px)`;
            }
        });

        // Resume when mouse leaves a card (goes to empty space or leaves wrapper)
        marqueeWrapper.addEventListener('mouseout', (e) => {
            const card = e.target.closest('.marquee-card');
            const relatedCard = e.relatedTarget?.closest?.('.marquee-card');

            // Only resume if leaving a card AND not entering another card
            if (card && !relatedCard && !isDown) {
                resumeAnimation();
            }
        });

        // Also resume when leaving the wrapper entirely
        marqueeWrapper.addEventListener('mouseleave', () => {
            if (!isDown) {
                resumeAnimation();
            }
        });
    }

    // =====================================================
    // Portfolio Carousel Navigation (Mobile)
    // =====================================================
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const prevBtn = document.querySelector('.portfolio-prev');
    const nextBtn = document.querySelector('.portfolio-next');

    if (portfolioGrid && prevBtn && nextBtn) {
        const getScrollAmount = () => {
            const item = portfolioGrid.querySelector('.portfolio-item');
            if (item) {
                return item.offsetWidth + 16; // Item width + gap
            }
            return 300; // Fallback
        };

        prevBtn.addEventListener('click', () => {
            portfolioGrid.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            portfolioGrid.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });

        // Drag-to-scroll functionality
        let isDragging = false;
        let startX;
        let scrollStart;

        const startDrag = (pageX) => {
            isDragging = true;
            portfolioGrid.classList.add('dragging');
            startX = pageX;
            scrollStart = portfolioGrid.scrollLeft;

            // Disable snapping and smooth scroll for direct control
            portfolioGrid.style.scrollSnapType = 'none';
            portfolioGrid.style.scrollBehavior = 'auto';
        };

        const onDrag = (pageX) => {
            if (!isDragging) return;
            const x = pageX;
            const walk = startX - x;
            portfolioGrid.scrollLeft = scrollStart + walk;
        };

        const stopDrag = () => {
            isDragging = false;
            portfolioGrid.classList.remove('dragging');

            // Re-enable snapping and smooth scroll naturally
            portfolioGrid.style.scrollSnapType = '';
            portfolioGrid.style.scrollBehavior = '';
        };

        portfolioGrid.addEventListener('mousedown', (e) => {
            startDrag(e.pageX);
            e.preventDefault(); // Prevent text selection
        });

        portfolioGrid.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                onDrag(e.pageX);
            }
        });

        portfolioGrid.addEventListener('mouseup', stopDrag);
        portfolioGrid.addEventListener('mouseleave', stopDrag);

        // NOTE: Touch events are removed to let native browser scrolling handle mobile swipes.
        // Native scrolling + CSS scroll-snap provides the smoothest experience on touch devices.
        // Mouse events (above) are kept for desktop "drag" interaction.
    }

    // =====================================================
    // Portfolio Filter Functionality
    // =====================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterButtons.length > 0 && portfolioCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state on buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                // Filter cards with animation
                portfolioCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden');
                        // Staggered animation
                        setTimeout(() => {
                            card.classList.add('show');
                        }, 50);
                    } else {
                        card.classList.remove('show');
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }
});
