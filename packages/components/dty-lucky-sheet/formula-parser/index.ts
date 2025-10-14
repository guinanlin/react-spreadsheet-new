/**
 * 公式解析器适配器
 * 使用 fast-formula-parser 替代 @fortune-sheet/formula-parser
 */

import FormulaParser from "fast-formula-parser";

// 导出解析器实例
export const formulaParser = new FormulaParser({
  onCell: (ref: any) => {
    // 单元格引用处理
    return { value: 0, ref };
  },
  onRange: (ref: any) => {
    // 范围引用处理
    return { value: [[0]], ref };
  },
});

// 导出类和类型
export { FormulaParser };
export default formulaParser;

