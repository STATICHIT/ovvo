# OVVO - 创意交互体验集合

> 一个展示各种创意交互效果的 Web 项目集合

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r128-000000?logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-646cff?logo=vite)](https://vitejs.dev/)

---

## 一、项目展示

### 1. Card Scanner - 信用卡扫描动画
交互式信用卡扫描动画效果，展示卡片经过扫描器时从正常视图转换为 ASCII 代码视图的视觉效果。

**技术栈**: React + Three.js + Canvas 2D  
**核心技术**: CSS clip-path + WebGL 粒子系统 + 物理模拟  
**灵感来源**: [Evervault.com](https://evervault.com/)

**特性**:
- Three.js WebGL 背景粒子
- Canvas 2D 扫描器粒子效果
- CSS clip-path 实时裁剪
- 拖拽、滚轮、触摸交互
- 响应式设计

### 2. Particle Canvas - 交互式粒子画布
交互式粒子画布，鼠标移动产生粒子反应，点击产生爆炸效果。

**技术栈**: React + Canvas 2D + Physics  
**核心技术**: 粒子系统 + 物理引擎 + 实时交互

**特性**:
- 智能粒子连线系统
- 鼠标排斥和吸引效果
- 点击爆炸效果
- 实时参数调节
- 性能监控（FPS）

---

## 二、快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5174

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

---

## 三、项目结构

```
ovvo/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── Home/          # 主页
│   │   ├── CardScanner/   # 卡片扫描页面
│   │   └── ParticleCanvas/ # 粒子画布页面
│   ├── components/         # 可复用组件
│   │   └── Navbar/        # 导航栏
│   ├── hooks/             # 自定义 Hooks（按功能分类）
│   │   ├── cardScanner/   # 卡片扫描相关
│   │   ├── particles/     # 粒子系统相关
│   │   └── particleCanvas/ # 粒子画布相关
│   ├── utils/             # 工具函数（按功能分类）
│   │   └── cardScanner/   # 卡片扫描工具
│   └── assets/            # 静态资源
├── docs/                  # 技术文档
│   ├── README.md          # 文档中心
│   ├── Project_Structure.md
│   ├── CardScanner_Analysis.md
│   ├── CardScanner_SharingGuide.md
│   └── ParticleCanvas_Analysis.md
└── public/                # 公共资源
```

---

## 四、技术文档

详细的技术文档请查看 [docs 目录](./docs/README.md)：

- **[项目结构说明](./docs/Project_Structure.md)** - 目录结构和开发规范
- **[Card Scanner 技术解析](./docs/CardScanner_Analysis.md)** - 深度技术分析
- **[Particle Canvas 技术解析](./docs/ParticleCanvas_Analysis.md)** - 实现原理详解

---

## 五、技术栈

### 核心框架
- **React 19.1.1** - UI 框架
- **React Router DOM** - 路由管理
- **Vite 6.0.5** - 构建工具

### 图形渲染
- **Three.js** - WebGL 3D 渲染
- **Canvas 2D API** - 2D 图形和粒子系统

### 开发工具
- **ESLint** - 代码检查
- **Vite Plugin React** - React 快速刷新

---

## 六、核心技术点

### 1. CSS clip-path 裁剪
实现扫描效果的核心技术，通过动态调整 clip-path 实现视图切换。

### 2. Three.js Shader 材质
自定义顶点和片段着色器，实现高性能粒子渲染。

### 3. Canvas 2D 粒子系统
使用 Canvas 2D API 实现粒子生成、更新和渲染。

### 4. 物理模拟
实现速度、摩擦力、碰撞检测等物理效果。

### 5. requestAnimationFrame 优化
使用浏览器原生动画 API 实现 60fps 流畅动画。

---

## 七、学习资源

### 推荐阅读
- [Canvas API 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- [Three.js 官方文档](https://threejs.org/docs/)
- [React Hooks 指南](https://react.dev/reference/react)

### 相关项目
- [Evervault](https://evervault.com/) - Card Scanner 灵感来源

---

## 八、开发规范

### 命名规范
- **页面目录**: PascalCase (如 `CardScanner`)
- **组件文件**: PascalCase.jsx (如 `CardScanner.jsx`)
- **Hooks**: camelCase.js (如 `useCardStream.js`)
- **工具函数**: camelCase.js (如 `cardUtils.js`)

### 代码风格
- 使用 ESLint 检查
- 遵循 React 最佳实践
- 注释关键逻辑
- 保持代码简洁

---

## 九、添加新项目

### 步骤

1. **创建页面目录**
   ```bash
   src/pages/YourProject/
   ├── YourProject.jsx
   └── YourProject.css
   ```

2. **创建相关 Hooks**
   ```bash
   src/hooks/yourProject/
   └── useYourHook.js
   ```

3. **添加路由**
   在 `src/App.jsx` 中添加路由配置

4. **更新主页**
   在 `src/pages/Home/Home.jsx` 的 `projects` 数组中添加项目信息

5. **编写文档**
   在 `docs/` 目录创建技术文档

详细说明请参考 [Project_Structure.md](./docs/Project_Structure.md)

---

## 十、设计理念

### 视觉风格
- **配色**: 紫色渐变主题
- **效果**: 玻璃态、光晕、粒子
- **动画**: 平滑过渡、微交互

### 交互设计
- **直观**: 清晰的视觉反馈
- **流畅**: 60fps 动画
- **响应式**: 适配各种设备

---

## 十一、性能指标

### Card Scanner
- **粒子数量**: 400 (Three.js) + 800-2500 (Canvas)
- **帧率**: 60 FPS
- **内存**: ~50MB

### Particle Canvas
- **粒子数量**: 100-300（可调）
- **帧率**: 30-60 FPS（取决于粒子数）
- **内存**: ~30MB

---

## 十二、贡献

欢迎提交 Issue 和 Pull Request！

### 贡献类型
- Bug 修复
- 新功能
- 文档改进
- UI/UX 优化

---

## 十三、许可证

MIT License

---

## 十四、作者

**STATICHIT**

- GitHub: [@STATICHIT](https://github.com/STATICHIT/STATICHIT)
- 项目: [OVVO](https://github.com/STATICHIT/ovvo)

---

## 十五、致谢

- [Evervault](https://evervault.com/) - Card Scanner 设计灵感
- [Three.js](https://threejs.org/) - 3D 渲染库
- [React](https://react.dev/) - UI 框架

---

**探索更多创意交互体验**

