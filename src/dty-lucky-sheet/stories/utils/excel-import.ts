import type { Sheet, Cell, SheetConfig, CellMatrix } from "../../core/types";

function newSheetId(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `sheet-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** SheetJS worksheet cell record + '!ref', '!merges', etc. */
// SheetJS 工作表为非结构化字典，这里无法用 narrow 类型覆盖全部键
type XlsxWorksheet = Record<string, unknown>;

type XLSX_Cell = {
  v?: unknown;
  t?: string;
  f?: unknown;
  w?: string | number;
  z?: unknown;
  s?: Record<string, unknown>;
  l?: { Target?: string; Hyperlink?: { Target?: string }; href?: string };
};

function warn(warnings: string[], msg: string) {
  if (!warnings.includes(msg)) warnings.push(msg);
}

type OoxmlColor = {
  rgb?: string;
  indexed?: number;
  theme?: number;
};

function normalizeExcelRgb(raw: string): string {
  const r = raw.replace(/^#/, "").trim();
  if (r.length === 8) return `#${r.slice(2)}`;
  if (r.length === 6) return `#${r}`;
  return `#${r}`;
}

/** 将 #RRGGBB 转为 canvas/边框模块常用的 rgb 串（与 cell-rich 示例一致）。 */
function hexToRgbCss(hex: string): string {
  const h = normalizeExcelRgb(hex).replace(/^#/, "");
  if (h.length !== 6) return "rgb(0, 0, 0)";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * ECMA-376 默认 indexedColors 前 64 项（无 workbook 覆盖时）。
 * 见 Office Open XML 规范 / 各开源读表实现通用表。
 */
const OOXML_INDEXED_HEX: string[] = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#C0C0C0",
  "#808080",
  "#9999FF",
  "#993366",
  "#FFFFCC",
  "#CCFFFF",
  "#660066",
  "#FF8080",
  "#0066CC",
  "#CCCCFF",
  "#000080",
  "#FF00FF",
  "#FFFF00",
  "#00FFFF",
  "#800080",
  "#800000",
  "#008080",
  "#0000FF",
  "#00CCFF",
  "#CCFFFF",
  "#CCFFCC",
  "#FFFF99",
  "#99CCFF",
  "#FF99CC",
  "#CC99FF",
  "#FFCC99",
  "#3366FF",
  "#33CCCC",
  "#99CC00",
  "#FFCC00",
  "#FF9900",
  "#FF6600",
  "#666699",
  "#969696",
  "#003366",
  "#339966",
  "#003300",
  "#333300",
  "#993300",
  "#993366",
  "#333399",
  "#333333",
];

function indexedHexOrUndefined(index: number): string | undefined {
  if (!Number.isFinite(index) || index < 0 || index >= OOXML_INDEXED_HEX.length) {
    return undefined;
  }
  return OOXML_INDEXED_HEX[index];
}

/** 单元格 fill/font 用 #RRGGBB；支持 ARGB、索引色；主题色无表时降级。 */
function excelRgbOrFallback(
  color:
    | { rgb?: unknown; indexed?: number; theme?: number; tint?: number }
    | null
    | undefined,
  warnings: string[]
): string {
  if (!color) return "#000000";
  if (typeof color.rgb === "string" && color.rgb.trim() !== "") {
    return normalizeExcelRgb(String(color.rgb));
  }
  if (color.indexed != null) {
    const ix = Number(color.indexed);
    const h = indexedHexOrUndefined(ix);
    if (h) return h;
    warn(warnings, "无法解析的 Excel 索引色已使用黑色替代。");
    return "#000000";
  }
  if (color.theme != null) {
    warnThemedFill(warnings);
    return "#000000";
  }
  return "#000000";
}

/** OOXML → #rrggbb；无原生 rgb（仅主题/index）时不强行返回黑色。 */
function ooxmlToHexMaybe(c: OoxmlColor | undefined): string | undefined {
  if (!c?.rgb || !String(c.rgb).trim()) return undefined;
  return normalizeExcelRgb(String(c.rgb));
}

/** 边框等：缺 RGB 时降级并告警。 */
function ooxmlToHexFallback(
  c: OoxmlColor | undefined,
  warnings: string[],
  fallbackHex: string
): string {
  const h = ooxmlToHexMaybe(c);
  if (h) return h;
  if (c?.indexed != null || c?.theme != null) {
    warn(warnings, "部分边框使用 Excel 主题或索引色，浏览器内仅能近似单色。");
  }
  return fallbackHex;
}

function warnThemedFill(warnings: string[]) {
  warn(
    warnings,
    "部分单元格底色为 Excel 主题或索引色，未提供 RGB 时无法在浏览器中等色还原。"
  );
}

const OOXML_BORDER_STYLE_TO_NUM: Record<string, number> = {
  none: 0,
  thin: 1,
  hair: 2,
  dotted: 3,
  dashed: 4,
  dashdot: 5,
  dashdotdot: 6,
  double: 7,
  medium: 8,
  mediumdashed: 9,
  mediumdashdot: 10,
  mediumdashdotdot: 11,
  slantdasheddot: 12,
  thick: 13,
};

function normOoxmlBorderStyle(st?: string): number {
  if (!st) return 0;
  const k = st.replace(/\s+/g, "").toLowerCase();
  if (k === "none") return 0;
  return OOXML_BORDER_STYLE_TO_NUM[k] ?? 1;
}

type BorderSide = {
  style?: string;
  color?: OoxmlColor;
};

type XlsxCellBorder = {
  left?: BorderSide;
  right?: BorderSide;
  top?: BorderSide;
  bottom?: BorderSide;
  diagonal?: BorderSide;
};

type XlsxStyleObject = {
  font?: {
    bold?: boolean;
    italic?: boolean;
    u?: boolean;
    strike?: boolean;
    sz?: number;
    name?: string;
    color?: { rgb?: string; indexed?: number; theme?: number };
  };
  fill?: {
    fgColor?: { rgb?: string; indexed?: number; theme?: number };
    bgColor?: { rgb?: string; indexed?: number; theme?: number };
    patternType?: string;
  };
  alignment?: { horizontal?: string; vertical?: string; wrapText?: boolean };
  border?: XlsxCellBorder;
  // 部分 WPS/导出器会把 fill/font/alignment 扁平到 style 顶层
  fgColor?: { rgb?: string; indexed?: number; theme?: number };
  bgColor?: { rgb?: string; indexed?: number; theme?: number };
  patternType?: string;
  color?: { rgb?: string; indexed?: number; theme?: number };
  bold?: boolean;
  italic?: boolean;
  u?: boolean;
  strike?: boolean;
  sz?: number;
  name?: string;
  horizontal?: string;
  vertical?: string;
  wrapText?: boolean;
  left?: BorderSide;
  right?: BorderSide;
  top?: BorderSide;
  bottom?: BorderSide;
  diagonal?: BorderSide;
};

function getStyleObject(xc: XLSX_Cell): XlsxStyleObject | undefined {
  return typeof xc.s === "object" && xc.s != null ? (xc.s as XlsxStyleObject) : undefined;
}

function getBorderFromStyle(s: XlsxStyleObject | undefined): XlsxCellBorder | undefined {
  if (!s) return undefined;
  if (s.border != null) return s.border;
  if (s.left || s.right || s.top || s.bottom || s.diagonal) {
    return {
      left: s.left,
      right: s.right,
      top: s.top,
      bottom: s.bottom,
      diagonal: s.diagonal,
    };
  }
  return undefined;
}

function xlsxBorderHasSides(bd: XlsxCellBorder | undefined): boolean {
  if (!bd) return false;
  for (const edge of ["left", "right", "top", "bottom"] as const) {
    const st = bd[edge]?.style;
    if (st != null && normOoxmlBorderStyle(st) > 0) return true;
  }
  return false;
}

function sideToLucky(
  side?: BorderSide,
  warnings: string[]
): { style: number; color: string } | undefined {
  if (!side?.style) return undefined;
  const st = normOoxmlBorderStyle(side.style);
  if (st <= 0) return undefined;
  return {
    style: st,
    color: hexToRgbCss(ooxmlToHexFallback(side.color, warnings, "#000000")),
  };
}

function buildCellBorderRecord(
  r: number,
  c: number,
  bd: XlsxCellBorder | undefined,
  warnings: string[]
): { rangeType: "cell"; value: Record<string, unknown> } | null {
  if (!bd) return null;
  const value: Record<string, unknown> = { row_index: r, col_index: c };
  const l = sideToLucky(bd.left, warnings);
  const rr = sideToLucky(bd.right, warnings);
  const t = sideToLucky(bd.top, warnings);
  const btm = sideToLucky(bd.bottom, warnings);
  if (l) value.l = l;
  if (rr) value.r = rr;
  if (t) value.t = t;
  if (btm) value.b = btm;
  if (bd.diagonal?.style != null && normOoxmlBorderStyle(bd.diagonal.style) > 0) {
    warn(warnings, "单元格对角线边框导入时已跳过。");
  }
  const keys = Object.keys(value).filter((k) => k !== "row_index" && k !== "col_index");
  if (keys.length === 0) return null;
  return { rangeType: "cell", value };
}

function mapFreezeFromPane(ws: XlsxWorksheet): Sheet["frozen"] | undefined {
  const pane = ws["!pane"] as { xSplit?: number; ySplit?: number } | undefined;
  if (!pane) return undefined;
  const xs = pane.xSplit ?? 0;
  const ys = pane.ySplit ?? 0;
  if (xs <= 0 && ys <= 0) return undefined;

  if (xs > 0 && ys > 0) {
    return {
      type: "rangeBoth",
      range: {
        column_focus: Math.max(0, xs - 1),
        row_focus: Math.max(0, ys - 1),
      },
    };
  }
  if (xs > 0) {
    return {
      type: "rangeColumn",
      range: {
        column_focus: Math.max(0, xs - 1),
        row_focus: 0,
      },
    };
  }
  return {
    type: "rangeRow",
    range: {
      row_focus: Math.max(0, ys - 1),
      column_focus: 0,
    },
  };
}

function safeSheetName(namesSoFar: Set<string>, raw: string): string {
  let name = raw?.trim() ? raw.trim() : "Sheet";
  if (namesSoFar.has(name)) {
    let i = 2;
    while (namesSoFar.has(`${name}_${i}`)) i += 1;
    name = `${name}_${i}`;
  }
  namesSoFar.add(name);
  return name.slice(0, 31);
}

function xlCellToLucky(cell: XLSX_Cell | undefined, warnings: string[]): Cell | null {
  if (cell == null) return null;

  const lucky: Cell = {};
  const display: string | number | undefined = cell.w;

  switch (cell.t) {
    case "n":
      lucky.v =
        typeof cell.v === "number" && Number.isFinite(cell.v) ? cell.v : Number(cell.v);
      if (!Number.isFinite(lucky.v as number)) lucky.v = cell.v ?? 0;
      break;
    case "b":
      lucky.v = !!cell.v;
      break;
    case "s":
      lucky.v =
        typeof cell.v === "string"
          ? cell.v
          : cell.v != null
            ? String(cell.v)
            : "";
      break;
    case "d":
      if (cell.v instanceof Date) {
        lucky.v = cell.v.toISOString();
        warn(warnings, "部分日期将以 ISO 字符串形式导入以便展示。");
      } else {
        lucky.v = cell.v as never;
      }
      break;
    case "e":
      lucky.v = `#${cell.v ?? "ERROR"}`;
      warn(warnings, "检测到 Excel 错误类型单元格，已转为文本占位。");
      break;
    case "z":
    default:
      lucky.v =
        cell.v != null ? (typeof cell.v === "string" ? cell.v : String(cell.v)) : "";
      if (cell.t && cell.t !== "z") {
        warn(warnings, `检测到单元格类型「${cell.t}」，按降级规则导入。`);
      }
      break;
  }

  lucky.m =
    display ?? (lucky.v == null ? "" : typeof lucky.v === "string" ? lucky.v : String(lucky.v));

  if (cell.f != null && String(cell.f).length > 0) {
    const fStr = String(cell.f);
    lucky.f = fStr.startsWith("=") ? fStr.slice(1) : fStr;
  }

  if (cell.z) {
    lucky.ct = {
      fa: String(cell.z),
      t:
        cell.t === "n"
          ? "n"
          : cell.t === "b"
            ? "b"
            : cell.t === "d"
              ? "d"
              : "s",
    };
  }

  mapBasicExcelStyle(cell, lucky, warnings);

  const hasBorder = xlsxBorderHasSides(getBorderFromStyle(getStyleObject(cell)));

  const rawHref =
    cell.l?.Target || cell.l?.Hyperlink?.Target || cell.l?.href || undefined;

  const result: Cell = lucky;
  let url: string | undefined;
  if (rawHref != null && String(rawHref).length > 0) {
    url = String(rawHref);
    lucky.fc = lucky.fc ?? "rgb(0, 0, 255)";
    lucky.un = lucky.un ?? 1;
  }

  // 存临时字段便于上层写入 Sheet.hyperlink
  if (url) {
    (result as Cell & { __href?: string }).__href = url;
  }

  const isEmptyNow =
    (result.v === "" || result.v == null) &&
    !result.f &&
    !result.__href &&
    !result.bl &&
    !result.it &&
    !result.fs &&
    !result.fc &&
    !result.bg &&
    !hasBorder;

  if (isEmptyNow) return null;

  if (hasBorder && (result.v == null || result.v === "")) {
    result.v = "";
    result.m = result.m ?? "";
  }

  return result;
}

function mapBasicExcelStyle(xc: XLSX_Cell, lucky: Cell, warnings: string[]) {
  const s = getStyleObject(xc);
  if (!s) return;
  try {
    const font = s.font ?? s;
    if (font.bold === true) lucky.bl = 1;
    if (font.italic === true) lucky.it = 1;
    if (font.u === true) lucky.un = 1;
    if (font.strike === true) lucky.cl = 1;
    if (typeof font.name === "string" && font.name.trim() !== "") {
      lucky.ff = font.name;
    }
    if (typeof font.sz === "number" && Number.isFinite(font.sz)) {
      lucky.fs = Math.round(font.sz);
    }
    if (font.color != null) {
      lucky.fc = excelRgbOrFallback(font.color, warnings);
    }

    /** 对齐：与 Toolbar 取值接近（不完全等价于 Excel OOXML）。 */
    const alignment = s.alignment ?? s;
    if (alignment.horizontal) {
      const h = String(alignment.horizontal).toLowerCase();
      if (h === "left") lucky.ht = 1;
      else if (h === "center") lucky.ht = 0;
      else if (h === "right") lucky.ht = 2;
    }
    if (alignment.vertical) {
      const v = String(alignment.vertical).toLowerCase();
      if (v === "top") lucky.vt = 1;
      else if (v === "center") lucky.vt = 0;
      else if (v === "bottom") lucky.vt = 2;
    }
    if (alignment.wrapText === true) lucky.tb = "2";

    const fill = s.fill ?? s;
    if (fill) {
      const pt = (fill.patternType || "").replace(/\s+/g, "").toLowerCase();
      const skipFill =
        pt === "none" || pt === "patternnone";
      if (!skipFill) {
        /** solid / gray125 等：Excel 多在 fgColor 上放展示色 */
        const fgRgb = fill.fgColor != null ? excelRgbOrFallback(fill.fgColor, warnings) : undefined;
        const bgRgb =
          fill.bgColor != null ? excelRgbOrFallback(fill.bgColor, warnings) : undefined;

        let chosen: string | undefined;
        if (pt === "" || pt === "solid") {
          chosen =
            fgRgb && fgRgb !== "#000000"
              ? fgRgb
              : bgRgb ?? (fgRgb && fgRgb === "#000000" ? bgRgb ?? fgRgb : fgRgb ?? bgRgb);
        } else {
          chosen =
            fgRgb && fgRgb !== "#000000" ? fgRgb : bgRgb ?? fgRgb ?? bgRgb;
        }

        /** patternGray125 等常为浅灰且无 rgb，则用近似底色 */
        if (
          chosen === "#000000" &&
          (pt.includes("gray") || pt.includes("grey"))
        ) {
          chosen = "#e7e7e7";
          warn(warnings, "部分图案填充仅能近似映射为浅色块。");
        }

        if (chosen && !(chosen === "#000000" && (pt === "" || pt === "solid"))) {
          lucky.bg = chosen.startsWith("#") ? chosen : normalizeExcelRgb(chosen);
        } else if (
          chosen &&
          chosen !== "#000000" &&
          (pt === "" || pt === "solid")
        ) {
          lucky.bg = chosen.startsWith("#") ? chosen : normalizeExcelRgb(chosen);
        } else if (fgRgb || bgRgb) {
          lucky.bg = (fgRgb && fgRgb !== "#000000") || !bgRgb ? fgRgb! : bgRgb;
        }
      }
    }
  } catch {
    warn(warnings, "部分样式对象无法解析已跳过。");
  }
}

/** 有填充/边框/对齐但没正文时仍需占位格，以避免「有样式却无单元格」。 */
function xlStyledPlaceholderIfNeeded(xc: XLSX_Cell, warnings: string[]): Cell | null {
  if (!xc?.s) return null;
  if (!xlsxBorderHasSides(getBorderFromStyle(getStyleObject(xc)))) {
    const peek: Cell = { v: "", m: "" };
    mapBasicExcelStyle(xc, peek, warnings);
    const hasPeek =
      peek.bg ||
      peek.fc ||
      peek.fs ||
      peek.bl ||
      peek.it ||
      peek.ht != null ||
      peek.vt != null ||
      peek.tb;
    if (!hasPeek) return null;
  }

  const stub: Cell = { v: "", m: "" };
  mapBasicExcelStyle(xc, stub, warnings);
  return stub;
}

type RowColSpec =
  | { hpt?: number; hidden?: boolean; wpx?: number; width?: number }

function pushRowLengthsFromSpec(spec: RowColSpec, idx: number, out: Record<string, number>) {
  if (spec.hidden) return;
  if (typeof spec.hpt === "number" && spec.hpt > 0 && Number.isFinite(idx) && idx >= 0) {
    out[String(idx)] = Math.round((spec.hpt * 96) / 72);
  }
}

function pushColWidthsFromSpec(spec: RowColSpec, idx: number, out: Record<string, number>) {
  if (spec.hidden) return;
  if (!Number.isFinite(idx) || idx < 0) return;
  if (typeof spec.wpx === "number" && spec.wpx > 0) {
    out[String(idx)] = Math.round(spec.wpx);
  } else if (typeof spec.width === "number" && spec.width > 0) {
    out[String(idx)] = Math.round(spec.width * 7 + 5);
  }
}

function mapRowLengths(rows: Record<string | number, RowColSpec> | RowColSpec[] | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  if (!rows) return out;
  if (Array.isArray(rows)) {
    rows.forEach((spec, idx) => {
      if (!spec || typeof spec !== "object") return;
      pushRowLengthsFromSpec(spec, idx, out);
    });
    return out;
  }
  Object.entries(rows).forEach(([k, spec]) => {
    if (!spec || typeof spec !== "object") return;
    pushRowLengthsFromSpec(spec as RowColSpec, Number(k), out);
  });
  return out;
}

function mapColWidths(cols: Record<string | number, RowColSpec> | RowColSpec[] | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  if (!cols) return out;
  if (Array.isArray(cols)) {
    cols.forEach((spec, idx) => {
      if (!spec || typeof spec !== "object") return;
      pushColWidthsFromSpec(spec as RowColSpec, idx, out);
    });
    return out;
  }
  Object.entries(cols).forEach(([k, spec]) => {
    if (!spec || typeof spec !== "object") return;
    pushColWidthsFromSpec(spec as RowColSpec, Number(k), out);
  });
  return out;
}

/**
 * Parses a local `.xlsx` / `.xls` file into Dty Lucky `Sheet[]`.
 */
export async function parseExcelFile(file: File): Promise<{ sheets: Sheet[]; warnings: string[] }> {
  const warnings: string[] = [];

  if (!file.size) throw new Error("文件为空");

  const lower = file.name.toLowerCase();
  const extOk =
    lower.endsWith(".xlsx") ||
    lower.endsWith(".xls") ||
    lower.endsWith(".xlsb") ||
    lower.endsWith(".csv");
  const mimeOk = /(excel|spreadsheet|officedocument)/i.test(file.type || "");
  if (!extOk && !mimeOk) {
    warn(warnings, "文件名或 MIME 不常见；仍会尝试按二进制表格解析。");
  }

  const XLSX = await import("xlsx");
  const ab = await file.arrayBuffer();

  let wb;
  try {
    wb = XLSX.read(ab, {
      type: "array",
      cellFormula: true,
      cellNF: true,
      cellDates: true,
      cellStyles: true,
      sheetStubs: true,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`无法解析表格文件：${msg}`);
  }

  if (!wb?.SheetNames?.length) throw new Error("工作簿不包含任何工作表");

  const usedNames = new Set<string>();

  const sheets: Sheet[] = wb.SheetNames.map((sheetName, order) =>
    worksheetToLuckySheet(
      XLSX,
      wb.Sheets[sheetName] as XlsxWorksheet,
      sheetName,
      order,
      usedNames,
      warnings
    )
  );

  return { sheets, warnings };
}

function safeDecodeUri(href: string): string {
  const trimmed = href.trim();
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

function hyperlinkFromExcelHref(
  href: string,
  warnings: string[]
): { linkType: string; linkAddress: string } {
  try {
    const decoded = safeDecodeUri(href);
    if (
      /^https?:\/\//i.test(decoded) ||
      /^mailto:/i.test(decoded) ||
      /^file:\/\//i.test(decoded)
    ) {
      return { linkType: "webpage", linkAddress: decoded };
    }
    const stripped = decoded.replace(/^#/, "");
    const bang = stripped.indexOf("!");
    if (bang > 0) {
      let sheetPart = stripped.slice(0, bang);
      if (sheetPart.startsWith("'") && sheetPart.endsWith("'")) {
        sheetPart = sheetPart.slice(1, -1);
      }
      return { linkType: "sheet", linkAddress: sheetPart };
    }
    warn(
      warnings,
      "部分超链接无法识别为网页或工作表引用，已按网页链接处理（可能无法跳转）。"
    );
    return { linkType: "webpage", linkAddress: decoded };
  } catch {
    warn(warnings, "超链接解析失败，已使用原始字符串。");
    return { linkType: "webpage", linkAddress: href.trim() };
  }
}

function worksheetToLuckySheet(
  XLSX_mod: typeof import("xlsx"),
  ws: XlsxWorksheet,
  rawName: string,
  order: number,
  nameSoFar: Set<string>,
  warnings: string[]
): Sheet {
  const name = safeSheetName(nameSoFar, rawName);
  const id = newSheetId();
  const hyperlink: NonNullable<Sheet["hyperlink"]> = {};

  if (!ws?.["!ref"]) {
    return {
      name,
      id,
      order,
      row: 20,
      column: 12,
      status: order === 0 ? 1 : 0,
    };
  }

  const rng = XLSX_mod.utils.decode_range(ws["!ref"] as string);
  const nrow = Math.max(rng.e.r - rng.s.r + 1, 1);
  const ncol = Math.max(rng.e.c - rng.s.c + 1, 1);

  /** 按 Lucky `config.borderInfo` 逐项登记；由 border 模块在渲染侧合成。 */
  const borderInfoAcc: NonNullable<SheetConfig["borderInfo"]> = [];

  const data: CellMatrix = Array.from({ length: nrow }, () =>
    Array<Cell | null>(ncol).fill(null)
  );

  for (let rr = rng.s.r; rr <= rng.e.r; rr += 1) {
    for (let cc = rng.s.c; cc <= rng.e.c; cc += 1) {
      const addr = XLSX_mod.utils.encode_cell({ r: rr, c: cc });
      const xc = ws[addr] as XLSX_Cell | undefined;
      if (xc == null) continue;
      const r = rr - rng.s.r;
      const c = cc - rng.s.c;
      const styleObj = getStyleObject(xc);
      const borderFromStyle = getBorderFromStyle(styleObj);
      const borderRecordPotential = buildCellBorderRecord(
        r,
        c,
        borderFromStyle,
        warnings
      );
      let cell = xlCellToLucky(xc, warnings);
      if (cell == null) {
        cell = xlStyledPlaceholderIfNeeded(xc, warnings);
      }
      if (!cell) continue;

      const href = (cell as Cell & { __href?: string }).__href;
      if (href) {
        hyperlink[`${r}_${c}`] = hyperlinkFromExcelHref(href, warnings);
        delete (cell as Cell & { __href?: string }).__href;
      }
      data[r][c] = cell;
    }
  }

  let config: SheetConfig | undefined;

  type MergeSpec = {
    s: { r: number; c: number };
    e: { r: number; c: number };
  };
  const merges = (ws["!merges"] ?? []) as MergeSpec[];

  if (Array.isArray(merges) && merges.length > 0) {
    config = { merge: {}, ...(config || {}) };
    merges.forEach((m) => {
      const mr0 = m.s.r - rng.s.r;
      const mc0 = m.s.c - rng.s.c;
      const mr1 = m.e.r - rng.s.r;
      const mc1 = m.e.c - rng.s.c;
      if (
        mr0 < 0 ||
        mc0 < 0 ||
        mr1 >= nrow ||
        mc1 >= ncol ||
        mr0 > mr1 ||
        mc0 > mc1
      ) {
        warn(warnings, "部分合并区域超出可读范围已被忽略。");
        return;
      }

      const rs = mr1 - mr0 + 1;
      const cs = mc1 - mc0 + 1;

      config!.merge![`${mr0}_${mc0}`] = { r: mr0, c: mc0, rs, cs };

      const masterVal = data[mr0][mc0];
      const masterCell =
        masterVal != null ? { ...(masterVal as Cell) } : ({} as Cell);
      masterCell.mc = { r: mr0, c: mc0, rs, cs };

      data[mr0][mc0] = masterCell;

      for (let r = mr0; r <= mr1; r += 1) {
        for (let c = mc0; c <= mc1; c += 1) {
          if (r === mr0 && c === mc0) continue;
          const occupant = data[r][c];
          const cloned = occupant != null ? { ...(occupant as Cell) } : ({} as Cell);
          cloned.mc = { r: mr0, c: mc0 };
          delete cloned.v;
          delete cloned.m;
          delete cloned.f;
          delete cloned.ct;
          delete (cloned as Cell & { __href?: string }).__href;
          data[r][c] = cloned;
        }
      }
    });
  }

  const rowlen = mapRowLengths(ws["!rows"] as RowColSpec[] | Record<string, RowColSpec>);
  const columnlen = mapColWidths(ws["!cols"] as RowColSpec[] | Record<string, RowColSpec>);

  const hasSizing = Object.keys(rowlen).length > 0 || Object.keys(columnlen).length > 0;
  if (hasSizing) {
    config = {
      ...(config || {}),
      rowlen,
      columnlen,
    };
  }

  const frozen = mapFreezeFromPane(ws);
  if (frozen === undefined && (ws["!pane"] ?? ws["!freeze"])) {
    warn(warnings, "检测到可能的冻结视图信息但未解析为标准 pane；冰冻未应用。");
  }

  const sheet: Sheet = {
    name,
    id,
    order,
    row: Math.max(nrow, 40),
    column: Math.max(ncol + 8, 20),
    status: order === 0 ? 1 : 0,
    data,
    config,
    frozen,
    hyperlink: Object.keys(hyperlink).length ? hyperlink : undefined,
  };

  return sheet;
}
