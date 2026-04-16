import type { CSSProperties } from "react";
import type {
  InlineElementStyle,
  PrintTemplateDefinition,
  TemplateElement,
} from "../../schema/types";

/**
 * 把元素的命名样式 + 内联覆盖合并成屏幕预览用的 CSSProperties。
 *
 * 只处理文本相关视觉，不负责边框 / 填充（由 RectangleView 单独处理）。
 */
export function toTextCSS(
  def: PrintTemplateDefinition,
  el: TemplateElement
): CSSProperties {
  const rule = el.styleId ? def.styles.rules[el.styleId] : undefined;
  const font = rule?.fontId ? def.styles.fonts[rule.fontId] : undefined;
  const color = rule?.colorId ? def.styles.colors[rule.colorId] : undefined;
  const inline: InlineElementStyle | undefined = el.style;

  return {
    fontFamily: inline?.fontFamily ?? font?.family ?? "inherit",
    fontSize: `${inline?.fontSizePt ?? font?.sizePt ?? 10}pt`,
    fontWeight: inline?.fontWeight ?? font?.weight ?? 400,
    fontStyle: (inline?.italic ?? font?.italic) ? "italic" : "normal",
    color: inline?.color ?? color?.value ?? "#111827",
    textAlign:
      (inline?.alignHorizontal ?? rule?.align?.horizontal ?? "left") as
        | "left"
        | "center"
        | "right",
    lineHeight: inline?.lineHeight ?? font?.lineHeight ?? 1.2,
    overflow: "hidden",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    boxSizing: "border-box",
  };
}

export function toBorderAndFillCSS(el: TemplateElement): CSSProperties {
  const inline = el.style;
  const css: CSSProperties = {};

  if (inline?.borderWidthMm != null && inline.borderWidthMm > 0) {
    css.border = `${mmToCssMm(inline.borderWidthMm)} ${
      inline.borderStyle ?? "solid"
    } ${inline.borderColor ?? "#111827"}`;
  } else if (inline?.borderWidthMm === 0) {
    css.border = "none";
  }

  if (inline?.backgroundColor) {
    css.backgroundColor = inline.backgroundColor;
  }
  return css;
}

function mmToCssMm(mm: number): string {
  return `${mm}mm`;
}
