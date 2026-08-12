"use client";

import { useEffect, useRef } from "react";

const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    v_texCoord = position * 0.5 + 0.5;
  }
`;

const fragmentShaderSource = `
  precision highp float;
  varying vec2 v_texCoord;
  uniform float u_time;
  uniform float u_dark;
  uniform vec3 u_accent;

  float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  #define OCTAVES 5
  float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < OCTAVES; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = v_texCoord;

    vec3 color1Light = vec3(0.96, 0.98, 1.0);
    vec3 color2Light = vec3(0.88, 0.94, 1.0);
    vec3 color1Dark = vec3(0.03, 0.035, 0.045);
    vec3 color2Dark = vec3(0.06, 0.07, 0.09);
    vec3 color1 = mix(color1Light, color1Dark, u_dark);
    vec3 color2 = mix(color2Light, color2Dark, u_dark);
    vec3 accent = u_accent;

    float n = fbm(uv * 1.5 + u_time * 0.04);
    n += 0.3 * fbm(uv * 3.0 - u_time * 0.02);

    vec3 finalColor = mix(color1, color2, n * 0.7);
    finalColor = mix(finalColor, accent, pow(n, 6.0) * mix(0.12, 0.18, u_dark));

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function readAccentColor(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--brand-accent")
    .trim();
  const hex = raw.replace("#", "");
  if (hex.length !== 6 && hex.length !== 8) return [0.192, 0.192, 0.192];
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r / 255, g / 255, b / 255];
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function HeroShaderBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionAttributeLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const timeUniformLocation = gl.getUniformLocation(program, "u_time");
    const darkUniformLocation = gl.getUniformLocation(program, "u_dark");
    const accentUniformLocation = gl.getUniformLocation(program, "u_accent");

    let isDark = document.documentElement.classList.contains("dark");
    let accentColor = readAccentColor();
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
      accentColor = readAccentColor();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let animationFrame: number;

    function resize() {
      if (!canvas || !gl) return;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener("resize", resize);
    resize();

    function render(time: number) {
      if (!gl) return;
      gl.useProgram(program);
      gl.uniform1f(timeUniformLocation, time * 0.001);
      gl.uniform1f(darkUniformLocation, isDark ? 1 : 0);
      gl.uniform3f(accentUniformLocation, accentColor[0], accentColor[1], accentColor[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = requestAnimationFrame(render);
    }
    animationFrame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
      themeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
