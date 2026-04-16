/**
 * 轻量级模板构建辅助函数，仅供 templates/ 目录内部使用。
 *
 * 让模板定义代码更简洁，不暴露到公开 API。
 */
import { createId } from "../lib/id";
import { createDefaultPage, createEmptyStyles } from "../schema/defaults";
import { SCHEMA_VERSION } from "../schema/constants";
import type {
  BarcodeElement,
  BoxMm,
  DynamicTextElement,
  ImageElement,
  PrintTemplateDefinition,
  RectangleElement,
  StaticTextElement,
  TableColumn,
  TableElement,
} from "../schema/types";

export function newDef(
  name: string,
  partial: Partial<PrintTemplateDefinition> = {}
): PrintTemplateDefinition {
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    name,
    page: createDefaultPage("A4", "portrait"),
    styles: createEmptyStyles(),
    elements: [],
    metadata: { createdAt: now, updatedAt: now },
    ...partial,
  };
}

// ── Element shorthand ────────────────────────────────────────────────────────

export function staticText(
  text: string,
  box: BoxMm,
  opts: Partial<Omit<StaticTextElement, "id" | "type" | "box" | "text">> = {}
): StaticTextElement {
  return { id: createId("st"), type: "static_text", box, text, ...opts };
}

export function dynamicText(
  binding: string,
  box: BoxMm,
  opts: Partial<Omit<DynamicTextElement, "id" | "type" | "box" | "binding">> = {}
): DynamicTextElement {
  return { id: createId("dt"), type: "dynamic_text", box, binding, ...opts };
}

export function rect(
  box: BoxMm,
  opts: Partial<Omit<RectangleElement, "id" | "type" | "box">> = {}
): RectangleElement {
  return {
    id: createId("rc"),
    type: "rectangle",
    box,
    style: { backgroundColor: "#1f2937", borderWidthMm: 0 },
    ...opts,
  };
}

export function image(
  box: BoxMm,
  opts: Partial<Omit<ImageElement, "id" | "type" | "box">> = {}
): ImageElement {
  return { id: createId("img"), type: "image", box, fit: "contain", ...opts };
}

export function table(
  repeatPath: string,
  columns: Array<{ label: string; binding: string; widthMm?: number; align?: "left" | "center" | "right" }>,
  box: BoxMm,
  opts: Partial<Omit<TableElement, "id" | "type" | "box" | "repeatPath" | "columns">> = {}
): TableElement {
  return {
    id: createId("tb"),
    type: "table",
    box,
    repeatPath,
    columns: columns.map((c) => ({
      id: createId("col"),
      label: c.label,
      binding: c.binding,
      widthMm: c.widthMm,
      align: c.align,
    } as TableColumn)),
    headerHeightMm: 8,
    rowHeightMm: 6,
    previewRows: 4,
    showHeader: true,
    styleId: "default",
    ...opts,
  };
}

export function barcode(
  box: BoxMm,
  opts: Partial<Omit<BarcodeElement, "id" | "type" | "box">> = {}
): BarcodeElement {
  return { id: createId("bc"), type: "barcode", box, format: "qrcode", value: "TEMPLATE", ...opts };
}

/** 纵向分隔线（1px 实心横线） */
export function dividerLine(yMm: number, xMm = 15, widthMm = 180): RectangleElement {
  return rect(
    { xMm, yMm, widthMm, heightMm: 0.4 },
    { name: "Divider", style: { backgroundColor: "#1f2937", borderWidthMm: 0 } }
  );
}

/** 左标签 + 右值（同一行） */
export function labelValue(
  label: string,
  binding: string,
  y: number,
  labelX = 15,
  valueX = 55,
  width = 80
): [StaticTextElement, DynamicTextElement] {
  return [
    staticText(label, { xMm: labelX, yMm: y, widthMm: valueX - labelX - 2, heightMm: 6 }, { styleId: "caption" }),
    dynamicText(binding, { xMm: valueX, yMm: y, widthMm: width, heightMm: 6 }, { styleId: "default" }),
  ];
}

/** 右侧双列（label + value，用于表单右栏） */
export function rightLabelValue(
  label: string,
  binding: string,
  y: number,
  labelX = 120,
  valueX = 155
): [StaticTextElement, DynamicTextElement] {
  return [
    staticText(label, { xMm: labelX, yMm: y, widthMm: valueX - labelX - 2, heightMm: 6 }, { styleId: "caption" }),
    dynamicText(binding, { xMm: valueX, yMm: y, widthMm: 40, heightMm: 6 }, { styleId: "default" }),
  ];
}

/** 右侧金额合计行（label + 动态值，加粗） */
export function totalRow(
  label: string,
  binding: string,
  y: number,
  bold = false
): [StaticTextElement, DynamicTextElement] {
  const styleId = bold ? "title" : "default";
  return [
    staticText(label, { xMm: 120, yMm: y, widthMm: 40, heightMm: 7 }, {
      styleId,
      style: bold ? { alignHorizontal: "right" } : { alignHorizontal: "right" },
    }),
    dynamicText(binding, { xMm: 163, yMm: y, widthMm: 32, heightMm: 7 }, {
      styleId,
      style: { alignHorizontal: "right" },
      format: "currency",
    }),
  ];
}
