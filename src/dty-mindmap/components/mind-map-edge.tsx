import { MIN_NODE_WIDTH } from "../constants";
import type { MindMapEdgeLinkMode, MindMapNode } from "../types";
import { ThemeMode, THEMES } from "../types";

interface MindMapEdgeProps {
  source: MindMapNode;
  target: MindMapNode;
  theme: ThemeMode;
  linkMode: MindMapEdgeLinkMode;
  /** 与 target 同级的兄弟数量（用于单子节点时画水平线） */
  siblingCount: number;
}

const useCurvedSegment = (linkMode: MindMapEdgeLinkMode, source: MindMapNode): boolean => {
  if (linkMode === "curved-all") return true;
  if (linkMode === "orthogonal-all") return false;
  return source.parentId === null;
};

const buildOrthogonalPath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  siblingCount: number,
): string => {
  const dy = Math.abs(endY - startY);
  if (siblingCount === 1 && dy < 2) {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }
  const midX = startX + (endX - startX) / 2;
  return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
};

export const MindMapEdge = ({ source, target, theme, linkMode, siblingCount }: MindMapEdgeProps) => {
  if (
    source.x === undefined ||
    source.y === undefined ||
    target.x === undefined ||
    target.y === undefined
  ) {
    return null;
  }

  const styles = THEMES[theme];
  const sourceWidth = source.width || MIN_NODE_WIDTH;
  const targetWidth = target.width || MIN_NODE_WIDTH;

  const startX = source.x + sourceWidth / 2;
  const startY = source.y;
  const endX = target.x - targetWidth / 2;
  const endY = target.y;

  const curved = useCurvedSegment(linkMode, source);
  let pathData: string;
  if (curved) {
    const controlPointOffset = (endX - startX) / 2;
    pathData = `
    M ${startX} ${startY}
    C ${startX + controlPointOffset} ${startY},
      ${endX - controlPointOffset} ${endY},
      ${endX} ${endY}
  `;
  } else {
    pathData = buildOrthogonalPath(startX, startY, endX, endY, siblingCount);
  }

  return (
    <path
      d={pathData}
      fill="none"
      strokeWidth="2"
      strokeLinejoin="round"
      className={`${styles.edge} transition-all duration-300 ease-in-out`}
    />
  );
};
