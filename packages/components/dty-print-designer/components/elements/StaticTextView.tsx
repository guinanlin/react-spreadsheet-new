import React from "react";
import type {
  PrintTemplateDefinition,
  StaticTextElement,
} from "../../schema/types";
import { toTextCSS } from "./preview-style";

export interface StaticTextViewProps {
  element: StaticTextElement;
  definition: PrintTemplateDefinition;
}

export function StaticTextView({ element, definition }: StaticTextViewProps) {
  return (
    <div
      style={{
        ...toTextCSS(definition, element),
        width: "100%",
        height: "100%",
        padding: "1px 2px",
      }}
    >
      {element.text}
    </div>
  );
}
