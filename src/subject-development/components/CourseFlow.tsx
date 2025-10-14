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
import { cn } from '../lib/utils'
import type { CourseFlowProps, FlowNodeData } from '../types'
import { PlaceholderNode } from './PlaceholderNode'

/**
 * 自定义主节点样式组件
 */
const MainNode = ({ data }: { data: FlowNodeData }) => {
  const statusColors = {
    pending: 'bg-gray-100 border-gray-300',
    'in-progress': 'bg-blue-100 border-blue-400',
    completed: 'bg-green-100 border-green-400',
    blocked: 'bg-red-100 border-red-400',
  }

  return (
    <div
      className={cn(
        'px-6 py-4 rounded-lg border-2 shadow-lg min-w-[200px] relative',
        statusColors[data.status || 'pending']
      )}
    >
      {/* 上方连接点 */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
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
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
      />
    </div>
  )
}

/**
 * 自定义子节点样式组件
 */
const SubNode = ({ data }: { data: FlowNodeData }) => {
  const statusColors = {
    pending: 'bg-white border-gray-200',
    'in-progress': 'bg-blue-50 border-blue-300',
    completed: 'bg-green-50 border-green-300',
    blocked: 'bg-red-50 border-red-300',
  }

  return (
    <div
      className={cn(
        'px-4 py-2 rounded-md border shadow-sm min-w-[160px] relative',
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
      
      {/* 下方连接点 */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 !bg-gray-500 !border-2 !border-white"
      />
    </div>
  )
}

// 定义默认的课程开发流程节点
const defaultNodes: Node<FlowNodeData>[] = [
  // 顶层节点：课程开发
  {
    id: 'root',
    type: 'mainNode',
    data: { 
      label: '课程开发',
      type: 'main',
      status: 'in-progress',
      description: '整体课程开发流程'
    },
    position: { x: 500, y: 50 },
  },

  // ========== 第一阶段：学习目标设定 ==========
  {
    id: 'stage-1',
    type: 'mainNode',
    data: { 
      label: '学习目标设定',
      type: 'main',
      status: 'pending',
      description: '课程设计的起点'
    },
    position: { x: 150, y: 220 },
  },
  {
    id: '1-1',
    type: 'subNode',
    data: { label: '目标群体分析', type: 'sub', status: 'pending' },
    position: { x: 50, y: 370 },
  },
  {
    id: '1-2',
    type: 'subNode',
    data: { label: '学习成果设定', type: 'sub', status: 'pending' },
    position: { x: 150, y: 370 },
  },
  {
    id: '1-3',
    type: 'subNode',
    data: { label: '评估标准定义', type: 'sub', status: 'pending' },
    position: { x: 250, y: 370 },
  },

  // ========== 第二阶段：课程内容规划 ==========
  {
    id: 'stage-2',
    type: 'mainNode',
    data: { 
      label: '课程内容规划',
      type: 'main',
      status: 'pending',
      description: '规划课程模块与结构'
    },
    position: { x: 450, y: 220 },
  },
  {
    id: '2-1',
    type: 'subNode',
    data: { label: '课程模块设计', type: 'sub', status: 'pending' },
    position: { x: 350, y: 370 },
  },
  {
    id: '2-2',
    type: 'subNode',
    data: { label: '教学方法选择', type: 'sub', status: 'pending' },
    position: { x: 450, y: 370 },
  },
  {
    id: '2-3',
    type: 'subNode',
    data: { label: '教学时间安排', type: 'sub', status: 'pending' },
    position: { x: 550, y: 370 },
  },

  // ========== 第三阶段：课程教学设计 ==========
  {
    id: 'stage-3',
    type: 'mainNode',
    data: { 
      label: '课程教学设计',
      type: 'main',
      status: 'pending',
      description: '详细的教学活动设计'
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

  // ========== 第四阶段：课程资料制作 ==========
  {
    id: 'stage-4',
    type: 'mainNode',
    data: { 
      label: '课程资料制作',
      type: 'main',
      status: 'pending',
      description: '制作教学材料和资源'
    },
    position: { x: 500, y: 520 },
  },
  {
    id: '4-1',
    type: 'subNode',
    data: { label: '教学PPT制作', type: 'sub', status: 'pending' },
    position: { x: 400, y: 670 },
  },
  {
    id: '4-2',
    type: 'subNode',
    data: { label: '习题与案例设计', type: 'sub', status: 'pending' },
    position: { x: 500, y: 670 },
  },
  {
    id: '4-3',
    type: 'subNode',
    data: { label: '课件录制与编辑', type: 'sub', status: 'pending' },
    position: { x: 600, y: 670 },
  },
]

// 定义默认的边（连接线）
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
]

// 自定义节点类型
const nodeTypes = {
  mainNode: MainNode,
  subNode: SubNode,
  placeholderNode: PlaceholderNode as any,
}

/**
 * CourseFlow - 课程开发流程图组件
 * 
 * 基于 React Flow 实现的可视化课程开发流程管理工具
 * 
 * @example
 * ```tsx
 * <CourseFlow 
 *   editable 
 *   showControls 
 *   showMinimap 
 *   onNodeClick={(node) => console.log(node)} 
 * />
 * ```
 */
export function CourseFlow({
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
}: CourseFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // 确保初始化时更新边
  React.useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])

  // 调试日志
  if (debug) {
    console.log('[CourseFlow] render:', { 
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
          type: 'default',
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
              const data = node.data as unknown as FlowNodeData
              if (data?.type === 'main') return '#3b82f6'
              return '#94a3b8'
            }}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
        )}
      </ReactFlow>

      {/* 图例说明 */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md border">
        <h4 className="text-sm font-semibold mb-2 text-gray-900">节点状态</h4>
        <div className="space-y-1.5 text-xs">
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
      </div>
    </div>
  )
}

