export type NodeId = string;

/**
 * 节点连线的整体策略（传给 DtyMindMap 的 edgeLinkMode）
 * - curved-all：全部为平滑贝塞尔曲线
 * - orthogonal-all：全部为折线（单子节点且与父同高时为水平直线）
 * - mixed-root-curved：仅「根 → 一级子节点」为曲线，更深层级为折线
 */
export type MindMapEdgeLinkMode = "curved-all" | "orthogonal-all" | "mixed-root-curved";

/** 节点底部自定义属性：纯标签 "委外" 或键值 "工艺: 委外电镀" */
export type NodeAttribute =
  | { label: string }
  | { key: string; value: string };

export interface MindMapNode {
  id: NodeId;
  text: string;
  parentId: NodeId | null;
  children: NodeId[];
  isExpanded: boolean;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  manualX?: number;
  manualY?: number;
  /** 节点底部展示的自定义属性（标签），如 委外、工艺:委外电镀 */
  attributes?: NodeAttribute[];
  /** 指定节点宽度（px），不设则按内容自动计算；设了可避免内容多时过于窄、换行过多 */
  manualWidth?: number;
}

export interface MindMapData {
  rootId: NodeId;
  nodes: Record<NodeId, MindMapNode>;
}

export interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

export interface HistoryState {
  past: MindMapData[];
  present: MindMapData;
  future: MindMapData[];
}

export enum ThemeMode {
  LIGHT = "LIGHT",
  DARK = "DARK",
  MIDNIGHT = "MIDNIGHT",
}

export const THEMES = {
  [ThemeMode.LIGHT]: {
    bg: "bg-slate-50",
    nodeBg: "fill-white",
    text: "text-slate-900",
    edge: "stroke-slate-300",
    highlight: "stroke-blue-500",
  },
  [ThemeMode.DARK]: {
    bg: "bg-slate-900",
    nodeBg: "fill-slate-800",
    text: "text-slate-100",
    edge: "stroke-slate-600",
    highlight: "stroke-indigo-400",
  },
  [ThemeMode.MIDNIGHT]: {
    bg: "bg-black",
    nodeBg: "fill-zinc-900",
    text: "text-zinc-200",
    edge: "stroke-zinc-700",
    highlight: "stroke-emerald-500",
  },
} as const;

export enum MindMapSaveStatus {
  IDLE = "IDLE",
  DIRTY = "DIRTY",
  SAVING = "SAVING",
  SAVED = "SAVED",
  ERROR = "ERROR",
}
