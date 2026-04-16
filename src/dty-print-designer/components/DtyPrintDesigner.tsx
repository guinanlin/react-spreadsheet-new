import React, { useMemo, useState } from "react";
import type {
  DtyPrintDesignerProps,
  PageSetup,
  PaperSize,
  PrintOrientation,
} from "../types";

const PAPER_DIMENSIONS: Record<PaperSize, { width: number; height: number }> = {
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  Letter: { width: 216, height: 279 },
};

const DEFAULT_PAGE_SETUP: PageSetup = {
  paperSize: "A4",
  orientation: "portrait",
  marginTop: 10,
  marginRight: 10,
  marginBottom: 10,
  marginLeft: 10,
};

/**
 * DtyPrintDesigner - 轻量级打印模板设计器
 */
export function DtyPrintDesigner({
  title: controlledTitle,
  content: controlledContent,
  pageSetup,
  showGrid = true,
  readOnly = false,
  debug = false,
  className,
  onTitleChange,
  onContentChange,
  onPageSetupChange,
  ...props
}: DtyPrintDesignerProps) {
  const [uncontrolledTitle, setUncontrolledTitle] = useState("新建打印模板");
  const [uncontrolledContent, setUncontrolledContent] = useState(
    "在这里输入打印模板内容..."
  );
  const [internalSetup, setInternalSetup] =
    useState<PageSetup>(DEFAULT_PAGE_SETUP);

  const mergedSetup = useMemo<PageSetup>(() => {
    return { ...internalSetup, ...pageSetup };
  }, [internalSetup, pageSetup]);

  const title = controlledTitle ?? uncontrolledTitle;
  const content = controlledContent ?? uncontrolledContent;
  const paper = PAPER_DIMENSIONS[mergedSetup.paperSize];
  const displayWidth =
    mergedSetup.orientation === "portrait" ? paper.width : paper.height;
  const displayHeight =
    mergedSetup.orientation === "portrait" ? paper.height : paper.width;

  if (debug) {
    // eslint-disable-next-line no-console
    console.log("[DtyPrintDesigner] render", { title, mergedSetup, showGrid });
  }

  const updateSetup = (
    key: keyof PageSetup,
    value: PageSetup[keyof PageSetup]
  ) => {
    const next = { ...mergedSetup, [key]: value };
    setInternalSetup(next);
    onPageSetupChange?.(next);
  };

  const handleTitleChange = (next: string) => {
    if (controlledTitle === undefined) {
      setUncontrolledTitle(next);
    }
    onTitleChange?.(next);
  };

  const handleContentChange = (next: string) => {
    if (controlledContent === undefined) {
      setUncontrolledContent(next);
    }
    onContentChange?.(next);
  };

  return (
    <div
      className={["dty-print-designer", className].filter(Boolean).join(" ")}
      {...props}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(240px, 300px) 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 12,
            display: "grid",
            gap: 10,
            background: "#fff",
          }}
        >
          <strong>打印参数</strong>

          <label style={{ display: "grid", gap: 4 }}>
            <span>模板名称</span>
            <input
              value={title}
              disabled={readOnly}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>纸张尺寸</span>
            <select
              value={mergedSetup.paperSize}
              disabled={readOnly}
              onChange={(e) =>
                updateSetup("paperSize", e.target.value as PaperSize)
              }
            >
              <option value="A4">A4</option>
              <option value="A5">A5</option>
              <option value="Letter">Letter</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: 4 }}>
            <span>方向</span>
            <select
              value={mergedSetup.orientation}
              disabled={readOnly}
              onChange={(e) =>
                updateSetup("orientation", e.target.value as PrintOrientation)
              }
            >
              <option value="portrait">纵向</option>
              <option value="landscape">横向</option>
            </select>
          </label>

          <div style={{ display: "grid", gap: 8 }}>
            <span>页边距(mm)</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {(
                [
                  ["marginTop", "上"],
                  ["marginRight", "右"],
                  ["marginBottom", "下"],
                  ["marginLeft", "左"],
                ] as Array<[keyof PageSetup, string]>
              ).map(([key, label]) => (
                <label key={key} style={{ display: "grid", gap: 4 }}>
                  <span>{label}</span>
                  <input
                    type="number"
                    min={0}
                    value={mergedSetup[key]}
                    disabled={readOnly}
                    onChange={(e) => updateSetup(key, Number(e.target.value))}
                  />
                </label>
              ))}
            </div>
          </div>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={showGrid}
              readOnly
              aria-label="是否显示网格线"
            />
            <span>网格显示由 `showGrid` 属性控制</span>
          </label>
        </section>

        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 16,
            background: "#f8fafc",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              width: Math.round(displayWidth * 2),
              minHeight: Math.round(displayHeight * 2),
              border: "1px solid #d1d5db",
              backgroundColor: "#fff",
              backgroundImage: showGrid
                ? "linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)"
                : "none",
              backgroundSize: "20px 20px",
              boxSizing: "border-box",
              padding: `${mergedSetup.marginTop * 2}px ${mergedSetup.marginRight * 2}px ${mergedSetup.marginBottom * 2}px ${mergedSetup.marginLeft * 2}px`,
            }}
          >
            <h3 style={{ marginTop: 0 }}>{title}</h3>
            <textarea
              style={{
                width: "100%",
                minHeight: 200,
                border: "1px dashed #cbd5e1",
                padding: 8,
                resize: "vertical",
                boxSizing: "border-box",
                background: "transparent",
              }}
              disabled={readOnly}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
