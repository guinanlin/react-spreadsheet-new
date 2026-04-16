import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";

const playgroundDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(playgroundDir, "..");

export default defineConfig({
  root: playgroundDir,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(repoRoot, "src"),
      "@dty-lucky-sheet/core": path.resolve(
        repoRoot,
        "src/dty-lucky-sheet/packages/core/src"
      ),
      "@dty-lucky-sheet/react": path.resolve(
        repoRoot,
        "src/dty-lucky-sheet/packages/react/src"
      ),
      "@dty-lucky-sheet/formula": path.resolve(
        repoRoot,
        "src/dty-lucky-sheet/packages/formula/src"
      ),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
