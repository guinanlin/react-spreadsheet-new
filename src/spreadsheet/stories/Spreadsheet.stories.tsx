import * as React from "react";
import '@/styles/globals.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportToCSV, exportToJSON } from '../core/export';
import type { StoryFn, Meta, StoryObj } from "@storybook/react";
import {
  createEmptyMatrix,
  Spreadsheet,
  type Props,
  CellBase,
  EntireWorksheetSelection,
  Selection,
  EntireRowsSelection,
  EntireColumnsSelection,
  EmptySelection,
  type Point,
  type SpreadsheetRef,
} from "..";
import DefaultColumnIndicator from "../components/indicators/ColumnIndicator";
import * as Types from "../types";
import * as Matrix from "../data-structures/matrix";
import { AsyncCellDataEditor, AsyncCellDataViewer } from "./AsyncCellData";
import CustomCell from "./CustomCell";
import { RangeEdit, RangeView } from "./RangeDataComponents";
import { SelectEdit, SelectView } from "./SelectDataComponents";
import { CustomCornerIndicator } from "./CustomCornerIndicator";
type StringCell = CellBase<string | undefined>;
type NumberCell = CellBase<number | undefined>;

const INITIAL_ROWS = 6;
const INITIAL_COLUMNS = 4;
const EMPTY_DATA = createEmptyMatrix<StringCell>(INITIAL_ROWS, INITIAL_COLUMNS);

const meta: Meta<Props<StringCell>> = {
  title: "Spreadsheet",
  component: Spreadsheet,
  parameters: {
    controls: {
      expanded: true,
      exclude:
        /ColumnIndicator|CornerIndicator|RowIndicator|Cell|HeaderRow|DataViewer|DataEditor|Row|Table/,
    },
    docs: {
      description: {
        component: '强大的 Excel 风格的电子表格组件，支持单元格编辑、公式计算、选区操作、自动填充等功能。完全可定制的数据展示和编辑方案。',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    data: EMPTY_DATA,
  },
  argTypes: {
    data: {
      description: '表格数据矩阵，二维数组形式，每个单元格可以包含 value、readOnly、DataViewer、DataEditor 等属性',
      control: 'object',
    },
    onChange: {
      description: '数据变化时的回调函数，返回更新后的完整数据矩阵',
      action: 'onChange',
    },
    onSelect: {
      description: '选区变化时的回调函数，返回当前选中的区域信息',
      action: 'onSelect',
    },
    onActivate: {
      description: '单元格激活（进入编辑模式）时的回调函数',
      action: 'onActivate',
    },
    onBlur: {
      description: '单元格失去焦点时的回调函数',
      action: 'onBlur',
    },
    onCellCommit: {
      description: '单元格提交数据时的回调函数',
      action: 'onCellCommit',
    },
    selected: {
      description: '受控模式下的选区对象，可以是 EmptySelection、EntireRowsSelection、EntireColumnsSelection 或 EntireWorksheetSelection',
      control: false,
    },
    darkMode: {
      description: '是否启用暗色模式',
      control: 'boolean',
    },
    columnLabels: {
      description: '自定义列标签，默认为 A、B、C...',
      control: 'object',
    },
    rowLabels: {
      description: '自定义行标签，默认为 1、2、3...',
      control: 'object',
    },
    hideColumnIndicators: {
      description: '是否隐藏列指示器（列头）',
      control: 'boolean',
    },
    hideRowIndicators: {
      description: '是否隐藏行指示器（行号）',
      control: 'boolean',
    },
    columnIndicatorWidth: {
      description: '列指示器的宽度，支持 CSS 单位（如 "50px"、"3rem"）',
      control: 'text',
    },
    rowIndicatorWidth: {
      description: '行指示器的宽度，支持 CSS 单位',
      control: 'text',
    },
    Cell: {
      description: '自定义单元格组件，用于完全自定义单元格的渲染方式',
      control: false,
    },
    DataViewer: {
      description: '全局的数据查看器组件，用于渲染非编辑状态的单元格',
      control: false,
    },
    DataEditor: {
      description: '全局的数据编辑器组件，用于渲染编辑状态的单元格',
      control: false,
    },
    CornerIndicator: {
      description: '左上角指示器组件，可以自定义全选按钮等功能',
      control: false,
    },
    className: {
      description: '自定义 CSS 类名',
      control: 'text',
    },
  },
  decorators: [
    (Story): React.ReactElement => (
      <div
        onKeyDown={(e) => {
          if (
            (e.target instanceof HTMLElement &&
              e.target.classList.contains("Spreadsheet__active-cell")) ||
            e.target instanceof HTMLInputElement
          ) {
            e.stopPropagation();
          }
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const Basic: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '基础示例，展示一个简单的电子表格，包含一些初始数据。支持单元格点击、编辑、选中等基本操作。',
      },
    },
  },
  args: {
    data: [
      [12, 3, 3, 4, 88],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
    ],
      rowIndicatorWidth: "30px",
      columnIndicatorWidth: "50px",
  },
};

export const DarkMode: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '暗色模式示例，适用于深色背景的应用场景。',
      },
    },
  },
  args: {
    ...meta.args,
    darkMode: true,
  },
};

