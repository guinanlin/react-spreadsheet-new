import React from "react";

/**
 * 建议项类型定义
 */
export interface SuggestionItem {
  id: string;
  type: "multiline" | "bold" | "normal" | "action";
  content: string | string[];
  value?: string; // 实际值
  icon?: "plus" | "search";
  stockUom?: string; // 库存单位/尺码
  extra?: any; // 额外数据
}

/**
 * 自定义 Change 事件，包含额外的显示值和原始项信息
 */
export interface CustomChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    displayValue?: string;
    _originalItem?: any;
  };
}

/**
 * DtyInput 组件属性
 */
export interface DtyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "width"> {
  width?: string | number;
  showSuggestions?: boolean;
  suggestions?: SuggestionItem[];
  onSuggestionSelect?: (item: SuggestionItem) => void;
  maxNormalSuggestions?: number;
  debug?: boolean; // 调试模式
  fetchFromServer?: boolean; // 是否从服务器获取建议
  fetchSuggestions?: (query: string) => Promise<SuggestionItem[]>; // 从服务器获取建议的函数
  debounceTime?: number; // 防抖时间（毫秒）
  dropdownWidth?: string | number; // 下拉框宽度
  positionAbove?: boolean; // 下拉框是否显示在上方
  /**
   * 注意：当选择一个建议项时，onChange事件将传递一个扩展的事件对象，
   * 其中包含以下额外属性：
   * - e.target.displayValue: 显示值(content)
   * - e.target._originalItem: 原始的完整建议项对象
   * 
   * 可以通过这些属性获取更多信息而不仅仅是value
   */
}

/**
 * DropdownSuggestions 组件属性
 */
export interface DropdownSuggestionsProps {
  isOpen: boolean;
  suggestions: SuggestionItem[];
  onSelect: (item: SuggestionItem) => void;
  className?: string;
  highlightedIndex?: number;
  isLoading?: boolean;
  anchorRect?: DOMRect;
  dropdownRef?: React.RefObject<HTMLDivElement>;
  dropdownWidth?: string | number;
  positionAbove?: boolean;
}

