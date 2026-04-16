# PDFKit 适配层对接需求文档

> **谁该读**：实现「PDFKit 适配层」的工程师（Node `pdfkit` / iOS `PDFKit` / Java iText / .NET PdfSharp / Go gopdf 等都可适用）。
> **文档目标**：给出 `dty-print-designer` 与 PDFKit 之间的**稳定合同**，双方各自演进不互相污染。

---

## 1. 目标与边界

### 1.1 职责分工

| 层 | 输入 | 产物 | 说明 |
| -- | ---- | ---- | ---- |
| **A. 设计器** (`DtyPrintDesigner`) | 页面参数 + 样式 token + 字段绑定 | `PrintTemplateDefinition` JSON | **只做 define**，不生成 PDF |
| **B. 合并层** (`mergeTemplateWithData`) | `PrintTemplateDefinition` + 业务数据 | `ResolvedDocument` JSON | 纯函数，无副作用；可在浏览器、Node、服务端任意位置运行 |
| **C. PDFKit 适配层** | `ResolvedDocument` | PDF 文件 / 字节流 | **本文档的实现范围** |

**核心原则**：适配层**不解释 binding 表达式、不加载样式 token**，只按 `drawOps` 无脑绘制。
所有语义解析已在第 B 层完成。

### 1.2 非目标（适配层不需要做的事）

- 解析 `binding`、`repeatPath` —— 已由 `mergeTemplateWithData` 解析。
- 解析 `styleId` / rules / tokens —— 已合并为 `drawOps[*].style`。
- 迁移 `schemaVersion` —— 只消费当前版本的 `ResolvedDocument`；读到不支持的 `schemaVersion` 应直接报错。
- 计算表格跨页 / 分页符 —— v1 合并层只产出一页；多页分页属于合并层的扩展职责。
- 计算字段 fallback 文案 —— 已在合并结果里。

---

## 2. 输入契约（ResolvedDocument）

### 2.1 顶层

```ts
interface ResolvedDocument {
  schemaVersion: string;             // 当前 "1.0.0"
  unit: "pt";                         // 永远是 PDF point
  coordinateSystem: "top-left-y-down"; // 原点：页面左上；Y 轴向下
  pages: ResolvedPage[];
}

interface ResolvedPage {
  widthPt: number;                    // 页面物理宽度 (pt)
  heightPt: number;                   // 页面物理高度 (pt)
  drawOps: DrawOp[];                  // 按绘制顺序排列（zIndex 已处理）
}
```

> **坐标系转换**：大多数 PDFKit 实现（Node `pdfkit`）默认原点在页面**左上**、Y 向下，与本协议一致，**无需翻转**。
> 如果目标引擎（如 Apple `PDFKit`、传统 PostScript/iText 低层 API）使用**左下**原点，适配层应做一次翻转：
>
> ```
> yPt_engine = page.heightPt - op.at.yPt - op.at.heightPt
> ```

### 2.2 绘制指令 `DrawOp`

适配层**只需要实现以下 4 种指令**：

```ts
type DrawOp = TextDrawOp | RectDrawOp | ImageDrawOp | BarcodeDrawOp;

interface BoxPt {
  xPt: number;     // 左上角 X
  yPt: number;     // 左上角 Y
  widthPt: number;
  heightPt: number;
}

interface TextDrawOp {
  type: "text";
  at: BoxPt;
  text: string;                      // 已完成字段插值 + 前后缀 + 格式化
  style: ResolvedTextStyle;
  sourceElementId: string;           // 来源元素 id，便于日志追踪
}

interface RectDrawOp {
  type: "rect";
  at: BoxPt;
  border?: ResolvedBorderStyle;      // 二者至少应绘制其一
  fill?: ResolvedFill;
  sourceElementId: string;
}

interface ImageDrawOp {
  type: "image";
  at: BoxPt;
  src: string;                       // 静态 URL 或已解析的字段值（URL / dataURI / 绝对路径）
  fit?: "contain" | "cover" | "fill" | "none";
  sourceElementId: string;
}

interface BarcodeDrawOp {
  type: "barcode";
  at: BoxPt;
  format: "qrcode" | "code128" | "code39" | "ean13" | "ean8" | "upc";
  value: string;                     // 已解析的静态字符串
  sourceElementId: string;
}
```

### 2.3 样式子契约

