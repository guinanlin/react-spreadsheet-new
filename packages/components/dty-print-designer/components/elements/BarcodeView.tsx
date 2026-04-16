import React from "react";
import { resolveBindingPath } from "../../lib/binding";
import type { BarcodeElement } from "../../schema/types";

export interface BarcodeViewProps {
  element: BarcodeElement;
  sampleRecord?: Record<string, unknown>;
}

export function BarcodeView({ element, sampleRecord }: BarcodeViewProps) {
  const value = resolveValue(element, sampleRecord);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px dashed #6b7280",
        background: "rgba(107,114,128,0.05)",
        color: "#374151",
        fontSize: 11,
        padding: 4,
        textAlign: "center",
      }}
    >
      <div style={{ fontWeight: 600 }}>{element.format.toUpperCase()}</div>
      <div style={{ marginTop: 2, fontFamily: "monospace", fontSize: 10 }}>
        {value || `{{ ${element.binding ?? "value"} }}`}
      </div>
    </div>
  );
}

function resolveValue(
  el: BarcodeElement,
  sampleRecord?: Record<string, unknown>
): string {
  if (el.value) return el.value;
  if (!el.binding || !sampleRecord) return "";
  const v = resolveBindingPath({ doc: sampleRecord }, el.binding);
  return v == null ? "" : String(v);
}
