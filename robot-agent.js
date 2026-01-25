/**
 * SUDOtech Studio - 3D Robot Agent
 * A floating, interactive 3D element that follows the user or reacts to interaction.
 * Uses Three.js
 */

class RobotAgent {
    constructor() {
        this.container = document.getElementById('robot-container');
        if (!this.container) return;

        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        if (this.width === 0 || this.height === 0) {
            // Fallback sizes if container is hidden or not sized yet
            this.width = 200;
            this.height = 200;
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        // Robot parts
        this.robotGroup = null;
        this.core = null;
        this.ring1 = null;
        this.ring2 = null;

        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationY = 0;
        this.targetRotationX = 0;

        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 5;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x0ea5e9, 2, 10); // Sky blue light
        pointLight.position.set(2, 2, 5);
        this.scene.add(pointLight);

        const coreLight = new THREE.PointLight(0xf97316, 1, 5); // Orange light inside
        coreLight.position.set(0, 0, 0);
        this.scene.add(coreLight);

        // Build Robot
        this.createRobot();

        // Events
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('resize', () => this.onResize());

        // Animation Loop
        this.animate();
    }

    createRobot() {
        this.robotGroup = new THREE.Group();
        this.scene.add(this.robotGroup);

        // 1. Core Sphere (The "Eye")
        const coreGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.2,
            metalness: 0.9,
            emissive: 0xf97316, // SUDO orange
            emissiveIntensity: 0.5
        });
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.robotGroup.add(this.core);

        // 2. Outer Ring 1 (Rotating vertical)
        const ring1Geometry = new THREE.TorusGeometry(1.2, 0.05, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0x0ea5e9, // Sky blue
            emissive: 0x0ea5e9,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.8
        });
        this.ring1 = new THREE.Mesh(ring1Geometry, ringMaterial);
        this.robotGroup.add(this.ring1);

        // 3. Outer Ring 2 (Rotating horizontal)
        const ring2Geometry = new THREE.TorusGeometry(1.5, 0.03, 16, 100);
        this.ring2 = new THREE.Mesh(ring2Geometry, ringMaterial);
        this.ring2.rotation.x = Math.PI / 2;
        this.robotGroup.add(this.ring2);

        // 4. Tech particles/details
        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 20;
        const posArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 4;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xffffff,
            transparent: true,
            opacity: 0.6
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        this.robotGroup.add(particles);
    }

    onMouseMove(event) {
        // Calculate mouse position relative to window center
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        this.mouseX = (event.clientX - windowHalfX) / windowHalfX;
        this.mouseY = (event.clientY - windowHalfY) / windowHalfY;
    }

    onResize() {
        // Check container size again (it might change if CSS depends on VW/VH)
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // animate rings
        if (this.ring1) {
            this.ring1.rotation.y += 0.02;
            this.ring1.rotation.x += 0.005;
        }

        if (this.ring2) {
            this.ring2.rotation.y -= 0.015;
            this.ring2.rotation.x += 0.01;
        }

        // animate core pulse
        const time = Date.now() * 0.001;
        if (this.core) {
            this.core.material.emissiveIntensity = 0.5 + Math.sin(time * 2) * 0.2;
        }

        // Group follows mouse smoothly
        this.targetRotationY = this.mouseX * 0.5;
        this.targetRotationX = this.mouseY * 0.5;

        if (this.robotGroup) {
            this.robotGroup.rotation.y += 0.05 * (this.targetRotationY - this.robotGroup.rotation.y);
            this.robotGroup.rotation.x += 0.05 * (this.targetRotationX - this.robotGroup.rotation.x);

            // Gentle bobbing
            this.robotGroup.position.y = Math.sin(time) * 0.2;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Wait a brief moment to ensure layout is done
    setTimeout(() => {
        new RobotAgent();
    }, 500);
});
