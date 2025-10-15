import React, { useCallback, useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { DtyLuckySheet } from "../components/DtyLuckySheet";
import type { Sheet } from "../core/types";
import costAccounting from "./data/cost-accounting";

export default {
  title: "DtyLuckySheet/BusinessPractice",
  component: DtyLuckySheet,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: '业务实践示例集合，展示 DtyLuckySheet 在真实业务场景中的应用，包括财务报表、成本核算、数据分析等复杂表格的实现。这些示例展示了如何使用高级特性如合并单元格、公式计算、样式定制等来构建专业的业务表格。',
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
    },
    showToolbar: {
      description: '是否显示工具栏（包含格式化、插入、删除等操作按钮）',
      control: 'boolean',
    },
    showFormulaBar: {
      description: '是否显示公式编辑栏',
      control: 'boolean',
    },
    showSheetTabs: {
      description: '是否显示底部的工作表标签页',
      control: 'boolean',
    },
    showRowHeader: {
      description: '是否显示行号',
      control: 'boolean',
    },
    showColumnHeader: {
      description: '是否显示列标',
      control: 'boolean',
    },
    showGridLines: {
      description: '是否显示网格线',
      control: 'boolean',
    },
    enableContextMenu: {
      description: '是否启用右键菜单',
      control: 'boolean',
    },
    enableAddRow: {
      description: '是否允许添加行',
      control: 'boolean',
    },
    enableAddColumn: {
      description: '是否允许添加列',
      control: 'boolean',
    },
    readOnly: {
      description: '是否为只读模式（全局设置）',
      control: 'boolean',
    },
    width: {
      description: '表格容器宽度',
      control: 'text',
    },
    height: {
      description: '表格容器高度',
      control: 'text',
    },
  },
} as Meta<typeof DtyLuckySheet>;

const Template: StoryFn<typeof DtyLuckySheet> = ({ data: data0, ...args }) => {
  const [data, setData] = useState<Sheet[]>(() => JSON.parse(JSON.stringify(data0)));
  const onChange = useCallback((d: Sheet[]) => setData(d), []);
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <DtyLuckySheet {...args} data={data} onChange={onChange} />
    </div>
  );
};

/**
 * 成本核算表 - 业务实践示例
 * 
 * 这是一个完整的财务成本核算表格示例，展示了如何使用 DtyLuckySheet 构建专业的财务报表。
 * 
 * 主要特性：
 * - 标题区域：使用合并单元格创建报表标题和基本信息
 * - 分类统计：四块成本明细区域（直接人工、直接材料、制造费用、期间费用）
 * - 数据汇总：使用公式自动计算各项小计和合计
 * - 专业排版：使用边框、背景色、文字对齐等样式优化显示效果
 * - 多层次结构：通过缩进和层级展示成本项目的归属关系
 * 
 * 适用场景：
 * - 财务报表（利润表、资产负债表等）
 * - 项目成本核算
 * - 预算执行分析
 * - 成本对比分析
 */
export const CostAccounting = Template.bind({});
CostAccounting.parameters = {
  docs: {
    description: {
      story: `
**成本核算表业务示例**

完整展示了一个真实的成本核算表格，包含以下功能：

1. **报表头部**：包含标题、编制单位、日期等基本信息
2. **成本分类**：
   - 直接人工成本明细
   - 直接材料成本明细
   - 制造费用明细
   - 期间费用明细
3. **自动计算**：使用 SUM 等公式自动汇总小计和合计
4. **专业样式**：采用标准财务报表格式，包含边框、底色、对齐方式等

该示例可作为构建其他复杂业务表格的参考模板。
      `.trim(),
    },
  },
};
CostAccounting.args = {
  data: [costAccounting],
  allowEdit: true,
  showToolbar: true,
  showFormulaBar: false,
};

