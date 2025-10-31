import type { Node, Edge } from "@xyflow/react"

/**
 * 销售节点数据类型定义
 */
export interface SalesNodeData extends Record<string, unknown> {
  label: string
  pendingCount?: number
  errorCount?: number
}

/**
 * 销售工作流节点类型
 */
export type SalesNode = Node<SalesNodeData>

/**
 * 销售工作流边类型
 */
export type SalesEdge = Edge

/**
 * 销售流程类型枚举
 */
export enum SalesProcessType {
  SAMPLE = "sample",      // 样品销售
  SALES_SAMPLE = "sales_sample",  // 销售样销售
  BULK = "bulk"          // 大货销售
}

/**
 * 节点状态枚举
 */
export enum NodeStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress", 
  COMPLETED = "completed",
  ERROR = "error"
}

/**
 * 销售工作流初始节点配置
 */
export const SALES_FLOW_NODES: SalesNode[] = [
  // 顶级节点：销售
  {
    id: "1",
    type: "input",
    position: { x: 600, y: 50 },
    data: { label: "销售智能体" },
    style: {
      fontWeight: "bold",
      width: 180,
      fontSize: "16px",
    },
  },

  // 业务流程节点
  {
    id: "2",
    position: { x: 50, y: 200 },
    data: { label: "样品销售流程" },
    style: {
      fontWeight: "bold",
      width: 160,
    },
  },
  {
    id: "18",
    position: { x: 550, y: 200 },
    data: { label: "销售样销售流程" },
    style: {
      fontWeight: "bold",
      width: 160,
    },
  },
  {
    id: "3",
    position: { x: 1050, y: 200 },
    data: { label: "大货销售流程" },
    style: {
      fontWeight: "bold",
      width: 160,
    },
  },

  // 样品销售流程节点
  {
    id: "4",
    type: "custom",
    position: { x: 0, y: 380 },
    data: { label: "制作销售合同", pendingCount: 3, errorCount: 1 },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 0, y: 530 },
    data: { label: "安排样品生产", pendingCount: 2, errorCount: 0 },
  },
  {
    id: "6",
    type: "custom",
    position: { x: 0, y: 680 },
    data: { label: "跟踪生产进度", pendingCount: 5, errorCount: 2 },
  },
  {
    id: "7",
    type: "custom",
    position: { x: 280, y: 380 },
    data: { label: "质量检验", pendingCount: 1, errorCount: 0 },
  },
  {
    id: "8",
    type: "custom",
    position: { x: 280, y: 530 },
    data: { label: "样品发货", pendingCount: 4, errorCount: 1 },
  },
  {
    id: "9",
    type: "custom",
    position: { x: 140, y: 830 },
    data: { label: "客户确认", pendingCount: 2, errorCount: 0 },
  },

  // 销售样销售流程节点
  {
    id: "19",
    type: "custom",
    position: { x: 450, y: 380 },
    data: { label: "签订销售样合同", pendingCount: 2, errorCount: 1 },
  },
  {
    id: "20",
    type: "custom",
    position: { x: 450, y: 530 },
    data: { label: "纸样审核", pendingCount: 1, errorCount: 0 },
  },
  {
    id: "21",
    type: "custom",
    position: { x: 450, y: 680 },
    data: { label: "安排生产", pendingCount: 3, errorCount: 0 },
  },
  {
    id: "22",
    type: "custom",
    position: { x: 730, y: 380 },
    data: { label: "跟踪生产进度", pendingCount: 5, errorCount: 2 },
  },
  {
    id: "23",
    type: "custom",
    position: { x: 730, y: 530 },
    data: { label: "客户确认", pendingCount: 2, errorCount: 0 },
  },

  // 大货销售流程节点
  {
    id: "10",
    type: "custom",
    position: { x: 950, y: 380 },
    data: { label: "签订大货合同", pendingCount: 2, errorCount: 1 },
  },
  {
    id: "11",
    type: "custom",
    position: { x: 950, y: 530 },
    data: { label: "纸样审核", pendingCount: 1, errorCount: 0 },
  },
  {
    id: "12",
    type: "custom",
    position: { x: 950, y: 680 },
    data: { label: "安排生产", pendingCount: 3, errorCount: 0 },
  },
  {
    id: "13",
    type: "custom",
    position: { x: 1230, y: 380 },
    data: { label: "跟踪生产进度", pendingCount: 5, errorCount: 2 },
  },
  {
    id: "14",
    type: "custom",
    position: { x: 1230, y: 530 },
    data: { label: "物流发货", pendingCount: 2, errorCount: 0 },
  },
  {
    id: "15",
    type: "custom",
    position: { x: 1230, y: 680 },
    data: { label: "收款结算", pendingCount: 1, errorCount: 1 },
  },

  // 最终节点
  {
    id: "17",
    type: "output",
    position: { x: 575, y: 1000 },
    data: { label: "销售完成" },
    style: {
      fontWeight: "bold",
      width: 150,
    },
  },
]

/**
 * 销售工作流初始边配置
 */
