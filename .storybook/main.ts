import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from 'vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@chromatic-com/storybook",
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
          '@': path.resolve(__dirname, '../src'),
          '@dty-lucky-sheet/core': path.resolve(__dirname, '../src/dty-lucky-sheet/packages/core/src'),
          '@dty-lucky-sheet/react': path.resolve(__dirname, '../src/dty-lucky-sheet/packages/react/src'),
          '@dty-lucky-sheet/formula': path.resolve(__dirname, '../src/dty-lucky-sheet/packages/formula/src'),
        },
      },
      optimizeDeps: {
        include: ['immer', 'lodash'],
      },
    });
  },
};

export default config;
