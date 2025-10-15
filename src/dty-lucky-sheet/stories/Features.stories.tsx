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
    docs: {
      description: {
        component: 'DtyLuckySheet 功能特性演示集合，展示组件的各种核心功能和配置选项。包括基础表格、样式定制、公式计算、工具栏定制、只读模式、多工作表、冻结行列、数据验证等功能的完整示例。通过这些示例，您可以快速了解如何使用各项功能来构建符合需求的电子表格应用。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: '工作表数据数组，每个元素代表一个 Sheet，包含单元格数据、样式、合并信息等完整配置',
      control: 'object',
    },
    onChange: {
      description: '数据变化时的回调函数，返回更新后的所有工作表数据',
      action: 'onChange',
    },
    allowEdit: {
      description: '是否允许编辑表格内容',
      control: 'boolean',
      defaultValue: true,
    },
    showToolbar: {
      description: '是否显示工具栏（包含格式化、插入、删除等操作按钮）',
      control: 'boolean',
      defaultValue: true,
    },
    showFormulaBar: {
      description: '是否显示公式编辑栏',
      control: 'boolean',
      defaultValue: true,
    },
    showSheetTabs: {
      description: '是否显示底部的工作表标签页',
      control: 'boolean',
      defaultValue: true,
    },
    rowHeaderWidth: {
      description: '行号列的宽度（设置为 0 可隐藏行号）',
      control: 'number',
      defaultValue: 46,
    },
    columnHeaderHeight: {
      description: '列标行的高度（设置为 0 可隐藏列标）',
      control: 'number',
      defaultValue: 20,
    },
    customToolbarItems: {
      description: '自定义工具栏按钮数组，可在工具栏左侧添加自定义功能按钮',
      control: 'object',
    },
    hooks: {
      description: '生命周期钩子函数集合，可监听和控制各种操作行为',
      control: 'object',
    },
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
 * 极简表格示例 - 只显示纯粹的表格，无任何额外 UI
 * 
 * 特点：
 * - ❌ 无工具栏
 * - ❌ 无公式栏
 * - ❌ 无工作表标签
 * - ❌ 无行号（左侧 1, 2, 3...）
 * - ❌ 无列名（顶部 A, B, C, D...）
 * - ❌ 无底部控制栏（添加行按钮等）
 * - ❌ 无表头行（没有样式，全是纯数据）
 * - ✅ 只有纯粹的表格数据
 */
export const SimpleBasic: StoryFn<typeof DtyLuckySheet> = () => {
  // 创建一个只有纯数据的表格（无表头行）
  const pureDataSheet: Sheet = {
    name: "Simple Data",
    id: "sheet_simple",
    order: 0,
    status: 1,
    celldata: [
      { r: 1, c: 0, v: { v: "Alice", m: "Alice" } },
      { r: 1, c: 1, v: { v: 25, m: "25" } },
      { r: 1, c: 2, v: { v: "New York", m: "New York" } },
      { r: 2, c: 0, v: { v: "Bob", m: "Bob" } },
      { r: 2, c: 1, v: { v: 30, m: "30" } },
      { r: 2, c: 2, v: { v: "London", m: "London" } },
      { r: 3, c: 0, v: { v: "Charlie", m: "Charlie" } },
      { r: 3, c: 1, v: { v: 35, m: "35" } },
      { r: 3, c: 2, v: { v: "Tokyo", m: "Tokyo" } },
    ],
    row: 20,
    column: 10,
  };

  const [data, setData] = useState<Sheet[]>(() => 
    JSON.parse(JSON.stringify([pureDataSheet]))
  );
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <style>{`
        /* 隐藏底部控制栏 */
        #luckysheet-bottom-controll-row,
        .luckysheet-bottom-controll-row {
          display: none !important;
          visibility: hidden !important;
        }
        /* 隐藏滚动条（可选） */
        .luckysheet-scrollbar-x,
        .luckysheet-scrollbar-y {
          display: none !important;
        }
        /* 隐藏行标题区域 */
        .fortune-row-header {
          display: none !important;
        }
      `}</style>
      <DtyLuckySheet 
        data={data} 
        onChange={onChange}
        allowEdit={true}
        showToolbar={false}       // 隐藏工具栏
        showFormulaBar={false}    // 隐藏公式栏
        showSheetTabs={false}     // 隐藏工作表标签
        rowHeaderWidth={0}        // 隐藏行号
        columnHeaderHeight={0}    // 隐藏列名
      />
    </div>
  );
};
SimpleBasic.parameters = {
  docs: {
    description: {
      story: `
**极简表格 - 最小化 UI 配置**

这是一个极简主义的表格示例，展示如何创建一个只显示纯数据的表格，隐藏所有辅助 UI 元素。

**隐藏的元素：**
- 🚫 工具栏（设置 \`showToolbar={false}\`）
- 🚫 公式栏（设置 \`showFormulaBar={false}\`）
- 🚫 工作表标签（设置 \`showSheetTabs={false}\`）
- 🚫 行号（设置 \`rowHeaderWidth={0}\`）
- 🚫 列标（设置 \`columnHeaderHeight={0}\`）
- 🚫 底部控制栏（通过 CSS 隐藏）

**适用场景：**
- 嵌入式表格组件（作为页面的一部分）
- 数据预览窗口
- 打印输出视图
- 移动端简化视图
      `.trim(),
    },
  },
};

