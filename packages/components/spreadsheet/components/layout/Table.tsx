import * as React from "react";
import * as Types from "../../types";
import { range } from "../../core/util";
import useSelector from "../../hooks/use-selector";

const Table: Types.TableComponent = ({
  children,
  columns,
  hideColumnIndicators,
  rowIndicatorWidth,
}) => {
  const columnDimensions = useSelector((state) => state.columnDimensions);
  const columnCount = columns + (hideColumnIndicators ? 0 : 1);
  const columnNodes = range(columnCount).map((i) => {
    // 第一列是行号列，使用 CSS 变量控制宽度
    if (i === 0 && !hideColumnIndicators) {
      return (
        <col 
          key={i} 
          style={{ 
            width: rowIndicatorWidth || '50px',
            minWidth: '0',
            maxWidth: rowIndicatorWidth || '50px',
            overflow: 'hidden'
          }}
        />
      );
    }
    // 对于数据列，如果有设置的宽度则使用，否则使用默认值
    const columnIndex = hideColumnIndicators ? i : i - 1;
    const columnWidth = columnDimensions[columnIndex]?.width;
    return (
      <col 
        key={i} 
        style={columnWidth ? { width: `${columnWidth}px` } : undefined}
      />
    );
  });
  return (
    <table className="Spreadsheet__table">
      <colgroup>{columnNodes}</colgroup>
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