// 创建 Context 用于传递操作函数
const RowActionsContext = React.createContext<{
  onAddRow: (row: number) => void;
  onDeleteRow: (row: number) => void;
} | null>(null);

// 单价列的自定义单元格组件
const PriceCellEditor: React.FC<{
  row: number;
  column: number;
  cell: StringCell | undefined;
  onChange: (cell: StringCell) => void;
  exitEditMode: () => void;
}> = ({ cell, onChange, exitEditMode }) => {
  const [inputValue, setInputValue] = React.useState(cell?.value || '');

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 允许输入数字、小数点和最多两位小数，但不阻止输入过程
    // 在输入过程中允许超过两位小数，但在提交时进行验证
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    }
  }, []);

  const handleSubmit = React.useCallback(() => {
    console.log('🔵 handleSubmit 被调用, inputValue:', inputValue, 'cell:', cell);
    
    // 验证并格式化输入值
    let finalValue = inputValue.trim();
    
    if (finalValue === '') {
      console.log('🟡 提交空值');
      // 保留原始 cell 的所有属性（如 DataViewer, DataEditor），只更新 value
      onChange({ ...cell, value: '' });
      exitEditMode();
      return;
    }

    // 验证是否为有效数字
    const numValue = parseFloat(finalValue);
    if (isNaN(numValue) || numValue < 0) {
      console.log('🔴 验证失败');
      alert('请输入有效的价格（非负数）');
      return;
    }

    // 限制最多两位小数
    if (finalValue.includes('.')) {
      const parts = finalValue.split('.');
      if (parts[1] && parts[1].length > 2) {
        finalValue = numValue.toFixed(2);
      }
    }

    // 保存格式化后的值
    console.log('🟢 提交值:', finalValue);
    // 保留原始 cell 的所有属性（如 DataViewer, DataEditor），只更新 value
    onChange({ ...cell, value: finalValue });
    exitEditMode();
  }, [inputValue, cell, onChange, exitEditMode]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      exitEditMode();
    }
  }, [handleSubmit, exitEditMode]);

  const handleBlur = React.useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      autoFocus
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        fontSize: '14px',
        textAlign: 'left',
        padding: '0 8px',
      }}
      placeholder="请输入价格"
    />
  );
};

const PriceCellViewer: React.FC<{
  row: number;
  column: number;
  cell: StringCell | undefined;
  setCellData: (cell: StringCell) => void;
  evaluatedCell: StringCell | undefined;
}> = ({ cell, setCellData }) => {
  const value = cell?.value || '';
  
  return (
    <div style={{ 
      padding: '0 8px', 
      fontSize: '14px',
      color: value ? '#333' : '#999',
      display: 'flex',
      alignItems: 'center',
      height: '100%'
    }}>
      {value || '单价'}
    </div>
  );
};

// 操作列的自定义单元格组件
const ActionCellViewer: React.FC<{
  row: number;
  column: number;
  cell: StringCell | undefined;
  setCellData: (cell: StringCell) => void;
  evaluatedCell: StringCell | undefined;
}> = ({ row }) => {
  const actions = React.useContext(RowActionsContext);

  const handleAddRow = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('添加行，当前行:', row);
    if (actions) {
      actions.onAddRow(row);
    }
  }, [row, actions]);

  const handleDeleteRow = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('删除行，当前行:', row);
    if (actions) {
      actions.onDeleteRow(row);
    }
  }, [row, actions]);

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <button
        onClick={handleAddRow}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          border: '1px solid #52c41a',
          background: '#f6ffed',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#52c41a',
          borderRadius: '4px',
        }}
        title="在下方增加一行"
      >
        ➕
      </button>
      <button
        onClick={handleDeleteRow}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          border: '1px solid #ff4d4f',
          background: '#fff2f0',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff4d4f',
          borderRadius: '4px',
        }}
        title="删除此行"
      >
        🗑️
      </button>
    </div>
  );
};

// 自定义操作列头组件
const ActionColumnHeader: React.FC<{
  column: number;
  label?: React.ReactNode | null;
  selected: boolean;
  onSelect: (column: number, extend: boolean) => void;
  onAddColumn: () => void;
  onDeleteColumn: () => void;
}> = ({ column, label, selected, onSelect, onAddColumn, onDeleteColumn }) => {
  const handleAddColumn = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('添加列，当前列:', column);
    onAddColumn();
  }, [column, onAddColumn]);

  const handleDeleteColumn = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('删除列，当前列:', column);
    onDeleteColumn();
  }, [column, onDeleteColumn]);

  const handleColumnClick = React.useCallback((e: React.MouseEvent) => {
    // 如果点击的是按钮，不触发列选择
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onSelect(column, e.shiftKey);
  }, [column, onSelect]);

  return (
    <th
      className={`Spreadsheet__header Spreadsheet__header--column ${
        selected ? 'Spreadsheet__header--selected' : ''
      }`}
      onClick={handleColumnClick}
      style={{
        position: 'relative',
        minWidth: '120px',
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        padding: '0 4px'
      }}>
        <span style={{ flex: 1, textAlign: 'left' }}>
          {label !== undefined ? label : '操作'}
        </span>
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          <button
            onClick={handleAddColumn}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              border: '1px solid #52c41a',
              background: '#f6ffed',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#52c41a',
              borderRadius: '2px',
              minWidth: '20px',
              height: '18px',
            }}
            title="添加列"
          >
            ➕
          </button>
          <button
            onClick={handleDeleteColumn}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              border: '1px solid #ff4d4f',
              background: '#fff2f0',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff4d4f',
              borderRadius: '2px',
              minWidth: '20px',
              height: '18px',
            }}
            title="删除列"
          >
            🗑️
          </button>
        </div>
      </div>
    </th>
  );
};

