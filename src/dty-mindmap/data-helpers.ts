import { DEFAULT_MIND_MAP_DATA } from "./constants";
import type { MindMapData, MindMapNode } from "./types";

const cloneNode = (node: MindMapNode): MindMapNode => ({
  id: node.id,
  text: node.text,
  parentId: node.parentId,
  children: [...node.children],
  isExpanded: node.isExpanded,
  depth: node.depth,
  manualX: node.manualX,
  manualY: node.manualY,
  attributes: node.attributes ? [...node.attributes] : undefined,
  manualWidth: node.manualWidth,
});

export const cloneMindMapData = (data: MindMapData): MindMapData => ({
  rootId: data.rootId,
  nodes: Object.fromEntries(
    Object.entries(data.nodes).map(([id, node]) => [id, cloneNode(node)]),
  ),
});

export const buildMindMapSnapshot = (data: MindMapData): string =>
  JSON.stringify(data);

export const normalizeMindMapData = (value: unknown): MindMapData => {
  if (
    !value ||
    typeof value !== "object" ||
    !("rootId" in value) ||
    !("nodes" in value)
  ) {
    return cloneMindMapData(DEFAULT_MIND_MAP_DATA);
  }

  const parsed = value as Partial<MindMapData>;
  const rootId =
    typeof parsed.rootId === "string" ? parsed.rootId : DEFAULT_MIND_MAP_DATA.rootId;
  const nodesInput = parsed.nodes ?? {};

  if (!nodesInput[rootId]) {
    return cloneMindMapData(DEFAULT_MIND_MAP_DATA);
  }

  const normalizedNodes: Record<string, MindMapNode> = {};
  for (const [id, node] of Object.entries(nodesInput)) {
    if (!node || typeof node !== "object") continue;
    const { text, parentId, children, isExpanded, depth, manualX, manualY, attributes, manualWidth } = node as MindMapNode;
    const attrs: MindMapNode["attributes"] = Array.isArray(attributes)
      ? attributes
          .filter((a): a is { label: string } | { key: string; value: string } => a != null && typeof a === "object")
          .map((a) => {
            if ("label" in a && typeof a.label === "string") return { label: a.label };
            if ("key" in a && "value" in a && typeof a.key === "string" && typeof a.value === "string")
              return { key: a.key, value: a.value };
            return null;
          })
          .filter((a): a is NonNullable<typeof a> => a != null)
      : undefined;
    normalizedNodes[id] = {
      id,
      text: typeof text === "string" ? text : "",
      parentId: typeof parentId === "string" || parentId === null ? parentId : null,
      children: Array.isArray(children)
        ? children.filter((childId): childId is string => typeof childId === "string")
        : [],
      isExpanded: typeof isExpanded === "boolean" ? isExpanded : true,
      depth: typeof depth === "number" ? depth : 0,
      manualX: typeof manualX === "number" ? manualX : undefined,
      manualY: typeof manualY === "number" ? manualY : undefined,
      attributes: attrs?.length ? attrs : undefined,
      manualWidth: typeof manualWidth === "number" && manualWidth > 0 ? manualWidth : undefined,
    };
  }

  if (!normalizedNodes[rootId]) {
    return cloneMindMapData(DEFAULT_MIND_MAP_DATA);
  }

  return cloneMindMapData({
    rootId,
    nodes: normalizedNodes,
  });
};
