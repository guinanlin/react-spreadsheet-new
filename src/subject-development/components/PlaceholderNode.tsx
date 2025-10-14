"use client"

import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { cn } from '../lib/utils'
import type { FlowNodeData } from '../types'

/**
 * PlaceholderNode - 占位符节点
 * 用于表示可以添加新任务的位置
 */
export const PlaceholderNode = ({ data }: { data: FlowNodeData }) => {
  return (
    <div
      className={cn(
        'w-40 h-20 rounded-lg border-2 border-dashed border-gray-300',
        'bg-white hover:bg-gray-50 hover:border-blue-400',
        'flex items-center justify-center cursor-pointer',
        'transition-all duration-200'
      )}
    >
      {/* 上方连接点 */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />
      
      {/* 内容区域 */}
      <div className="text-center">
        <div className="text-gray-400 text-2xl font-light hover:text-blue-500 transition-colors mb-1">
          +
        </div>
        {data.label && (
          <div className="text-xs text-gray-500">
            {data.label}
          </div>
        )}
      </div>
      
      {/* 下方连接点 */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />
    </div>
  )
}