/**
 * 受控模式示例
 * 
 * 展示如何在受控模式下管理表格数据，包含动态增删行列、自定义操作列等高级功能。
 * 操作列使用自定义 DataViewer 实现了行级的增加和删除功能。
 * 操作列头包含添加列和删除列的图标按钮。
 */
export const Controlled: StoryFn<Props<StringCell>> = (props) => {
  // 初始化数据，包含单价列和操作列
  const initialData = React.useMemo(() => {
    const data: Matrix.Matrix<StringCell> = [];
    for (let i = 0; i < INITIAL_ROWS; i++) {
      const row: StringCell[] = [];
      // 前几列是普通数据列
      for (let j = 0; j < INITIAL_COLUMNS; j++) {
        row.push({ value: undefined });
      }
      // 倒数第二列是单价列，使用自定义组件
      row.push({
        value: undefined,
        DataViewer: PriceCellViewer,
        DataEditor: PriceCellEditor,
      });
      // 最后一列是操作列，使用自定义 DataViewer
      row.push({
        value: '操作',
        readOnly: true,
        DataViewer: ActionCellViewer,
      });
      data.push(row);
    }
    return data;
  }, []);

  const [data, setData] = React.useState(initialData);

  // 处理添加列（在操作列之前插入）
  const handleAddColumn = React.useCallback(() => {
    setData((currentData) => {
      return currentData.map((row) => {
        const newRow = [...row];
        // 在操作列之前插入新列（倒数第二列）
        newRow.splice(newRow.length - 1, 0, { value: undefined });
        return newRow;
      });
    });
  }, []);

  // 处理删除列（删除操作列之前的列）
  const handleDeleteColumn = React.useCallback(() => {
    setData((currentData) => {
      // 确保至少保留单价列和操作列
      if (currentData[0]?.length <= 2) {
        alert('至少需要保留单价列和操作列');
        return currentData;
      }
      
      return currentData.map((row) => {
        const newRow = [...row];
        // 删除倒数第二列（保留操作列）
        newRow.splice(newRow.length - 2, 1);
        return newRow;
      });
    });
  }, []);

  // 自定义 ColumnIndicator 组件
  const CustomColumnIndicator: Types.ColumnIndicatorComponent = React.useCallback((indicatorProps: Types.ColumnIndicatorProps) => {
    const { column } = indicatorProps;
    const columnCount = data[0]?.length || 0;
    
    // 如果是操作列（最后一列），使用自定义组件
    if (column === columnCount - 1) {
      return (
        <ActionColumnHeader
          {...indicatorProps}
          onAddColumn={handleAddColumn}
          onDeleteColumn={handleDeleteColumn}
        />
      );
    }
    
    // 其他列使用默认的 ColumnIndicator
    return <DefaultColumnIndicator {...indicatorProps} />;
  }, [data, handleAddColumn, handleDeleteColumn]);

  // 处理添加行
  const handleAddRow = React.useCallback((row: number) => {
    console.log('执行添加行，行号:', row);
    setData((currentData) => {
      const { columns } = Matrix.getSize(currentData);
      const newRow: StringCell[] = [];
      
      // 创建新行，前面是普通列，然后是单价列，最后是操作列
      for (let i = 0; i < columns - 2; i++) {
        newRow.push({ value: undefined });
      }
      // 添加单价列
      newRow.push({
        value: undefined,
        DataViewer: PriceCellViewer,
        DataEditor: PriceCellEditor,
      });
      // 添加操作列
      newRow.push({
        value: '操作',
        readOnly: true,
        DataViewer: ActionCellViewer,
      });
      
      // 在指定行后插入新行
      const newData = [...currentData];
      newData.splice(row + 1, 0, newRow);
      console.log('新数据行数:', newData.length);
      return newData;
    });
  }, []);

  // 处理删除行
  const handleDeleteRow = React.useCallback((row: number) => {
    console.log('执行删除行，行号:', row);
    setData((currentData) => {
      // 至少保留一行
      if (currentData.length <= 1) {
        alert('至少需要保留一行');
        return currentData;
      }
      
      const newData = [...currentData];
      newData.splice(row, 1);
      console.log('删除后行数:', newData.length);
      return newData;
    });
  }, []);

  // 提供给子组件的操作函数
  const rowActions = React.useMemo(() => ({
    onAddRow: handleAddRow,
    onDeleteRow: handleDeleteRow,
  }), [handleAddRow, handleDeleteRow]);

  const addColumn = React.useCallback(
    () =>
      setData((data) =>
        data.map((row) => {
          const nextRow = [...row];
          // 在单价列之前插入新列（倒数第二列）
          nextRow.splice(nextRow.length - 2, 0, { value: undefined });
          return nextRow;
        })
      ),
    [setData]
  );

  const removeColumn = React.useCallback(() => {
    setData((data) =>
      data.map((row) => {
        // 确保至少保留单价列和操作列
        if (row.length <= 2) return row;
        const newRow = [...row];
        // 删除倒数第三列（保留单价列和操作列）
        newRow.splice(newRow.length - 3, 1);
        return newRow;
      })
    );
  }, [setData]);

  const addRow = React.useCallback(
    () =>
      setData((data) => {
        const { columns } = Matrix.getSize(data);
        const newRow: StringCell[] = [];
        
        // 创建新行，前面是普通列，然后是单价列，最后是操作列
        for (let i = 0; i < columns - 2; i++) {
          newRow.push({ value: undefined });
        }
        // 添加单价列
        newRow.push({
          value: undefined,
          DataViewer: PriceCellViewer,
          DataEditor: PriceCellEditor,
        });
        // 添加操作列
        newRow.push({
          value: '操作',
          readOnly: true,
          DataViewer: ActionCellViewer,
        });
        
        return [...data, newRow];
      }),
    [setData]
  );

  const removeRow = React.useCallback(() => {
    setData((data) => {
      if (data.length <= 1) {
        alert('至少需要保留一行');
        return data;
      }
      return data.slice(0, data.length - 1);
    });
  }, [setData]);

  // 生成列标签，倒数第二列显示"单价"，最后一列显示"操作"
  const columnLabels = React.useMemo(() => {
    const labels: string[] = [];
    const columnCount = data[0]?.length || 0;
    for (let i = 0; i < columnCount - 2; i++) {
      labels.push(String.fromCharCode(65 + i)); // A, B, C, ...
    }
    labels.push('单价');
    labels.push('操作');
    return labels;
  }, [data]);

  return (
    <RowActionsContext.Provider value={rowActions}>
      <div className="mb-2 flex gap-2">
        <Button variant="outline" size="sm" onClick={addColumn}>添加列</Button>
        <Button variant="outline" size="sm" onClick={addRow}>添加行</Button>
        <Button variant="destructive" size="sm" onClick={removeColumn}>删除列</Button>
        <Button variant="destructive" size="sm" onClick={removeRow}>删除行</Button>
      </div>
      <Spreadsheet 
        {...props} 
        data={data} 
        onChange={setData}
        columnLabels={columnLabels}
        ColumnIndicator={CustomColumnIndicator}
      />
    </RowActionsContext.Provider>
  );
};

