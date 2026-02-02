import FormulaParser, {
  CellRef,
  FormulaParserConfig,
  Value,
} from "fast-formula-parser";
import { PointRange } from "../data-structures/point-range";
import { Point } from "../data-structures/point";
import * as Matrix from "../data-structures/matrix";
import { CellBase } from "../types";
import { PointSet } from "./point-set";

type ParserRangeRef = Parameters<
  Exclude<FormulaParserConfig["onRange"], undefined>
>[0];

export const FORMULA_VALUE_PREFIX = "=";

/** Returns whether given value is a formula */
export function isFormulaValue(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith(FORMULA_VALUE_PREFIX) &&
    value.length > 1
  );
}

/** Extracts formula from value  */
export function extractFormula(value: string): string {
  return value.slice(1);
}

export function createFormulaParser(
  data: Matrix.Matrix<CellBase>,
  config?: Omit<FormulaParserConfig, "onCell" | "onRange">
): FormulaParser {
  return new FormulaParser({
    ...config,
    onCell: (ref: CellRef) => {
      const point: Point = {
        row: ref.row - 1,
        column: ref.col - 1,
      };
      const cell = Matrix.get(point, data);
      if (!isNaN(cell?.value as number)) return Number(cell?.value);
      return cell?.value;
    },
    onRange: (ref: ParserRangeRef) => {
      const sheetId = ref.sheet ?? "Sheet1";
      void sheetId;
      const size = Matrix.getSize(data);
      const start: Point = {
        row: ref.from.row - 1,
        column: ref.from.col - 1,
      };
      const end: Point = {
        row: Math.min(ref.to.row - 1, size.rows - 1),
        column: Math.min(ref.to.col - 1, size.columns - 1),
      };
      const dataSlice = Matrix.slice(start, end, data);
      return Matrix.toArray(dataSlice, (cell) => {
        if (!isNaN(cell?.value as number)) return Number(cell?.value);
        return cell?.value;
      });
    },
  });
}

/**
 * For given formula returns the cell references
 * @param formula - formula to get references for
 */
export function getReferences(
  formula: string,
  point: Point,
  data: Matrix.Matrix<CellBase>
): PointSet {
  const { rows, columns } = Matrix.getSize(data);
  try {
    // Use a simple regex-based approach to extract cell references
    // This is a fallback since DepParser might not be available as a value
    const cellRefRegex = /([A-Z]+)(\d+)/g;
    const rangeRefRegex = /([A-Z]+\d+):([A-Z]+\d+)/g;
    
    const references: Point[] = [];
    
    // Find range references first (e.g., A1:B2)
    let rangeMatch;
    while ((rangeMatch = rangeRefRegex.exec(formula)) !== null) {
      const [, fromStr, toStr] = rangeMatch;
      const fromMatch = /([A-Z]+)(\d+)/.exec(fromStr);
      const toMatch = /([A-Z]+)(\d+)/.exec(toStr);
      
      if (fromMatch && toMatch) {
        const fromCol = columnLettersToIndex(fromMatch[1]);
        const fromRow = parseInt(fromMatch[2], 10) - 1;
        const toCol = columnLettersToIndex(toMatch[1]);
        const toRow = parseInt(toMatch[2], 10) - 1;
        
        const normalizedFrom: Point = {
          row: fromRow,
          column: fromCol,
        };
        
        const normalizedTo: Point = {
          row: Math.min(toRow, rows - 1),
          column: Math.min(toCol, columns - 1),
        };
        
        const range = new PointRange(normalizedFrom, normalizedTo);
        references.push(...Array.from(range));
      }
    }
    
    // Find individual cell references (excluding those already in ranges)
    const rangesText = Array.from(formula.matchAll(rangeRefRegex)).map(m => m[0]);
    let formulaWithoutRanges = formula;
    rangesText.forEach(range => {
      formulaWithoutRanges = formulaWithoutRanges.replace(range, '');
    });
    
    let cellMatch;
    while ((cellMatch = cellRefRegex.exec(formulaWithoutRanges)) !== null) {
      const [, colStr, rowStr] = cellMatch;
      const col = columnLettersToIndex(colStr);
      const row = parseInt(rowStr, 10) - 1;
      
      if (row >= 0 && row < rows && col >= 0 && col < columns) {
        references.push({ row, column: col });
      }
    }

    return PointSet.from(references);
  } catch (error) {
    // Return empty set on any error
    return PointSet.from([]);
  }
}

/**
 * Convert column letters (e.g., "A", "Z", "AA") to zero-based index
 */
function columnLettersToIndex(letters: string): number {
  let index = 0;
  for (let i = 0; i < letters.length; i++) {
    index = index * 26 + (letters.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return index - 1;
}

export function evaluate(
  formula: string,
  point: Point,
  formulaParser: FormulaParser
): Value {
  try {
    // Note: Different versions/builds of fast-formula-parser may have different type definitions
    // The runtime API accepts (formula, position, allowReturnArray) but some type definitions
    // may not reflect this. We use type assertion to handle this compatibility issue.
    const position = convertPointToCellRef(point);
    const returned = (formulaParser.parse as (formula: string, position?: CellRef, allowReturnArray?: boolean) => any)(
      formula,
      position
    );
    
    // Check if returned is a FormulaError object (has toString method and looks like an error)
    if (returned && typeof returned === 'object' && 'toString' in returned) {
      const strValue = String(returned);
      // If it looks like an error string, return it
      if (strValue.startsWith('#') && strValue.endsWith('!')) {
        return strValue;
      }
    }
    
    // Check if returned value is an error string (e.g., "#REF!", "#VALUE!")
    if (typeof returned === 'string' && returned.startsWith('#') && returned.endsWith('!')) {
      return returned;
    }
    
    return returned as Value;
  } catch (error) {
    // Check if error has a toString method or contains error message
    if (error && typeof error === 'object' && 'toString' in error) {
      const errorStr = String(error);
      if (errorStr.startsWith('#') && errorStr.endsWith('!')) {
        return errorStr;
      }
    }
    // For other errors, return a generic error
    return "#ERROR!";
  }
}

function convertPointToCellRef(point: Point): CellRef {
  return {
    row: point.row + 1,
    col: point.column + 1,
    // TODO: fill once we support multiple sheets
    sheet: "Sheet1",
  };
}
