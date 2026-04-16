import React from "react";
import {
  Image as ImageIcon,
  LayoutTemplate,
  MousePointer2,
  QrCode,
  Square,
  Table2,
  Tag,
  Type,
} from "lucide-react";
import type { ToolId } from "../state/reducer";

export interface ToolbarProps {
  activeTool: ToolId;
  onToolChange: (tool: ToolId) => void;
  disabledTools?: Partial<Record<ToolId, boolean>>;
  readOnly?: boolean;
  /** 点击「Import Template」按钮的回调 */
  onImportTemplate?: () => void;
}

interface ToolEntry {
  id: ToolId;
  label: string;
  shortcut?: string;
  icon: React.ComponentType<{ size?: number }>;
}

const TOOLS: ToolEntry[] = [
  { id: "pointer", label: "选择 (V)", shortcut: "V", icon: MousePointer2 },
  { id: "static_text", label: "静态文本 (T)", shortcut: "T", icon: Type },
  { id: "dynamic_text", label: "动态字段 (D)", shortcut: "D", icon: Tag },
  { id: "rectangle", label: "矩形 (R)", shortcut: "R", icon: Square },
  { id: "image", label: "图片 (I)", shortcut: "I", icon: ImageIcon },
  { id: "table", label: "表格", icon: Table2 },
  { id: "barcode", label: "条码/二维码", icon: QrCode },
];

export function PrintDesignerToolbar({
  activeTool,
  onToolChange,
  disabledTools,
  readOnly,
  onImportTemplate,
}: ToolbarProps) {
  return (
    <div
      aria-label="Print designer toolbar"
      style={{
        width: 48,
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "8px 0",
        gap: 4,
        flexShrink: 0,
      }}
    >
      {/* Import Template 按钮（顶部，特殊强调色） */}
      {!readOnly && (
        <button
          type="button"
          title="Import Template (从内置模板导入)"
          aria-label="Import Template"
          onClick={onImportTemplate}
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            background: "transparent",
            color: "#7b4b57",
            transition: "background 120ms ease",
            marginBottom: 4,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#f9f0f2";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <LayoutTemplate size={18} />
        </button>
      )}

      {/* 分隔线 */}
      {!readOnly && (
        <div
          style={{
            width: 28,
            height: 1,
            background: "#e5e7eb",
            marginBottom: 4,
          }}
        />
      )}

      {TOOLS.map((tool) => {
        const isActive = activeTool === tool.id;
        const isDisabled = Boolean(
          readOnly ? tool.id !== "pointer" : disabledTools?.[tool.id]
        );
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            disabled={isDisabled}
            onClick={() => onToolChange(tool.id)}
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              borderRadius: 6,
              cursor: isDisabled ? "not-allowed" : "pointer",
              background: isActive ? "#7b4b57" : "transparent",
              color: isActive ? "#ffffff" : isDisabled ? "#cbd5e1" : "#1f2937",
              transition: "background 120ms ease",
            }}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
