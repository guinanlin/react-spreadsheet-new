import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DtyPrintDesigner } from "../components/DtyPrintDesigner";

const meta: Meta<typeof DtyPrintDesigner> = {
  title: "DtyPrintDesigner/DtyPrintDesigner",
  component: DtyPrintDesigner,
  tags: ["autodocs"],
  argTypes: {
    showGrid: { control: "boolean" },
    readOnly: { control: "boolean" },
    debug: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DtyPrintDesigner>;

export const Default: Story = {
  args: {
    showGrid: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [title, setTitle] = useState("销售出库单");
    const [content, setContent] = useState("客户：\n日期：\n备注：");

    return (
      <DtyPrintDesigner
        title={title}
        content={content}
        showGrid
        onTitleChange={setTitle}
        onContentChange={setContent}
      />
    );
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    title: "只读模板",
    content: "此模板用于展示，禁止修改。",
  },
};