export const CustomRowLabels: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '自定义行标签示例，可以将默认的数字行号替换为自定义文本，如人名、日期等。',
      },
    },
  },
  args: {
    ...meta.args,
    rowLabels: ["Dan", "Alice", "Bob", "Steve", "Adam", "Ruth"],
  },
};

export const CustomColumnLabels: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '自定义列标签示例，可以将默认的字母列号（A、B、C...）替换为有意义的字段名称。',
      },
    },
  },
  args: {
    ...meta.args,
    columnLabels: ["Name", "Age", "Email", "Address"],
  },
};

export const HideIndicators: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '隐藏行列指示器示例，适用于不需要显示行号和列标的纯数据展示场景。',
      },
    },
  },
  args: {
    ...meta.args,
    hideColumnIndicators: true,
    hideRowIndicators: true,
  },
};

export const Readonly: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '只读单元格示例，通过设置 readOnly 属性可以禁止用户编辑特定单元格。',
      },
    },
  },
  args: {
    ...meta.args,
    data: Matrix.set(
      { row: 0, column: 0 },
      { readOnly: true, value: "Read Only" },
      createEmptyMatrix<StringCell>(INITIAL_ROWS, INITIAL_COLUMNS)
    ),
  },
};

export const WithAsyncCellData: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '异步单元格数据示例，展示如何自定义 DataViewer 和 DataEditor 来处理异步加载和保存数据。',
      },
    },
  },
  args: {
    ...meta.args,
    data: Matrix.set(
      { row: 2, column: 2 },
      {
        value: undefined,
        DataViewer: AsyncCellDataViewer,
        DataEditor: AsyncCellDataEditor,
      },
      createEmptyMatrix<StringCell>(INITIAL_ROWS, INITIAL_COLUMNS)
    ),
  },
};

export const WithCustomCell: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '自定义单元格组件示例，展示如何完全自定义单元格的渲染方式和交互逻辑。',
      },
    },
  },
  args: {
    Cell: CustomCell,
  },
};

