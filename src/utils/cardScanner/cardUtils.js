const codeChars =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";

export function generateCode(width, height) {
  const randInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[randInt(0, arr.length - 1)];

  const header = [
    "//  OVVO Creative Lab • Interactive Experience",
    "/*  Visual Effect Engine v2.0 */",
    "import { useState, useEffect, useRef } from 'react';",
    "const ANIMATION_FPS = 60;",
    "const PARTICLE_DENSITY = 0.8;",
    "const SCANNER_INTENSITY = 3.5;",
  ];

  const helpers = [
    "const lerp = (a, b, t) => a + (b - a) * t;",
    "const clamp = (n, min, max) => Math.max(min, Math.min(max, n));",
    "const random = (min, max) => Math.random() * (max - min) + min;",
    "const easeInOut = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;",
    "const distance = (x1, y1, x2, y2) => Math.hypot(x2-x1, y2-y1);",
  ];

  const particleBlock = (idx) => [
    `class VisualParticle${idx} {`,
    "  constructor({ x, y, velocity, radius, color }) {",
    "    this.position = { x, y };",
    "    this.velocity = velocity;",
    "    this.radius = radius;",
    "    this.color = color;",
    "    this.alpha = 1.0;",
    "  }",
    "  update(deltaTime) {",
    "    this.position.x += this.velocity.x * deltaTime;",
    "    this.position.y += this.velocity.y * deltaTime;",
    "  }",
    "}",
  ];

  const scannerBlock = [
    "const ScannerConfig = {",
    "  position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },",
    "  dimensions: { width: 8, height: 300 },",
    "  intensity: 3.5,",
    "  glowRadius: 40,",
    "  color: 'rgba(139, 92, 246, 1)',",
    "};",
    "",
    "function renderGlow(ctx, config) {",
    "  ctx.shadowBlur = config.glowRadius;",
    "  ctx.shadowColor = config.color;",
    "  ctx.fillRect(config.position.x, config.position.y, config.dimensions.width, config.dimensions.height);",
    "}",
  ];

  const loopBlock = [
    "const AnimationLoop = () => {",
    "  let lastTime = performance.now();",
    "  const animate = (currentTime) => {",
    "    const deltaTime = (currentTime - lastTime) / 1000;",
    "    lastTime = currentTime;",
    "    // Update physics & render",
    "    requestAnimationFrame(animate);",
    "  };",
    "  requestAnimationFrame(animate);",
    "};",
  ];

  const misc = [
    "const AppState = { isScanning: false, velocity: 120, direction: -1 };",
    "const Canvas = { width: window.innerWidth, height: 300, ctx: null };",
    "const useAnimation = (callback) => useEffect(() => { const id = requestAnimationFrame(callback); return () => cancelAnimationFrame(id); }, []);",
    "//  Performance optimized with RAF",
    "//  GPU accelerated transforms",
    "export const createGradient = (ctx, colors) => { const g = ctx.createLinearGradient(0,0,100,100); colors.forEach((c,i)=>g.addColorStop(i/(colors.length-1),c)); return g; };",
  ];

  const library = [];
  header.forEach((l) => library.push(l));
  helpers.forEach((l) => library.push(l));
  for (let b = 0; b < 3; b++)
    particleBlock(b).forEach((l) => library.push(l));
  scannerBlock.forEach((l) => library.push(l));
  loopBlock.forEach((l) => library.push(l));
  misc.forEach((l) => library.push(l));

  for (let i = 0; i < 30; i++) {
    const operations = ['+', '-', '*', '/'];
    const op = operations[randInt(0, 3)];
    const n1 = randInt(10, 99);
    const n2 = randInt(1, 50);
    library.push(`const computed${i} = (${n1} ${op} ${n2}) * Math.PI;`);
  }
  
  const reactSnippets = [
    "const [state, setState] = useState(initialState);",
    "useEffect(() => { /* side effect */ }, [deps]);",
    "const memoized = useMemo(() => compute(), [value]);",
    "const callback = useCallback(() => handler(), []);",
  ];
  reactSnippets.forEach(s => library.push(s));
  
  for (let i = 0; i < 15; i++) {
    library.push(
      `if (particle.alpha > ${0.1 + (i % 5) * 0.1}) { particle.update(dt); }`
    );
  }

  let flow = library.join(" ");
  flow = flow.replace(/\s+/g, " ").trim();
  const totalChars = width * height;
  while (flow.length < totalChars + width) {
    const extra = pick(library).replace(/\s+/g, " ").trim();
    flow += " " + extra;
  }

  let out = "";
  let offset = 0;
  for (let row = 0; row < height; row++) {
    let line = flow.slice(offset, offset + width);
    if (line.length < width) line = line + " ".repeat(width - line.length);
    out += line + (row < height - 1 ? "\n" : "");
    offset += width;
  }
  return out;
}

export function calculateCodeDimensions(cardWidth, cardHeight) {
  const fontSize = 11;
  const lineHeight = 13;
  const charWidth = 6;
  const width = Math.floor(cardWidth / charWidth);
  const height = Math.floor(cardHeight / lineHeight);
  return { width, height, fontSize, lineHeight };
}
