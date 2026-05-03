import type { Meta, StoryObj } from "@storybook/react";
import { DtyMindMap } from "../DtyMindMap";
import { DEFAULT_MIND_MAP_DATA } from "../constants";
import { RD_PROCESS_INITIAL_DATA } from "./rd-process-initial-data";

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
    edgeLinkMode: {
      control: "select",
      options: ["curved-all", "orthogonal-all", "mixed-root-curved"],
    },
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

/** 自定义初始数据：产品研发流程（多级树）；根→一级为曲线，更深层为折线 */
export const WithInitialData: Story = {
  args: {
    initialData: RD_PROCESS_INITIAL_DATA,
    edgeLinkMode: "mixed-root-curved",
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

/** 子节点带底部自定义属性（委外、工艺: 委外电镀 等标签） */
export const WithNodeAttributes: Story = {
  args: {
    initialData: {
      rootId: "root",
      nodes: {
        root: {
          id: "root",
          text: "工艺节点",
          parentId: null,
          children: ["a1", "a2"],
          isExpanded: true,
          depth: 0,
        },
        a1: {
          id: "a1",
          text: "【A1-2】 26-01-1罩光\n哑粉色上盖二工位委\n外:委外电镀",
          parentId: "root",
          children: [],
          isExpanded: true,
          manualWidth: 320,
          attributes: [
            { label: "委外" },
            { key: "工艺", value: "委外电镀" },
          ],
        },
        a2: {
          id: "a2",
          text: "【B1】 内制工序",
          parentId: "root",
          children: [],
          isExpanded: true,
          attributes: [{ label: "内制" }],
        },
      },
    },
  },
};
