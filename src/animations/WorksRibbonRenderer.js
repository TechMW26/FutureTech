import { projectRibbonPoint, ribbonPoint, ribbonScene, ribbonCardOpacity, ribbonClip } from './WorksRibbonMotion';

const COLS = 48, ROWS = 6, STRIDE = 6;
const VERTEX = `
attribute vec3 aPosition;
attribute vec2 aUV;
attribute float aShade;
uniform vec2 uViewport;
uniform float uPerspective;
varying vec2 vUV;
varying float vShade;
void main() {
  float w = 1.0 - aPosition.z / uPerspective;
  gl_Position = vec4(aPosition.x * 2.0 / uViewport.x, -aPosition.y * 2.0 / uViewport.y, -aPosition.z / (uPerspective * 2.0), w);
  vUV = aUV;
  vShade = aShade;
}`;
const FRAGMENT = `
precision mediump float;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uFocused;
uniform float uMini;
varying vec2 vUV;
varying float vShade;
void main() {
  vec4 color = texture2D(uTexture, vUV);
  float edge = min(min(vUV.x, 1.0 - vUV.x), min(vUV.y, 1.0 - vUV.y));
  vec3 rgb = color.rgb * vShade;
  if (uFocused > 0.5 && edge < 0.012) rgb = vec3(0.0, 0.26, 0.49);
  float alpha = color.a * uOpacity;
  if (!gl_FrontFacing) {
    if (uMini < 0.001) discard;
    rgb = mix(vec3(0.97, 0.97, 0.985), rgb, 0.35);
    alpha *= uMini * 0.6;
  }
  gl_FragColor = vec4(rgb, alpha);
}`;

export class WorksRibbonRenderer {
  gl;
  program;
  buffer;
  indicesBuffer;
  indices;
  textures = [];
  vertices = [];
  images = [];
  active = true;
  scene = null;
  readyCount = 0;
  uniforms;

