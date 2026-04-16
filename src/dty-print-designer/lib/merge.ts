import { resolveBindingPath } from "./binding";
import { mmToPt } from "./units";
import type {
  BarcodeElement,
  BoxMm,
  DynamicTextElement,
  ImageElement,
  PrintTemplateDefinition,
  RectangleElement,
  StaticTextElement,
  StyleRule,
  TableElement,
  TemplateElement,
} from "../schema/types";

/**
 * 合并后的坐标盒（单位：pt）。
 *
 * 设计器侧坐标系为「页面左上为原点、Y 轴向下」；
 * PDFKit 常见是「左下为原点、Y 轴向上」，因此 `coordinateSystem` 字段
 * 用来显式标记，由 PDFKit 适配层一次性翻转。
 */
export interface BoxPt {
  xPt: number;
  yPt: number;
  widthPt: number;
  heightPt: number;
}

export interface ResolvedTextStyle {
  fontFamily?: string;
  fontSizePt?: number;
  fontWeight?: number;
  italic?: boolean;
  color?: string;
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  lineHeight?: number;
}

export interface ResolvedBorderStyle {
  widthPt: number;
  color: string;
  style: "solid" | "dashed" | "dotted";
}

export interface ResolvedFill {
  color: string;
}

export interface TextDrawOp {
  type: "text";
  at: BoxPt;
  text: string;
  style: ResolvedTextStyle;
  sourceElementId: string;
}

export interface RectDrawOp {
  type: "rect";
  at: BoxPt;
  border?: ResolvedBorderStyle;
  fill?: ResolvedFill;
  sourceElementId: string;
}

export interface ImageDrawOp {
  type: "image";
  at: BoxPt;
  src: string;
  fit?: "contain" | "cover" | "fill" | "none";
  sourceElementId: string;
}

export interface BarcodeDrawOp {
  type: "barcode";
  at: BoxPt;
  format: string;
  value: string;
  sourceElementId: string;
}

export type DrawOp = TextDrawOp | RectDrawOp | ImageDrawOp | BarcodeDrawOp;

export interface ResolvedPage {
  widthPt: number;
  heightPt: number;
  drawOps: DrawOp[];
}

export interface ResolvedDocument {
  schemaVersion: string;
  /** PDFKit 等渲染器消费的绘制指令坐标系标记 */
  coordinateSystem: "top-left-y-down";
  unit: "pt";
  pages: ResolvedPage[];
}

export interface MergeOptions {
  /** 每页 table 最多展开的行数；默认为全部。 */
  maxTableRowsPerPage?: number;
  /** 即使 binding 为 undefined 也保留占位绘制（画布预览用）。 */
  keepUnresolved?: boolean;
}

/**
 * 把「模板定义」+「业务数据」合并为一串贴近绘制的指令序列，
 * 便于 PDFKit 适配层直接执行（也可用于 HTML/Canvas 预览）。
 */
export function mergeTemplateWithData(
  def: PrintTemplateDefinition,
  record: unknown,
  options: MergeOptions = {}
): ResolvedDocument {
  const pageW = mmToPt(def.page.widthMm);
  const pageH = mmToPt(def.page.heightMm);
  const rootScope = { doc: record };
  const drawOps: DrawOp[] = [];

  const orderedElements = [...def.elements].sort(
    (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)
  );
  for (const el of orderedElements) {
    if (el.hidden) continue;
    drawOps.push(...resolveElement(el, def, rootScope, options));
  }

  return {
    schemaVersion: def.schemaVersion,
    coordinateSystem: "top-left-y-down",
    unit: "pt",
    pages: [{ widthPt: pageW, heightPt: pageH, drawOps }],
  };
}

function resolveElement(
  el: TemplateElement,
  def: PrintTemplateDefinition,
  scope: unknown,
  options: MergeOptions
): DrawOp[] {
  switch (el.type) {
    case "static_text":
      return [resolveStaticText(el, def)];
    case "dynamic_text":
      return resolveDynamicText(el, def, scope, options);
    case "rectangle":
      return [resolveRectangle(el, def)];
    case "image":
      return resolveImage(el, def, scope, options);
    case "barcode":
      return resolveBarcode(el, def, scope, options);
    case "table":
      return resolveTable(el, def, scope, options);
    default:
      return [];
  }
}

function boxToPt(box: BoxMm): BoxPt {
  return {
    xPt: mmToPt(box.xMm),
    yPt: mmToPt(box.yMm),
    widthPt: mmToPt(box.widthMm),
    heightPt: mmToPt(box.heightMm),
  };
}

interface ResolvedElementStyle {
  text: ResolvedTextStyle;
  border?: ResolvedBorderStyle;
  fill?: ResolvedFill;
}

