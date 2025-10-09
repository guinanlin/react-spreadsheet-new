# @goodhawk/react-spreadsheet-cli

CLI 工具，用于将 React Spreadsheet 组件添加到你的项目中。

## 📦 安装

不需要安装！直接使用 `npx` 运行：

```bash
npx @goodhawk/react-spreadsheet-cli init
```

## 🚀 使用

### 初始化配置

在你的项目中创建 `react-spreadsheet.json` 配置文件：

```bash
npx @goodhawk/react-spreadsheet-cli init
```

这会询问你：
- 组件安装路径（默认：`src/components/ui`）
- 导入别名（默认：`@/components`）

### 添加组件

添加 Spreadsheet 组件到你的项目：

```bash
npx @goodhawk/react-spreadsheet-cli add spreadsheet
```

添加 Pivot Table 组件：

```bash
npx @goodhawk/react-spreadsheet-cli add pivot-table
```

一次添加多个组件：

```bash
npx @goodhawk/react-spreadsheet-cli add spreadsheet pivot-table
```

### 查看可用组件

运行不带参数的 `add` 命令查看所有可用组件：

```bash
npx @goodhawk/react-spreadsheet-cli add
```

## 📖 命令

### `init`

初始化配置文件。

```bash
npx @goodhawk/react-spreadsheet-cli init [options]
```

**选项：**
- `-y, --yes` - 跳过提示，使用默认配置
- `-c, --cwd <path>` - 指定工作目录

### `add`

添加组件到项目。

```bash
npx @goodhawk/react-spreadsheet-cli add [components...] [options]
```

**选项：**
- `-o, --overwrite` - 覆盖已存在的文件
- `-c, --cwd <path>` - 指定工作目录
- `-p, --path <path>` - 自定义安装路径

## 📁 生成的文件结构

运行 `add spreadsheet` 后，会在你的项目中创建：

```
your-project/
└── src/
    └── components/
        └── ui/
            └── spreadsheet/
                ├── Spreadsheet.tsx
                ├── Spreadsheet.css
                ├── Cell.tsx
                ├── Table.tsx
                └── ... (其他相关文件)
```

## 💡 使用示例

安装组件后，在你的代码中使用：

```tsx
import { Spreadsheet } from '@/components/ui/spreadsheet';

function App() {
  const [data, setData] = useState([
    [{ value: 'Hello' }, { value: 'World' }],
  ]);

  return <Spreadsheet data={data} onChange={setData} />;
}
```

## 🔧 配置文件

`react-spreadsheet.json` 示例：

```json
{
  "$schema": "https://react-spreadsheet.dev/schema.json",
  "style": "default",
  "components": {
    "path": "src/components/ui"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## 🤔 常见问题

### 组件安装后如何更新？

再次运行 `add` 命令并使用 `--overwrite` 选项：

```bash
npx @goodhawk/react-spreadsheet-cli add spreadsheet --overwrite
```

### 可以修改组件代码吗？

可以！这就是这个 CLI 工具的核心理念。组件代码会直接复制到你的项目中，你拥有完全的控制权，可以随意修改。

### 为什么使用这种方式而不是 npm 包？

- ✅ 完全控制：你拥有组件代码，可以任意修改
- ✅ 无依赖包开销：不增加 node_modules 体积
- ✅ 类型安全：直接在你的项目中，TypeScript 类型完整
- ✅ 定制化：根据项目需求自由调整

### 支持哪些包管理器？

自动检测并支持：
- npm
- pnpm
- yarn

## 📝 许可证

MIT

## 🔗 相关资源

- [React Spreadsheet 文档](https://iddan.github.io/react-spreadsheet/docs)
- [GitHub 仓库](https://github.com/iddan/react-spreadsheet)
- [Storybook 示例](https://iddan.github.io/react-spreadsheet/storybook)

