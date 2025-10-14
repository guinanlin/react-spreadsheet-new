// 导出主组件
export { DtyLuckySheet } from "./components/DtyLuckySheet";
export type { DtyLuckySheetInstance } from "./components/DtyLuckySheet";

// 导出类型
export type {
  Sheet,
  Cell,
  CellMatrix,
  Selection,
  CellWithRowAndCol,
} from "./core/types";

export type { Context } from "./core/context";
export type { Settings } from "./core/settings";

// 导出 WorkbookInstance 以便访问完整的 API
export type { WorkbookInstance } from "./components/Workbook";
