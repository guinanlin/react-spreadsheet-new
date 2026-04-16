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
  const def = newDef("Purchase Order");
  def.dataSource = { id: "purchase_order", label: "Purchase Order", doctype: "Purchase Order" };

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

    staticText("PURCHASE ORDER", { xMm: 105, yMm: 10, widthMm: 90, heightMm: 10 }, {
      name: "Doc Title", styleId: "title",
      style: { alignHorizontal: "right", fontSizePt: 16 },
    }),

    ...rightLabelValue("PO #", "doc.name", 24, 120, 155),
    ...rightLabelValue("Date", "doc.transaction_date", 31, 120, 155),
    ...rightLabelValue("Required By", "doc.schedule_date", 38, 120, 155),

    dividerLine(46),

    // Vendor info (left)
    staticText("VENDOR", { xMm: 15, yMm: 49, widthMm: 80, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.supplier", { xMm: 15, yMm: 55, widthMm: 90, heightMm: 7 }, {
      name: "Supplier Name", styleId: "title",
    }),
    dynamicText("doc.supplier_address", { xMm: 15, yMm: 63, widthMm: 90, heightMm: 10 }, {
      name: "Supplier Address", styleId: "caption",
    }),

    // Delivery address (right)
    staticText("DELIVER TO", { xMm: 115, yMm: 49, widthMm: 80, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.company_address", { xMm: 115, yMm: 55, widthMm: 80, heightMm: 18 }, {
      name: "Delivery Address", styleId: "caption",
    }),

    dividerLine(78),

    table(
      "doc.items",
      [
        { label: "Item Code", binding: "row.item_code", widthMm: 35 },
        { label: "Item Name", binding: "row.item_name", widthMm: 55 },
        { label: "Qty", binding: "row.qty", widthMm: 15, align: "right" },
        { label: "UOM", binding: "row.uom", widthMm: 15, align: "center" },
        { label: "Rate", binding: "row.rate", widthMm: 30, align: "right" },
        { label: "Amount", binding: "row.amount", widthMm: 30, align: "right" },
      ],
      { xMm: 15, yMm: 81, widthMm: 180, heightMm: 80 },
      { headerHeightMm: 8, rowHeightMm: 6, previewRows: 6 }
    ),

    dividerLine(166),
    ...totalRow("Net Total:", "doc.net_total", 170),
    ...totalRow("Tax:", "doc.total_taxes_and_charges", 179),
    dividerLine(188, 120, 75),
    ...totalRow("TOTAL:", "doc.grand_total", 192, true),

    // Payment terms
    staticText("Payment Terms", { xMm: 15, yMm: 205, widthMm: 90, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.payment_terms_template", { xMm: 15, yMm: 211, widthMm: 90, heightMm: 6 }, {
      name: "Payment Terms", styleId: "default", fallback: "Net 30",
    }),

    // Prepared by / Approved by boxes
    dividerLine(232, 15, 75),
    staticText("Prepared By", { xMm: 15, yMm: 235, widthMm: 75, heightMm: 5 }, {
      styleId: "caption", style: { alignHorizontal: "center" },
    }),
    dividerLine(232, 110, 75),
    staticText("Approved By", { xMm: 110, yMm: 235, widthMm: 75, heightMm: 5 }, {
      styleId: "caption", style: { alignHorizontal: "center" },
    }),
  ];

  return def;
}

registerBuiltinTemplate({
  id: "purchase_order",
  name: "Purchase Order",
  description: "Purchase order to vendors with delivery details, itemized table, totals and approval blocks.",
  category: "purchase",
  tags: ["order", "purchase", "vendor", "procurement"],
  factory,
});
