import * as React from "react";
import type { StoryFn, Meta, StoryObj } from "@storybook/react";
import '@/styles/globals.css';
import {
  createEmptyMatrix,
  Workbook,
  type WorkbookProps,
  type WorkbookSheet,
  type CellBase,
  type Matrix,
} from "..";

type StringCell = CellBase<string | number | undefined>;

// Sample data for different sheets
const salesData = [
  [
    { value: "产品" },
    { value: "Q1" },
    { value: "Q2" },
    { value: "Q3" },
    { value: "Q4" },
  ],
  [
    { value: "笔记本电脑" },
    { value: 15000 },
    { value: 18000 },
    { value: 22000 },
    { value: 25000 },
  ],
  [
    { value: "台式机" },
    { value: 8000 },
    { value: 9500 },
    { value: 11000 },
    { value: 12500 },
  ],
  [
    { value: "显示器" },
    { value: 3000 },
    { value: 3500 },
    { value: 4200 },
    { value: 4800 },
  ],
  [
    { value: "键盘鼠标" },
    { value: 1200 },
    { value: 1400 },
    { value: 1600 },
    { value: 1800 },
  ],
];

const inventoryData = [
  [
    { value: "商品名称" },
    { value: "库存数量" },
    { value: "单价" },
    { value: "总价值" },
  ],
  [
    { value: "笔记本电脑" },
    { value: 45 },
    { value: 5000 },
    { value: "=B2*C2" },
  ],
  [
    { value: "台式机" },
    { value: 32 },
    { value: 3500 },
    { value: "=B3*C3" },
  ],
  [
    { value: "显示器" },
    { value: 78 },
    { value: 1200 },
    { value: "=B4*C4" },
  ],
  [
    { value: "键盘鼠标套装" },
    { value: 120 },
    { value: 150 },
    { value: "=B5*C5" },
  ],
  [{ value: "总计" }, { value: "" }, { value: "" }, { value: "=SUM(D2:D5)" }],
];

const employeeData = [
  [
    { value: "员工姓名" },
    { value: "部门" },
    { value: "职位" },
    { value: "工资" },
  ],
  [
    { value: "张三" },
    { value: "技术部" },
    { value: "工程师" },
    { value: 15000 },
  ],
  [
    { value: "李四" },
    { value: "销售部" },
    { value: "销售经理" },
    { value: 18000 },
  ],
  [{ value: "王五" }, { value: "人事部" }, { value: "HR" }, { value: 12000 }],
  [
    { value: "赵六" },
    { value: "技术部" },
    { value: "架构师" },
    { value: 22000 },
  ],
];

const DEFAULT_SHEETS: WorkbookSheet<StringCell>[] = [
  {
    id: "sales",
    name: "销售数据",
    data: salesData,
  },
  {
    id: "inventory",
    name: "库存管理",
    data: inventoryData,
  },
  {
    id: "employees",
    name: "员工信息",
    data: employeeData,
  },
];

const meta: Meta<WorkbookProps<StringCell>> = {
  title: "Spreadsheet/Workbook",
  component: Workbook,
  tags: ["autodocs"],
  parameters: {
    controls: {
      expanded: true,
    },
    docs: {
      description: {
        component:
          "Workbook 是一个多 Sheet 的容器组件，封装了 Spreadsheet 并提供标签切换、受控/非受控模式，支持将数据变化与选择事件按 Sheet 维度上报。",
      },
    },
  },
  args: {
    sheets: DEFAULT_SHEETS,
    rowIndicatorWidth: "30px",
    columnIndicatorWidth: "50px",
  },
};

export default meta;

/**
 * 基础多 Sheet 示例
 */
export const Basic: StoryObj<WorkbookProps<StringCell>> = {
  args: {
    sheets: DEFAULT_SHEETS,
    defaultActiveSheet: "sales",
  },
};

/**
 * 暗色模式
 */
export const DarkMode: StoryObj<WorkbookProps<StringCell>> = {
  args: {
    sheets: DEFAULT_SHEETS,
    defaultActiveSheet: "inventory",
    darkMode: true,
  },
};

/**
 * 单个 Sheet（测试边界情况）
 */
export const SingleSheet: StoryObj<WorkbookProps<StringCell>> = {
  args: {
    sheets: [
      {
        id: "single",
        name: "唯一工作表",
        data: salesData,
      },
    ],
  },
};

/**
 * 空 Sheet 列表（测试边界情况）
 */
export const EmptySheets: StoryObj<WorkbookProps<StringCell>> = {
  args: {
    sheets: [],
  },
};

/**
 * 受控模式示例
 */