export const RangeCell: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '滑块单元格示例，展示如何使用自定义编辑器创建范围选择器（滑块）类型的单元格。',
      },
    },
  },
  args: {
    data: Matrix.set(
      { row: 2, column: 2 },
      {
        value: 0,
        DataViewer: RangeView,
        DataEditor: RangeEdit,
      },
      createEmptyMatrix<NumberCell>(INITIAL_ROWS, INITIAL_COLUMNS)
    ),
  },
};

export const WithSelectCell: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '下拉选择单元格示例，展示如何创建带有下拉选择器的单元格，适用于枚举类型的数据。',
      },
    },
  },
  args: {
    ...meta.args,
    data: Matrix.set(
      { row: 2, column: 2 },
      {
        value: undefined,
        DataViewer: SelectView,
        DataEditor: SelectEdit,
        className: "select-cell",
      },
      createEmptyMatrix<StringCell>(INITIAL_ROWS, INITIAL_COLUMNS)
    ),
  },
};

export const WithCornerIndicator: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '自定义左上角指示器示例，展示如何自定义表格左上角的全选按钮或其他功能。',
      },
    },
  },
  args: {
    ...meta.args,
    CornerIndicator: CustomCornerIndicator,
  },
};

/**
 * 过滤功能示例
 * 
 * 展示如何结合外部过滤器对表格数据进行筛选，保留符合条件的单元格。
 */
export const Filter: StoryFn<Props<StringCell>> = (props) => {
  const [data, setData] = React.useState(
    EMPTY_DATA as Matrix.Matrix<StringCell>
  );
  const [filter, setFilter] = React.useState("");

  const handleFilterChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextFilter = event.target.value;
      setFilter(nextFilter);
    },
    [setFilter]
  );

  /**
   * Removes cells not matching the filter from matrix while maintaining the
   * minimum size that includes all of the matching cells.
   */
  const filtered = React.useMemo(() => {
    if (filter.length === 0) {
      return data;
    }
    const filtered: Matrix.Matrix<StringCell> = [];
    for (let row = 0; row < data.length; row++) {
      if (data.length !== 0) {
        for (let column = 0; column < data[0].length; column++) {
          const cell = data[row][column];
          if (cell && cell.value && cell.value.includes(filter)) {
            if (!filtered[0]) {
              filtered[0] = [];
            }
            if (filtered[0].length < column) {
              filtered[0].length = column + 1;
            }
            if (!filtered[row]) {
              filtered[row] = [];
            }
            filtered[row][column] = cell;
          }
        }
      }
    }
    return filtered;
  }, [data, filter]);

  return (
    <>
      <div className="mb-2">
        <Input
          type="text"
          placeholder="Filter"
          value={filter}
          onChange={handleFilterChange}
          className="max-w-xs"
        />
      </div>
      <Spreadsheet {...props} data={filtered} onChange={setData} />
    </>
  );
};

/**
 * 受控选区示例
 * 
 * 展示如何通过代码控制表格的选区，包括选中整行、整列、整个工作表等。
 */
