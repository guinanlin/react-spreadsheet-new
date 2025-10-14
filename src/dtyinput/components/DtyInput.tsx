"use client"

import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { DropdownSuggestions } from "./DropdownSuggestions"
import { XCircleIcon } from "lucide-react"
import { useDebounce } from "../hooks/use-debounce"
import type { DtyInputProps, SuggestionItem, CustomChangeEvent } from "../types"

// 辅助函数：检查字符串是否为空
const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === "string") return value.trim() === ""
  if (typeof value === "number") return false
  return true
}

// 辅助函数：将任何值转换为字符串
const toString = (value: any): string => {
  if (value === null || value === undefined) return ""
  return String(value)
}

const DtyInput = forwardRef<HTMLInputElement, DtyInputProps>(
  (
    {
      className,
      width = 250,
      showSuggestions = false,
      suggestions = [],
      maxNormalSuggestions = 8,
      onSuggestionSelect,
      onFocus,
      onBlur,
      onChange,
      onDoubleClick,
      value,
      defaultValue = "",
      debug = false, // 默认关闭调试
      fetchFromServer = false, // 默认不从服务器获取
      fetchSuggestions, // 从服务器获取建议的函数
      debounceTime = 300, // 默认防抖时间
      dropdownWidth, // 新增属性，用于自定义下拉框宽度
      positionAbove = false, // 默认值设置为 false，即显示在下方
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null)

    // 暴露方法
    useImperativeHandle(ref, () => ({
      ...internalRef.current!,
    }))

    // 调试日志函数
    const log = (message: string, ...args: any[]) => {
      if (debug) {
        console.log(`[DtyInput] ${message}`, ...args)
      }
    }

    // 验证fetchFromServer和fetchSuggestions的一致性
    useEffect(() => {
      if (fetchFromServer && !fetchSuggestions) {
        console.warn(
          "[DtyInput] fetchFromServer为true，但未提供fetchSuggestions函数。请提供fetchSuggestions函数以启用从服务器获取建议的功能。",
        )
      }
    }, [fetchFromServer, fetchSuggestions])

    // 记录初始props
    const initialRender = useRef(true)
    useEffect(() => {
      if (initialRender.current) {
        log("初始化props", { value, defaultValue, hasValue: value !== undefined })
        initialRender.current = false
      }
    }, [value, defaultValue, debug])

    // 确定组件是受控还是非受控 - 只在组件挂载时确定一次
    const isControlledRef = useRef(value !== undefined)
    const [inputValue, setInputValue] = useState<string>(toString(value || defaultValue))

    // 防抖后的输入值，用于触发API请求
    const debouncedInputValue = useDebounce(inputValue, debounceTime)

    const [isFocused, setIsFocused] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1) // 当前高亮的项目索引
    const [shouldShowDropdown, setShouldShowDropdown] = useState(false) // 是否显示下拉框
    const [isLoading, setIsLoading] = useState(false) // 加载状态
    const [serverSuggestions, setServerSuggestions] = useState<SuggestionItem[]>([]) // 从服务器获取的建议

    const containerRef = useRef<HTMLDivElement>(null)

    // 新增：用于存储 input 的位置信息
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)

    const dropdownRef = useRef<HTMLDivElement>(null)

    // 展示下拉框时，记录 input 的位置
    const handleShowDropdown = () => {
      if (internalRef.current) {
        setAnchorRect(internalRef.current.getBoundingClientRect())
      }
      setShouldShowDropdown(true)
    }

    // 当外部value变化时更新内部状态（仅在受控模式下）
    useEffect(() => {
      if (isControlledRef.current) {
        log("外部value变化（受控模式）", { value, oldValue: inputValue })
        setInputValue(toString(value || ""))
      }
    }, [value, inputValue, debug])

    // 从服务器获取建议数据
    const fetchSuggestionsFromServer = useCallback(
      async (query: string) => {
        if (!fetchFromServer || !fetchSuggestions) return

        try {
          setIsLoading(true)
          log("从服务器获取建议", { query })

          const data = await fetchSuggestions(query)

          log("获取到建议数据", { count: data.length })
          setServerSuggestions(data)
        } catch (error) {
          log("获取建议数据失败", { error })
          setServerSuggestions([])
        } finally {
          setIsLoading(false)
        }
      },
      [fetchFromServer, fetchSuggestions, debug],
    )

    // 当防抖后的输入值变化时，从服务器获取建议
    useEffect(() => {
      if (fetchFromServer && fetchSuggestions && shouldShowDropdown) {
        fetchSuggestionsFromServer(debouncedInputValue)
      }
    }, [debouncedInputValue, fetchFromServer, fetchSuggestions, shouldShowDropdown, fetchSuggestionsFromServer])

    // 合并外部ref和内部ref
    const handleRef = (element: HTMLInputElement | null) => {
      if (!element) return;
      
      // 设置内部 ref
      internalRef.current = element;
    };

    // 处理宽度，可以是数字（自动添加px）或字符串（直接使用）
    const widthStyle = { width: typeof width === "number" ? `${width}px` : width }

    // 默认的建议数据（如果没有传入）
    const defaultSuggestions: SuggestionItem[] = []

    // 处理建议数据，确保action类型的项目始终显示
    const processedSuggestions = (() => {
      // 确定使用哪个建议数据源
      const allSuggestions = fetchFromServer
        ? serverSuggestions
        : suggestions.length > 0
          ? suggestions
          : defaultSuggestions

      // 分离action类型和非action类型的项目
      const actionItems = allSuggestions.filter((item) => item.type === "action")
      const nonActionItems = allSuggestions.filter((item) => item.type !== "action")

      // 限制非action类型的项目数量
      const limitedNonActionItems = nonActionItems.slice(0, maxNormalSuggestions)

      // 合并并返回
      return [...limitedNonActionItems, ...actionItems]
    })()

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      const targetIsEmpty = isEmpty(e.target.value)
      log("handleFocus", { value: e.target.value, isEmpty: targetIsEmpty })
      setIsFocused(true)

      if (targetIsEmpty && showSuggestions) {
        log("焦点时显示下拉框（输入为空）")
        handleShowDropdown()
        if (fetchFromServer && fetchSuggestions) {
          fetchSuggestionsFromServer(e.target.value)
        }
      } else {
        setShouldShowDropdown(false)
      }

      if (onFocus) onFocus(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTimeout(() => {
        // 如果当前活跃元素在下拉框里，不关闭
        if (
          dropdownRef.current &&
          dropdownRef.current.contains(document.activeElement)
        ) {
          return;
        }
        setIsFocused(false)
        setShouldShowDropdown(false)
        setHighlightedIndex(-1)
        if (onBlur) onBlur(e)
      }, 200)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange?.(e);
    };

    const handleDoubleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      const targetValue = (e.target as HTMLInputElement).value
      const targetIsEmpty = isEmpty(targetValue)
      log("handleDoubleClick", { isEmpty: targetIsEmpty, showSuggestions })

      if (targetIsEmpty && showSuggestions) {
        log("双击时显示下拉框（输入为空）")
        setIsFocused(true)
        handleShowDropdown()
        if (fetchFromServer && fetchSuggestions) {
          fetchSuggestionsFromServer(targetValue)
        }
      }

      if (onDoubleClick) onDoubleClick(e)
    }

    // 处理键盘事件
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      log("handleKeyDown", { key: e.key, inputValue })

      // 特殊处理：当按下Backspace或Delete键，且输入框内容为空时，显示下拉框
      if ((e.key === "Backspace" || e.key === "Delete") && isEmpty(inputValue) && showSuggestions) {
        log("删除键按下且输入为空，显示下拉框")
        handleShowDropdown()
        return
      }

      // 如果下拉菜单未显示，不处理导航键盘事件
      if (!shouldShowDropdown || processedSuggestions.length === 0) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault() // 防止光标移动
          setHighlightedIndex((prevIndex) => {
            // 如果当前没有选中项或已经是最后一项，选中第一项
            if (prevIndex === -1 || prevIndex === processedSuggestions.length - 1) {
              return 0
            }
            // 否则选中下一项
            return prevIndex + 1
          })
          break

        case "ArrowUp":
          e.preventDefault() // 防止光标移动
          setHighlightedIndex((prevIndex) => {
            // 如果当前没有选中项或已经是第一项，选中最后一项
            if (prevIndex === -1 || prevIndex === 0) {
              return processedSuggestions.length - 1
            }
            // 否则选中上一项
            return prevIndex - 1
          })
          break

        case "Enter":
          // 如果有高亮项，选中它
          if (highlightedIndex >= 0 && highlightedIndex < processedSuggestions.length) {
            e.preventDefault() // 防止表单提交
            handleSelectSuggestion(processedSuggestions[highlightedIndex])
          }
          break

        case "Escape":
          // 关闭下拉菜单
          setShouldShowDropdown(false)
          setHighlightedIndex(-1)
          break
      }
    }

    const handleSelectSuggestion = (item: SuggestionItem) => {
      log("handleSelectSuggestion", { item, isControlled: isControlledRef.current })

      // 如果是非action类型，并且有value值，则填充到输入框
      if (item.type !== "action" && item.value !== undefined) {
        // 在非受控模式下更新内部状态 - 显示content而不是value
        if (!isControlledRef.current) {
          setInputValue(toString(item.content || item.value))
        }

        // 创建一个合成事件来模拟onChange
        // 注意：这里传递的仍然是value作为实际值，但显示的是content
        const syntheticEvent = {
          target: { 
            ...internalRef.current || {}, // 合并原始input元素属性
            value: item.value,
            displayValue: item.content || item.value,
            _originalItem: item // 传递原始项，以便外部可以获取完整信息
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>

        // 触发onChange回调
        if (onChange) onChange(syntheticEvent)
      }

      // 调用外部传入的回调函数
      if (onSuggestionSelect) onSuggestionSelect(item)

      // 关闭下拉菜单
      setShouldShowDropdown(false)
    }

    // 清除输入框内容
    const handleClear = (e: React.MouseEvent) => {
      log("handleClear", { isControlled: isControlledRef.current })
      e.preventDefault()
      e.stopPropagation()

      if (!isControlledRef.current) {
        setInputValue("")
      }

      if (showSuggestions) {
        log("清除后显示下拉框")
        handleShowDropdown()
        if (fetchFromServer && fetchSuggestions) {
          fetchSuggestionsFromServer("")
        }
      }

      const syntheticEvent = {
        target: {
          ...internalRef.current,
          value: "",
          displayValue: "",
          _originalItem: null
        }
      } as unknown as CustomChangeEvent;

      if (onChange) onChange(syntheticEvent)

      if (internalRef.current) {
        internalRef.current.focus()
      }
    }

    // 判断是否显示清除按钮
    // 只有当：1. 输入框有内容 2. 输入框获得焦点 时才显示清除按钮
    const shouldShowClearButton = !isEmpty(inputValue) && isFocused

    // 确定最终的输入值
    const finalValue = isControlledRef.current ? (value || "") : inputValue

    // 根据是否显示建议和是否聚焦来决定是否渲染 DropdownSuggestions
    const renderDropdown = showSuggestions && shouldShowDropdown && isFocused && anchorRect;

    // 动态边框样式
    const inputBorderStyle = {
      width: "100%",
      border: isFocused ? "1px solid black" : "1px solid #d1d5db", // 聚焦时黑色，非聚焦时灰色(gray-300)
      transition: "border-color 0.2s, background-color 0.2s",
    };

    return (
      <div className="relative" ref={containerRef} style={widthStyle}>
        <div className="relative">
          <Input
            className={cn(
              "focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus-visible:shadow-none",
              shouldShowClearButton ? "pr-8" : "",
              className,
            )}
            style={inputBorderStyle}
            ref={handleRef}
            value={finalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onDoubleClick={handleDoubleClick}
            autoComplete="off"
            {...props}
          />

          {shouldShowClearButton && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={handleClear}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="清除输入"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        {renderDropdown && (
          <DropdownSuggestions
            isOpen={true}
            suggestions={processedSuggestions}
            onSelect={handleSelectSuggestion}
            highlightedIndex={highlightedIndex}
            isLoading={isLoading}
            anchorRect={anchorRect}
            dropdownRef={dropdownRef as React.RefObject<HTMLDivElement>}
            dropdownWidth={dropdownWidth}
            positionAbove={positionAbove}
          />
        )}
      </div>
    )
  }
)

DtyInput.displayName = "DtyInput"

export { DtyInput }
export type { SuggestionItem }

