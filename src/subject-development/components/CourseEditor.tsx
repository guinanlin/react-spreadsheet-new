"use client"

import React, { useState } from 'react'
import { cn } from "../lib/utils"
import type { CourseEditorProps, Course } from "../types"

/**
 * CourseEditor - 课程编辑器组件
 * 
 * @example
 * ```tsx
 * <CourseEditor 
 *   course={myCourse} 
 *   onChange={(course) => console.log(course)} 
 * />
 * ```
 */
export function CourseEditor({
  course,
  onChange,
  onSave,
  readonly = false,
  debug = false,
  className,
  ...props
}: CourseEditorProps) {
  const [localCourse, setLocalCourse] = useState<Course | undefined>(course)
  const [isSaving, setIsSaving] = useState(false)

  // 调试日志
  if (debug) {
    console.log('[CourseEditor] render:', { course: localCourse, readonly })
  }

  const handleFieldChange = (field: keyof Course, value: any) => {
    if (readonly) return

    const updated = {
      ...localCourse!,
      [field]: value,
      updatedAt: new Date(),
    }
    setLocalCourse(updated)
    onChange?.(updated)
  }

  const handleSave = async () => {
    if (!localCourse || !onSave) return

    setIsSaving(true)
    try {
      await onSave(localCourse)
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!localCourse) {
    return (
      <div className={cn("p-8 text-center text-gray-500", className)} {...props}>
        暂无课程数据
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "space-y-6 p-6 bg-white rounded-lg border",
        readonly && "opacity-75",
        className
      )}
      {...props}
    >
      {/* 标题 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          课程标题 *
        </label>
        <input
          type="text"
          value={localCourse.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          disabled={readonly}
          className={cn(
            "w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500",
            readonly && "bg-gray-50 cursor-not-allowed"
          )}
          placeholder="请输入课程标题"
        />
      </div>

      {/* 描述 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          课程描述
        </label>
        <textarea
          value={localCourse.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          disabled={readonly}
          rows={4}
          className={cn(
            "w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 resize-none",
            readonly && "bg-gray-50 cursor-not-allowed"
          )}
          placeholder="请输入课程描述"
        />
      </div>

      {/* 分类 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          课程分类
        </label>
        <input
          type="text"
          value={localCourse.category}
          onChange={(e) => handleFieldChange('category', e.target.value)}
          disabled={readonly}
          className={cn(
            "w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500",
            readonly && "bg-gray-50 cursor-not-allowed"
          )}
          placeholder="例如：编程、设计、营销"
        />
      </div>

      {/* 状态 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          课程状态
        </label>
        <select
          value={localCourse.status}
          onChange={(e) => handleFieldChange('status', e.target.value)}
          disabled={readonly}
          className={cn(
            "w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500",
            readonly && "bg-gray-50 cursor-not-allowed"
          )}
        >
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
          <option value="archived">已归档</option>
        </select>
      </div>

      {/* 保存按钮 */}
      {!readonly && onSave && (
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
              isSaving && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSaving ? '保存中...' : '保存课程'}
          </button>
        </div>
      )}
    </div>
  )
}