export const SALES_FLOW_EDGES: SalesEdge[] = [
  // 从销售智能体到三个业务流程
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-18", source: "1", target: "18", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },

  // 样品销售流程的连接
  { id: "e2-4", source: "2", target: "4", animated: true },
  { id: "e4-5", source: "4", target: "5", animated: true },
  { id: "e5-6", source: "5", target: "6", animated: true },
  { id: "e2-7", source: "2", target: "7", animated: true },
  { id: "e7-8", source: "7", target: "8", animated: true },
  { id: "e6-9", source: "6", target: "9", animated: true },
  { id: "e8-9", source: "8", target: "9", animated: true },

  // 销售样销售流程的连接
  { id: "e18-19", source: "18", target: "19", animated: true },
  { id: "e19-20", source: "19", target: "20", animated: true },
  { id: "e20-21", source: "20", target: "21", animated: true },
  { id: "e21-22", source: "21", target: "22", animated: true },
  { id: "e22-23", source: "22", target: "23", animated: true },

  // 大货销售流程的连接
  { id: "e3-10", source: "3", target: "10", animated: true },
  { id: "e10-11", source: "10", target: "11", animated: true },
  { id: "e11-12", source: "11", target: "12", animated: true },
  { id: "e12-13", source: "12", target: "13", animated: true },
  { id: "e13-14", source: "13", target: "14", animated: true },
  { id: "e14-15", source: "14", target: "15", animated: true },

  // 汇聚到最终节点
  { id: "e9-17", source: "9", target: "17", animated: true },
  { id: "e23-17", source: "23", target: "17", animated: true },
  { id: "e15-17", source: "15", target: "17", animated: true },
]

/**
 * 获取指定流程类型的节点
 */
export function getNodesByProcessType(processType: SalesProcessType): SalesNode[] {
  const processNodeMap = {
    [SalesProcessType.SAMPLE]: ["4", "5", "6", "7", "8", "9"],
    [SalesProcessType.SALES_SAMPLE]: ["19", "20", "21", "22", "23"],
    [SalesProcessType.BULK]: ["10", "11", "12", "13", "14", "15"],
  }
  
  return SALES_FLOW_NODES.filter(node => 
    processNodeMap[processType]?.includes(node.id)
  )
}

/**
 * 获取节点的统计信息
 */
export function getNodeStats(): {
  totalNodes: number
  totalPending: number
  totalErrors: number
  byProcessType: Record<SalesProcessType, { nodes: number; pending: number; errors: number }>
} {
  const stats = {
    totalNodes: SALES_FLOW_NODES.length,
    totalPending: 0,
    totalErrors: 0,
    byProcessType: {
      [SalesProcessType.SAMPLE]: { nodes: 0, pending: 0, errors: 0 },
      [SalesProcessType.SALES_SAMPLE]: { nodes: 0, pending: 0, errors: 0 },
      [SalesProcessType.BULK]: { nodes: 0, pending: 0, errors: 0 },
    }
  }

  SALES_FLOW_NODES.forEach(node => {
    if (node.data.pendingCount) stats.totalPending += node.data.pendingCount
    if (node.data.errorCount) stats.totalErrors += node.data.errorCount

    // 根据节点ID判断流程类型
    if (["4", "5", "6", "7", "8", "9"].includes(node.id)) {
      stats.byProcessType[SalesProcessType.SAMPLE].nodes++
      stats.byProcessType[SalesProcessType.SAMPLE].pending += node.data.pendingCount || 0
      stats.byProcessType[SalesProcessType.SAMPLE].errors += node.data.errorCount || 0
    } else if (["19", "20", "21", "22", "23"].includes(node.id)) {
      stats.byProcessType[SalesProcessType.SALES_SAMPLE].nodes++
      stats.byProcessType[SalesProcessType.SALES_SAMPLE].pending += node.data.pendingCount || 0
      stats.byProcessType[SalesProcessType.SALES_SAMPLE].errors += node.data.errorCount || 0
    } else if (["10", "11", "12", "13", "14", "15"].includes(node.id)) {
      stats.byProcessType[SalesProcessType.BULK].nodes++
      stats.byProcessType[SalesProcessType.BULK].pending += node.data.pendingCount || 0
      stats.byProcessType[SalesProcessType.BULK].errors += node.data.errorCount || 0
    }
  })

  return stats
}

/**
 * 创建新的销售节点
 */
export function createSalesNode(
  id: string,
  label: string,
  position: { x: number; y: number },
  options: {
    type?: string
    pendingCount?: number
    errorCount?: number
    style?: Record<string, any>
  } = {}
): SalesNode {
  return {
    id,
    type: options.type || "custom",
    position,
    data: {
      label,
      pendingCount: options.pendingCount,
      errorCount: options.errorCount,
    },
    style: options.style,
  }
}

/**
 * 创建新的销售边
 */
export function createSalesEdge(
  id: string,
  source: string,
  target: string,
  options: {
    animated?: boolean
    style?: Record<string, any>
  } = {}
): SalesEdge {
  return {
    id,
    source,
    target,
    animated: options.animated ?? true,
    style: options.style,
  }
}
