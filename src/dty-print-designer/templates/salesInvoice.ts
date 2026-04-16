import {
  dividerLine,
  dynamicText,
  image,
  labelValue,
  newDef,
  rightLabelValue,
  staticText,
  table,
  totalRow,
} from "./_builder";
import { registerBuiltinTemplate } from "./registry";

function factory() {
  const def = newDef("Sales Invoice");
  def.dataSource = { id: "sales_invoice", label: "Sales Invoice", doctype: "Sales Invoice" };

  def.elements = [
    // ── Company logo placeholder (top-left)
    image({ xMm: 15, yMm: 10, widthMm: 28, heightMm: 14 }, {
      name: "Company Logo",
      binding: "doc.company_logo",
      alt: "Company Logo",
    }),

    // ── Company info (top-left, below logo)
    dynamicText("doc.company", { xMm: 15, yMm: 26, widthMm: 90, heightMm: 7 }, {
      name: "Company Name", styleId: "title",
    }),
    dynamicText("doc.company_address", { xMm: 15, yMm: 34, widthMm: 85, heightMm: 5 }, {
      name: "Company Address", styleId: "caption",
    }),

    // ── Document title (top-right)
    staticText("SALES INVOICE", { xMm: 120, yMm: 10, widthMm: 75, heightMm: 10 }, {
      name: "Doc Title", styleId: "title",
      style: { alignHorizontal: "right", fontSizePt: 16 },
    }),

    // ── Invoice meta (right column)
    ...rightLabelValue("Invoice #", "doc.name", 24, 120, 155),
    ...rightLabelValue("Date", "doc.posting_date", 31, 120, 155),
    ...rightLabelValue("Due Date", "doc.due_date", 38, 120, 155),

    dividerLine(46),

    // ── Bill To
    staticText("BILL TO", { xMm: 15, yMm: 49, widthMm: 80, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.customer", { xMm: 15, yMm: 55, widthMm: 85, heightMm: 7 }, {
      name: "Customer Name", styleId: "title",
    }),
    dynamicText("doc.customer_address", { xMm: 15, yMm: 63, widthMm: 85, heightMm: 10 }, {
      name: "Customer Address", styleId: "caption",
    }),

    // ── Ship To
    staticText("SHIP TO", { xMm: 110, yMm: 49, widthMm: 85, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.shipping_address", { xMm: 110, yMm: 55, widthMm: 85, heightMm: 18 }, {
      name: "Shipping Address", styleId: "caption",
    }),

    dividerLine(78),

    // ── Items table
    table(
      "doc.items",
      [
        { label: "Item", binding: "row.item_name", widthMm: 60 },
        { label: "Description", binding: "row.description", widthMm: 50 },
        { label: "Qty", binding: "row.qty", widthMm: 15, align: "right" },
        { label: "Rate", binding: "row.rate", widthMm: 25, align: "right" },
        { label: "Amount", binding: "row.amount", widthMm: 30, align: "right" },
      ],
      { xMm: 15, yMm: 81, widthMm: 180, heightMm: 80 },
      { headerHeightMm: 8, rowHeightMm: 6, previewRows: 6 }
    ),

    dividerLine(166),

    // ── Totals
    ...totalRow("Sub Total:", "doc.net_total", 170),
    ...totalRow("Tax:", "doc.total_taxes_and_charges", 179),
    dividerLine(188, 120, 75),
    ...totalRow("GRAND TOTAL:", "doc.grand_total", 192, true),

    // ── Notes
    staticText("Notes / Terms", { xMm: 15, yMm: 205, widthMm: 90, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.terms", { xMm: 15, yMm: 211, widthMm: 90, heightMm: 15 }, {
      name: "Terms", styleId: "caption", fallback: "Payment due within 30 days.",
    }),

    // ── Signature area
    dividerLine(240, 120, 75),
    staticText("Authorised Signatory", { xMm: 120, yMm: 243, widthMm: 75, heightMm: 5 }, {
      styleId: "caption", style: { alignHorizontal: "center" },
    }),
  ];

  return def;
}

registerBuiltinTemplate({
  id: "sales_invoice",
  name: "Sales Invoice",
  description: "Standard A4 sales invoice with customer info, itemized table, taxes and signature block.",
  category: "sales",
  tags: ["invoice", "sales", "customer", "billing"],
  factory,
});
