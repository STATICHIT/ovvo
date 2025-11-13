# 🎨 信用卡扫描动画 - 技术分享指南

## 📖 快速概览

这是一个**交互式信用卡扫描动画效果**，展示了卡片经过扫描器时从正常视图转换为 ASCII 代码视图的视觉效果。

**核心技术栈**：
- React 19 + Vite
- Three.js (WebGL 粒子系统)
- Canvas 2D API (扫描器效果)
- CSS clip-path (扫描裁剪)

---

## 🎯 核心亮点

### 1. 扫描效果实现
**问题**：如何实现卡片经过扫描器时的渐进式转换？

**解决方案**：CSS `clip-path` + 实时碰撞检测

```javascript
// 检测扫描器与卡片的交集
if (cardLeft < scannerRight && cardRight > scannerLeft) {
  // 计算交集百分比
  const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
  const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;
  
  // 动态裁剪
  normalCard.style.setProperty("--clip-right", `${normalClipRight}%`);
  asciiCard.style.setProperty("--clip-left", `${asciiClipLeft}%`);
}
```

**关键点**：
- 使用 `getBoundingClientRect()` 获取实时位置
- `requestAnimationFrame` 实现 60fps 检测
- CSS 变量实现动态裁剪

---

### 2. 三层粒子系统

#### 背景层：Three.js WebGL 粒子
- **数量**：400 个粒子
- **技术**：Shader 材质 + BufferGeometry
- **效果**：平滑移动 + 闪烁动画

#### 扫描器层：Canvas 2D 粒子
- **数量**：800-2500（动态调整）
- **技术**：Canvas 2D + 渐变合成
- **效果**：扫描时增强，光柱效果

#### ASCII 代码层：动态文本
- **技术**：代码生成算法
- **效果**：随机更新，渐变遮罩

---

### 3. 物理模拟系统

```javascript
// 速度衰减（摩擦力）
velocity *= 0.95;

// 位置更新
position += velocity * direction * deltaTime;

// 拖拽惯性
if (Math.abs(mouseVelocity) > minVelocity) {
  velocity = Math.abs(mouseVelocity);
  direction = mouseVelocity > 0 ? 1 : -1;
}
```

**特点**：
- 真实的物理感受
- 平滑的拖拽体验
- 无缝循环边界

---

## 🔧 技术架构

```
App Component
├── useCardStream (卡片流)
│   ├── 卡片创建和布局
│   ├── 拖拽/滚轮交互
│   ├── 扫描检测算法
│   └── 动画循环
│
├── useParticleSystem (Three.js)
│   ├── WebGL 渲染器
│   ├── Shader 材质
│   └── 粒子动画
│
└── useParticleScanner (Canvas)
    ├── 动态强度调整
    ├── 光柱绘制
    └── 粒子生命周期
```

---

## 💡 关键技术点

### 1. CSS clip-path 裁剪

```css
/* 正常卡片：从右侧裁剪 */
clip-path: inset(0 0 0 var(--clip-right, 0%));

/* ASCII 卡片：从左侧裁剪 */
clip-path: inset(0 calc(100% - var(--clip-left, 0%)) 0 0);
```

**优势**：GPU 加速，性能优秀

### 2. requestAnimationFrame 优化

```javascript
// 三个独立的动画循环
const animate = () => {
  updateCardPosition();
  requestAnimationFrame(animate);
}

const updateClipping = () => {
  updateCardClipping();
  requestAnimationFrame(updateClipping);
}
```

### 3. 无缝循环

```javascript
if (position < -cardLineWidth) {
  position = containerWidth;  // 跳到右侧
}
```

### 4. Canvas 合成模式

```javascript
// 加色混合 - 增强光效
ctx.globalCompositeOperation = "lighter";

// 遮罩模式 - 渐变边缘
ctx.globalCompositeOperation = "destination-in";
```

---

## 📊 性能优化

1. **useRef 避免重渲染**
   ```javascript
   const positionRef = useRef(0);  // 不触发重渲染
   ```

2. **BufferGeometry 批量更新**
   ```javascript
   geometry.attributes.position.needsUpdate = true;
   ```

3. **事件委托**
   ```javascript
   document.addEventListener("mousemove", onDrag);
   ```

4. **条件更新**
   ```javascript
   if (isAnimating && !isDragging) {
     // 更新逻辑
   }
   ```

---

## 🎨 视觉效果解析

### 扫描效果流程

1. **卡片进入扫描区域**
   - 正常卡片从右侧开始裁剪
   - ASCII 卡片从左侧开始显示

2. **扫描过程中**
   - 实时计算交集百分比
   - 动态调整 clip-path
   - 触发扫描特效

3. **扫描完成**
   - 正常卡片完全裁剪
   - ASCII 卡片完全显示
   - 粒子效果增强

### 粒子系统层次

```
背景层 (Three.js)
  ↓
扫描器层 (Canvas 2D)
  ↓
卡片层 (DOM)
  ↓
ASCII 层 (DOM)
```

---

## 🚀 演示要点

### 可以展示的功能

1. **拖拽交互**
   - 鼠标拖拽卡片
   - 释放后惯性滑动
   - 触摸支持

2. **控制按钮**
   - 暂停/播放
   - 重置位置
   - 改变方向

3. **实时反馈**
   - 速度显示
   - 扫描状态
   - 粒子强度变化

### 技术亮点

1. **60fps 流畅动画**
   - requestAnimationFrame
   - 性能优化

2. **GPU 加速**
   - CSS clip-path
   - WebGL 渲染

3. **响应式设计**
   - 窗口大小自适应
   - 移动端支持

---

## 📝 分享建议

### 技术分享结构

1. **开场** (2分钟)
   - 展示效果
   - 介绍灵感来源

2. **核心实现** (10分钟)
   - clip-path 扫描效果
   - 粒子系统架构
   - 物理模拟

3. **技术细节** (8分钟)
   - 代码解析
   - 性能优化
   - 最佳实践

4. **Q&A** (5分钟)

### 重点强调

✅ **clip-path 的巧妙应用**  
✅ **三层粒子系统的协同**  
✅ **性能优化的实践**  
✅ **物理模拟的真实感**

---

## 🔗 相关资源

- **完整代码**: `/src` 目录
- **技术文档**: `TECHNICAL_ANALYSIS.md`
- **灵感来源**: [Evervault.com](https://evervault.com/)

---

**提示**：运行 `npm run dev` 启动项目，可以实时查看效果和代码！

