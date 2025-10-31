import type { Meta, StoryObj } from '@storybook/react';
import type { Node, Edge } from '@xyflow/react';
import { SalesFlow } from '../components/SalesFlow';
import { SalesNodeDetail } from '../components/SalesNodeDetail';
import type { SalesNodeData, SalesDetailData } from '../types';
import { createDefaultSalesNodes, createDefaultSalesEdges } from '../hooks/use-sales-workflow';

// 默认的边（与 SalesFlow 组件中保持一致）
const defaultEdges: Edge[] = createDefaultSalesEdges();

const meta: Meta<typeof SalesFlow> = {
  title: 'ERP Agent/SalesFlow',
  component: SalesFlow,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    editable: { control: 'boolean' },
    showControls: { control: 'boolean' },
    showMinimap: { control: 'boolean' },
    debug: { control: 'boolean' },
    height: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof SalesFlow>;

/**
 * 默认销售工作流 - 完整的服装销售流程
 * 包含样衣销售和大货销售两个业务板块
 */
export const Default: Story = {
  args: {
    height: 800,
    showControls: true,
    showMinimap: true,
    initialEdges: defaultEdges,
  },
};

/**
 * 可编辑模式 - 允许拖拽和连接节点
 */
export const Editable: Story = {
  args: {
    editable: true,
    height: 800,
    showControls: true,
    showMinimap: true,
    initialEdges: defaultEdges,
  },
};

/**
 * 精简模式 - 无控制按钮和小地图
 */
export const Minimal: Story = {
  args: {
    height: 800,
    showControls: false,
    showMinimap: false,
    initialEdges: defaultEdges,
  },
};

/**
 * 进度展示 - 部分任务已完成
 */
export const WithProgress: Story = {
  args: {
    height: 800,
    showControls: true,
    showMinimap: true,
    initialNodes: [
      // 根节点：销售
      {
        id: 'root',
        type: 'rootNode',
        data: {
          label: '销售',
          type: 'root',
          status: 'in-progress',
          description: '服装销售整体流程'
        },
        position: { x: 500, y: 50 },
      },

      // 样衣销售业务板块 - 已完成
      {
        id: 'sample-business',
        type: 'businessNode',
        data: {
          label: '样衣销售',
          type: 'business',
          businessType: 'sample',
          status: 'completed',
          description: '样衣销售业务板块'
        },
        position: { x: 250, y: 200 },
      },
      {
        id: 'sample-contract',
        type: 'processNode',
        data: { label: '签订销售合同', type: 'process', status: 'completed', description: '与客户签订样衣销售合同' },
        position: { x: 150, y: 350 },
      },
      {
        id: 'sample-production',
        type: 'processNode',
        data: { label: '安排生产', type: 'process', status: 'completed', description: '安排样衣生产计划' },
        position: { x: 250, y: 350 },
      },
      {
        id: 'sample-tracking',
        type: 'processNode',
        data: { label: '跟踪进度', type: 'process', status: 'completed', description: '跟踪样衣生产进度' },
        position: { x: 350, y: 350 },
      },

      // 大货销售业务板块 - 进行中
      {
        id: 'bulk-business',
        type: 'businessNode',
        data: {
          label: '大货销售',
          type: 'business',
          businessType: 'bulk',
          status: 'in-progress',
          description: '大货销售业务板块'
        },
        position: { x: 750, y: 200 },
      },
      {
        id: 'bulk-contract',
        type: 'processNode',
        data: { label: '签订销售合同', type: 'process', status: 'completed', description: '与客户签订大货销售合同' },
        position: { x: 650, y: 350 },
      },
      {
        id: 'bulk-production',
        type: 'processNode',
        data: { label: '安排生产', type: 'process', status: 'in-progress', description: '安排大货生产计划' },
        position: { x: 750, y: 350 },
      },
      {
        id: 'bulk-tracking',
        type: 'processNode',
        data: { label: '跟踪进度', type: 'process', status: 'pending', description: '跟踪大货生产进度' },
        position: { x: 850, y: 350 },
      },
    ] as Node<SalesNodeData>[],
    initialEdges: defaultEdges,
  },
};

/**
 * 样衣销售流程 - 单独展示样衣销售流程
 */
export const SampleClothing: Story = {
  args: {
    height: 600,
    showControls: true,
    showMinimap: true,
    initialNodes: [
      // 样衣销售业务板块
      {
        id: 'sample-business',
        type: 'businessNode',
        data: {
          label: '样衣销售',
          type: 'business',
          businessType: 'sample',
          status: 'in-progress',
          description: '样衣销售业务板块'
        },
        position: { x: 400, y: 50 },
      },
      {
        id: 'sample-contract',
        type: 'processNode',
        data: { label: '签订销售合同', type: 'process', status: 'completed', description: '与客户签订样衣销售合同' },
        position: { x: 200, y: 200 },
      },
      {
        id: 'sample-production',
        type: 'processNode',
        data: { label: '安排生产', type: 'process', status: 'in-progress', description: '安排样衣生产计划' },
        position: { x: 400, y: 200 },
      },
      {
        id: 'sample-tracking',
        type: 'processNode',
        data: { label: '跟踪进度', type: 'process', status: 'pending', description: '跟踪样衣生产进度' },
        position: { x: 600, y: 200 },
      },
    ] as Node<SalesNodeData>[],
    initialEdges: [
      { 
        id: 'e-sample-contract', 
        source: 'sample-business', 
        target: 'sample-contract', 
        type: 'smoothstep',
        style: { stroke: '#8b5cf6', strokeWidth: 2 }
      },
      { 
        id: 'e-sample-production', 
        source: 'sample-business', 
        target: 'sample-production', 
        type: 'smoothstep',
        style: { stroke: '#8b5cf6', strokeWidth: 2 }
      },
      { 
        id: 'e-sample-tracking', 
        source: 'sample-business', 
        target: 'sample-tracking', 
        type: 'smoothstep',
        style: { stroke: '#8b5cf6', strokeWidth: 2 }
      },
    ],
  },
};

/**
 * 大货销售流程 - 单独展示大货销售流程
 */
export const BulkOrder: Story = {
  args: {
    height: 600,
    showControls: true,
    showMinimap: true,
    initialNodes: [
      // 大货销售业务板块
      {
        id: 'bulk-business',
        type: 'businessNode',
        data: {
          label: '大货销售',
          type: 'business',
          businessType: 'bulk',
          status: 'in-progress',
          description: '大货销售业务板块'
        },
        position: { x: 400, y: 50 },
      },
      {
        id: 'bulk-contract',
        type: 'processNode',
        data: { label: '签订销售合同', type: 'process', status: 'in-progress', description: '与客户签订大货销售合同' },
        position: { x: 200, y: 200 },
      },
      {
        id: 'bulk-production',
        type: 'processNode',
        data: { label: '安排生产', type: 'process', status: 'pending', description: '安排大货生产计划' },
        position: { x: 400, y: 200 },
      },
      {
        id: 'bulk-tracking',
        type: 'processNode',
        data: { label: '跟踪进度', type: 'process', status: 'pending', description: '跟踪大货生产进度' },
        position: { x: 600, y: 200 },
      },
    ] as Node<SalesNodeData>[],
    initialEdges: [
      { 
        id: 'e-bulk-contract', 
        source: 'bulk-business', 
        target: 'bulk-contract', 
        type: 'smoothstep',
        style: { stroke: '#f97316', strokeWidth: 2 }
      },
      { 
        id: 'e-bulk-production', 
        source: 'bulk-business', 
        target: 'bulk-production', 
        type: 'smoothstep',
        style: { stroke: '#f97316', strokeWidth: 2 }
      },
      { 
        id: 'e-bulk-tracking', 
        source: 'bulk-business', 
        target: 'bulk-tracking', 
        type: 'smoothstep',
        style: { stroke: '#f97316', strokeWidth: 2 }
      },
    ],
  },
};

/**
 * 交互示例 - 点击节点显示详情
 */
export const Interactive: Story = {
  args: {
    height: 800,
    showControls: true,
    showMinimap: true,
    initialEdges: defaultEdges,
    onNodeClick: (node: Node<SalesNodeData>) => {
      console.log('节点点击:', node);
      
      // 创建节点详情数据
      const detailData: SalesDetailData = {
        nodeId: node.id,
        label: node.data.label,
        status: node.data.status || 'pending',
        description: node.data.description || `这是 ${node.data.label} 的详细说明`,
        createdAt: new Date(),
        updatedAt: new Date(),
        assignee: '销售经理',
        priority: 'medium',
        estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        attachments: ['合同模板.pdf', '生产计划.xlsx'],
        notes: `节点类型: ${node.data.type}${node.data.businessType ? `, 业务类型: ${node.data.businessType}` : ''}`,
      };

      // 这里可以显示详情弹窗
      alert(`点击了: ${node.data.label}\n状态: ${node.data.status || 'pending'}\n类型: ${node.data.type}`);
    },
    onNodeDoubleClick: (node: Node<SalesNodeData>) => {
      console.log('节点双击:', node);
      alert(`双击了: ${node.data.label}\n您可以在这里打开编辑对话框`);
    },
  },
};

/**
 * 调试模式
 */
export const DebugMode: Story = {
  args: {
    height: 800,
    debug: true,
    showControls: true,
    showMinimap: true,
    initialEdges: defaultEdges,
  },
};

/**
 * 自定义高度
 */
export const CustomHeight: Story = {
  args: {
    height: 600,
    showControls: true,
    showMinimap: true,
    initialEdges: defaultEdges,
  },
};

/**
 * 节点详情组件示例
 */
export const NodeDetailExample: Story = {
  render: () => {
    const detailData: SalesDetailData = {
      nodeId: 'sample-contract',
      label: '签订销售合同',
      status: 'in-progress',
      description: '与客户签订样衣销售合同，确认款式、数量、价格等详细信息',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      assignee: '张三',
      priority: 'high',
      estimatedCompletion: new Date('2024-01-20'),
      attachments: ['合同模板.pdf', '客户资料.xlsx'],
      notes: '客户要求较急，需要优先处理',
    };

    return (
      <div className="relative">
        <SalesNodeDetail
          data={detailData}
          visible={true}
          editable={true}
          onClose={() => {}}
          onSave={(data) => {
            console.log('保存数据:', data);
            alert('数据已保存！');
          }}
        />
      </div>
    );
  },
};
