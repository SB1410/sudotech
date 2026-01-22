/**
 * PhotographyBackground - Unique Animated Background for Product Photography
 * DARK MODE: Bokeh light circles, aperture animations, lens flares
 * LIGHT MODE: Floating polaroids, soft geometric shapes, clean studio aesthetic
 * Supports both dark and light themes with distinct designs.
 */

class PhotographyBackground {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }

        this.ctx = this.canvas.getContext('2d');

        // Theme color palettes
        this.themes = {
            dark: {
                bgColor: '#0a0a0f',
                bgGradient1: '#0f0f18',
                bgGradient2: '#050508',
                bokehColors: ['#f59e0b', '#fbbf24', '#f472b6', '#a78bfa', '#38bdf8', '#ffffff'],
                apertureColor: '#fbbf24',
                lensFlareColor: '#fef3c7',
                gridColor: 'rgba(251, 191, 36, 0.03)'
            },
            light: {
                bgColor: '#f8f7f4',
                bgGradient1: '#ffffff',
                bgGradient2: '#f3f1ed',
                polaroidBorder: '#ffffff',
                polaroidShadow: 'rgba(0, 0, 0, 0.08)',
                accentColors: ['#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'],
                lineColor: 'rgba(0, 0, 0, 0.04)',
                shapeColors: ['#fef3c7', '#fce7f3', '#ede9fe', '#cffafe', '#d1fae5']
            }
        };

        this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

        this.config = {
            // Dark mode config
            bokehCount: options.bokehCount || 35,
            apertureCount: options.apertureCount || 3,
            lensFlareCount: options.lensFlareCount || 4,
            // Light mode config
            polaroidCount: options.polaroidCount || 8,
            shapeCount: options.shapeCount || 12,
            animationSpeed: options.animationSpeed || 1,
        };

        this.applyTheme();

        // Dark mode elements
        this.bokehCircles = [];
        this.apertures = [];
        this.lensFlares = [];

        // Light mode elements
        this.polaroids = [];
        this.shapes = [];
        this.floatingLines = [];

        this.time = 0;
        this.animationId = null;

        this.init();
    }

    applyTheme() {
        const theme = this.isDarkMode ? this.themes.dark : this.themes.light;
        this.colors = theme;
    }

    init() {
        this.resizeCanvas();
        this.createElements();

        window.addEventListener('resize', () => this.resizeCanvas());
        this.observeThemeChanges();
        this.animate();
    }

    observeThemeChanges() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
                    this.applyTheme();
                    this.createElements();
                }
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createElements();
    }

    createElements() {
        if (this.isDarkMode) {
            this.createBokeh();
            this.createApertures();
            this.createLensFlares();
        } else {
            this.createPolaroids();
            this.createShapes();
            this.createFloatingLines();
        }
    }

    // ==================== DARK MODE ELEMENTS ====================

    createBokeh() {
        this.bokehCircles = [];
        for (let i = 0; i < this.config.bokehCount; i++) {
            this.bokehCircles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 20 + Math.random() * 80,
                color: this.colors.bokehColors[Math.floor(Math.random() * this.colors.bokehColors.length)],
                opacity: 0.03 + Math.random() * 0.08,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.2,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.005 + Math.random() * 0.01,
                blur: 0.3 + Math.random() * 0.7
            });
        }
    }

    createApertures() {
        this.apertures = [];
        for (let i = 0; i < this.config.apertureCount; i++) {
            this.apertures.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 60 + Math.random() * 100,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.003,
                openAmount: 0.3 + Math.random() * 0.4,
                pulsePhase: Math.random() * Math.PI * 2,
                opacity: 0.08 + Math.random() * 0.06,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15
            });
        }
    }

    createLensFlares() {
        this.lensFlares = [];
        for (let i = 0; i < this.config.lensFlareCount; i++) {
            this.lensFlares.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 150 + Math.random() * 200,
                angle: Math.random() * Math.PI * 2,
                opacity: 0.02 + Math.random() * 0.03,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    // ==================== LIGHT MODE ELEMENTS ====================

    createPolaroids() {
        this.polaroids = [];
        for (let i = 0; i < this.config.polaroidCount; i++) {
            this.polaroids.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                width: 60 + Math.random() * 40,
                rotation: (Math.random() - 0.5) * 0.4,
                rotationSpeed: (Math.random() - 0.5) * 0.002,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.2,
                bobPhase: Math.random() * Math.PI * 2,
                bobSpeed: 0.008 + Math.random() * 0.005,
                imageColor: this.colors.accentColors[Math.floor(Math.random() * this.colors.accentColors.length)],
                opacity: 0.6 + Math.random() * 0.3
            });
        }
    }

    createShapes() {
        this.shapes = [];
        const shapeTypes = ['circle', 'ring', 'square', 'diamond'];
        for (let i = 0; i < this.config.shapeCount; i++) {
            this.shapes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 30 + Math.random() * 60,
                type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                color: this.colors.shapeColors[Math.floor(Math.random() * this.colors.shapeColors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.005,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.15,
                opacity: 0.4 + Math.random() * 0.3,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    createFloatingLines() {
        this.floatingLines = [];
        for (let i = 0; i < 6; i++) {
            this.floatingLines.push({
                x1: Math.random() * this.canvas.width,
                y1: Math.random() * this.canvas.height,
                length: 100 + Math.random() * 200,
                angle: Math.random() * Math.PI * 2,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1,
                rotationSpeed: (Math.random() - 0.5) * 0.002
            });
        }
    }

    // ==================== DARK MODE DRAWING ====================

    drawDarkBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width * 0.3, this.canvas.height * 0.3, 0,
            this.canvas.width * 0.5, this.canvas.height * 0.5, this.canvas.width * 0.8
        );
        gradient.addColorStop(0, this.colors.bgGradient1);
        gradient.addColorStop(0.5, this.colors.bgColor);
        gradient.addColorStop(1, this.colors.bgGradient2);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Vignette
        const vignette = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.height * 0.2,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.8
        );
        vignette.addColorStop(0, 'transparent');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        this.ctx.fillStyle = vignette;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid
        this.ctx.strokeStyle = this.colors.gridColor;
        this.ctx.lineWidth = 1;
        const gridSize = 80;
        const offsetX = (this.time * 0.05) % gridSize;
        const offsetY = (this.time * 0.03) % gridSize;

        for (let y = -gridSize + offsetY; y < this.canvas.height + gridSize; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        for (let x = -gridSize + offsetX; x < this.canvas.width + gridSize; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
    }

    drawBokeh() {
        for (const bokeh of this.bokehCircles) {
            const pulse = 1 + Math.sin(this.time * bokeh.pulseSpeed + bokeh.pulsePhase) * 0.15;
            const currentRadius = bokeh.radius * pulse;
            const currentOpacity = bokeh.opacity * (0.8 + Math.sin(this.time * bokeh.pulseSpeed * 0.5 + bokeh.pulsePhase) * 0.2);

            const gradient = this.ctx.createRadialGradient(
                bokeh.x, bokeh.y, 0,
                bokeh.x, bokeh.y, currentRadius
            );

            const alpha = Math.floor(currentOpacity * 255).toString(16).padStart(2, '0');
            const alphaHalf = Math.floor(currentOpacity * 0.5 * 255).toString(16).padStart(2, '0');
            const alphaQuarter = Math.floor(currentOpacity * 0.25 * 255).toString(16).padStart(2, '0');

            gradient.addColorStop(0, bokeh.color + alphaQuarter);
            gradient.addColorStop(0.6 * bokeh.blur, bokeh.color + alphaHalf);
            gradient.addColorStop(0.85, bokeh.color + alpha);
            gradient.addColorStop(1, bokeh.color + '00');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(bokeh.x, bokeh.y, currentRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawApertures() {
        for (const aperture of this.apertures) {
            this.ctx.save();
            this.ctx.translate(aperture.x, aperture.y);
            this.ctx.rotate(aperture.rotation);

            const breathe = Math.sin(this.time * 0.008 + aperture.pulsePhase) * 0.1;
            const openness = aperture.openAmount + breathe;

            this.ctx.globalAlpha = aperture.opacity;
            this.ctx.strokeStyle = this.colors.apertureColor;
            this.ctx.lineWidth = 2;

            const bladeCount = 8;
            const outerRadius = aperture.radius;
            const innerRadius = outerRadius * openness;

            for (let i = 0; i < bladeCount; i++) {
                const angle1 = (i / bladeCount) * Math.PI * 2;
                const angle2 = ((i + 0.5) / bladeCount) * Math.PI * 2;
                const angle3 = ((i + 1) / bladeCount) * Math.PI * 2;

                this.ctx.beginPath();
                const ox = Math.cos(angle1) * outerRadius;
                const oy = Math.sin(angle1) * outerRadius;
                const ix1 = Math.cos(angle2) * innerRadius;
                const iy1 = Math.sin(angle2) * innerRadius;
                const ox2 = Math.cos(angle3) * outerRadius;
                const oy2 = Math.sin(angle3) * outerRadius;

                this.ctx.moveTo(ox, oy);
                this.ctx.quadraticCurveTo(ix1, iy1, ox2, oy2);
                this.ctx.stroke();
            }

            this.ctx.beginPath();
            this.ctx.arc(0, 0, innerRadius * 0.5, 0, Math.PI * 2);
            this.ctx.stroke();

            this.ctx.restore();
        }
    }

    drawLensFlares() {
        for (const flare of this.lensFlares) {
            const pulse = 0.8 + Math.sin(this.time * 0.01 + flare.pulsePhase) * 0.2;

            this.ctx.save();
            this.ctx.translate(flare.x, flare.y);
            this.ctx.rotate(flare.angle);

            const gradient = this.ctx.createLinearGradient(-flare.size * pulse, 0, flare.size * pulse, 0);
            const alpha = Math.floor(flare.opacity * 255).toString(16).padStart(2, '0');
            gradient.addColorStop(0, this.colors.lensFlareColor + '00');
            gradient.addColorStop(0.3, this.colors.lensFlareColor + alpha);
            gradient.addColorStop(0.5, this.colors.lensFlareColor + Math.floor(flare.opacity * 1.5 * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(0.7, this.colors.lensFlareColor + alpha);
            gradient.addColorStop(1, this.colors.lensFlareColor + '00');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, flare.size * pulse, flare.size * 0.02, 0, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.rotate(Math.PI / 2);
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, flare.size * pulse * 0.6, flare.size * 0.015, 0, 0, Math.PI * 2);
            this.ctx.fill();

            const centerGlow = this.ctx.createRadialGradient(0, 0, 0, 0, 0, flare.size * 0.15);
            centerGlow.addColorStop(0, this.colors.lensFlareColor + Math.floor(flare.opacity * 2 * 255).toString(16).padStart(2, '0'));
            centerGlow.addColorStop(1, this.colors.lensFlareColor + '00');
            this.ctx.fillStyle = centerGlow;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, flare.size * 0.15, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    drawDarkShutterFrame() {
        const margin = 40;
        const cornerSize = 30;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        this.ctx.lineWidth = 2;

        // Corners
        this.ctx.beginPath();
        this.ctx.moveTo(margin, margin + cornerSize);
        this.ctx.lineTo(margin, margin);
        this.ctx.lineTo(margin + cornerSize, margin);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width - margin - cornerSize, margin);
        this.ctx.lineTo(this.canvas.width - margin, margin);
        this.ctx.lineTo(this.canvas.width - margin, margin + cornerSize);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(margin, this.canvas.height - margin - cornerSize);
        this.ctx.lineTo(margin, this.canvas.height - margin);
        this.ctx.lineTo(margin + cornerSize, this.canvas.height - margin);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width - margin - cornerSize, this.canvas.height - margin);
        this.ctx.lineTo(this.canvas.width - margin, this.canvas.height - margin);
        this.ctx.lineTo(this.canvas.width - margin, this.canvas.height - margin - cornerSize);
        this.ctx.stroke();

        // Center focus
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const focusSize = 20;

        this.ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - focusSize, centerY);
        this.ctx.lineTo(centerX - focusSize / 3, centerY);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(centerX + focusSize / 3, centerY);
        this.ctx.lineTo(centerX + focusSize, centerY);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - focusSize);
        this.ctx.lineTo(centerX, centerY - focusSize / 3);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY + focusSize / 3);
        this.ctx.lineTo(centerX, centerY + focusSize);
        this.ctx.stroke();
    }

    // ==================== LIGHT MODE DRAWING ====================

    drawLightBackground() {
        // Clean gradient
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, this.colors.bgGradient1);
        gradient.addColorStop(0.5, this.colors.bgColor);
        gradient.addColorStop(1, this.colors.bgGradient2);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Subtle warm glow in corner
        const warmGlow = this.ctx.createRadialGradient(
            this.canvas.width * 0.8, this.canvas.height * 0.2, 0,
            this.canvas.width * 0.8, this.canvas.height * 0.2, this.canvas.width * 0.5
        );
        warmGlow.addColorStop(0, 'rgba(254, 243, 199, 0.3)');
        warmGlow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = warmGlow;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawFloatingLines() {
        this.ctx.strokeStyle = this.colors.lineColor;
        this.ctx.lineWidth = 1;

        for (const line of this.floatingLines) {
            const x2 = line.x1 + Math.cos(line.angle) * line.length;
            const y2 = line.y1 + Math.sin(line.angle) * line.length;

            this.ctx.beginPath();
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    drawShapes() {
        for (const shape of this.shapes) {
            this.ctx.save();
            this.ctx.translate(shape.x, shape.y);
            this.ctx.rotate(shape.rotation);

            const pulse = 1 + Math.sin(this.time * 0.01 + shape.pulsePhase) * 0.05;
            this.ctx.globalAlpha = shape.opacity;

            switch (shape.type) {
                case 'circle':
                    this.ctx.fillStyle = shape.color;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, shape.size * pulse / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;

                case 'ring':
                    this.ctx.strokeStyle = shape.color;
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, shape.size * pulse / 2, 0, Math.PI * 2);
                    this.ctx.stroke();
                    break;

                case 'square':
                    this.ctx.fillStyle = shape.color;
                    const halfSize = shape.size * pulse / 2;
                    this.ctx.beginPath();
                    this.ctx.roundRect(-halfSize, -halfSize, shape.size * pulse, shape.size * pulse, 4);
                    this.ctx.fill();
                    break;

                case 'diamond':
                    this.ctx.fillStyle = shape.color;
                    const s = shape.size * pulse / 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -s);
                    this.ctx.lineTo(s, 0);
                    this.ctx.lineTo(0, s);
                    this.ctx.lineTo(-s, 0);
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;
            }

            this.ctx.restore();
        }
    }

    drawPolaroids() {
        for (const polaroid of this.polaroids) {
            this.ctx.save();

            const bob = Math.sin(this.time * polaroid.bobSpeed + polaroid.bobPhase) * 3;
            this.ctx.translate(polaroid.x, polaroid.y + bob);
            this.ctx.rotate(polaroid.rotation);
            this.ctx.globalAlpha = polaroid.opacity;

            const w = polaroid.width;
            const h = w * 1.2;
            const border = w * 0.1;
            const bottomBorder = w * 0.25;

            // Shadow
            this.ctx.shadowColor = this.colors.polaroidShadow;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowOffsetX = 3;
            this.ctx.shadowOffsetY = 5;

            // White frame
            this.ctx.fillStyle = this.colors.polaroidBorder;
            this.ctx.beginPath();
            this.ctx.roundRect(-w / 2 - border, -h / 2 - border, w + border * 2, h + border + bottomBorder, 3);
            this.ctx.fill();

            // Reset shadow
            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;

            // Photo area with color
            const photoGradient = this.ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
            photoGradient.addColorStop(0, polaroid.imageColor + '40');
            photoGradient.addColorStop(1, polaroid.imageColor + '20');
            this.ctx.fillStyle = photoGradient;
            this.ctx.fillRect(-w / 2, -h / 2, w, h);

            // Simple landscape silhouette
            this.ctx.fillStyle = polaroid.imageColor + '60';
            this.ctx.beginPath();
            this.ctx.moveTo(-w / 2, h / 2);
            this.ctx.lineTo(-w / 4, h / 6);
            this.ctx.lineTo(0, h / 3);
            this.ctx.lineTo(w / 4, -h / 6);
            this.ctx.lineTo(w / 2, h / 4);
            this.ctx.lineTo(w / 2, h / 2);
            this.ctx.closePath();
            this.ctx.fill();

            // Sun circle
            this.ctx.fillStyle = polaroid.imageColor + '80';
            this.ctx.beginPath();
            this.ctx.arc(w / 4, -h / 4, w * 0.1, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    // ==================== UPDATE FUNCTIONS ====================

    updateDarkElements() {
        // Bokeh
        for (const bokeh of this.bokehCircles) {
            bokeh.x += bokeh.vx * this.config.animationSpeed;
            bokeh.y += bokeh.vy * this.config.animationSpeed;
            if (bokeh.x < -bokeh.radius) bokeh.x = this.canvas.width + bokeh.radius;
            if (bokeh.x > this.canvas.width + bokeh.radius) bokeh.x = -bokeh.radius;
            if (bokeh.y < -bokeh.radius) bokeh.y = this.canvas.height + bokeh.radius;
            if (bokeh.y > this.canvas.height + bokeh.radius) bokeh.y = -bokeh.radius;
        }

        // Apertures
        for (const aperture of this.apertures) {
            aperture.x += aperture.vx * this.config.animationSpeed;
            aperture.y += aperture.vy * this.config.animationSpeed;
            aperture.rotation += aperture.rotationSpeed * this.config.animationSpeed;
            if (aperture.x < aperture.radius || aperture.x > this.canvas.width - aperture.radius) aperture.vx *= -1;
            if (aperture.y < aperture.radius || aperture.y > this.canvas.height - aperture.radius) aperture.vy *= -1;
        }

        // Lens flares
        for (const flare of this.lensFlares) {
            flare.x += flare.vx * this.config.animationSpeed;
            flare.y += flare.vy * this.config.animationSpeed;
            flare.angle += 0.001 * this.config.animationSpeed;
            if (flare.x < -flare.size) flare.x = this.canvas.width + flare.size;
            if (flare.x > this.canvas.width + flare.size) flare.x = -flare.size;
            if (flare.y < -flare.size) flare.y = this.canvas.height + flare.size;
            if (flare.y > this.canvas.height + flare.size) flare.y = -flare.size;
        }
    }

    updateLightElements() {
        // Polaroids
        for (const polaroid of this.polaroids) {
            polaroid.x += polaroid.vx * this.config.animationSpeed;
            polaroid.y += polaroid.vy * this.config.animationSpeed;
            polaroid.rotation += polaroid.rotationSpeed * this.config.animationSpeed;

            const buffer = polaroid.width;
            if (polaroid.x < -buffer) polaroid.x = this.canvas.width + buffer;
            if (polaroid.x > this.canvas.width + buffer) polaroid.x = -buffer;
            if (polaroid.y < -buffer) polaroid.y = this.canvas.height + buffer;
            if (polaroid.y > this.canvas.height + buffer) polaroid.y = -buffer;
        }

        // Shapes
        for (const shape of this.shapes) {
            shape.x += shape.vx * this.config.animationSpeed;
            shape.y += shape.vy * this.config.animationSpeed;
            shape.rotation += shape.rotationSpeed * this.config.animationSpeed;

            if (shape.x < -shape.size) shape.x = this.canvas.width + shape.size;
            if (shape.x > this.canvas.width + shape.size) shape.x = -shape.size;
            if (shape.y < -shape.size) shape.y = this.canvas.height + shape.size;
            if (shape.y > this.canvas.height + shape.size) shape.y = -shape.size;
        }

        // Lines
        for (const line of this.floatingLines) {
            line.x1 += line.vx * this.config.animationSpeed;
            line.y1 += line.vy * this.config.animationSpeed;
            line.angle += line.rotationSpeed * this.config.animationSpeed;

            if (line.x1 < -line.length) line.x1 = this.canvas.width + line.length;
            if (line.x1 > this.canvas.width + line.length) line.x1 = -line.length;
            if (line.y1 < -line.length) line.y1 = this.canvas.height + line.length;
            if (line.y1 > this.canvas.height + line.length) line.y1 = -line.length;
        }
    }

    animate() {
        this.time++;

        if (this.isDarkMode) {
            this.drawDarkBackground();
            this.drawBokeh();
            this.drawApertures();
            this.drawLensFlares();
            this.drawDarkShutterFrame();
            this.updateDarkElements();
        } else {
            this.drawLightBackground();
            this.drawFloatingLines();
            this.drawShapes();
            this.drawPolaroids();
            this.updateLightElements();
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('photography-bg-canvas');
    if (canvas) {
        window.photographyBgInstance = new PhotographyBackground('photography-bg-canvas', {
            bokehCount: 30,
            apertureCount: 3,
            lensFlareCount: 4,
            polaroidCount: 8,
            shapeCount: 12,
            animationSpeed: 0.8
        });
    }
});
