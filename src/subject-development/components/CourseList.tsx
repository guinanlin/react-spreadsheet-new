"use client"

import React from 'react'
import { cn, getCourseStatusText } from "../lib/utils"
import type { CourseListProps } from "../types"

/**
 * CourseList - 课程列表组件
 * 
 * @example
 * ```tsx
 * <CourseList 
 *   courses={myCourses} 
 *   onSelect={(course) => console.log(course)} 
 * />
 * ```
 */
export function CourseList({
  courses,
  selectedId,
  onSelect,
  onDelete,
  loading = false,
  emptyText = '暂无课程',
  className,
  ...props
}: CourseListProps) {
  if (loading) {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-100 animate-pulse rounded-lg"
          />
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center p-12 text-center text-gray-500 border-2 border-dashed rounded-lg",
          className
        )}
        {...props}
      >
        <div>
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-lg font-medium">{emptyText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {courses.map((course) => {
        const isSelected = selectedId === course.id

        return (
          <div
            key={course.id}
            className={cn(
              "p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md",
              isSelected && "border-blue-500 bg-blue-50 shadow-md"
            )}
            onClick={() => onSelect?.(course)}
          >
            <div className="flex items-start justify-between">
              {/* 左侧内容 */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.title}
                  </h3>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      course.status === 'published' && "bg-green-100 text-green-800",
                      course.status === 'draft' && "bg-gray-100 text-gray-800",
                      course.status === 'archived' && "bg-red-100 text-red-800"
                    )}
                  >
                    {getCourseStatusText(course.status)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {course.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {new Date(course.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* 右侧操作按钮 */}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm(`确定要删除课程"${course.title}"吗？`)) {
                      onDelete(course.id)
                    }
                  }}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="删除课程"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

