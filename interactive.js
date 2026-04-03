// Modern Interactive JavaScript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-modern, .info-card-modern, .skill-chip-modern');
    const skillChips = document.querySelectorAll('.skill-chip-modern');
    const infoCards = document.querySelectorAll('.info-card-modern');
    const revealElements = document.querySelectorAll('.section-modern, .about-card-modern');
    const tiltCards = document.querySelectorAll('[data-tilt]');
    const orbs = document.querySelectorAll('.gradient-orb');
    const heroTyping = document.getElementById('hero-typing');

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

    if (heroTyping) {
        const fullText = heroTyping.getAttribute('data-fulltext') || heroTyping.textContent || '';
        if (prefersReducedMotion) {
            heroTyping.textContent = fullText;
            heroTyping.setAttribute('data-text', fullText);
        } else {
            let idx = 0;
            heroTyping.textContent = '';
            const typeTimer = window.setInterval(() => {
                heroTyping.textContent += fullText.charAt(idx);
                idx += 1;
                if (idx >= fullText.length) {
                    window.clearInterval(typeTimer);
                    heroTyping.setAttribute('data-text', fullText);
                }
            }, 28);
        }
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

    const projectDetailButtons = document.querySelectorAll('.project-details-btn');
    projectDetailButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const projectName = button.getAttribute('data-project');
            if (!projectName) return;

            if (window.portfolioChatbot && typeof window.portfolioChatbot.askQuestion === 'function') {
                window.portfolioChatbot.askQuestion(`Tell me more about the ${projectName} project and its business impact.`);
            }
        });
    });

    const dropzone = document.getElementById('demo-dropzone');
    const fileInput = document.getElementById('demo-file-input');
    const fileNameEl = document.getElementById('demo-file-name');
    const runInferenceBtn = document.getElementById('run-inference-btn');
    const resultTextEl = document.getElementById('demo-result-text');
    const previewImageEl = document.getElementById('demo-preview-image');

    let selectedFile = null;

    const updateSelectedFile = (file) => {
        selectedFile = file;
        fileNameEl.textContent = file ? file.name : 'No file selected';
        if (file && previewImageEl) {
            previewImageEl.src = URL.createObjectURL(file);
            previewImageEl.style.display = 'block';
        }
    };

    if (dropzone && fileInput && runInferenceBtn && resultTextEl && previewImageEl && fileNameEl) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                fileInput.click();
            }
        });

        fileInput.addEventListener('change', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement) || !target.files || target.files.length === 0) return;
            updateSelectedFile(target.files[0]);
            resultTextEl.textContent = 'Image ready. Click "Run Inference" to process.';
        });

        dropzone.addEventListener('dragover', (event) => {
            event.preventDefault();
            dropzone.classList.add('drag-over');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('drag-over');
        });

        dropzone.addEventListener('drop', (event) => {
            event.preventDefault();
            dropzone.classList.remove('drag-over');
            if (!event.dataTransfer || event.dataTransfer.files.length === 0) return;
            updateSelectedFile(event.dataTransfer.files[0]);
            resultTextEl.textContent = 'Image ready. Click "Run Inference" to process.';
        });

        runInferenceBtn.addEventListener('click', async () => {
            if (!selectedFile) {
                resultTextEl.textContent = 'Please upload an image first.';
                return;
            }

            runInferenceBtn.setAttribute('disabled', 'true');
            runInferenceBtn.textContent = 'Running...';

            const formData = new FormData();
            formData.append('image', selectedFile);

            try {
                const response = await fetch('/predict', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const prediction = await response.json();
                const label = prediction.label || prediction.class || 'Prediction complete';
                const confidence = prediction.confidence || prediction.score || null;
                resultTextEl.textContent = confidence ? `Result: ${label} (${Math.round(Number(confidence) * 100)}% confidence)` : `Result: ${label}`;
            } catch (_error) {
                const mockLabels = ['Vehicle Detected', 'License Plate Found', 'Anomaly Noted', 'Scene Validated'];
                const randomLabel = mockLabels[Math.floor(Math.random() * mockLabels.length)];
                const confidence = (0.84 + Math.random() * 0.12).toFixed(2);
                resultTextEl.textContent = `Mock Result: ${randomLabel} (${confidence} confidence). Backend hook ready for /predict.`;
            } finally {
                runInferenceBtn.removeAttribute('disabled');
                runInferenceBtn.textContent = 'Run Inference';
            }
        });
    }
});

window.addEventListener('load', () => {
    if (prefersReducedMotion) return;

    document.body.style.opacity = '0';
    window.setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