export const ControlledSelection: StoryFn<Props<StringCell>> = (props) => {
  const [selected, setSelected] = React.useState<Selection>(
    new EmptySelection()
  );
  const [evaluated, setEvaluated] = React.useState<Matrix.Matrix<StringCell>>();
  const [exportFormat, setExportFormat] = React.useState<'csv' | 'json'>('csv');
  const handleSelect = React.useCallback((selection: Selection) => {
    setSelected(selection);
  }, []);

  const handleSelectEntireRow = React.useCallback(() => {
    setSelected(new EntireRowsSelection(0, 0));
  }, []);

  const handleSelectEntireColumn = React.useCallback(() => {
    setSelected(new EntireColumnsSelection(0, 0));
  }, []);

  const handleSelectEntireWorksheet = React.useCallback(() => {
    setSelected(new EntireWorksheetSelection());
  }, []);

  // 订单示例数据（不包含列头；列头使用 columnLabels 展示）
  const orderData = React.useMemo<Matrix.Matrix<StringCell>>(() => (
    [
      [ { value: 'SO-1001' }, { value: '张三' }, { value: '产品A' }, { value: '2' }, { value: '199' }, { value: '398' }, { value: '上海' }, { value: '2024-10-01' }, { value: '已发货' } ],
      [ { value: 'SO-1002' }, { value: '李四' }, { value: '产品B' }, { value: '1' }, { value: '299' }, { value: '299' }, { value: '北京' }, { value: '2024-10-02' }, { value: '处理中' } ],
      [ { value: 'SO-1003' }, { value: '王五' }, { value: '产品C' }, { value: '5' }, { value: '99' },  { value: '495' }, { value: '深圳' }, { value: '2024-10-03' }, { value: '已完成' } ],
      [ { value: 'SO-1004' }, { value: '赵六' }, { value: '产品A' }, { value: '3' }, { value: '199' }, { value: '597' }, { value: '杭州' }, { value: '2024-10-04' }, { value: '待支付' } ],
      [ { value: 'SO-1005' }, { value: '钱七' }, { value: '产品D' }, { value: '10'}, { value: '49' },  { value: '490' }, { value: '成都' }, { value: '2024-10-05' }, { value: '已取消' } ],
      [ { value: 'SO-1006' }, { value: '孙八' }, { value: '产品B' }, { value: '4' }, { value: '299' }, { value: '1196'}, { value: '苏州' }, { value: '2024-10-06' }, { value: '已发货' } ],
      [ { value: 'SO-1007' }, { value: '周九' }, { value: '产品E' }, { value: '2' }, { value: '159' }, { value: '318' }, { value: '武汉' }, { value: '2024-10-07' }, { value: '已完成' } ],
      [ { value: 'SO-1008' }, { value: '吴十' }, { value: '产品C' }, { value: '6' }, { value: '99' },  { value: '594' }, { value: '西安' }, { value: '2024-10-08' }, { value: '处理中' } ],
    ]
  ), []);

  const orderColumnLabels = React.useMemo<string[]>(() => (
    [ '订单号', '客户', '产品', '数量', '单价', '金额', '城市', '日期', '状态' ]
  ), []);

  const hasSelection = React.useMemo(() => {
    try {
      const data = orderData || [];
      return Boolean(selected && selected.toRange(data));
    } catch {
      return false;
    }
  }, [selected, orderData]);

  const handleExport = React.useCallback((scope: 'all' | 'selection') => {
    const build = {
      data: orderData,
      evaluatedData: evaluated,
      selection: scope === 'selection' ? selected : undefined,
      useEvaluated: true,
      includeColumnLabels: true,
      includeRowLabels: false,
      columnLabels: orderColumnLabels,
      rowLabels: props.rowLabels,
    } as const;

    if (exportFormat === 'csv') {
      exportToCSV(build, { filename: scope === 'selection' ? 'selection.csv' : 'spreadsheet.csv', delimiter: ',', bom: true });
    } else {
      exportToJSON(build, { filename: scope === 'selection' ? 'selection.json' : 'spreadsheet.json' });
    }
  }, [orderData, orderColumnLabels, props.rowLabels, evaluated, selected, exportFormat]);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as 'csv' | 'json')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="选择格式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => handleExport('all')}>导出整表</Button>
        <Button variant="outline" size="sm" disabled={!hasSelection} onClick={() => handleExport('selection')}>导出选区</Button>
      </div>
      <div className="mb-2 flex gap-2">
        <button
          className="inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
          onClick={handleSelectEntireRow}
        >
          Select entire row
        </button>
        <button
          className="inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
          onClick={handleSelectEntireColumn}
        >
          Select entire column
        </button>
        <button
          className="inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
          onClick={handleSelectEntireWorksheet}
        >
          Select entire worksheet
        </button>
      </div>
      <Spreadsheet
        {...props}
        data={orderData}
        columnLabels={orderColumnLabels}
        selected={selected}
        onSelect={handleSelect}
        onEvaluatedDataChange={setEvaluated}
      />
    </div>
  );
};

/**
 * 受控激活示例
 * 
 * 展示如何通过代码控制激活（进入编辑模式）特定的单元格。
 */
export const ControlledActivation: StoryFn<Props<StringCell>> = (props) => {
  const spreadsheetRef = React.useRef<SpreadsheetRef>(null);

  const [activationPoint, setActivationPoint] = React.useState<Point>({
    row: 0,
    column: 0,
  });

  const handleActivate = React.useCallback(() => {
    spreadsheetRef.current?.activate(activationPoint);
  }, [activationPoint]);

  return (
    <div>
      <div>
        <input
          id="row"
          title="row"
          type="number"
          value={activationPoint.row}
          onChange={(e) =>
            setActivationPoint(() => ({
              ...activationPoint,
              row: Number(e.target.value),
            }))
          }
        />
        <input
          id="column"
          title="row"
          type="column"
          value={activationPoint.column}
          onChange={(e) =>
            setActivationPoint(() => ({
              ...activationPoint,
              column: Number(e.target.value),
            }))
          }
        />
        <button
          className="inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
          onClick={handleActivate}
        >
          Activate
        </button>
      </div>
      <Spreadsheet ref={spreadsheetRef} {...props} />
    </div>
  );
};

export const BasicSheet: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '基础表格示例，展示带有自定义指示器宽度的简单表格。',
      },
    },
  },
  args: {
    data: [
      [12, 3, 3, 4, 88],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null]
    ],

    rowIndicatorWidth: "30px",
    columnIndicatorWidth: "80px"
  }
};

export const FormulaDemo: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: '公式计算演示，展示表格对 Excel 风格公式的支持，包括基本运算（+、-、*、/）和 SUM 函数等。公式以等号（=）开头，支持单元格引用和范围引用。',
      },
    },
  },
  args: {
    data: [
      [10, 5, 100, 100, "=SUM(A1:D1)"],
      [20, 3, 25, 4, null],
      ["=A1+A2", "=B1*B2", "=C1-C2", "=D1/D2", null],
      ["=SUM(A1:A2)", null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null]
    ],
    rowIndicatorWidth: "100px",
    columnIndicatorWidth: "80px",
    columnLabels: ["数值A", "数值B", "数值C", "数值D", "横向求和"],
    rowLabels: ["第一行", "第二行", "公式行", "SUM求和", "空行5", "空行6"]
  }
};

