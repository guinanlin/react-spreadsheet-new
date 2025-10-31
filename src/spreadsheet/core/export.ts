import * as Matrix from "../data-structures/matrix";
import type { Selection } from "../data-structures/selection";
import type { CellBase } from "../types";
import { getCSV as toCSV } from "./util";

export type ExportFormat = "csv" | "json" | "xlsx";

export interface BuildOptions<CellType extends CellBase = CellBase> {
  data: Matrix.Matrix<CellType>;
  selection?: Selection | null;
  useEvaluated?: boolean;
  evaluatedData?: Matrix.Matrix<CellType>;
  includeColumnLabels?: boolean;
  includeRowLabels?: boolean;
  columnLabels?: string[];
  rowLabels?: string[];
}

export interface CsvOptions {
  delimiter?: string; // 默认 ","
  bom?: boolean; // 默认 true（兼容 Excel）
  filename?: string; // 默认 "spreadsheet.csv"
}

export interface JsonOptions {
  filename?: string; // 默认 "spreadsheet.json"
}

export interface XlsxOptions {
  filename?: string; // 默认 "spreadsheet.xlsx"
  sheetName?: string; // 默认 "Sheet1"
}

function pickMatrix<CellType extends CellBase>(
  opts: BuildOptions<CellType>
): Matrix.Matrix<CellType> {
  const base = opts.useEvaluated && opts.evaluatedData ? opts.evaluatedData : opts.data;
  if (opts.selection) {
    const range = opts.selection.toRange(base);
    if (range) {
      return Matrix.slice(range.start, range.end, base);
    }
  }
  return base;
}

function withHeaders<CellType extends CellBase>(
  mat: Matrix.Matrix<CellType>,
  opts: BuildOptions<CellType>
): Matrix.Matrix<CellType> {
  let result = mat;

  // 行头（在每行前面插入一列）
  if (opts.includeRowLabels && opts.rowLabels) {
    result = result.map((row, r) => {
      const label = r in (opts.rowLabels as string[]) ? (opts.rowLabels as string[])[r] : "";
      return [{ value: label } as CellType, ...row];
    });
  }

  // 列头（在顶部插入一行）
  if (opts.includeColumnLabels && opts.columnLabels) {
    const cols = result[0]?.length || 0;
    const headerRow: CellType[] = Array.from({ length: cols }, (_, c) => {
      const label = c in (opts.columnLabels as string[]) ? (opts.columnLabels as string[])[c] : "";
      return { value: label } as CellType;
    });
    result = [headerRow, ...result];
  }

  return result;
}

export function exportToCSV<CellType extends CellBase>(
  build: BuildOptions<CellType>,
  csv: CsvOptions = {}
) {
  const { delimiter = ",", bom = true, filename = "spreadsheet.csv" } = csv;

  const picked = pickMatrix(build);
  const withHeader = withHeaders(picked, build);

  const csvText = delimiter === ","
    ? toCSV(withHeader as Matrix.Matrix<CellBase>)
    : Matrix.join(Matrix.map((cell) => cell?.value ?? "", withHeader), delimiter);

  const payload = bom ? "\ufeff" + csvText : csvText;
  const blob = new Blob([payload], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function exportToJSON<CellType extends CellBase>(
  build: BuildOptions<CellType>,
  jsonOpts: JsonOptions = {}
) {
  const { filename = "spreadsheet.json" } = jsonOpts;
  const picked = pickMatrix(build);
  const arr = picked.map((row) => row.map((cell) => cell?.value ?? null));

  const blob = new Blob([JSON.stringify(arr)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export async function exportToXLSX<CellType extends CellBase>(
  build: BuildOptions<CellType>,
  xlsxOpts: XlsxOptions = {}
) {
  const { filename = "spreadsheet.xlsx", sheetName = "Sheet1" } = xlsxOpts;

  const picked = pickMatrix(build);
  const withHeader = withHeaders(picked, build);
  const aoa: (string | number | boolean | null)[][] = withHeader.map((row) =>
    row.map((cell) => cell?.value ?? null)
  );

  const XLSX = await import("xlsx");
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  const blob = new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}


