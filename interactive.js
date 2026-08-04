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

function createMathFunction(expression) {
    const cleaned = expression.trim().replace(/\^/g, '**');
    if (/[^0-9a-zA-Z_\+\-\*\/\^\.%(), \t\n]/.test(cleaned)) {
        return null;
    }

    const helpers = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        asin: Math.asin,
        acos: Math.acos,
        atan: Math.atan,
        sinh: Math.sinh,
        cosh: Math.cosh,
        tanh: Math.tanh,
        sqrt: Math.sqrt,
        abs: Math.abs,
        exp: Math.exp,
        log: Math.log,
        pow: Math.pow,
        min: Math.min,
        max: Math.max,
        PI: Math.PI,
        E: Math.E,
        floor: Math.floor,
        ceil: Math.ceil,
    };

    try {
        return new Function(
            'x',
            'y',
            ...Object.keys(helpers),
            `return ${cleaned};`
        );
    } catch (error) {
        return null;
    }
}

function evaluateMath(expression, x, y) {
    const fn = createMathFunction(expression);
    if (!fn) return NaN;
    const helpers = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        asin: Math.asin,
        acos: Math.acos,
        atan: Math.atan,
        sinh: Math.sinh,
        cosh: Math.cosh,
        tanh: Math.tanh,
        sqrt: Math.sqrt,
        abs: Math.abs,
        exp: Math.exp,
        log: Math.log,
        pow: Math.pow,
        min: Math.min,
        max: Math.max,
        PI: Math.PI,
        E: Math.E,
        floor: Math.floor,
        ceil: Math.ceil,
    };
    try {
        return fn(x, y, ...Object.values(helpers));
    } catch (error) {
        return NaN;
    }
}

