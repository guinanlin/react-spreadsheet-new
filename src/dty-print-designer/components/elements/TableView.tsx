import React from "react";
import { resolveBindingPath } from "../../lib/binding";
import type {
  PrintTemplateDefinition,
  TableElement,
} from "../../schema/types";
import { toTextCSS } from "./preview-style";

export interface TableViewProps {
  element: TableElement;
  definition: PrintTemplateDefinition;
  sampleRecord?: Record<string, unknown>;
}

export function TableView({
  element,
  definition,
  sampleRecord,
}: TableViewProps) {
  const textStyle = toTextCSS(definition, element);
  const rows = resolveRows(element, sampleRecord);
  const displayRows = rows.length > 0 ? rows : placeholderRows(element);
  const totalDeclared = element.columns.reduce(
    (sum, c) => sum + (c.widthMm ?? 0),
    0
  );
  const autoCols = element.columns.filter((c) => !c.widthMm).length;
  const tableWidth = element.box.widthMm;

  const colWidth = (w?: number): string => {
    if (w) return `${w}mm`;
    if (autoCols > 0)
      return `${Math.max(0, (tableWidth - totalDeclared) / autoCols)}mm`;
    return `${tableWidth / Math.max(1, element.columns.length)}mm`;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        ...textStyle,
        overflow: "hidden",
      }}
    >
      {element.showHeader !== false && (
        <div
          style={{
            display: "flex",
            height: `${element.headerHeightMm ?? 8}mm`,
            background: "#f3f4f6",
            borderBottom: "0.2mm solid #9ca3af",
          }}
        >
          {element.columns.map((col) => (
            <div
              key={col.id}
              style={{
                width: colWidth(col.widthMm),
                padding: "0 1mm",
                display: "flex",
                alignItems: "center",
                textAlign: col.align ?? "left",
                justifyContent:
                  col.align === "right"
                    ? "flex-end"
                    : col.align === "center"
                    ? "center"
                    : "flex-start",
                fontWeight: 600,
                borderRight: "0.15mm solid #d1d5db",
              }}
            >
              {col.label}
            </div>
          ))}
        </div>
      )}
      {displayRows.map((row, rIdx) => (
        <div
          key={rIdx}
          style={{
            display: "flex",
            height: `${element.rowHeightMm ?? 6}mm`,
            borderBottom: "0.15mm dashed #e5e7eb",
            color: row._placeholder ? "#9ca3af" : undefined,
          }}
        >
          {element.columns.map((col) => {
            const val = row._placeholder
              ? ""
              : String(
                  resolveBindingPath({ row: row.data }, col.binding) ?? ""
                );
            return (
              <div
                key={col.id}
                style={{
                  width: colWidth(col.widthMm),
                  padding: "0 1mm",
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    col.align === "right"
                      ? "flex-end"
                      : col.align === "center"
                      ? "center"
                      : "flex-start",
                  borderRight: "0.15mm dotted #e5e7eb",
                }}
              >
                {val}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface PreviewRow {
  data: unknown;
  _placeholder: boolean;
}

function resolveRows(
  el: TableElement,
  sampleRecord?: Record<string, unknown>
): PreviewRow[] {
  if (!sampleRecord) return [];
  const rows = resolveBindingPath({ doc: sampleRecord }, el.repeatPath);
  if (!Array.isArray(rows)) return [];
  return rows.map((data) => ({ data, _placeholder: false }));
}

function placeholderRows(el: TableElement): PreviewRow[] {
  const n = el.previewRows ?? 3;
  return new Array(Math.max(0, n)).fill(0).map(() => ({
    data: {},
    _placeholder: true,
  }));
}
