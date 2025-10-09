# 🏗️ 架构说明

## 📐 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Spreadsheet 项目                        │
│                                                                  │
│  ┌────────────────────┐          ┌─────────────────────────┐   │
│  │   src/             │          │   packages/             │   │
│  │   (开发目录)        │   同步    │   (发布目录)            │   │
│  │                    │  ────►   │                         │   │
│  │  ├── Spreadsheet   │          │  ├── cli/               │   │
│  │  ├── Cell          │          │  │   └── src/           │   │
│  │  ├── pivot/        │          │  │       ├── commands/  │   │
│  │  └── stories/      │          │  │       └── utils/     │   │
│  │                    │          │  │                       │   │
│  └────────────────────┘          │  └── components/        │   │
│           │                      │      ├── spreadsheet/   │   │
│           │                      │      ├── pivot-table/   │   │
│           ▼                      │      └── registry.json  │   │
│    ┌─────────────┐               │                         │   │
│    │  Storybook  │               └─────────────────────────┘   │
│    └─────────────┘                          │                  │
│                                             │ npm publish      │
└─────────────────────────────────────────────┼──────────────────┘
                                              ▼
                            ┌─────────────────────────────────┐
                            │         npm Registry            │
                            │  @react-spreadsheet/cli         │
                            └─────────────────────────────────┘
                                              │
                                              │ npx
                                              ▼
                            ┌─────────────────────────────────┐
                            │       用户的项目                 │
                            │                                 │
                            │  src/                           │
                            │  └── components/                │
                            │      └── ui/                    │
                            │          ├── spreadsheet/  ←── │
                            │          └── pivot-table/  ←── │
                            │                                 │
                            └─────────────────────────────────┘
```

## 🔄 数据流向

### 1️⃣ 开发流程

```
开发者 → src/ → Storybook → 测试 → sync-templates → packages/components/
```

**详细步骤：**
```
┌──────────────┐
│ 1. 编辑代码   │ vim src/Spreadsheet.tsx
├──────────────┤
│ 2. 实时预览   │ Storybook 自动刷新
├──────────────┤
│ 3. 运行测试   │ pnpm test
├──────────────┤
│ 4. 同步组件   │ npm run sync-templates
├──────────────┤
│ 5. 提交代码   │ git commit & push
└──────────────┘
```

### 2️⃣ 发布流程

```
packages/cli/ → 构建 → npm 发布 → 用户安装
```

**详细步骤：**
```
┌──────────────────┐
│ 1. 构建 CLI       │ cd packages/cli && npm run build
├──────────────────┤
│ 2. 测试 CLI       │ npm link (本地测试)
├──────────────────┤
│ 3. 发布到 npm     │ npm publish --access public
├──────────────────┤
│ 4. 用户使用       │ npx @react-spreadsheet/cli add ...
└──────────────────┘
```

### 3️⃣ 用户使用流程

```
用户项目 → CLI init → CLI add → 复制组件 → 使用和修改
```

**详细步骤：**
```
┌──────────────────────────────────────┐
│ 1. 初始化                             │
│    npx @react-spreadsheet/cli init   │
│    └─► 创建 react-spreadsheet.json   │
├──────────────────────────────────────┤
│ 2. 添加组件                           │
│    npx @react-spreadsheet/cli add    │
│         spreadsheet                  │
│    └─► 从 GitHub 下载组件            │
│    └─► 复制到 src/components/ui/     │
│    └─► 安装依赖                       │
├──────────────────────────────────────┤
│ 3. 使用组件                           │
│    import { Spreadsheet }            │
│      from '@/components/ui/...'      │
├──────────────────────────────────────┤
│ 4. 自由修改                           │
│    vim src/components/ui/            │
│        spreadsheet/Spreadsheet.tsx   │
└──────────────────────────────────────┘
```

## 🎯 关键组件

### 1. 同步脚本 (scripts/sync-templates.js)

**职责：**
- 从 `src/` 读取源文件
- 复制到 `packages/components/`
- 生成 `registry.json`

**核心逻辑：**
```javascript
for each component in COMPONENTS:
  1. 创建组件目录
  2. 复制所有文件
  3. 收集文件列表
  4. 添加到 registry

生成 registry.json
生成 README.md
```

### 2. CLI 工具 (packages/cli/)

**核心模块：**

#### commands/init.ts
```typescript
功能：创建配置文件
流程：
  1. 检查是否已存在
  2. 询问用户配置
  3. 写入 react-spreadsheet.json
  4. 创建组件目录
```

#### commands/add.ts
```typescript
功能：添加组件到项目
流程：
  1. 读取配置文件
  2. 获取组件注册表
  3. 验证组件存在
  4. 下载组件文件
  5. 复制到目标目录
  6. 安装依赖
