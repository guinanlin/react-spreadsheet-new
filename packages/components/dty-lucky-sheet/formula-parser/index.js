/**
 * 公式解析器适配器
 * 使用 fast-formula-parser 替代 @fortune-sheet/formula-parser
 */

import FormulaParser from "fast-formula-parser";
import Parser from "./parser";
import SUPPORTED_FORMULAS from "./supported-formulas";
import error, {
  ERROR,
  ERROR_DIV_ZERO,
  ERROR_NAME,
  ERROR_NOT_AVAILABLE,
  ERROR_NULL,
  ERROR_NUM,
  ERROR_REF,
  ERROR_VALUE,
} from "./error";
import {
  extractLabel,
  toLabel,
  columnIndexToLabel,
  columnLabelToIndex,
  rowIndexToLabel,
  rowLabelToIndex,
} from "./helper/cell";

// 创建解析器实例
export const formulaParser = new FormulaParser({
  onCell: (ref) => {
    // 单元格引用处理
    return 0;
  },
  onRange: (ref) => {
    // 范围引用处理
    return [[0]];
  },
});

// 导出所有内容
export {
  SUPPORTED_FORMULAS,
  ERROR,
  ERROR_DIV_ZERO,
  ERROR_NAME,
  ERROR_NOT_AVAILABLE,
  ERROR_NULL,
  ERROR_NUM,
  ERROR_REF,
  ERROR_VALUE,
  Parser,
  error,
  extractLabel,
  toLabel,
  columnIndexToLabel,
  columnLabelToIndex,
  rowIndexToLabel,
  rowLabelToIndex,
  FormulaParser,
};

// 默认导出
export default formulaParser;
