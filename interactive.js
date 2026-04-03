// Modern Interactive JavaScript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-modern, .info-card-modern, .skill-chip-modern');
    const skillChips = document.querySelectorAll('.skill-chip-modern');
    const infoCards = document.querySelectorAll('.info-card-modern');
    const revealElements = document.querySelectorAll('.section-modern, .about-card-modern');
    const tiltCards = document.querySelectorAll('[data-tilt]');
    const orbs = document.querySelectorAll('.gradient-orb');

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    entry.target.style.opacity = '1';
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach((section) => {
            section.style.opacity = '0';
            observer.observe(section);
        });

        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        sections.forEach((section) => {
            section.style.opacity = '1';
        });
    }

    skillChips.forEach((chip, index) => {
        chip.style.animationDelay = `${index * 0.05}s`;
        chip.addEventListener('click', function () {
            this.style.animation = 'none';
            window.setTimeout(() => {
                this.style.animation = 'pulse 0.5s ease-out';
            }, 10);
        });
    });

    infoCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    if (!prefersReducedMotion) {
        tiltCards.forEach((card) => {
            let frameRequested = false;

            card.addEventListener('mousemove', (event) => {
                if (frameRequested) return;
                frameRequested = true;

                window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                    frameRequested = false;
                });
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });

        let latestMouseEvent = null;
        let parallaxFrameRequested = false;

        window.addEventListener('mousemove', (event) => {
            latestMouseEvent = event;
            if (parallaxFrameRequested) return;
            parallaxFrameRequested = true;

            window.requestAnimationFrame(() => {
                if (latestMouseEvent) {
                    const mouseX = latestMouseEvent.clientX / window.innerWidth;
                    const mouseY = latestMouseEvent.clientY / window.innerHeight;

                    orbs.forEach((orb, index) => {
                        const speed = (index + 1) * 20;
                        const x = (mouseX - 0.5) * speed;
                        const y = (mouseY - 0.5) * speed;
                        orb.style.transform = `translate(${x}px, ${y}px)`;
                    });
                }
                parallaxFrameRequested = false;
            });
        });
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('a, button, .info-card-modern, .skill-chip-modern').forEach((element) => {
        element.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

window.addEventListener('load', () => {
    if (prefersReducedMotion) return;

    document.body.style.opacity = '0';
    window.setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

