/**
 * ERP Agent 销售智能体组件 - 销售工作流 Hook
 */

import { useState, useCallback, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { 
  SalesNodeData, 
  SalesNodeStatus, 
  SalesDetailData, 
  SalesStatistics,
  UseSalesWorkflowReturn,
  BusinessType 
} from '../types';
import { generateId, generateDefaultStatistics } from '../lib/utils';

/**
 * 销售工作流 Hook
 * 管理销售工作流的状态和操作
 */
export function useSalesWorkflow(
  initialNodes: Node<SalesNodeData>[] = [],
  initialEdges: Edge[] = []
): UseSalesWorkflowReturn {
  const [nodes, setNodes] = useState<Node<SalesNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  /**
   * 更新节点状态
   */
  const updateNodeStatus = useCallback((nodeId: string, status: SalesNodeStatus) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, status } }
          : node
      )
    );
  }, []);

  /**
   * 更新节点数据
   */
  const updateNodeData = useCallback((nodeId: string, data: Partial<SalesNodeData>) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
  }, []);

  /**
   * 获取节点详情
   */
  const getNodeDetail = useCallback((nodeId: string): SalesDetailData | null => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;

    const { data } = node;
    
    return {
      nodeId,
      label: data.label,
      status: data.status || 'pending',
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      assignee: '销售经理',
      priority: 'medium',
      estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后
      attachments: [],
      notes: `这是 ${data.label} 的详细说明`,
    };
  }, [nodes]);

  /**
   * 获取统计数据
   */
  const getStatistics = useCallback((): SalesStatistics => {
    const stats = generateDefaultStatistics();
    
    // 统计订单数据
    const sampleNodes = nodes.filter(node => node.data.businessType === 'sample');
    const bulkNodes = nodes.filter(node => node.data.businessType === 'bulk');
    
    stats.totalOrders = sampleNodes.length + bulkNodes.length;
    stats.sampleOrders = sampleNodes.length;
    stats.bulkOrders = bulkNodes.length;
    
    // 统计状态数据
    stats.completedOrders = nodes.filter(node => node.data.status === 'completed').length;
    stats.inProgressOrders = nodes.filter(node => node.data.status === 'in-progress').length;
    
    // 模拟收入数据
    stats.sampleRevenue = sampleNodes.length * 5000; // 样衣平均5000元
    stats.bulkRevenue = bulkNodes.length * 50000; // 大货平均50000元
    stats.totalRevenue = stats.sampleRevenue + stats.bulkRevenue;
    
    // 模拟平均完成时间
    stats.averageCompletionDays = Math.floor(Math.random() * 30) + 5; // 5-35天
    
    return stats;
  }, [nodes]);

  /**
   * 重置工作流
   */
  const resetWorkflow = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  return {
    nodes,
    edges,
    updateNodeStatus,
    updateNodeData,
    getNodeDetail,
    getStatistics,
    resetWorkflow,
  };
}

/**
 * 创建默认的销售工作流节点数据
 */
export function createDefaultSalesNodes(): Node<SalesNodeData>[] {
  return [
    // 根节点：销售
    {
      id: 'root',
      type: 'rootNode',
      data: {
        label: '销售',
        type: 'root',
        status: 'in-progress',
        description: '服装销售整体流程',
      },
      position: { x: 500, y: 50 },
    },

    // 业务板块：样衣销售
    {
      id: 'sample-business',
      type: 'businessNode',
      data: {
        label: '样衣销售',
        type: 'business',
        businessType: 'sample',
        status: 'in-progress',
        description: '样衣销售业务板块',
      },
      position: { x: 250, y: 200 },
    },

    // 样衣销售流程节点
    {
      id: 'sample-contract',
      type: 'processNode',
      data: {
        label: '签订销售合同',
        type: 'process',
        status: 'completed',
        description: '与客户签订样衣销售合同',
      },
      position: { x: 150, y: 350 },
    },
    {
      id: 'sample-production',
      type: 'processNode',
      data: {
        label: '安排生产',
        type: 'process',
        status: 'in-progress',
        description: '安排样衣生产计划',
      },
      position: { x: 250, y: 350 },
    },
    {
      id: 'sample-tracking',
      type: 'processNode',
      data: {
        label: '跟踪进度',
        type: 'process',
        status: 'pending',
        description: '跟踪样衣生产进度',
      },
      position: { x: 350, y: 350 },
    },

    // 业务板块：大货销售
    {
      id: 'bulk-business',
      type: 'businessNode',
      data: {
        label: '大货销售',
        type: 'business',
        businessType: 'bulk',
        status: 'pending',
        description: '大货销售业务板块',
      },
      position: { x: 750, y: 200 },
    },

    // 大货销售流程节点
    {
      id: 'bulk-contract',
      type: 'processNode',
      data: {
        label: '签订销售合同',
        type: 'process',
        status: 'pending',
        description: '与客户签订大货销售合同',
      },
      position: { x: 650, y: 350 },
    },
    {
      id: 'bulk-production',
      type: 'processNode',
      data: {
        label: '安排生产',
        type: 'process',
        status: 'pending',
        description: '安排大货生产计划',
      },
      position: { x: 750, y: 350 },
    },
    {
      id: 'bulk-tracking',
      type: 'processNode',
      data: {
        label: '跟踪进度',
        type: 'process',
        status: 'pending',
        description: '跟踪大货生产进度',
      },
      position: { x: 850, y: 350 },
    },
  ];
}

/**
 * 创建默认的销售工作流边数据
 */
export function createDefaultSalesEdges(): Edge[] {
  return [
    // 销售（root）-> 业务板块
    { 
      id: 'e-root-sample', 
      source: 'root', 
      target: 'sample-business', 
      animated: true, 
      type: 'smoothstep',
      style: { stroke: '#8b5cf6', strokeWidth: 2 }
    },
    { 
      id: 'e-root-bulk', 
      source: 'root', 
      target: 'bulk-business', 
      animated: true, 
      type: 'smoothstep',
      style: { stroke: '#f97316', strokeWidth: 2 }
    },

    // 样衣销售 -> 流程节点
    { 
      id: 'e-sample-contract', 
      source: 'sample-business', 
      target: 'sample-contract', 
      type: 'smoothstep',
      style: { stroke: '#8b5cf6', strokeWidth: 1.5 }
    },
    { 
      id: 'e-sample-production', 
      source: 'sample-business', 
      target: 'sample-production', 
      type: 'smoothstep',
      style: { stroke: '#8b5cf6', strokeWidth: 1.5 }
    },
    { 
      id: 'e-sample-tracking', 
      source: 'sample-business', 
      target: 'sample-tracking', 
      type: 'smoothstep',
      style: { stroke: '#8b5cf6', strokeWidth: 1.5 }
    },

    // 大货销售 -> 流程节点
    { 
      id: 'e-bulk-contract', 
      source: 'bulk-business', 
      target: 'bulk-contract', 
      type: 'smoothstep',
      style: { stroke: '#f97316', strokeWidth: 1.5 }
    },
    { 
      id: 'e-bulk-production', 
      source: 'bulk-business', 
      target: 'bulk-production', 
      type: 'smoothstep',
      style: { stroke: '#f97316', strokeWidth: 1.5 }
    },
    { 
      id: 'e-bulk-tracking', 
      source: 'bulk-business', 
      target: 'bulk-tracking', 
      type: 'smoothstep',
      style: { stroke: '#f97316', strokeWidth: 1.5 }
    },
  ];
}