```

#### utils/registry.ts
```typescript
功能：管理组件注册表
流程：
  1. 优先从本地读取（开发模式）
  2. 否则从 GitHub 下载
  3. 解析 registry.json
  4. 提供组件信息
```

#### utils/package-manager.ts
```typescript
功能：包管理器检测和安装
流程：
  1. 检测 lock 文件
  2. 确定使用 npm/pnpm/yarn
  3. 执行安装命令
```

### 3. 组件注册表 (packages/components/registry.json)

**结构：**
```json
{
  "components": {
    "spreadsheet": {
      "name": "spreadsheet",
      "description": "...",
      "files": ["Spreadsheet.tsx", "Cell.tsx", ...],
      "dependencies": ["classnames", ...]
    }
  }
}
```

**用途：**
- CLI 读取可用组件
- 确定要复制哪些文件
- 自动安装依赖

## 🔐 安全性考虑

### 1. 文件覆盖保护

```typescript
if (文件已存在 && !options.overwrite) {
  询问用户是否覆盖
}
```

### 2. 依赖安装

```typescript
// 只安装声明的依赖
dependencies.forEach(dep => {
  if (在 registry 中) {
    安装该依赖
  }
})
```

### 3. 路径验证

```typescript
// 确保不会写到项目外
const targetPath = path.resolve(cwd, config.path);
if (!targetPath.startsWith(cwd)) {
  throw Error('Invalid path');
}
```

## 📦 模块依赖关系

```
CLI 工具依赖：
├── commander          # 命令行解析
├── chalk             # 终端颜色
├── ora               # Loading 动画
├── prompts           # 交互式提示
├── fs-extra          # 文件操作
├── node-fetch        # HTTP 请求
└── execa             # 执行命令

同步脚本依赖：
└── Node.js 内置模块   # 无额外依赖！
```

## 🎨 设计决策

### 为什么使用两个目录？

```
src/                    # 开发目录
├─ 优点：现有工作流不变
├─ 用途：Storybook、测试、开发
└─ 工具：熟悉的开发工具

packages/components/    # 模板目录
├─ 优点：专门为分发优化
├─ 用途：CLI 复制源
└─ 特点：自动生成，结构清晰
```

### 为什么使用同步脚本？

```
自动同步的好处：
✓ 单一数据源（src/ 是唯一真实来源）
✓ 避免手动维护两份代码
✓ 确保一致性
✓ 减少人为错误
```

### 为什么支持本地和远程模式？

```typescript
// 开发模式（本地）
if (packages/components/ 存在) {
  从本地读取
}

// 生产模式（远程）
else {
  从 GitHub 下载
}
```

**优势：**
- 开发时即时测试
- 用户从 GitHub 获取最新版本
- 不需要发布就能测试

## 🚀 性能优化

### 1. 并行下载

```typescript
await Promise.all(
  files.map(file => downloadFile(file))
);
```

### 2. 缓存机制（未来可添加）

```
~/.react-spreadsheet/cache/
├── registry.json
└── components/
    └── spreadsheet/
```

### 3. 增量更新（未来可添加）

```
只复制已更改的文件
```

## 📊 对比传统方式

| 方面 | 传统 npm 包 | 新的 CLI 方式 |
|------|-----------|-------------|
| **代码位置** | node_modules/ | src/components/ |
| **可见性** | 黑盒 | 白盒 |
| **可修改性** | ❌ | ✅ |
| **升级方式** | npm update | 手动运行 CLI |
| **类型支持** | .d.ts | 源码 |
| **调试** | 困难 | 容易 |
| **定制化** | 有限 | 完全自由 |
| **学习曲线** | 低 | 中等 |
| **适用场景** | 快速使用 | 深度定制 |

## 🎯 未来扩展

### 可能的改进：

1. **组件市场**
   - 社区贡献组件
   - 组件评分和评论

2. **版本管理**
   - 支持安装特定版本
   - 组件版本历史

3. **自动更新检测**
   - 检测组件是否有更新
   - 提示用户升级

4. **配置预设**
   - Tailwind CSS 预设
   - Material UI 预设
   - Ant Design 预设

5. **可视化工具**
   - Web UI 管理组件
   - 预览组件效果

## 📚 参考资源

- [shadcn/ui](https://ui.shadcn.com/) - 设计灵感
- [Commander.js](https://github.com/tj/commander.js) - CLI 框架
- [tsup](https://tsup.egoist.dev/) - TypeScript 构建工具

---

**理解架构是使用和贡献的第一步！** 🎓

