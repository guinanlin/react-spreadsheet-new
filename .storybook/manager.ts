import { addons } from "storybook/manager-api";
import { sanitize } from "storybook/internal/csf";

/**
 * 侧边栏「根节点」默认折叠：只显示一级分组名，子目录需手动展开。
 * collapsedRoots 的值必须是根节点的内部 id（与 title 第一段经 sanitize 后一致）。
 * @see https://storybook.js.org/docs/configure/user-interface/features-and-behavior#sidebar
 */
const ROOT_TITLE_PREFIXES = [
  "DtyLuckySheet",
  "dty-mindmap",
  "DtyInput",
  "Example",
  "ERP Agent",
  "Pivot",
  "Spreadsheet",
  "ProductList",
  "SubjectDevelopment",
] as const;

addons.setConfig({
  sidebar: {
    collapsedRoots: ROOT_TITLE_PREFIXES.map((name) => sanitize(name)),
  },
});
