# ERP Agent 销售智能体组件库

基于 ReactFlow 的服装销售工作流可视化组件，专为服装行业设计，支持样衣销售和大货销售两个业务板块的流程管理。

## 🎯 功能特性

- **工作流可视化**: 基于 ReactFlow 实现直观的销售流程展示
- **双业务板块**: 支持样衣销售和大货销售两种业务类型
- **节点状态管理**: 支持待处理、进行中、已完成、被阻塞四种状态
- **交互式操作**: 支持节点点击、拖拽、连接等交互功能
- **详情展示**: 提供节点详情弹窗，显示完整信息
- **响应式设计**: 适配不同屏幕尺寸
- **TypeScript 支持**: 完整的类型定义和类型安全

## 📦 安装

```bash
# 确保已安装 ReactFlow
npm install @xyflow/react
```

## 🚀 快速开始

### 基本用法

```tsx
import { SalesFlow } from '@/erp-agent';

function MyComponent() {
  return (
    <SalesFlow 
      height={800}
      showControls={true}
      showMinimap={true}
      onNodeClick={(node) => console.log('点击节点:', node)}
    />
  );
}
```

### 带交互的完整示例

```tsx
import { SalesFlow, SalesNodeDetail, useSalesWorkflow } from '@/erp-agent';
import { useState } from 'react';

function SalesWorkflowDemo() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  
  const workflow = useSalesWorkflow();

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setShowDetail(true);
  };

  return (
    <div>
      <SalesFlow
        initialNodes={workflow.nodes}
        initialEdges={workflow.edges}
        onNodeClick={handleNodeClick}
        editable={true}
        showControls={true}
        showMinimap={true}
      />
      
      {selectedNode && (
        <SalesNodeDetail
          data={workflow.getNodeDetail(selectedNode.id)}
          visible={showDetail}
          onClose={() => setShowDetail(false)}
          editable={true}
          onSave={(data) => {
            workflow.updateNodeData(selectedNode.id, data);
            setShowDetail(false);
          }}
        />
      )}
    </div>
  );
}
```

## 📋 组件 API

### SalesFlow

销售工作流主组件，基于 ReactFlow 实现。

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `initialNodes` | `Node<SalesNodeData>[]` | `defaultNodes` | 初始节点数据 |
| `initialEdges` | `Edge[]` | `defaultEdges` | 初始边数据 |
| `editable` | `boolean` | `false` | 是否可编辑（拖拽、连接） |
| `height` | `string \| number` | `800` | 组件高度 |
| `showControls` | `boolean` | `true` | 是否显示控制按钮 |
| `showMinimap` | `boolean` | `true` | 是否显示小地图 |
| `debug` | `boolean` | `false` | 调试模式 |
| `onNodeClick` | `(node: Node<SalesNodeData>) => void` | - | 节点点击回调 |
| `onNodeDoubleClick` | `(node: Node<SalesNodeData>) => void` | - | 节点双击回调 |
| `onNodesChange` | `(nodes: Node<SalesNodeData>[]) => void` | - | 节点变化回调 |
| `onEdgesChange` | `(edges: Edge[]) => void` | - | 边变化回调 |

### SalesNodeDetail

节点详情弹窗组件，显示节点的详细信息。

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `data` | `SalesDetailData` | - | 节点详情数据 |
| `visible` | `boolean` | `false` | 是否显示 |
| `editable` | `boolean` | `false` | 是否可编辑 |
| `onClose` | `() => void` | - | 关闭回调 |
| `onSave` | `(data: SalesDetailData) => void` | - | 保存回调 |

## 🔧 Hooks

### useSalesWorkflow

管理销售工作流状态的 Hook。

```tsx
const workflow = useSalesWorkflow(initialNodes, initialEdges);

// 可用方法
workflow.updateNodeStatus(nodeId, 'completed');
workflow.updateNodeData(nodeId, { description: '新描述' });
workflow.getNodeDetail(nodeId);
workflow.getStatistics();
workflow.resetWorkflow();
```

## 🎨 工作流节点说明

### 节点层级结构

```
销售（根节点）
├── 样衣销售（业务板块）
│   ├── 签订销售合同
│   ├── 安排生产
│   └── 跟踪进度
└── 大货销售（业务板块）
    ├── 签订销售合同
    ├── 安排生产
    └── 跟踪进度
```

### 节点类型

- **根节点（root）**: 销售流程的起始点，蓝色主题
- **业务板块（business）**: 样衣销售（紫色）/大货销售（橙色）
- **流程节点（process）**: 具体的业务流程步骤，灰色主题

### 节点状态

- **待处理（pending）**: 灰色，任务尚未开始
- **进行中（in-progress）**: 蓝色，任务正在执行
- **已完成（completed）**: 绿色，任务已完成
- **被阻塞（blocked）**: 红色，任务被阻塞

## 🎯 业务场景

### 样衣销售流程

1. **签订销售合同**: 与客户确认样衣款式、数量、价格
2. **安排生产**: 制定样衣生产计划，分配资源
3. **跟踪进度**: 监控样衣制作进度，确保按时交付

### 大货销售流程

1. **签订销售合同**: 与客户签订大批量订单合同
2. **安排生产**: 制定大货生产计划，协调供应链
3. **跟踪进度**: 监控大货生产进度，管理质量控制

## 🛠️ 工具函数

组件库提供了丰富的工具函数：

```tsx
import { 
  getStatusText, 
  getBusinessTypeText, 
  formatCurrency,
  calculateDaysBetween 
} from '@/erp-agent';

// 获取状态文本
getStatusText('in-progress'); // "进行中"

// 获取业务类型文本
getBusinessTypeText('sample'); // "样衣销售"

// 格式化货币
formatCurrency(50000); // "¥50,000.00"

// 计算天数差
calculateDaysBetween(new Date('2024-01-01'), new Date('2024-01-10')); // 9
```

## 📊 统计数据

组件支持获取销售统计数据：

```tsx
const workflow = useSalesWorkflow();
const stats = workflow.getStatistics();

console.log(stats);
// {
//   totalOrders: 10,
//   sampleOrders: 6,
//   bulkOrders: 4,
//   completedOrders: 3,
//   inProgressOrders: 5,
//   totalRevenue: 230000,
//   sampleRevenue: 30000,
//   bulkRevenue: 200000,
//   averageCompletionDays: 15
// }
```

## 🎨 自定义样式

组件使用 Tailwind CSS，支持自定义样式：

```tsx
<SalesFlow 
  className="border-2 border-blue-500 rounded-xl"
  height={600}
/>
```

### 节点颜色配置

- **根节点**: `bg-blue-100 border-blue-400`
- **样衣销售**: `bg-purple-100 border-purple-400`
- **大货销售**: `bg-orange-100 border-orange-400`
- **流程节点**: 根据状态动态变化

## 🔍 调试模式

启用调试模式可以查看详细的日志信息：

```tsx
<SalesFlow debug={true} />
```

## 📚 Storybook 示例

组件库提供了丰富的 Storybook 示例：

- `Default`: 默认销售工作流
- `WithProgress`: 带进度展示
- `Interactive`: 交互示例
- `Editable`: 可编辑模式
- `SampleClothing`: 样衣销售流程
- `BulkOrder`: 大货销售流程

运行 Storybook 查看所有示例：

```bash
npm run storybook
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如果您遇到任何问题或有建议，请：

1. 查看 [Issues](../../issues) 页面
2. 创建新的 Issue
3. 联系开发团队

---

**更新时间**: 2024-10-16  
**维护者**: ERP Agent Team
