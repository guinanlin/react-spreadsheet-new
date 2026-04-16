import type React from "react";
import type {
  DataField,
  PageDefinition,
  PrintTemplateDefinition,
  TemplateElement,
  TemplateElementType,
} from "./schema/types";
import type { BuiltinTemplate } from "./templates/registry";

// DataField 已定义于 schema/types.ts，此处只做类型重导出
export type { DataField };

/**
 * 数据源下拉选择的条目。
 *
 * 设计器不主动请求数据源列表；由业务侧提供。
 */
export interface DataSourceDescriptor {
  id: string;
  label?: string;
  doctype?: string;
}

export type RequestFieldsFn = (
  sourceId: string
) => Promise<DataField[]> | DataField[];

export interface DtyPrintDesignerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 受控模式：完整模板 JSON。优先级高于 defaultValue */
  value?: PrintTemplateDefinition;
  /** 非受控模式的初始模板 JSON */
  defaultValue?: PrintTemplateDefinition;
  onChange?: (definition: PrintTemplateDefinition) => void;
  /** 点击 Save 时触发，不做任何持久化 */
  onSave?: (definition: PrintTemplateDefinition) => void;

  /** 可供切换的数据源列表（可选） */
  dataSources?: DataSourceDescriptor[];
  activeDataSourceId?: string;
  onDataSourceChange?: (id: string | undefined) => void;
  /** 当前数据源字段元数据；与 onRequestFields 二选一 */
  fields?: DataField[];
  /** 异步获取字段元数据的回调（由 activeDataSourceId 变化触发） */
  onRequestFields?: RequestFieldsFn;

  /**
   * 样例数据，用于画布上动态字段占位预览；
   * 不会改变「定义层」的职责。
   */
  sampleRecord?: Record<string, unknown>;

  /** 只读（预览）模式 */
  readOnly?: boolean;
  /** 画布是否显示网格（默认 true） */
  showGrid?: boolean;
  /** 画布缩放比例，默认 1 */
  zoom?: number;
  debug?: boolean;

  /**
   * 是否显示「Import Template」按钮（默认 true）。
   * 设为 false 可完全隐藏内置模板导入入口。
   */
  showTemplateGallery?: boolean;
  /**
   * 业务侧额外注入的自定义模板，与内置模板合并展示在 Gallery 中。
   * 可用于提供企业私有模板。
   */
  extraTemplates?: BuiltinTemplate[];
  /**
   * 用户从 Gallery 选择并加载模板后的回调（可选）。
   * 主要用于外部感知 "哪个模板被加载了"。
   * 注意：加载动作由设计器内部完成，无需在此回调中做任何操作。
   */
  onTemplateImported?: (tpl: BuiltinTemplate, definition: PrintTemplateDefinition) => void;
}

export type {
  PageDefinition,
  PrintTemplateDefinition,
  TemplateElement,
  TemplateElementType,
};
