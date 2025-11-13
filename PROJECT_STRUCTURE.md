# 项目结构说明

## 📁 目录结构

```
ovvo/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── Home/          # 主页
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   └── CardScanner/   # 卡片扫描页面
│   │       ├── CardScanner.jsx
│   │       └── CardScanner.css
│   │
│   ├── components/         # 可复用组件（预留）
│   │
│   ├── hooks/             # 自定义 Hooks（按功能分类）
│   │   ├── cardScanner/   # 卡片扫描相关
│   │   │   └── useCardStream.js
│   │   └── particles/     # 粒子系统相关
│   │       ├── useParticleSystem.js
│   │       └── useParticleScanner.js
│   │
│   ├── utils/             # 工具函数（按功能分类）
│   │   └── cardScanner/   # 卡片扫描相关工具
│   │       └── cardUtils.js
│   │
│   ├── assets/            # 静态资源
│   │
│   ├── App.jsx            # 路由配置
│   ├── App.css            # 全局样式
│   ├── main.jsx           # 入口文件
│   └── index.css          # 基础样式
│
├── public/                # 公共资源
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 页面说明

### 主页 (Home)
- **路径**: `/`
- **文件**: `src/pages/Home/Home.jsx`
- **功能**: 展示所有创意项目的导航页面
- **特点**: 大气简洁的设计，卡片式布局

### 卡片扫描页面 (CardScanner)
- **路径**: `/card-scanner`
- **文件**: `src/pages/CardScanner/CardScanner.jsx`
- **功能**: 交互式信用卡扫描动画效果
- **特点**: Three.js 粒子系统 + Canvas 2D 扫描效果

## 🚀 添加新页面

### 步骤 1: 创建页面目录
```bash
src/pages/YourPage/
├── YourPage.jsx
└── YourPage.css
```

### 步骤 2: 创建页面组件
```jsx
// src/pages/YourPage/YourPage.jsx
import { Link } from 'react-router-dom';
import './YourPage.css';

function YourPage() {
  return (
    <div className="your-page">
      <Link to="/" className="back-home-btn">
        ← 返回主页
      </Link>
      {/* 你的页面内容 */}
    </div>
  );
}

export default YourPage;
```

### 步骤 3: 添加路由
在 `src/App.jsx` 中添加：
```jsx
import YourPage from './pages/YourPage/YourPage';

// 在 Routes 中添加
<Route path="/your-page" element={<YourPage />} />
```

### 步骤 4: 在主页添加导航
在 `src/pages/Home/Home.jsx` 的 `projects` 数组中添加：
```jsx
{
  id: 'your-page',
  title: 'Your Page',
  description: '页面描述',
  path: '/your-page',
  tags: ['React', '其他标签'],
  icon: '🎨',
}
```

## 📝 命名规范

- **页面目录**: PascalCase (如 `CardScanner`)
- **组件文件**: PascalCase.jsx (如 `CardScanner.jsx`)
- **样式文件**: PascalCase.css (如 `CardScanner.css`)
- **Hooks**: camelCase.js (如 `useCardStream.js`)
- **工具函数**: camelCase.js (如 `cardUtils.js`)

## 🎨 样式规范

- 每个页面有独立的 CSS 文件
- 全局样式放在 `App.css` 和 `index.css`
- 使用 CSS 变量保持一致性
- 响应式设计优先

## 🔧 开发建议

1. **保持组件独立**: 每个页面应该是独立的，不依赖其他页面
2. **复用 Hooks**: 将可复用的逻辑提取到 `hooks/` 目录，并按功能分类
3. **工具函数**: 通用工具函数放在 `utils/` 目录，并按功能分类
4. **组件提取**: 如果组件在多个页面使用，放在 `components/` 目录

## 📂 Hooks 和 Utils 分类说明

### Hooks 分类
- **按功能分类**: 每个功能模块有自己的目录
  - `hooks/cardScanner/` - 卡片扫描相关的 hooks
  - `hooks/particles/` - 粒子系统相关的 hooks
  - 后续可以添加 `hooks/otherFeature/` 等

### Utils 分类
- **按功能分类**: 每个功能模块有自己的目录
  - `utils/cardScanner/` - 卡片扫描相关的工具函数
  - 后续可以添加 `utils/common/` 等通用工具

### 添加新的 Hook 或 Utils
1. 确定功能模块（如 `newFeature`）
2. 在对应的目录下创建文件：
   - `hooks/newFeature/useNewHook.js`
   - `utils/newFeature/newUtils.js`
3. 在页面中导入：
   ```jsx
   import { useNewHook } from '../../hooks/newFeature/useNewHook';
   import { newUtils } from '../../utils/newFeature/newUtils';
   ```

## 📦 依赖管理

- **路由**: react-router-dom
- **3D 图形**: three.js
- **构建工具**: Vite
- **框架**: React 19

