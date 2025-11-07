/**
 * Fill Handler - 处理单元格自动填充逻辑
 */

import { CellBase } from "../types";
import { Point } from "../data-structures/point";
import { PointRange } from "../data-structures/point-range";
import * as Matrix from "../data-structures/matrix";

/**
 * 数据模式类型
 */
export type FillPattern =
  | "number" // 纯数字
  | "text" // 纯文本
  | "text-number" // 文本+数字 (如 "项目1")
  | "date" // 日期
  | "empty"; // 空单元格

/**
 * 检测数据模式
 */
export function detectPattern(value: any): FillPattern {
  if (value === null || value === undefined || value === "") {
    return "empty";
  }

  const stringValue = String(value);

  // 检测纯数字
  if (!isNaN(Number(stringValue)) && stringValue.trim() !== "") {
    return "number";
  }

  // 检测日期格式
  const dateRegex = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/;
  if (dateRegex.test(stringValue)) {
    return "date";
  }

  // 检测文本+数字组合 (如 "项目1", "Item 5")
  const textNumberRegex = /^(.*?)(\d+)$/;
  if (textNumberRegex.test(stringValue)) {
    return "text-number";
  }

  // 默认为纯文本
  return "text";
}

/**
 * 从值中提取数字和文本部分
 */
function extractTextNumber(value: string): {
  text: string;
  number: number;
  digits: number;
} {
  const match = value.match(/^(.*?)(\d+)$/);
  if (match) {
    return {
      text: match[1],
      number: parseInt(match[2], 10),
      digits: match[2].length,
    };
  }
  return { text: value, number: 0, digits: 0 };
}

/**
 * 简单复制模式 - 直接复制源数据
 */
export function simpleCopy<Cell extends CellBase>(
  sourceData: Matrix.Matrix<Cell>,
  sourceRange: PointRange,
  targetRange: PointRange
): Map<string, Cell> {
  console.log("simpleCopy: sourceRange.start", sourceRange.start, "sourceRange.end", sourceRange.end);
  console.log("simpleCopy: targetRange.start", targetRange.start, "targetRange.end", targetRange.end);
  
  const changes = new Map<string, Cell>();

  const sourceRows = sourceRange.end.row - sourceRange.start.row + 1;
  const sourceCols = sourceRange.end.column - sourceRange.start.column + 1;

  console.log("simpleCopy: sourceRows", sourceRows, "sourceCols", sourceCols);

  // 遍历整个目标范围，但跳过源范围内的点
  console.log("simpleCopy: iterating through targetRange");

  for (const point of targetRange) {
    // 跳过源区域内的点
    if (sourceRange.has(point)) {
      console.log("simpleCopy: skipping source point", point);
      continue;
    }
    // 计算对应的源位置（循环复制）
    const offsetRow = (point.row - sourceRange.start.row) % sourceRows;
    const offsetCol = (point.column - sourceRange.start.column) % sourceCols;

    const sourcePoint: Point = {
      row: sourceRange.start.row + (offsetRow < 0 ? offsetRow + sourceRows : offsetRow),
      column: sourceRange.start.column + (offsetCol < 0 ? offsetCol + sourceCols : offsetCol),
    };

    const sourceCell = Matrix.get(sourcePoint, sourceData);
    console.log("simpleCopy: point", point, "sourcePoint", sourcePoint, "sourceCell", sourceCell);
    
    if (sourceCell) {
      changes.set(`${point.row},${point.column}`, { ...sourceCell });
    } else {
      // 如果源单元格为空，从源范围的第一个单元格获取数据
      const firstSourceCell = Matrix.get(sourceRange.start, sourceData);
      console.log("simpleCopy: using first source cell", sourceRange.start, firstSourceCell);
      if (firstSourceCell) {
        changes.set(`${point.row},${point.column}`, { ...firstSourceCell });
      } else {
        // 创建一个空单元格
        changes.set(`${point.row},${point.column}`, { value: "" } as Cell);
      }
    }
  }

  console.log("simpleCopy: total changes", changes.size);
  return changes;
}

/**
 * 智能填充模式 - 根据模式自动递增
 */
export function smartFill<Cell extends CellBase>(
  sourceData: Matrix.Matrix<Cell>,
  sourceRange: PointRange,
  targetRange: PointRange
): Map<string, Cell> {
  console.log("smartFill: START");
  const changes = new Map<string, Cell>();

  // 确定填充方向
  const direction = detectFillDirection(sourceRange, targetRange);
  console.log("smartFill: direction", direction);
  
  // 根据方向获取源序列
  const sourceSequence = getSourceSequence(sourceData, sourceRange, direction);
  console.log("smartFill: sourceSequence length", sourceSequence.length);
  console.log("smartFill: sourceSequence values", sourceSequence.map(c => c.value));
  
  if (sourceSequence.length === 0) {
    console.log("smartFill: empty sequence, falling back to simpleCopy");
    return simpleCopy(sourceData, sourceRange, targetRange);
  }

  // 检测序列的模式
  const pattern = detectSequencePattern(sourceSequence);
  console.log("smartFill: detected pattern", pattern);
  
  // 生成填充数据
  for (const point of targetRange) {
    // 跳过源区域内的点
    if (sourceRange.has(point)) {
      continue;
    }

    const cell = generateFillCell(
      point,
      sourceRange,
      targetRange,
      sourceSequence,
      pattern,
      direction
    );

    if (cell) {
      console.log("smartFill: generated cell at", point, "value", cell.value);
      changes.set(`${point.row},${point.column}`, cell);
    }
  }

  console.log("smartFill: total changes", changes.size);
  return changes;
}

/**
 * 检测填充方向
 */