export const Controlled: StoryFn<WorkbookProps<StringCell>> = (props) => {
  const [activeSheet, setActiveSheet] = React.useState<string>("sales");
  const [sheetData, setSheetData] = React.useState<
    Record<string, Matrix<StringCell>>
  >({
    sales: salesData,
    inventory: inventoryData,
    employees: employeeData,
  });

  const sheets: WorkbookSheet<StringCell>[] = [
    { id: "sales", name: "销售数据", data: sheetData.sales },
    { id: "inventory", name: "库存管理", data: sheetData.inventory },
    { id: "employees", name: "员工信息", data: sheetData.employees },
  ];

  const handleSheetChange = (sheetId: string) => {
    console.log("Sheet changed to:", sheetId);
    setActiveSheet(sheetId);
  };

  const handleDataChange = (sheetId: string, data: Matrix<StringCell>) => {
    console.log("Data changed in sheet:", sheetId);
    setSheetData((prev) => ({
      ...prev,
      [sheetId]: data,
    }));
  };

  return (
    <div style={{ height: "600px", padding: "20px" }}>
      <div style={{ marginBottom: "10px", color: "#666" }}>
        <strong>受控模式示例</strong> - 当前激活: {activeSheet}
      </div>
      <Workbook
        {...props}
        sheets={sheets}
        activeSheet={activeSheet}
        onSheetChange={handleSheetChange}
        onChange={handleDataChange}
      />
    </div>
  );
};

/**
 * 自定义样式
 */
export const CustomStyling: StoryObj<WorkbookProps<StringCell>> = {
  args: {
    sheets: DEFAULT_SHEETS,
    defaultActiveSheet: "sales",
    className: "custom-workbook",
    rowIndicatorWidth: "40px",
    columnIndicatorWidth: "60px",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "600px", padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * 带有不同配置的 Sheet
 */
export const MixedConfiguration: StoryObj<WorkbookProps<StringCell>> = {
  args: {
    sheets: [
      {
        id: "visible",
        name: "显示指示器",
        data: salesData,
        hideRowIndicators: false,
        hideColumnIndicators: false,
      },
      {
        id: "hidden-rows",
        name: "隐藏行指示器",
        data: inventoryData,
        hideRowIndicators: true,
        hideColumnIndicators: false,
      },
      {
        id: "hidden-columns",
        name: "隐藏列指示器",
        data: employeeData,
        hideRowIndicators: false,
        hideColumnIndicators: true,
      },
      {
        id: "hidden-both",
        name: "全部隐藏",
        data: createEmptyMatrix<StringCell>(10, 6),
        hideRowIndicators: true,
        hideColumnIndicators: true,
      },
    ],
    defaultActiveSheet: "visible",
  },
};

/**
 * 大量 Sheet（测试性能）
 */
export const ManySheets: StoryObj<WorkbookProps<StringCell>> = {
  args: {
    sheets: Array.from({ length: 20 }, (_, i) => ({
      id: `sheet-${i + 1}`,
      name: `工作表 ${i + 1}`,
      data: createEmptyMatrix<StringCell>(15, 8),
    })),
    defaultActiveSheet: "sheet-1",
    rowIndicatorWidth: "45px",
    columnIndicatorWidth: "50px",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "600px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * 交互式示例
 */
export const Interactive: StoryFn<WorkbookProps<StringCell>> = () => {
  const [sheets, setSheets] = React.useState<WorkbookSheet<StringCell>[]>(
    DEFAULT_SHEETS
  );
  const [activeSheet, setActiveSheet] = React.useState<string>("sales");

  const handleDataChange = (sheetId: string, data: Matrix<StringCell>) => {
    setSheets((prevSheets) =>
      prevSheets.map((sheet) =>
        sheet.id === sheetId ? { ...sheet, data } : sheet
      )
    );
  };

  return (
    <div style={{ height: "700px", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>交互式 Workbook 示例</h3>
        <div style={{ fontSize: "14px", color: "#666" }}>
          <p style={{ margin: "5px 0" }}>✓ 点击标签切换工作表</p>
          <p style={{ margin: "5px 0" }}>✓ 编辑单元格查看数据变化</p>
          <p style={{ margin: "5px 0" }}>
            ✓ 当前激活: <strong>{activeSheet}</strong>
          </p>
          <p style={{ margin: "5px 0" }}>✓ 总共 {sheets.length} 个工作表</p>
        </div>
      </div>
      <div style={{ flex: 1, padding: "20px" }}>
        <Workbook
          sheets={sheets}
          activeSheet={activeSheet}
          onSheetChange={setActiveSheet}
          onChange={handleDataChange}
        />
      </div>
    </div>
  );
};

