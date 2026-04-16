import {
  dividerLine,
  dynamicText,
  image,
  newDef,
  rightLabelValue,
  staticText,
  table,
} from "./_builder";
import { registerBuiltinTemplate } from "./registry";
import { createId } from "../lib/id";

function factory() {
  const def = newDef("Journal Entry");
  def.dataSource = { id: "journal_entry", label: "Journal Entry", doctype: "Journal Entry" };

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

    // Title
    staticText("JOURNAL ENTRY", { xMm: 110, yMm: 10, widthMm: 85, heightMm: 10 }, {
      name: "Doc Title", styleId: "title",
      style: { alignHorizontal: "right", fontSizePt: 16 },
    }),

    ...rightLabelValue("Entry #", "doc.name", 24, 120, 155),
    ...rightLabelValue("Voucher Type", "doc.voucher_type", 31, 120, 155),
    ...rightLabelValue("Posting Date", "doc.posting_date", 38, 120, 155),

    dividerLine(46),

    // Account entries table
    {
      id: createId("tb"),
      type: "table" as const,
      name: "Accounts",
      box: { xMm: 15, yMm: 49, widthMm: 180, heightMm: 100 },
      repeatPath: "doc.accounts",
      columns: [
        { id: createId("col"), label: "Account", binding: "row.account", widthMm: 70 },
        { id: createId("col"), label: "Party", binding: "row.party", widthMm: 45 },
        { id: createId("col"), label: "Debit", binding: "row.debit_in_account_currency", widthMm: 32, align: "right" as const },
        { id: createId("col"), label: "Credit", binding: "row.credit_in_account_currency", widthMm: 33, align: "right" as const },
      ],
      headerHeightMm: 8,
      rowHeightMm: 6,
      previewRows: 6,
      showHeader: true,
      styleId: "default",
    },

    dividerLine(154),

    // Totals row (label + value, right-aligned)
    staticText("Total Debit:", {
      xMm: 110, yMm: 158, widthMm: 50, heightMm: 7,
    }, {
      styleId: "title",
      style: { alignHorizontal: "right" },
    }),
    dynamicText("doc.total_debit", {
      xMm: 163, yMm: 158, widthMm: 32, heightMm: 7,
    }, {
      styleId: "title",
      format: "currency",
      style: { alignHorizontal: "right" },
    }),
    staticText("Total Credit:", {
      xMm: 110, yMm: 167, widthMm: 50, heightMm: 7,
    }, {
      styleId: "title",
      style: { alignHorizontal: "right" },
    }),
    dynamicText("doc.total_credit", {
      xMm: 163, yMm: 167, widthMm: 32, heightMm: 7,
    }, {
      styleId: "title",
      format: "currency",
      style: { alignHorizontal: "right" },
    }),

    dividerLine(178),

    // Narration / Remarks
    staticText("Remarks / Narration", { xMm: 15, yMm: 181, widthMm: 180, heightMm: 5 }, { styleId: "caption" }),
    dynamicText("doc.remark", { xMm: 15, yMm: 187, widthMm: 180, heightMm: 12 }, {
      name: "Narration", styleId: "default", fallback: "—",
    }),

    dividerLine(208),

    // Signatures
    dividerLine(235, 15, 75),
    staticText("Prepared By", { xMm: 15, yMm: 238, widthMm: 75, heightMm: 5 }, {
      styleId: "caption", style: { alignHorizontal: "center" },
    }),
    dividerLine(235, 110, 75),
    staticText("Reviewed By", { xMm: 110, yMm: 238, widthMm: 75, heightMm: 5 }, {
      styleId: "caption", style: { alignHorizontal: "center" },
    }),
  ];

  return def;
}

registerBuiltinTemplate({
  id: "journal_entry",
  name: "Journal Entry",
  description: "Accounting journal / voucher with debit-credit account table, totals and narration.",
  category: "accounting",
  tags: ["journal", "voucher", "凭证", "accounting", "debit", "credit"],
  factory,
});
