/**
 * 内置模板注册表。
 *
 * 仅 import 本文件即可触发所有内置模板的注册（副作用模块）。
 * 在 DtyPrintDesigner 组件首次渲染前 import 一次即可。
 */
export {
  registerBuiltinTemplate,
  getBuiltinTemplates,
  getBuiltinTemplateById,
} from "./registry";
export type { BuiltinTemplate, BuiltinTemplateCategory } from "./registry";

// 触发内置模板注册（副作用）
import "./salesInvoice";
import "./salesOrder";
import "./purchaseOrder";
import "./purchaseInvoice";
import "./journalEntry";
