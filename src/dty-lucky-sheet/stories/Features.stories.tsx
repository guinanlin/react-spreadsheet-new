import React, { useState, useCallback } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { DtyLuckySheet } from "../components/DtyLuckySheet";
import type { Sheet } from "../core/types";
import cell from "./data/cell";
import cellRich from "./data/cell-rich";
import cellStyled from "./data/cell-styled";
import formula from "./data/formula";
import empty from "./data/empty";
import freeze from "./data/freeze";
import dataVerification from "./data/dataVerification";
import protectedData from "./data/protected";

export default {
  title: "DtyLuckySheet/Features",
  component: DtyLuckySheet,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof DtyLuckySheet>;

/**
 * 模板组件 - 所有 Feature Stories 共用
 */
const Template: StoryFn<typeof DtyLuckySheet> = ({
  data: data0,
  ...args
}) => {
  // 使用 JSON 深拷贝避免 Storybook 修改只读属性的问题
  const [data, setData] = useState<Sheet[]>(() => 
    JSON.parse(JSON.stringify(data0))
  );
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <DtyLuckySheet {...args} data={data} onChange={onChange} />
    </div>
  );
};

/**
 * 基本表格示例（简单版）
 */
export const Basic = Template.bind({});
Basic.args = {
  data: [cell],
  allowEdit: true,
};

/**
 * 样式表格示例 - 展示常见格式
 * 
 * 包含：
 * - 粗体、斜体、下划线
 * - 背景颜色
 * - 文字颜色
 * - 居中对齐
 * - 不同字体大小
 */
export const StyledBasic = Template.bind({});
// @ts-ignore
StyledBasic.args = {
  data: [cellStyled],
  allowEdit: true,
};

/**
 * 丰富表格示例 - FortuneSheet 完整示例
 * 
 * 包含 FortuneSheet 的所有格式和样式：
 * - 粗体、斜体、下划线
 * - 背景颜色、文字颜色
 * - 边框样式（各种线型）
 * - 合并单元格
 * - 内联样式
 * - 对齐方式
 * - 数字格式
 * - 日期格式
 * - 等等...
 */
export const RichBasic = Template.bind({});
// @ts-ignore
RichBasic.args = {
  data: [cellRich],
  allowEdit: true,
  showToolbar: true,        // 显示工具栏以便测试格式化功能
  showFormulaBar: true,     // 显示公式栏
};

/**
 * 公式计算示例
 */
export const Formula = Template.bind({});
Formula.args = {
  data: [formula],
};

/**
 * 空表格示例
 */
export const Empty = Template.bind({});
Empty.args = {
  data: [empty],
  allowEdit: true,
};

/**
 * 只读模式示例
 */
export const ReadOnly = Template.bind({});
ReadOnly.args = {
  data: [cell],
  allowEdit: false,
};

/**
 * 多个工作表标签示例
 */
export const Tabs = Template.bind({});
Tabs.args = {
  data: [cell, formula],
};

/**
 * 冻结行列示例
 */
export const Freeze = Template.bind({});
Freeze.args = {
  data: [freeze],
};

/**
 * 数据验证示例
 */
export const DataVerification = Template.bind({});
DataVerification.args = {
  data: [dataVerification],
};

/**
 * 保护工作表示例
 */
export const ProtectedSheet = Template.bind({});
ProtectedSheet.args = {
  data: protectedData,
};

/**
 * 多实例示例 - 同时显示两个独立的表格
 */
export const MultiInstance: StoryFn<typeof DtyLuckySheet> = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        gap: "12px",
        padding: "12px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ 
        flex: 1, 
        height: "calc(100vh - 24px)",
        minHeight: "400px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}>
        <DtyLuckySheet data={[empty]} />
      </div>
      <div style={{ 
        flex: 1, 
        height: "calc(100vh - 24px)",
        minHeight: "400px",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}>
        <DtyLuckySheet data={[cell]} />
      </div>
    </div>
  );
};
