import React from "react";

/**
 * 纸张方向
 */
export type PrintOrientation = "portrait" | "landscape";

/**
 * 纸张尺寸类型
 */
export type PaperSize = "A4" | "A5" | "Letter";

/**
 * 页面设置
 */
export interface PageSetup {
  paperSize: PaperSize;
  orientation: PrintOrientation;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
}

/**
 * 打印设计器组件属性
 */
export interface DtyPrintDesignerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  content?: string;
  pageSetup?: Partial<PageSetup>;
  showGrid?: boolean;
  readOnly?: boolean;
  debug?: boolean;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
  onPageSetupChange?: (setup: PageSetup) => void;
}
