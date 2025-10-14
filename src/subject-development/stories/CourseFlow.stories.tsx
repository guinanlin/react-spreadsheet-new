import type { Meta, StoryObj } from '@storybook/react';
import type { Node, Edge } from '@xyflow/react';
import { CourseFlow } from '../components/CourseFlow';
import type { FlowNodeData } from '../types';

// 默认的边（与 CourseFlow 组件中保持一致 - 树状结构）
const defaultEdges: Edge[] = [
  // 课程开发（root）-> 4个主要阶段
  { id: 'e-root-stage1', source: 'root', target: 'stage-1', animated: true, type: 'smoothstep' },
  { id: 'e-root-stage2', source: 'root', target: 'stage-2', animated: true, type: 'smoothstep' },
  { id: 'e-root-stage3', source: 'root', target: 'stage-3', animated: true, type: 'smoothstep' },
  { id: 'e-root-stage4', source: 'root', target: 'stage-4', animated: true, type: 'smoothstep' },

  // 第一阶段：学习目标设定 -> 子任务
  { id: 'e-stage1-1-1', source: 'stage-1', target: '1-1', type: 'smoothstep' },
  { id: 'e-stage1-1-2', source: 'stage-1', target: '1-2', type: 'smoothstep' },
  { id: 'e-stage1-1-3', source: 'stage-1', target: '1-3', type: 'smoothstep' },

  // 第二阶段：课程内容规划 -> 子任务
  { id: 'e-stage2-2-1', source: 'stage-2', target: '2-1', type: 'smoothstep' },
  { id: 'e-stage2-2-2', source: 'stage-2', target: '2-2', type: 'smoothstep' },
  { id: 'e-stage2-2-3', source: 'stage-2', target: '2-3', type: 'smoothstep' },

  // 第三阶段：课程教学设计 -> 子任务
  { id: 'e-stage3-3-1', source: 'stage-3', target: '3-1', type: 'smoothstep' },
  { id: 'e-stage3-3-2', source: 'stage-3', target: '3-2', type: 'smoothstep' },
  { id: 'e-stage3-3-3', source: 'stage-3', target: '3-3', type: 'smoothstep' },

  // 第四阶段：课程资料制作 -> 子任务
  { id: 'e-stage4-4-1', source: 'stage-4', target: '4-1', type: 'smoothstep' },
  { id: 'e-stage4-4-2', source: 'stage-4', target: '4-2', type: 'smoothstep' },
  { id: 'e-stage4-4-3', source: 'stage-4', target: '4-3', type: 'smoothstep' },
];