```ts
interface ResolvedTextStyle {
  fontFamily?: string;
  fontSizePt?: number;               // 默认 10pt
  fontWeight?: number;               // 100–900，PDFKit 通常映射到 Bold/Regular
  italic?: boolean;
  color?: string;                    // 合法 CSS 颜色（#RRGGBB / rgb() 等）；默认 #111827
  align?: "left" | "center" | "right";     // 默认 left
  verticalAlign?: "top" | "middle" | "bottom"; // 默认 top
  lineHeight?: number;               // 行高倍率，默认 1.2
}

interface ResolvedBorderStyle {
  widthPt: number;                   // 线宽
  color: string;                     // 线色
  style: "solid" | "dashed" | "dotted";
}

interface ResolvedFill {
  color: string;                     // 填充色
}
```

---

## 3. 适配层绘制语义

### 3.1 text

- `at.widthPt` 为文本行宽约束；**超宽文本必须换行**（word wrap，优先按空格断行，CJK 可按字断行）。
- `at.heightPt` 为垂直可用区域；**超高部分**：v1 直接裁剪（不滚动、不自动缩小字号）。建议实现「末行省略号 …」作为稳健性增强，非强制。
- `style.align` 在宽度范围内的水平对齐。
- `style.verticalAlign` 决定首行/整段垂直摆放：
  - `top`：baseline 贴近 `yPt + ascent`（默认）
  - `middle`：整段垂直居中于 `[yPt, yPt+heightPt]`
  - `bottom`：末行贴近 `yPt + heightPt`
- `style.italic === true` 映射为斜体变体（或 `oblique` fallback）。
- `style.fontWeight >= 600` 映射为 Bold 变体。
- **字体 fallback 规则**（PDFKit 通常不会内置中文字体）：
  1. 按 `fontFamily` 精确查找；
  2. 若失败，按 `fontWeight` + `italic` 查找注册别名；
  3. 若仍失败，使用适配层默认兜底字体；
  4. 文本包含 CJK 字符但当前字体无字形，**必须**切换到 CJK fallback 字体（适配层在启动时注册）。

### 3.2 rect

- 同一 `RectDrawOp` 可以同时包含 `fill` 与 `border`：**先填充，再描边**。
- `border.style`：
  - `solid` → 实线
  - `dashed` → `[widthPt*2, widthPt*2]` 虚线，或 PDFKit 的 `dash(gap)` 默认值
  - `dotted` → `[widthPt, widthPt]`
- `widthPt` 为 0 时不绘制描边。
- 无 `border` 且无 `fill` 时，指令可以**忽略**（不影响结果）。

### 3.3 image

- `src` 可能是：
  - `http(s)://...`（需要网络获取）
  - `file://...` 或绝对路径（服务端加载）
  - `data:image/...;base64,...`（内联）
- 加载失败策略：**打印一个带边框的占位框**（描边色 `#d1d5db`），并在日志中带上 `sourceElementId`。
- `fit` 语义与 CSS `object-fit` 一致，默认 `contain`：
  - `contain`：保持比例，整图落入 `at`，空白居中
  - `cover`：保持比例，充满 `at`，超出裁剪
  - `fill`：拉伸到 `at`（可能变形）
  - `none`：原始尺寸，按 `at.xPt/yPt` 左上对齐，超出裁剪

### 3.4 barcode

- 设计器**不自带**条码/二维码渲染库；由适配层选择：
  - Node：`pdfkit` + `bwip-js` 或 `qrcode` 等
  - iOS：`CIFilter.qrCodeGenerator()`
  - Java：ZXing
- `format` 决定编码器；若不支持某个 format，**必须**报错并在 `sourceElementId` 打 warning；不要静默画空白。
- 渲染到 `at` 区域时保持宽高比，留 2pt 安全内边距。

---

## 4. 分页与多页（v1）

- 当前合并层只产出**一页**（`pages.length === 1`）。
- 适配层**应当按 `pages` 循环**开新页，一页一次 `addPage({ size: [widthPt, heightPt] })`。
- 未来合并层支持跨页 table 时，只会**增加 `pages` 元素**；**不会**在单页内塞溢出绘制。所以适配层**不需要**处理「overflow in a page」。

---

## 5. 最小适配层需具备的能力清单

适配层实现方**必须**提供：

