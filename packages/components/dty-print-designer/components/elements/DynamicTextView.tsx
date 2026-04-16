import React from "react";
import { resolveBindingPath } from "../../lib/binding";
import type {
  DynamicTextElement,
  PrintTemplateDefinition,
} from "../../schema/types";
import { toTextCSS } from "./preview-style";

export interface DynamicTextViewProps {
  element: DynamicTextElement;
  definition: PrintTemplateDefinition;
  sampleRecord?: Record<string, unknown>;
}

export function DynamicTextView({
  element,
  definition,
  sampleRecord,
}: DynamicTextViewProps) {
  const resolved = resolvePreview(element, sampleRecord);
  const hasResolved = resolved !== undefined;
  return (
    <div
      title={element.binding}
      style={{
        ...toTextCSS(definition, element),
        width: "100%",
        height: "100%",
        padding: "1px 2px",
        background: hasResolved ? "transparent" : "rgba(59,130,246,0.08)",
        outline: hasResolved ? "none" : "1px dashed rgba(59,130,246,0.45)",
      }}
    >
      {hasResolved
        ? `${element.prefix ?? ""}${resolved}${element.suffix ?? ""}`
        : element.fallback ?? `{{ ${element.binding} }}`}
    </div>
  );
}

function resolvePreview(
  el: DynamicTextElement,
  sampleRecord?: Record<string, unknown>
): string | undefined {
  if (!sampleRecord) return undefined;
  const raw = resolveBindingPath({ doc: sampleRecord }, el.binding);
  if (raw === undefined || raw === null || raw === "") return undefined;
  return String(raw);
}
