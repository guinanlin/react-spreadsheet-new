import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { createElement, DEFAULT_BOX_SIZE_MM } from "../schema/defaults";
import { DEFAULT_PX_PER_MM } from "../schema/constants";
import { clamp } from "../lib/units";
import type { DesignerAction, ToolId } from "../state/reducer";
import type {
  PrintTemplateDefinition,
  TemplateElement,
} from "../schema/types";
import {
  BarcodeView,
  DynamicTextView,
  ImageView,
  RectangleView,
  StaticTextView,
  TableView,
} from "./elements";

export interface PrintDesignerCanvasProps {
  definition: PrintTemplateDefinition;
  activeTool: ToolId;
  selectedId: string | null;
  sampleRecord?: Record<string, unknown>;
  readOnly?: boolean;
  showGrid?: boolean;
  zoom?: number;
  dispatch: React.Dispatch<DesignerAction>;
}

/** 最小可点击/可拖拽热区（px）。 */
const MIN_HIT_PX = 8;

/**
 * 拖拽状态（存 ref，不触发 React re-render）。
 */
interface DragSession {
  id: string;
  startXMm: number;
  startYMm: number;
  widthMm: number;
  heightMm: number;
  pointerStartX: number;
  pointerStartY: number;
  lastXMm: number;
  lastYMm: number;
}

/**
 * 保存每个元素 wrapper 的 DOM 节点 + 热区偏移量。
 *
 * 对于极薄元素，ElementWrapper 的实际 left/top 会向外扩展以保证可点击性，
 * padX/padY 记录该扩展量，拖拽时用于将 mm 坐标换算回 wrapper 的 left/top。
 */
interface ElementMeta {
  node: HTMLDivElement;
  padX: number;
  padY: number;
}