- [ ] **字体注册 API**：至少允许在启动期注册 1 个西文字体 + 1 个 CJK 兜底字体，并与 `fontFamily` 字符串建立映射。
- [ ] **文本绘制**：支持字号、字重、斜体、颜色、对齐、换行、行高。
- [ ] **矩形绘制**：fill + stroke，支持 `solid/dashed/dotted`。
- [ ] **图片绘制**：PNG + JPEG 必须；GIF/WebP 可选。
- [ ] **条码编码库接入**（至少 qrcode + code128）。
- [ ] **统一错误上报**：解析失败 / 图片加载失败 / 字体 fallback 均需带 `sourceElementId` 输出日志。

**建议**提供但非必需：

- 字体字形缺失检测（缺字回退）
- 末行省略号
- 表格行内文本自动缩字号
- 字体子集嵌入（减小 PDF 体积）

---

## 6. 参考实现（Node `pdfkit`）

> 以下代码仅用于说明合同。实际工程请封装为适配器 class 并加完整错误处理。

```ts
import PDFDocument from "pdfkit";
import type {
  ResolvedDocument,
  DrawOp,
  TextDrawOp,
  RectDrawOp,
  ImageDrawOp,
  BarcodeDrawOp,
} from "@ctyun/react-spreadsheet-new";

export function renderToPdf(
  resolved: ResolvedDocument,
  out: NodeJS.WritableStream,
  assets: { loadImage(src: string): Promise<Buffer>; registerFonts(doc: PDFKit.PDFDocument): void }
) {
  if (resolved.schemaVersion !== "1.0.0") {
    throw new Error(`Unsupported schemaVersion: ${resolved.schemaVersion}`);
  }

  const doc = new PDFDocument({ autoFirstPage: false });
  doc.pipe(out);
  assets.registerFonts(doc);

  for (const page of resolved.pages) {
    doc.addPage({ size: [page.widthPt, page.heightPt], margin: 0 });
    for (const op of page.drawOps) {
      drawOne(doc, op, assets);
    }
  }
  doc.end();
}

function drawOne(
  doc: PDFKit.PDFDocument,
  op: DrawOp,
  assets: { loadImage(src: string): Promise<Buffer> }
) {
  switch (op.type) {
    case "text":  return drawText(doc, op);
    case "rect":  return drawRect(doc, op);
    case "image": return drawImage(doc, op, assets);
    case "barcode": return drawBarcode(doc, op);
  }
}

function drawText(doc: PDFKit.PDFDocument, op: TextDrawOp) {
  const s = op.style;
  doc.save();
  if (s.color) doc.fillColor(s.color);
  if (s.fontSizePt) doc.fontSize(s.fontSizePt);
  const fontName = pickFontName(s.fontFamily, s.fontWeight, s.italic);
  if (fontName) doc.font(fontName);

  doc.text(op.text, op.at.xPt, op.at.yPt, {
    width: op.at.widthPt,
    height: op.at.heightPt,
    align: s.align ?? "left",
    lineBreak: true,
    ellipsis: true,              // 建议增强
    lineGap: 0,
  });
  doc.restore();
}

function drawRect(doc: PDFKit.PDFDocument, op: RectDrawOp) {
  doc.save();
  doc.rect(op.at.xPt, op.at.yPt, op.at.widthPt, op.at.heightPt);
  if (op.fill) {
    if (op.border) doc.fillAndStroke(op.fill.color, op.border.color);
    else doc.fill(op.fill.color);
  } else if (op.border) {
    doc.lineWidth(op.border.widthPt).strokeColor(op.border.color);
    if (op.border.style === "dashed") doc.dash(op.border.widthPt * 2);
    if (op.border.style === "dotted") doc.dash(op.border.widthPt, { space: op.border.widthPt });
    doc.stroke();
  }
  doc.restore();
}

async function drawImage(
  doc: PDFKit.PDFDocument,
  op: ImageDrawOp,
  assets: { loadImage(src: string): Promise<Buffer> }
) {
  try {
    const buf = await assets.loadImage(op.src);
    const fit = op.fit ?? "contain";
    doc.image(buf, op.at.xPt, op.at.yPt, {
      width: op.at.widthPt,
      height: op.at.heightPt,
      fit: fit === "cover" ? [op.at.widthPt, op.at.heightPt] : undefined,
    });
  } catch (e) {
    console.warn(`[pdfkit-adapter] image failed (${op.sourceElementId}):`, e);
    doc.save();
    doc.rect(op.at.xPt, op.at.yPt, op.at.widthPt, op.at.heightPt)
       .lineWidth(0.5).strokeColor("#d1d5db").dash(2).stroke();
    doc.restore();
  }
}

function drawBarcode(doc: PDFKit.PDFDocument, op: BarcodeDrawOp) {
  // Use your barcode renderer of choice; for Node we recommend bwip-js.
  // const png = bwipjs.toBuffer({ bcid: op.format, text: op.value, ... });
  // doc.image(png, op.at.xPt, op.at.yPt, { fit: [op.at.widthPt, op.at.heightPt] });
}

function pickFontName(family?: string, weight?: number, italic?: boolean): string | undefined {
  // Adapter owns this mapping; example only.
  if (italic && (weight ?? 400) >= 600) return "Body-BoldItalic";
  if (italic) return "Body-Italic";
  if ((weight ?? 400) >= 600) return "Body-Bold";
  return "Body-Regular";
}
```

