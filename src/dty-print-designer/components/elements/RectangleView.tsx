import React from "react";
import type { RectangleElement } from "../../schema/types";
import { toBorderAndFillCSS } from "./preview-style";

export interface RectangleViewProps {
  element: RectangleElement;
}

export function RectangleView({ element }: RectangleViewProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        ...toBorderAndFillCSS(element),
      }}
    />
  );
}
