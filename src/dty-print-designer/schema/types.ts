import type { PresetPaperSizeId } from "./constants";

/**
 * 目前定义层坐标都以 mm 为单位；屏幕预览与 PDF 渲染再各自换算。
 */
export type Uom = "mm";

export type Orientation = "portrait" | "landscape";

export type PaperSizeId = PresetPaperSizeId | "Custom";

/**
 * 页面级别设置（尺寸、方向、边距、页眉页脚高度）。
 */
export interface PageDefinition {
  uom: Uom;
  paperSizeId: PaperSizeId;
  orientation: Orientation;
  widthMm: number;
  heightMm: number;
  margins: {
    topMm: number;
    rightMm: number;
    bottomMm: number;
    leftMm: number;
  };
  headerHeightMm: number;
  footerHeightMm: number;
}

/**
 * 命名字体 token。元素可通过 styleId -> rule.fontId 引用。
 */
export interface FontToken {
  id: string;
  family?: string;
  sizePt?: number;
  weight?: number;
  italic?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
}

export interface ColorToken {
  id: string;
  value: string;
}

/**
 * 命名样式规则。只覆盖 PDFKit 普遍能对齐的属性，避免陷入 CSS 全子集。
 */
export interface StyleRule {
  id: string;
  fontId?: string;
  colorId?: string;
  backgroundColorId?: string;
  borderColorId?: string;
  border?: {
    widthMm?: number;
    style?: "solid" | "dashed" | "dotted";
  };
  align?: {
    horizontal?: "left" | "center" | "right";
    vertical?: "top" | "middle" | "bottom";
  };
  padding?: {
    topMm?: number;
    rightMm?: number;
    bottomMm?: number;
    leftMm?: number;
  };
}

/**
 * 模板的样式定义集合（字体/颜色/规则）。元素用 `styleId` 引用 rules。
 */
export interface StylesDefinition {
  fonts: Record<string, FontToken>;
  colors: Record<string, ColorToken>;
  rules: Record<string, StyleRule>;
}

/**
 * 元素的内联样式覆盖（高优先级），可选使用。
 */
export interface InlineElementStyle {
  fontFamily?: string;
  fontSizePt?: number;
  fontWeight?: number;
  italic?: boolean;
  lineHeight?: number;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidthMm?: number;
  borderStyle?: "solid" | "dashed" | "dotted";
  alignHorizontal?: "left" | "center" | "right";
  alignVertical?: "top" | "middle" | "bottom";
  paddingMm?: {
    topMm?: number;
    rightMm?: number;
    bottomMm?: number;
    leftMm?: number;
  };
}

/**
 * 元素在页面内的位置与尺寸（mm）。
 * 坐标原点：页面左上角（与屏幕同向；PDFKit 如用左下原点，适配层做一次翻转）。
 */
export interface BoxMm {
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
}

export interface ElementBase {
  id: string;
  /** 元素的业务别名，便于配置与调试 */
  name?: string;
  type: string;
  box: BoxMm;
  zIndex?: number;
  /** 引用 `StylesDefinition.rules` 中的命名规则 */
  styleId?: string;
  /** 内联覆盖样式 */
  style?: InlineElementStyle;
  hidden?: boolean;
}

export interface StaticTextElement extends ElementBase {
  type: "static_text";
  text: string;
}

export interface DynamicTextElement extends ElementBase {
  type: "dynamic_text";
  /** 点路径绑定，例如 `doc.invoice_no` */
  binding: string;
  prefix?: string;
  suffix?: string;
  fallback?: string;
  format?: "text" | "number" | "currency" | "date";
  formatOptions?: Record<string, unknown>;
}

export interface RectangleElement extends ElementBase {
  type: "rectangle";
}

export type ImageFit = "contain" | "cover" | "fill" | "none";

export interface ImageElement extends ElementBase {
  type: "image";
  src?: string;
  /** 当绑定字段为图片 URL/附件路径时使用 */
  binding?: string;
  fit?: ImageFit;
  alt?: string;
}

export interface TableColumn {
  id: string;
  label: string;
  /** 相对 row 的绑定，如 `row.item_code` */
  binding: string;
  widthMm?: number;
  align?: "left" | "center" | "right";
}

export interface TableElement extends ElementBase {
  type: "table";
  /** 迭代路径，如 `doc.items` */
  repeatPath: string;
  columns: TableColumn[];
  headerHeightMm?: number;
  rowHeightMm?: number;
  /** 当没有 sampleRecord 时，画布上展示的占位行数 */
  previewRows?: number;
  showHeader?: boolean;
}

export type BarcodeFormat =
  | "qrcode"
  | "code128"
  | "code39"
  | "ean13"
  | "ean8"
  | "upc";

export interface BarcodeElement extends ElementBase {
  type: "barcode";
  format: BarcodeFormat;
  value?: string;
  binding?: string;
}

export type TemplateElement =
  | StaticTextElement
  | DynamicTextElement
  | RectangleElement
  | ImageElement
  | TableElement
  | BarcodeElement;

export type TemplateElementType = TemplateElement["type"];

/**
 * 字段元数据节点。
 *
 * 可在设计器内部定义（保存在模板中），也可由外部业务侧注入。
 *   - `name`      点路径末端段，如 `invoice_no`
 *   - `label`     UI 显示名称
 *   - `fieldtype` 类型标记（Data | Currency | Date | Float | Int | Text | Table | Link | ...）
 *   - `children`  子表/嵌套字段（Table 类型时适用，绑定前缀为 `row.`）
 */
export interface DataField {
  name: string;
  label?: string;
  fieldtype?: string;
  children?: DataField[];
  meta?: Record<string, unknown>;
}

export interface DataSourceRef {
  id?: string;
  label?: string;
  /** 便于业务侧语义化标记（例如 ERPNext 的 DocType） */
  doctype?: string;
  /** 数据源说明文字（设计器内可编辑） */
  description?: string;
  /**
   * 字段 schema 定义（设计器内编辑，随模板一起保存）。
   * 外部若通过 props.fields 注入，优先使用 props.fields。
   */
  fields?: DataField[];
  /**
   * 样例数据（随模板保存，用于画布动态字段预览）。
   * 外部若通过 props.sampleRecord 注入，优先使用 props.sampleRecord。
   */
  sampleData?: Record<string, unknown>;
}

export interface PrintTemplateMetadata {
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  notes?: string;
  [key: string]: unknown;
}

/**
 * 设计器产物：纯定义层（布局 + 样式 + 字段绑定）。
 *
 * - 不含业务真实数据。
 * - 不负责生成 PDF；由外部「合并服务」+「PDFKit 适配层」完成。
 */
export interface PrintTemplateDefinition {
  schemaVersion: string;
  name: string;
  dataSource?: DataSourceRef;
  page: PageDefinition;
  styles: StylesDefinition;
  elements: TemplateElement[];
  /** 预留给高阶用户的脚本扩展（例如 Jinja 片段），v1 不内置执行 */
  userExtension?: {
    jinja?: string;
    [key: string]: unknown;
  };
  metadata?: PrintTemplateMetadata;
}