const meta: Meta<typeof CourseFlow> = {
  title: 'SubjectDevelopment/CourseFlow',
  component: CourseFlow,
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
type Story = StoryObj<typeof CourseFlow>;

/**
 * 默认流程图 - 树状结构的课程开发流程
 * 顶层"课程开发"节点下包含4个阶段，每个阶段包含3个子任务
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
 * 进度展示 - 部分任务已完成（树状结构）
 */
export const WithProgress: Story = {
  args: {
    height: 800,
    showControls: true,
    showMinimap: true,
    initialNodes: [
      // 顶层：课程开发
      {
        id: 'root',
        type: 'mainNode',
        data: {
          label: '课程开发',
          type: 'main',
          status: 'in-progress',
          description: '整体课程开发流程',
        },
        position: { x: 500, y: 50 },
      },

      // 第一阶段：学习目标设定 - 已完成
      {
        id: 'stage-1',
        type: 'mainNode',
        data: {
          label: '学习目标设定',
          type: 'main',
          status: 'completed',
          description: '课程设计的起点',
        },
        position: { x: 150, y: 220 },
      },
      {
        id: '1-1',
        type: 'subNode',
        data: { label: '目标群体分析', type: 'sub', status: 'completed' },
        position: { x: 50, y: 370 },
      },
      {
        id: '1-2',
        type: 'subNode',
        data: { label: '学习成果设定', type: 'sub', status: 'completed' },
        position: { x: 150, y: 370 },
      },
      {
        id: '1-3',
        type: 'subNode',
        data: { label: '评估标准定义', type: 'sub', status: 'completed' },
        position: { x: 250, y: 370 },
      },

      // 第二阶段：课程内容规划 - 进行中
      {
        id: 'stage-2',
        type: 'mainNode',
        data: {
          label: '课程内容规划',
          type: 'main',
          status: 'in-progress',
          description: '规划课程模块与结构',
        },
        position: { x: 450, y: 220 },
      },
      {
        id: '2-1',
        type: 'subNode',
        data: { label: '课程模块设计', type: 'sub', status: 'completed' },
        position: { x: 350, y: 370 },
      },
      {
        id: '2-2',
        type: 'subNode',
        data: { label: '教学方法选择', type: 'sub', status: 'in-progress' },
        position: { x: 450, y: 370 },
      },
      {
        id: '2-3',
        type: 'subNode',
        data: { label: '教学时间安排', type: 'sub', status: 'pending' },
        position: { x: 550, y: 370 },
      },

      // 第三阶段：课程教学设计 - 待处理
      {
        id: 'stage-3',
        type: 'mainNode',
        data: {
          label: '课程教学设计',
          type: 'main',
          status: 'pending',
          description: '详细的教学活动设计',
        },
        position: { x: 750, y: 220 },
      },
      {
        id: '3-1',
        type: 'subNode',
        data: { label: '教学策略设计', type: 'sub', status: 'pending' },
        position: { x: 650, y: 370 },
      },
      {
        id: '3-2',
        type: 'subNode',
        data: { label: '学习活动设计', type: 'sub', status: 'pending' },
        position: { x: 750, y: 370 },
      },
      {
        id: '3-3',
        type: 'subNode',
        data: { label: '教学评价方案设计', type: 'sub', status: 'pending' },
        position: { x: 850, y: 370 },
      },

      // 第四阶段：课程资料制作 - 被阻塞
      {
        id: 'stage-4',
        type: 'mainNode',
        data: {
          label: '课程资料制作',
          type: 'main',
          status: 'blocked',
          description: '制作教学材料和资源',
        },
        position: { x: 500, y: 520 },
      },
      {
        id: '4-1',
        type: 'subNode',
        data: { label: '教学PPT制作', type: 'sub', status: 'blocked' },
        position: { x: 400, y: 670 },
      },
      {
        id: '4-2',
        type: 'subNode',
        data: { label: '习题与案例设计', type: 'sub', status: 'blocked' },
        position: { x: 500, y: 670 },
      },
      {
        id: '4-3',
        type: 'subNode',
        data: { label: '课件录制与编辑', type: 'sub', status: 'blocked' },
        position: { x: 600, y: 670 },
      },
    ] as Node<FlowNodeData>[],
    initialEdges: defaultEdges,
  },
};

/**
 * 简化流程 - 只显示主节点（无子任务）
 */
export const SimpleFlow: Story = {
  args: {
    height: 500,
    initialNodes: [
      {
        id: 'root',
        type: 'mainNode',
        data: {
          label: '课程开发',
          type: 'main',
          status: 'in-progress',
          description: '整体流程'
        },
        position: { x: 400, y: 50 },
      },
      {
        id: 'stage-1',
        type: 'mainNode',
        data: {
          label: '学习目标设定',
          type: 'main',
          status: 'completed',
        },
        position: { x: 150, y: 220 },
      },
      {
        id: 'stage-2',
        type: 'mainNode',
        data: {
          label: '课程内容规划',
          type: 'main',
          status: 'in-progress',
        },
        position: { x: 400, y: 220 },
      },
      {
        id: 'stage-3',
        type: 'mainNode',
        data: {
          label: '课程教学设计',
          type: 'main',
          status: 'pending',
        },
        position: { x: 650, y: 220 },
      },
      {
        id: 'stage-4',
        type: 'mainNode',
        data: {
          label: '课程资料制作',
          type: 'main',
          status: 'pending',
        },
        position: { x: 400, y: 390 },
      },
    ] as Node<FlowNodeData>[],
    initialEdges: [
      { id: 'e-root-stage1', source: 'root', target: 'stage-1', animated: true, type: 'smoothstep' },
      { id: 'e-root-stage2', source: 'root', target: 'stage-2', animated: true, type: 'smoothstep' },
      { id: 'e-root-stage3', source: 'root', target: 'stage-3', animated: true, type: 'smoothstep' },
      { id: 'e-root-stage4', source: 'root', target: 'stage-4', animated: true, type: 'smoothstep' },
    ],
  },
};

/**
 * 自定义高度
 */
export const CustomHeight: Story = {
  args: {
    height: 900,
    showControls: true,
    showMinimap: true,
    initialEdges: defaultEdges,
  },
};

/**
 * 交互示例 - 点击节点查看详情
 */
export const Interactive: Story = {
  args: {
    height: 800,
    initialEdges: defaultEdges,
    onNodeClick: (node: any) => {
      console.log('节点点击:', node);
      alert(`点击了: ${node.data.label}\n状态: ${node.data.status || 'pending'}`);
    },
    onNodeDoubleClick: (node: any) => {
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
 * 带占位符节点 - 展示如何添加新子任务
 */
export const WithPlaceholder: Story = {
  args: {
    height: 600,
    editable: true,
    showControls: true,
    showMinimap: true,
    initialNodes: [
      // 顶层：课程开发
      {
        id: 'root',
        type: 'mainNode',
        data: {
          label: '课程开发',
          type: 'main',
          status: 'in-progress',
          description: '整体课程开发流程',
        },
        position: { x: 400, y: 50 },
      },
      // 第一阶段（已完成）
      {
        id: 'stage-1',
        type: 'mainNode',
        data: {
          label: '学习目标设定',
          type: 'main',
          status: 'completed',
          description: '课程设计的起点',
        },
        position: { x: 150, y: 220 },
      },
      {
        id: '1-1',
        type: 'subNode',
        data: { label: '目标群体分析', type: 'sub', status: 'completed' },
        position: { x: 50, y: 370 },
      },
      {
        id: '1-2',
        type: 'subNode',
        data: { label: '学习成果设定', type: 'sub', status: 'completed' },
        position: { x: 150, y: 370 },
      },
      {
        id: '1-3',
        type: 'subNode',
        data: { label: '评估标准定义', type: 'sub', status: 'completed' },
        position: { x: 250, y: 370 },
      },
      // 占位符 - 添加更多子任务
      {
        id: 'placeholder-1',
        type: 'placeholderNode',
        data: { label: '添加子任务', type: 'sub' },
        position: { x: 150, y: 480 },
      },
      // 第二阶段（占位符）
      {
        id: 'placeholder-stage-2',
        type: 'placeholderNode',
        data: { label: '添加新阶段', type: 'main' },
        position: { x: 450, y: 220 },
      },
    ] as Node<FlowNodeData>[],
    initialEdges: [
      { id: 'e-root-stage1', source: 'root', target: 'stage-1', animated: true, type: 'smoothstep' },
      { id: 'e-root-p2', source: 'root', target: 'placeholder-stage-2', animated: true, type: 'smoothstep' },
      { id: 'e-stage1-1-1', source: 'stage-1', target: '1-1', type: 'smoothstep' },
      { id: 'e-stage1-1-2', source: 'stage-1', target: '1-2', type: 'smoothstep' },
      { id: 'e-stage1-1-3', source: 'stage-1', target: '1-3', type: 'smoothstep' },
      { id: 'e-stage1-p1', source: 'stage-1', target: 'placeholder-1', type: 'smoothstep', style: { strokeDasharray: '5,5' } },
    ],
    onNodeClick: (node: any) => {
      if (node.id.startsWith('placeholder')) {
        alert('点击占位符节点可以添加新任务！');
      }
    },
  },
};

/**
 * 完整展开 - 显示所有节点和连接
 */
export const FullExpanded: Story = {
  args: {
    height: 800,
    showControls: true,
    showMinimap: true,
    initialEdges: defaultEdges,
    debug: false,
  },
};


