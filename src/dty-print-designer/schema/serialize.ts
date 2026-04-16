import { migrateToLatest } from "./migrate";
import type { PrintTemplateDefinition } from "./types";

export function serializeTemplate(
  def: PrintTemplateDefinition,
  pretty = true
): string {
  return JSON.stringify(def, null, pretty ? 2 : 0);
}

export function deserializeTemplate(
  input: string | Record<string, unknown>
): PrintTemplateDefinition {
  const raw = typeof input === "string" ? JSON.parse(input) : input;
  return migrateToLatest(raw);
}
