import { createId } from "../lib/id";
import {
  PAPER_DIMENSIONS_MM,
  PresetPaperSizeId,
  SCHEMA_VERSION,
} from "./constants";
import type {
  BarcodeElement,
  BoxMm,
  DynamicTextElement,
  ImageElement,
  Orientation,
  PageDefinition,
  PrintTemplateDefinition,
  RectangleElement,
  StaticTextElement,
  StylesDefinition,
  TableElement,
  TemplateElement,
  TemplateElementType,
} from "./types";

export function createDefaultPage(
  paperSizeId: PresetPaperSizeId = "A4",
  orientation: Orientation = "portrait"
): PageDefinition {
  const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[paperSizeId];
  const [w, h] =
    orientation === "portrait" ? [widthMm, heightMm] : [heightMm, widthMm];
  return {
    uom: "mm",
    paperSizeId,
    orientation,
    widthMm: w,
    heightMm: h,
    margins: { topMm: 10, rightMm: 10, bottomMm: 10, leftMm: 10 },
    headerHeightMm: 0,
    footerHeightMm: 0,
  };
}

export function createEmptyStyles(): StylesDefinition {
  return {
    fonts: {
      body: {
        id: "body",
        family: "Inter, Arial, sans-serif",
        sizePt: 10,
      },
      title: {
        id: "title",
        family: "Inter, Arial, sans-serif",
        sizePt: 14,
        weight: 600,
      },
      caption: {
        id: "caption",
        family: "Inter, Arial, sans-serif",
        sizePt: 8,
      },
    },
    colors: {
      text: { id: "text", value: "#111827" },
      muted: { id: "muted", value: "#6b7280" },
      border: { id: "border", value: "#d1d5db" },
    },
    rules: {
      default: { id: "default", fontId: "body", colorId: "text" },
      title: { id: "title", fontId: "title", colorId: "text" },
      caption: { id: "caption", fontId: "caption", colorId: "muted" },
    },
  };
}

export function createDefaultTemplate(
  name = "Untitled Print Template"
): PrintTemplateDefinition {
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    name,
    page: createDefaultPage(),
    styles: createEmptyStyles(),
    elements: [],
    metadata: { createdAt: now, updatedAt: now },
  };
}

/**
 * 每种元素的默认 box 尺寸（mm）。
 */
export const DEFAULT_BOX_SIZE_MM: Record<
  TemplateElementType,
  { widthMm: number; heightMm: number }
> = {
  static_text: { widthMm: 60, heightMm: 8 },
  dynamic_text: { widthMm: 60, heightMm: 8 },
  rectangle: { widthMm: 60, heightMm: 30 },
  image: { widthMm: 40, heightMm: 30 },
  table: { widthMm: 160, heightMm: 40 },
  barcode: { widthMm: 30, heightMm: 30 },
};

/**
 * 构建默认元素。调用方通常提供 box（点击位置 + 默认尺寸）。
 */
export function createElement(
  type: TemplateElementType,
  box: BoxMm,
  init: Partial<TemplateElement> = {}
): TemplateElement {
  const id = createId(type);
  switch (type) {
    case "static_text": {
      const el: StaticTextElement = {
        id,
        type: "static_text",
        box,
        text: "Static Text",
        styleId: "default",
        ...(init as Partial<StaticTextElement>),
      };
      return el;
    }
    case "dynamic_text": {
      const el: DynamicTextElement = {
        id,
        type: "dynamic_text",
        box,
        binding: "doc.name",
        styleId: "default",
        ...(init as Partial<DynamicTextElement>),
      };
      return el;
    }
    case "rectangle": {
      const el: RectangleElement = {
        id,
        type: "rectangle",
        box,
        style: { borderWidthMm: 0.2, borderColor: "#111827" },
        ...(init as Partial<RectangleElement>),
      };
      return el;
    }
    case "image": {
      const el: ImageElement = {
        id,
        type: "image",
        box,
        fit: "contain",
        ...(init as Partial<ImageElement>),
      };
      return el;
    }
    case "table": {
      const el: TableElement = {
        id,
        type: "table",
        box,
        repeatPath: "doc.items",
        columns: [
          {
            id: createId("col"),
            label: "Item",
            binding: "row.item_name",
            widthMm: 60,
          },
          {
            id: createId("col"),
            label: "Qty",
            binding: "row.qty",
            widthMm: 20,
            align: "right",
          },
          {
            id: createId("col"),
            label: "Amount",
            binding: "row.amount",
            widthMm: 30,
            align: "right",
          },
        ],
        headerHeightMm: 8,
        rowHeightMm: 6,
        previewRows: 3,
        showHeader: true,
        styleId: "default",
        ...(init as Partial<TableElement>),
      };
      return el;
    }
    case "barcode": {
      const el: BarcodeElement = {
        id,
        type: "barcode",
        box,
        format: "qrcode",
        value: "TEMPLATE",
        ...(init as Partial<BarcodeElement>),
      };
      return el;
    }
    default: {
      const exhaustive: never = type;
      throw new Error(`Unknown element type: ${String(exhaustive)}`);
    }
  }
}
