# CourseFlow 组件 - 完整使用指南

> 基于 React Flow 实现的课程开发流程可视化组件

---

## 🎯 组件介绍

**CourseFlow** 是一个专业的课程开发流程管理工具，通过可视化的方式展示课程开发的各个阶段和任务，帮助教师和课程开发者更好地规划和追踪课程开发进度。

### 核心特性

- ✅ **可视化流程** - 直观展示 4 个主要开发阶段
- ✅ **状态追踪** - 实时显示每个任务的完成状态
- ✅ **交互编辑** - 支持拖拽节点和创建连接
- ✅ **灵活定制** - 自定义节点数据和样式
- ✅ **响应式设计** - 适配不同屏幕尺寸
- ✅ **控制面板** - 缩放、适应视图等功能
- ✅ **小地图导航** - 快速定位和浏览

---

## 📦 安装依赖

使用 CourseFlow 组件前，需要先安装 React Flow：

```bash
npm install @xyflow/react
```

或使用 yarn：

```bash
yarn add @xyflow/react
```

**注意**：React Flow v12+ 使用新的包名 `@xyflow/react`（旧版本是 `reactflow`）

---

## 🚀 快速开始

### 1. 基础使用

```tsx
import { CourseFlow } from '@/subject-development';

function MyPage() {
  return (
    <CourseFlow height={1200} />
  );
}
```

这将渲染一个包含默认课程开发流程的流程图。

### 2. 添加交互

```tsx
<CourseFlow
  height={1200}
  onNodeClick={(node) => {
    console.log('点击节点:', node.data.label);
  }}
  onNodeDoubleClick={(node) => {
    // 打开编辑对话框
    openEditDialog(node);
  }}
/>
```

### 3. 可编辑模式

```tsx
<CourseFlow
  editable
  height={1200}
  onNodesChange={(nodes) => {
    console.log('节点变化:', nodes);
    // 保存到后端
    saveFlowData(nodes);
  }}
/>
```

---

## 📋 默认流程结构

CourseFlow 内置了标准的课程开发流程：

### 第一阶段：学习目标设定

```
学习目标设定（主节点）
├── 目标群体分析
├── 学习成果设定
└── 评估标准定义
```

### 第二阶段：课程内容规划

```
课程内容规划（主节点）
├── 课程模块设计
├── 教学方法选择
└── 教学时间安排
```

### 第三阶段：课程教学设计

```
课程教学设计（主节点）
├── 教学策略设计
├── 学习活动设计
└── 教学评价方案设计
```

### 第四阶段：课程资料制作

```
课程资料制作（主节点）
├── 教学PPT制作
├── 习题与案例设计
└── 课件录制与编辑
```

---

## 🎨 节点状态说明

### 状态类型

| 状态 | 英文 | 颜色 | 说明 |
|------|------|------|------|
| 待处理 | `pending` | 灰色 | 尚未开始的任务 |
| 进行中 | `in-progress` | 蓝色 | 正在进行的任务 |
| 已完成 | `completed` | 绿色 | 已完成的任务 |
| 被阻塞 | `blocked` | 红色 | 被阻塞的任务 |

### 状态示例

```tsx
<CourseFlow
  initialNodes={[
    {
      id: '1',
      type: 'mainNode',
      data: {
        label: '学习目标设定',
        type: 'main',
        status: 'completed', // ← 设置为已完成
        description: '课程设计的起点',
      },
      position: { x: 400, y: 50 },
    },
    // ... 更多节点
  ]}
/>
```

---

## 🔧 自定义流程

### 创建自定义节点

```tsx
import type { FlowNodeData } from '@/subject-development';

const customNodes = [
  {
    id: 'custom-1',
    type: 'mainNode',
    data: {
      label: '自定义阶段',
      type: 'main',
      status: 'pending',
      description: '这是自定义的流程阶段',
      metadata: {
        owner: '张三',
        deadline: '2024-12-31',
      },
    } as FlowNodeData,
    position: { x: 250, y: 100 },
  },
  {
    id: 'custom-2',
    type: 'subNode',
    data: {
      label: '自定义子任务',
      type: 'sub',
      status: 'in-progress',
    } as FlowNodeData,
    position: { x: 250, y: 230 },
  },
];

const customEdges = [
  {
    id: 'e-custom-1-2',
    source: 'custom-1',
    target: 'custom-2',
    animated: true,
  },
];

<CourseFlow
  initialNodes={customNodes}
  initialEdges={customEdges}
  height={600}
/>
```

---

## 💡 实战案例

### 案例 1：课程开发进度追踪

```tsx
import { useState } from 'react';
import { CourseFlow } from '@/subject-development';

function CourseProgressTracker() {
  const [flowData, setFlowData] = useState({
    nodes: defaultNodes,
    edges: defaultEdges,
  });

  const handleNodeClick = (node: any) => {
    // 弹出对话框，显示任务详情
    showTaskDetails({
      title: node.data.label,
      status: node.data.status,
      description: node.data.description,
    });
  };

  const handleNodeDoubleClick = (node: any) => {
    // 双击切换任务状态
    const newStatus = getNextStatus(node.data.status);
    updateNodeStatus(node.id, newStatus);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 bg-white border-b">
        <h1 className="text-2xl font-bold">课程开发进度</h1>
        <p className="text-gray-600">双击节点可以更新状态</p>
      </header>
      
      <main className="flex-1">
        <CourseFlow
          initialNodes={flowData.nodes}
          initialEdges={flowData.edges}
          height="100%"
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          showControls
          showMinimap
        />
      </main>
    </div>
  );
}

function getNextStatus(current: string) {
  const statusCycle = ['pending', 'in-progress', 'completed', 'blocked'];
  const currentIndex = statusCycle.indexOf(current);
  return statusCycle[(currentIndex + 1) % statusCycle.length];
}
```

