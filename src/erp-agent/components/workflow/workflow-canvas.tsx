"use client"

/**
 * 工作流画布组件
 * 使用 React Flow 实现可视化流程图编辑器
 */

import { useCallback, useMemo } from "react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  Panel,
  ControlButton,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { RotateCcw } from "lucide-react"
import { CustomNode } from "./custom-node"

interface WorkflowCanvasProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onSave?: (nodes: Node[], edges: Edge[]) => void
  readOnly?: boolean
}

export function WorkflowCanvas({
  initialNodes = [],
  initialEdges = [],
  onSave,
  readOnly = false,
}: WorkflowCanvasProps) {
  const savedInitialNodes = useMemo(() => initialNodes, [])
  const savedInitialEdges = useMemo(() => initialEdges, [])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { toast } = useToast()
  const { fitView } = useReactFlow()

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), [])

  // 连接节点
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges],
  )

  const handleResetLayout = useCallback(() => {
    setNodes(savedInitialNodes)
    setEdges(savedInitialEdges)
    setTimeout(() => {
      fitView({ duration: 300 })
    }, 0)
    toast({
      title: "布局已重置",
      description: "流程图已恢复到初始布局",
    })
  }, [savedInitialNodes, savedInitialEdges, setNodes, setEdges, fitView, toast])

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
      >
        <Controls>
          <ControlButton onClick={handleResetLayout} title="重置布局">
            <RotateCcw className="h-4 w-4" />
          </ControlButton>
        </Controls>
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

        {!readOnly && (
          <Panel position="top-right" className="flex gap-2">
            <Button size="sm" variant="outline">
              待完成
            </Button>
            <Button size="sm" variant="outline">
              已完成
            </Button>
            <Button size="sm" variant="outline">
              异常
            </Button>
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}
