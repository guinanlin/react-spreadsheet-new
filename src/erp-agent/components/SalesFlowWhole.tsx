"use client"

/**
 * 销售智能体工作流页面
 */

import { WorkflowCanvas } from "./workflow/workflow-canvas"
import { ReactFlowProvider } from "@xyflow/react"
import type { Node, Edge } from "@xyflow/react"
import { Toaster } from "@/components/ui/sonner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { 
  SALES_FLOW_NODES, 
  SALES_FLOW_EDGES, 
  type SalesNode, 
  type SalesEdge,
  getNodeStats 
} from "./SalesFlowWholeFun"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const handleSave = (nodes: Node[], edges: Edge[]) => {
    console.log("保存的节点:", nodes)
    console.log("保存的连接:", edges)
  }

  // 获取统计信息用于显示
  const stats = getNodeStats()

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      <div className="absolute top-4 left-4 z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">概况</TabsTrigger>
            <TabsTrigger value="detail">明细追踪</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ReactFlowProvider>
        <WorkflowCanvas 
          initialNodes={SALES_FLOW_NODES} 
          initialEdges={SALES_FLOW_EDGES} 
          onSave={handleSave} 
        />
      </ReactFlowProvider>

      <Toaster />
    </div>
  )
}