/**
 * 自动填充功能示例
 * 
 * 这个示例展示了 Excel 风格的自动填充功能：
 * 
 * 1. **简单复制**：选中单元格，将鼠标悬停在选中区域的右下角，会出现一个小方块（填充手柄）
 * 2. **拖动填充**：点击并拖动填充手柄到其他单元格，释放后会复制内容
 * 3. **智能填充**：按住 Ctrl/Cmd 键拖动，会自动识别模式并递增
 *    - 数字序列：1, 2, 3...
 *    - 文本+数字：项目1, 项目2, 项目3...
 *    - 日期：自动按天递增
 * 4. **多方向**：支持向上、下、左、右四个方向拖动
 */
export const FillHandleExample: StoryObj<Props<StringCell>> = {
  render: function FillHandleStory() {
    // 第一个表格的数据
    const [data1, setData1] = React.useState<Matrix.Matrix<StringCell>>([
      [
        { value: "1" },
        { value: "项目1" },
        { value: "2024-01-01" },
        { value: "Apple" },
      ],
      [
        { value: "2" },
        { value: "项目2" },
        { value: "2024-01-02" },
        { value: "Banana" },
      ],
      [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
    ]);

    // 第二个表格的数据
    const [data2, setData2] = React.useState<Matrix.Matrix<StringCell>>([
      [
        { value: "A" },
        { value: "产品A" },
        { value: "100" },
        { value: "红色" },
      ],
      [
        { value: "B" },
        { value: "产品B" },
        { value: "200" },
        { value: "蓝色" },
      ],
      [
        { value: "C" },
        { value: "产品C" },
        { value: "300" },
        { value: "绿色" },
      ],
      [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
    ]);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {/* 说明文档 */}
        <div style={{ padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
          <h3 style={{ marginTop: 0 }}>如何使用填充功能：</h3>
          <ol>
            <li>选中一个或多个单元格</li>
            <li>将鼠标移动到选中区域的<strong>右下角</strong>，会看到一个小方块</li>
            <li>鼠标悬停时会变成十字光标</li>
            <li>点击并拖动到目标单元格</li>
            <li>释放鼠标完成填充</li>
            <li><strong>提示</strong>：按住 Ctrl/Cmd 键拖动可启用智能填充（数字递增、日期递增等）</li>
          </ol>
        </div>

        {/* 第一个表格 - 上面 */}
        <div>
          <h4 style={{ marginBottom: "10px", color: "#333" }}>表格一：基础填充示例</h4>
          <div style={{ marginBottom: "10px", padding: "10px", backgroundColor: "#e8f4fd", borderRadius: "5px", fontSize: "14px" }}>
            <strong>示例数据说明：</strong>
            <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
              <li>第一列：数字序列（1, 2, ...）</li>
              <li>第二列：文本+数字（项目1, 项目2, ...）</li>
              <li>第三列：日期序列（2024-01-01, 2024-01-02, ...）</li>
              <li>第四列：纯文本（会直接复制）</li>
            </ul>
          </div>
          <Spreadsheet
            data={data1}
            onChange={setData1}
            columnLabels={["数字", "项目名", "日期", "水果"]}
          />
        </div>

        {/* 第二个表格 - 下面 */}
        <div>
          <h4 style={{ marginBottom: "10px", color: "#333" }}>表格二：产品数据示例</h4>
          <div style={{ marginBottom: "10px", padding: "10px", backgroundColor: "#f0f8e8", borderRadius: "5px", fontSize: "14px" }}>
            <strong>示例数据说明：</strong>
            <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
              <li>第一列：字母序列（A, B, C, ...）</li>
              <li>第二列：产品名称（产品A, 产品B, ...）</li>
              <li>第三列：价格数字（100, 200, 300, ...）</li>
              <li>第四列：颜色（红色, 蓝色, 绿色, ...）</li>
            </ul>
          </div>
          <Spreadsheet
            data={data2}
            onChange={setData2}
            columnLabels={["编号", "产品名", "价格", "颜色"]}
          />
        </div>
      </div>
    );
  },
};

/**
 * 横向和纵向滚动示例
 * 
 * 展示如何在限定宽度和高度的容器中使用表格，同时支持横向和纵向滚动来查看所有数据。
 * 当列的总宽度超过容器宽度时，会出现横向滚动条；当行数超过容器高度时，会出现纵向滚动条。
 */
export const HorizontalScroll: StoryObj<Props<StringCell>> = {
  parameters: {
    docs: {
      description: {
        story: '横向和纵向滚动示例，表格容器限定为 400px 宽度和 300px 高度，包含多列多行数据，展示双向滚动条的使用。适用于需要在有限空间内展示大量数据的场景。',
      },
    },
  },
  render: function HorizontalScrollStory() {
    // 创建包含10列12行的数据
    const [data, setData] = React.useState<Matrix.Matrix<StringCell>>([
      [
        { value: "产品A" },
        { value: "100" },
        { value: "50" },
        { value: "上海" },
        { value: "2024-01-01" },
        { value: "已发货" },
        { value: "张三" },
        { value: "备注信息" },
        { value: "优先级高" },
        { value: "已确认" },
      ],
      [
        { value: "产品B" },
        { value: "200" },
        { value: "30" },
        { value: "北京" },
        { value: "2024-01-02" },
        { value: "处理中" },
        { value: "李四" },
        { value: "需要跟进" },
        { value: "优先级中" },
        { value: "待确认" },
      ],
      [
        { value: "产品C" },
        { value: "150" },
        { value: "80" },
        { value: "深圳" },
        { value: "2024-01-03" },
        { value: "已完成" },
        { value: "王五" },
        { value: "无备注" },
        { value: "优先级低" },
        { value: "已确认" },
      ],
      [
        { value: "产品D" },
        { value: "300" },
        { value: "20" },
        { value: "广州" },
        { value: "2024-01-04" },
        { value: "待处理" },
        { value: "赵六" },
        { value: "紧急订单" },
        { value: "优先级高" },
        { value: "已确认" },
      ],
      [
        { value: "产品E" },
        { value: "250" },
        { value: "45" },
        { value: "杭州" },
        { value: "2024-01-05" },
        { value: "已发货" },
        { value: "钱七" },
        { value: "加急处理" },
        { value: "优先级高" },
        { value: "已确认" },
      ],
      [
        { value: "产品F" },
        { value: "180" },
        { value: "60" },
        { value: "成都" },
        { value: "2024-01-06" },
        { value: "处理中" },
        { value: "孙八" },
        { value: "需要审核" },
        { value: "优先级中" },
        { value: "待确认" },
      ],
      [
        { value: "产品G" },
        { value: "220" },
        { value: "35" },
        { value: "武汉" },
        { value: "2024-01-07" },
        { value: "已完成" },
        { value: "周九" },
        { value: "正常订单" },
        { value: "优先级低" },
        { value: "已确认" },
      ],
      [
        { value: "产品H" },
        { value: "320" },
        { value: "15" },
        { value: "西安" },
        { value: "2024-01-08" },
        { value: "待处理" },
        { value: "吴十" },
        { value: "VIP客户" },
        { value: "优先级高" },
        { value: "已确认" },
      ],
      [
        { value: "产品I" },
        { value: "190" },
        { value: "55" },
        { value: "南京" },
        { value: "2024-01-09" },
        { value: "已发货" },
        { value: "郑十一" },
        { value: "普通订单" },
        { value: "优先级中" },
        { value: "待确认" },
      ],
      [
        { value: "产品J" },
        { value: "280" },
        { value: "25" },
        { value: "重庆" },
        { value: "2024-01-10" },
        { value: "处理中" },
        { value: "王十二" },
        { value: "需要沟通" },
        { value: "优先级中" },
        { value: "已确认" },
      ],
      [
        { value: "产品K" },
        { value: "210" },
        { value: "40" },
        { value: "天津" },
        { value: "2024-01-11" },
        { value: "已完成" },
        { value: "李十三" },
        { value: "已完结" },
        { value: "优先级低" },
        { value: "已确认" },
      ],
      [
        { value: "产品L" },
        { value: "350" },
        { value: "10" },
        { value: "苏州" },
        { value: "2024-01-12" },
        { value: "待处理" },
        { value: "张十四" },
        { value: "重要客户" },
        { value: "优先级高" },
        { value: "待确认" },
      ],
    ]);

    const columnLabels = [
      "产品名称",
      "单价",
      "数量",
      "城市",
      "日期",
      "状态",
      "负责人",
      "备注",
      "优先级",
      "确认状态",
    ];

    return (
      <div>
        {/* 说明文档 */}
        <div style={{ padding: "15px", backgroundColor: "#fff3e0", borderRadius: "5px", marginBottom: "20px" }}>
          <h3 style={{ marginTop: 0 }}>双向滚动功能说明：</h3>
          <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
            <li>容器宽度限定为 <strong>400px</strong>，高度限定为 <strong>300px</strong></li>
            <li>表格包含 <strong>10 列</strong>数据，总宽度超过容器宽度</li>
            <li>表格包含 <strong>12 行</strong>数据，总高度超过容器高度</li>
            <li>同时出现<strong>横向和纵向滚动条</strong>，可以查看所有数据</li>
            <li>适用于需要在有限空间内展示大量数据的场景</li>
          </ul>
        </div>

        {/* 限定宽度和高度的容器 */}
        <div
          style={{
            width: "400px",
            height: "300px",
            border: "2px solid #1890ff",
            borderRadius: "8px",
            padding: "10px",
            backgroundColor: "#f0f7ff",
            overflow: "auto",
          }}
        >
          <div style={{ 
            marginBottom: "10px", 
            color: "#1890ff", 
            fontWeight: "bold",
            fontSize: "14px" 
          }}>
            📊 限定尺寸容器（400px × 300px）- 支持双向滚动
          </div>
          <Spreadsheet
            data={data}
            onChange={setData}
            columnLabels={columnLabels}
            rowIndicatorWidth="40px"
            columnIndicatorWidth="100px"
          />
        </div>
      </div>
    );
  },
};