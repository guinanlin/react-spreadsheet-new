import { SCHEMA_VERSION } from "./constants";
import type { PrintTemplateDefinition } from "./types";

export type Migration = (raw: Record<string, unknown>) => Record<string, unknown>;

/**
 * 迁移表：键为 *源* 版本号，值为把该版本升级到下一个版本的函数。
 *
 * v1 目前为空，未来新增字段时按版本号登记迁移即可：
 *
 *   "1.0.0": (raw) => ({ ...raw, schemaVersion: "1.1.0", newField: defaultVal })
 */
const migrations: Record<string, Migration> = {};

/**
 * 把一份外部 JSON（可能是旧版本）迁移到当前 `SCHEMA_VERSION`。
 * 未知历史版本会被直接打标到当前版本，不会抛错，便于做“兼容读取”。
 */
export function migrateToLatest(
  raw: unknown
): PrintTemplateDefinition {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid template: expected an object");
  }
  let current = { ...(raw as Record<string, unknown>) };
  let guard = 0;
  while (current.schemaVersion !== SCHEMA_VERSION) {
    const from = String(current.schemaVersion ?? "");
    const migration = migrations[from];
    if (!migration) {
      current = { ...current, schemaVersion: SCHEMA_VERSION };
      break;
    }
    current = migration(current);
    guard += 1;
    if (guard > 32) {
      throw new Error("Template migration loop detected");
    }
  }
  return current as unknown as PrintTemplateDefinition;
}
