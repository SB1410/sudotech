/**
 * VideoEditingBackground - Modern Animated Background for Video Editing Services
 * Features floating camera icons, video cameras, film reels, and editing tools
 * with smooth animations and a clean, professional aesthetic.
 * Supports both dark and light themes.
 */

class VideoEditingBackground {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }

        this.ctx = this.canvas.getContext('2d');

        // Theme color palettes - Modern purple/coral theme
        this.themes = {
            dark: {
                bgColor: '#0d0d1a',
                bgGradient1: '#1a1a2e',
                bgGradient2: '#0d0d1a',
                bgGradient3: '#16162a',
                primaryColor: '#8b5cf6',       // Purple
                secondaryColor: '#f97316',     // Orange/Coral
                accentColor: '#06b6d4',        // Cyan
                iconOpacity: 0.55,
                glowIntensity: 0.5
            },
            light: {
                bgColor: '#faf8ff',
                bgGradient1: '#f5f3ff',
                bgGradient2: '#fff7ed',
                bgGradient3: '#faf8ff',
                primaryColor: '#7c3aed',       // Darker purple
                secondaryColor: '#ea580c',     // Darker orange
                accentColor: '#0891b2',        // Darker cyan
                iconOpacity: 0.45,
                glowIntensity: 0.4
            }
        };

        // Detect initial theme
        this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

        // Configuration
        this.config = {
            iconCount: options.iconCount || 25,
            orbCount: options.orbCount || 6,
            animationSpeed: options.animationSpeed || 1,
        };

        this.applyTheme();

        this.icons = [];
        this.orbs = [];
        this.connections = [];
        this.time = 0;
        this.animationId = null;
        this.mouseX = -1000;
        this.mouseY = -1000;

        this.init();
    }

    applyTheme() {
        const theme = this.isDarkMode ? this.themes.dark : this.themes.light;
        this.colors = theme;
    }

    init() {
        this.resizeCanvas();
        this.createIcons();
        this.createOrbs();

        window.addEventListener('resize', () => this.resizeCanvas());
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
        });

        this.observeThemeChanges();
        this.animate();
    }

    observeThemeChanges() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
                    this.applyTheme();
                    // Update icon colors
                    this.icons.forEach(icon => {
                        icon.color = this.getRandomColor();
                    });
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

        if (this.icons.length > 0) {
            this.createIcons();
            this.createOrbs();
        }
    }

    getRandomColor() {
        const colors = [this.colors.primaryColor, this.colors.secondaryColor, this.colors.accentColor];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createIcons() {
        this.icons = [];
        const iconTypes = [
            'camera', 'videoCamera', 'filmReel', 'clapperboard',
            'play', 'record', 'microphone', 'lens', 'tripod', 'slider'
        ];

        for (let i = 0; i < this.config.iconCount; i++) {
            this.icons.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: iconTypes[Math.floor(Math.random() * iconTypes.length)],
                size: 25 + Math.random() * 35,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.008,
                baseVx: (Math.random() - 0.5) * 0.4,
                baseVy: (Math.random() - 0.5) * 0.4,
                vx: 0,
                vy: 0,
                opacity: 0.1 + Math.random() * 0.15,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.01,
                color: this.getRandomColor(),
                bobPhase: Math.random() * Math.PI * 2,
                bobSpeed: 0.01 + Math.random() * 0.01,
                bobAmount: 0.5 + Math.random() * 1
            });
        }
    }

    createOrbs() {
        this.orbs = [];

        for (let i = 0; i < this.config.orbCount; i++) {
            this.orbs.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 100 + Math.random() * 200,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                color: this.getRandomColor(),
                opacity: 0.03 + Math.random() * 0.04,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    drawBackground() {
        // Create a subtle gradient background
        const gradient = this.ctx.createLinearGradient(
            0, 0,
            this.canvas.width * 0.5,
            this.canvas.height
        );
        gradient.addColorStop(0, this.colors.bgGradient1);
        gradient.addColorStop(0.5, this.colors.bgColor);
        gradient.addColorStop(1, this.colors.bgGradient2);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Subtle radial gradient overlay
        const radialGradient = this.ctx.createRadialGradient(
            this.canvas.width * 0.3, this.canvas.height * 0.3, 0,
            this.canvas.width * 0.3, this.canvas.height * 0.3, this.canvas.width * 0.7
        );
        radialGradient.addColorStop(0, this.isDarkMode ? 'rgba(139, 92, 246, 0.05)' : 'rgba(124, 58, 237, 0.03)');
        radialGradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = radialGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawOrbs() {
        for (const orb of this.orbs) {
            const pulse = 1 + Math.sin(this.time * 0.001 + orb.pulsePhase) * 0.2;
            const gradient = this.ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.radius * pulse
            );

            gradient.addColorStop(0, orb.color + Math.floor(orb.opacity * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(0.5, orb.color + Math.floor(orb.opacity * 0.5 * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(orb.x, orb.y, orb.radius * pulse, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawIcons() {
        for (const icon of this.icons) {
            this.ctx.save();
            this.ctx.translate(icon.x, icon.y);
            this.ctx.rotate(icon.rotation);

            // Smooth pulse effect
            const pulse = 1 + Math.sin(this.time * icon.pulseSpeed + icon.pulsePhase) * 0.08;
            this.ctx.scale(pulse, pulse);

            const opacity = Math.min(icon.opacity * this.colors.iconOpacity * 5, 0.85);
            this.ctx.globalAlpha = opacity;

            // Soft glow effect
            const glowSize = icon.size * 2.5;
            const glowGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
            glowGradient.addColorStop(0, icon.color + '20');
            glowGradient.addColorStop(0.5, icon.color + '10');
            glowGradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
            this.ctx.fill();

            // Set icon style
            this.ctx.strokeStyle = icon.color;
            this.ctx.fillStyle = icon.color;
            this.ctx.lineWidth = 1.5;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';

            // Draw icon
            switch (icon.type) {
                case 'camera':
                    this.drawCameraIcon(icon.size);
                    break;
                case 'videoCamera':
                    this.drawVideoCameraIcon(icon.size);
                    break;
                case 'filmReel':
                    this.drawFilmReelIcon(icon.size);
                    break;
                case 'clapperboard':
                    this.drawClapperboardIcon(icon.size);
                    break;
                case 'play':
                    this.drawPlayIcon(icon.size);
                    break;
                case 'record':
                    this.drawRecordIcon(icon.size);
                    break;
                case 'microphone':
                    this.drawMicrophoneIcon(icon.size);
                    break;
                case 'lens':
                    this.drawLensIcon(icon.size);
                    break;
                case 'tripod':
                    this.drawTripodIcon(icon.size);
                    break;
                case 'slider':
                    this.drawSliderIcon(icon.size);
                    break;
            }

            this.ctx.restore();
        }
    }

    // Camera (DSLR style)
    drawCameraIcon(size) {
        const s = size / 40;

        // Camera body
        this.ctx.beginPath();
        this.ctx.roundRect(-14 * s, -8 * s, 28 * s, 16 * s, 3 * s);
        this.ctx.stroke();

        // Lens mount
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 9 * s, 0, Math.PI * 2);
        this.ctx.stroke();

        // Inner lens
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5 * s, 0, Math.PI * 2);
        this.ctx.stroke();

        // Lens reflection
        this.ctx.beginPath();
        this.ctx.arc(-2 * s, -2 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Flash/viewfinder
        this.ctx.beginPath();
        this.ctx.roundRect(-12 * s, -13 * s, 10 * s, 5 * s, 1 * s);
        this.ctx.stroke();

        // Shutter button
        this.ctx.beginPath();
        this.ctx.arc(10 * s, -11 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Video Camera (Camcorder style)
    drawVideoCameraIcon(size) {
        const s = size / 40;

        // Main body
        this.ctx.beginPath();
        this.ctx.roundRect(-16 * s, -8 * s, 24 * s, 16 * s, 3 * s);
        this.ctx.stroke();

        // Lens hood
        this.ctx.beginPath();
        this.ctx.moveTo(-16 * s, -6 * s);
        this.ctx.lineTo(-22 * s, -8 * s);
        this.ctx.lineTo(-22 * s, 8 * s);
        this.ctx.lineTo(-16 * s, 6 * s);
        this.ctx.stroke();

        // Lens
        this.ctx.beginPath();
        this.ctx.arc(-19 * s, 0, 4 * s, 0, Math.PI * 2);
        this.ctx.stroke();

        // Viewfinder
        this.ctx.beginPath();
        this.ctx.roundRect(8 * s, -12 * s, 10 * s, 7 * s, 1 * s);
        this.ctx.stroke();

        // Handle
        this.ctx.beginPath();
        this.ctx.roundRect(-4 * s, -14 * s, 10 * s, 4 * s, 2 * s);
        this.ctx.stroke();

        // Record light
        this.ctx.beginPath();
        this.ctx.arc(4 * s, -3 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Film Reel
    drawFilmReelIcon(size) {
        const s = size / 40;

        // Outer ring
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 14 * s, 0, Math.PI * 2);
        this.ctx.stroke();

        // Inner ring
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 10 * s, 0, Math.PI * 2);
        this.ctx.stroke();

        // Center hub
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 4 * s, 0, Math.PI * 2);
        this.ctx.stroke();

        // Film holes
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const hx = Math.cos(angle) * 7 * s;
            const hy = Math.sin(angle) * 7 * s;
            this.ctx.beginPath();
            this.ctx.arc(hx, hy, 2 * s, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Spokes
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(Math.cos(angle) * 4 * s, Math.sin(angle) * 4 * s);
            this.ctx.lineTo(Math.cos(angle) * 10 * s, Math.sin(angle) * 10 * s);
            this.ctx.stroke();
        }
    }

    // Clapperboard
    drawClapperboardIcon(size) {
        const s = size / 40;

        // Main board
        this.ctx.beginPath();
        this.ctx.roundRect(-14 * s, -4 * s, 28 * s, 18 * s, 2 * s);
        this.ctx.stroke();

        // Clapper top
        this.ctx.save();
        this.ctx.translate(0, -6 * s);
        this.ctx.rotate(-0.15);
        this.ctx.beginPath();
        this.ctx.roundRect(-14 * s, -8 * s, 28 * s, 8 * s, 2 * s);
        this.ctx.stroke();

        // Stripes on clapper
        for (let i = 0; i < 4; i++) {
            const x = -12 * s + i * 8 * s;
            this.ctx.beginPath();
            this.ctx.moveTo(x, -7 * s);
            this.ctx.lineTo(x + 4 * s, -7 * s);
            this.ctx.lineTo(x + 2 * s, -1 * s);
            this.ctx.lineTo(x - 2 * s, -1 * s);
            this.ctx.closePath();
            if (i % 2 === 0) this.ctx.fill();
        }
        this.ctx.restore();

        // Counter display
        this.ctx.beginPath();
        this.ctx.roundRect(-10 * s, 0, 20 * s, 10 * s, 1 * s);
        this.ctx.stroke();
    }

    // Play Button
    drawPlayIcon(size) {
        const s = size / 40;

        // Circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 14 * s, 0, Math.PI * 2);
        this.ctx.stroke();

        // Triangle
        this.ctx.beginPath();
        this.ctx.moveTo(-5 * s, -8 * s);
        this.ctx.lineTo(-5 * s, 8 * s);
        this.ctx.lineTo(10 * s, 0);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // Record Button
    drawRecordIcon(size) {
        const s = size / 40;

        // Outer circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 14 * s, 0, Math.PI * 2);
        this.ctx.stroke();

        // Inner filled circle (record dot)
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 8 * s, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Microphone
    drawMicrophoneIcon(size) {
        const s = size / 40;

        // Mic head
        this.ctx.beginPath();
        this.ctx.arc(0, -6 * s, 8 * s, Math.PI, 0);
        this.ctx.lineTo(8 * s, 2 * s);
        this.ctx.arc(0, 2 * s, 8 * s, 0, Math.PI);
        this.ctx.closePath();
        this.ctx.stroke();

        // Mic grille lines
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(-6 * s, -4 * s + i * 4 * s);
            this.ctx.lineTo(6 * s, -4 * s + i * 4 * s);
            this.ctx.stroke();
        }

        // Stand arc
        this.ctx.beginPath();
        this.ctx.arc(0, 2 * s, 12 * s, 0.3, Math.PI - 0.3);
        this.ctx.stroke();

        // Stand
        this.ctx.beginPath();
        this.ctx.moveTo(0, 14 * s);
        this.ctx.lineTo(0, 8 * s);
        this.ctx.stroke();

        // Base
        this.ctx.beginPath();
        this.ctx.moveTo(-6 * s, 14 * s);
        this.ctx.lineTo(6 * s, 14 * s);
        this.ctx.stroke();
    }

    // Camera Lens
    drawLensIcon(size) {
        const s = size / 40;

        // Outer barrel
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 14 * s, 0, Math.PI * 2);
        this.ctx.stroke();

        // Focus ring
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 11 * s, 0, Math.PI * 2);
        this.ctx.stroke();

        // Aperture blades hint
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 7 * s, 0, Math.PI * 2);
        this.ctx.stroke();

        // Glass element
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 4 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Reflection
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.arc(-3 * s, -3 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    // Tripod
    drawTripodIcon(size) {
        const s = size / 40;

        // Head
        this.ctx.beginPath();
        this.ctx.roundRect(-6 * s, -14 * s, 12 * s, 6 * s, 2 * s);
        this.ctx.stroke();

        // Center column
        this.ctx.beginPath();
        this.ctx.moveTo(0, -8 * s);
        this.ctx.lineTo(0, 0);
        this.ctx.stroke();

        // Legs
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-12 * s, 14 * s);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, 14 * s);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(12 * s, 14 * s);
        this.ctx.stroke();

        // Leg braces
        this.ctx.beginPath();
        this.ctx.moveTo(-6 * s, 7 * s);
        this.ctx.lineTo(6 * s, 7 * s);
        this.ctx.stroke();
    }

    // Slider/Dolly
    drawSliderIcon(size) {
        const s = size / 40;

        // Rail
        this.ctx.beginPath();
        this.ctx.roundRect(-16 * s, 4 * s, 32 * s, 4 * s, 2 * s);
        this.ctx.stroke();

        // Carriage
        this.ctx.beginPath();
        this.ctx.roundRect(-6 * s, -2 * s, 12 * s, 8 * s, 2 * s);
        this.ctx.stroke();

        // Camera mount
        this.ctx.beginPath();
        this.ctx.roundRect(-4 * s, -10 * s, 8 * s, 8 * s, 2 * s);
        this.ctx.stroke();

        // Wheels
        this.ctx.beginPath();
        this.ctx.arc(-4 * s, 8 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(4 * s, 8 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawConnections() {
        const maxDistance = 150;

        for (let i = 0; i < this.icons.length; i++) {
            for (let j = i + 1; j < this.icons.length; j++) {
                const dx = this.icons[j].x - this.icons[i].x;
                const dy = this.icons[j].y - this.icons[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.08;
                    this.ctx.strokeStyle = this.colors.primaryColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.icons[i].x, this.icons[i].y);
                    this.ctx.lineTo(this.icons[j].x, this.icons[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateIcons() {
        for (const icon of this.icons) {
            // Gentle bobbing motion
            const bob = Math.sin(this.time * icon.bobSpeed + icon.bobPhase) * icon.bobAmount;

            icon.vx = icon.baseVx;
            icon.vy = icon.baseVy + bob * 0.1;

            icon.x += icon.vx * this.config.animationSpeed;
            icon.y += icon.vy * this.config.animationSpeed;
            icon.rotation += icon.rotationSpeed * this.config.animationSpeed;

            // Wrap around edges with buffer
            const buffer = 80;
            if (icon.x < -buffer) icon.x = this.canvas.width + buffer;
            if (icon.x > this.canvas.width + buffer) icon.x = -buffer;
            if (icon.y < -buffer) icon.y = this.canvas.height + buffer;
            if (icon.y > this.canvas.height + buffer) icon.y = -buffer;
        }
    }

    updateOrbs() {
        for (const orb of this.orbs) {
            orb.x += orb.vx * this.config.animationSpeed;
            orb.y += orb.vy * this.config.animationSpeed;

            // Bounce off edges softly
            if (orb.x < -orb.radius / 2 || orb.x > this.canvas.width + orb.radius / 2) {
                orb.vx *= -1;
            }
            if (orb.y < -orb.radius / 2 || orb.y > this.canvas.height + orb.radius / 2) {
                orb.vy *= -1;
            }
        }
    }

    animate() {
        this.time++;

        // Draw layers in order
        this.drawBackground();
        this.drawOrbs();
        this.drawConnections();
        this.drawIcons();

        // Update all elements
        this.updateIcons();
        this.updateOrbs();

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
    const canvas = document.getElementById('cinematic-bg-canvas');
    if (canvas) {
        window.videoEditingBgInstance = new VideoEditingBackground('cinematic-bg-canvas', {
            iconCount: 25,
            orbCount: 6,
            animationSpeed: 0.8
        });
    }
});
