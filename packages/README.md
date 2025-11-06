# React Spreadsheet Packages

这个目录包含了 React Spreadsheet 项目的两个核心包：

## 📦 目录结构

```
packages/
├── cli/                    # CLI 工具（发布到 npm）
│   ├── src/
│   │   ├── commands/
│   │   │   ├── init.ts    # 初始化配置命令
│   │   │   └── add.ts     # 添加组件命令
│   │   ├── utils/
│   │   │   ├── registry.ts         # 组件注册表读取
│   │   │   └── package-manager.ts  # 包管理器检测和安装
│   │   └── index.ts       # CLI 入口
│   ├── package.json
│   └── README.md
│
└── components/             # 组件模板（不发布，CLI从这里复制）
    ├── spreadsheet/        # 基础表格组件（27个文件）
    ├── pivot-table/        # 透视表组件（23个文件）
    ├── formula-engine/     # 公式引擎（6个文件）
    ├── registry.json       # 组件注册表
    └── README.md
```

## 🎯 工作原理

### 传统方式 vs CLI 方式

| 传统 npm 方式 | CLI 方式（shadcn/ui 风格） |
|-------------|------------------------|
| `npm install react-spreadsheet` | `npx @goodhawk/react-spreadsheet-cli add spreadsheet` |
| 代码在 node_modules/ | 代码在你的 src/components/ |
| 无法修改（会被覆盖） | 完全可以修改 |
| 升级用 npm update | 再次运行 CLI 命令 |
| 黑盒 | 白盒 |

## 🚀 快速开始

### 对于用户（使用组件）

#### 1. 初始化

```bash
npx @goodhawk/react-spreadsheet-cli init
```

这会创建 `react-spreadsheet.json` 配置文件。

#### 2. 添加组件

```bash
# 添加基础表格
npx @goodhawk/react-spreadsheet-cli add spreadsheet

# 添加透视表
npx @goodhawk/react-spreadsheet-cli add pivot-table

# 添加公式引擎
npx @goodhawk/react-spreadsheet-cli add formula-engine
```

#### 3. 使用组件

```tsx
import { Spreadsheet } from '@/components/ui/spreadsheet';

function App() {
  const [data, setData] = useState([
    [{ value: 'Hello' }, { value: 'World' }],
  ]);

  return <Spreadsheet data={data} onChange={setData} />;
}
```

### 对于开发者（维护组件）

#### 1. 开发组件

在 `src/` 目录开发：

```bash
# 启动 Storybook
pnpm dev

# 编辑组件
vim src/Spreadsheet.tsx

# 运行测试
pnpm test
```

#### 2. 同步到 packages/components/

开发完成后，运行同步脚本：

```bash
npm run sync-templates
```

这会：
- 清空 `packages/components/`
- 从 `src/` 复制所有组件文件
- 生成 `registry.json`
- 生成 `README.md`

#### 3. 发布 CLI 工具

```bash
cd packages/cli

# 构建 CLI
npm run build

# 发布到 npm
npm version patch
npm publish --access public
```

#### 4. 提交更改

```bash
git add packages/
git commit -m "chore: sync component templates"
git push
```

## 📊 组件统计

根据最新的同步结果：

| 组件 | 文件数 | 依赖 |
|-----|-------|------|
| **spreadsheet** | 27 | classnames, fast-formula-parser, use-context-selector, react-dnd, react-dnd-html5-backend |
| **pivot-table** | 23 | @tanstack/react-query, classnames, jspdf, xlsx, file-saver |
| **formula-engine** | 6 | fast-formula-parser |
| **总计** | **56** | - |

## 🔄 开发工作流

```
┌─────────────────────────────────────────────────┐
│  1. 在 src/ 开发组件                             │
│     ├─ 使用 Storybook 预览                      │
│     ├─ 运行测试                                  │
│     └─ 提交到 git                                │
├─────────────────────────────────────────────────┤
│  2. 同步到 packages/components/                 │
│     └─ npm run sync-templates                   │
├─────────────────────────────────────────────────┤
│  3. 构建和发布 CLI                               │
│     ├─ cd packages/cli                          │
│     ├─ npm run build                            │
│     └─ npm publish                              │
├─────────────────────────────────────────────────┤
│  4. 用户使用 CLI 添加组件                        │
│     └─ npx @goodhawk/react-spreadsheet-cli add ...      │
└─────────────────────────────────────────────────┘
```

## 📝 注意事项

### ⚠️ 不要直接修改 packages/components/

`packages/components/` 目录的内容是自动生成的。**任何手动修改都会在下次运行 `sync-templates` 时被覆盖。**

✅ **正确做法：**
```bash
vim src/Spreadsheet.tsx        # 修改源文件
npm run sync-templates         # 同步
```

❌ **错误做法：**
```bash
vim packages/components/spreadsheet/Spreadsheet.tsx  # 会被覆盖！
```

### 🔄 更新 registry.json

如果要添加新组件或修改组件配置，编辑 `scripts/sync-templates.js` 中的 `COMPONENTS` 对象：

```javascript
const COMPONENTS = {
  'my-new-component': {
    name: 'my-new-component',
    description: '新组件的描述',
    files: [
      'MyComponent.tsx',
      'MyComponent.css',
      'types.ts',
    ],
    dependencies: [
      'some-package',
    ],
  },
};
```

然后运行 `npm run sync-templates`。

## 🎨 CLI 工具功能

### init 命令

创建 `react-spreadsheet.json` 配置文件。

```bash
npx @goodhawk/react-spreadsheet-cli init [options]

选项：
  -y, --yes          跳过提示，使用默认配置
  -c, --cwd <path>   指定工作目录
```

### add 命令

添加组件到项目。

```bash
npx @goodhawk/react-spreadsheet-cli add [components...] [options]

选项：
  -o, --overwrite    覆盖已存在的文件
  -c, --cwd <path>   指定工作目录
  -p, --path <path>  自定义安装路径
```

**示例：**

```bash
# 查看可用组件
npx @goodhawk/react-spreadsheet-cli add

# 添加单个组件
npx @goodhawk/react-spreadsheet-cli add spreadsheet
npx @goodhawk/react-spreadsheet-cli add dty-lucky-sheet


# 添加多个组件
npx @goodhawk/react-spreadsheet-cli add spreadsheet pivot-table

# 覆盖已存在的文件
npx @goodhawk/react-spreadsheet-cli add spreadsheet --overwrite

# 自定义安装路径
npx @goodhawk/react-spreadsheet-cli add spreadsheet --path src/lib/ui
```

## 📚 相关文档

- [CLI 工具文档](./cli/README.md)
- [组件模板文档](./components/README.md)
- [开发工作流程](../DEVELOPMENT_WORKFLOW.md)
- [主项目 README](../readme.md)

## 🤝 贡献

如果你想贡献代码：

1. Fork 项目
2. 在 `src/` 创建功能分支
3. 开发和测试
4. 运行 `npm run sync-templates`
5. 提交 PR

## 📄 许可证

MIT License

---

**提示：** 如果你是第一次接触这种组件分发方式，建议阅读 [DEVELOPMENT_WORKFLOW.md](../DEVELOPMENT_WORKFLOW.md) 了解完整的开发流程。

