import type { MindMapData, MindMapNode } from "../types";
import {
  HORIZONTAL_GAP,
  MAX_NODE_WIDTH,
  MIN_NODE_HEIGHT,
  MIN_NODE_WIDTH,
  NODE_STYLES,
  VERTICAL_SPACING,
} from "../constants";

interface LayoutNode extends MindMapNode {
  subtreeHeight: number;
}

let measureEl: HTMLDivElement | null = null;

const getMeasureElement = (): HTMLDivElement | null => {
  if (typeof document === "undefined") {
    return null;
  }
  if (!measureEl) {
    measureEl = document.createElement("div");
    measureEl.id = "dty-mindmap-measure-el";
    Object.assign(measureEl.style, {
      position: "absolute",
      visibility: "hidden",
      top: "-9999px",
      left: "-9999px",
      width: "auto",
      height: "auto",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      overflowWrap: "break-word",
      boxSizing: "border-box",
      fontFamily: NODE_STYLES.fontFamily,
      fontSize: NODE_STYLES.fontSize,
      fontWeight: NODE_STYLES.fontWeight,
      lineHeight: NODE_STYLES.lineHeight,
      padding: NODE_STYLES.padding,
    } as Partial<CSSStyleDeclaration>);

    document.body.appendChild(measureEl);
  }
  return measureEl;
};

/**
 * 计算节点宽高。若传 widthHint 则固定宽度、按该宽度换行计算高度（用于 manualWidth）
 */
const calculateNodeDimensions = (text: string, widthHint?: number) => {
  const element = getMeasureElement();
  const clampWidth = (w: number) => Math.max(MIN_NODE_WIDTH, Math.min(MAX_NODE_WIDTH, w));

  if (!element) {
    const w = widthHint != null ? clampWidth(widthHint) : Math.max(MIN_NODE_WIDTH, Math.min(MAX_NODE_WIDTH, text.length * 8));
    return { width: w, height: MIN_NODE_HEIGHT };
  }

  element.textContent = text || " ";
  let width: number;
  if (widthHint != null && widthHint > 0) {
    width = clampWidth(widthHint);
    element.style.width = `${width}px`;
    element.style.maxWidth = `${width}px`;
  } else {
    element.style.maxWidth = `${MAX_NODE_WIDTH}px`;
    element.style.width = "fit-content";
    const rect = element.getBoundingClientRect();
    const naturalWidth = rect.width + 2;
    width = clampWidth(naturalWidth);
    element.style.width = `${width}px`;
  }
  const height = Math.max(element.getBoundingClientRect().height, MIN_NODE_HEIGHT);
  return { width, height };
};

export const computeLayout = (
  data: MindMapData,
  drafts?: Record<string, string>,
): Record<string, MindMapNode> => {
  const nodes: Record<string, MindMapNode> = {};

  Object.values(data.nodes).forEach((node) => {
    nodes[node.id] = {
      ...node,
      x: node.manualX !== undefined ? node.manualX : undefined,
      y: node.manualY !== undefined ? node.manualY : undefined,
      width: undefined,
      height: undefined,
    };
  });

  if (drafts) {
    Object.entries(drafts).forEach(([id, text]) => {
      if (nodes[id]) {
        nodes[id] = { ...nodes[id], text };
      }
    });
  }

  const ATTRIBUTES_ROW_HEIGHT = 28;

  const calculateHeight = (nodeId: string, depth: number): number => {
    const node = nodes[nodeId] as LayoutNode | undefined;
    if (!node) return 0;

    node.depth = depth;
    const widthHint = node.manualWidth;
    const { width, height: textHeight } = calculateNodeDimensions(node.text, widthHint);
    const hasAttributes = node.attributes && node.attributes.length > 0;
    const height = textHeight + (hasAttributes ? ATTRIBUTES_ROW_HEIGHT : 0);
    node.width = width;
    node.height = height;

    if (!node.children.length || !node.isExpanded) {
      node.subtreeHeight = height;
      return height;
    }

    let totalChildrenHeight = 0;
    node.children.forEach((childId) => {
      totalChildrenHeight += calculateHeight(childId, depth + 1);
    });
    totalChildrenHeight += (node.children.length - 1) * VERTICAL_SPACING;

    node.subtreeHeight = Math.max(height, totalChildrenHeight);
    return node.subtreeHeight;
  };

  calculateHeight(data.rootId, 0);

  const assignCoordinates = (nodeId: string, x: number, y: number) => {
    const node = nodes[nodeId] as LayoutNode | undefined;
    if (!node) return;

    if (node.manualX !== undefined && node.manualY !== undefined) {
      node.x = node.manualX;
      node.y = node.manualY;
    } else {
      node.x = x;
      node.y = y;
    }

    if (!node.children.length || !node.isExpanded) return;

    const parentX = node.x!;
    const parentY = node.y!;

    // 子节点始终按 children 数组顺序垂直排列，避免插入兄弟（如在新节点二下按回车插入新节点四）后与前后兄弟堆叠
    let totalBlockHeight = 0;
    node.children.forEach((childId) => {
      const child = nodes[childId] as LayoutNode | undefined;
      if (child) totalBlockHeight += child.subtreeHeight;
    });
    if (node.children.length > 1) {
      totalBlockHeight += (node.children.length - 1) * VERTICAL_SPACING;
    }

    let currentY = parentY - totalBlockHeight / 2;

    node.children.forEach((childId) => {
      const child = nodes[childId] as LayoutNode | undefined;
      if (!child) return;

      const childHeight = child.subtreeHeight;
      const childY = currentY + childHeight / 2;
      const childX = parentX + (node.width! / 2) + HORIZONTAL_GAP + (child.width! / 2);

      // 垂直位置一律按顺序排列；水平方向保留 manualX（用户拖拽后的横向偏移）
      child.x = child.manualX !== undefined ? child.manualX : childX;
      child.y = childY;

      assignCoordinates(childId, childX, childY);
      currentY += childHeight + VERTICAL_SPACING;
    });
  };

  assignCoordinates(data.rootId, 0, 0);

  return nodes;
};