function resolveStyle(
  def: PrintTemplateDefinition,
  el: TemplateElement
): ResolvedElementStyle {
  const rule: StyleRule | undefined = el.styleId
    ? def.styles.rules[el.styleId]
    : undefined;
  const text: ResolvedTextStyle = {};
  if (rule?.fontId) {
    const font = def.styles.fonts[rule.fontId];
    if (font) {
      text.fontFamily = font.family;
      text.fontSizePt = font.sizePt;
      text.fontWeight = font.weight;
      text.italic = font.italic;
      text.lineHeight = font.lineHeight;
    }
  }
  if (rule?.colorId) {
    const color = def.styles.colors[rule.colorId];
    if (color) text.color = color.value;
  }
  if (rule?.align?.horizontal) text.align = rule.align.horizontal;
  if (rule?.align?.vertical) text.verticalAlign = rule.align.vertical;

  const inline = el.style;
  if (inline) {
    if (inline.fontFamily) text.fontFamily = inline.fontFamily;
    if (inline.fontSizePt != null) text.fontSizePt = inline.fontSizePt;
    if (inline.fontWeight != null) text.fontWeight = inline.fontWeight;
    if (inline.italic != null) text.italic = inline.italic;
    if (inline.color) text.color = inline.color;
    if (inline.lineHeight != null) text.lineHeight = inline.lineHeight;
    if (inline.alignHorizontal) text.align = inline.alignHorizontal;
    if (inline.alignVertical) text.verticalAlign = inline.alignVertical;
  }

  let border: ResolvedBorderStyle | undefined;
  if (rule?.border?.widthMm) {
    const color = rule.borderColorId
      ? def.styles.colors[rule.borderColorId]?.value
      : undefined;
    border = {
      widthPt: mmToPt(rule.border.widthMm),
      color: color ?? "#000000",
      style: rule.border.style ?? "solid",
    };
  }
  if (inline?.borderWidthMm) {
    border = {
      widthPt: mmToPt(inline.borderWidthMm),
      color: inline.borderColor ?? border?.color ?? "#000000",
      style: inline.borderStyle ?? border?.style ?? "solid",
    };
  }

  let fill: ResolvedFill | undefined;
  if (rule?.backgroundColorId) {
    const color = def.styles.colors[rule.backgroundColorId];
    if (color) fill = { color: color.value };
  }
  if (inline?.backgroundColor) fill = { color: inline.backgroundColor };

  return { text, border, fill };
}

function resolveStaticText(
  el: StaticTextElement,
  def: PrintTemplateDefinition
): TextDrawOp {
  const style = resolveStyle(def, el);
  return {
    type: "text",
    at: boxToPt(el.box),
    text: el.text ?? "",
    style: style.text,
    sourceElementId: el.id,
  };
}

function resolveDynamicText(
  el: DynamicTextElement,
  def: PrintTemplateDefinition,
  scope: unknown,
  options: MergeOptions
): DrawOp[] {
  const style = resolveStyle(def, el);
  const raw = resolveBindingPath(scope, el.binding);
  const missing = raw === undefined || raw === null || raw === "";
  if (missing && !options.keepUnresolved && el.fallback == null) {
    return [];
  }
  const stringValue = formatValue(raw, el);
  const displayed = missing && el.fallback != null
    ? el.fallback
    : `${el.prefix ?? ""}${stringValue}${el.suffix ?? ""}`;
  return [
    {
      type: "text",
      at: boxToPt(el.box),
      text: displayed,
      style: style.text,
      sourceElementId: el.id,
    },
  ];
}

function formatValue(raw: unknown, el: DynamicTextElement): string {
  if (raw === undefined || raw === null) return "";
  if (el.format === "number" || el.format === "currency") {
    const n = Number(raw);
    if (!Number.isFinite(n)) return String(raw);
    if (el.format === "currency") {
      const currency =
        (el.formatOptions?.["currency"] as string | undefined) ?? "USD";
      try {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency,
        }).format(n);
      } catch {
        return n.toFixed(2);
      }
    }
    const digits =
      (el.formatOptions?.["digits"] as number | undefined) ?? 2;
    return n.toFixed(digits);
  }
  if (el.format === "date") {
    const d = raw instanceof Date ? raw : new Date(String(raw));
    if (isNaN(d.getTime())) return String(raw);
    return d.toISOString().slice(0, 10);
  }
  return String(raw);
}

function resolveRectangle(
  el: RectangleElement,
  def: PrintTemplateDefinition
): RectDrawOp {
  const style = resolveStyle(def, el);
  return {
    type: "rect",
    at: boxToPt(el.box),
    border: style.border,
    fill: style.fill,
    sourceElementId: el.id,
  };
}

