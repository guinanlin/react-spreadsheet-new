"use client"

import React, { useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ConnectionLineType,
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { cn, getStatusColor, getBusinessTypeColor } from '../lib/utils'
import type { SalesFlowProps, SalesNodeData, SalesNodeType } from '../types'

/**
 * 根节点组件（销售）
 */
const RootNode = ({ data }: { data: SalesNodeData }) => {
  const statusColors = {
    pending: 'bg-gray-100 border-gray-300',
    'in-progress': 'bg-blue-100 border-blue-400',
    completed: 'bg-green-100 border-green-400',
    blocked: 'bg-red-100 border-red-400',
  }

  return (
    <div
      className={cn(
        'px-8 py-6 rounded-xl border-3 shadow-xl min-w-[240px] relative',
        statusColors[data.status || 'pending']
      )}
    >
      {/* 上方连接点 */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 !bg-blue-600 !border-3 !border-white"
      />
      
      <div className="font-bold text-xl text-gray-900 text-center">
        {data.label}
      </div>
      {data.description && (
        <div className="text-sm text-gray-600 mt-2 text-center">
          {data.description}
        </div>
      )}
      
      {/* 下方连接点 */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 !bg-blue-600 !border-3 !border-white"
      />
    </div>
  )
}

/**
 * 业务板块节点组件（样衣销售/大货销售）
 */
const BusinessNode = ({ data }: { data: SalesNodeData }) => {
  const baseColors = getBusinessTypeColor(data.businessType || 'sample')
  const statusColors = {
    pending: 'bg-gray-100 border-gray-300',
    'in-progress': 'bg-blue-100 border-blue-400',
    completed: 'bg-green-100 border-green-400',
    blocked: 'bg-red-100 border-red-400',
  }

  return (
    <div
      className={cn(
        'px-6 py-4 rounded-lg border-2 shadow-lg min-w-[180px] relative',
        data.status ? statusColors[data.status] : baseColors
      )}
    >
      {/* 上方连接点 */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
      />
      
      <div className="font-bold text-lg text-gray-900 text-center">
        {data.label}
      </div>
      {data.description && (
        <div className="text-xs text-gray-600 mt-1 text-center">
          {data.description}
        </div>
      )}
      
      {/* 下方连接点 */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
      />
    </div>
  )
}

/**
 * 流程节点组件（合同/生产/跟踪）
 */
const ProcessNode = ({ data }: { data: SalesNodeData }) => {
  const statusColors = {
    pending: 'bg-white border-gray-200',
    'in-progress': 'bg-blue-50 border-blue-300',
    completed: 'bg-green-50 border-green-300',
    blocked: 'bg-red-50 border-red-300',
  }

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-md border shadow-sm min-w-[140px] relative',
        statusColors[data.status || 'pending']
      )}
    >
      {/* 上方连接点 */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 !bg-gray-500 !border-2 !border-white"
      />
      
      <div className="text-sm font-medium text-gray-800 text-center">
        {data.label}
      </div>
      {data.description && (
        <div className="text-xs text-gray-500 mt-1 text-center">
          {data.description}
        </div>
      )}
      
      {/* 下方连接点 */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 !bg-gray-500 !border-2 !border-white"
      />
    </div>
  )
}

/**
 * 流程组节点组件 - 用于将流程节点组织在一个框内
 */
const ProcessGroupNode = ({ data }: { data: SalesNodeData & { processNodes: string[] } }) => {
  return (
    <div className="relative">
      {/* 流程框背景 */}
      <div 
        className="absolute inset-0 rounded-lg border-2 border-dashed opacity-30 min-w-[200px] min-h-[250px]"
        style={{ 
          borderColor: data.businessType === 'sample' ? '#8b5cf6' : '#f97316',
          backgroundColor: `${data.businessType === 'sample' ? '#8b5cf6' : '#f97316'}08`
        }}
      />
      
      {/* 流程标题 */}
      <div 
        className="absolute -top-3 left-4 px-2 py-1 text-xs font-medium rounded-md text-white"
        style={{ 
          backgroundColor: data.businessType === 'sample' ? '#8b5cf6' : '#f97316'
        }}
      >
        {data.label}流程
      </div>
      
      {/* 流程节点内容区域 */}
      <div className="relative z-10 p-4 pt-6">
        <div className="text-sm text-gray-600 text-center">
          流程节点将在此区域显示
        </div>
      </div>
    </div>
  )
}

// 定义默认的销售工作流节点
const defaultNodes: Node<SalesNodeData>[] = [
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

  // ========== 样衣销售流程组 ==========
  {
    id: 'sample-process-group',
    type: 'processGroupNode',
    data: {
      label: '样衣销售',
      type: 'processGroup',
      businessType: 'sample',
      status: 'in-progress',
      description: '样衣销售流程组',
      processNodes: ['sample-contract', 'sample-production', 'sample-tracking']
    },
    position: { x: 250, y: 200 },
  },
  {
    id: 'sample-contract',
    type: 'processNode',
    data: { label: '签订销售合同', type: 'process', status: 'completed', description: '与客户签订样衣销售合同' },
    position: { x: 280, y: 280 },
  },
  {
    id: 'sample-production',
    type: 'processNode',
    data: { label: '安排生产', type: 'process', status: 'in-progress', description: '安排样衣生产计划' },
    position: { x: 280, y: 350 },
  },
  {
    id: 'sample-tracking',
    type: 'processNode',
    data: { label: '跟踪进度', type: 'process', status: 'pending', description: '跟踪样衣生产进度' },
    position: { x: 280, y: 420 },
  },

  // ========== 大货销售流程组 ==========
  {
    id: 'bulk-process-group',
    type: 'processGroupNode',
    data: {
      label: '大货销售',
      type: 'processGroup',
      businessType: 'bulk',
      status: 'pending',
      description: '大货销售流程组',
      processNodes: ['bulk-contract', 'bulk-production', 'bulk-tracking']
    },
    position: { x: 750, y: 200 },
  },
  {
    id: 'bulk-contract',
    type: 'processNode',
    data: { label: '签订销售合同', type: 'process', status: 'pending', description: '与客户签订大货销售合同' },
    position: { x: 780, y: 280 },
  },
  {
    id: 'bulk-production',
    type: 'processNode',
    data: { label: '安排生产', type: 'process', status: 'pending', description: '安排大货生产计划' },
    position: { x: 780, y: 350 },
  },
  {
    id: 'bulk-tracking',
    type: 'processNode',
    data: { label: '跟踪进度', type: 'process', status: 'pending', description: '跟踪大货生产进度' },
    position: { x: 780, y: 420 },
  },
]

// 定义默认的边（连接线）
const defaultEdges: Edge[] = [
  // 销售（root）-> 流程组
  { 
    id: 'e-root-sample', 
    source: 'root', 
    target: 'sample-process-group', 
    animated: true, 
    type: 'smoothstep',
    style: { stroke: '#8b5cf6', strokeWidth: 2 }
  },
  { 
    id: 'e-root-bulk', 
    source: 'root', 
    target: 'bulk-process-group', 
    animated: true, 
    type: 'smoothstep',
    style: { stroke: '#f97316', strokeWidth: 2 }
  },

  // 样衣销售流程链条：流程组 -> 签订合同 -> 安排生产 -> 跟踪进度
  { 
    id: 'e-sample-contract', 
    source: 'sample-process-group', 
    target: 'sample-contract', 
    type: 'smoothstep',
    style: { stroke: '#8b5cf6', strokeWidth: 2 }
  },
  { 
    id: 'e-sample-contract-production', 
    source: 'sample-contract', 
    target: 'sample-production', 
    type: 'smoothstep',
    style: { stroke: '#8b5cf6', strokeWidth: 2 }
  },
  { 
    id: 'e-sample-production-tracking', 
    source: 'sample-production', 
    target: 'sample-tracking', 
    type: 'smoothstep',
    style: { stroke: '#8b5cf6', strokeWidth: 2 }
  },

  // 大货销售流程链条：流程组 -> 签订合同 -> 安排生产 -> 跟踪进度
  { 
    id: 'e-bulk-contract', 
    source: 'bulk-process-group', 
    target: 'bulk-contract', 
    type: 'smoothstep',
    style: { stroke: '#f97316', strokeWidth: 2 }
  },
  { 
    id: 'e-bulk-contract-production', 
    source: 'bulk-contract', 
    target: 'bulk-production', 
    type: 'smoothstep',
    style: { stroke: '#f97316', strokeWidth: 2 }
  },
  { 
    id: 'e-bulk-production-tracking', 
    source: 'bulk-production', 
    target: 'bulk-tracking', 
    type: 'smoothstep',
    style: { stroke: '#f97316', strokeWidth: 2 }
  },
]

// 自定义节点类型
const nodeTypes = {
  rootNode: RootNode,
  businessNode: BusinessNode,
  processNode: ProcessNode,
  processGroupNode: ProcessGroupNode,
}

/**
 * SalesFlow - 销售工作流组件
 * 
 * 基于 ReactFlow 实现的服装销售流程可视化工具
 * 支持样衣销售和大货销售两个业务板块
 * 
 * @example
 * ```tsx
 * <SalesFlow 
 *   editable 
 *   showControls 
 *   showMinimap 
 *   onNodeClick={(node) => console.log(node)} 
 * />
 * ```
 */
export function SalesFlow({
  initialNodes = defaultNodes,
  initialEdges = defaultEdges,
  editable = false,
  onNodesChange: onNodesChangeProp,
  onEdgesChange: onEdgesChangeProp,
  onNodeClick,
  onNodeDoubleClick,
  height = 800,
  showControls = true,
  showMinimap = true,
  debug = false,
  className,
  ...props
}: SalesFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // 确保初始化时更新边
  React.useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])

  // 调试日志
  if (debug) {
    console.log('[SalesFlow] render:', { 
      nodes: nodes.length, 
      edges: edges.length,
      edgesList: edges.map(e => `${e.source}->${e.target}`)
    })
  }

  // 连接节点
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      if (!editable) return
      setEdges((eds) => addEdge(params, eds))
    },
    [editable, setEdges]
  )

  // 节点变化处理
  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes)
      if (onNodesChangeProp) {
        onNodesChangeProp(nodes)
      }
    },
    [nodes, onNodesChange, onNodesChangeProp]
  )

  // 边变化处理
  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes)
      if (onEdgesChangeProp) {
        onEdgesChangeProp(edges)
      }
    },
    [edges, onEdgesChange, onEdgesChangeProp]
  )

  return (
    <div 
      className={cn('border rounded-lg bg-gray-50 overflow-hidden relative', className)}
      style={{ height }}
      {...props}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onNodeClick?.(node)}
        onNodeDoubleClick={(_, node) => onNodeDoubleClick?.(node)}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        // 确保边可以交互和选择
        elementsSelectable={true}
        // 设置默认边选项
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#94a3b8', strokeWidth: 2 },
          animated: false,
        }}
        // 连接线样式
        connectionLineStyle={{ stroke: '#94a3b8', strokeWidth: 2 }}
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        {/* 背景网格 */}
        <Background color="#aaa" gap={16} />

        {/* 控制按钮（缩放、适应视图等） */}
        {showControls && <Controls />}

        {/* 小地图 */}
        {showMinimap && (
          <MiniMap
            nodeColor={(node) => {
              const data = node.data as unknown as SalesNodeData
              if (data?.type === 'root') return '#3b82f6'
              if (data?.type === 'business') {
                return data.businessType === 'sample' ? '#8b5cf6' : '#f97316'
              }
              return '#94a3b8'
            }}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
        )}
      </ReactFlow>

      {/* 图例说明 */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md border">
        <h4 className="text-sm font-semibold mb-3 text-gray-900">节点状态</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300" />
            <span>待处理</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-400" />
            <span>进行中</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-400" />
            <span>已完成</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-400" />
            <span>被阻塞</span>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <h5 className="text-xs font-semibold mb-2 text-gray-900">业务板块</h5>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-100 border border-purple-400" />
              <span>样衣销售</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-100 border border-orange-400" />
              <span>大货销售</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
