import React from "react";
import { resolveBindingPath } from "../../lib/binding";
import type { ImageElement } from "../../schema/types";

export interface ImageViewProps {
  element: ImageElement;
  sampleRecord?: Record<string, unknown>;
}

export function ImageView({ element, sampleRecord }: ImageViewProps) {
  const src = resolveSrc(element, sampleRecord);

  if (!src) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #94a3b8",
          background: "rgba(148,163,184,0.08)",
          fontSize: 11,
          color: "#64748b",
          padding: 4,
          textAlign: "center",
        }}
      >
        {element.binding ? `{{ ${element.binding} }}` : "Image"}
      </div>
    );
  }

  const objectFit: React.CSSProperties["objectFit"] =
    element.fit === "fill"
      ? "fill"
      : element.fit === "cover"
      ? "cover"
      : element.fit === "none"
      ? "none"
      : "contain";

  return (
    <img
      src={src}
      alt={element.alt ?? ""}
      style={{
        width: "100%",
        height: "100%",
        objectFit,
        pointerEvents: "none",
      }}
    />
  );
}

function resolveSrc(
  el: ImageElement,
  sampleRecord?: Record<string, unknown>
): string | undefined {
  if (el.src) return el.src;
  if (!el.binding || !sampleRecord) return undefined;
  const v = resolveBindingPath({ doc: sampleRecord }, el.binding);
  return typeof v === "string" ? v : undefined;
}