export function PrintDesignerCanvas({
  definition,
  activeTool,
  selectedId,
  sampleRecord,
  readOnly,
  showGrid,
  zoom = 1,
  dispatch,
}: PrintDesignerCanvasProps) {
  const pxPerMm = DEFAULT_PX_PER_MM * zoom;
  const pageRef = useRef<HTMLDivElement | null>(null);

  /**
   * 每个元素 wrapper 的 DOM ref + 热区偏移量映射。
   * 拖动时直接操作 style.left/top，完全绕过 React 渲染循环。
   */
  const elementRefs = useRef<Map<string, ElementMeta>>(new Map());

  /**
   * 当前拖拽会话（不走 useState，不触发任何 re-render）。
   */
  const dragRef = useRef<DragSession | null>(null);

  // 保持最新的 pxPerMm 和 page 尺寸可供 mousemove 读取。
  const pxPerMmRef = useRef(pxPerMm);
  pxPerMmRef.current = pxPerMm;
  const pageRef2 = useRef(definition.page);
  pageRef2.current = definition.page;

  const pageWidthPx = definition.page.widthMm * pxPerMm;
  const pageHeightPx = definition.page.heightMm * pxPerMm;

  // ─── 全局 mouse 监听（仅注册一次）─────────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (ev: MouseEvent) => {
      const session = dragRef.current;
      if (!session) return;

      const scale = pxPerMmRef.current;
      const page = pageRef2.current;

      const dxMm = (ev.clientX - session.pointerStartX) / scale;
      const dyMm = (ev.clientY - session.pointerStartY) / scale;

      const xMm = clamp(
        session.startXMm + dxMm,
        0,
        page.widthMm - session.widthMm
      );
      const yMm = clamp(
        session.startYMm + dyMm,
        0,
        page.heightMm - session.heightMm
      );

      session.lastXMm = xMm;
      session.lastYMm = yMm;

      // 直接写 DOM，完全绕过 React re-render
      // padX/padY 修正薄元素的热区扩展偏移，确保 wrapper left/top 与元素 mm 坐标对齐
      const meta = elementRefs.current.get(session.id);
      if (meta) {
        meta.node.style.left = `${xMm * scale - meta.padX}px`;
        meta.node.style.top = `${yMm * scale - meta.padY}px`;
      }
    };

    const onMouseUp = () => {
      const session = dragRef.current;
      if (!session) return;
      dragRef.current = null;

      // 拖拽结束才提交一次到 reducer
      dispatch({
        type: "MOVE_ELEMENT",
        id: session.id,
        xMm: session.lastXMm,
        yMm: session.lastYMm,
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dispatch]); // dispatch 引用稳定，effect 只注册一次

  // ─── 点击画布空白处放置元素 / 取消选中 ────────────────────────────────────
  const handlePageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (readOnly) return;
      if (!pageRef.current) return;
      if (e.target !== e.currentTarget) return;

      if (activeTool === "pointer") {
        dispatch({ type: "SELECT", id: null });
        return;
      }

      const rect = pageRef.current.getBoundingClientRect();
      const xMm = clamp(
        (e.clientX - rect.left) / pxPerMm,
        0,
        definition.page.widthMm
      );
      const yMm = clamp(
        (e.clientY - rect.top) / pxPerMm,
        0,
        definition.page.heightMm
      );
      const { widthMm, heightMm } = DEFAULT_BOX_SIZE_MM[activeTool];
      const box = {
        xMm: clamp(xMm, 0, definition.page.widthMm - widthMm),
        yMm: clamp(yMm, 0, definition.page.heightMm - heightMm),
        widthMm,
        heightMm,
      };
      const el = createElement(activeTool, box);
      dispatch({ type: "ADD_ELEMENT", element: el });
    },
    [activeTool, definition.page.heightMm, definition.page.widthMm, dispatch, pxPerMm, readOnly]
  );

  // ─── 元素 mousedown：开始拖拽 ─────────────────────────────────────────────
  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, el: TemplateElement) => {
      if (readOnly) return;
      if (activeTool !== "pointer") return;
      e.stopPropagation();
      dispatch({ type: "SELECT", id: el.id });

      dragRef.current = {
        id: el.id,
        startXMm: el.box.xMm,
        startYMm: el.box.yMm,
        widthMm: el.box.widthMm,
        heightMm: el.box.heightMm,
        pointerStartX: e.clientX,
        pointerStartY: e.clientY,
        lastXMm: el.box.xMm,
        lastYMm: el.box.yMm,
      };
    },
    [activeTool, dispatch, readOnly]
  );

  const sortedElements = useMemo(() => {
    return [...definition.elements].sort(
      (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)
    );
  }, [definition.elements]);

  const { topMm, rightMm, bottomMm, leftMm } = definition.page.margins;

  return (
    <div
      aria-label="Print designer canvas"
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        background: "#f1f5f9",
        overflow: "auto",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        ref={pageRef}
        role="group"
        aria-label="Printable page"
        onClick={handlePageClick}
        style={{
          position: "relative",
          width: pageWidthPx,
          height: pageHeightPx,
          background: "#fff",
          boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
          backgroundImage: showGrid
            ? "linear-gradient(#eef2f7 1px, transparent 1px), linear-gradient(90deg, #eef2f7 1px, transparent 1px)"
            : "none",
          backgroundSize: showGrid
            ? `${pxPerMm * 10}px ${pxPerMm * 10}px`
            : undefined,
          cursor:
            activeTool === "pointer"
              ? "default"
              : readOnly
              ? "default"
              : "crosshair",
          userSelect: "none",
        }}
      >
        {/* 页面内容区边界虚线框 */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: leftMm * pxPerMm,
            top: topMm * pxPerMm,
            width: (definition.page.widthMm - leftMm - rightMm) * pxPerMm,
            height: (definition.page.heightMm - topMm - bottomMm) * pxPerMm,
            border: "1px dashed #cbd5e1",
            pointerEvents: "none",
          }}
        />
        {definition.page.headerHeightMm > 0 && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: (topMm + definition.page.headerHeightMm) * pxPerMm,
              height: 0,
              borderTop: "1px dotted #94a3b8",
              pointerEvents: "none",
            }}
          />
        )}
        {definition.page.footerHeightMm > 0 && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: (bottomMm + definition.page.footerHeightMm) * pxPerMm,
              height: 0,
              borderTop: "1px dotted #94a3b8",
              pointerEvents: "none",
            }}
          />
        )}

        {sortedElements.map((el) => (
          <ElementWrapper
            key={el.id}
            element={el}
            isSelected={selectedId === el.id}
            pxPerMm={pxPerMm}
            onMouseDown={(e) => handleElementMouseDown(e, el)}
            domRef={(node, padX, padY) => {
              if (node) elementRefs.current.set(el.id, { node, padX, padY });
              else elementRefs.current.delete(el.id);
            }}
          >
            {renderElementBody(el, definition, sampleRecord)}
          </ElementWrapper>
        ))}
      </div>
    </div>
  );
}

