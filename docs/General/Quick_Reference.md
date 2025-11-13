# 快速参考指南

## 一、文档快速访问

### 项目文档
- [项目 README](../../README.md) - 项目总览
- [文档中心](../README.md) - 所有文档索引
- [项目结构](./Project_Structure.md) - 目录结构和开发指南

### 技术解析文档
- [Card Scanner 深度解析](../CardScanner/CardScanner_Analysis.md)
- [Card Scanner 分享指南](../CardScanner/CardScanner_SharingGuide.md)
- [Particle Canvas 深度解析](../ParticleCanvas/ParticleCanvas_Analysis.md)

---

## 二、按需求查找

### 我想了解项目结构
→ [Project_Structure.md](./Project_Structure.md)

### 我想学习 Card Scanner 实现
→ [CardScanner_Analysis.md](../CardScanner/CardScanner_Analysis.md)

### 我想做技术分享
→ [CardScanner_SharingGuide.md](../CardScanner/CardScanner_SharingGuide.md)

### 我想学习粒子系统
→ [ParticleCanvas_Analysis.md](../ParticleCanvas/ParticleCanvas_Analysis.md)

### 我想添加新项目
→ [Project_Structure.md](./Project_Structure.md) - "添加新页面"章节

---

## 三、关键技术速查

### CSS clip-path
```css
clip-path: inset(0 0 0 var(--clip-right, 0%));
```
详见：[CardScanner_Analysis.md](../CardScanner/CardScanner_Analysis.md) - "CSS clip-path 裁剪"

### Three.js Shader
```javascript
const material = new THREE.ShaderMaterial({
  vertexShader: `...`,
  fragmentShader: `...`
});
```
详见：[CardScanner_Analysis.md](../CardScanner/CardScanner_Analysis.md) - "Shader 材质"

### Canvas 粒子系统
```javascript
class Particle {
  update() { /* 物理更新 */ }
  draw() { /* 渲染 */ }
}
```
详见：[ParticleCanvas_Analysis.md](../ParticleCanvas/ParticleCanvas_Analysis.md) - "粒子系统"

### requestAnimationFrame
```javascript
const animate = () => {
  // 更新和渲染
  requestAnimationFrame(animate);
}
```
详见：所有技术文档 - "性能优化"章节

---

## 四、文档组织结构

```
docs/
├── README.md                    # 文档中心首页
├── General/                     # 通用文档
│   ├── Project_Structure.md
│   └── Quick_Reference.md
├── CardScanner/                 # Card Scanner 文档
│   ├── CardScanner_Analysis.md
│   └── CardScanner_SharingGuide.md
└── ParticleCanvas/              # Particle Canvas 文档
    └── ParticleCanvas_Analysis.md
```

---

## 五、学习路径

### 初学者
1. 阅读项目 README
2. 了解项目结构
3. 运行项目，体验效果
4. 阅读技术解析文档的"项目概述"部分

### 进阶开发者
1. 深入阅读技术解析文档
2. 研究核心代码实现
3. 尝试修改参数和效果
4. 添加新功能

### 技术分享者
1. 阅读分享指南
2. 准备演示环境
3. 重点讲解核心技术
4. 准备 Q&A

---

## 六、常见问题

### 如何添加新项目？
参考 [Project_Structure.md](./Project_Structure.md) 的"添加新页面"章节

### 如何优化性能？
查看各技术文档的"性能优化"章节

### 如何调试？
查看技术文档的"调试技巧"章节

### 如何部署？
运行 `npm run build` 后部署 `dist` 目录

---

## 七、快速链接

| 文档 | 用途 | 适合人群 |
|------|------|----------|
| [README.md](../../README.md) | 项目总览 | 所有人 |
| [Project_Structure.md](./Project_Structure.md) | 开发指南 | 开发者 |
| [CardScanner_Analysis.md](../CardScanner/CardScanner_Analysis.md) | 技术深度 | 学习者 |
| [ParticleCanvas_Analysis.md](../ParticleCanvas/ParticleCanvas_Analysis.md) | 技术深度 | 学习者 |
| [Quick_Reference.md](./Quick_Reference.md) | 快速查找 | 所有人 |

---

**提示**: 所有文档都使用 Markdown 格式，可以在 GitHub 或任何 Markdown 阅读器中查看。
