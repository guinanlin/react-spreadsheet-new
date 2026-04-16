/**
 * dty-print-designer - 打印模板「定义层」设计器。
 *
 * 只产出 PrintTemplateDefinition（布局 + 样式 + 字段绑定），
 * 不内置 PDF 生成；后续由外部 PDFKit 适配层消费
 * `mergeTemplateWithData` 产生的 ResolvedDocument。
 */
export { DtyPrintDesigner } from "./components/DtyPrintDesigner";

// Component-facing props & helpers.
export type {
  DtyPrintDesignerProps,
  DataField,
  DataSourceDescriptor,
  RequestFieldsFn,
} from "./types";

// Schema (可序列化的定义层协议).
export {
  SCHEMA_VERSION,
  PAPER_DIMENSIONS_MM,
  DEFAULT_PX_PER_MM,
  createDefaultTemplate,
  createDefaultPage,
  createEmptyStyles,
  createElement,
  DEFAULT_BOX_SIZE_MM,
  serializeTemplate,
  deserializeTemplate,
  migrateToLatest,
} from "./schema";
export type {
  PrintTemplateDefinition,
  PrintTemplateMetadata,
  PageDefinition,
  PaperSizeId,
  PresetPaperSizeId,
  Orientation,
  Uom,
  StylesDefinition,
  StyleRule,
  FontToken,
  ColorToken,
  InlineElementStyle,
  BoxMm,
  ElementBase,
  TemplateElement,
  TemplateElementType,
  StaticTextElement,
  DynamicTextElement,
  RectangleElement,
  ImageElement,
  ImageFit,
  TableElement,
  TableColumn,
  BarcodeElement,
  BarcodeFormat,
  DataSourceRef,
} from "./schema";

// Runtime utilities (供 PDFKit 适配层 / 前端预览复用).
export {
  mergeTemplateWithData,
  mmToPt,
  ptToMm,
  mmToPx,
  pxToMm,
  resolveBindingPath,
  isValidBindingPath,
  createId,
} from "./lib";
export type {
  MergeOptions,
  ResolvedDocument,
  ResolvedPage,
  DrawOp,
  TextDrawOp,
  RectDrawOp,
  ImageDrawOp,
  BarcodeDrawOp,
  BoxPt,
  ResolvedTextStyle,
  ResolvedBorderStyle,
  ResolvedFill,
} from "./lib";

// Reducer surface for power users (e.g. embedding in bigger editors).
export type {
  DesignerState,
  DesignerAction,
  ToolId,
} from "./state/reducer";
export { reducer as designerReducer } from "./state/reducer";

// Built-in template registry.
export {
  getBuiltinTemplates,
  getBuiltinTemplateById,
  registerBuiltinTemplate,
} from "./templates/registry";
export type {
  BuiltinTemplate,
  BuiltinTemplateCategory,
} from "./templates/registry";

// TemplateGallery (can also be used as a standalone picker).
export { TemplateGallery } from "./components/TemplateGallery";
export type { TemplateGalleryProps } from "./components/TemplateGallery";
