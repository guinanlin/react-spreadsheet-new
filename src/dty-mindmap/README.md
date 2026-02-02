# DtyMindMap 思维导图组件

基于参考项目 `dty-gitary` 中 mind-map 实现的思维导图组件，封装为独立可复用的 DTY Mind Map 组件。

## 功能

- 节点增删改、折叠/展开
- 拖拽节点调整位置
- 画布平移与缩放
- 撤销/重做
- 键盘快捷键（Tab 添加子节点、Enter 添加兄弟、Delete 删除、方向键导航等）
- 主题：light / dark / midnight

## 使用

```tsx
import { DtyMindMap } from "@/dty-mindmap";

// 默认使用
<DtyMindMap height={480} width={720} />

// 自定义初始数据与回调
<DtyMindMap
  initialData={myMindMapData}
  theme="dark"
  onDataChange={(data) => saveToServer(data)}
  showToolbar
  showInstructions
  showCanvasControls
  height="500px"
  width="100%"
/>
```

## 数据结构

```ts
interface MindMapData {
  rootId: string;
  nodes: Record<string, MindMapNode>;
}

interface MindMapNode {
  id: string;
  text: string;
  parentId: string | null;
  children: string[];
  isExpanded: boolean;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  manualX?: number;
  manualY?: number;
}
```

## 依赖

- `react` / `react-dom`
- `rxjs`
- `lucide-react`
- 项目内 `@/lib/utils` 未使用，组件为自包含样式（Tailwind）

## Storybook

运行 `pnpm storybook` 后访问 **dty-mindmap/DtyMindMap** 查看示例与交互。
