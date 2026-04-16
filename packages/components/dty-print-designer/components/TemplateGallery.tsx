import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_PX_PER_MM } from "../schema/constants";
import type { PrintTemplateDefinition, TemplateElement } from "../schema/types";
import {
  getBuiltinTemplates,
  type BuiltinTemplate,
  type BuiltinTemplateCategory,
} from "../templates/registry";
// 触发内置模板注册
import "../templates/index";

export interface TemplateGalleryProps {
  open: boolean;
  onClose: () => void;
  /**
   * 用户确认选择某个内置模板时回调。
   * 调用方负责把 definition 加载到设计器（dispatch SET_TEMPLATE）。
   */
  onSelect: (definition: PrintTemplateDefinition, tpl: BuiltinTemplate) => void;
  /** 当前模板是否已有内容（有内容时选择新模板会弹确认提示） */
  hasContent?: boolean;
  /** 额外的自定义模板（业务侧注入，与内置模板合并展示） */
  extraTemplates?: BuiltinTemplate[];
}

const CATEGORIES: { id: BuiltinTemplateCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sales", label: "Sales" },
  { id: "purchase", label: "Purchase" },
  { id: "accounting", label: "Accounting" },
];

const THUMBNAIL_SCALE = 0.22;

export function TemplateGallery({
  open,
  onClose,
  onSelect,
  hasContent,
  extraTemplates = [],
}: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] =
    useState<BuiltinTemplateCategory>("all");
  const [search, setSearch] = useState("");
  const [confirmTpl, setConfirmTpl] = useState<BuiltinTemplate | null>(null);

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConfirmTpl(null);
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // 重置状态
  useEffect(() => {
    if (open) {
      setActiveCategory("all");
      setSearch("");
      setConfirmTpl(null);
    }
  }, [open]);

  const allTemplates = useMemo(() => {
    return [...getBuiltinTemplates(), ...extraTemplates];
  }, [extraTemplates]);

  const filtered = useMemo(() => {
    let list = allTemplates;
    if (activeCategory !== "all") {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allTemplates, activeCategory, search]);

  const handleCardClick = useCallback(
    (tpl: BuiltinTemplate) => {
      if (hasContent) {
        setConfirmTpl(tpl);
      } else {
        onSelect(tpl.factory(), tpl);
        onClose();
      }
    },
    [hasContent, onSelect, onClose]
  );

  const handleConfirm = useCallback(() => {
    if (!confirmTpl) return;
    onSelect(confirmTpl.factory(), confirmTpl);
    setConfirmTpl(null);
    onClose();
  }, [confirmTpl, onSelect, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.5)",
          zIndex: 1000,
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choose a template"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          width: "min(900px, 96vw)",
          maxHeight: "86vh",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 20px 60px rgba(15,23,42,0.22)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>
              Choose a Template
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
              Select a built-in template to get started quickly. You can customise everything after loading.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: 20,
              lineHeight: 1,
              padding: "2px 4px",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Search + Category filters */}
        <div
          style={{
            padding: "12px 24px",
            borderBottom: "1px solid #f3f4f6",
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="search"
            placeholder="Search templates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: "0 0 220px",
              padding: "6px 12px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 13,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "5px 14px",
                  border: "1px solid",
                  borderColor:
                    activeCategory === cat.id ? "#7b4b57" : "#e5e7eb",
                  background:
                    activeCategory === cat.id ? "#7b4b57" : "#fff",
                  color: activeCategory === cat.id ? "#fff" : "#374151",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>
            {filtered.length} template{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Template Grid */}
        <div
          style={{
            overflowY: "auto",
            padding: "20px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
            flex: 1,
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "48px 0",
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              No templates found.
            </div>
          ) : (
            filtered.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                tpl={tpl}
                onClick={() => handleCardClick(tpl)}
              />
            ))
          )}
        </div>
      </div>

      {/* Confirm overlay */}
      {confirmTpl && (
        <ConfirmDialog
          templateName={confirmTpl.name}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmTpl(null)}
        />
      )}
    </>
  );
}

// ── Template card ─────────────────────────────────────────────────────────────