/**
 * 基本表格示例（简单版）
 */
export const Basic = Template.bind({});
Basic.parameters = {
  docs: {
    description: {
      story: `
**基础功能演示**

最简单的可编辑表格示例，展示 DtyLuckySheet 的基本使用方法。

**功能特性：**
- ✅ 可编辑单元格内容
- ✅ 基础数据展示
- ✅ 默认配置即用

**代码示例：**
\`\`\`tsx
<DtyLuckySheet 
  data={[cellData]} 
  allowEdit={true}
/>
\`\`\`

**适用场景：**
- 快速原型开发
- 基础数据录入
- 学习和测试
      `.trim(),
    },
  },
};
Basic.args = {
  data: [cell],
  allowEdit: true,
};

/**
 * 工具栏演示 - 展示完整的工具栏功能
 * 
 * 特点：
 * - ✅ 显示完整工具栏
 * - ✅ 工具栏左侧添加自定义"保存模板"按钮
 * - ✅ 所有工具栏功能可用
 * - ✅ 可编辑模式
 */
export const ToolbarDemo: StoryFn<typeof DtyLuckySheet> = () => {
  const [data, setData] = useState<Sheet[]>(() => 
    JSON.parse(JSON.stringify([cell]))
  );
  
  const handleSaveTemplate = useCallback(() => {
    console.log('保存模板被点击了！');
    console.log('当前表格数据：', data);
    alert('保存模板功能被触发！\n\n查看控制台可以看到当前表格数据。\n\n实际使用时，这里可以调用 API 保存模板到服务器。');
  }, [data]);

  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <DtyLuckySheet 
        data={data} 
        onChange={onChange}
        allowEdit={true}
        showToolbar={true}
        showFormulaBar={true}
        showSheetTabs={true}
        customToolbarItems={[
          {
            key: 'save-template',
            tooltip: '保存模板',
            icon: <span style={{ fontSize: '16px' }}>💾</span>, // 使用 emoji 作为图标
            onClick: handleSaveTemplate,
          }
        ]}
      />
    </div>
  );
};
ToolbarDemo.parameters = {
  docs: {
    description: {
      story: `
**自定义工具栏演示**

展示如何在工具栏左侧添加自定义功能按钮，实现业务特定的功能扩展。

**演示功能：**
- 💾 **保存模板按钮**：位于工具栏最左侧的自定义按钮
- 🎯 **点击处理**：演示如何响应按钮点击事件并访问当前表格数据
- 🔧 **完全可定制**：支持自定义图标、提示文字和处理逻辑

**实现代码：**
\`\`\`tsx
<DtyLuckySheet 
  data={data} 
  onChange={onChange}
  customToolbarItems={[
    {
      key: 'save-template',
      tooltip: '保存模板',
      icon: <span style={{ fontSize: '16px' }}>💾</span>,
      onClick: handleSaveTemplate,
    }
  ]}
/>
\`\`\`

**应用场景：**
- 导出/导入功能按钮
- 保存/加载模板
- 数据提交按钮
- 自定义格式化工具
- 业务特定操作
      `.trim(),
    },
  },
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
StyledBasic.parameters = {
  docs: {
    description: {
      story: `
**样式功能演示**

展示表格的丰富样式支持，包括文本格式、颜色、对齐方式等常用样式功能。

**支持的样式：**
- 📝 **文本格式**：粗体、斜体、下划线、删除线
- 🎨 **颜色**：文字颜色、背景颜色
- 📐 **对齐**：水平对齐（左、中、右）、垂直对齐（上、中、下）
- 📏 **字体**：字体类型、字体大小
- 🔲 **边框**：多种边框样式和颜色

**适用场景：**
- 制作美观的报表
- 重点数据标注
- 创建专业文档
      `.trim(),
    },
  },
};
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
RichBasic.parameters = {
  docs: {
    description: {
      story: `
**完整格式功能演示**

展示 DtyLuckySheet 完整的富文本和高级样式支持，包含所有 FortuneSheet 支持的格式和样式。

**高级功能：**
- 🎨 **内联样式**：单元格内不同文字可使用不同样式
- 🔲 **复杂边框**：支持多种边框线型（实线、虚线、双线等）
- 📊 **合并单元格**：支持横向、纵向或区域合并
- 🔢 **数字格式**：货币、百分比、日期、自定义格式等
- 📐 **文字换行**：溢出、截断、自动换行
- 🔄 **文字旋转**：支持多种角度旋转

**工具栏功能：**
启用了完整的工具栏和公式栏，方便测试所有格式化功能。

**适用场景：**
- 复杂财务报表
- 专业数据展示
- 富文本内容编辑
      `.trim(),
    },
  },
};
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
Formula.parameters = {
  docs: {
    description: {
      story: `
**公式计算功能演示**

展示表格的公式计算能力，支持 Excel 兼容的公式语法和函数。

**支持的功能：**
- 🧮 **基础运算**：加减乘除、括号运算
- 📊 **统计函数**：SUM、AVERAGE、COUNT、MAX、MIN 等
- 📐 **数学函数**：ROUND、ABS、SQRT、POWER 等
- 📝 **文本函数**：CONCAT、LEFT、RIGHT、MID 等
- 📅 **日期函数**：NOW、TODAY、DATE、YEAR 等
- 🔍 **查找引用**：VLOOKUP、HLOOKUP、INDEX、MATCH 等
- 🔗 **单元格引用**：相对引用、绝对引用、跨表引用

**实时计算：**
公式会自动响应依赖单元格的变化，实时更新计算结果。

**适用场景：**
- 财务计算表
- 数据分析报表
- 自动汇总统计
      `.trim(),
    },
  },
};
Formula.args = {
  data: [formula],
};

/**
 * 空表格示例
 */
export const Empty = Template.bind({});
Empty.parameters = {
  docs: {
    description: {
      story: `
**空白表格模板**

从空白表格开始，适合需要从零创建内容的场景。

**特点：**
- 🆕 完全空白的工作表
- ✏️ 可编辑模式
- 📏 默认行列配置

**适用场景：**
- 新建数据表
- 自由格式创建
- 用户自定义内容
      `.trim(),
    },
  },
};
Empty.args = {
  data: [empty],
  allowEdit: true,
};

/**
 * 只读模式示例
 */
export const ReadOnly = Template.bind({});
ReadOnly.parameters = {
  docs: {
    description: {
      story: `
**只读模式演示**

展示如何设置表格为只读模式，用户只能查看不能编辑。

**功能限制：**
- 🔒 禁止编辑单元格内容
- 🚫 禁止修改格式
- 👁️ 仅可查看和选择

**实现方式：**
\`\`\`tsx
<DtyLuckySheet 
  data={data} 
  allowEdit={false}  // 设置为 false
/>
\`\`\`

**适用场景：**
- 数据展示页面
- 报表查看
- 历史数据查询
- 权限受限用户
      `.trim(),
    },
  },
};
ReadOnly.args = {
  data: [cell],
  allowEdit: false,
};

/**
 * 多个工作表标签示例
 */
export const Tabs = Template.bind({});
Tabs.parameters = {
  docs: {
    description: {
      story: `
**多工作表功能演示**

展示如何在一个工作簿中管理多个工作表（Sheet），类似 Excel 的多标签功能。

**功能特性：**
- 📑 **多个标签页**：底部显示多个工作表标签
- 🔄 **自由切换**：点击标签切换不同工作表
- 📝 **独立数据**：每个工作表有独立的数据和配置
- ➕ **添加工作表**：支持动态添加新工作表
- 🎨 **标签管理**：重命名、删除、复制工作表

**适用场景：**
- 复杂数据工作簿
- 分类数据管理
- 多视图展示
- 数据分组组织
      `.trim(),
    },
  },
};
Tabs.args = {
  data: [cell, formula],
};

/**
 * 冻结行列示例
 */
export const Freeze = Template.bind({});
Freeze.parameters = {
  docs: {
    description: {
      story: `
**冻结行列功能演示**

展示如何冻结表头行或首列，在滚动时保持特定行列始终可见。

**冻结选项：**
- ❄️ **冻结首行**：表头行始终显示
- ❄️ **冻结首列**：左侧标签列始终显示
- ❄️ **同时冻结**：同时冻结行和列
- 🔓 **取消冻结**：恢复正常滚动

**使用方法：**
通过工具栏的"冻结"按钮或右键菜单设置冻结。

**适用场景：**
- 大数据表格
- 需要始终显示表头
- 对比查看数据
- 长列表导航
      `.trim(),
    },
  },
};
Freeze.args = {
  data: [freeze],
};

/**
 * 数据验证示例
 */
export const DataVerification = Template.bind({});
DataVerification.parameters = {
  docs: {
    description: {
      story: `
**数据验证功能演示**

展示如何为单元格设置数据验证规则，限制用户输入的内容类型和范围。

**验证类型：**
- 🔢 **数字验证**：限制为数字、整数、小数
- 📝 **文本验证**：限制文本长度、特定内容
- 📅 **日期验证**：限制日期范围
- 📋 **下拉列表**：从预定义列表中选择
- 🔧 **自定义公式**：使用公式定义验证规则

**错误提示：**
输入不符合规则的内容时会显示错误提示。

**适用场景：**
- 数据录入规范化
- 防止错误输入
- 确保数据质量
- 表单字段验证
      `.trim(),
    },
  },
};
DataVerification.args = {
  data: [dataVerification],
};

/**
 * 保护工作表示例
 */
export const ProtectedSheet = Template.bind({});
ProtectedSheet.parameters = {
  docs: {
    description: {
      story: `
**工作表保护功能演示**

展示如何保护工作表，防止意外修改重要数据。

**保护功能：**
- 🔐 **锁定单元格**：指定单元格不可编辑
- 🔓 **解除锁定**：特定单元格允许编辑
- 🛡️ **工作表保护**：启用保护后只有解锁的单元格可编辑
- 🔑 **密码保护**：可设置密码保护工作表

**保护级别：**
可以灵活控制哪些单元格可编辑，哪些不可编辑。

**适用场景：**
- 保护公式不被修改
- 限制关键数据编辑
- 模板表格保护
- 多人协作权限控制
      `.trim(),
    },
  },
};
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
MultiInstance.parameters = {
  docs: {
    description: {
      story: `
**多实例功能演示**

展示如何在同一页面中同时使用多个独立的 DtyLuckySheet 实例。

**功能特性：**
- 🔄 **完全独立**：每个实例有独立的数据和状态
- 📐 **灵活布局**：可以任意布局多个表格
- 🎯 **焦点管理**：自动处理多实例的焦点切换
- 💾 **独立操作**：每个表格的编辑、撤销等操作互不影响

**实现代码：**
\`\`\`tsx
<div style={{ display: 'flex', gap: '12px' }}>
  <div style={{ flex: 1 }}>
    <DtyLuckySheet data={[sheet1]} />
  </div>
  <div style={{ flex: 1 }}>
    <DtyLuckySheet data={[sheet2]} />
  </div>
</div>
\`\`\`

**适用场景：**
- 数据对比查看
- 多表格仪表板
- 分屏编辑
- 主从表格关系
- 数据源与结果展示
      `.trim(),
    },
  },
};
