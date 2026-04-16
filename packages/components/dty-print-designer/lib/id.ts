let counter = 0;

/**
 * 生成元素/列等对象的唯一 ID。
 * 不追求全局唯一，仅在当前运行时内避免冲突即可。
 */
export function createId(prefix = "el"): string {
  counter += 1;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${counter.toString(36)}_${rand}`;
}