  constructor(canvas, count, wake, fail) {
    this.canvas = canvas;
    this.count = count;
    this.wake = wake;
    this.fail = fail;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, depth: true, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) throw new Error('WebGL unavailable');
    this.gl = gl;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { const message = gl.getShaderInfoLog(shader); gl.deleteShader(shader); throw new Error(message || 'Shader compilation failed'); }
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, VERTEX), fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertex); gl.attachShader(this.program, fragment); gl.linkProgram(this.program);
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw new Error('Ribbon shader link failed');
    gl.useProgram(this.program);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, (COLS + 1) * (ROWS + 1) * STRIDE * 4, gl.DYNAMIC_DRAW);
    for (const [name, size, offset] of [['aPosition', 3, 0], ['aUV', 2, 12], ['aShade', 1, 20]]) {
      const location = gl.getAttribLocation(this.program, name);
      gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, size, gl.FLOAT, false, STRIDE * 4, offset);
    }
    const indices = [];
    for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) {
      const a = row * (COLS + 1) + col, b = a + 1, c = a + COLS + 1, d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
    this.indices = new Uint16Array(indices);
    this.indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    this.uniforms = { viewport: gl.getUniformLocation(this.program, 'uViewport'), perspective: gl.getUniformLocation(this.program, 'uPerspective'), opacity: gl.getUniformLocation(this.program, 'uOpacity'), focused: gl.getUniformLocation(this.program, 'uFocused'), mini: gl.getUniformLocation(this.program, 'uMini') };
    gl.uniform1i(gl.getUniformLocation(this.program, 'uTexture'), 0);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    for (let index = 0; index < count; index++) {
      this.vertices.push(new Float32Array((COLS + 1) * (ROWS + 1) * STRIDE));
      const texture = gl.createTexture();
      this.textures.push(texture);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([247, 247, 251, 255]));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const image = new Image();
      this.images.push(image);
      image.onload = () => {
        if (!this.active) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        this.readyCount++; this.wake();
      };
      image.onerror = () => { if (this.active) this.fail(); };
      image.src = `/images/work-preview-${index + 1}.png`;
    }
  }

  render(progress, width, height, focused = -1, miniSpin = 0) {
    if (!this.active) return;
    const gl = this.gl, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(width * dpr), pixelHeight = Math.round(height * dpr);
    if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) { this.canvas.width = pixelWidth; this.canvas.height = pixelHeight; }
    gl.viewport(0, 0, pixelWidth, pixelHeight);
    gl.disable(gl.SCISSOR_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const scene = ribbonScene(progress, width, height, this.count, miniSpin);
    this.scene = scene;
    if (this.readyCount < this.count || scene.opacity < .001) return;
    gl.useProgram(this.program);
    gl.uniform1f(this.uniforms.mini, scene.mini);
    if (scene.mini > .001) gl.disable(gl.CULL_FACE);
    else gl.enable(gl.CULL_FACE);
    gl.uniform2f(this.uniforms.viewport, width, height);
    gl.uniform1f(this.uniforms.perspective, scene.perspective);
    const clip = ribbonClip(scene);
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(Math.floor(clip.left * dpr), Math.floor((height - clip.bottom) * dpr), Math.ceil((clip.right - clip.left) * dpr), Math.ceil((clip.bottom - clip.top) * dpr));
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    for (let index = 0; index < this.count; index++) {
      const opacity = ribbonCardOpacity(scene, index);
      if (opacity < .001) continue;
      gl.uniform1f(this.uniforms.opacity, opacity);
      const vertices = this.vertices[index];
      for (let row = 0; row <= ROWS; row++) for (let col = 0; col <= COLS; col++) {
        const u = col / COLS, v = row / ROWS, point = ribbonPoint(scene, index, u, v);
        const offset = (row * (COLS + 1) + col) * STRIDE;
        vertices[offset] = point.x; vertices[offset + 1] = point.y; vertices[offset + 2] = point.z;
        vertices[offset + 3] = u; vertices[offset + 4] = v; vertices[offset + 5] = point.shade;
      }
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
      gl.bindTexture(gl.TEXTURE_2D, this.textures[index]);
      gl.uniform1f(this.uniforms.focused, focused === index ? 1 : 0);
      gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
  }

  pick(x, y) {
    const scene = this.scene;
    if (!scene || scene.opacity < .9 || this.readyCount < this.count) return -1;
    const clip = ribbonClip(scene);
    if (x < clip.left || x > clip.right || y < clip.top || y > clip.bottom) return -1;
    let hit = -1, closest = -Infinity;
    for (let card = 0; card < this.count; card++) {
      if (ribbonCardOpacity(scene, card) < .15) continue;
      const vertices = this.vertices[card];
      const projected = Array.from({ length: vertices.length / STRIDE }, (_, index) => {
        const offset = index * STRIDE;
        return projectRibbonPoint({ x: vertices[offset], y: vertices[offset + 1], z: vertices[offset + 2] }, scene);
      });
      for (let i = 0; i < this.indices.length; i += 3) {
        const a = projected[this.indices[i]], b = projected[this.indices[i + 1]], c = projected[this.indices[i + 2]];
        const denominator = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
        if (denominator >= -.001) continue;
        const wa = ((b.y - c.y) * (x - c.x) + (c.x - b.x) * (y - c.y)) / denominator;
        const wb = ((c.y - a.y) * (x - c.x) + (a.x - c.x) * (y - c.y)) / denominator;
        const wc = 1 - wa - wb;
        if (wa >= 0 && wb >= 0 && wc >= 0) {
          const depth = wa * a.z + wb * b.z + wc * c.z;
          if (depth > closest) { closest = depth; hit = card; }
        }
      }
    }
    return hit;
  }

  dispose() {
    this.active = false;
    this.images.forEach(image => { image.onload = null; image.onerror = null; });
    this.textures.forEach(texture => this.gl.deleteTexture(texture));
    this.gl.deleteBuffer(this.buffer); this.gl.deleteBuffer(this.indicesBuffer); this.gl.deleteProgram(this.program);
  }
}
