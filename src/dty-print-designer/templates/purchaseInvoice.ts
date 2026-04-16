import {
  dividerLine,
  dynamicText,
  image,
  newDef,
  rightLabelValue,
  staticText,
  table,
  totalRow,
} from "./_builder";
import { registerBuiltinTemplate } from "./registry";

function factory() {
  const def = newDef("Purchase Invoice");
  def.dataSource = { id: "purchase_invoice", label: "Purchase Invoice", doctype: "Purchase Invoice" };

  def.elements = [
    image({ xMm: 15, yMm: 10, widthMm: 28, heightMm: 14 }, {
      name: "Company Logo", binding: "doc.company_logo",
    }),

    dynamicText("doc.company", { xMm: 15, yMm: 26, widthMm: 90, heightMm: 7 }, {
      name: "Company Name", styleId: "title",
    }),
    dynamicText("doc.company_address", { xMm: 15, yMm: 34, widthMm: 85, heightMm: 5 }, {
      name: "Company Address", styleId: "caption",
    }),

    staticText("PURCHASE INVOICE", { xMm: 100, yMm: 10, widthMm: 95, heightMm: 10 }, {
      name: "Doc Title", styleId: "title",
      style: { alignHorizontal: "right", fontSizePt: 14 },
    }),

    ...rightLabelValue("Invoice #", "doc.name", 24, 120, 155),
    ...rightLabelValue("Supplier Bill #", "doc.bill_no", 31, 120, 155),
    ...rightLabelValue("Posting Date", "doc.posting_date", 38, 120, 155),
    ...rightLabelValue("Due Date", "doc.due_date", 45, 120, 155),

    dividerLine(52),

    staticText("FROM (VENDOR)", { xMm: 15, yMm: 55, widthMm: 80, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.supplier", { xMm: 15, yMm: 61, widthMm: 90, heightMm: 7 }, {
      name: "Supplier Name", styleId: "title",
    }),
    dynamicText("doc.supplier_address", { xMm: 15, yMm: 69, widthMm: 90, heightMm: 10 }, {
      name: "Supplier Address", styleId: "caption",
    }),

    staticText("BILLED TO", { xMm: 115, yMm: 55, widthMm: 80, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.company_address", { xMm: 115, yMm: 61, widthMm: 80, heightMm: 18 }, {
      name: "Billing Address", styleId: "caption",
    }),

    dividerLine(84),

    table(
      "doc.items",
      [
        { label: "Item Code", binding: "row.item_code", widthMm: 35 },
        { label: "Description", binding: "row.description", widthMm: 55 },
        { label: "Qty", binding: "row.qty", widthMm: 15, align: "right" },
        { label: "UOM", binding: "row.uom", widthMm: 15, align: "center" },
        { label: "Rate", binding: "row.rate", widthMm: 30, align: "right" },
        { label: "Amount", binding: "row.amount", widthMm: 30, align: "right" },
      ],
      { xMm: 15, yMm: 87, widthMm: 180, heightMm: 80 },
      { headerHeightMm: 8, rowHeightMm: 6, previewRows: 6 }
    ),

    dividerLine(172),
    ...totalRow("Net Total:", "doc.net_total", 176),
    ...totalRow("Tax:", "doc.total_taxes_and_charges", 185),
    dividerLine(194, 120, 75),
    ...totalRow("GRAND TOTAL:", "doc.grand_total", 198, true),

    staticText("Bank Details", { xMm: 15, yMm: 210, widthMm: 90, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.bank_account", { xMm: 15, yMm: 216, widthMm: 90, heightMm: 6 }, {
      name: "Bank Account", styleId: "default", fallback: "—",
    }),

    dividerLine(240, 120, 75),
    staticText("Authorised Signatory", { xMm: 120, yMm: 243, widthMm: 75, heightMm: 5 }, {
      styleId: "caption", style: { alignHorizontal: "center" },
    }),
  ];

  return def;
}

registerBuiltinTemplate({
  id: "purchase_invoice",
  name: "Purchase Invoice",
  description: "Vendor purchase invoice with supplier reference, itemized table, taxes and payment details.",
  category: "purchase",
  tags: ["invoice", "purchase", "vendor", "supplier"],
  factory,
});
