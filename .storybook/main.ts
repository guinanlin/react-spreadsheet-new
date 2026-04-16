import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'node:url';

const storybookDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * 全量：默认索引整个 src 下所有 story（冷启动最重）。
 * 聚焦：设置环境变量 STORYBOOK_STORIES=focus 时只加载下方列表中的 glob（见 package.json 里 dev:storybook:focus）。
 * 可按正在开发的目录改 focusStories，减少扫描与编译。
 */
function getStories(): string[] {
  if (process.env.STORYBOOK_STORIES === "focus") {
    const focusStories = [
      "../src/spreadsheet/**/*.stories.@(ts|tsx)",
      // 正在改其它模块时取消注释或追加一行即可，例如：
      // "../src/pivot/**/*.stories.@(ts|tsx)",
    ];
    return focusStories;
  }
  return ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"];
}

const config: StorybookConfig = {
  stories: getStories(),

  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-links",
    "@storybook/addon-mcp",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(storybookDir, '../src'),
          '@dty-lucky-sheet/core': path.resolve(
            storybookDir,
            '../src/dty-lucky-sheet/packages/core/src'
          ),
          '@dty-lucky-sheet/react': path.resolve(
            storybookDir,
            '../src/dty-lucky-sheet/packages/react/src'
          ),
          '@dty-lucky-sheet/formula': path.resolve(
            storybookDir,
            '../src/dty-lucky-sheet/packages/formula/src'
          ),
        },
      },
      optimizeDeps: {
        include: ['immer', 'lodash'],
      },
    });
  },
};

export default config;
