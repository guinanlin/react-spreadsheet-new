// 主组件
export { DtyMindMap } from "./DtyMindMap";
export type { DtyMindMapProps } from "./DtyMindMap";

// Store
export { MindMapStore } from "./mind-map-store";

// Hooks
export { useMindMap } from "./use-mind-map";
export { useBehaviorSubjectValue } from "./hooks/use-behavior-subject-value";

// 子组件（按需使用）
export { MindMapNodeComponent } from "./components/mind-map-node";
export { MindMapEdge } from "./components/mind-map-edge";
export { Toolbar } from "./components/toolbar";
export { CanvasControls } from "./components/canvas-controls";
export { Instructions } from "./components/instructions";

// 工具与数据
export { cloneMindMapData, buildMindMapSnapshot, normalizeMindMapData } from "./data-helpers";
export { DEFAULT_MIND_MAP_DATA, NODE_STYLES } from "./constants";
export { computeLayout } from "./utils/layout";

// 类型
export type {
  MindMapData,
  MindMapNode,
  NodeAttribute,
  NodeId,
  ViewportState,
  HistoryState,
} from "./types";
export { ThemeMode, THEMES, MindMapSaveStatus } from "./types";
