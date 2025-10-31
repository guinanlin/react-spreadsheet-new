/**
 * 自定义节点组件
 * 在节点底部显示待完成和异常数量
 */

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"

interface CustomNodeData {
  label: string
  pendingCount?: number
  errorCount?: number
}

// 类型守卫函数，用于安全地检查数据类型
function isCustomNodeData(data: unknown): data is CustomNodeData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'label' in data &&
    typeof (data as any).label === 'string'
  )
}

export const CustomNode = memo((props: NodeProps) => {
  const { data } = props
  
  // 使用类型守卫进行安全检查
  if (!isCustomNodeData(data)) {
    console.warn('CustomNode: Invalid data type', data)
    return null
  }
  
  const { label, pendingCount, errorCount } = data

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-background border border-border">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-center">{label}</div>

        {(pendingCount !== undefined || errorCount !== undefined) && (
          <div className="flex gap-3 text-xs text-muted-foreground pt-1 border-t">
            {pendingCount !== undefined && <span>待完成 {pendingCount}</span>}
            {errorCount !== undefined && <span className="text-amber-700">异常 {errorCount}</span>}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  )
})

CustomNode.displayName = "CustomNode"