function renderMathSurface(canvas, expression, view = {}) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = 28;
    const rows = 28;
    const xMin = -4;
    const xMax = 4;
    const yMin = -4;
    const yMax = 4;
    const zScale = 1.4;
    const angle = Math.PI / 6;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const zoom = Math.min(2.5, Math.max(0.35, Number(view.zoom) || 1));
    const scale = Math.min(width, height) / 12 * zoom;
    const cx = width / 2 + (Number(view.offsetX) || 0);
    const cy = height / 2 + 20 + (Number(view.offsetY) || 0);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#06070e';
    ctx.fillRect(0, 0, width, height);

    const points = [];
    for (let row = 0; row <= rows; row += 1) {
        const y = yMin + (row / rows) * (yMax - yMin);
        const rowPoints = [];
        for (let col = 0; col <= cols; col += 1) {
            const x = xMin + (col / cols) * (xMax - xMin);
            const z = evaluateMath(expression, x, y);
            const value = Number.isFinite(z) ? z : 0;
            rowPoints.push({ x, y, z: value });
        }
        points.push(rowPoints);
    }

    function project(point) {
        return {
            x: cx + (point.x - point.y) * cosA * scale,
            y: cy + (point.x + point.y) * sinA * scale - point.z * zScale * (scale / 2),
        };
    }

    for (let row = 0; row <= rows; row += 1) {
        ctx.beginPath();
        for (let col = 0; col <= cols; col += 1) {
            const p = project(points[row][col]);
            if (col === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        }
        const hue = 220 - (row / rows) * 50;
        ctx.strokeStyle = `hsla(${hue}, 80%, 72%, 0.65)`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
    }

    for (let col = 0; col <= cols; col += 1) {
        ctx.beginPath();
        for (let row = 0; row <= rows; row += 1) {
            const p = project(points[row][col]);
            if (row === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        }
        const hue = 200 - (col / cols) * 40;
        ctx.strokeStyle = `hsla(${hue}, 92%, 68%, 0.55)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
    }

    ctx.beginPath();
    const axisPoints = [
        { x: -4, y: 0, z: 0 },
        { x: 4, y: 0, z: 0 },
        { x: 0, y: -4, z: 0 },
        { x: 0, y: 4, z: 0 },
    ];
    axisPoints.forEach((pt, index) => {
        const p = project(pt);
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    return true;
}

function attachMathSketchControls() {
    const canvas = document.getElementById('math-tool-canvas');
    const equationInput = document.getElementById('math-equation-input');
    const plotButton = document.getElementById('tool-plot-button');
    const evalButton = document.getElementById('tool-eval-button');
    const resetButton = document.getElementById('tool-reset-button');
    const response = document.getElementById('math-tool-response');

    if (!canvas || !equationInput || !plotButton || !evalButton || !resetButton || !response) {
        return;
    }

    const defaultExpression = 'sin(x) * cos(y)';
    const viewState = {
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
    };

    const updateMessage = (text) => {
        response.textContent = text;
    };

    const plotCurrentExpression = () => {
        const expression = equationInput.value.trim() || defaultExpression;
        updateMessage('Rendering MathSketch 3D surface...');
        const success = renderMathSurface(canvas, expression, viewState);
        if (success) {
            updateMessage(`Rendered MathSketch 3D surface for: ${expression}`);
        } else {
            updateMessage('Unable to render that expression. Please use only safe math functions like sin, cos, tan, sqrt, log, exp, abs, min, max, and simple operators.');
        }
    };

    plotButton.addEventListener('click', plotCurrentExpression);

    evalButton.addEventListener('click', () => {
        const expression = equationInput.value.trim() || defaultExpression;
        const value = evaluateMath(expression, 1, 1);
        if (Number.isFinite(value)) {
            updateMessage(`MathSketch eval at x=1, y=1 → ${Number(value.toFixed(6))}`);
        } else {
            updateMessage('The expression could not be evaluated. Please check syntax and allowed functions.');
        }
    });

    resetButton.addEventListener('click', () => {
        equationInput.value = defaultExpression;
        viewState.zoom = 1;
        viewState.offsetX = 0;
        viewState.offsetY = 0;
        updateMessage('Equation reset. Click plot to render MathSketch 3D again.');
        plotCurrentExpression();
    });

    let dragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const onStartDrag = (event) => {
        dragging = true;
        const point = event.touches ? event.touches[0] : event;
        lastPointerX = point.clientX;
        lastPointerY = point.clientY;
        canvas.style.cursor = 'grabbing';
    };

    const onDrag = (event) => {
        if (!dragging) return;
        const point = event.touches ? event.touches[0] : event;
        const dx = point.clientX - lastPointerX;
        const dy = point.clientY - lastPointerY;
        lastPointerX = point.clientX;
        lastPointerY = point.clientY;
        viewState.offsetX += dx;
        viewState.offsetY += dy;
        renderMathSurface(canvas, equationInput.value.trim() || defaultExpression, viewState);
    };

    const onEndDrag = () => {
        dragging = false;
        canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('mousedown', onStartDrag);
    canvas.addEventListener('touchstart', onStartDrag, { passive: true });
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag, { passive: true });
    window.addEventListener('mouseup', onEndDrag);
    window.addEventListener('touchend', onEndDrag);

    canvas.addEventListener('wheel', (event) => {
        event.preventDefault();
        const delta = -event.deltaY * 0.001;
        viewState.zoom = Math.min(2.5, Math.max(0.35, viewState.zoom + delta));
        renderMathSurface(canvas, equationInput.value.trim() || defaultExpression, viewState);
    }, { passive: false });

    window.addEventListener('resize', () => {
        if (canvas.dataset.lastExpression) {
            renderMathSurface(canvas, canvas.dataset.lastExpression, viewState);
        }
    });

    equationInput.addEventListener('input', () => {
        canvas.dataset.lastExpression = equationInput.value.trim() || defaultExpression;
    });

    equationInput.value = defaultExpression;
    canvas.dataset.lastExpression = defaultExpression;
    plotCurrentExpression();
}

attachMathSketchControls();

