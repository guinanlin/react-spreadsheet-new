import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PAPER_DIMENSIONS_MM } from "../schema/constants";
import type { PresetPaperSizeId } from "../schema/constants";
import type {
  BarcodeElement,
  DataField,
  DynamicTextElement,
  ImageElement,
  PaperSizeId,
  PrintTemplateDefinition,
  RectangleElement,
  StaticTextElement,
  TableColumn,
  TableElement,
  TemplateElement,
} from "../schema/types";
import { resolveBindingPath } from "../lib/binding";
import type { DataSourceDescriptor } from "../types";
import type { DesignerAction } from "../state/reducer";
import { createId } from "../lib/id";

// ── Public prop types ──────────────────────────────────────────────────────

export interface PrintDesignerInspectorProps {
  definition: PrintTemplateDefinition;
  selected?: TemplateElement | null;
  dataSources?: DataSourceDescriptor[];
  activeDataSourceId?: string;
  onDataSourceChange?: (id: string | undefined) => void;
  /** 外部注入的字段元数据（优先级高于模板内部定义）*/
  fields?: DataField[];
  readOnly?: boolean;
  onSave?: () => void;
  dispatch: React.Dispatch<DesignerAction>;
}

// ── Shared style constants ─────────────────────────────────────────────────

const S_SECTION: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: "1px solid #e5e7eb",
};

const S_LABEL: React.CSSProperties = {
  fontSize: 11,
  color: "#64748b",
  marginBottom: 4,
  display: "block",
};

const S_INPUT: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  fontSize: 13,
  border: "1px solid #d1d5db",
  borderRadius: 4,
  boxSizing: "border-box",
  background: "#fff",
};

const S_GRID2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 8,
};

type InspectorTab = "template" | "datasource";

// ── Root Inspector component ───────────────────────────────────────────────

export function PrintDesignerInspector({
  definition,
  selected,
  dataSources,
  activeDataSourceId,
  onDataSourceChange,
  fields,
  readOnly,
  onSave,
  dispatch,
}: PrintDesignerInspectorProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("template");

  // When user selects an element on canvas, auto-switch to Template tab
  useEffect(() => {
    if (selected) setActiveTab("template");
  }, [selected?.id]);

  return (
    <aside
      aria-label="Print designer inspector"
      style={{
        width: 300,
        background: "#fff",
        borderLeft: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        minHeight: 0,
      }}
    >
      {/* ── Fixed header: name + save ── */}
      <HeaderBar
        templateName={definition.name}
        readOnly={readOnly}
        onNameChange={(name) => dispatch({ type: "SET_NAME", name })}
        onSave={onSave}
      />

      {/* ── Tab bar ── */}
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #e5e7eb",
          flexShrink: 0,
        }}
      >
        {(["template", "datasource"] as InspectorTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "9px 4px 8px",
              border: "none",
              background: "transparent",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              color: activeTab === tab ? "#7b4b57" : "#6b7280",
              borderBottom: `2px solid ${activeTab === tab ? "#7b4b57" : "transparent"}`,
              marginBottom: -2,
              transition: "color 120ms",
            }}
          >
            {tab === "template" ? "Template" : "Data Source"}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        {activeTab === "template" ? (
          <TemplateTabContent
            definition={definition}
            selected={selected}
            dataSources={dataSources}
            activeDataSourceId={activeDataSourceId}
            onDataSourceChange={onDataSourceChange}
            fields={fields}
            readOnly={readOnly}
            dispatch={dispatch}
          />
        ) : (
          <DataSourceTabContent
            definition={definition}
            readOnly={readOnly}
            dispatch={dispatch}
          />
        )}
      </div>
    </aside>
  );
}

// ── Header bar ─────────────────────────────────────────────────────────────

