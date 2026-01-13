// PlasmaWave WebGL Background - Vanilla JS Version
// Converted from React component for use with plain HTML

class PlasmaWave {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }

        // Default options with orange theme
        this.options = {
            overallSpeed: options.overallSpeed || 0.2,
            lineSpeed: options.lineSpeed || 1.0,
            warpSpeed: options.warpSpeed || 0.2,
            offsetSpeed: options.offsetSpeed || 1.33,
            gridSmoothWidth: options.gridSmoothWidth || 0.015,
            axisWidth: options.axisWidth || 0.05,
            majorLineWidth: options.majorLineWidth || 0.025,
            minorLineWidth: options.minorLineWidth || 0.0125,
            majorLineFrequency: options.majorLineFrequency || 5.0,
            minorLineFrequency: options.minorLineFrequency || 1.0,
            minLineWidth: options.minLineWidth || 0.01,
            maxLineWidth: options.maxLineWidth || 0.2,
            lineAmplitude: options.lineAmplitude || 1.0,
            lineFrequency: options.lineFrequency || 0.2,
            linesPerGroup: options.linesPerGroup || 16,
            warpFrequency: options.warpFrequency || 0.5,
            warpAmplitude: options.warpAmplitude || 1.0,
            offsetFrequency: options.offsetFrequency || 0.5,
            minOffsetSpread: options.minOffsetSpread || 0.6,
            maxOffsetSpread: options.maxOffsetSpread || 2.0,
            // Orange wave colors
            lineColor: options.lineColor || [0.97, 0.45, 0.09, 1.0], // #f97316 orange
            // Cream background colors matching the site theme
            bgColor1: options.bgColor1 || [0.98, 0.97, 0.95, 1.0], // #faf7f2 cream
            bgColor2: options.bgColor2 || [0.96, 0.94, 0.91, 1.0], // #f5f0e8 cream gradient
            gridColor: options.gridColor || [0.5, 0.5, 0.5, 0.0],
            scale: options.scale || 5.0
        };

        this.gl = null;
        this.shaderProgram = null;
        this.animationFrameId = null;
        this.startTime = Date.now();

        this.init();
    }

    init() {
        this.gl = this.canvas.getContext('webgl', { preserveDrawingBuffer: true });
        if (!this.gl) {
            console.warn('WebGL not supported.');
            return;
        }

        const vsSource = `
            attribute vec4 aVertexPosition;
            void main() {
                gl_Position = aVertexPosition;
            }
        `;

        const fsSource = this.createFragmentShader();
        this.shaderProgram = this.initShaderProgram(vsSource, fsSource);
        if (!this.shaderProgram) return;

        this.setupBuffers();
        this.setupUniforms();
        this.resizeCanvas();

        window.addEventListener('resize', () => this.resizeCanvas());
        this.render();
    }

    createFragmentShader() {
        return `
            precision highp float;
            uniform vec2 iResolution;
            uniform float iTime;
            uniform float uOverallSpeed;
            uniform float uGridSmoothWidth;
            uniform float uAxisWidth;
            uniform float uMajorLineWidth;
            uniform float uMinorLineWidth;
            uniform float uMajorLineFrequency;
            uniform float uMinorLineFrequency;
            uniform vec4 uGridColor;
            uniform float uScale;
            uniform vec4 uLineColor;
            uniform float uMinLineWidth;
            uniform float uMaxLineWidth;
            uniform float uLineSpeed;
            uniform float uLineAmplitude;
            uniform float uLineFrequency;
            uniform float uWarpSpeed;
            uniform float uWarpFrequency;
            uniform float uWarpAmplitude;
            uniform float uOffsetFrequency;
            uniform float uOffsetSpeed;
            uniform float uMinOffsetSpread;
            uniform float uMaxOffsetSpread;
            uniform int uLinesPerGroup;
            uniform vec4 uBgColor1;
            uniform vec4 uBgColor2;

            #define drawCircle(pos, radius, coord) smoothstep(radius + uGridSmoothWidth, radius, length(coord - (pos)))
            #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
            #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + uGridSmoothWidth, halfWidth, abs(pos - (t)))
            #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

            float drawGridLines(float axis) {
                return drawCrispLine(0.0, uAxisWidth, axis)
                    + drawPeriodicLine(uMajorLineFrequency, uMajorLineWidth, axis)
                    + drawPeriodicLine(uMinorLineFrequency, uMinorLineWidth, axis);
            }

            float drawGrid(vec2 space) {
                return min(1.0, drawGridLines(space.x) + drawGridLines(space.y));
            }

            float random(float t) {
                return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
            }

            float getPlasmaY(float x, float horizontalFade, float offset) {
                return random(x * uLineFrequency + iTime * uLineSpeed) * horizontalFade * uLineAmplitude + offset;
            }

            void main() {
                vec2 fragCoord = gl_FragCoord.xy;
                vec4 fragColor;
                vec2 uv = fragCoord.xy / iResolution.xy;
                vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * uScale;

                float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
                float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

                space.y += random(space.x * uWarpFrequency + iTime * uWarpSpeed) * uWarpAmplitude * (0.5 + horizontalFade);
                space.x += random(space.y * uWarpFrequency + iTime * uWarpSpeed + 2.0) * uWarpAmplitude * horizontalFade;

                float lineIntensity = 0.0;

                for(int l = 0; l < 32; l++) {
                    if(l >= uLinesPerGroup) break;
                    
                    float normalizedLineIndex = float(l) / float(uLinesPerGroup);
                    float offsetTime = iTime * uOffsetSpeed;
                    float offsetPosition = float(l) + space.x * uOffsetFrequency;
                    float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
                    float halfWidth = mix(uMinLineWidth, uMaxLineWidth, rand * horizontalFade) / 2.0;
                    float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(uMinOffsetSpread, uMaxOffsetSpread, horizontalFade);
                    float linePosition = getPlasmaY(space.x, horizontalFade, offset);
                    float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

                    float circleX = mod(float(l) + iTime * uLineSpeed, 25.0) - 12.0;
                    vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
                    float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

                    lineIntensity += (line + circle) * rand;
                }

                fragColor = mix(uBgColor1, uBgColor2, uv.x);
                fragColor *= verticalFade;
                // Semi-transparent background to show icons behind
                fragColor.a = 0.85 * verticalFade + 0.1;

                // Determine luminance to switch blending modes
                float bgLuma = dot(uBgColor1.rgb, vec3(0.299, 0.587, 0.114));

                if (bgLuma > 0.5) {
                    // Light Mode (Normal Blending): Mix to prevent whiteout
                    // Uses uLineColor.a to control max opacity
                    float alpha = min(1.0, lineIntensity * uLineColor.a);
                    fragColor.rgb = mix(fragColor.rgb, uLineColor.rgb, alpha);
                } else {
                    // Dark Mode (Additive Blending): Glow effect
                    fragColor.rgb += uLineColor.rgb * lineIntensity * uLineColor.a; // Use accumulation
                }

                gl_FragColor = fragColor;
            }
        `;
    }

    loadShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader) return null;

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    initShaderProgram(vsSource, fsSource) {
        const gl = this.gl;
        const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);

        if (!vertexShader || !fragmentShader) return null;

        const shaderProgram = gl.createProgram();
        if (!shaderProgram) return null;

        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('Shader program link error:', gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    setupBuffers() {
        const gl = this.gl;
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    }

    setupUniforms() {
        const gl = this.gl;
        this.uniformLocations = {
            resolution: gl.getUniformLocation(this.shaderProgram, 'iResolution'),
            time: gl.getUniformLocation(this.shaderProgram, 'iTime'),
            overallSpeed: gl.getUniformLocation(this.shaderProgram, 'uOverallSpeed'),
            gridSmoothWidth: gl.getUniformLocation(this.shaderProgram, 'uGridSmoothWidth'),
            axisWidth: gl.getUniformLocation(this.shaderProgram, 'uAxisWidth'),
            majorLineWidth: gl.getUniformLocation(this.shaderProgram, 'uMajorLineWidth'),
            minorLineWidth: gl.getUniformLocation(this.shaderProgram, 'uMinorLineWidth'),
            majorLineFrequency: gl.getUniformLocation(this.shaderProgram, 'uMajorLineFrequency'),
            minorLineFrequency: gl.getUniformLocation(this.shaderProgram, 'uMinorLineFrequency'),
            gridColor: gl.getUniformLocation(this.shaderProgram, 'uGridColor'),
            scale: gl.getUniformLocation(this.shaderProgram, 'uScale'),
            lineColor: gl.getUniformLocation(this.shaderProgram, 'uLineColor'),
            minLineWidth: gl.getUniformLocation(this.shaderProgram, 'uMinLineWidth'),
            maxLineWidth: gl.getUniformLocation(this.shaderProgram, 'uMaxLineWidth'),
            lineSpeed: gl.getUniformLocation(this.shaderProgram, 'uLineSpeed'),
            lineAmplitude: gl.getUniformLocation(this.shaderProgram, 'uLineAmplitude'),
            lineFrequency: gl.getUniformLocation(this.shaderProgram, 'uLineFrequency'),
            warpSpeed: gl.getUniformLocation(this.shaderProgram, 'uWarpSpeed'),
            warpFrequency: gl.getUniformLocation(this.shaderProgram, 'uWarpFrequency'),
            warpAmplitude: gl.getUniformLocation(this.shaderProgram, 'uWarpAmplitude'),
            offsetFrequency: gl.getUniformLocation(this.shaderProgram, 'uOffsetFrequency'),
            offsetSpeed: gl.getUniformLocation(this.shaderProgram, 'uOffsetSpeed'),
            minOffsetSpread: gl.getUniformLocation(this.shaderProgram, 'uMinOffsetSpread'),
            maxOffsetSpread: gl.getUniformLocation(this.shaderProgram, 'uMaxOffsetSpread'),
            linesPerGroup: gl.getUniformLocation(this.shaderProgram, 'uLinesPerGroup'),
            bgColor1: gl.getUniformLocation(this.shaderProgram, 'uBgColor1'),
            bgColor2: gl.getUniformLocation(this.shaderProgram, 'uBgColor2'),
        };

        this.attribLocations = {
            vertexPosition: this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
        };
    }

    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const w = this.canvas.offsetWidth;
        const h = this.canvas.offsetHeight;
        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        const gl = this.gl;
        const opts = this.options;
        const currentTime = (Date.now() - this.startTime) / 1000;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.shaderProgram);

        gl.uniform2f(this.uniformLocations.resolution, this.canvas.width, this.canvas.height);
        gl.uniform1f(this.uniformLocations.time, currentTime);
        gl.uniform1f(this.uniformLocations.overallSpeed, opts.overallSpeed);
        gl.uniform1f(this.uniformLocations.gridSmoothWidth, opts.gridSmoothWidth);
        gl.uniform1f(this.uniformLocations.axisWidth, opts.axisWidth);
        gl.uniform1f(this.uniformLocations.majorLineWidth, opts.majorLineWidth);
        gl.uniform1f(this.uniformLocations.minorLineWidth, opts.minorLineWidth);
        gl.uniform1f(this.uniformLocations.majorLineFrequency, opts.majorLineFrequency);
        gl.uniform1f(this.uniformLocations.minorLineFrequency, opts.minorLineFrequency);
        gl.uniform4fv(this.uniformLocations.gridColor, opts.gridColor);
        gl.uniform1f(this.uniformLocations.scale, opts.scale);
        gl.uniform4fv(this.uniformLocations.lineColor, opts.lineColor);
        gl.uniform1f(this.uniformLocations.minLineWidth, opts.minLineWidth);
        gl.uniform1f(this.uniformLocations.maxLineWidth, opts.maxLineWidth);
        gl.uniform1f(this.uniformLocations.lineSpeed, opts.lineSpeed * opts.overallSpeed);
        gl.uniform1f(this.uniformLocations.lineAmplitude, opts.lineAmplitude);
        gl.uniform1f(this.uniformLocations.lineFrequency, opts.lineFrequency);
        gl.uniform1f(this.uniformLocations.warpSpeed, opts.warpSpeed * opts.overallSpeed);
        gl.uniform1f(this.uniformLocations.warpFrequency, opts.warpFrequency);
        gl.uniform1f(this.uniformLocations.warpAmplitude, opts.warpAmplitude);
        gl.uniform1f(this.uniformLocations.offsetFrequency, opts.offsetFrequency);
        gl.uniform1f(this.uniformLocations.offsetSpeed, opts.offsetSpeed * opts.overallSpeed);
        gl.uniform1f(this.uniformLocations.minOffsetSpread, opts.minOffsetSpread);
        gl.uniform1f(this.uniformLocations.maxOffsetSpread, opts.maxOffsetSpread);
        gl.uniform1i(this.uniformLocations.linesPerGroup, opts.linesPerGroup);
        gl.uniform4fv(this.uniformLocations.bgColor1, opts.bgColor1);
        gl.uniform4fv(this.uniformLocations.bgColor2, opts.bgColor2);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.attribLocations.vertexPosition);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        this.animationFrameId = requestAnimationFrame(() => this.render());
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if the canvas exists before initializing
    const canvas = document.getElementById('plasma-wave-canvas');
    if (canvas) {
        // Check saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        const isDark = savedTheme === 'dark';

        // Initialize with appropriate colors based on theme
        window.plasmaWaveInstance = new PlasmaWave('plasma-wave-canvas', {
            overallSpeed: 0.15,
            lineSpeed: 0.8,
            warpSpeed: 0.15,
            offsetSpeed: 1.0,
            lineAmplitude: 0.8,
            linesPerGroup: 12,
            warpAmplitude: 0.8,
            minOffsetSpread: 0.5,
            maxOffsetSpread: 1.5,
            scale: 4.0,
            // Wave colors based on theme
            // Light Mode: Darker orange with higher opacity for visibility
            // Dark Mode: Standard bright orange with lower opacity
            lineColor: isDark ? [0.97, 0.45, 0.09, 0.6] : [0.85, 0.30, 0.05, 0.95],
            // Background based on theme
            bgColor1: isDark ? [0.04, 0.04, 0.04, 1.0] : [0.98, 0.97, 0.95, 1.0],
            bgColor2: isDark ? [0.08, 0.06, 0.04, 1.0] : [0.96, 0.94, 0.91, 1.0]
        });
    }
});
