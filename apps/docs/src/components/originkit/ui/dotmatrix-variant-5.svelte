<script lang="ts">
    import { Camera, Mesh, Plane, Program, Renderer, RenderTarget, Texture } from 'ogl';
    import { onMount } from 'svelte';

    type DotMatrixProps = {
        frequency?: number;
        speed?: number;
        bgColor?: string;
        cellSize?: number;
        gamma?: number;
        paletteBias?: number;
        useGlyphAtlas?: boolean;
        characters?: string;
        fontFamily?: string;
        fontWeight?: string | number;
        fontSizePx?: number;
        class?: string;
    };

    type FontSettings = {
        family: string;
        weight: string | number;
        sizePx: number;
    };

    type OglContext = Renderer['gl'];

    interface ReleasableTexture extends Texture {
        destroy?: () => void;
    }

    let {
        frequency = 2,
        speed = 1,
        bgColor = 'transparent',
        cellSize = 36,
        gamma = 9,
        paletteBias = 5,
        useGlyphAtlas = true,
        characters = '1234567890$%^ZZ&*8',
        fontFamily = 'monospace',
        fontWeight = 400,
        fontSizePx = 42,
        class: className = ''
    }: DotMatrixProps = $props();

    let container = $state<HTMLDivElement | undefined>();

    const perlinVertexShader = `#version 300 es
in vec2 uv;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0., 1.);
}`;

    const perlinFragmentShader = `#version 300 es
precision mediump float;
uniform float uFrequency;
uniform float uTime;
uniform float uSpeed;
uniform float uValue;
uniform vec2 uResolution;
in vec2 vUv;
out vec4 fragColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s0.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  uv = (uv - 0.5) * vec2(aspect, 1.0) + 0.5;
  float hue = abs(snoise(vec3(uv * uFrequency, uTime * uSpeed)));
  vec3 rainbowColor = hsv2rgb(vec3(hue, 1.0, uValue));
  fragColor = vec4(rainbowColor, 1.0);
}`;

    const dotVertexShader = `#version 300 es
in vec2 uv;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0., 1.);
}`;

    const dotFragmentShader = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform int uPaletteCount;
uniform vec3 uPalette[10];
uniform float uPaletteA[10];
uniform float uCellSize;
uniform float uGamma;
uniform float uPaletteBias;
uniform int uUseGlyphAtlas;
uniform sampler2D uGlyphAtlas;
uniform ivec2 uGlyphGrid;
uniform int uCharCount;
out vec4 fragColor;