function TemplateCard({
  tpl,
  onClick,
}: {
  tpl: BuiltinTemplate;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const definition = useMemo(() => tpl.factory(), [tpl]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Use template: ${tpl.name}`}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `2px solid ${hovered ? "#7b4b57" : "#e5e7eb"}`,
        borderRadius: 10,
        overflow: "hidden",
        cursor: "pointer",
        background: "#fff",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
        boxShadow: hovered ? "0 4px 16px rgba(123,75,87,0.15)" : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          background: "#f8fafc",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 8px",
          height: 160,
          overflow: "hidden",
        }}
      >
        <TemplateThumbnail definition={definition} />
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: 10,
              background: categoryBg(tpl.category),
              color: categoryColor(tpl.category),
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {tpl.category}
          </span>
        </div>
        <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#111827" }}>
          {tpl.name}
        </h3>
        <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>
          {tpl.description}
        </p>
        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: "#9ca3af",
          }}
        >
          {definition.elements.length} elements
        </div>
      </div>
    </div>
  );
}

// ── Thumbnail renderer ────────────────────────────────────────────────────────

function TemplateThumbnail({
  definition,
}: {
  definition: PrintTemplateDefinition;
}) {
  const pxMm = DEFAULT_PX_PER_MM * THUMBNAIL_SCALE;
  const w = definition.page.widthMm * pxMm;
  const h = definition.page.heightMm * pxMm;

  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        background: "#fff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {definition.elements.map((el) => (
        <ThumbnailElement key={el.id} el={el} pxMm={pxMm} />
      ))}
    </div>
  );
}

function ThumbnailElement({
  el,
  pxMm,
}: {
  el: TemplateElement;
  pxMm: number;
}) {
  const left = el.box.xMm * pxMm;
  const top = el.box.yMm * pxMm;
  const width = el.box.widthMm * pxMm;
  const height = Math.max(el.box.heightMm * pxMm, 1.5);

  const base: React.CSSProperties = {
    position: "absolute",
    left,
    top,
    width,
    height,
    borderRadius: 1,
  };

  switch (el.type) {
    case "static_text":
      return (
        <div
          style={{
            ...base,
            background:
              el.styleId === "title"
                ? "#1f2937"
                : el.styleId === "caption"
                ? "#d1d5db"
                : "#9ca3af",
          }}
        />
      );
    case "dynamic_text":
      return (
        <div
          style={{
            ...base,
            background:
              el.styleId === "title"
                ? "#7b4b57"
                : "#bfdbfe",
            opacity: 0.85,
          }}
        />
      );
    case "rectangle": {
      const bg = el.style?.backgroundColor;
      const bw = el.style?.borderWidthMm ?? 0;
      if (bg) {
        return <div style={{ ...base, background: bg }} />;
      }
      return (
        <div
          style={{
            ...base,
            background: "transparent",
            border: bw > 0 ? `1px solid ${el.style?.borderColor ?? "#374151"}` : "none",
          }}
        />
      );
    }
    case "image":
      return (
        <div
          style={{
            ...base,
            background: "#f3f4f6",
            border: "1px dashed #d1d5db",
          }}
        />
      );
    case "table":
      return (
        <div style={{ ...base, overflow: "hidden" }}>
          {/* Header strip */}
          <div
            style={{ height: 3, background: "#4b5563", width: "100%" }}
          />
          {/* Row stripes */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 2,
                background: i % 2 === 0 ? "#e5e7eb" : "#f9fafb",
                width: "100%",
                marginTop: 1,
              }}
            />
          ))}
        </div>
      );
    case "barcode":
      return (
        <div
          style={{
            ...base,
            background: "#f9fafb",
            border: "1px dashed #d1d5db",
          }}
        />
      );
    default:
      return null;
  }
}

// ── Confirm dialog ────────────────────────────────────────────────────────────

function ConfirmDialog({
  templateName,
  onConfirm,
  onCancel,
}: {
  templateName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div
        onClick={onCancel}
        style={{ position: "fixed", inset: 0, zIndex: 1100 }}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1101,
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 8px 32px rgba(15,23,42,0.2)",
          padding: "24px 28px",
          width: 360,
        }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#111827" }}>
          Replace current template?
        </h3>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
          Loading <strong>{templateName}</strong> will replace the current template and all
          unsaved changes will be lost.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#374151",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              border: "none",
              background: "#7b4b57",
              color: "#fff",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Load Template
          </button>
        </div>
      </div>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function categoryBg(cat: BuiltinTemplateCategory): string {
  switch (cat) {
    case "sales": return "#dcfce7";
    case "purchase": return "#dbeafe";
    case "accounting": return "#fef9c3";
    default: return "#f3f4f6";
  }
}

function categoryColor(cat: BuiltinTemplateCategory): string {
  switch (cat) {
    case "sales": return "#166534";
    case "purchase": return "#1e40af";
    case "accounting": return "#854d0e";
    default: return "#374151";
  }
}
