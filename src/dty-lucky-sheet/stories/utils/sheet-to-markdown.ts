import * as XLSX from "xlsx";
import type { Cell, CellMatrix } from "../../core/types";

function cellDisplayValue(cell: Cell | null | undefined): string {
  if (cell == null || typeof cell !== "object") return "";
  if (cell.m != null && String(cell.m) !== "") return String(cell.m);
  if (cell.v != null && String(cell.v) !== "") return String(cell.v);
  return "";
}

function escapeMarkdownCell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
}

function rowToMarkdownLine(row: unknown[]): string {
  return `| ${row
    .map((cell) => escapeMarkdownCell(String(cell ?? "")))
    .join(" | ")} |`;
}

/**
 * 二维数组 → Markdown 表格（首行为表头，自动插入分隔行）。
 * 与 SheetJS `sheet_to_json({ header: 1 })` 输出格式一致。
 */
export function array2DToMarkdown(rawData: unknown[][]): string {
  if (!rawData.length) return "";

  const lines = rawData.map(rowToMarkdownLine);
  if (lines.length === 1) return lines[0];

  const colCount = rawData[0]?.length ?? 0;
  const separator = `| ${Array(colCount).fill("---").join(" | ")} |`;
  return [lines[0], separator, ...lines.slice(1)].join("\n");
}

/** 从 LuckySheet 单元格矩阵提取有内容的二维数组 */
export function sheetDataToArray(data: CellMatrix | null | undefined): unknown[][] {
  if (!data?.length) return [];

  let maxRow = 0;
  let maxCol = 0;
  for (let r = 0; r < data.length; r += 1) {
    const row = data[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c += 1) {
      if (cellDisplayValue(row[c]) !== "") {
        maxRow = Math.max(maxRow, r);
        maxCol = Math.max(maxCol, c);
      }
    }
  }

  if (maxCol < 0) return [];

  const rows: unknown[][] = [];
  for (let r = 0; r <= maxRow; r += 1) {
    const rowCells: unknown[] = [];
    for (let c = 0; c <= maxCol; c += 1) {
      rowCells.push(cellDisplayValue(data[r]?.[c]));
    }
    rows.push(rowCells);
  }
  return rows;
}

export function sheetDataToMarkdown(data: CellMatrix | null | undefined): string {
  return array2DToMarkdown(sheetDataToArray(data));
}

function isSectionTitleRow(row: unknown[]): boolean {
  const text = row.map((c) => String(c ?? "").trim()).join("");
  return /【.*】/.test(text) && row.filter((c) => String(c ?? "").trim()).length <= 2;
}

function isTitleOnlyRow(row: unknown[]): boolean {
  const filled = row.map((c) => String(c ?? "").trim()).filter(Boolean);
  return filled.length === 1;
}

function trimTrailingEmptyCols(row: unknown[]): unknown[] {
  const copy = [...row];
  while (copy.length > 0 && String(copy[copy.length - 1] ?? "").trim() === "") {
    copy.pop();
  }
  return copy;
}

function renderFormHeaderRows(rows: unknown[][]): string[] {
  const parts: string[] = [];

  for (const rawRow of rows) {
    const row = trimTrailingEmptyCols(rawRow);
    const filled = row.filter((c) => String(c ?? "").trim() !== "");
    if (!filled.length) continue;

    if (isSectionTitleRow(row)) {
      const title = String(filled[0]).replace(/[【】\s]/g, "").trim();
      parts.push(`### ${title || filled[0]}`);
      continue;
    }

    if (isTitleOnlyRow(row)) {
      const text = String(filled[0]);
      parts.push(parts.length === 0 ? `# ${text}` : `## ${text}`);
      continue;
    }

    // 标签-值对：偶数列按两列一组输出
    if (row.length >= 2 && row.length % 2 === 0) {
      const pairs: unknown[][] = [];
      for (let i = 0; i < row.length; i += 2) {
        const label = String(row[i] ?? "").trim();
        const value = String(row[i + 1] ?? "").trim();
        if (label || value) pairs.push([label, value]);
      }
      if (pairs.length) {
        parts.push(array2DToMarkdown(pairs));
      }
      continue;
    }

    parts.push(rowToMarkdownLine(row));
  }

  return parts;
}

export type SheetFormMarkdownOptions = {
  /** 明细表体起始行（含列头行），之前为表单表头区 */
  bodyStartRow?: number;
};

/**
 * 表单式工作表 → Markdown：表头区（标题 + 字段）+ 表体区（明细表格）。
 */
export function sheetFormToMarkdown(
  data: CellMatrix | null | undefined,
  options: SheetFormMarkdownOptions = {}
): string {
  const allRows = sheetDataToArray(data);
  if (!allRows.length) return "";

  const bodyStart =
    options.bodyStartRow ??
    allRows.findIndex((row) => isSectionTitleRow(row)) + 1;

  const headerEnd = bodyStart > 0 ? bodyStart : allRows.length;
  const headerRows = allRows.slice(0, headerEnd);
  const bodyRows = allRows.slice(headerEnd).filter((row) =>
    row.some((c) => String(c ?? "").trim() !== "")
  );

  const sections: string[] = [...renderFormHeaderRows(headerRows)];

  if (bodyRows.length) {
    if (sections.length) sections.push("");
    sections.push(array2DToMarkdown(bodyRows));
  }

  return sections.join("\n\n");
}

/**
 * 本地 Excel 文件 → Markdown（SheetJS，与 Node 后端逻辑一致）。
 */
export async function excelFileToMarkdown(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
  }) as unknown[][];
  return array2DToMarkdown(rawData);
}
