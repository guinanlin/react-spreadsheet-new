import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";

const preview: Preview = {
  /**
   * Story 上的 tags（如 meta.tags: ['autodocs']）用于分类、测试与文档生成。
   * Storybook 8+ 侧边栏支持按 tag 筛选；tags 不会减少「首次扫描的 story 文件数」，
   * 若要少编 story 文件请用 `pnpm dev:storybook:focus` 或改 `.storybook/main.ts` 里 focus 的 glob。
   * @see https://storybook.js.org/docs/writing-stories/tags
   */
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#000000' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => {
      document.documentElement.classList.add('light');
      return Story();
    },
  ],
};

export default preview;
