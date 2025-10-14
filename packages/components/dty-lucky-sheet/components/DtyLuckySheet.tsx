/**
 * DtyLuckySheet - 基于 FortuneSheet 的独立电子表格组件
 * 
 * 这个组件复制了 FortuneSheet 的核心代码，是完全独立的实现
 * 不依赖外部的 FortuneSheet 仓库
 */

// 直接使用我们复制的 Workbook 组件
export { default as DtyLuckySheet } from "./Workbook";
export type { WorkbookInstance as DtyLuckySheetInstance } from "./Workbook";

// 导出类型
export type {
  Sheet,
  Cell,
  CellMatrix,
  Selection,
  CellWithRowAndCol,
} from "../core/types";

export type { Context } from "../core/context";
export type { Settings } from "../core/settings";