interface ElementWrapperProps {
  element: TemplateElement;
  isSelected: boolean;
  pxPerMm: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** node 为 null 时表示卸载；padX/padY 为热区扩展偏移（px）。 */
  domRef: (node: HTMLDivElement | null, padX: number, padY: number) => void;
  children: React.ReactNode;
}

const ElementWrapper = React.memo(function ElementWrapper({
  element,
  isSelected,
  pxPerMm,
  onMouseDown,
  domRef,
  children,
}: ElementWrapperProps) {
  const actualW = element.box.widthMm * pxPerMm;
  const actualH = element.box.heightMm * pxPerMm;

  // 当元素在屏幕上的尺寸小于 MIN_HIT_PX 时，扩大 wrapper 的可点击区域，
  // 同时保持视觉内容在原始尺寸的区域内渲染。
  const wrapW = Math.max(actualW, MIN_HIT_PX);
  const wrapH = Math.max(actualH, MIN_HIT_PX);
  const padX = (wrapW - actualW) / 2;
  const padY = (wrapH - actualH) / 2;

  const thin = wrapW > actualW || wrapH > actualH;

  return (
    <div
      ref={(node) => domRef(node, padX, padY)}
      role="button"
      aria-label={element.name ?? element.type}
      data-element-id={element.id}
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        // wrapper 左上角向外扩展 padX/padY，使热区居中于元素
        left: element.box.xMm * pxPerMm - padX,
        top: element.box.yMm * pxPerMm - padY,
        width: wrapW,
        height: wrapH,
        outline: isSelected ? "1.5px solid #7b4b57" : "1px solid transparent",
        outlineOffset: -1,
        cursor: "move",
        background: "transparent",
        zIndex: element.zIndex ?? 0,
        willChange: "left, top",
        // 薄元素居中显示内容
        display: thin ? "flex" : "block",
        alignItems: thin ? "center" : undefined,
        justifyContent: thin ? "center" : undefined,
      }}
    >
      {thin ? (
        // 内容层固定在原始尺寸，不随热区扩大而拉伸
        <div
          style={{
            width: actualW,
            height: actualH,
            flexShrink: 0,
            overflow: "visible",
          }}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
});

function renderElementBody(
  el: TemplateElement,
  def: PrintTemplateDefinition,
  sampleRecord?: Record<string, unknown>
) {
  switch (el.type) {
    case "static_text":
      return <StaticTextView element={el} definition={def} />;
    case "dynamic_text":
      return (
        <DynamicTextView
          element={el}
          definition={def}
          sampleRecord={sampleRecord}
        />
      );
    case "rectangle":
      return <RectangleView element={el} />;
    case "image":
      return <ImageView element={el} sampleRecord={sampleRecord} />;
    case "table":
      return (
        <TableView
          element={el}
          definition={def}
          sampleRecord={sampleRecord}
        />
      );
    case "barcode":
      return <BarcodeView element={el} sampleRecord={sampleRecord} />;
    default:
      return null;
  }
}
