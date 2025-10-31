/**
 * 工作流服务层
 * 定义与工作流相关的数据类型和服务函数
 */

import type { Node, Edge } from "@xyflow/react"

// 工作流数据类型
export interface Workflow {
  id: string
  name: string
  description?: string
  nodes: Node[]
  edges: Edge[]
  createdAt: Date
  updatedAt: Date
}

// 节点数据类型
export interface NodeData {
  label: string
  type?: "start" | "process" | "decision" | "end"
  description?: string
}

/**
 * 获取工作流列表
 */
export async function getWorkflows(): Promise<Workflow[]> {
  // 模拟 API 调用
  return [
    {
      id: "1",
      name: "订单审批流程",
      description: "销售订单的审批流程",
      nodes: [],
      edges: [],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "客户入驻流程",
      description: "新客户入驻的标准流程",
      nodes: [],
      edges: [],
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-20"),
    },
  ]
}

/**
 * 获取单个工作流详情
 */
export async function getWorkflow(id: string): Promise<Workflow> {
  // 模拟 API 调用
  return {
    id,
    name: "订单审批流程",
    description: "销售订单的审批流程",
    nodes: [
      {
        id: "1",
        type: "input",
        data: { label: "开始", type: "start" },
        position: { x: 250, y: 0 },
      },
      {
        id: "2",
        type: "default",
        data: { label: "提交订单", type: "process" },
        position: { x: 250, y: 100 },
      },
      {
        id: "3",
        type: "default",
        data: { label: "经理审批", type: "decision" },
        position: { x: 250, y: 200 },
      },
      {
        id: "4",
        type: "default",
        data: { label: "财务审核", type: "process" },
        position: { x: 100, y: 300 },
      },
      {
        id: "5",
        type: "output",
        data: { label: "完成", type: "end" },
        position: { x: 250, y: 400 },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4", label: "通过" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e3-5", source: "3", target: "5", label: "拒绝" },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  }
}

/**
 * 创建新的工作流
 */
export async function createWorkflow(
  workflowData: Omit<Workflow, "id" | "createdAt" | "updatedAt">,
): Promise<Workflow> {
  // 模拟 API 调用
  return {
    ...workflowData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * 更新工作流
 */
export async function updateWorkflow(id: string, workflowData: Partial<Workflow>): Promise<Workflow> {
  // 模拟 API 调用
  const existing = await getWorkflow(id)
  return {
    ...existing,
    ...workflowData,
    updatedAt: new Date(),
  }
}

/**
 * 删除工作流
 */
export async function deleteWorkflow(id: string): Promise<void> {
  // 模拟 API 调用
  console.log(`删除工作流: ${id}`)
}