### 案例 2：团队协作流程

```tsx
function TeamCourseFlow() {
  const handleNodeClick = (node: any) => {
    // 查看任务负责人和详情
    const metadata = node.data.metadata;
    if (metadata) {
      showDialog({
        title: node.data.label,
        owner: metadata.owner,
        deadline: metadata.deadline,
        progress: metadata.progress,
      });
    }
  };

  const nodesWithTeamInfo = defaultNodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      metadata: {
        owner: assignOwner(node.id),
        deadline: calculateDeadline(node.id),
        progress: 0,
      },
    },
  }));

  return (
    <CourseFlow
      initialNodes={nodesWithTeamInfo}
      height={1200}
      onNodeClick={handleNodeClick}
    />
  );
}
```

### 案例 3：简化流程视图

```tsx
// 只显示主要阶段，隐藏子任务
const mainStagesOnly = [
  {
    id: '1',
    type: 'mainNode',
    data: { label: '学习目标设定', type: 'main', status: 'completed' },
    position: { x: 400, y: 50 },
  },
  {
    id: '2',
    type: 'mainNode',
    data: { label: '课程内容规划', type: 'main', status: 'in-progress' },
    position: { x: 400, y: 200 },
  },
  {
    id: '3',
    type: 'mainNode',
    data: { label: '课程教学设计', type: 'main', status: 'pending' },
    position: { x: 400, y: 350 },
  },
  {
    id: '4',
    type: 'mainNode',
    data: { label: '课程资料制作', type: 'main', status: 'pending' },
    position: { x: 400, y: 500 },
  },
];

<CourseFlow
  initialNodes={mainStagesOnly}
  initialEdges={[
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
  ]}
  height={700}
  showMinimap={false}
/>
```

---

## ⚙️ API 参考

### Props

| 属性 | 类型 | 默认值 | 必需 | 描述 |
|------|------|--------|------|------|
| `initialNodes` | `Node[]` | 默认流程 | ❌ | 初始节点数据 |
| `initialEdges` | `Edge[]` | 默认连接 | ❌ | 初始边数据 |
| `editable` | `boolean` | `false` | ❌ | 是否可编辑 |
| `onNodesChange` | `(nodes) => void` | - | ❌ | 节点变化回调 |
| `onEdgesChange` | `(edges) => void` | - | ❌ | 边变化回调 |
| `onNodeClick` | `(node) => void` | - | ❌ | 节点单击回调 |
| `onNodeDoubleClick` | `(node) => void` | - | ❌ | 节点双击回调 |
| `height` | `string \| number` | `600` | ❌ | 组件高度 |
| `showControls` | `boolean` | `true` | ❌ | 显示控制按钮 |
| `showMinimap` | `boolean` | `true` | ❌ | 显示小地图 |
| `debug` | `boolean` | `false` | ❌ | 调试模式 |

### 类型定义

```typescript
// 节点数据
interface FlowNodeData {
  label: string;
  type: 'main' | 'sub';
  status?: 'pending' | 'in-progress' | 'completed' | 'blocked';
  description?: string;
  editable?: boolean;
  metadata?: Record<string, any>;
}
```

---

## 🎨 样式定制

### 自定义节点颜色

虽然组件使用了预设的颜色方案，但您可以通过自定义 className 来覆盖样式：

```tsx
<CourseFlow
  className="custom-flow"
  height={1200}
/>
```

然后在 CSS 中：

```css
.custom-flow .react-flow__node-mainNode {
  /* 自定义主节点样式 */
}

.custom-flow .react-flow__node-subNode {
  /* 自定义子节点样式 */
}
```

---

## 🐛 常见问题

### Q1: 为什么节点显示不正常？

**可能原因**：
- 未安装 reactflow 依赖
- Tailwind CSS 配置不正确

**解决方案**：
```bash
npm install reactflow
```

### Q2: 如何保存流程图数据？

**示例代码**：
```tsx
<CourseFlow
  onNodesChange={(nodes) => {
    // 保存到 localStorage
    localStorage.setItem('courseFlow', JSON.stringify(nodes));
  }}
/>
```

### Q3: 可以水平排列吗？

**可以**！调整节点的 `position` 即可：
```tsx
const horizontalNodes = [
  { id: '1', position: { x: 100, y: 250 }, ... },
  { id: '2', position: { x: 350, y: 250 }, ... },
  { id: '3', position: { x: 600, y: 250 }, ... },
];
```

---

## 📚 更多资源

- [React Flow 官方文档](https://reactflow.dev/)
- [Storybook 示例](./stories/CourseFlow.stories.tsx)
- [完整 API 文档](./README.md)

---

**更新时间**：2024-10-12  
**维护者**：Subject Development Team

