# 信用卡扫描动画效果 - 深度技术解析

## 一、 目录
1. [项目概述](#项目概述)
2. [技术架构](#技术架构)
3. [核心功能实现](#核心功能实现)
4. [关键技术点详解](#关键技术点详解)
5. [性能优化](#性能优化)
6. [代码结构](#代码结构)

---

## 二、 项目概述

这是一个基于 React + Vite + Three.js 的交互式信用卡扫描动画效果，灵感来源于 Evervault 的设计。页面展示了卡片在扫描器前经过时，从正常视图转换为 ASCII 代码视图的视觉效果。

### 核心视觉效果
- ✨ 卡片无限循环流动
- 🎨 扫描器粒子光效
- 💫 Three.js 背景粒子系统
- 📱 拖拽、滚轮、触摸交互
- 🔄 实时速度显示和方向控制

---

## 三、 技术架构

### 技术栈
```
React 19.1.1
├── React Hooks (useState, useRef, useEffect, useCallback)
├── Custom Hooks 架构
└── 组件化设计

Three.js r128
├── WebGL 渲染
├── Shader 材质
└── BufferGeometry 优化

Canvas 2D API
├── 粒子系统
├── 渐变和合成模式
└── 实时渲染

CSS3
├── clip-path 裁剪
├── CSS 变量
└── 动画和过渡
```

### 架构设计

```
App.jsx (主组件)
├── useCardStream (卡片流控制器)
│   ├── 卡片创建和布局
│   ├── 拖拽交互
│   ├── 动画循环
│   └── 扫描检测
├── useParticleSystem (Three.js 粒子)
│   ├── WebGL 渲染
│   ├── Shader 材质
│   └── 粒子动画
└── useParticleScanner (扫描器粒子)
    ├── Canvas 2D 渲染
    ├── 动态强度调整
    └── 光效绘制
```

---

## 四、 核心功能实现

### 1. 卡片流系统 (CardStreamController)

#### 1.1 卡片结构
每张卡片由两层组成：
- **正常层** (`card-normal`): 显示信用卡图片
- **ASCII 层** (`card-ascii`): 显示生成的代码文本

```javascript
// 卡片创建逻辑
const createCardWrapper = (index) => {
  // 正常卡片层
  const normalCard = document.createElement("div");
  normalCard.className = "card card-normal";
  
  // ASCII 代码层
  const asciiCard = document.createElement("div");
  asciiCard.className = "card card-ascii";
  
  // 使用 clip-path 控制显示区域
  normalCard.style.clipPath = `inset(0 0 0 var(--clip-right, 0%))`;
  asciiCard.style.clipPath = `inset(0 calc(100% - var(--clip-left, 0%)) 0 0)`;
}
```

#### 1.2 扫描检测算法

核心思路：计算扫描器与卡片的交集，动态调整 clip-path

```javascript
const updateCardClipping = () => {
  const scannerX = window.innerWidth / 2;  // 扫描器居中
  const scannerWidth = 8;                   // 扫描器宽度 8px
  const scannerLeft = scannerX - scannerWidth / 2;
  const scannerRight = scannerX + scannerWidth / 2;
  
  document.querySelectorAll(".card-wrapper").forEach((wrapper) => {
    const rect = wrapper.getBoundingClientRect();
    const cardLeft = rect.left;
    const cardRight = rect.right;
    const cardWidth = rect.width;
    
    // 检测交集
    if (cardLeft < scannerRight && cardRight > scannerLeft) {
      // 计算交集区域
      const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
      const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth);
      
      // 转换为百分比
      const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
      const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;
      
      // 应用裁剪
      normalCard.style.setProperty("--clip-right", `${normalClipRight}%`);
      asciiCard.style.setProperty("--clip-left", `${asciiClipLeft}%`);
    }
  });
}
```

**关键点**：
- 使用 `getBoundingClientRect()` 获取实时位置
- 通过 CSS 变量 `--clip-right` 和 `--clip-left` 控制裁剪
- `requestAnimationFrame` 实现 60fps 检测更新

#### 1.3 物理模拟系统

```javascript
const animate = () => {
  const currentTime = performance.now();
  const deltaTime = (currentTime - lastTime) / 1000;  // 帧时间差
  
  // 摩擦力模拟
  if (velocity > minVelocity) {
    velocity *= friction;  // 0.95 摩擦系数
  }
  
  // 位置更新
  position += velocity * direction * deltaTime;
  
  // 循环边界
  if (position < -cardLineWidth) {
    position = containerWidth;  // 无缝循环
  }
  
  requestAnimationFrame(animate);
}
```

**物理参数**：
- `velocity`: 初始速度 120px/s
- `friction`: 摩擦系数 0.95
- `minVelocity`: 最小速度 30px/s
- `direction`: 方向 -1 或 1

#### 1.4 拖拽交互

```javascript
const startDrag = (e) => {
  // 获取当前 transform 矩阵
  const transform = window.getComputedStyle(cardLine).transform;
  if (transform !== "none") {
    const matrix = new DOMMatrix(transform);
    position = matrix.m41;  // 提取 X 位移
  }
  
  isDragging = true;
  isAnimating = false;
}

const onDrag = (e) => {
  const deltaX = e.clientX - lastMouseX;
  position += deltaX;
  mouseVelocity = deltaX * 60;  // 计算速度（假设 60fps）
  lastMouseX = e.clientX;
}

const endDrag = () => {
  // 根据拖拽速度设置惯性
  if (Math.abs(mouseVelocity) > minVelocity) {
    velocity = Math.abs(mouseVelocity);
    direction = mouseVelocity > 0 ? 1 : -1;
  }
}
```

---

### 2. ASCII 代码生成系统

#### 2.1 代码库构建

```javascript
const generateCode = (width, height) => {
  // 1. 构建代码片段库
  const library = [
    "// compiled preview • scanner demo",
    "const SCAN_WIDTH = 8;",
    "function clamp(n, a, b) { ... }",
    "class Particle { ... }",
    // ... 更多代码片段
  ];
  
  // 2. 填充到指定尺寸
  let flow = library.join(" ");
  const totalChars = width * height;
  while (flow.length < totalChars + width) {
    flow += " " + pick(library);  // 随机选择片段填充
  }
  
  // 3. 按行分割
  let out = "";
  for (let row = 0; row < height; row++) {
    let line = flow.slice(offset, offset + width);
    out += line + "\n";
    offset += width;
  }
  
  return out;
}
```

#### 2.2 动态更新

```javascript
// 每 200ms 随机更新 15% 的卡片
setInterval(() => {
  document.querySelectorAll(".ascii-content").forEach((content) => {
    if (Math.random() < 0.15) {
      content.textContent = generateCode(width, height);
    }
  });
}, 200);
```

#### 2.3 视觉效果

```css
.ascii-content {
  color: rgba(220, 210, 255, 0.6);
  font-family: "Courier New", monospace;
  font-size: 11px;
  line-height: 13px;
  
  /* 渐变遮罩 - 右侧淡出 */
  -webkit-mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.8) 30%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.4) 80%,
    rgba(0, 0, 0, 0.2) 100%
  );
  
  /* 闪烁动画 */
  animation: glitch 0.1s infinite linear alternate-reverse;
}
```

---

### 3. Three.js 粒子系统

#### 3.1 场景设置

```javascript
// 正交相机 - 适合 2D 效果
const camera = new THREE.OrthographicCamera(
  -window.innerWidth / 2,   // left
  window.innerWidth / 2,    // right
  125,                       // top
  -125,                     // bottom
  1,
  1000
);

// WebGL 渲染器
const renderer = new THREE.WebGLRenderer({
  canvas: canvasRef.current,
  alpha: true,              // 透明背景
  antialias: true           // 抗锯齿
});
```

#### 3.2 粒子纹理生成

```javascript
// 使用 Canvas 2D 生成径向渐变纹理
const canvas = document.createElement("canvas");
canvas.width = 100;
canvas.height = 100;
const ctx = canvas.getContext("2d");

const gradient = ctx.createRadialGradient(50, 50, 0, 50, 50, 50);
gradient.addColorStop(0.025, "#fff");           // 中心白色
gradient.addColorStop(0.1, "hsl(217, 61%, 33%)"); // 蓝色
gradient.addColorStop(0.25, "hsl(217, 64%, 6%)"); // 深蓝
gradient.addColorStop(1, "transparent");         // 透明边缘

ctx.fillStyle = gradient;
ctx.arc(50, 50, 50, 0, Math.PI * 2);
ctx.fill();

const texture = new THREE.CanvasTexture(canvas);
```

#### 3.3 Shader 材质

**顶点着色器**：
```glsl
attribute float alpha;
varying float vAlpha;
varying vec3 vColor;
uniform float size;

void main() {
  vAlpha = alpha;
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size;
  gl_Position = projectionMatrix * mvPosition;
}
```

**片段着色器**：
```glsl
uniform sampler2D pointTexture;
varying float vAlpha;
varying vec3 vColor;

void main() {
  // 使用纹理和透明度
  gl_FragColor = vec4(vColor, vAlpha) * texture2D(pointTexture, gl_PointCoord);
}
```

#### 3.4 粒子动画

```javascript
for (let i = 0; i < particleCount; i++) {
  // X 轴移动
  positions[i * 3] += velocities[i] * 0.016;
  
  // 边界循环
  if (positions[i * 3] > window.innerWidth / 2 + 100) {
    positions[i * 3] = -window.innerWidth / 2 - 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 250;  // 随机 Y
  }
  
  // Y 轴正弦波动
  positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;
  
  // 闪烁效果
  const twinkle = Math.floor(Math.random() * 10);
  if (twinkle === 1) alphas[i] -= 0.05;
  if (twinkle === 2) alphas[i] += 0.05;
}
```

**关键优化**：
- 使用 `BufferGeometry` 存储大量粒子
- `needsUpdate` 标志避免不必要的更新
- `AdditiveBlending` 混合模式增强光效

---

### 4. 扫描器粒子系统 (Canvas 2D)

#### 4.1 动态强度系统

```javascript
// 扫描激活时增强效果
const targetIntensity = scanningActive ? 1.8 : 0.8;
const targetMaxParticles = scanningActive ? 2500 : 800;
const targetFadeZone = scanningActive ? 35 : 60;

// 平滑过渡
currentIntensity += (targetIntensity - currentIntensity) * 0.05;
```

#### 4.2 光柱绘制

```javascript
const drawLightBar = () => {
  // 核心光柱
  const coreGradient = ctx.createLinearGradient(
    lightBarX - lineWidth / 2, 0,
    lightBarX + lineWidth / 2, 0
  );
  coreGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
  coreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${glowIntensity})`);
  coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  
  // 三层光晕
  // Glow 1: 内层紫色光晕
  // Glow 2: 中层扩散
  // Glow 3: 外层（仅扫描时）
  
  ctx.globalCompositeOperation = "lighter";  // 加色混合
  ctx.fillStyle = coreGradient;
  ctx.fillRect(...);
}
```

#### 4.3 粒子生成策略

```javascript
// 基础生成率
if (Math.random() < currentIntensity && count < maxParticles) {
  createParticle();
}

// 强度越高，额外生成越多
const intensityRatio = intensity / baseIntensity;
if (intensityRatio > 1.1) {
  // 额外生成逻辑
  if (Math.random() < (intensityRatio - 1.0) * 1.2) {
    createParticle();
  }
}
```

#### 4.4 粒子生命周期

```javascript
const updateParticle = (particle) => {
  // 位置更新
  particle.x += particle.vx;
  particle.y += particle.vy;
  
  // 透明度闪烁
  particle.alpha = particle.originalAlpha * particle.life 
    + Math.sin(particle.time * particle.twinkleSpeed) * particle.twinkleAmount;
  
  // 生命周期衰减
  particle.life -= particle.decay;
  
  // 重置条件
  if (particle.x > width + 10 || particle.life <= 0) {
    resetParticle(particle);
  }
}
```

---

## 五、 关键技术点详解

### 1. CSS clip-path 裁剪

**原理**：使用 `clip-path` 动态裁剪元素显示区域

```css
/* 正常卡片：从右侧裁剪 */
.card-normal {
  clip-path: inset(0 0 0 var(--clip-right, 0%));
  /* 含义：top right bottom left */
}

/* ASCII 卡片：从左侧裁剪 */
.card-ascii {
  clip-path: inset(0 calc(100% - var(--clip-left, 0%)) 0 0);
}
```

**优势**：
- GPU 加速，性能优秀
- 支持 CSS 变量动态更新
- 无需 JavaScript 操作 DOM

### 2. requestAnimationFrame 优化

```javascript
// 卡片位置更新：60fps
const animate = () => {
  updateCardPosition();
  requestAnimationFrame(animate);
}

// 裁剪检测：60fps
const updateClipping = () => {
  updateCardClipping();
  requestAnimationFrame(updateClipping);
}

// 粒子渲染：60fps
const render = () => {
  drawParticles();
  requestAnimationFrame(render);
}
```

**关键点**：
- 三个独立的动画循环
- 使用 `performance.now()` 计算 deltaTime
- 避免阻塞主线程

### 3. 无缝循环实现

```javascript
const updateCardPosition = () => {
  // 左边界检测
  if (position < -cardLineWidth) {
    position = containerWidth;  // 跳到右侧
  }
  // 右边界检测
  else if (position > containerWidth) {
    position = -cardLineWidth;  // 跳到左侧
  }
}
```

**视觉效果**：30 张卡片无缝循环，用户感知不到跳跃

### 4. 拖拽惯性模拟

```javascript
// 计算拖拽速度
mouseVelocity = deltaX * 60;  // 假设 60fps

// 释放时应用速度
if (Math.abs(mouseVelocity) > minVelocity) {
  velocity = Math.abs(mouseVelocity);
  direction = mouseVelocity > 0 ? 1 : -1;
}

// 摩擦力衰减
velocity *= friction;  // 0.95
```

### 5. Canvas 合成模式

```javascript
// 加色混合 - 增强光效
ctx.globalCompositeOperation = "lighter";

// 遮罩模式 - 创建渐变边缘
ctx.globalCompositeOperation = "destination-in";
ctx.fillStyle = verticalGradient;
ctx.fillRect(0, 0, width, height);
```

---

## 六、 性能优化

### 1. 使用 useRef 避免重渲染

```javascript
// ❌ 错误：每次更新触发重渲染
const [position, setPosition] = useState(0);

// ✅ 正确：使用 ref 存储，不触发重渲染
const positionRef = useRef(0);
```

### 2. useCallback 优化函数

```javascript
// 避免每次渲染创建新函数
const updateCardPosition = useCallback(() => {
  // ...
}, [dependencies]);
```

### 3. BufferGeometry 批量更新

```javascript
// Three.js 粒子：批量更新位置
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.attributes.position.needsUpdate = true;
```

### 4. 条件渲染优化

```javascript
// 只在需要时更新
if (particlesRef.current && velocitiesRef.current) {
  // 更新逻辑
}
```

### 5. 事件委托

```javascript
// 在 document 上监听，避免每个卡片绑定
document.addEventListener("mousemove", onDrag);
document.addEventListener("mouseup", endDrag);
```

---

## 📁 代码结构

```
src/
├── App.jsx                    # 主组件
├── App.css                    # 样式文件
├── index.css                  # 全局样式
├── hooks/
│   ├── useCardStream.js       # 卡片流控制器
│   ├── useParticleSystem.js   # Three.js 粒子
│   └── useParticleScanner.js   # 扫描器粒子
└── utils/
    └── cardUtils.js           # ASCII 代码生成工具
```

---

## 八、 学习要点总结

### 核心技术
1. **CSS clip-path** - 实现扫描效果的核心
2. **requestAnimationFrame** - 高性能动画循环
3. **Three.js Shader** - 自定义粒子渲染
4. **Canvas 2D API** - 粒子系统和光效
5. **物理模拟** - 速度、摩擦力、惯性

### 设计模式
1. **Custom Hooks** - 逻辑封装和复用
2. **Ref 模式** - 性能优化
3. **事件委托** - 减少绑定
4. **状态分离** - UI 状态 vs 动画状态

### 最佳实践
1. 使用 `performance.now()` 计算时间差
2. 批量更新 DOM/Canvas
3. 合理使用合成模式
4. 及时清理事件监听器
5. 使用 `will-change` 提示浏览器优化

---

## 🚀 扩展建议

1. **添加更多交互**：双击加速、手势控制
2. **性能监控**：FPS 显示、性能分析
3. **响应式优化**：移动端适配
4. **音效系统**：扫描音效、背景音乐
5. **数据可视化**：扫描数据统计

---

**作者**: AI Assistant  
**日期**: 2024  
**灵感来源**: [Evervault.com](https://evervault.com/)

