import type { PrintTemplateDefinition } from "../schema/types";

/**
 * 内置模板的元信息 + 工厂函数。
 *
 * `factory` 每次调用都返回一份新的深拷贝 definition，确保编辑器加载后
 * 不会意外污染原始模板。
 */
export interface BuiltinTemplate {
  id: string;
  name: string;
  description: string;
  category: BuiltinTemplateCategory;
  /** 标签（用于搜索与展示） */
  tags?: string[];
  factory: () => PrintTemplateDefinition;
}

export type BuiltinTemplateCategory =
  | "sales"
  | "purchase"
  | "accounting"
  | "all";

const registry: BuiltinTemplate[] = [];

export function registerBuiltinTemplate(tpl: BuiltinTemplate) {
  registry.push(tpl);
}

export function getBuiltinTemplates(
  category?: BuiltinTemplateCategory
): BuiltinTemplate[] {
  if (!category || category === "all") return [...registry];
  return registry.filter((t) => t.category === category);
}

export function getBuiltinTemplateById(
  id: string
): BuiltinTemplate | undefined {
  return registry.find((t) => t.id === id);
}
