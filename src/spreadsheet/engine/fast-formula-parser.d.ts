/**
 * Local type definitions for fast-formula-parser
 * This ensures compatibility across different build environments
 */

declare module "fast-formula-parser" {
  export type CellCoord = {
    row: number;
    col: number;
  };

  export type CellRef = CellCoord & {
    sheet: string;
  };

  export type RangeRef = {
    from: CellRef;
    to: CellRef;
    sheet: string;
  };

  export type BaseValue = number | string | boolean;
  export type Value = BaseValue | BaseValue[];

  export type FormulaParserConfig = {
    functions?: object;
    onCell?: (ref: CellRef) => Value;
    onRange?: (range: RangeRef) => Value[];
    onVariable?: (name: string, sheetName: string) => CellRef | RangeRef;
  };

  export class FormulaError extends Error {
    constructor(error: string, msg?: string, details?: object | Error);
    equals(error: Error): boolean;
    toString(): string;

    static DIV0: string;
    static NA: string;
    static NAME: string;
    static NULL: string;
    static NUM: string;
    static REF: string;
    static VALUE: string;
  }

  export default class FormulaParser {
    constructor(config: FormulaParserConfig);
    parse(
      inputText: string,
      position?: CellRef,
      allowReturnArray?: boolean
    ): Value | FormulaError;
  }

  export class DepParser {
    parse(formula: string, position: CellRef): Array<CellRef | RangeRef>;
  }
}