function resolveImage(
  el: ImageElement,
  _def: PrintTemplateDefinition,
  scope: unknown,
  options: MergeOptions
): DrawOp[] {
  let src = el.src;
  if (!src && el.binding) {
    const value = resolveBindingPath(scope, el.binding);
    if (typeof value === "string") src = value;
  }
  if (!src && !options.keepUnresolved) return [];
  return [
    {
      type: "image",
      at: boxToPt(el.box),
      src: src ?? "",
      fit: el.fit,
      sourceElementId: el.id,
    },
  ];
}

function resolveBarcode(
  el: BarcodeElement,
  _def: PrintTemplateDefinition,
  scope: unknown,
  options: MergeOptions
): DrawOp[] {
  let value = el.value;
  if (!value && el.binding) {
    const resolved = resolveBindingPath(scope, el.binding);
    if (resolved != null) value = String(resolved);
  }
  if (!value && !options.keepUnresolved) return [];
  return [
    {
      type: "barcode",
      at: boxToPt(el.box),
      format: el.format,
      value: value ?? "",
      sourceElementId: el.id,
    },
  ];
}

function resolveTable(
  el: TableElement,
  def: PrintTemplateDefinition,
  scope: unknown,
  options: MergeOptions
): DrawOp[] {
  const resolvedRows = resolveBindingPath(scope, el.repeatPath);
  const rowList: unknown[] = Array.isArray(resolvedRows) ? resolvedRows : [];
  const totalRows =
    rowList.length > 0
      ? Math.min(
          rowList.length,
          options.maxTableRowsPerPage ?? rowList.length
        )
      : options.keepUnresolved
      ? Math.max(0, el.previewRows ?? 0)
      : 0;

  const { xMm, yMm, widthMm } = el.box;
  const headerH = el.showHeader === false ? 0 : el.headerHeightMm ?? 8;
  const rowH = el.rowHeightMm ?? 6;

  const style = resolveStyle(def, el);
  const cols = el.columns;

  const declaredWidth = cols.reduce((sum, c) => sum + (c.widthMm ?? 0), 0);
  const autoColumns = cols.filter((c) => !c.widthMm).length;
  const autoWidth =
    autoColumns > 0
      ? Math.max(0, (widthMm - declaredWidth) / autoColumns)
      : 0;
  const columnWidth = (w?: number) =>
    w != null
      ? w
      : autoColumns > 0
      ? autoWidth
      : widthMm / Math.max(1, cols.length);

  const ops: DrawOp[] = [];

  if (el.showHeader !== false && headerH > 0) {
    ops.push({
      type: "rect",
      at: boxToPt({ xMm, yMm, widthMm, heightMm: headerH }),
      border:
        style.border ?? {
          widthPt: mmToPt(0.2),
          color: "#111827",
          style: "solid",
        },
      fill: { color: "#f3f4f6" },
      sourceElementId: `${el.id}:header_bg`,
    });
    let cursor = xMm;
    for (const col of cols) {
      const w = columnWidth(col.widthMm);
      ops.push({
        type: "text",
        at: boxToPt({
          xMm: cursor + 1,
          yMm: yMm + 1,
          widthMm: Math.max(0, w - 2),
          heightMm: Math.max(0, headerH - 2),
        }),
        text: col.label,
        style: { ...style.text, align: col.align ?? style.text.align },
        sourceElementId: `${el.id}:col_header:${col.id}`,
      });
      cursor += w;
    }
  }

  for (let r = 0; r < totalRows; r++) {
    const hasRow = r < rowList.length;
    const rowScope = hasRow
      ? { ...(scope as Record<string, unknown>), row: rowList[r] }
      : scope;
    const rowY = yMm + headerH + r * rowH;
    let cursor = xMm;
    for (const col of cols) {
      const w = columnWidth(col.widthMm);
      const val = hasRow ? resolveBindingPath(rowScope, col.binding) : "";
      const displayed = val == null ? "" : String(val);
      ops.push({
        type: "text",
        at: boxToPt({
          xMm: cursor + 1,
          yMm: rowY + 1,
          widthMm: Math.max(0, w - 2),
          heightMm: Math.max(0, rowH - 2),
        }),
        text: displayed,
        style: { ...style.text, align: col.align ?? style.text.align },
        sourceElementId: `${el.id}:row_${r}:${col.id}`,
      });
      cursor += w;
    }
    ops.push({
      type: "rect",
      at: boxToPt({ xMm, yMm: rowY, widthMm, heightMm: rowH }),
      border: {
        widthPt: mmToPt(0.15),
        color: "#e5e7eb",
        style: hasRow ? "solid" : "dashed",
      },
      sourceElementId: `${el.id}:row_border_${r}`,
    });
  }

  return ops;
}
