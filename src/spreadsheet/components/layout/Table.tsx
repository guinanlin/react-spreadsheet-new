import * as React from "react";
import * as Types from "../../types";
import { range } from "../../core/util";

const Table: Types.TableComponent = ({
  children,
  columns,
  hideColumnIndicators,
  rowIndicatorWidth,
}) => {
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
    return <col key={i} />;
  });
  return (
    <table className="Spreadsheet__table">
      <colgroup>{columnNodes}</colgroup>
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
