"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MAX_NODE_WIDTH, MIN_NODE_HEIGHT } from "./constants";
import { MindMapStore } from "./mind-map-store";
import { useMindMap } from "./use-mind-map";
import type { MindMapEdgeLinkMode, MindMapNode, ViewportState } from "./types";
import { ThemeMode, THEMES } from "./types";
import { Toolbar } from "./components/toolbar";
import { MindMapEdge } from "./components/mind-map-edge";
import { MindMapNodeComponent } from "./components/mind-map-node";
import { CanvasControls } from "./components/canvas-controls";
import { Instructions } from "./components/instructions";
import type { MindMapData } from "./types";
import { DEFAULT_MIND_MAP_DATA } from "./constants";
import { normalizeMindMapData } from "./data-helpers";
import { computeLayout } from "./utils/layout";

export interface DtyMindMapProps {
  /** 初始数据，不传则使用默认根节点 */
  initialData?: MindMapData | unknown;
  /** 主题：light | dark | midnight */
  theme?: "light" | "dark" | "midnight";
  /** 数据变更回调（可用于持久化） */
  onDataChange?: (data: MindMapData) => void;
  /** 是否显示顶部工具栏 */
  showToolbar?: boolean;
  /** 是否显示右下角操作说明 */
  showInstructions?: boolean;
  /** 是否显示左下角缩放控制 */
  showCanvasControls?: boolean;
  /** 容器类名 */
  className?: string;
  /** 容器高度，数字为 px */
  height?: string | number;
  /** 容器宽度，数字为 px */
  width?: string | number;
  /**
   * 父子连线的绘制策略
   * @default "curved-all"
   */
  edgeLinkMode?: MindMapEdgeLinkMode;
}

const buildViewport = (): ViewportState => {
  if (typeof window === "undefined") {
    return { x: 0, y: 0, scale: 1 };
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 1 };
};

const getContainerSize = (element: HTMLDivElement | null) => {
  if (element) {
    const rect = element.getBoundingClientRect();
    return { width: rect.width || 1, height: rect.height || 1 };
  }
  if (typeof window !== "undefined") {
    return { width: window.innerWidth, height: window.innerHeight };
  }
  return { width: 1, height: 1 };
};

const THEME_MAP = {
  light: ThemeMode.LIGHT,
  dark: ThemeMode.DARK,
  midnight: ThemeMode.MIDNIGHT,
} as const;

const TOOLBAR_LABELS = {
  undo: "撤销",
  redo: "重做",
  addChild: "添加子节点",
  deleteNode: "删除节点",
};

const CONTROL_LABELS = {
  zoomIn: "放大",
  zoomOut: "缩小",
  reset: "重新排列并适应画布",
};

const INSTRUCTIONS_ITEMS = [
  { label: "选中节点", action: "点击节点" },
  { label: "编辑", action: "双击节点" },
  { label: "添加子节点", action: "Tab 或悬停点 +" },
  { label: "添加兄弟节点", action: "Enter" },
  { label: "删除节点", action: "Backspace / Delete" },
  { label: "导航", action: "方向键" },
  { label: "平移画布", action: "拖拽空白区域" },
];

