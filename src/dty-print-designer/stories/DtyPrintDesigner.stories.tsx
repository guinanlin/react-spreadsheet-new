import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { DtyPrintDesigner } from "../components/DtyPrintDesigner";
import { createDefaultTemplate, createElement } from "../schema/defaults";
import type {
  DynamicTextElement,
  PrintTemplateDefinition,
  StaticTextElement,
  TableElement,
} from "../schema/types";
import { createId } from "../lib/id";
import { mergeTemplateWithData } from "../lib/merge";
import type { DataField, DataSourceDescriptor } from "../types";

const meta: Meta<typeof DtyPrintDesigner> = {
  title: "DtyPrintDesigner/DtyPrintDesigner",
  component: DtyPrintDesigner,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "打印模板『定义层』设计器：输出 `PrintTemplateDefinition`（布局 + 样式 + 绑定），不负责生成 PDF。",
      },
    },
  },
  argTypes: {
    showGrid: { control: "boolean" },
    readOnly: { control: "boolean" },
    debug: { control: "boolean" },
    zoom: { control: { type: "range", min: 0.5, max: 2, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof DtyPrintDesigner>;

const SAMPLE_FIELDS: DataField[] = [
  { name: "invoice_no", label: "Invoice #", fieldtype: "Data" },
  { name: "customer_name", label: "Customer", fieldtype: "Data" },
  { name: "posting_date", label: "Date", fieldtype: "Date" },
  { name: "grand_total", label: "Total", fieldtype: "Currency" },
  {
    name: "items",
    label: "Items",
    fieldtype: "Table",
    children: [
      { name: "item_name", label: "Item", fieldtype: "Data" },
      { name: "qty", label: "Qty", fieldtype: "Float" },
      { name: "rate", label: "Rate", fieldtype: "Currency" },
      { name: "amount", label: "Amount", fieldtype: "Currency" },
    ],
  },
];

const SAMPLE_RECORD = {
  invoice_no: "INV-2026-001",
  customer_name: "ACME Corp.",
  posting_date: "2026-04-15",
  grand_total: 1280.5,
  items: [
    { item_name: "Widget A", qty: 2, rate: 120, amount: 240 },
    { item_name: "Widget B", qty: 5, rate: 80, amount: 400 },
    { item_name: "Service Fee", qty: 1, rate: 640.5, amount: 640.5 },
  ],
};

const SAMPLE_DATA_SOURCES: DataSourceDescriptor[] = [
  { id: "purchase_invoice", label: "Purchase Invoice", doctype: "Purchase Invoice" },
  { id: "sales_invoice", label: "Sales Invoice", doctype: "Sales Invoice" },
];

function makeSampleTemplate(): PrintTemplateDefinition {
  const def = createDefaultTemplate("Sales Invoice");

  const title = createElement("static_text", {
    xMm: 15,
    yMm: 15,
    widthMm: 100,
    heightMm: 10,
  }) as StaticTextElement;
  title.text = "SALES INVOICE";
  title.styleId = "title";

  const invoiceNo = createElement("dynamic_text", {
    xMm: 140,
    yMm: 15,
    widthMm: 55,
    heightMm: 8,
  }) as DynamicTextElement;
  invoiceNo.binding = "doc.invoice_no";
  invoiceNo.prefix = "# ";

  const customer = createElement("dynamic_text", {
    xMm: 15,
    yMm: 32,
    widthMm: 120,
    heightMm: 8,
  }) as DynamicTextElement;
  customer.binding = "doc.customer_name";
  customer.prefix = "Customer: ";

  const date = createElement("dynamic_text", {
    xMm: 15,
    yMm: 42,
    widthMm: 120,
    heightMm: 8,
  }) as DynamicTextElement;
  date.binding = "doc.posting_date";
  date.prefix = "Date: ";
  date.format = "date";

  // 分割线：用实填充而非描边，视觉上是一条细实线，而非空心细框
  const divider = createElement("rectangle", {
    xMm: 15,
    yMm: 55,
    widthMm: 180,
    heightMm: 0.4,
  });
  divider.name = "Divider";
  divider.style = { backgroundColor: "#1f2937", borderWidthMm: 0 };

  const itemsTable = createElement("table", {
    xMm: 15,
    yMm: 60,
    widthMm: 180,
    heightMm: 50,
  }) as TableElement;
  itemsTable.repeatPath = "doc.items";
  itemsTable.columns = [
    { id: createId("col"), label: "Item", binding: "row.item_name", widthMm: 80 },
    { id: createId("col"), label: "Qty", binding: "row.qty", widthMm: 20, align: "right" },
    { id: createId("col"), label: "Rate", binding: "row.rate", widthMm: 35, align: "right" },
    { id: createId("col"), label: "Amount", binding: "row.amount", widthMm: 45, align: "right" },
  ];

  const total = createElement("dynamic_text", {
    xMm: 140,
    yMm: 125,
    widthMm: 55,
    heightMm: 10,
  }) as DynamicTextElement;
  total.binding = "doc.grand_total";
  total.prefix = "Grand Total: ";
  total.format = "currency";
  total.formatOptions = { currency: "USD" };
  total.styleId = "title";

  def.elements = [title, invoiceNo, customer, date, divider, itemsTable, total];
  def.dataSource = { id: "sales_invoice", label: "Sales Invoice" };
  return def;
}

export const Default: Story = {
  args: {
    showGrid: true,
    zoom: 1,
  },
  render: (args) => (
    <div style={{ height: "90vh" }}>
      <DtyPrintDesigner {...args} />
    </div>
  ),
};

export const WithSampleData: Story = {
  render: (args) => {
    const [template, setTemplate] = useState(makeSampleTemplate);

    return (
      <div style={{ height: "90vh", display: "flex", flexDirection: "column" }}>
        <DtyPrintDesigner
          {...args}
          value={template}
          onChange={setTemplate}
          fields={SAMPLE_FIELDS}
          dataSources={SAMPLE_DATA_SOURCES}
          activeDataSourceId="sales_invoice"
          sampleRecord={SAMPLE_RECORD}
          onSave={(def) =>
            // eslint-disable-next-line no-console
            console.log("[onSave]", JSON.stringify(def, null, 2))
          }
        />
      </div>
    );
  },
  args: {
    showGrid: true,
    zoom: 0.9,
  },
};

export const Controlled: Story = {
  render: () => {
    const [template, setTemplate] = useState(makeSampleTemplate);
    const json = useMemo(() => JSON.stringify(template, null, 2), [template]);

    return (
      <div
        style={{
          height: "90vh",
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 8,
        }}
      >
        <DtyPrintDesigner
          value={template}
          onChange={setTemplate}
          fields={SAMPLE_FIELDS}
          sampleRecord={SAMPLE_RECORD}
          showGrid
          zoom={0.85}
        />
        <pre
          style={{
            margin: 0,
            overflow: "auto",
            border: "1px solid #e5e7eb",
            padding: 12,
            fontSize: 11,
            background: "#0f172a",
            color: "#e2e8f0",
          }}
        >
          {json}
        </pre>
      </div>
    );
  },
};

export const ResolvedDrawOpsPreview: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "**定义层 vs PDFKit 运行时边界**：左侧是设计器（`PrintTemplateDefinition`），" +
          "右侧是 `mergeTemplateWithData(def, record)` 产生的 `ResolvedDocument`——" +
          "这份 JSON 即 PDFKit 适配层最终消费的绘制指令序列（单位 pt，坐标系 left-top / Y 向下）。" +
          "详细合同见 `docs/pdfkit-integration.md`。",
      },
    },
  },
  render: () => {
    const [template] = useState(makeSampleTemplate);
    const resolved = useMemo(
      () =>
        mergeTemplateWithData(template, SAMPLE_RECORD, {
          keepUnresolved: false,
        }),
      [template]
    );

    return (
      <div
        style={{
          height: "90vh",
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: 8,
        }}
      >
        <DtyPrintDesigner
          value={template}
          fields={SAMPLE_FIELDS}
          sampleRecord={SAMPLE_RECORD}
          readOnly
          showGrid={false}
          zoom={0.85}
        />
        <div
          style={{
            overflow: "auto",
            border: "1px solid #e5e7eb",
            padding: 12,
          }}
        >
          <h3 style={{ margin: "0 0 6px" }}>ResolvedDocument (pt)</h3>
          <p style={{ margin: "0 0 8px", fontSize: 12, color: "#64748b" }}>
            `mergeTemplateWithData(definition, record)` → 这份 JSON 即 PDFKit 适配层最终消费的
            <strong> 绘制指令序列</strong>（坐标系：left-top, Y 向下）。
          </p>
          <pre
            style={{
              margin: 0,
              fontSize: 11,
              background: "#0f172a",
              color: "#e2e8f0",
              padding: 10,
              overflow: "auto",
            }}
          >
            {JSON.stringify(resolved, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    showGrid: false,
    zoom: 0.85,
  },
  render: (args) => (
    <div style={{ height: "90vh" }}>
      <DtyPrintDesigner
        {...args}
        value={makeSampleTemplate()}
        sampleRecord={SAMPLE_RECORD}
        fields={SAMPLE_FIELDS}
      />
    </div>
  ),
};

export const TemplateGalleryStory: Story = {
  name: "Template Gallery (Import from Built-ins)",
  parameters: {
    docs: {
      description: {
        story:
          "点击左侧工具栏顶部的 **Import Template**（模板图标）按钮，即可打开内置模板库弹窗。" +
          "5 个内置模板：Sales Invoice、Sales Order、Purchase Order、Purchase Invoice、Journal Entry。" +
          "支持分类筛选 + 关键词搜索。选择后自动加载到设计器，如当前已有内容则弹确认提示。",
      },
    },
  },
  render: (args) => {
    const [template, setTemplate] = useState(createDefaultTemplate("New Print Template"));

    return (
      <div style={{ height: "90vh" }}>
        <DtyPrintDesigner
          {...args}
          value={template}
          onChange={setTemplate}
          fields={SAMPLE_FIELDS}
          sampleRecord={SAMPLE_RECORD}
          dataSources={SAMPLE_DATA_SOURCES}
          showGrid
          zoom={0.9}
          onTemplateImported={(tpl, def) =>
            // eslint-disable-next-line no-console
            console.log(`[onTemplateImported] "${tpl.name}"`, def)
          }
          onSave={(def) =>
            // eslint-disable-next-line no-console
            console.log("[onSave]", JSON.stringify(def, null, 2))
          }
        />
      </div>
    );
  },
  args: {
    showGrid: true,
    zoom: 0.9,
  },
};
