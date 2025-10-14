"use client"

import React, { useState } from 'react'
import { cn, formatDuration } from "../lib/utils"
import type { CourseOutlineProps } from "../types"

/**
 * CourseOutline - 课程大纲组件
 * 
 * @example
 * ```tsx
 * <CourseOutline 
 *   chapters={myChapters} 
 *   onChange={(chapters) => console.log(chapters)} 
 *   editable 
 * />
 * ```
 */
export function CourseOutline({
  chapters,
  onChange,
  draggable = false,
  editable = false,
  expandedIds: controlledExpandedIds,
  onToggleExpand,
  className,
  ...props
}: CourseOutlineProps) {
  // 内部管理展开状态（如果没有外部控制）
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(
    controlledExpandedIds || chapters.map(ch => ch.id)
  )

  const expandedIds = controlledExpandedIds || internalExpandedIds

  const toggleExpand = (chapterId: string) => {
    if (onToggleExpand) {
      onToggleExpand(chapterId)
    } else {
      setInternalExpandedIds(prev =>
        prev.includes(chapterId)
          ? prev.filter(id => id !== chapterId)
          : [...prev, chapterId]
      )
    }
  }

  if (chapters.length === 0) {
    return (
      <div 
        className={cn(
          "p-8 text-center text-gray-500 border-2 border-dashed rounded-lg",
          className
        )}
        {...props}
      >
        <p>暂无课程大纲，点击添加章节开始创建</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)} {...props}>
      {chapters.map((chapter, chapterIndex) => {
        const isExpanded = expandedIds.includes(chapter.id)
        const totalLessons = chapter.lessons.length
        const totalDuration = chapter.lessons.reduce(
          (sum, lesson) => sum + (lesson.duration || 0),
          0
        )

        return (
          <div
            key={chapter.id}
            className="border rounded-lg overflow-hidden bg-white"
          >
            {/* 章节标题 */}
            <div
              className={cn(
                "flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors",
                isExpanded && "bg-gray-100"
              )}
              onClick={() => toggleExpand(chapter.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                {/* 展开/收起图标 */}
                <svg
                  className={cn(
                    "w-5 h-5 text-gray-500 transition-transform",
                    isExpanded && "rotate-90"
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>

                {/* 章节编号和标题 */}
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    第 {chapterIndex + 1} 章：{chapter.title}
                  </h3>
                  {chapter.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {chapter.description}
                    </p>
                  )}
                </div>

                {/* 章节统计 */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{totalLessons} 节课</span>
                  {totalDuration > 0 && (
                    <span>{formatDuration(totalDuration)}</span>
                  )}
                </div>

                {/* 编辑按钮 */}
                {editable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('编辑章节:', chapter.id)
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* 小节列表 */}
            {isExpanded && (
              <div className="divide-y">
                {chapter.lessons.map((lesson, lessonIndex) => {
                  const lessonTypeIcon = {
                    video: '🎥',
                    text: '📝',
                    quiz: '❓',
                    assignment: '📋',
                    practice: '💻',
                  }[lesson.type]

                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* 小节编号 */}
                      <span className="flex-shrink-0 w-8 text-sm text-gray-500 text-center">
                        {chapterIndex + 1}.{lessonIndex + 1}
                      </span>

                      {/* 小节类型图标 */}
                      <span className="text-xl">{lessonTypeIcon}</span>

                      {/* 小节标题 */}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {lesson.title}
                        </h4>
                      </div>

                      {/* 时长 */}
                      {lesson.duration && (
                        <span className="text-sm text-gray-500">
                          {formatDuration(lesson.duration)}
                        </span>
                      )}

                      {/* 资源数量 */}
                      {lesson.resources && lesson.resources.length > 0 && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {lesson.resources.length}
                        </span>
                      )}

                      {/* 编辑按钮 */}
                      {editable && (
                        <button
                          onClick={() => console.log('编辑小节:', lesson.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )
                })}

                {/* 添加小节按钮 */}
                {editable && (
                  <div className="p-4">
                    <button
                      onClick={() => console.log('添加小节到章节:', chapter.id)}
                      className="w-full py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      + 添加小节
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* 添加章节按钮 */}
      {editable && (
        <button
          onClick={() => console.log('添加新章节')}
          className="w-full py-3 text-sm text-gray-600 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          + 添加章节
        </button>
      )}
    </div>
  )
}

