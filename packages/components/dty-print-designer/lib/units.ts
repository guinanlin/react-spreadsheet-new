export const MM_PER_INCH = 25.4;
export const PT_PER_INCH = 72;

/**
 * mm -> PDF point（PDFKit/iText/PDFKit-iOS 等默认单位）。
 */
export function mmToPt(mm: number): number {
  return (mm / MM_PER_INCH) * PT_PER_INCH;
}

export function ptToMm(pt: number): number {
  return (pt / PT_PER_INCH) * MM_PER_INCH;
}

/**
 * mm -> px（给屏幕预览用）。
 */
export function mmToPx(mm: number, dpi = 96): number {
  return (mm / MM_PER_INCH) * dpi;
}

export function pxToMm(px: number, dpi = 96): number {
  return (px / dpi) * MM_PER_INCH;
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
