import type { Meta, StoryObj } from "@storybook/react";
import { DtyMindMap } from "../DtyMindMap";
import { DEFAULT_MIND_MAP_DATA } from "../constants";

const meta: Meta<typeof DtyMindMap> = {
  title: "dty-mindmap/DtyMindMap",
  component: DtyMindMap,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark", "midnight"],
    },
    showToolbar: { control: "boolean" },
    showInstructions: { control: "boolean" },
    showCanvasControls: { control: "boolean" },
    height: { control: "text" },
    width: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof DtyMindMap>;

/** 默认：撑满页面，使用默认根节点、浅色主题 */
export const Default: Story = {
  args: {},
};

/** 深色主题 */
export const Dark: Story = {
  args: {
    theme: "dark",
  },
};

/** 自定义初始数据 */
export const WithInitialData: Story = {
  args: {
    initialData: {
      rootId: "root",
      nodes: {
        root: {
          id: "root",
          text: "项目规划",
          parentId: null,
          children: ["n1", "n2", "n3"],
          isExpanded: true,
          depth: 0,
        },
        n1: {
          id: "n1",
          text: "需求分析",
          parentId: "root",
          children: [],
          isExpanded: true,
        },
        n2: {
          id: "n2",
          text: "技术方案",
          parentId: "root",
          children: [],
          isExpanded: true,
        },
        n3: {
          id: "n3",
          text: "排期与资源",
          parentId: "root",
          children: [],
          isExpanded: true,
        },
      },
    },
  },
};

/** 监听数据变化（可用于保存） */
export const WithOnDataChange: Story = {
  args: {
    initialData: DEFAULT_MIND_MAP_DATA,
    onDataChange: (data) => {
      console.log("[DtyMindMap] onDataChange", data);
    },
  },
};

/** 仅画布：隐藏工具栏与说明 */
export const CanvasOnly: Story = {
  args: {
    showToolbar: false,
    showInstructions: false,
    showCanvasControls: true,
  },
};
