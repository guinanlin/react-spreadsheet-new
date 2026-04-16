/**
 * 当前 PrintTemplateDefinition 的 schema 版本。
 *
 * 设计器输出的 JSON 必然带 `schemaVersion` 字段，未来字段演进时通过
 * `./migrate` 中的迁移表升级到最新版本。
 */
export const SCHEMA_VERSION = "1.0.0";

/**
 * 预置纸张尺寸（纵向，单位 mm）。
 */
export const PAPER_DIMENSIONS_MM = {
  A4: { widthMm: 210, heightMm: 297 },
  A5: { widthMm: 148, heightMm: 210 },
  Letter: { widthMm: 216, heightMm: 279 },
} as const;

export type PresetPaperSizeId = keyof typeof PAPER_DIMENSIONS_MM;

/**
 * 画布默认显示比例（1mm -> N px），由 DPI 96 推导：
 *   1 inch = 25.4 mm = 96 px  =>  1 mm ≈ 3.7795 px
 */
export const DEFAULT_PX_PER_MM = 96 / 25.4;
