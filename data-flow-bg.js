/**
 * DataFlowBackground - Animated Data Dashboard Background
 * A seamless, looping canvas animation featuring databases, data flow lines,
 * network nodes, and cloud icons with a professional, restrained aesthetic.
 * Supports both dark and light mode themes.
 */

class DataFlowBackground {
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
                bgColor: '#151d2a',
                nodeColor: '#2dd4bf',
                nodeColorAlt: '#0ea5e9',
                lineColor: '#22d3ee',
                gridColor: 'rgba(34, 211, 238, 0.03)',
                accentColor: '#06b6d4',
                particleColor: 'rgba(34, 211, 238,',
                gradientCenter: 'rgba(34, 211, 238, 0.02)',
                gradientEdge: 'rgba(0, 0, 0, 0)',
                highlightColor: 'rgba(255, 255, 255, 0.4)',
                shapeOpacityMultiplier: 1.0,
                lineOpacityMultiplier: 1.0
            },
            light: {
                bgColor: '#f0f7fa',
                nodeColor: '#047857',      // Darker teal-green
                nodeColorAlt: '#0369a1',   // Darker blue
                lineColor: '#0e7490',      // Darker cyan
                gridColor: 'rgba(14, 116, 144, 0.08)',
                accentColor: '#0f766e',    // Dark teal
                particleColor: 'rgba(14, 116, 144,',
                gradientCenter: 'rgba(14, 116, 144, 0.04)',
                gradientEdge: 'rgba(255, 255, 255, 0)',
                highlightColor: 'rgba(255, 255, 255, 0.8)',
                shapeOpacityMultiplier: 2.5,  // Make shapes more visible
                lineOpacityMultiplier: 2.0    // Make lines more visible
            }
        };

        // Detect initial theme
        this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

        // Configuration with defaults
        this.config = {
            // Animation settings
            nodeCount: options.nodeCount || 25,
            particleCount: options.particleCount || 60,
            animationSpeed: options.animationSpeed || 0.3,

            // Visual settings
            nodeMinRadius: options.nodeMinRadius || 3,
            nodeMaxRadius: options.nodeMaxRadius || 8,
            lineOpacity: options.lineOpacity || 0.15,
            maxConnectionDistance: options.maxConnectionDistance || 250,
        };

        // Apply current theme colors
        this.applyTheme();

        this.nodes = [];
        this.particles = [];
        this.floatingShapes = [];
        this.time = 0;
        this.animationId = null;

        this.init();
    }

    applyTheme() {
        const theme = this.isDarkMode ? this.themes.dark : this.themes.light;
        this.config.bgColor = theme.bgColor;
        this.config.nodeColor = theme.nodeColor;
        this.config.nodeColorAlt = theme.nodeColorAlt;
        this.config.lineColor = theme.lineColor;
        this.config.gridColor = theme.gridColor;
        this.config.accentColor = theme.accentColor;
        this.config.particleColor = theme.particleColor;
        this.config.gradientCenter = theme.gradientCenter;
        this.config.gradientEdge = theme.gradientEdge;
        this.config.highlightColor = theme.highlightColor;
        this.config.shapeOpacityMultiplier = theme.shapeOpacityMultiplier;
        this.config.lineOpacityMultiplier = theme.lineOpacityMultiplier;

        // Update node colors if they exist
        if (this.nodes && this.nodes.length > 0) {
            for (const node of this.nodes) {
                node.color = Math.random() > 0.5 ? this.config.nodeColor : this.config.nodeColorAlt;
            }
        }
    }

    init() {
        this.resizeCanvas();
        this.createNodes();
        this.createParticles();
        this.createFloatingShapes();

        window.addEventListener('resize', () => this.resizeCanvas());

        // Listen for theme changes
        this.observeThemeChanges();

        this.animate();
    }

    observeThemeChanges() {
        // Watch for data-theme attribute changes on the document
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
                    this.applyTheme();
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

        // Recreate elements on resize
        if (this.nodes.length > 0) {
            this.createNodes();
            this.createParticles();
            this.createFloatingShapes();
        }
    }

    createNodes() {
        this.nodes = [];
        const { nodeCount, nodeMinRadius, nodeMaxRadius } = this.config;

        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: nodeMinRadius + Math.random() * (nodeMaxRadius - nodeMinRadius),
                vx: (Math.random() - 0.5) * this.config.animationSpeed,
                vy: (Math.random() - 0.5) * this.config.animationSpeed,
                type: Math.random() > 0.5 ? 'database' : 'server',
                pulsePhase: Math.random() * Math.PI * 2,
                color: Math.random() > 0.5 ? this.config.nodeColor : this.config.nodeColorAlt
            });
        }
    }

    createParticles() {
        this.particles = [];
        const { particleCount } = this.config;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        // Pick two random nodes to travel between
        const startNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
        const endNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];

        return {
            x: startNode ? startNode.x : Math.random() * this.canvas.width,
            y: startNode ? startNode.y : Math.random() * this.canvas.height,
            targetX: endNode ? endNode.x : Math.random() * this.canvas.width,
            targetY: endNode ? endNode.y : Math.random() * this.canvas.height,
            speed: 0.3 + Math.random() * 0.5,
            progress: 0,
            size: 1 + Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.4
        };
    }

    createFloatingShapes() {
        this.floatingShapes = [];
        const shapeCount = 8;

        const shapeTypes = ['database', 'table', 'cloud', 'server'];

        for (let i = 0; i < shapeCount; i++) {
            this.floatingShapes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                size: 20 + Math.random() * 30,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.002,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                opacity: 0.08 + Math.random() * 0.12,
                layer: Math.random() // For parallax effect
            });
        }
    }

    drawBackground() {
        // Solid background
        this.ctx.fillStyle = this.config.bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Subtle gradient overlay
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.7
        );
        gradient.addColorStop(0, this.config.gradientCenter);
        gradient.addColorStop(1, this.config.gradientEdge);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        const gridSize = 60;
        this.ctx.strokeStyle = this.config.gridColor;
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawConnections() {
        const { maxConnectionDistance, lineOpacity, lineColor } = this.config;

        // Extract RGB from lineColor hex
        const hex = lineColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxConnectionDistance) {
                    const baseOpacity = (1 - distance / maxConnectionDistance) * lineOpacity;
                    const opacity = Math.min(baseOpacity * (this.config.lineOpacityMultiplier || 1), 0.6);

                    // Draw curved connection line
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                    this.ctx.lineWidth = 1;

                    // Control point for curve
                    const midX = (this.nodes[i].x + this.nodes[j].x) / 2;
                    const midY = (this.nodes[i].y + this.nodes[j].y) / 2;
                    const offset = Math.sin(this.time * 0.001 + i + j) * 20;

                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.quadraticCurveTo(midX + offset, midY - offset, this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawNodes() {
        for (const node of this.nodes) {
            // Gentle pulse effect
            const pulse = 1 + Math.sin(this.time * 0.002 + node.pulsePhase) * 0.15;
            const radius = node.radius * pulse;

            // Outer glow
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, radius * 3
            );
            gradient.addColorStop(0, `${node.color}40`);
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Core node
            this.ctx.fillStyle = node.color;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Inner highlight
            this.ctx.fillStyle = this.config.highlightColor;
            this.ctx.beginPath();
            this.ctx.arc(node.x - radius * 0.3, node.y - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawParticles() {
        for (const particle of this.particles) {
            this.ctx.fillStyle = `${this.config.particleColor} ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Trail effect
            const trailLength = 3;
            for (let t = 1; t <= trailLength; t++) {
                const trailX = particle.x - (particle.targetX - particle.x) * 0.02 * t;
                const trailY = particle.y - (particle.targetY - particle.y) * 0.02 * t;
                const trailOpacity = particle.opacity * (1 - t / (trailLength + 1)) * 0.5;

                this.ctx.fillStyle = `${this.config.particleColor} ${trailOpacity})`;
                this.ctx.beginPath();
                this.ctx.arc(trailX, trailY, particle.size * 0.6, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    drawFloatingShapes() {
        const opacityMultiplier = this.config.shapeOpacityMultiplier || 1;

        for (const shape of this.floatingShapes) {
            this.ctx.save();
            this.ctx.translate(shape.x, shape.y);
            this.ctx.rotate(shape.rotation);
            this.ctx.globalAlpha = Math.min(shape.opacity * opacityMultiplier, 0.5);

            switch (shape.type) {
                case 'database':
                    this.drawDatabaseIcon(0, 0, shape.size);
                    break;
                case 'table':
                    this.drawTableIcon(0, 0, shape.size);
                    break;
                case 'cloud':
                    this.drawCloudIcon(0, 0, shape.size);
                    break;
                case 'server':
                    this.drawServerIcon(0, 0, shape.size);
                    break;
            }

            this.ctx.restore();
        }
    }

    drawDatabaseIcon(x, y, size) {
        const width = size * 0.8;
        const height = size;
        const ellipseHeight = size * 0.2;

        this.ctx.strokeStyle = this.config.accentColor;
        this.ctx.lineWidth = 1.5;

        // Top ellipse
        this.ctx.beginPath();
        this.ctx.ellipse(x, y - height / 2 + ellipseHeight / 2, width / 2, ellipseHeight / 2, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // Bottom ellipse
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + height / 2 - ellipseHeight / 2, width / 2, ellipseHeight / 2, 0, 0, Math.PI);
        this.ctx.stroke();

        // Side lines
        this.ctx.beginPath();
        this.ctx.moveTo(x - width / 2, y - height / 2 + ellipseHeight / 2);
        this.ctx.lineTo(x - width / 2, y + height / 2 - ellipseHeight / 2);
        this.ctx.moveTo(x + width / 2, y - height / 2 + ellipseHeight / 2);
        this.ctx.lineTo(x + width / 2, y + height / 2 - ellipseHeight / 2);
        this.ctx.stroke();

        // Middle line
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, width / 2, ellipseHeight / 2, 0, 0, Math.PI);
        this.ctx.stroke();
    }

    drawTableIcon(x, y, size) {
        const cols = 3;
        const rows = 3;
        const cellWidth = size / cols;
        const cellHeight = size / rows;
        const startX = x - size / 2;
        const startY = y - size / 2;

        this.ctx.strokeStyle = this.config.nodeColorAlt;
        this.ctx.lineWidth = 1;

        // Draw grid
        for (let i = 0; i <= cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX + i * cellWidth, startY);
            this.ctx.lineTo(startX + i * cellWidth, startY + size);
            this.ctx.stroke();
        }

        for (let j = 0; j <= rows; j++) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY + j * cellHeight);
            this.ctx.lineTo(startX + size, startY + j * cellHeight);
            this.ctx.stroke();
        }
    }

    drawCloudIcon(x, y, size) {
        this.ctx.strokeStyle = this.config.lineColor;
        this.ctx.lineWidth = 1.5;

        this.ctx.beginPath();
        // Main cloud shape using arcs
        this.ctx.arc(x - size * 0.2, y, size * 0.25, Math.PI * 0.5, Math.PI * 1.5);
        this.ctx.arc(x, y - size * 0.15, size * 0.3, Math.PI, Math.PI * 2);
        this.ctx.arc(x + size * 0.25, y - size * 0.05, size * 0.2, Math.PI * 1.3, Math.PI * 0.3);
        this.ctx.arc(x + size * 0.15, y + size * 0.1, size * 0.15, 0, Math.PI * 0.7);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawServerIcon(x, y, size) {
        const width = size * 0.9;
        const height = size * 0.3;
        const gap = size * 0.1;

        this.ctx.strokeStyle = this.config.nodeColor;
        this.ctx.lineWidth = 1.5;

        // Three stacked rectangles
        for (let i = 0; i < 3; i++) {
            const boxY = y - size / 2 + i * (height + gap);

            // Rounded rectangle
            const radius = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(x - width / 2 + radius, boxY);
            this.ctx.lineTo(x + width / 2 - radius, boxY);
            this.ctx.quadraticCurveTo(x + width / 2, boxY, x + width / 2, boxY + radius);
            this.ctx.lineTo(x + width / 2, boxY + height - radius);
            this.ctx.quadraticCurveTo(x + width / 2, boxY + height, x + width / 2 - radius, boxY + height);
            this.ctx.lineTo(x - width / 2 + radius, boxY + height);
            this.ctx.quadraticCurveTo(x - width / 2, boxY + height, x - width / 2, boxY + height - radius);
            this.ctx.lineTo(x - width / 2, boxY + radius);
            this.ctx.quadraticCurveTo(x - width / 2, boxY, x - width / 2 + radius, boxY);
            this.ctx.closePath();
            this.ctx.stroke();

            // LED light
            this.ctx.fillStyle = i === 1 ? this.config.nodeColor : this.config.nodeColorAlt;
            this.ctx.beginPath();
            this.ctx.arc(x - width / 2 + 8, boxY + height / 2, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    updateNodes() {
        for (const node of this.nodes) {
            node.x += node.vx;
            node.y += node.vy;

            // Wrap around edges
            if (node.x < -50) node.x = this.canvas.width + 50;
            if (node.x > this.canvas.width + 50) node.x = -50;
            if (node.y < -50) node.y = this.canvas.height + 50;
            if (node.y > this.canvas.height + 50) node.y = -50;
        }
    }

    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];

            // Move toward target
            particle.progress += particle.speed * 0.01;

            // Eased movement
            const ease = this.easeInOutSine(particle.progress);
            const startX = particle.x - (particle.targetX - particle.x) * ease / (1 - ease + 0.001);
            const startY = particle.y - (particle.targetY - particle.y) * ease / (1 - ease + 0.001);

            particle.x += (particle.targetX - particle.x) * particle.speed * 0.02;
            particle.y += (particle.targetY - particle.y) * particle.speed * 0.02;

            // Reset when reached target
            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            if (Math.sqrt(dx * dx + dy * dy) < 5) {
                this.particles[i] = this.createParticle();
            }
        }
    }

    updateFloatingShapes() {
        for (const shape of this.floatingShapes) {
            shape.x += shape.vx;
            shape.y += shape.vy;
            shape.rotation += shape.rotationSpeed;

            // Wrap around edges
            if (shape.x < -100) shape.x = this.canvas.width + 100;
            if (shape.x > this.canvas.width + 100) shape.x = -100;
            if (shape.y < -100) shape.y = this.canvas.height + 100;
            if (shape.y > this.canvas.height + 100) shape.y = -100;
        }
    }

    easeInOutSine(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    animate() {
        this.time++;

        // Clear and draw background
        this.drawBackground();
        this.drawGrid();

        // Draw elements
        this.drawConnections();
        this.drawFloatingShapes();
        this.drawNodes();
        this.drawParticles();

        // Update positions
        this.updateNodes();
        this.updateParticles();
        this.updateFloatingShapes();

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
    const canvas = document.getElementById('data-flow-canvas');
    if (canvas) {
        new DataFlowBackground('data-flow-canvas');
    }
});
