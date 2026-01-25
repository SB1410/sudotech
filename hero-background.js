/**
 * SUDOtech Studio - Next-Gen Hero Background
 * Tech: Three.js (WebGL)
 * Features: Gradient Mesh, Topological Grid, Floating Particles, Mouse Parallax
 */

class HeroBackground {
    constructor() {
        this.container = document.getElementById('canvas-container');
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();

        // Objects
        this.gradientMesh = null;
        this.gridMesh = null;
        this.particles = null;

        // State
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // Theme Colors
        this.colors = {
            light: {
                bgTop: new THREE.Color('#f8fafc'),      // Slate 50 (Cool Silver/White)
                bgBottom: new THREE.Color('#cbd5e1'),   // Slate 300 (Soft Grey)
                grid: new THREE.Color('#64748b'),       // Slate 500 (Muted Steel Blue/Grey)
                particles: new THREE.Color('#ea580c')   // Deep Orange (Brand Accent)
            },
            dark: {
                bgTop: new THREE.Color('#0f172a'),      // Slate 900
                bgBottom: new THREE.Color('#020617'),   // Slate 950
                grid: new THREE.Color('#3b82f6'),       // Blue 500
                particles: new THREE.Color('#00ffff')   // Cyan neon
            }
        };

        this.currentColors = {
            bgTop: this.isDark ? this.colors.dark.bgTop.clone() : this.colors.light.bgTop.clone(),
            bgBottom: this.isDark ? this.colors.dark.bgBottom.clone() : this.colors.light.bgBottom.clone(),
            grid: this.isDark ? this.colors.dark.grid.clone() : this.colors.light.grid.clone(),
            particles: this.isDark ? this.colors.dark.particles.clone() : this.colors.light.particles.clone()
        };

        this.init();
    }

    init() {
        // 1. Setup Scene
        this.scene = new THREE.Scene();
        // Fog for depth
        this.scene.fog = new THREE.FogExp2(this.currentColors.bgBottom, 0.002);

        // 2. Setup Camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
        this.camera.position.z = 5;
        this.camera.position.y = 2;
        this.camera.rotation.x = -0.2;

        // 3. Setup Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize perf
        this.container.appendChild(this.renderer.domElement);

        // 4. Create Objects
        this.createGradientBackground();
        this.createTopologicalGrid();
        this.createFloatingParticles();

        // 5. Listeners
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Listen for theme changes from script.js logic
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateTheme();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });

        // Check for theme toggle button clicks as fallback
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', () => setTimeout(() => this.updateTheme(), 50));
        });

        // 6. Start Loop
        this.animate();
    }

    createGradientBackground() {
        // Using a large plane with a shader for smooth gradient morphing
        const geometry = new THREE.PlaneGeometry(50, 50, 1, 1);

        this.gradientUniforms = {
            uTime: { value: 0 },
            uColorA: { value: this.currentColors.bgTop },
            uColorB: { value: this.currentColors.bgBottom }
        };

        const material = new THREE.ShaderMaterial({
            uniforms: this.gradientUniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                varying vec2 vUv;

                void main() {
                    // Smooth vertical gradient with subtle noise movement
                    float noise = sin(vUv.x * 10.0 + uTime * 0.5) * 0.05;
                    vec3 color = mix(uColorB, uColorA, vUv.y + noise);
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        this.gradientMesh = new THREE.Mesh(geometry, material);
        this.gradientMesh.position.z = -10;
        this.gradientMesh.renderOrder = -1; // Keep at back
        this.scene.add(this.gradientMesh);
    }

    createTopologicalGrid() {
        // Much larger plane for "infinite" feeling
        // 100 width, 100 depth, 100 segments each
        const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);

        const material = new THREE.MeshBasicMaterial({
            color: this.currentColors.grid,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });

        this.gridMesh = new THREE.Mesh(geometry, material);
        this.gridMesh.rotation.x = -Math.PI / 2; // Lie flat
        this.gridMesh.position.y = -3; // Lower it
        this.scene.add(this.gridMesh);
    }

    createFloatingParticles() {
        const count = 150;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const randoms = new Float32Array(count); // For varied movement

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
            randoms[i] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

        const material = new THREE.PointsMaterial({
            color: this.currentColors.particles,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    updateTheme() {
        this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const template = this.isDark ? this.colors.dark : this.colors.light;

        // Animate color transition (simple lerp in loop would be better, but direct assignment is okay for now)
        // We'll let the animate loop smooth towards these targets if we implemented lerping,
        // but for now we'll just swap to keep it simple and performant.

        // Update targets for lerping in animate()
        this.targetColors = template;
    }

    onMouseMove(event) {
        // Normalize mouse position -1 to 1
        this.targetMouse.x = (event.clientX / this.width) * 2 - 1;
        this.targetMouse.y = -(event.clientY / this.height) * 2 + 1;
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const time = this.clock.getElapsedTime();
        const delta = this.clock.getDelta();

        // 1. Smooth Mouse Catch-up
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // 2. Camera Parallax
        this.camera.position.x = this.mouse.x * 0.5;
        this.camera.position.y = 2 + this.mouse.y * 0.5;
        this.camera.lookAt(0, 0, 0);

        // 3. Animate Gradient Shader
        if (this.gradientMesh) {
            this.gradientMesh.material.uniforms.uTime.value = time;

            // Theme Interpolation
            if (this.targetColors) {
                this.gradientMesh.material.uniforms.uColorA.value.lerp(this.targetColors.bgTop, 0.05);
                this.gradientMesh.material.uniforms.uColorB.value.lerp(this.targetColors.bgBottom, 0.05);

                // Also lerp other objects
                this.gridMesh.material.color.lerp(this.targetColors.grid, 0.05);
                this.particles.material.color.lerp(this.targetColors.particles, 0.05);
                this.scene.fog.color.lerp(this.targetColors.bgBottom, 0.05);
            }
        }

        // 4. Animate Grid (Wave Effect - Flying Over Terrain)
        if (this.gridMesh) {
            const positions = this.gridMesh.geometry.attributes.position;

            // INFINITE SCROLL FIX:
            // Instead of moving the grid mesh (which requires modulo resets),
            // we keep the grid stationary and scroll the WAVE PATTERN through time.
            // This creates the illusion of forward movement with zero stuttering.
            const scrollSpeed = 3.0;

            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i); // Depth in local space (becomes Z in world)

                // Offset Y by time to create "flying forward" effect
                // The wave flows towards the camera, creating infinite terrain
                const waveHeight =
                    Math.sin(x * 0.15) * 1.2 +
                    Math.cos((y - time * scrollSpeed) * 0.15) * 1.0;

                positions.setZ(i, waveHeight);
            }
            positions.needsUpdate = true;
        }

        // 5. Animate Particles
        if (this.particles) {
            this.particles.rotation.y = time * 0.05;
            const positions = this.particles.geometry.attributes.position;

            for (let i = 0; i < positions.count; i++) {
                let y = positions.getY(i);
                y += 0.01; // float up

                if (y > 5) y = -5; // Reset to bottom

                positions.setY(i, y);
            }
            positions.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new HeroBackground();
});
