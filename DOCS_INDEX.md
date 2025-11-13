# 文档索引

## 文档结构总览

```
ovvo/
├── README.md                              # 项目主文档
├── DOCS_INDEX.md                          # 本文件 - 文档索引
│
└── docs/                                  # 文档中心
    ├── README.md                          # 文档中心首页
    │
    ├── General/                           # 通用文档
    │   ├── Project_Structure.md           # 项目结构说明
    │   └── Quick_Reference.md             # 快速参考指南
    │
    ├── CardScanner/                       # Card Scanner 文档
    │   ├── CardScanner_Analysis.md        # 深度技术解析
    │   └── CardScanner_SharingGuide.md    # 技术分享指南
    │
    └── ParticleCanvas/                    # Particle Canvas 文档
        └── ParticleCanvas_Analysis.md     # 深度技术解析
```

---

## 一、文档分类

### 通用文档 (General/)
- **Project_Structure.md** - 项目结构、开发规范、添加新项目指南
- **Quick_Reference.md** - 快速查找技术点、常见问题

### 项目文档

#### Card Scanner (CardScanner/)
- **CardScanner_Analysis.md** - 完整技术解析（660行）
  - 卡片流系统
  - ASCII 代码生成
  - Three.js 粒子系统
  - 扫描器粒子系统
  - 性能优化
  
- **CardScanner_SharingGuide.md** - 技术分享指南
  - 快速概览
  - 核心亮点
  - 演示要点

#### Particle Canvas (ParticleCanvas/)
- **ParticleCanvas_Analysis.md** - 完整技术解析（731行）
  - 粒子系统
  - 物理引擎
  - 交互系统
  - 爆炸效果
  - 性能优化

---

## 二、快速访问

### 我想...

- **了解项目结构** → [General/Project_Structure.md](./docs/General/Project_Structure.md)
- **学习 Card Scanner** → [CardScanner/CardScanner_Analysis.md](./docs/CardScanner/CardScanner_Analysis.md)
- **学习 Particle Canvas** → [ParticleCanvas/ParticleCanvas_Analysis.md](./docs/ParticleCanvas/ParticleCanvas_Analysis.md)
- **快速查找技术点** → [General/Quick_Reference.md](./docs/General/Quick_Reference.md)
- **做技术分享** → [CardScanner/CardScanner_SharingGuide.md](./docs/CardScanner/CardScanner_SharingGuide.md)
- **添加新项目** → [General/Project_Structure.md](./docs/General/Project_Structure.md)

---

## 三、文档规范

### 命名规范

```
docs/
└── ProjectName/                      # 项目文件夹（PascalCase）
    ├── ProjectName_Analysis.md       # 技术解析
    ├── ProjectName_SharingGuide.md   # 分享指南（可选）
    └── ProjectName_API.md            # API 文档（可选）
```

### 章节编号

使用中文数字编号：
- 一、二、三、四...
- 不使用表情符号

### 代码示例

- 使用代码块
- 添加注释
- 保持简洁

---

## 四、添加新项目文档

### 步骤

1. **创建项目文档文件夹**
   ```bash
   mkdir docs/YourProject
   ```

2. **创建技术解析文档**
   ```bash
   touch docs/YourProject/YourProject_Analysis.md
   ```

3. **更新文档索引**
   - 更新 `docs/README.md`
   - 更新 `DOCS_INDEX.md`

4. **编写文档内容**
   - 参考现有文档结构
   - 保持格式统一

---

## 五、文档维护

### 更新频率
- 新项目添加时立即更新
- 功能变更时同步更新
- 定期检查和优化

### 检查清单
- [ ] 文档结构完整
- [ ] 代码示例可运行
- [ ] 链接正确有效
- [ ] 格式统一规范
- [ ] 无表情符号

---

**提示**: 所有文档使用 Markdown 格式，建议使用支持 Markdown 的编辑器查看。
