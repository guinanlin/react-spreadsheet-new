/**
 * 沿点路径解析绑定值。
 *
 * 支持：
 *   - 点路径：  `doc.invoice_no`
 *   - 方括号：  `doc.items[0].qty`
 *   - 混合：    `doc.items.0.qty`
 */
export function resolveBindingPath(root: unknown, path: string): unknown {
  if (!root || typeof root !== "object" || !path) return undefined;
  const segments = splitPath(path);
  let cursor: unknown = root;
  for (const seg of segments) {
    if (cursor == null) return undefined;
    if (typeof cursor !== "object") return undefined;
    cursor = (cursor as Record<string, unknown>)[seg];
  }
  return cursor;
}

function splitPath(path: string): string[] {
  return path
    .replace(/\[(\w+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
}

export function isValidBindingPath(path: string | undefined | null): boolean {
  if (!path) return false;
  return /^[A-Za-z_$][\w$]*(\.[A-Za-z_$0-9][\w$]*|\[\w+\])*$/.test(path);
}
