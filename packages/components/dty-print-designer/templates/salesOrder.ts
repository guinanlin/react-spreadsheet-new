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
  const def = newDef("Sales Order");
  def.dataSource = { id: "sales_order", label: "Sales Order", doctype: "Sales Order" };

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

    staticText("SALES ORDER", { xMm: 120, yMm: 10, widthMm: 75, heightMm: 10 }, {
      name: "Doc Title", styleId: "title",
      style: { alignHorizontal: "right", fontSizePt: 16 },
    }),

    ...rightLabelValue("Order #", "doc.name", 24, 120, 155),
    ...rightLabelValue("Order Date", "doc.transaction_date", 31, 120, 155),
    ...rightLabelValue("Delivery Date", "doc.delivery_date", 38, 120, 155),

    dividerLine(46),

    staticText("CUSTOMER", { xMm: 15, yMm: 49, widthMm: 80, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.customer", { xMm: 15, yMm: 55, widthMm: 85, heightMm: 7 }, {
      name: "Customer Name", styleId: "title",
    }),
    dynamicText("doc.customer_address", { xMm: 15, yMm: 63, widthMm: 85, heightMm: 10 }, {
      name: "Customer Address", styleId: "caption",
    }),

    staticText("SHIP TO", { xMm: 110, yMm: 49, widthMm: 85, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.shipping_address", { xMm: 110, yMm: 55, widthMm: 85, heightMm: 18 }, {
      name: "Shipping Address", styleId: "caption",
    }),

    dividerLine(78),

    table(
      "doc.items",
      [
        { label: "Item Code", binding: "row.item_code", widthMm: 35 },
        { label: "Item Name", binding: "row.item_name", widthMm: 65 },
        { label: "Qty", binding: "row.qty", widthMm: 15, align: "right" },
        { label: "UOM", binding: "row.uom", widthMm: 15, align: "center" },
        { label: "Rate", binding: "row.rate", widthMm: 25, align: "right" },
        { label: "Amount", binding: "row.amount", widthMm: 25, align: "right" },
      ],
      { xMm: 15, yMm: 81, widthMm: 180, heightMm: 80 },
      { headerHeightMm: 8, rowHeightMm: 6, previewRows: 6 }
    ),

    dividerLine(166),
    ...totalRow("Net Total:", "doc.net_total", 170),
    ...totalRow("Tax:", "doc.total_taxes_and_charges", 179),
    dividerLine(188, 120, 75),
    ...totalRow("GRAND TOTAL:", "doc.grand_total", 192, true),

    staticText("Terms & Conditions", { xMm: 15, yMm: 205, widthMm: 90, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.terms", { xMm: 15, yMm: 211, widthMm: 90, heightMm: 15 }, {
      name: "Terms", styleId: "caption", fallback: "Standard terms apply.",
    }),

    dividerLine(240, 120, 75),
    staticText("Authorised Signatory", { xMm: 120, yMm: 243, widthMm: 75, heightMm: 5 }, {
      styleId: "caption", style: { alignHorizontal: "center" },
    }),
  ];

  return def;
}

registerBuiltinTemplate({
  id: "sales_order",
  name: "Sales Order",
  description: "Sales order with customer details, delivery date, itemized table and totals.",
  category: "sales",
  tags: ["order", "sales", "customer", "delivery"],
  factory,
});