export function DtyMindMap({
  initialData,
  theme: themeProp = "light",
  onDataChange,
  showToolbar = true,
  showInstructions = true,
  showCanvasControls = true,
  className = "",
  height = "100vh",
  width = "100%",
  edgeLinkMode = "curved-all",
}: DtyMindMapProps) {
  const normalizedInitial = useMemo(
    () => (initialData != null ? normalizeMindMapData(initialData) : DEFAULT_MIND_MAP_DATA),
    [initialData],
  );

  const initialRef = useRef<MindMapData | null>(null);
  if (initialRef.current === null) {
    initialRef.current = normalizedInitial;
  }
  const store = useMemo(() => new MindMapStore(initialRef.current!), []);

  const theme = THEME_MAP[themeProp] ?? ThemeMode.LIGHT;

  const {
    nodes,
    selectedId,
    setSelectedId,
    editingId,
    setEditingId,
    updateNodeText,
    updateDraft,
    addChild,
    addSibling,
    deleteNode,
    toggleCollapse,
    updateNodePosition,
    updateNodeDragPosition,
    undo,
    redo,
    canUndo,
    canRedo,
    data,
  } = useMindMap(store);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [data, onDataChange]);

  const [viewport, setViewport] = useState<ViewportState>(buildViewport);
  const [isPanning, setIsPanning] = useState(false);
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasManualViewChangeRef = useRef(false);

  const navigateSelection = useCallback(
    (direction: "left" | "right" | "up" | "down") => {
      if (!selectedId) return;
      const current = nodes[selectedId];
      if (!current) return;

      let nextId: string | null = null;
      const allNodes = Object.values(nodes) as MindMapNode[];

      if (direction === "left" && current.parentId) {
        nextId = current.parentId;
      } else if (direction === "right" && current.children.length > 0 && current.isExpanded) {
        nextId = current.children[Math.floor(current.children.length / 2)];
      } else {
        const cx = current.x || 0;
        const cy = current.y || 0;
        let closestDist = Number.POSITIVE_INFINITY;
        allNodes.forEach((node) => {
          if (node.id === current.id) return;
          const nx = node.x || 0;
          const ny = node.y || 0;
          const dx = nx - cx;
          const dy = ny - cy;
          let valid = false;
          if (direction === "up") valid = dy < -10 && Math.abs(dx) < 100;
          if (direction === "down") valid = dy > 10 && Math.abs(dx) < 100;
          if (direction === "right") valid = dx > 10;
          if (valid) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < closestDist) {
              closestDist = dist;
              nextId = node.id;
            }
          }
        });
      }

      if (nextId) {
        setSelectedId(nextId);
      }
    },
    [nodes, selectedId, setSelectedId],
  );

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (editingId) return;
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        event.preventDefault();
        undo();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "y") {
        event.preventDefault();
        redo();
        return;
      }
      switch (event.key) {
        case "Tab":
          event.preventDefault();
          if (selectedId) addChild(selectedId);
          break;
        case "Enter":
          event.preventDefault();
          if (selectedId) addSibling(selectedId);
          break;
        case "Backspace":
        case "Delete":
          if (selectedId) deleteNode(selectedId);
          break;
        case " ":
          event.preventDefault();
          if (selectedId) setEditingId(selectedId);
          break;
        case "ArrowLeft":
          event.preventDefault();
          navigateSelection("left");
          break;
        case "ArrowRight":
          event.preventDefault();
          navigateSelection("right");
          break;
        case "ArrowUp":
          event.preventDefault();
          navigateSelection("up");
          break;
        case "ArrowDown":
          event.preventDefault();
          navigateSelection("down");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [
    selectedId,
    editingId,
    addChild,
    addSibling,
    deleteNode,
    undo,
    redo,
    navigateSelection,
    setEditingId,
  ]);

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();
      hasManualViewChangeRef.current = true;
      if (event.ctrlKey || event.metaKey) {
        const zoomSensitivity = 0.001;
        const newScale = Math.min(
          Math.max(0.1, viewport.scale - event.deltaY * zoomSensitivity),
          5,
        );
        setViewport((prev) => ({ ...prev, scale: newScale }));
      } else {
        setViewport((prev) => ({
          ...prev,
          x: prev.x - event.deltaX,
          y: prev.y - event.deltaY,
        }));
      }
    },
    [viewport.scale],
  );

  const handleMouseDown = (event: React.MouseEvent) => {
    if (isDraggingNode) return;
    if ((event.target as Element).tagName === "svg" || (event.target as Element).id === "dty-mindmap-canvas-bg") {
      setIsPanning(true);
      setLastMousePos({ x: event.clientX, y: event.clientY });
      setSelectedId(null);
      hasManualViewChangeRef.current = true;
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isPanning) {
      const dx = event.clientX - lastMousePos.x;
      const dy = event.clientY - lastMousePos.y;
      setViewport((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      setLastMousePos({ x: event.clientX, y: event.clientY });
    }
  };

  const stopPanning = () => {
    setIsPanning(false);
  };

  const handleZoomIn = () =>
    setViewport((prev) => {
      hasManualViewChangeRef.current = true;
      return { ...prev, scale: Math.min(prev.scale * 1.2, 5) };
    });
  const handleZoomOut = () =>
    setViewport((prev) => {
      hasManualViewChangeRef.current = true;
      return { ...prev, scale: Math.max(prev.scale / 1.2, 0.1) };
    });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventGesture = (event: Event) => {
      event.preventDefault();
    };
    const gestureEvents = ["gesturestart", "gesturechange", "gestureend"] as const;
    gestureEvents.forEach((type) => {
      container.addEventListener(type, preventGesture as EventListener, { passive: false });
    });

    return () => {
      gestureEvents.forEach((type) => {
        container.removeEventListener(type, preventGesture as EventListener);
      });
    };
  }, []);

  const fitViewportToLayoutNodes = useCallback((layoutNodes: Record<string, MindMapNode>) => {
    hasManualViewChangeRef.current = false;
    const allNodes = Object.values(layoutNodes) as MindMapNode[];
    const visibleNodes = allNodes.filter((node) => {
      if (node.x === undefined || node.y === undefined) return false;
      let current = node;
      while (current.parentId) {
        const parent = layoutNodes[current.parentId];
        if (!parent || !parent.isExpanded) return false;
        current = parent;
      }
      return true;
    });

    if (!visibleNodes.length) {
      setViewport(buildViewport());
      return;
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    visibleNodes.forEach((node) => {
      if (node.x === undefined || node.y === undefined) return;
      const { x, y } = node;
      const nodeWidth = node.width || MAX_NODE_WIDTH;
      const nodeHeight = node.height || MIN_NODE_HEIGHT;
      minX = Math.min(minX, x - nodeWidth / 2);
      maxX = Math.max(maxX, x + nodeWidth / 2);
      minY = Math.min(minY, y - nodeHeight / 2);
      maxY = Math.max(maxY, y + nodeHeight / 2);
    });

    const padding = 80;
    const bboxWidth = Math.max(maxX - minX, 100);
    const bboxHeight = Math.max(maxY - minY, 100);
    const { width: viewportWidth, height: viewportHeight } = getContainerSize(
      containerRef.current,
    );
    const availableWidth = Math.max(viewportWidth - padding * 2, 100);
    const availableHeight = Math.max(viewportHeight - padding * 2, 100);
    const scaleX = availableWidth / bboxWidth;
    const scaleY = availableHeight / bboxHeight;

    let fitScale = Math.min(scaleX, scaleY);
    fitScale = Math.min(fitScale, 1.2);
    fitScale = Math.max(fitScale, 0.1);

    const centerX = minX + bboxWidth / 2;
    const centerY = minY + bboxHeight / 2;
    const newX = viewportWidth / 2 - centerX * fitScale;
    const newY = viewportHeight / 2 - centerY * fitScale;
    setViewport({ x: newX, y: newY, scale: fitScale });
  }, []);

  const handleResetView = useCallback(() => {
    store.resetAutomaticLayout();
    const snap = store.getCurrentState();
    const layoutNodes = computeLayout(snap.history.present, snap.drafts);
    fitViewportToLayoutNodes(layoutNodes);
  }, [store, fitViewportToLayoutNodes]);

  useEffect(() => {
    if (hasManualViewChangeRef.current) {
      return;
    }
    const availableNodes = Object.values(nodes) as MindMapNode[];
    const hasPositions = availableNodes.some(
      (node) => node.x !== undefined && node.y !== undefined,
    );
    if (!hasPositions) return;
    fitViewportToLayoutNodes(nodes);
  }, [fitViewportToLayoutNodes, nodes]);

  const styles = THEMES[theme];

  const renderEdges = useMemo(() => {
    return (Object.values(nodes) as MindMapNode[]).map((node) => {
      if (!node.parentId) return null;
      const parent = nodes[node.parentId];
      if (!parent || !parent.isExpanded) return null;
      const siblingCount = parent.children.length;
      return (
        <MindMapEdge
          key={`edge-${node.id}`}
          source={parent}
          target={node}
          theme={theme}
          linkMode={edgeLinkMode}
          siblingCount={siblingCount}
        />
      );
    });
  }, [nodes, theme, edgeLinkMode]);

  const renderNodes = useMemo(() => {
    return (Object.values(nodes) as MindMapNode[])
      .filter((node) => {
        if (!node.parentId) return true;
        const parent = nodes[node.parentId];
        return parent && parent.isExpanded && parent.x !== undefined;
      })
      .map((node) => (
        <MindMapNodeComponent
          key={node.id}
          node={node}
          theme={theme}
          isSelected={selectedId === node.id}
          isEditing={editingId === node.id}
          viewport={viewport}
          onSelect={setSelectedId}
          onEditStart={setEditingId}
          onEditChange={updateDraft}
          onEditEnd={(id, text) => {
            updateNodeText(id, text);
            updateDraft(id, null);
            setEditingId(null);
          }}
          onToggleCollapse={toggleCollapse}
          onAddChild={addChild}
          onPositionChange={updateNodePosition}
          onPositionDrag={updateNodeDragPosition}
          onDragStart={() => {
            setIsDraggingNode(true);
            hasManualViewChangeRef.current = true;
          }}
          onDragEnd={() => setIsDraggingNode(false)}
        />
      ));
  }, [
    nodes,
    theme,
    selectedId,
    editingId,
    setSelectedId,
    setEditingId,
    updateDraft,
    updateNodeText,
    toggleCollapse,
    addChild,
    viewport,
  ]);

  const containerStyle = useMemo(
    () => ({
      height: typeof height === "number" ? `${height}px` : height,
      width: typeof width === "number" ? `${width}px` : width,
      minHeight: typeof height === "number" ? undefined : height === "100%" ? "100vh" : undefined,
    }),
    [height, width],
  );

  const canvas: ReactNode = (
    <div
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopPanning}
      onMouseLeave={stopPanning}
    >
      <svg id="dty-mindmap-canvas-bg" className="w-full h-full block" xmlns="http://www.w3.org/2000/svg">
        <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.scale})`}>
          {renderEdges}
          {renderNodes}
        </g>
      </svg>
    </div>
  );

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={`relative overflow-hidden ${styles.bg} selection:bg-blue-500/30 ${className}`}
    >
      {showToolbar && (
        <Toolbar
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onAdd={() => selectedId && addChild(selectedId)}
          onDelete={() => selectedId && deleteNode(selectedId)}
          labels={TOOLBAR_LABELS}
        />
      )}

      {canvas}

      {showCanvasControls && (
        <CanvasControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetView}
          labels={CONTROL_LABELS}
        />
      )}
      {showInstructions && (
        <Instructions
          title="操作说明"
          toggleShow="显示快捷键"
          toggleHide="收起"
          items={INSTRUCTIONS_ITEMS}
        />
      )}
    </div>
  );
}

DtyMindMap.displayName = "DtyMindMap";