function detectFillDirection(
  sourceRange: PointRange,
  targetRange: PointRange
): "horizontal" | "vertical" | "both" {
  const expandedRows = targetRange.end.row > sourceRange.end.row || 
                       targetRange.start.row < sourceRange.start.row;
  const expandedCols = targetRange.end.column > sourceRange.end.column || 
                       targetRange.start.column < sourceRange.start.column;

  if (expandedRows && expandedCols) {
    return "both";
  } else if (expandedRows) {
    return "vertical";
  } else {
    return "horizontal";
  }
}

/**
 * 获取源序列数据
 */
function getSourceSequence<Cell extends CellBase>(
  sourceData: Matrix.Matrix<Cell>,
  sourceRange: PointRange,
  direction: "horizontal" | "vertical" | "both"
): Cell[] {
  const sequence: Cell[] = [];

  if (direction === "vertical") {
    // 垂直方向：从第一列提取
    for (let row = sourceRange.start.row; row <= sourceRange.end.row; row++) {
      const cell = Matrix.get({ row, column: sourceRange.start.column }, sourceData);
      if (cell) {
        sequence.push(cell);
      }
    }
  } else if (direction === "horizontal") {
    // 水平方向：从第一行提取
    for (let col = sourceRange.start.column; col <= sourceRange.end.column; col++) {
      const cell = Matrix.get({ row: sourceRange.start.row, column: col }, sourceData);
      if (cell) {
        sequence.push(cell);
      }
    }
  } else {
    // 两个方向：从第一行提取
    for (let col = sourceRange.start.column; col <= sourceRange.end.column; col++) {
      const cell = Matrix.get({ row: sourceRange.start.row, column: col }, sourceData);
      if (cell) {
        sequence.push(cell);
      }
    }
  }

  return sequence;
}

/**
 * 检测序列模式并返回递增值
 */
function detectSequencePattern(sequence: CellBase[]): {
  pattern: FillPattern;
  increment: number;
} {
  if (sequence.length === 0) {
    return { pattern: "empty", increment: 0 };
  }

  const patterns = sequence.map((cell) => detectPattern(cell.value));
  const firstPattern = patterns[0];

  // 如果所有单元格模式相同
  if (patterns.every((p) => p === firstPattern)) {
    if (firstPattern === "number" && sequence.length >= 2) {
      // 计算数字递增量
      const first = Number(sequence[0].value);
      const second = Number(sequence[1].value);
      return { pattern: "number", increment: second - first };
    } else if (firstPattern === "text-number" && sequence.length >= 2) {
      // 计算文本+数字的递增量
      const first = extractTextNumber(String(sequence[0].value));
      const second = extractTextNumber(String(sequence[1].value));
      if (first.text === second.text) {
        return { pattern: "text-number", increment: second.number - first.number };
      }
    }
  }

  return { pattern: firstPattern, increment: 1 };
}

/**
 * 生成填充单元格
 */
function generateFillCell<Cell extends CellBase>(
  point: Point,
  sourceRange: PointRange,
  targetRange: PointRange,
  sourceSequence: Cell[],
  patternInfo: { pattern: FillPattern; increment: number },
  direction: "horizontal" | "vertical" | "both"
): Cell | null {
  if (sourceSequence.length === 0) {
    return null;
  }

  // 计算距离源范围的偏移量
  let offset = 0;
  if (direction === "vertical") {
    if (point.row > sourceRange.end.row) {
      offset = point.row - sourceRange.end.row;
    } else if (point.row < sourceRange.start.row) {
      offset = point.row - sourceRange.start.row;
    }
  } else if (direction === "horizontal") {
    if (point.column > sourceRange.end.column) {
      offset = point.column - sourceRange.end.column;
    } else if (point.column < sourceRange.start.column) {
      offset = point.column - sourceRange.start.column;
    }
  }

  // 获取基准单元格
  const baseIndex = direction === "vertical" 
    ? (point.row >= sourceRange.start.row ? sourceSequence.length - 1 : 0)
    : (point.column >= sourceRange.start.column ? sourceSequence.length - 1 : 0);
  const baseCell = sourceSequence[baseIndex];

  if (!baseCell) {
    return null;
  }

  // 根据模式生成新值
  let newValue: any;

  switch (patternInfo.pattern) {
    case "number": {
      const baseNumber = Number(baseCell.value);
      newValue = baseNumber + patternInfo.increment * offset;
      break;
    }

    case "text-number": {
      const extracted = extractTextNumber(String(baseCell.value));
      const newNumber = extracted.number + patternInfo.increment * offset;
      const digits = extracted.digits || String(Math.abs(extracted.number)).length;
      const isNegative = newNumber < 0;
      const absoluteNumber = Math.abs(newNumber);
      const padded = digits > 0
        ? String(absoluteNumber).padStart(digits, "0")
        : String(absoluteNumber);
      newValue = `${extracted.text}${isNegative ? "-" : ""}${padded}`;
      break;
    }

    case "date": {
      const baseDate = new Date(String(baseCell.value));
      if (!isNaN(baseDate.getTime())) {
        const newDate = new Date(baseDate);
        newDate.setDate(newDate.getDate() + offset);
        newValue = newDate.toISOString().split("T")[0];
      } else {
        newValue = baseCell.value;
      }
      break;
    }

    default:
      // 纯文本或空值，直接复制
      newValue = baseCell.value;
  }

  return {
    ...baseCell,
    value: newValue,
  } as Cell;
}

/**
 * 应用填充数据到数据矩阵
 */
export function applyFillData<Cell extends CellBase>(
  data: Matrix.Matrix<Cell>,
  changes: Map<string, Cell>
): Matrix.Matrix<Cell> {
  let newData = data;

  for (const [key, cell] of changes) {
    const [row, column] = key.split(",").map(Number);
    newData = Matrix.set({ row, column }, cell, newData);
  }

  return newData;
}