/**
 * 成本核算表 - 带自定义工具栏按钮
 * 
 * 在标准成本核算表基础上，添加了自定义工具栏按钮，演示如何在业务场景中集成自定义功能。
 * 
 * 自定义按钮功能：
 * - 📥 导出报表：导出当前成本核算数据
 * - 💾 保存草稿：保存当前编辑状态
 * - 📊 生成分析：基于当前数据生成分析报告
 * 
 * 适用场景：
 * - 需要导出功能的报表系统
 * - 集成到业务系统的表格组件
 * - 需要自定义业务操作的表格应用
 */
export const CostAccountingWithToolbar: StoryFn<typeof DtyLuckySheet> = () => {
  const [data, setData] = useState<Sheet[]>(() => 
    JSON.parse(JSON.stringify([costAccounting]))
  );
  
  const handleExport = useCallback(() => {
    console.log('导出报表被点击！');
    console.log('当前数据：', data);
    alert('导出报表功能触发！\n\n实际应用中可以：\n- 导出为 Excel 文件\n- 导出为 PDF 文档\n- 发送到后端 API');
  }, [data]);

  const handleSaveDraft = useCallback(() => {
    console.log('保存草稿被点击！');
    console.log('当前数据：', data);
    alert('保存草稿功能触发！\n\n数据已保存到本地存储或后端。');
  }, [data]);

  const handleGenerateAnalysis = useCallback(() => {
    console.log('生成分析被点击！');
    console.log('当前数据：', data);
    alert('生成分析报告！\n\n将基于成本数据生成：\n- 成本占比分析\n- 趋势变化图表\n- 异常项目标注');
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
        showFormulaBar={false}
        showSheetTabs={true}
        customToolbarItems={[
          {
            key: 'export-report',
            tooltip: '导出报表',
            icon: <span style={{ fontSize: '16px' }}>📥</span>,
            onClick: handleExport,
          },
          {
            key: 'save-draft',
            tooltip: '保存草稿',
            icon: <span style={{ fontSize: '16px' }}>💾</span>,
            onClick: handleSaveDraft,
          },
          {
            key: 'generate-analysis',
            tooltip: '生成分析',
            icon: <span style={{ fontSize: '16px' }}>📊</span>,
            onClick: handleGenerateAnalysis,
          }
        ]}
      />
    </div>
  );
};
CostAccountingWithToolbar.parameters = {
  docs: {
    description: {
      story: `
**业务场景工具栏集成**

展示如何在成本核算表中集成业务特定的工具栏按钮，实现完整的业务流程闭环。

**自定义按钮：**
- 📥 **导出报表**：一键导出为 Excel/PDF 格式
- 💾 **保存草稿**：保存当前编辑进度，支持断点续传
- 📊 **生成分析**：基于数据自动生成分析报告和图表

**实现代码：**
\`\`\`tsx
<DtyLuckySheet 
  data={costAccountingData}
  customToolbarItems={[
    {
      key: 'export-report',
      tooltip: '导出报表',
      icon: <span>📥</span>,
      onClick: handleExport,
    },
    {
      key: 'save-draft',
      tooltip: '保存草稿',
      icon: <span>💾</span>,
      onClick: handleSaveDraft,
    },
    {
      key: 'generate-analysis',
      tooltip: '生成分析',
      icon: <span>📊</span>,
      onClick: handleGenerateAnalysis,
    }
  ]}
/>
\`\`\`

**业务价值：**
- 🚀 **提升效率**：常用操作一键触达
- 🔗 **系统集成**：与业务系统无缝对接
- 💡 **用户体验**：符合用户操作习惯
- 🎯 **场景定制**：根据具体业务需求定制功能

**扩展建议：**
- 添加审批流程按钮（提交审核、审批通过等）
- 集成数据校验按钮（检查数据完整性）
- 添加版本对比按钮（查看历史版本变化）
- 集成打印预览功能
- 添加数据导入按钮（从其他系统导入）
      `.trim(),
    },
  },
};


