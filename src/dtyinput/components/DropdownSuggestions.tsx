"use client"
import React, { useRef, useEffect, useState } from 'react'
import { cn } from "../lib/utils"
import { createPortal } from "react-dom"
import { PlusIcon, SearchIcon, Loader2Icon } from "lucide-react"
import type { DropdownSuggestionsProps, SuggestionItem } from "../types"

function DropdownSuggestions({ 
  isOpen, 
  suggestions, 
  onSelect, 
  className, 
  highlightedIndex = -1, 
  isLoading = false, 
  anchorRect, 
  dropdownRef, 
  dropdownWidth, 
  positionAbove = false 
}: DropdownSuggestionsProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const ref = dropdownRef ?? innerRef
  const [style, setStyle] = useState<React.CSSProperties>({})

  // 处理点击事件
  const handleItemClick = (item: SuggestionItem, e: React.MouseEvent) => {
    // 阻止事件冒泡，防止触发外部的点击事件（如document点击事件）
    if (e.button === 0) { // 仅当左键点击时执行选择逻辑
      e.preventDefault()
      e.stopPropagation()

      // 调用onSelect回调
      onSelect(item)
    }
  }

  // 当高亮索引变化时，滚动到对应的项目
  useEffect(() => {
    if (highlightedIndex >= 0 && ref.current) {
      const highlightedElement = ref.current.querySelector(`[data-index="${highlightedIndex}"]`)
      if (highlightedElement) {
        // 获取元素的位置信息
        const elementRect = highlightedElement.getBoundingClientRect()
        const containerRect = ref.current.getBoundingClientRect()

        // 检查元素是否在可视区域内
        if (elementRect.bottom > containerRect.bottom) {
          // 如果元素底部超出容器底部，向下滚动
          ref.current.scrollTop += elementRect.bottom - containerRect.bottom
        } else if (elementRect.top < containerRect.top) {
          // 如果元素顶部超出容器顶部，向上滚动
          ref.current.scrollTop -= containerRect.top - elementRect.top
        }
      }
    }
  }, [highlightedIndex, ref])

  // 计算下拉框样式
  useEffect(() => {
    if (anchorRect && ref.current) {
      const dropdownHeight = ref.current.offsetHeight; // 获取下拉框的实际高度
      setStyle({
        position: "fixed",
        left: anchorRect.left,
        // 根据 positionAbove 属性设置 top
        top: positionAbove ? anchorRect.top - dropdownHeight : anchorRect.bottom,
        width: dropdownWidth !== undefined ? dropdownWidth : anchorRect.width, // 使用自定义宽度，如果提供了的话
        zIndex: 99999, // 增加z-index值，确保显示在最上层
        pointerEvents: "auto", // 确保元素可以接收鼠标事件
      })
    }
  }, [anchorRect, dropdownWidth, positionAbove, suggestions]); // 添加 positionAbove 和 suggestions 作为依赖项，以便在内容变化时重新计算高度

  if (!isOpen || !anchorRect) return null

  const content = (
    <div
      ref={ref}
      tabIndex={-1}
      onMouseDown={(e) => {
        if (e.button === 1 && ref.current) {
          ref.current.focus({ preventScroll: true });
        } else if (e.button === 0) {
          e.preventDefault();
        }
      }}
      className={cn(
        "bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto w-full",
        className,
      )}
      style={style}
    >
      <div className="p-1">
        {isLoading ? (
          <div className="flex items-center justify-center p-4 text-gray-500">
            <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
            <span>正在加载...</span>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">没有找到匹配的结果</div>
        ) : (
          suggestions.map((item, index) => (
            <div
              key={item.id}
              data-index={index}
              className={cn(
                "p-2 hover:bg-gray-100 cursor-pointer rounded transition-colors duration-150",
                item.type === "action" ? "flex items-center text-blue-600 font-medium" : "",
                // 如果当前项是高亮项，添加高亮样式
                index === highlightedIndex ? "bg-gray-100" : "",
              )}
              onClick={(e) => handleItemClick(item, e)}
              onMouseDown={(e) => {
                if (e.button === 0) {
                  e.preventDefault();
                }
              }}
            >
              {/* 多行类型：用于地址等多行内容 */}
              {item.type === "multiline" && Array.isArray(item.content) && (
                <div className="text-gray-700">
                  {item.content.map((line, i) => (
                    <div key={i} className="text-sm">
                      {line}
                    </div>
                  ))}
                </div>
              )}

              {/* 加粗类型：用于需要强调的内容 */}
              {item.type === "bold" && <div className="font-semibold">{item.content}</div>}

              {/* 普通类型：用于一般内容 */}
              {item.type === "normal" && <div className="text-gray-800 text-sm">{item.content}</div>}

              {/* 操作类型：带图标的操作按钮 */}
              {item.type === "action" && (
                <>
                  {item.icon === "plus" && <PlusIcon className="w-4 h-4 mr-2" />}
                  {item.icon === "search" && <SearchIcon className="w-4 h-4 mr-2" />}
                  <span>{item.content}</span>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )

  return createPortal(content, document.body) as React.ReactPortal;
}

export { DropdownSuggestions }
export type { SuggestionItem }