function HeaderBar({
  templateName,
  readOnly,
  onNameChange,
  onSave,
}: {
  templateName: string;
  readOnly?: boolean;
  onNameChange: (name: string) => void;
  onSave?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(templateName);
  const nameAtEditStartRef = useRef(templateName);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Escape 会卸载 input，可能随后触发 blur；忽略该次 commit，避免覆盖撤销 */
  const skipNextBlurCommitRef = useRef(false);

  useEffect(() => {
    if (!editing) setDraft(templateName);
  }, [templateName, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commitName = () => {
    if (skipNextBlurCommitRef.current) {
      skipNextBlurCommitRef.current = false;
      return;
    }
    const next = draft.trim() || templateName || "Untitled";
    onNameChange(next);
    setEditing(false);
  };

  const cancelEdit = () => {
    skipNextBlurCommitRef.current = true;
    onNameChange(nameAtEditStartRef.current);
    setDraft(nameAtEditStartRef.current);
    setEditing(false);
  };

  const beginEdit = () => {
    if (readOnly) return;
    skipNextBlurCommitRef.current = false;
    nameAtEditStartRef.current = templateName;
    setDraft(templateName);
    setEditing(true);
  };

  const titleStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        borderBottom: "1px solid #e5e7eb",
        flexShrink: 0,
      }}
    >
      {readOnly ? (
        <span aria-label="Template name" style={titleStyle} title={templateName}>
          {templateName}
        </span>
      ) : editing ? (
        <input
          ref={inputRef}
          aria-label="Template name"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              cancelEdit();
            }
          }}
          style={{
            ...S_INPUT,
            flex: 1,
            minWidth: 0,
            border: "1px solid #7b4b57",
            padding: "4px 8px",
            fontSize: 14,
            fontWeight: 600,
            background: "#fff",
          }}
        />
      ) : (
        <span
          role="button"
          tabIndex={0}
          aria-label="Template name"
          title="双击可重命名"
          onDoubleClick={beginEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              beginEdit();
            }
          }}
          style={{
            ...titleStyle,
            cursor: "text",
            borderRadius: 4,
            padding: "2px 4px",
            margin: "-2px -4px",
            outline: "none",
          }}
        >
          {templateName}
        </span>
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={readOnly}
        style={{
          background: "#7b4b57",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: 4,
          cursor: readOnly ? "not-allowed" : "pointer",
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        Save
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 1: Template
// ══════════════════════════════════════════════════════════════════════════════

function TemplateTabContent({
  definition,
  selected,
  dataSources,
  activeDataSourceId,
  onDataSourceChange,
  fields,
  readOnly,
  dispatch,
}: Omit<PrintDesignerInspectorProps, "onSave">) {
  const effectiveFields =
    fields ?? definition.dataSource?.fields;

  return selected ? (
    <ElementSection
      element={selected}
      definition={definition}
      fields={effectiveFields}
      readOnly={readOnly}
      dispatch={dispatch}
    />
  ) : (
    <>
      <PageSettingsSection
        definition={definition}
        dataSources={dataSources}
        activeDataSourceId={activeDataSourceId}
        onDataSourceChange={onDataSourceChange}
        readOnly={readOnly}
        dispatch={dispatch}
      />
      {effectiveFields && effectiveFields.length > 0 && (
        <FieldsHintPanel fields={effectiveFields} />
      )}
    </>
  );
}

// ── Page Settings ─────────────────────────────────────────────────────────

function PageSettingsSection({
  definition,
  dataSources,
  activeDataSourceId,
  onDataSourceChange,
  readOnly,
  dispatch,
}: {
  definition: PrintTemplateDefinition;
  dataSources?: DataSourceDescriptor[];
  activeDataSourceId?: string;
  onDataSourceChange?: (id: string | undefined) => void;
  readOnly?: boolean;
  dispatch: React.Dispatch<DesignerAction>;
}) {
  const page = definition.page;
  const updatePage = (patch: Partial<typeof page>) =>
    dispatch({ type: "UPDATE_PAGE", page: patch });
  const updateMargins = (patch: Partial<typeof page.margins>) =>
    dispatch({
      type: "UPDATE_PAGE",
      page: { margins: { ...page.margins, ...patch } },
    });

  const applyPaperSize = (id: PaperSizeId) => {
    if (id === "Custom") { updatePage({ paperSizeId: "Custom" }); return; }
    const preset = PAPER_DIMENSIONS_MM[id as PresetPaperSizeId];
    const [w, h] =
      page.orientation === "portrait"
        ? [preset.widthMm, preset.heightMm]
        : [preset.heightMm, preset.widthMm];
    updatePage({ paperSizeId: id, widthMm: w, heightMm: h });
  };

  const applyOrientation = (orientation: typeof page.orientation) => {
    if (orientation === page.orientation) return;
    updatePage({ orientation, widthMm: page.heightMm, heightMm: page.widthMm });
  };

  return (
    <>
      {dataSources && dataSources.length > 0 && (
        <div style={S_SECTION}>
          <SectionTitle>Custom Data</SectionTitle>
          <label style={S_LABEL}>Data Source</label>
          <select
            disabled={readOnly}
            value={activeDataSourceId ?? ""}
            onChange={(e) => onDataSourceChange?.(e.target.value || undefined)}
            style={S_INPUT}
          >
            <option value="">(none)</option>
            {dataSources.map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.label ?? ds.doctype ?? ds.id}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={S_SECTION}>
        <SectionTitle>Page Settings</SectionTitle>
        <div style={{ marginBottom: 10 }}>
          <label style={S_LABEL}>Page Size</label>
          <select
            disabled={readOnly}
            value={page.paperSizeId}
            onChange={(e) => applyPaperSize(e.target.value as PaperSizeId)}
            style={S_INPUT}
          >
            <option value="A4">A4</option>
            <option value="A5">A5</option>
            <option value="Letter">Letter</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div style={{ ...S_GRID2, marginBottom: 10 }}>
          <div>
            <label style={S_LABEL}>Width</label>
            <NumberField value={page.widthMm} unit="mm" disabled={readOnly}
              onChange={(v) => updatePage({ widthMm: v, paperSizeId: "Custom" })} />
          </div>
          <div>
            <label style={S_LABEL}>Height</label>
            <NumberField value={page.heightMm} unit="mm" disabled={readOnly}
              onChange={(v) => updatePage({ heightMm: v, paperSizeId: "Custom" })} />
          </div>
        </div>
        <div style={{ marginBottom: 4 }}>
          <label style={S_LABEL}>Orientation</label>
          <div style={{ display: "flex", gap: 6 }}>
            {(["portrait", "landscape"] as const).map((opt) => (
              <button key={opt} type="button" disabled={readOnly}
                onClick={() => applyOrientation(opt)}
                style={{
                  flex: 1, padding: "6px 0", border: "1px solid #d1d5db",
                  background: page.orientation === opt ? "#7b4b57" : "#fff",
                  color: page.orientation === opt ? "#fff" : "#1f2937",
                  borderRadius: 4, cursor: readOnly ? "not-allowed" : "pointer", fontSize: 12,
                }}
              >{opt}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={S_SECTION}>
        <SectionTitle>Page Margins</SectionTitle>
        <div style={S_GRID2}>
          <LabeledNumberField label="Top" value={page.margins.topMm} unit="mm" disabled={readOnly}
            onChange={(v) => updateMargins({ topMm: v })} />
          <LabeledNumberField label="Bottom" value={page.margins.bottomMm} unit="mm" disabled={readOnly}
            onChange={(v) => updateMargins({ bottomMm: v })} />
          <LabeledNumberField label="Left" value={page.margins.leftMm} unit="mm" disabled={readOnly}
            onChange={(v) => updateMargins({ leftMm: v })} />
          <LabeledNumberField label="Right" value={page.margins.rightMm} unit="mm" disabled={readOnly}
            onChange={(v) => updateMargins({ rightMm: v })} />
        </div>
      </div>

      <div style={S_SECTION}>
        <SectionTitle>Header / Footer</SectionTitle>
        <div style={S_GRID2}>
          <LabeledNumberField label="Header" value={page.headerHeightMm} unit="mm" disabled={readOnly}
            onChange={(v) => updatePage({ headerHeightMm: v })} />
          <LabeledNumberField label="Footer" value={page.footerHeightMm} unit="mm" disabled={readOnly}
            onChange={(v) => updatePage({ footerHeightMm: v })} />
        </div>
      </div>
    </>
  );
}

function FieldsHintPanel({ fields }: { fields: DataField[] }) {
  const flat = useMemo(() => countFields(fields), [fields]);
  return (
    <div style={S_SECTION}>
      <SectionTitle>{`Available Fields (${flat})`}</SectionTitle>
      <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>
        Select a <em>Dynamic Text</em> or <em>Table</em> element to bind fields.
        Go to the <strong>Data Source</strong> tab to edit or add fields.
      </p>
    </div>
  );
}

// ── Element Section ────────────────────────────────────────────────────────

function ElementSection({
  element, definition, fields, readOnly, dispatch,
}: {
  element: TemplateElement;
  definition: PrintTemplateDefinition;
  fields?: DataField[];
  readOnly?: boolean;
  dispatch: React.Dispatch<DesignerAction>;
}) {
  const updateElement = (patch: Partial<TemplateElement>) =>
    dispatch({ type: "UPDATE_ELEMENT", id: element.id, patch });
  const removeElement = () =>
    dispatch({ type: "REMOVE_ELEMENT", id: element.id });

  return (
    <>
      <div style={S_SECTION}>
        <SectionTitle>Element</SectionTitle>
        <label style={S_LABEL}>Type</label>
        <input disabled value={element.type} style={{ ...S_INPUT, color: "#64748b", marginBottom: 10 }} />
        <label style={S_LABEL}>Name</label>
        <input value={element.name ?? ""} disabled={readOnly}
          onChange={(e) => updateElement({ name: e.target.value })}
          style={{ ...S_INPUT, marginBottom: 10 }} placeholder="(optional)" />
        <label style={S_LABEL}>Style Rule</label>
        <select value={element.styleId ?? ""} disabled={readOnly}
          onChange={(e) => updateElement({ styleId: e.target.value || undefined })}
          style={S_INPUT}>
          <option value="">(none)</option>
          {Object.values(definition.styles.rules).map((r) => (
            <option key={r.id} value={r.id}>{r.id}</option>
          ))}
        </select>
      </div>

      <div style={S_SECTION}>
        <SectionTitle>Position &amp; Size</SectionTitle>
        <div style={S_GRID2}>
          <LabeledNumberField label="X" value={element.box.xMm} unit="mm" disabled={readOnly}
            onChange={(v) => updateElement({ box: { ...element.box, xMm: v } } as Partial<TemplateElement>)} />
          <LabeledNumberField label="Y" value={element.box.yMm} unit="mm" disabled={readOnly}
            onChange={(v) => updateElement({ box: { ...element.box, yMm: v } } as Partial<TemplateElement>)} />
          <LabeledNumberField label="Width" value={element.box.widthMm} unit="mm" disabled={readOnly}
            onChange={(v) => updateElement({ box: { ...element.box, widthMm: v } } as Partial<TemplateElement>)} />
          <LabeledNumberField label="Height" value={element.box.heightMm} unit="mm" disabled={readOnly}
            onChange={(v) => updateElement({ box: { ...element.box, heightMm: v } } as Partial<TemplateElement>)} />
        </div>
      </div>

      {renderTypeSpecificFields(element, fields, readOnly, updateElement)}

      <div style={S_SECTION}>
        <button type="button" onClick={removeElement} disabled={readOnly}
          style={{
            width: "100%", padding: "8px 12px", background: "#fee2e2", color: "#991b1b",
            border: "1px solid #fecaca", borderRadius: 4, cursor: readOnly ? "not-allowed" : "pointer",
            fontSize: 12, fontWeight: 600,
          }}
        >Delete Element</button>
      </div>
    </>
  );
}

function renderTypeSpecificFields(
  element: TemplateElement,
  fields: DataField[] | undefined,
  readOnly: boolean | undefined,
  updateElement: (patch: Partial<TemplateElement>) => void
) {
  switch (element.type) {
    case "static_text": return (
      <div style={S_SECTION}>
        <SectionTitle>Static Text</SectionTitle>
        <label style={S_LABEL}>Text</label>
        <textarea value={(element as StaticTextElement).text} disabled={readOnly} rows={3}
          onChange={(e) => updateElement({ text: e.target.value } as Partial<StaticTextElement>)}
          style={{ ...S_INPUT, resize: "vertical", fontFamily: "inherit" }} />
      </div>
    );
    case "dynamic_text": {
      const el = element as DynamicTextElement;
      return (
        <div style={S_SECTION}>
          <SectionTitle>Dynamic Text</SectionTitle>
          <label style={S_LABEL}>Binding</label>
          <input value={el.binding} disabled={readOnly} placeholder="doc.invoice_no"
            onChange={(e) => updateElement({ binding: e.target.value } as Partial<DynamicTextElement>)}
            style={{ ...S_INPUT, fontFamily: "monospace" }} />
          {fields && fields.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <FieldPicker fields={fields} readOnly={readOnly}
                onPick={(path) => updateElement({ binding: path } as Partial<DynamicTextElement>)} />
            </div>
          )}
          <div style={{ ...S_GRID2, marginTop: 10 }}>
            <div>
              <label style={S_LABEL}>Prefix</label>
              <input value={el.prefix ?? ""} disabled={readOnly}
                onChange={(e) => updateElement({ prefix: e.target.value } as Partial<DynamicTextElement>)}
                style={S_INPUT} />
            </div>
            <div>
              <label style={S_LABEL}>Suffix</label>
              <input value={el.suffix ?? ""} disabled={readOnly}
                onChange={(e) => updateElement({ suffix: e.target.value } as Partial<DynamicTextElement>)}
                style={S_INPUT} />
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <label style={S_LABEL}>Fallback</label>
            <input value={el.fallback ?? ""} disabled={readOnly} placeholder="shown when binding is empty"
              onChange={(e) => updateElement({ fallback: e.target.value } as Partial<DynamicTextElement>)}
              style={S_INPUT} />
          </div>
          <div style={{ marginTop: 10 }}>
            <label style={S_LABEL}>Format</label>
            <select value={el.format ?? "text"} disabled={readOnly}
              onChange={(e) => updateElement({ format: e.target.value as DynamicTextElement["format"] } as Partial<DynamicTextElement>)}
              style={S_INPUT}>
              <option value="text">text</option>
              <option value="number">number</option>
              <option value="currency">currency</option>
              <option value="date">date</option>
            </select>
          </div>
        </div>
      );
    }
    case "rectangle": {
      const el = element as RectangleElement;
      return (
        <div style={S_SECTION}>
          <SectionTitle>Rectangle</SectionTitle>
          <div style={S_GRID2}>
            <LabeledNumberField label="Border (mm)" value={el.style?.borderWidthMm ?? 0} unit="mm" disabled={readOnly}
              onChange={(v) => updateElement({ style: { ...el.style, borderWidthMm: v } } as Partial<RectangleElement>)} />
            <LabeledColorField label="Border color" value={el.style?.borderColor ?? "#111827"} disabled={readOnly}
              onChange={(v) => updateElement({ style: { ...el.style, borderColor: v } } as Partial<RectangleElement>)} />
          </div>
          <div style={{ marginTop: 10 }}>
            <LabeledColorField label="Fill" value={el.style?.backgroundColor ?? ""} disabled={readOnly}
              placeholder="transparent" allowEmpty
              onChange={(v) => updateElement({ style: { ...el.style, backgroundColor: v || undefined } } as Partial<RectangleElement>)} />
          </div>
        </div>
      );
    }
    case "image": {
      const el = element as ImageElement;
      return (
        <div style={S_SECTION}>
          <SectionTitle>Image</SectionTitle>
          <label style={S_LABEL}>Static URL</label>
          <input value={el.src ?? ""} disabled={readOnly} placeholder="https://..."
            onChange={(e) => updateElement({ src: e.target.value || undefined } as Partial<ImageElement>)}
            style={S_INPUT} />
          <label style={{ ...S_LABEL, marginTop: 10 }}>Binding</label>
          <input value={el.binding ?? ""} disabled={readOnly} placeholder="doc.company_logo"
            onChange={(e) => updateElement({ binding: e.target.value || undefined } as Partial<ImageElement>)}
            style={{ ...S_INPUT, fontFamily: "monospace" }} />
          <label style={{ ...S_LABEL, marginTop: 10 }}>Fit</label>
          <select value={el.fit ?? "contain"} disabled={readOnly}
            onChange={(e) => updateElement({ fit: e.target.value as ImageElement["fit"] } as Partial<ImageElement>)}
            style={S_INPUT}>
            <option value="contain">contain</option>
            <option value="cover">cover</option>
            <option value="fill">fill</option>
            <option value="none">none</option>
          </select>
        </div>
      );
    }
    case "barcode": {
      const el = element as BarcodeElement;
      return (
        <div style={S_SECTION}>
          <SectionTitle>Barcode</SectionTitle>
          <label style={S_LABEL}>Format</label>
          <select value={el.format} disabled={readOnly}
            onChange={(e) => updateElement({ format: e.target.value as BarcodeElement["format"] } as Partial<BarcodeElement>)}
            style={S_INPUT}>
            {["qrcode","code128","code39","ean13","ean8","upc"].map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <label style={{ ...S_LABEL, marginTop: 10 }}>Static Value</label>
          <input value={el.value ?? ""} disabled={readOnly}
            onChange={(e) => updateElement({ value: e.target.value || undefined } as Partial<BarcodeElement>)}
            style={S_INPUT} />
          <label style={{ ...S_LABEL, marginTop: 10 }}>Binding</label>
          <input value={el.binding ?? ""} disabled={readOnly} placeholder="doc.invoice_no"
            onChange={(e) => updateElement({ binding: e.target.value || undefined } as Partial<BarcodeElement>)}
            style={{ ...S_INPUT, fontFamily: "monospace" }} />
        </div>
      );
    }
    case "table": {
      const el = element as TableElement;
      const updateCols = (cols: TableColumn[]) =>
        updateElement({ columns: cols } as Partial<TableElement>);
      return (
        <div style={S_SECTION}>
          <SectionTitle>Table</SectionTitle>
          <label style={S_LABEL}>Repeat Path</label>
          <input value={el.repeatPath} disabled={readOnly} placeholder="doc.items"
            onChange={(e) => updateElement({ repeatPath: e.target.value } as Partial<TableElement>)}
            style={{ ...S_INPUT, fontFamily: "monospace" }} />
          <div style={{ ...S_GRID2, marginTop: 10 }}>
            <LabeledNumberField label="Header h" value={el.headerHeightMm ?? 0} unit="mm" disabled={readOnly}
              onChange={(v) => updateElement({ headerHeightMm: v } as Partial<TableElement>)} />
            <LabeledNumberField label="Row h" value={el.rowHeightMm ?? 0} unit="mm" disabled={readOnly}
              onChange={(v) => updateElement({ rowHeightMm: v } as Partial<TableElement>)} />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <strong style={{ fontSize: 12 }}>Columns</strong>
              <button type="button" disabled={readOnly}
                onClick={() => updateCols([...el.columns, { id: createId("col"), label: `Col ${el.columns.length + 1}`, binding: "row.", widthMm: 20 }])}
                style={addBtnStyle(readOnly)}>+ Add</button>
            </div>
            {el.columns.map((col, idx) => (
              <div key={col.id} style={{ border: "1px solid #e5e7eb", borderRadius: 4, padding: 8, marginBottom: 6, background: "#f9fafb" }}>
                <div style={S_GRID2}>
                  <div>
                    <label style={S_LABEL}>Label</label>
                    <input value={col.label} disabled={readOnly}
                      onChange={(e) => updateCols(el.columns.map((c, i) => i === idx ? { ...c, label: e.target.value } : c))}
                      style={S_INPUT} />
                  </div>
                  <div>
                    <label style={S_LABEL}>Width (mm)</label>
                    <NumberField value={col.widthMm ?? 0} unit="mm" disabled={readOnly}
                      onChange={(v) => updateCols(el.columns.map((c, i) => i === idx ? { ...c, widthMm: v } : c))} />
                  </div>
                </div>
                <div style={{ marginTop: 6 }}>
                  <label style={S_LABEL}>Binding</label>
                  <input value={col.binding} disabled={readOnly} placeholder="row.qty"
                    onChange={(e) => updateCols(el.columns.map((c, i) => i === idx ? { ...c, binding: e.target.value } : c))}
                    style={{ ...S_INPUT, fontFamily: "monospace" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                  <select value={col.align ?? "left"} disabled={readOnly}
                    onChange={(e) => updateCols(el.columns.map((c, i) => i === idx ? { ...c, align: e.target.value as TableColumn["align"] } : c))}
                    style={{ ...S_INPUT, width: 110 }}>
                    <option value="left">left</option>
                    <option value="center">center</option>
                    <option value="right">right</option>
                  </select>
                  <button type="button" disabled={readOnly}
                    onClick={() => updateCols(el.columns.filter((_, i) => i !== idx))}
                    style={{ background: "transparent", border: "none", color: "#991b1b", cursor: readOnly ? "not-allowed" : "pointer", fontSize: 12 }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    default: return null;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 2: Data Source
// ══════════════════════════════════════════════════════════════════════════════

function DataSourceTabContent({
  definition,
  readOnly,
  dispatch,
}: {
  definition: PrintTemplateDefinition;
  readOnly?: boolean;
  dispatch: React.Dispatch<DesignerAction>;
}) {
  const ds = definition.dataSource;

  const updateDs = useCallback(
    (patch: Partial<NonNullable<PrintTemplateDefinition["dataSource"]>>) =>
      dispatch({ type: "UPDATE_DATA_SOURCE", patch }),
    [dispatch]
  );

  return (
    <>
      {/* ── Source Info ── */}
      <div style={S_SECTION}>
        <SectionTitle>Source Info</SectionTitle>
        <p style={{ margin: "0 0 10px", fontSize: 11, color: "#64748b" }}>
          Define what data this template consumes. These definitions are saved with the template and
          feed into the PDFKit adapter as the expected input schema.
        </p>
        <label style={S_LABEL}>Name / Label</label>
        <input
          value={ds?.label ?? ""}
          disabled={readOnly}
          placeholder="e.g. Sales Invoice"
          onChange={(e) => updateDs({ label: e.target.value })}
          style={{ ...S_INPUT, marginBottom: 10 }}
        />
        <label style={S_LABEL}>Entity / DocType</label>
        <input
          value={ds?.doctype ?? ""}
          disabled={readOnly}
          placeholder="e.g. Sales Invoice"
          onChange={(e) => updateDs({ doctype: e.target.value })}
          style={{ ...S_INPUT, marginBottom: 10 }}
        />
        <label style={S_LABEL}>Description</label>
        <textarea
          value={ds?.description ?? ""}
          disabled={readOnly}
          placeholder="Describe what data this template expects…"
          rows={2}
          onChange={(e) => updateDs({ description: e.target.value })}
          style={{ ...S_INPUT, resize: "vertical", fontFamily: "inherit" }}
        />
      </div>

      {/* ── Fields Schema ── */}
      <FieldsSchemaSection
        fields={ds?.fields ?? []}
        readOnly={readOnly}
        onChange={(fields) => dispatch({ type: "SET_DATA_SOURCE_FIELDS", fields })}
      />

      {/* ── Sample Data ── */}
      <SampleDataSection
        sampleData={ds?.sampleData}
        readOnly={readOnly}
        onChange={(sampleData) => dispatch({ type: "SET_SAMPLE_DATA", sampleData })}
      />

      {/* ── Bindings Check ── */}
      <BindingsCheckSection definition={definition} />
    </>
  );
}

// ── Fields Schema Editor ───────────────────────────────────────────────────

const FIELDTYPE_OPTIONS = [
  "Data", "Currency", "Date", "Datetime", "Float", "Int", "Text", "Table",
  "Link", "Select", "Check", "Attach", "Attach Image", "Signature",
];

function FieldsSchemaSection({
  fields,
  readOnly,
  onChange,
}: {
  fields: DataField[];
  readOnly?: boolean;
  onChange: (fields: DataField[]) => void;
}) {
  const addField = () =>
    onChange([
      ...fields,
      { name: `field_${fields.length + 1}`, label: "", fieldtype: "Data" },
    ]);

  return (
    <div style={S_SECTION}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <SectionTitle style={{ margin: 0 }}>Fields Schema ({fields.length})</SectionTitle>
        {!readOnly && (
          <button type="button" onClick={addField} style={addBtnStyle(readOnly)}>
            + Add Field
          </button>
        )}
      </div>
      <p style={{ margin: "0 0 10px", fontSize: 11, color: "#64748b" }}>
        Define the fields this template expects. Field names become binding paths (e.g.
        <code style={{ fontFamily: "monospace" }}> doc.invoice_no</code>).
      </p>
      {fields.length === 0 ? (
        <div style={{ color: "#9ca3af", fontSize: 12, textAlign: "center", padding: "12px 0" }}>
          No fields defined yet.
          {!readOnly && (
            <> Click <strong>+ Add Field</strong> to start.</>
          )}
        </div>
      ) : (
        fields.map((f, idx) => (
          <FieldRow
            key={idx}
            field={f}
            readOnly={readOnly}
            depth={0}
            onChange={(updated) => onChange(fields.map((x, i) => i === idx ? updated : x))}
            onRemove={() => onChange(fields.filter((_, i) => i !== idx))}
          />
        ))
      )}
    </div>
  );
}

function FieldRow({
  field,
  readOnly,
  depth,
  onChange,
  onRemove,
}: {
  field: DataField;
  readOnly?: boolean;
  depth: number;
  onChange: (updated: DataField) => void;
  onRemove: () => void;
}) {
  const [childOpen, setChildOpen] = useState(false);
  const isTable = field.fieldtype === "Table";

  const addChild = () =>
    onChange({
      ...field,
      children: [
        ...(field.children ?? []),
        { name: `sub_${(field.children?.length ?? 0) + 1}`, label: "", fieldtype: "Data" },
      ],
    });

  return (
    <div
      style={{
        marginLeft: depth * 14,
        marginBottom: 4,
        border: "1px solid #e5e7eb",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto auto",
          gap: 4,
          padding: "5px 8px",
          background: depth === 0 ? "#f9fafb" : "#fff",
          alignItems: "center",
        }}
      >
        <input
          value={field.name}
          disabled={readOnly}
          placeholder="field_name"
          title="Field name (used in binding path)"
          onChange={(e) => onChange({ ...field, name: e.target.value })}
          style={{ ...S_INPUT, padding: "3px 6px", fontFamily: "monospace", fontSize: 11 }}
        />
        <input
          value={field.label ?? ""}
          disabled={readOnly}
          placeholder="Label"
          title="Display label"
          onChange={(e) => onChange({ ...field, label: e.target.value })}
          style={{ ...S_INPUT, padding: "3px 6px", fontSize: 11 }}
        />
        <select
          value={field.fieldtype ?? "Data"}
          disabled={readOnly}
          title="Field type"
          onChange={(e) => onChange({ ...field, fieldtype: e.target.value })}
          style={{
            ...S_INPUT,
            padding: "3px 4px",
            fontSize: 11,
            width: 90,
          }}
        >
          {FIELDTYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <div style={{ display: "flex", gap: 2 }}>
          {isTable && (
            <button
              type="button"
              title={childOpen ? "Collapse children" : "Expand children"}
              onClick={() => setChildOpen(!childOpen)}
              style={{
                background: childOpen ? "#f0fdf4" : "transparent",
                border: "1px solid #d1d5db",
                borderRadius: 3,
                width: 22,
                height: 22,
                cursor: "pointer",
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {childOpen ? "▾" : "▸"}
            </button>
          )}
          {!readOnly && (
            <button
              type="button"
              title="Remove field"
              onClick={onRemove}
              style={{
                background: "transparent",
                border: "1px solid #fca5a5",
                borderRadius: 3,
                width: 22,
                height: 22,
                cursor: "pointer",
                color: "#ef4444",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Children (for Table-type fields) */}
      {isTable && childOpen && (
        <div style={{ padding: "4px 8px 8px", borderTop: "1px solid #f0f9ff", background: "#f8fafc" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>
              CHILD FIELDS (bound as <code style={{ fontFamily: "monospace" }}>row.*</code>)
            </span>
            {!readOnly && (
              <button type="button" onClick={addChild} style={{ ...addBtnStyle(readOnly), fontSize: 10, padding: "1px 6px" }}>
                + Add
              </button>
            )}
          </div>
          {(field.children ?? []).length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 11 }}>No child fields.</div>
          ) : (
            (field.children ?? []).map((child, ci) => (
              <FieldRow
                key={ci}
                field={child}
                readOnly={readOnly}
                depth={depth + 1}
                onChange={(updated) =>
                  onChange({
                    ...field,
                    children: (field.children ?? []).map((x, i) => i === ci ? updated : x),
                  })
                }
                onRemove={() =>
                  onChange({
                    ...field,
                    children: (field.children ?? []).filter((_, i) => i !== ci),
                  })
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Sample Data Editor ──────────────────────────────────────────────────────

function SampleDataSection({
  sampleData,
  readOnly,
  onChange,
}: {
  sampleData?: Record<string, unknown>;
  readOnly?: boolean;
  onChange: (data: Record<string, unknown> | undefined) => void;
}) {
  const [text, setText] = useState(() =>
    sampleData ? JSON.stringify(sampleData, null, 2) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    const next = sampleData ? JSON.stringify(sampleData, null, 2) : "";
    if (textRef.current !== next) setText(next);
  }, [sampleData]);

  const apply = (raw: string) => {
    if (!raw.trim()) {
      setError(null);
      onChange(undefined);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        setError("Must be a JSON object { … }");
        return;
      }
      setError(null);
      onChange(parsed as Record<string, unknown>);
    } catch {
      setError("Invalid JSON");
    }
  };

  const format = () => {
    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, 2);
      setText(formatted);
      setError(null);
    } catch {
      setError("Cannot format: invalid JSON");
    }
  };

  const fieldCount = sampleData
    ? Object.keys(sampleData).length
    : 0;

  return (
    <div style={S_SECTION}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <SectionTitle style={{ margin: 0 }}>Sample Data</SectionTitle>
        {!readOnly && (
          <div style={{ display: "flex", gap: 4 }}>
            <button type="button" onClick={format} style={addBtnStyle(readOnly)}>Format</button>
            <button type="button"
              onClick={() => { setText(""); setError(null); onChange(undefined); }}
              style={{ ...addBtnStyle(readOnly), color: "#991b1b", borderColor: "#fca5a5" }}>
              Clear
            </button>
          </div>
        )}
      </div>
      <p style={{ margin: "0 0 8px", fontSize: 11, color: "#64748b" }}>
        Enter a JSON sample record to preview dynamic fields on the canvas.
        This data is saved with the template and does <em>not</em> go to PDFKit
        (only the template definition does).
      </p>
      <textarea
        value={text}
        readOnly={readOnly}
        rows={10}
        spellCheck={false}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => apply(e.target.value)}
        style={{
          ...S_INPUT,
          fontFamily: "monospace",
          fontSize: 11,
          resize: "vertical",
          lineHeight: 1.6,
          borderColor: error ? "#fca5a5" : "#d1d5db",
        }}
        placeholder={'{\n  "invoice_no": "INV-001",\n  "customer": "ACME Corp."\n}'}
      />
      <div style={{ marginTop: 4, fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
        {error ? (
          <>
            <span style={{ color: "#ef4444" }}>✕</span>
            <span style={{ color: "#ef4444" }}>{error}</span>
          </>
        ) : sampleData ? (
          <>
            <span style={{ color: "#22c55e" }}>✓</span>
            <span style={{ color: "#16a34a" }}>Valid · {fieldCount} top-level field{fieldCount !== 1 ? "s" : ""}</span>
          </>
        ) : (
          <span style={{ color: "#9ca3af" }}>No sample data</span>
        )}
      </div>
    </div>
  );
}

// ── Bindings Check ────────────────────────────────────────────────────────

interface BindingEntry {
  path: string;
  elementType: string;
  note?: string;
}

function extractBindings(definition: PrintTemplateDefinition): BindingEntry[] {
  const list: BindingEntry[] = [];
  for (const el of definition.elements) {
    switch (el.type) {
      case "dynamic_text":
        list.push({ path: el.binding, elementType: "dynamic_text" });
        break;
      case "table":
        list.push({ path: el.repeatPath, elementType: "table", note: "repeat path" });
        for (const col of el.columns) {
          list.push({ path: col.binding, elementType: "table.col", note: col.label });
        }
        break;
      case "image":
        if (el.binding) list.push({ path: el.binding, elementType: "image" });
        break;
      case "barcode":
        if (el.binding) list.push({ path: el.binding, elementType: "barcode" });
        break;
    }
  }
  return list;
}

function BindingsCheckSection({ definition }: { definition: PrintTemplateDefinition }) {
  const bindings = useMemo(() => extractBindings(definition), [definition.elements]);
  const sampleData = definition.dataSource?.sampleData;

  const resolved = useMemo(() => {
    if (!sampleData) return null;
    const root = { doc: sampleData };
    return bindings.map((b) => {
      const val = resolveBindingPath(root, b.path);
      return val !== undefined && val !== null && val !== "";
    });
  }, [bindings, sampleData]);

  const resolvedCount = resolved?.filter(Boolean).length ?? 0;

  if (bindings.length === 0) {
    return (
      <div style={S_SECTION}>
        <SectionTitle>Bindings Check</SectionTitle>
        <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
          No dynamic bindings in this template.
        </p>
      </div>
    );
  }

  return (
    <div style={S_SECTION}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <SectionTitle style={{ margin: 0 }}>Bindings ({bindings.length})</SectionTitle>
        {resolved && (
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: resolvedCount === bindings.length ? "#16a34a" : "#d97706",
          }}>
            {resolvedCount}/{bindings.length} resolved
          </span>
        )}
      </div>
      {!sampleData && (
        <p style={{ margin: "0 0 8px", fontSize: 11, color: "#d97706" }}>
          ⚠ Add sample data above to check binding resolution.
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {bindings.map((b, i) => {
          const ok = resolved ? resolved[i] : null;
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "14px 1fr auto",
                gap: 6,
                alignItems: "start",
                padding: "4px 6px",
                borderRadius: 4,
                background: ok === true ? "#f0fdf4" : ok === false ? "#fff7ed" : "#f9fafb",
                fontSize: 11,
              }}
            >
              <span style={{ color: ok === true ? "#22c55e" : ok === false ? "#f59e0b" : "#94a3b8", fontWeight: 700 }}>
                {ok === true ? "✓" : ok === false ? "?" : "·"}
              </span>
              <div>
                <code style={{ fontFamily: "monospace", color: "#1e40af", wordBreak: "break-all" }}>{b.path}</code>
                {b.note && (
                  <span style={{ marginLeft: 4, color: "#64748b" }}>({b.note})</span>
                )}
              </div>
              <span style={{
                background: elementTypeChipBg(b.elementType),
                color: elementTypeChipColor(b.elementType),
                padding: "1px 5px",
                borderRadius: 8,
                fontSize: 9,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}>
                {b.elementType}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function elementTypeChipBg(t: string) {
  if (t.startsWith("table")) return "#dbeafe";
  if (t === "dynamic_text") return "#f3e8ff";
  if (t === "image") return "#fef9c3";
  return "#f3f4f6";
}
function elementTypeChipColor(t: string) {
  if (t.startsWith("table")) return "#1e40af";
  if (t === "dynamic_text") return "#7e22ce";
  if (t === "image") return "#854d0e";
  return "#374151";
}

// ── Field Picker (inline, used inside element section) ─────────────────────

function FieldPicker({
  fields, onPick, readOnly,
}: {
  fields: DataField[];
  onPick: (path: string) => void;
  readOnly?: boolean;
}) {
  return (
    <details style={{ border: "1px solid #e5e7eb", borderRadius: 4 }}>
      <summary style={{ cursor: "pointer", padding: 6, fontSize: 12, background: "#f9fafb" }}>
        Insert field…
      </summary>
      <div style={{ maxHeight: 180, overflowY: "auto", padding: 6 }}>
        {fields.map((f) => (
          <FieldPickerRow key={f.name} field={f} prefix="doc" onPick={onPick} readOnly={readOnly} />
        ))}
      </div>
    </details>
  );
}

function FieldPickerRow({
  field, prefix, onPick, readOnly,
}: {
  field: DataField;
  prefix: string;
  onPick: (path: string) => void;
  readOnly?: boolean;
}) {
  const path = `${prefix}.${field.name}`;
  return (
    <div style={{ marginBottom: 2 }}>
      <button type="button" disabled={readOnly} onClick={() => onPick(path)}
        style={{ background: "transparent", border: "none", padding: "2px 4px", color: "#1f2937", cursor: readOnly ? "not-allowed" : "pointer", fontSize: 12, textAlign: "left", width: "100%" }}>
        <span style={{ fontFamily: "monospace" }}>{path}</span>
        {field.label && <span style={{ color: "#94a3b8", marginLeft: 6 }}>{field.label}</span>}
      </button>
      {field.children && field.children.length > 0 && (
        <div style={{ paddingLeft: 12 }}>
          {field.children.map((c) => (
            <FieldPickerRow key={`${path}.${c.name}`} field={c} prefix={path} onPick={onPick} readOnly={readOnly} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Shared primitives ─────────────────────────────────────────────────────

function SectionTitle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "#1f2937", ...style }}>
      {children}
    </h3>
  );
}

function NumberField({ value, unit, disabled, onChange }: {
  value: number; unit?: string; disabled?: boolean; onChange: (v: number) => void;
}) {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <input type="number" step="0.1" value={Number.isFinite(value) ? value : 0} disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ...S_INPUT, paddingRight: unit ? 28 : undefined }} />
      {unit && (
        <span style={{ position: "absolute", right: 8, fontSize: 11, color: "#94a3b8", pointerEvents: "none" }}>
          {unit}
        </span>
      )}
    </div>
  );
}

function LabeledNumberField({ label, ...rest }: { label: string } & React.ComponentProps<typeof NumberField>) {
  return (
    <div>
      <label style={S_LABEL}>{label}</label>
      <NumberField {...rest} />
    </div>
  );
}

function LabeledColorField({
  label, value, disabled, placeholder, allowEmpty, onChange,
}: {
  label: string; value: string; disabled?: boolean; placeholder?: string; allowEmpty?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={S_LABEL}>{label}</label>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input type="color" value={value || "#000000"} disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 28, height: 28, border: "1px solid #d1d5db", background: "transparent", padding: 2 }} />
        <input value={value} disabled={disabled} placeholder={placeholder}
          onChange={(e) => onChange(allowEmpty ? e.target.value : e.target.value)}
          style={{ ...S_INPUT, flex: 1, fontFamily: "monospace" }} />
      </div>
    </div>
  );
}

function addBtnStyle(readOnly?: boolean): React.CSSProperties {
  return {
    background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 4,
    padding: "2px 8px", fontSize: 12, cursor: readOnly ? "not-allowed" : "pointer",
  };
}

function countFields(fields: DataField[]): number {
  let n = fields.length;
  for (const f of fields) { if (f.children) n += countFields(f.children); }
  return n;
}
