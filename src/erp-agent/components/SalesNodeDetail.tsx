/**
 * ERP Agent 销售智能体组件 - 销售节点详情组件
 */

import React from 'react';
import { cn, formatDateTime, getStatusText, getPriorityColor } from '../lib/utils';
import type { SalesNodeDetailProps, SalesDetailData } from '../types';

/**
 * SalesNodeDetail - 销售节点详情组件
 * 
 * 显示销售节点的详细信息，包括状态、描述、时间等
 * 
 * @example
 * ```tsx
 * <SalesNodeDetail 
 *   data={nodeDetail}
 *   visible={true}
 *   onClose={() => setVisible(false)}
 *   editable={true}
 * />
 * ```
 */
export function SalesNodeDetail({
  data,
  visible = false,
  onClose,
  onSave,
  editable = false,
  className,
  ...props
}: SalesNodeDetailProps) {
  if (!visible || !data) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(data);
    }
  };

  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4',
        className
      )}
      {...props}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {data.label}
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* 内容 */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* 基本信息 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">状态:</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                getStatusText(data.status) === '已完成' && 'bg-green-100 text-green-800',
                getStatusText(data.status) === '进行中' && 'bg-blue-100 text-blue-800',
                getStatusText(data.status) === '待处理' && 'bg-gray-100 text-gray-800',
                getStatusText(data.status) === '被阻塞' && 'bg-red-100 text-red-800'
              )}>
                {getStatusText(data.status)}
              </span>
            </div>

            {data.description && (
              <div>
                <span className="text-sm font-medium text-gray-700">描述:</span>
                <p className="text-sm text-gray-600 mt-1">{data.description}</p>
              </div>
            )}

            {data.assignee && (
              <div>
                <span className="text-sm font-medium text-gray-700">负责人:</span>
                <span className="text-sm text-gray-600 ml-2">{data.assignee}</span>
              </div>
            )}

            {data.priority && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">优先级:</span>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getPriorityColor(data.priority)
                )}>
                  {data.priority === 'high' ? '高' : data.priority === 'medium' ? '中' : '低'}
                </span>
              </div>
            )}
          </div>

          {/* 时间信息 */}
          <div className="space-y-3 pt-3 border-t">
            <h4 className="text-sm font-semibold text-gray-900">时间信息</h4>
            
            {data.createdAt && (
              <div>
                <span className="text-sm font-medium text-gray-700">创建时间:</span>
                <span className="text-sm text-gray-600 ml-2">
                  {formatDateTime(data.createdAt)}
                </span>
              </div>
            )}

            {data.updatedAt && (
              <div>
                <span className="text-sm font-medium text-gray-700">更新时间:</span>
                <span className="text-sm text-gray-600 ml-2">
                  {formatDateTime(data.updatedAt)}
                </span>
              </div>
            )}

            {data.estimatedCompletion && (
              <div>
                <span className="text-sm font-medium text-gray-700">预计完成:</span>
                <span className="text-sm text-gray-600 ml-2">
                  {formatDateTime(data.estimatedCompletion)}
                </span>
              </div>
            )}

            {data.actualCompletion && (
              <div>
                <span className="text-sm font-medium text-gray-700">实际完成:</span>
                <span className="text-sm text-gray-600 ml-2">
                  {formatDateTime(data.actualCompletion)}
                </span>
              </div>
            )}
          </div>

          {/* 附件信息 */}
          {data.attachments && data.attachments.length > 0 && (
            <div className="pt-3 border-t">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">相关文件</h4>
              <div className="space-y-1">
                {data.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 备注信息 */}
          {data.notes && (
            <div className="pt-3 border-t">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">备注</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {data.notes}
              </p>
            </div>
          )}
        </div>

        {/* 底部操作按钮 */}
        {editable && (
          <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              保存
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
