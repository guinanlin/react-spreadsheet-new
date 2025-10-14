import * as React from "react";
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
  },
  args: {
    data: EMPTY_DATA,
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
  args: {
    ...meta.args,
    darkMode: true,
  },
};

export const Controlled: StoryFn<Props<StringCell>> = (props) => {
  const [data, setData] = React.useState(EMPTY_DATA);

  const addColumn = React.useCallback(
    () =>
      setData((data) =>
        data.map((row) => {
          const nextRow = [...row];
          nextRow.length += 1;
          return nextRow;
        })
      ),
    [setData]
  );

  const removeColumn = React.useCallback(() => {
    setData((data) =>
      data.map((row) => {
        return row.slice(0, row.length - 1);
      })
    );
  }, [setData]);

  const addRow = React.useCallback(
    () =>
      setData((data) => {
        const { columns } = Matrix.getSize(data);
        return [...data, Array(columns)];
      }),
    [setData]
  );

  const removeRow = React.useCallback(() => {
    setData((data) => {
      return data.slice(0, data.length - 1);
    });
  }, [setData]);

  return (
    <>
      <div>
        <button onClick={addColumn}>Add column</button>
        <button onClick={addRow}>Add row</button>
        <button onClick={removeColumn}>Remove column</button>
        <button onClick={removeRow}>Remove row</button>
      </div>
      <Spreadsheet {...props} data={data} onChange={setData} />
    </>
  );
};

export const CustomRowLabels: StoryObj = {
  args: {
    ...meta.args,
    rowLabels: ["Dan", "Alice", "Bob", "Steve", "Adam", "Ruth"],
  },
};

export const CustomColumnLabels: StoryObj = {
  args: {
    ...meta.args,
    columnLabels: ["Name", "Age", "Email", "Address"],
  },
};

export const HideIndicators: StoryObj = {
  args: {
    ...meta.args,
    hideColumnIndicators: true,
    hideRowIndicators: true,
  },
};

export const Readonly: StoryObj = {
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
  args: {
    Cell: CustomCell,
  },
};

export const RangeCell: StoryObj = {
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
  args: {
    ...meta.args,
    CornerIndicator: CustomCornerIndicator,
  },
};

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
      <div>
        <input
          type="text"
          placeholder="Filter"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
      <Spreadsheet {...props} data={filtered} onChange={setData} />
    </>
  );
};

export const ControlledSelection: StoryFn<Props<StringCell>> = (props) => {
  const [selected, setSelected] = React.useState<Selection>(
    new EmptySelection()
  );
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

  return (
    <div>
      <div>
        <button onClick={handleSelectEntireRow}>Select entire row</button>
        <button onClick={handleSelectEntireColumn}>Select entire column</button>
        <button onClick={handleSelectEntireWorksheet}>
          Select entire worksheet
        </button>
      </div>
      <Spreadsheet {...props} selected={selected} onSelect={handleSelect} />;
    </div>
  );
};

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
        <button onClick={handleActivate}>Activate</button>
      </div>
      <Spreadsheet ref={spreadsheetRef} {...props} />;
    </div>
  );
};

export const BasicSheet: StoryObj = {
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
    const [data, setData] = React.useState<Matrix.Matrix<StringCell>>([
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

    return (
      <div>
        <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
          <h3 style={{ marginTop: 0 }}>如何使用填充功能：</h3>
          <ol>
            <li>选中一个或多个单元格</li>
            <li>将鼠标移动到选中区域的<strong>右下角</strong>，会看到一个小方块</li>
            <li>鼠标悬停时会变成十字光标</li>
            <li>点击并拖动到目标单元格</li>
            <li>释放鼠标完成填充</li>
            <li><strong>提示</strong>：按住 Ctrl/Cmd 键拖动可启用智能填充（数字递增、日期递增等）</li>
          </ol>
          <p><strong>示例数据说明：</strong></p>
          <ul>
            <li>第一列：数字序列（1, 2, ...）</li>
            <li>第二列：文本+数字（项目1, 项目2, ...）</li>
            <li>第三列：日期序列（2024-01-01, 2024-01-02, ...）</li>
            <li>第四列：纯文本（会直接复制）</li>
          </ul>
        </div>
        <Spreadsheet
          data={data}
          onChange={setData}
          columnLabels={["数字", "项目名", "日期", "水果"]}
        />
      </div>
    );
  },
};