void main() {
  vec2 pix = gl_FragCoord.xy;
  float cell = max(uCellSize, 1.0);

  vec2 cellIdx = floor(pix / cell);
  vec2 cellCenter = (cellIdx + 0.5) * cell;
  vec3 col = texture(uTexture, cellCenter / uResolution.xy).rgb;
  float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;
  gray = pow(clamp(gray, 0.0001, 1.0), uGamma);

  float mark = 0.0;
  if (uUseGlyphAtlas == 1 && uCharCount > 0 && uGlyphGrid.x > 0 && uGlyphGrid.y > 0) {
    float g = clamp(gray + uPaletteBias, 0.0, 1.0);
    int idx = int(clamp(floor(g * float(uCharCount - 1) + 0.5), 0.0, float(uCharCount - 1)));
    vec2 cellUV = fract(pix / cell);
    vec2 grid = vec2(uGlyphGrid);
    vec2 tileSize = 1.0 / grid;
    float colIdx = float(idx % uGlyphGrid.x);
    float rowIdx = floor(float(idx) / float(uGlyphGrid.x));
    vec2 atlasUV = (vec2(colIdx, rowIdx) + cellUV) * tileSize;
    vec3 glyphSample = texture(uGlyphAtlas, atlasUV).rgb;
    mark = dot(glyphSample, vec3(0.299, 0.587, 0.114));
  } else {
    vec2 cellUV = fract(pix / cell) - 0.5;
    float dist = length(cellUV);
    float radius = clamp(gray + uPaletteBias, 0.0, 1.0) * 0.5;
    float aa = fwidth(dist) + 1e-4;
    mark = 1.0 - smoothstep(radius - aa, radius + aa, dist);
  }

  float g2 = clamp(gray + uPaletteBias, 0.0, 1.0);
  int cnt = max(uPaletteCount, 1);
  vec3 dotCol;
  float dotOpacity;
  if (cnt <= 1) {
    dotCol = uPalette[0];
    dotOpacity = uPaletteA[0];
  } else {
    float scaled = g2 * float(cnt - 1);
    int i0 = int(floor(scaled));
    i0 = clamp(i0, 0, cnt - 2);
    float f = scaled - float(i0);
    dotCol = mix(uPalette[i0], uPalette[i0 + 1], f);
    dotOpacity = mix(uPaletteA[i0], uPaletteA[i0 + 1], f);
  }
  fragColor = vec4(dotCol, mark * dotOpacity);
}`;

    const maxColors = 10;

    function tokenToRgb(token: string): [number, number, number] {
        const probe = document.createElement('canvas');
        probe.width = 1;
        probe.height = 1;

        const probeCtx = probe.getContext('2d', { willReadFrequently: true });

        if (!probeCtx) {
            return [0, 0, 0];
        }

        probeCtx.fillStyle = '#000000';
        probeCtx.fillStyle = token;
        probeCtx.fillRect(0, 0, 1, 1);

        const [r, g, b] = probeCtx.getImageData(0, 0, 1, 1).data;

        return [r / 255, g / 255, b / 255];
    }

    function themedPalette(): {
        rgb: [number, number, number][];
        alpha: number[];
    } {
        const styles = getComputedStyle(document.documentElement);
        const dark = document.documentElement.classList.contains('dark');
        const gray = dark ? 0.15 : 0;
        const tone: [number, number, number] = [gray, gray, gray];
        const [pr, pg, pb] = tokenToRgb(styles.getPropertyValue('--color-primary').trim());
        const dim = dark ? 0.35 : 1;
        const primary: [number, number, number] = [pr * dim, pg * dim, pb * dim];
        const alphaScale = dark ? 0.2 : 1;
        const rgb: [number, number, number][] = [];
        const alpha: number[] = [];

        for (let i = 0; i < maxColors; i += 1) {
            if (i < maxColors / 2) {
                rgb.push(tone);
                alpha.push(0.06 * alphaScale);
            } else {
                rgb.push(primary);
                alpha.push((0.15 + (i - maxColors / 2) * 0.0875) * alphaScale);
            }
        }

        return { rgb, alpha };
    }

    function mapLinear(
        value: number,
        inMin: number,
        inMax: number,
        outMin: number,
        outMax: number
    ): number {
        if (inMax === inMin) {
            return outMin;
        }

        return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
    }

    function buildGlyphAtlas(
        gl: OglContext,
        glyphs: string,
        fontSettings: FontSettings,
        paddingPx: number
    ): { texture: Texture; cols: number; rows: number; count: number } {
        const count = Math.max(1, glyphs.length);
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const cellPx = Math.max(8, fontSettings.sizePx + paddingPx * 2);
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        const atlasCanvas = document.createElement('canvas');
        atlasCanvas.width = cols * cellPx * scale;
        atlasCanvas.height = rows * cellPx * scale;

        const atlasCtx = atlasCanvas.getContext('2d');

        if (atlasCtx) {
            atlasCtx.scale(scale, scale);
            atlasCtx.fillStyle = '#000000';
            atlasCtx.fillRect(0, 0, atlasCanvas.width / scale, atlasCanvas.height / scale);
            atlasCtx.fillStyle = '#ffffff';
            atlasCtx.textAlign = 'center';
            atlasCtx.textBaseline = 'middle';
            atlasCtx.font = `${fontSettings.weight} ${fontSettings.sizePx}px ${fontSettings.family}`;

            for (let i = 0; i < count; i += 1) {
                const x = (i % cols) * cellPx + cellPx / 2;
                const y = Math.floor(i / cols) * cellPx + cellPx / 2;
                atlasCtx.fillText(glyphs[i], x, y);
            }
        }

        const texture = new Texture(gl, {
            image: atlasCanvas,
            wrapS: gl.CLAMP_TO_EDGE,
            wrapT: gl.CLAMP_TO_EDGE,
            generateMipmaps: false,
            flipY: true
        });

        return { texture, cols, rows, count };
    }

    function releaseTexture(texture: ReleasableTexture | null): void {
        if (!texture) {
            return;
        }

        if (texture.destroy) {
            texture.destroy();
        }
    }

    onMount(() => {
        const maybeSurface = container;

        if (!maybeSurface) {
            return;
        }

        const surface: HTMLDivElement = maybeSurface;

        const paletteCount = maxColors;
        const palette = themedPalette();
        const glyphs = Array.from(typeof characters === 'string' ? characters : '')
            .filter((glyph) => !/\s/.test(glyph))
            .join('');

        const effectiveGlyphs = glyphs.length > 0 ? glyphs : '●○•·';
        const renderer = new Renderer({
            dpr: Math.min(window.devicePixelRatio || 1, 2),
            alpha: true,
            premultipliedAlpha: false
        });
        const gl = renderer.gl;
        surface.appendChild(gl.canvas);

        const camera = new Camera(gl, { near: 0.1, far: 100 });
        camera.position.set(0, 0, 3);

        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let playing = !motion.matches;
        let raf = 0;
        let lastFrame = 0;
        let glyphTexture: ReleasableTexture | null = null;

        const perlinProgram = new Program(gl, {
            vertex: perlinVertexShader,
            fragment: perlinFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uFrequency: { value: mapLinear(frequency, 1, 10, 0.3, 6) },
                uSpeed: { value: playing ? speed * 0.05 : 0 },
                uValue: { value: 1 },
                uResolution: { value: [gl.canvas.width, gl.canvas.height] }
            }
        });
        const perlinMesh = new Mesh(gl, {
            geometry: new Plane(gl, { width: 2, height: 2 }),
            program: perlinProgram
        });
        const renderTarget = new RenderTarget(gl);
        const dummyGlyphTexture = new Texture(gl, {
            width: 1,
            height: 1,
            generateMipmaps: false,
            flipY: false
        });
        const dotProgram = new Program(gl, {
            vertex: dotVertexShader,
            fragment: dotFragmentShader,
            uniforms: {
                uResolution: { value: [gl.canvas.width, gl.canvas.height] },
                uTexture: { value: renderTarget.texture },
                uPaletteCount: { value: paletteCount },
                uPalette: { value: palette.rgb },
                uPaletteA: { value: palette.alpha },
                uCellSize: { value: mapLinear(cellSize, 1, 100, 6, 60) },
                uGamma: { value: mapLinear(gamma, 1, 20, 0.5, 8) },
                uPaletteBias: { value: paletteBias * 0.05 },
                uUseGlyphAtlas: { value: useGlyphAtlas ? 1 : 0 },
                uGlyphAtlas: { value: dummyGlyphTexture },
                uGlyphGrid: { value: [0, 0] },
                uCharCount: { value: 0 }
            }
        });
        const dotMesh = new Mesh(gl, {
            geometry: new Plane(gl, { width: 2, height: 2 }),
            program: dotProgram
        });

        if (useGlyphAtlas) {
            const settings: FontSettings = {
                family: fontFamily,
                weight: fontWeight,
                sizePx: fontSizePx
            };
            document.fonts
                .load(`${settings.weight} ${settings.sizePx}px ${settings.family}`)
                .then(undefined, () => undefined);
            const atlas = buildGlyphAtlas(gl, effectiveGlyphs, settings, 2);
            glyphTexture = atlas.texture;
            dotProgram.uniforms.uGlyphAtlas.value = atlas.texture;
            dotProgram.uniforms.uGlyphGrid.value = [atlas.cols, atlas.rows];
            dotProgram.uniforms.uCharCount.value = atlas.count;
            dotProgram.uniforms.uUseGlyphAtlas.value = 1;
        }

        function syncResolution(): void {
            dotProgram.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
            perlinProgram.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
        }

        function renderOnce(): void {
            renderer.render({ scene: perlinMesh, camera, target: renderTarget });
            syncResolution();
            renderer.render({ scene: dotMesh, camera });
        }

        function tick(now: number): void {
            raf = requestAnimationFrame(tick);

            if (document.hidden || now - lastFrame < 1000 / 30) {
                return;
            }

            lastFrame = now;
            perlinProgram.uniforms.uTime.value = now * 0.001;
            renderer.render({ scene: perlinMesh, camera, target: renderTarget });
            syncResolution();
            renderer.render({ scene: dotMesh, camera });
        }

        function start(): void {
            if (raf === 0) {
                raf = requestAnimationFrame(tick);
            }
        }

        function stop(): void {
            if (raf !== 0) {
                cancelAnimationFrame(raf);
                raf = 0;
            }
        }

        function doResize(): void {
            const width = surface.clientWidth || window.innerWidth;
            const height = surface.clientHeight || window.innerHeight;
            renderer.setSize(width, height);
            camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
            renderTarget.setSize(gl.canvas.width, gl.canvas.height);
            syncResolution();

            if (!playing) {
                renderOnce();
            }
        }

        let resizeQueued = false;

        function scheduleResize(): void {
            if (resizeQueued) {
                return;
            }

            resizeQueued = true;
            requestAnimationFrame(() => {
                resizeQueued = false;
                doResize();
            });
        }

        function handleMotionChange(): void {
            playing = !motion.matches;
            perlinProgram.uniforms.uSpeed.value = playing ? speed * 0.05 : 0;

            if (playing) {
                start();
            } else {
                stop();
                renderOnce();
            }
        }

        const resizer = new ResizeObserver(scheduleResize);
        resizer.observe(surface);
        window.addEventListener('resize', scheduleResize);
        motion.addEventListener('change', handleMotionChange);

        const themeWatcher = new MutationObserver(() => {
            const next = themedPalette();
            dotProgram.uniforms.uPalette.value = next.rgb;
            dotProgram.uniforms.uPaletteA.value = next.alpha;

            if (!playing) {
                renderOnce();
            }
        });

        themeWatcher.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });
        scheduleResize();
        renderOnce();

        if (playing) {
            start();
        }

        return () => {
            stop();
            resizer.disconnect();
            themeWatcher.disconnect();
            window.removeEventListener('resize', scheduleResize);
            motion.removeEventListener('change', handleMotionChange);
            releaseTexture(glyphTexture);
            releaseTexture(dummyGlyphTexture);

            if (gl.canvas.parentElement === surface) {
                surface.removeChild(gl.canvas);
            }
        };
    });
</script>

<div
    class={`h-full w-full overflow-hidden leading-none ${className}`}
    style={`background: ${bgColor};`}
    aria-hidden="true"
>
    <div bind:this={container} class="absolute inset-0"></div>
</div>
