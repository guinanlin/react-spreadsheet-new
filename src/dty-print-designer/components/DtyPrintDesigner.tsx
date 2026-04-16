import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { createDefaultTemplate } from "../schema/defaults";
import type { PrintTemplateDefinition } from "../schema/types";
import {
  reducer,
  type DesignerAction,
  type DesignerState,
  type ToolId,
} from "../state/reducer";
import type { DataField, DtyPrintDesignerProps } from "../types";
import { PrintDesignerToolbar } from "./PrintDesignerToolbar";
import { PrintDesignerCanvas } from "./PrintDesignerCanvas";
import { PrintDesignerInspector } from "./PrintDesignerInspector";
import { TemplateGallery } from "./TemplateGallery";
import type { BuiltinTemplate } from "../templates/registry";

const TOOL_SHORTCUTS: Record<string, ToolId> = {
  v: "pointer",
  t: "static_text",
  d: "dynamic_text",
  r: "rectangle",
  i: "image",
};

/**
 * DtyPrintDesigner - 打印模板「定义层」设计器。
 *
 * 本组件只产出 `PrintTemplateDefinition`（布局 + 样式 + 字段绑定）；
 * 不内置打印 / PDF 导出。最终 PDF 由外部 `PDFKit` 适配层消费
 * `mergeTemplateWithData(definition, record)` 的结果。
 *
 * @example
 * ```tsx
 * <DtyPrintDesigner
 *   defaultValue={createDefaultTemplate()}
 *   fields={fields}
 *   sampleRecord={sample}
 *   onSave={(def) => console.log(JSON.stringify(def, null, 2))}
 * />
 * ```
 */
export function DtyPrintDesigner({
  value,
  defaultValue,
  onChange,
  onSave,
  dataSources,
  activeDataSourceId,
  onDataSourceChange,
  fields: controlledFields,
  onRequestFields,
  sampleRecord,
  readOnly,
  showGrid = true,
  zoom = 1,
  debug,
  showTemplateGallery = true,
  extraTemplates,
  onTemplateImported,
  className,
  style,
  ...rest
}: DtyPrintDesignerProps) {
  const initial: DesignerState = useMemo(() => {
    const seed =
      value ?? defaultValue ?? createDefaultTemplate("New Print Template");
    return {
      template: seed,
      activeTool: "pointer",
      selectedId: null,
    };
  }, []);

  const [state, dispatch] = useReducer(reducer, initial);
  const isFirst = useRef(true);
  const lastEmitted = useRef<PrintTemplateDefinition | null>(null);

  useEffect(() => {
    if (!value) return;
    if (value !== state.template) {
      dispatch({ type: "SET_TEMPLATE", template: value });
    }
  }, [value]);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      lastEmitted.current = state.template;
      return;
    }
    if (lastEmitted.current === state.template) return;
    lastEmitted.current = state.template;
    onChange?.(state.template);
  }, [state.template, onChange]);

  // Async fetch fields when data source changes.
  const [asyncFields, setAsyncFields] = useState<DataField[] | undefined>(
    undefined
  );
  useEffect(() => {
    if (controlledFields || !onRequestFields || !activeDataSourceId) {
      setAsyncFields(undefined);
      return;
    }
    let cancelled = false;
    Promise.resolve(onRequestFields(activeDataSourceId))
      .then((result) => {
        if (!cancelled) setAsyncFields(result);
      })
      .catch(() => {
        if (!cancelled) setAsyncFields(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [activeDataSourceId, controlledFields, onRequestFields]);

  // Priority: external controlled > async fetched > template-internal definition
  const fields =
    controlledFields ??
    asyncFields ??
    state.template.dataSource?.fields;

  // Priority: external sampleRecord > template-internal sampleData
  const effectiveSampleRecord =
    sampleRecord ??
    (state.template.dataSource?.sampleData as Record<string, unknown> | undefined);

  // Keyboard shortcuts.
  useEffect(() => {
    if (readOnly) return;
    const onKey = (e: KeyboardEvent) => {
      if (isInTextInput(e.target)) return;
      const k = e.key.toLowerCase();
      if (k === "delete" || k === "backspace") {
        if (state.selectedId) {
          e.preventDefault();
          dispatch({ type: "REMOVE_ELEMENT", id: state.selectedId });
        }
        return;
      }
      if (k === "escape") {
        dispatch({ type: "SELECT", id: null });
        dispatch({ type: "SET_TOOL", tool: "pointer" });
        return;
      }
      const tool = TOOL_SHORTCUTS[k];
      if (tool) {
        e.preventDefault();
        dispatch({ type: "SET_TOOL", tool });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [readOnly, state.selectedId]);

  const selected = useMemo(
    () =>
      state.template.elements.find((el) => el.id === state.selectedId) ?? null,
    [state.template.elements, state.selectedId]
  );

  const handleSave = useCallback(() => {
    onSave?.(state.template);
  }, [onSave, state.template]);

  const handleToolChange = useCallback(
    (tool: ToolId) => dispatch({ type: "SET_TOOL", tool }),
    []
  );

  // ── Template Gallery ───────────────────────────────────────────────────────
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleTemplateSelect = useCallback(
    (definition: PrintTemplateDefinition, tpl: BuiltinTemplate) => {
      dispatch({ type: "SET_TEMPLATE", template: definition });
      dispatch({ type: "SELECT", id: null });
      dispatch({ type: "SET_TOOL", tool: "pointer" });
      onTemplateImported?.(tpl, definition);
    },
    [onTemplateImported]
  );

  const hasContent = state.template.elements.length > 0;

  if (debug) {
    // eslint-disable-next-line no-console
    console.log("[DtyPrintDesigner] render", {
      tool: state.activeTool,
      selectedId: state.selectedId,
      elements: state.template.elements.length,
    });
  }

  return (
    <>
      <div
        className={["dty-print-designer", className].filter(Boolean).join(" ")}
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          minHeight: 560,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      >
        <PrintDesignerToolbar
          activeTool={state.activeTool}
          onToolChange={handleToolChange}
          readOnly={readOnly}
          onImportTemplate={
            showTemplateGallery && !readOnly
              ? () => setGalleryOpen(true)
              : undefined
          }
        />
        <PrintDesignerCanvas
          definition={state.template}
          activeTool={state.activeTool}
          selectedId={state.selectedId}
          sampleRecord={effectiveSampleRecord}
          readOnly={readOnly}
          showGrid={showGrid}
          zoom={zoom}
          dispatch={dispatch as React.Dispatch<DesignerAction>}
        />
        <PrintDesignerInspector
          definition={state.template}
          selected={selected}
          dataSources={dataSources}
          activeDataSourceId={activeDataSourceId}
          onDataSourceChange={onDataSourceChange}
          fields={fields}
          readOnly={readOnly}
          onSave={handleSave}
          dispatch={dispatch as React.Dispatch<DesignerAction>}
        />
      </div>

      {showTemplateGallery && !readOnly && (
        <TemplateGallery
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          onSelect={handleTemplateSelect}
          hasContent={hasContent}
          extraTemplates={extraTemplates}
        />
      )}
    </>
  );
}

function isInTextInput(target: EventTarget | null): boolean {
  if (!target) return false;
  const t = target as HTMLElement;
  const tag = t.tagName?.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    t.isContentEditable === true
  );
}
