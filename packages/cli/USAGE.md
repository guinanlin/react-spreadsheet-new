# @goodhawk/react-spreadsheet-cli 使用说明

## 在其他项目中使用

### 1. 初始化（首次使用）

```bash
npx @goodhawk/react-spreadsheet-cli init
```

会生成 `react-spreadsheet.json` 配置文件。

### 2. 添加组件

```bash
# 添加思维导图
npx @goodhawk/react-spreadsheet-cli add dty-mindmap

# 添加表格
npx @goodhawk/react-spreadsheet-cli add spreadsheet

# 一次添加多个
npx @goodhawk/react-spreadsheet-cli add dty-mindmap spreadsheet
```

组件源码会复制到你项目的 `src/components/ui/<组件名>/`（路径可在 init 时配置）。

### 3. 在代码里使用

```tsx
import { DtyMindMap } from "@/components/ui/dty-mindmap";

function App() {
  return <DtyMindMap height="80vh" />;
}
```

**依赖**：添加 dty-mindmap 后需安装 `lucide-react`、`rxjs`：

```bash
pnpm add lucide-react rxjs
# 或 npm install lucide-react rxjs
```

---

**可用组件**：`spreadsheet` | `pivot-table` | `formula-engine` | `dty-lucky-sheet` | `dty-mindmap`