---

## 7. 错误与降级策略（适配层必须遵守）

| 场景 | 策略 |
| ---- | ---- |
| `schemaVersion` 不匹配 | **直接抛错**；禁止静默兼容 |
| 未知 `DrawOp.type` | 忽略 + warning（保证前向兼容） |
| 字体文件缺失 | fallback 到兜底字体 + warning |
| 图片加载失败 | 画占位框（第 3.3 节） + warning |
| 条码 `format` 不支持 | 抛错（避免静默漏印） |
| `text.text` 含控制字符 | 过滤 `\u0000-\u001F`（除 `\n`、`\t`） |
| `at.widthPt <= 0` 或 `heightPt <= 0` | 忽略该指令 + debug 日志 |

---

## 8. 测试用例（建议作为冒烟）

适配层实现完成后，**必须**通过以下固定样本：

1. **最小文本**：一页、一个 `static_text`，字号 10pt，左对齐，英文内容。
2. **动态字段 + 前后缀 + 数字格式化**：`grand_total` → `"Grand Total: $1,280.50"`。
3. **矩形 + 虚线边框**：颜色 `#7b4b57`，线宽 0.2mm → 转换后 `widthPt ≈ 0.567`。
4. **图片（PNG + 远程 URL）**：`fit: contain`，无失败。
5. **缺失 binding**：走 `fallback`；合并层不输出 draw op。
6. **表格 3 行**：header + 3 行，列右对齐生效。
7. **二维码**：`format: "qrcode"`, `value: "INV-2026-001"`。
8. **多页（未来）**：当合并层产出 `pages.length > 1` 时，`addPage` 顺序正确。

Storybook 中的 `ResolvedDrawOpsPreview` 故事可直接作为 1–7 的输入样本源。

---

## 9. 版本与演进约定

- `ResolvedDocument.schemaVersion` **严格匹配**适配层支持列表，例如：`["1.0.0"]`。
- 新增字段时保证**向后兼容**（适配层忽略未知字段即可），`schemaVersion` 只有在**破坏性**变化时升主版本号。
- 合并层新增 `DrawOp.type` 时：**必须**升次版本号（`1.1.0`），并更新本文件 §2.2。

---

## 10. 术语速查

| 术语 | 含义 |
| ---- | ---- |
| **定义层** | 设计器产物，即 `PrintTemplateDefinition` JSON |
| **合并层** | `mergeTemplateWithData` 纯函数，把定义层 + 业务数据 → `ResolvedDocument` |
| **适配层** | 本文档的对象；消费 `ResolvedDocument` 生成真实 PDF/图片/HTML |
| **pt** | PostScript point = 1/72 inch；PDFKit 默认单位 |
| **mm** | 毫米；设计器坐标单位；`1 mm ≈ 2.8346 pt` |
| **binding** | 点路径字符串，如 `doc.items.0.qty`；**仅在合并层解析**，适配层不见 |

---

## 附录：一行函数签名

```ts
import { mergeTemplateWithData } from "@ctyun/react-spreadsheet-new";

const resolved = mergeTemplateWithData(definition, businessRecord, {
  maxTableRowsPerPage: 25,   // 可选，当前合并层未自动分页
  keepUnresolved: false,     // 适配层生产环境建议 false；画布预览用 true
});
// resolved 即是本文档约定的 ResolvedDocument。
```
