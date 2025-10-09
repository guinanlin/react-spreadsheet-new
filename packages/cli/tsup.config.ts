import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
  shims: true,
  // shebang 会在 package.json 的 bin 字段自动处理
});

