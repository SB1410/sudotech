/**
 * CyberpunkBackground - Futuristic Animated Background for Web Development Portfolio
 * Features: Neon cityscape, binary particles, circuit patterns, data streams,
 * digital rain, wireframe grids, parallax motion
 * Inspired by Tron Legacy and Blade Runner 2049
 */

class CyberpunkBackground {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }

        this.ctx = this.canvas.getContext('2d');

        // Configuration with defaults
        this.options = {
            buildingCount: options.buildingCount || 25,
            particleCount: options.particleCount || 80,
            rainDropCount: options.rainDropCount || 150,
            dataStreamCount: options.dataStreamCount || 12,
            circuitNodeCount: options.circuitNodeCount || 20,
            animationSpeed: options.animationSpeed || 1,
            parallaxIntensity: options.parallaxIntensity || 0.02,
            ...options
        };

        // Theme colors - will be set by applyTheme
        this.colors = {};
        this.isDarkMode = true; // Default to dark

        // Dark mode (Night) colors
        this.darkColors = {
            bgGradient1: '#0a0a0a',
            bgGradient2: '#1a0033',
            bgGradient3: '#000428',
            neonBlue: '#00BFFF',
            neonPurple: '#8B5CF6',
            neonCyan: '#00FFFF',
            neonPink: '#FF00FF',
            matrixGreen: '#00FF41',
            windowGlow: '#FFD700',
            buildingFill: 'rgba(10, 10, 20, 0.9)',
            gridColor1: 'rgba(0, 191, 255, 0.15)',
            gridColor2: 'rgba(139, 92, 246, 0.1)',
            particleColor: '#00FFFF',
            antennaColor: 'rgba(100, 100, 120, 0.8)',
            skyGlow: null
        };

        // Light mode (Day) colors - futuristic daytime cityscape
        this.lightColors = {
            bgGradient1: '#87CEEB', // Sky blue
            bgGradient2: '#B0E0E6', // Powder blue
            bgGradient3: '#E0F4FF', // Light azure
            neonBlue: '#0077B6',    // Deeper blue for visibility
            neonPurple: '#6B5B95',  // Muted purple
            neonCyan: '#00A8CC',    // Teal cyan
            neonPink: '#E91E8C',    // Vibrant pink
            matrixGreen: '#00875A', // Dark green for visibility
            windowGlow: '#00CED1',  // Turquoise glass reflection
            buildingFill: 'rgba(40, 50, 70, 0.85)',
            gridColor1: 'rgba(0, 119, 182, 0.12)',
            gridColor2: 'rgba(107, 91, 149, 0.08)',
            particleColor: '#0077B6',
            antennaColor: 'rgba(60, 60, 80, 0.7)',
            skyGlow: '#FFE066' // Sun glow
        };

        // Animation state
        this.time = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollY = 0;
        this.animationId = null;
        this.isDestroyed = false;

        // Visual elements
        this.buildings = [];
        this.particles = [];
        this.rainDrops = [];
        this.dataStreams = [];
        this.circuitNodes = [];
        this.gridLines = [];

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.applyTheme(); // Apply theme first
        this.createBuildings();
        this.createParticles();
        this.createRainDrops();
        this.createDataStreams();
        this.createCircuitNodes();
        this.createGridLines();
        this.setupEventListeners();
        this.observeThemeChanges();
        this.animate();
    }

    resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    setupEventListeners() {
        this.resizeHandler = () => {
            this.resizeCanvas();
            this.createBuildings();
            this.createGridLines();
        };
        window.addEventListener('resize', this.resizeHandler);

        this.mouseMoveHandler = (e) => {
            this.mouseX = (e.clientX / this.width - 0.5) * 2;
            this.mouseY = (e.clientY / this.height - 0.5) * 2;
        };
        window.addEventListener('mousemove', this.mouseMoveHandler);

        this.scrollHandler = () => {
            this.scrollY = window.scrollY;
        };
        window.addEventListener('scroll', this.scrollHandler);
    }

    observeThemeChanges() {
        const observer = new MutationObserver(() => {
            this.applyTheme();
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        this.themeObserver = observer;
    }

    applyTheme() {
        this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

        // Apply appropriate color scheme
        if (this.isDarkMode) {
            this.colors = { ...this.darkColors };
        } else {
            this.colors = { ...this.lightColors };
        }

        // Update particle colors for theme
        if (this.particles && this.particles.length > 0) {
            this.particles.forEach(p => {
                p.color = Math.random() > 0.5 ? this.colors.neonCyan : this.colors.neonBlue;
            });
        }
    }

    // ============ CREATE VISUAL ELEMENTS ============

    createBuildings() {
        this.buildings = [];
        const count = this.options.buildingCount;

        for (let i = 0; i < count; i++) {
            const width = 30 + Math.random() * 80;
            const height = 100 + Math.random() * 400;
            const x = (i / count) * this.width * 1.2 - this.width * 0.1;

            // Random neon color for each building
            const neonColors = [this.colors.neonBlue, this.colors.neonPurple, this.colors.neonCyan, this.colors.neonPink];
            const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)];

            // Create windows
            const windows = [];
            const windowRows = Math.floor(height / 25);
            const windowCols = Math.floor(width / 20);
            for (let row = 0; row < windowRows; row++) {
                for (let col = 0; col < windowCols; col++) {
                    if (Math.random() > 0.3) {
                        windows.push({
                            x: col * 20 + 5,
                            y: row * 25 + 10,
                            lit: Math.random() > 0.4,
                            flickerSpeed: 0.5 + Math.random() * 2,
                            flickerOffset: Math.random() * Math.PI * 2
                        });
                    }
                }
            }

            this.buildings.push({
                x,
                y: this.height - height,
                width,
                height,
                neonColor,
                windows,
                layer: Math.random(), // 0-1 for parallax depth
                glowIntensity: 0.3 + Math.random() * 0.4,
                hasAntenna: Math.random() > 0.5,
                antennaHeight: 20 + Math.random() * 30
            });
        }

        // Sort by layer for proper depth rendering
        this.buildings.sort((a, b) => a.layer - b.layer);
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                char: Math.random() > 0.5 ? '0' : '1',
                size: 8 + Math.random() * 12,
                speed: 0.2 + Math.random() * 0.5,
                opacity: 0.1 + Math.random() * 0.4,
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                floatAmplitude: 10 + Math.random() * 30,
                floatSpeed: 0.5 + Math.random() * 1.5,
                floatOffset: Math.random() * Math.PI * 2,
                color: Math.random() > 0.5 ? this.colors.neonCyan : this.colors.neonBlue
            });
        }
    }

    createRainDrops() {
        this.rainDrops = [];
        for (let i = 0; i < this.options.rainDropCount; i++) {
            this.rainDrops.push(this.createRainDrop());
        }
    }

    createRainDrop() {
        // Generate random character (mix of numbers, letters, and symbols)
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height - this.height,
            speed: 2 + Math.random() * 4,
            chars: Array.from({ length: 5 + Math.floor(Math.random() * 10) }, () =>
                chars[Math.floor(Math.random() * chars.length)]
            ),
            opacity: 0.1 + Math.random() * 0.3,
            size: 10 + Math.random() * 4
        };
    }

    createDataStreams() {
        this.dataStreams = [];
        for (let i = 0; i < this.options.dataStreamCount; i++) {
            const startX = Math.random() * this.width;
            const startY = -100 - Math.random() * 200;
            const length = 100 + Math.random() * 300;
            const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // Diagonal with slight variation

            this.dataStreams.push({
                x: startX,
                y: startY,
                length,
                angle,
                speed: 1 + Math.random() * 2,
                thickness: 1 + Math.random() * 2,
                color: Math.random() > 0.5 ? this.colors.neonCyan : this.colors.neonPurple,
                opacity: 0.2 + Math.random() * 0.3,
                segments: Math.floor(length / 10),
                offset: Math.random() * 100
            });
        }
    }

    createCircuitNodes() {
        this.circuitNodes = [];
        for (let i = 0; i < this.options.circuitNodeCount; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;

            // Create connections to nearby nodes
            const connections = [];
            const connectionCount = 1 + Math.floor(Math.random() * 3);

            this.circuitNodes.push({
                x,
                y,
                size: 3 + Math.random() * 5,
                pulseSpeed: 0.5 + Math.random() * 2,
                pulseOffset: Math.random() * Math.PI * 2,
                color: this.colors.neonCyan,
                connections,
                connectionTargets: [] // Will be populated after all nodes created
            });
        }

        // Create connections between nodes
        this.circuitNodes.forEach((node, i) => {
            const nearbyNodes = this.circuitNodes
                .map((n, idx) => ({ node: n, idx, dist: Math.hypot(n.x - node.x, n.y - node.y) }))
                .filter(n => n.idx !== i && n.dist < 200 && n.dist > 20)
                .sort((a, b) => a.dist - b.dist)
                .slice(0, 2);

            node.connectionTargets = nearbyNodes.map(n => n.idx);
        });
    }

    createGridLines() {
        this.gridLines = [];
        const spacing = 60;
        const perspectiveFactor = 0.6;

        // Horizontal lines (with perspective)
        for (let y = this.height * 0.6; y < this.height + spacing; y += spacing) {
            const progress = (y - this.height * 0.6) / (this.height * 0.4);
            this.gridLines.push({
                type: 'horizontal',
                y,
                opacity: 0.1 + progress * 0.15,
                thickness: 0.5 + progress * 1
            });
        }

        // Vertical lines (converging to horizon)
        const horizonY = this.height * 0.5;
        const lineCount = 30;
        for (let i = 0; i < lineCount; i++) {
            const baseX = (i / lineCount) * this.width * 1.5 - this.width * 0.25;
            this.gridLines.push({
                type: 'vertical',
                baseX,
                horizonX: this.width / 2,
                horizonY,
                opacity: 0.08 + Math.random() * 0.08
            });
        }
    }

    // ============ DRAWING METHODS ============

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, this.colors.bgGradient1);
        gradient.addColorStop(0.5, this.colors.bgGradient2);
        gradient.addColorStop(1, this.colors.bgGradient3);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Day mode: Add sun and light rays
        if (!this.isDarkMode) {
            // Sun
            const sunX = this.width * 0.85;
            const sunY = this.height * 0.15;
            const sunRadius = 60;

            // Sun glow
            const sunGlow = this.ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 3);
            sunGlow.addColorStop(0, 'rgba(255, 224, 102, 0.8)');
            sunGlow.addColorStop(0.3, 'rgba(255, 200, 50, 0.3)');
            sunGlow.addColorStop(1, 'rgba(255, 200, 50, 0)');
            this.ctx.fillStyle = sunGlow;
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Sun core
            this.ctx.beginPath();
            this.ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
            const sunCore = this.ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
            sunCore.addColorStop(0, '#FFFACD');
            sunCore.addColorStop(0.5, '#FFE066');
            sunCore.addColorStop(1, '#FFD700');
            this.ctx.fillStyle = sunCore;
            this.ctx.fill();

            // Subtle light rays
            this.ctx.save();
            this.ctx.globalAlpha = 0.1;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + this.time * 0.05;
                const rayLength = 300 + Math.sin(this.time + i) * 50;
                this.ctx.beginPath();
                this.ctx.moveTo(sunX, sunY);
                this.ctx.lineTo(
                    sunX + Math.cos(angle) * rayLength,
                    sunY + Math.sin(angle) * rayLength
                );
                this.ctx.strokeStyle = '#FFE066';
                this.ctx.lineWidth = 20;
                this.ctx.lineCap = 'round';
                this.ctx.stroke();
            }
            this.ctx.restore();

            // Clouds (subtle)
            this.drawClouds();
        } else {
            // Night mode: Add subtle noise texture
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
            for (let i = 0; i < 50; i++) {
                const x = Math.random() * this.width;
                const y = Math.random() * this.height;
                const size = Math.random() * 2;
                this.ctx.fillRect(x, y, size, size);
            }
        }
    }

    drawClouds() {
        // Simple stylized clouds for day mode
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;

        const clouds = [
            { x: this.width * 0.1, y: this.height * 0.12, scale: 1.2 },
            { x: this.width * 0.4, y: this.height * 0.08, scale: 0.8 },
            { x: this.width * 0.6, y: this.height * 0.18, scale: 1.0 },
        ];

        clouds.forEach(cloud => {
            const drift = Math.sin(this.time * 0.2 + cloud.x * 0.01) * 10;
            const cx = cloud.x + drift;
            const cy = cloud.y;
            const s = cloud.scale * 30;

            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';

            // Cloud puffs
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, s, 0, Math.PI * 2);
            this.ctx.arc(cx + s * 1.2, cy, s * 0.8, 0, Math.PI * 2);
            this.ctx.arc(cx - s * 1.1, cy, s * 0.7, 0, Math.PI * 2);
            this.ctx.arc(cx + s * 0.5, cy - s * 0.5, s * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.restore();
    }

    drawGrid() {
        this.ctx.save();

        // Grid colors based on theme
        const hColor = this.isDarkMode ? '0, 191, 255' : '0, 119, 182';
        const vColor = this.isDarkMode ? '139, 92, 246' : '107, 91, 149';
        const opacityMultiplier = this.isDarkMode ? 1 : 0.5;

        // Draw horizontal lines
        this.gridLines.filter(l => l.type === 'horizontal').forEach(line => {
            const waveOffset = Math.sin(this.time * 0.5 + line.y * 0.01) * 2;

            this.ctx.beginPath();
            this.ctx.moveTo(0, line.y + waveOffset);
            this.ctx.lineTo(this.width, line.y + waveOffset);
            this.ctx.strokeStyle = `rgba(${hColor}, ${line.opacity * opacityMultiplier})`;
            this.ctx.lineWidth = line.thickness;
            this.ctx.stroke();
        });

        // Draw vertical converging lines
        this.gridLines.filter(l => l.type === 'vertical').forEach(line => {
            const bottomX = line.baseX + this.mouseX * 20;

            this.ctx.beginPath();
            this.ctx.moveTo(bottomX, this.height);
            this.ctx.lineTo(line.horizonX + this.mouseX * 10, line.horizonY);
            this.ctx.strokeStyle = `rgba(${vColor}, ${line.opacity * opacityMultiplier})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
        });

        this.ctx.restore();
    }

    drawBuildings() {
        this.ctx.save();

        this.buildings.forEach(building => {
            // Parallax offset based on layer depth and mouse position
            const parallaxX = this.mouseX * building.layer * 30 * this.options.parallaxIntensity;
            const parallaxY = this.mouseY * building.layer * 15 * this.options.parallaxIntensity;
            const scrollParallax = this.scrollY * building.layer * 0.1;

            const x = building.x + parallaxX;
            const y = building.y + parallaxY - scrollParallax;

            // Building silhouette - different for day/night
            if (this.isDarkMode) {
                this.ctx.fillStyle = `rgba(10, 10, 20, ${0.7 + building.layer * 0.3})`;
            } else {
                // Day mode: lighter buildings with subtle gradient
                const buildingGradient = this.ctx.createLinearGradient(x, y, x + building.width, y + building.height);
                buildingGradient.addColorStop(0, `rgba(60, 70, 90, ${0.7 + building.layer * 0.2})`);
                buildingGradient.addColorStop(1, `rgba(40, 50, 70, ${0.8 + building.layer * 0.15})`);
                this.ctx.fillStyle = buildingGradient;
            }
            this.ctx.fillRect(x, y, building.width, building.height);

            // Outline glow - stronger at night, subtle during day
            const glowPulse = Math.sin(this.time * 2 + building.x * 0.01) * 0.2 + 0.8;
            if (this.isDarkMode) {
                this.ctx.shadowColor = building.neonColor;
                this.ctx.shadowBlur = 15 * building.glowIntensity * glowPulse;
                this.ctx.strokeStyle = building.neonColor;
            } else {
                this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
                this.ctx.shadowBlur = 3;
                this.ctx.strokeStyle = 'rgba(120, 140, 180, 0.6)';
            }
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, building.width, building.height);
            this.ctx.shadowBlur = 0;

            // Draw windows
            building.windows.forEach(win => {
                if (win.lit) {
                    const windowX = x + win.x;
                    const windowY = y + win.y;

                    if (this.isDarkMode) {
                        // Night: warm yellow glow
                        const flicker = Math.sin(this.time * win.flickerSpeed + win.flickerOffset) > 0 ? 1 : 0.3;
                        this.ctx.fillStyle = `rgba(255, 215, 0, ${0.6 * flicker})`;
                        this.ctx.shadowColor = this.colors.windowGlow;
                        this.ctx.shadowBlur = 5 * flicker;
                    } else {
                        // Day: glass reflection (cyan/white shimmer)
                        const shimmer = Math.sin(this.time * 1.5 + win.flickerOffset) * 0.3 + 0.7;
                        this.ctx.fillStyle = `rgba(0, 206, 209, ${0.4 * shimmer})`;
                        this.ctx.shadowColor = '#00CED1';
                        this.ctx.shadowBlur = 2;
                    }
                    this.ctx.fillRect(windowX, windowY, 8, 12);
                    this.ctx.shadowBlur = 0;
                }
            });

            // Rooftop antenna/spire with blinking light (uses stored properties)
            if (building.hasAntenna) {
                const antennaX = x + building.width / 2;

                this.ctx.beginPath();
                this.ctx.moveTo(antennaX, y);
                this.ctx.lineTo(antennaX, y - building.antennaHeight);
                this.ctx.strokeStyle = this.colors.antennaColor;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Blinking light (more visible at night)
                const blink = Math.sin(this.time * 3 + building.x) > 0.5;
                if (blink) {
                    this.ctx.beginPath();
                    this.ctx.arc(antennaX, y - building.antennaHeight, 3, 0, Math.PI * 2);
                    this.ctx.fillStyle = '#FF0000';
                    this.ctx.shadowColor = '#FF0000';
                    this.ctx.shadowBlur = this.isDarkMode ? 10 : 3;
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                }
            }
        });

        this.ctx.restore();
    }

    drawCircuitPatterns() {
        this.ctx.save();

        this.circuitNodes.forEach((node, i) => {
            const pulse = Math.sin(this.time * node.pulseSpeed + node.pulseOffset) * 0.5 + 0.5;

            // Draw connections first
            node.connectionTargets.forEach(targetIdx => {
                const target = this.circuitNodes[targetIdx];
                if (!target) return;

                const energyPos = (this.time * 0.5 + node.pulseOffset) % 1;

                // Connection line
                this.ctx.beginPath();
                this.ctx.moveTo(node.x, node.y);
                this.ctx.lineTo(target.x, target.y);
                this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 + pulse * 0.1})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();

                // Energy pulse along the line
                const pulseX = node.x + (target.x - node.x) * energyPos;
                const pulseY = node.y + (target.y - node.y) * energyPos;

                this.ctx.beginPath();
                this.ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 255, 255, ${pulse * 0.8})`;
                this.ctx.shadowColor = this.colors.neonCyan;
                this.ctx.shadowBlur = 8;
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            });

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 255, ${0.3 + pulse * 0.4})`;
            this.ctx.shadowColor = node.color;
            this.ctx.shadowBlur = 10 * pulse;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        this.ctx.restore();
    }

    drawBinaryParticles() {
        this.ctx.save();
        this.ctx.font = 'bold 12px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.particles.forEach(particle => {
            const floatY = Math.sin(this.time * particle.floatSpeed + particle.floatOffset) * particle.floatAmplitude;
            const x = particle.x;
            const y = particle.y + floatY;

            // Rotate the character slightly
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(particle.angle + Math.sin(this.time * particle.rotationSpeed) * 0.2);

            const pulse = Math.sin(this.time * 2 + particle.floatOffset) * 0.3 + 0.7;

            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity * pulse;
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 5;
            this.ctx.font = `bold ${particle.size}px "Courier New", monospace`;
            this.ctx.fillText(particle.char, 0, 0);

            this.ctx.restore();
        });

        this.ctx.restore();
    }

    drawDigitalRain() {
        // Only show digital rain in dark mode (night)
        if (!this.isDarkMode) return;

        this.ctx.save();
        this.ctx.font = '12px "MS Gothic", "Courier New", monospace';
        this.ctx.textAlign = 'center';

        this.rainDrops.forEach((drop, idx) => {
            drop.chars.forEach((char, charIdx) => {
                const y = drop.y + charIdx * 15;
                if (y < 0 || y > this.height) return;

                // Fade effect - brighter at the head
                const fadeProgress = charIdx / drop.chars.length;
                const brightness = 1 - fadeProgress * 0.7;
                const alpha = drop.opacity * brightness;

                this.ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
                if (charIdx === 0) {
                    // Head of the rain drop is brighter
                    this.ctx.fillStyle = `rgba(180, 255, 180, ${alpha * 1.5})`;
                    this.ctx.shadowColor = this.colors.matrixGreen;
                    this.ctx.shadowBlur = 8;
                }

                this.ctx.font = `${drop.size}px "MS Gothic", "Courier New", monospace`;
                this.ctx.fillText(char, drop.x, y);
                this.ctx.shadowBlur = 0;
            });
        });

        this.ctx.restore();
    }

    drawDataStreams() {
        this.ctx.save();

        this.dataStreams.forEach(stream => {
            const x = stream.x;
            const y = stream.y;

            const gradient = this.ctx.createLinearGradient(
                x, y,
                x + Math.cos(stream.angle) * stream.length,
                y + Math.sin(stream.angle) * stream.length
            );

            gradient.addColorStop(0, `rgba(0, 191, 255, 0)`);
            gradient.addColorStop(0.3, `rgba(139, 92, 246, ${stream.opacity})`);
            gradient.addColorStop(0.7, `rgba(0, 255, 255, ${stream.opacity})`);
            gradient.addColorStop(1, `rgba(0, 191, 255, 0)`);

            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(
                x + Math.cos(stream.angle) * stream.length,
                y + Math.sin(stream.angle) * stream.length
            );
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = stream.thickness;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            // Add glowing dots along the stream
            for (let i = 0; i < stream.segments; i++) {
                const progress = (i / stream.segments + (this.time * 0.1 + stream.offset)) % 1;
                const dotX = x + Math.cos(stream.angle) * stream.length * progress;
                const dotY = y + Math.sin(stream.angle) * stream.length * progress;

                this.ctx.beginPath();
                this.ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 255, 255, ${stream.opacity * 1.5 * (1 - Math.abs(progress - 0.5) * 2)})`;
                this.ctx.fill();
            }
        });

        this.ctx.restore();
    }

    // ============ UPDATE METHODS ============

    updateParticles() {
        this.particles.forEach(particle => {
            particle.y -= particle.speed * this.options.animationSpeed;
            particle.angle += particle.rotationSpeed;

            // Reset if out of view
            if (particle.y < -50) {
                particle.y = this.height + 50;
                particle.x = Math.random() * this.width;
            }
        });
    }

    updateRainDrops() {
        this.rainDrops.forEach((drop, idx) => {
            drop.y += drop.speed * this.options.animationSpeed;

            // Reset if out of view
            if (drop.y > this.height + drop.chars.length * 15) {
                this.rainDrops[idx] = this.createRainDrop();
                this.rainDrops[idx].y = -drop.chars.length * 15;
            }

            // Randomly change characters
            if (Math.random() > 0.98) {
                const charIdx = Math.floor(Math.random() * drop.chars.length);
                const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
                drop.chars[charIdx] = chars[Math.floor(Math.random() * chars.length)];
            }
        });
    }

    updateDataStreams() {
        this.dataStreams.forEach((stream, idx) => {
            stream.y += stream.speed * this.options.animationSpeed;
            stream.x += Math.cos(stream.angle) * stream.speed * 0.5;

            // Reset if out of view
            if (stream.y > this.height + stream.length) {
                stream.y = -stream.length;
                stream.x = Math.random() * this.width;
            }
        });
    }

    // ============ ANIMATION LOOP ============

    animate() {
        if (this.isDestroyed) return;

        this.time += 0.016 * this.options.animationSpeed; // ~60fps

        // Clear and draw
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw layers in order (back to front)
        this.drawBackground();
        this.drawGrid();
        this.drawCircuitPatterns();
        this.drawBuildings();
        this.drawDataStreams();
        this.drawBinaryParticles();
        this.drawDigitalRain();

        // Update positions
        this.updateParticles();
        this.updateRainDrops();
        this.updateDataStreams();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        this.isDestroyed = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeHandler);
        window.removeEventListener('mousemove', this.mouseMoveHandler);
        window.removeEventListener('scroll', this.scrollHandler);
        if (this.themeObserver) {
            this.themeObserver.disconnect();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('cyberpunk-bg-canvas');
    if (canvas) {
        window.cyberpunkBgInstance = new CyberpunkBackground('cyberpunk-bg-canvas', {
            buildingCount: 25,
            particleCount: 60,
            rainDropCount: 100,
            dataStreamCount: 15,
            circuitNodeCount: 25,
            animationSpeed: 1,
            parallaxIntensity: 0.03
        });
    }
});
