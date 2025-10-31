/**
 * ERP Agent 销售智能体组件 - TypeScript 类型定义
 */

import * as React from 'react';
import type { Node, Edge } from '@xyflow/react';

// ============================================
// 基础数据类型
// ============================================

/**
 * 销售节点类型
 */
export type SalesNodeType = 'root' | 'business' | 'process' | 'processGroup';

/**
 * 销售节点状态
 */
export type SalesNodeStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';

/**
 * 业务板块类型
 */
export type BusinessType = 'sample' | 'bulk';

/**
 * 销售节点数据
 */
export interface SalesNodeData extends Record<string, unknown> {
  /** 节点标签 */
  label: string;
  /** 节点类型 */
  type: SalesNodeType;
  /** 节点状态 */
  status?: SalesNodeStatus;
  /** 节点描述 */
  description?: string;
  /** 业务板块类型（仅适用于 business 类型节点） */
  businessType?: BusinessType;
  /** 是否可编辑 */
  editable?: boolean;
  /** 自定义数据 */
  metadata?: Record<string, any>;
}

/**
 * 销售详情数据
 */
export interface SalesDetailData {
  /** 节点 ID */
  nodeId: string;
  /** 节点标签 */
  label: string;
  /** 节点状态 */
  status: SalesNodeStatus;
  /** 详细描述 */
  description?: string;
  /** 创建时间 */
  createdAt?: Date;
  /** 更新时间 */
  updatedAt?: Date;
  /** 负责人 */
  assignee?: string;
  /** 优先级 */
  priority?: 'low' | 'medium' | 'high';
  /** 预计完成时间 */
  estimatedCompletion?: Date;
  /** 实际完成时间 */
  actualCompletion?: Date;
  /** 相关文件 */
  attachments?: string[];
  /** 备注 */
  notes?: string;
}

// ============================================
// 组件 Props 接口
// ============================================

/**
 * 销售工作流组件 Props
 */
export interface SalesFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 初始节点数据 */
  initialNodes?: Node<SalesNodeData>[];
  /** 初始边数据 */
  initialEdges?: Edge[];
  /** 是否可编辑 */
  editable?: boolean;
  /** 节点变化回调 */
  onNodesChange?: (nodes: Node<SalesNodeData>[]) => void;
  /** 边变化回调 */
  onEdgesChange?: (edges: Edge[]) => void;
  /** 节点点击回调 */
  onNodeClick?: (node: Node<SalesNodeData>) => void;
  /** 节点双击回调 */
  onNodeDoubleClick?: (node: Node<SalesNodeData>) => void;
  /** 高度 */
  height?: string | number;
  /** 是否显示控制按钮 */
  showControls?: boolean;
  /** 是否显示小地图 */
  showMinimap?: boolean;
  /** 调试模式 */
  debug?: boolean;
}

/**
 * 销售节点详情组件 Props
 */
export interface SalesNodeDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 节点详情数据 */
  data?: SalesDetailData;
  /** 是否显示 */
  visible?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 保存回调 */
  onSave?: (data: SalesDetailData) => void;
  /** 是否可编辑 */
  editable?: boolean;
}

// ============================================
// 工作流相关类型
// ============================================

/**
 * 销售工作流配置
 */
export interface SalesWorkflowConfig {
  /** 工作流名称 */
  name: string;
  /** 工作流描述 */
  description?: string;
  /** 业务类型 */
  businessType?: BusinessType;
  /** 是否启用 */
  enabled: boolean;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
}

/**
 * 销售统计数据
 */
export interface SalesStatistics {
  /** 总订单数 */
  totalOrders: number;
  /** 样衣订单数 */
  sampleOrders: number;
  /** 大货订单数 */
  bulkOrders: number;
  /** 已完成订单数 */
  completedOrders: number;
  /** 进行中订单数 */
  inProgressOrders: number;
  /** 总销售额 */
  totalRevenue: number;
  /** 样衣销售额 */
  sampleRevenue: number;
  /** 大货销售额 */
  bulkRevenue: number;
  /** 平均完成时间（天） */
  averageCompletionDays: number;
}

// ============================================
// Hook 相关类型
// ============================================

/**
 * 销售工作流 Hook 返回值
 */
export interface UseSalesWorkflowReturn {
  /** 节点数据 */
  nodes: Node<SalesNodeData>[];
  /** 边数据 */
  edges: Edge[];
  /** 更新节点状态 */
  updateNodeStatus: (nodeId: string, status: SalesNodeStatus) => void;
  /** 更新节点数据 */
  updateNodeData: (nodeId: string, data: Partial<SalesNodeData>) => void;
  /** 获取节点详情 */
  getNodeDetail: (nodeId: string) => SalesDetailData | null;
  /** 获取统计数据 */
  getStatistics: () => SalesStatistics;
  /** 重置工作流 */
  resetWorkflow: () => void;
}
