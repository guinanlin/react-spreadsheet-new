import * as React from "react";
import * as Types from "../../types";
import { range } from "../../core/util";
import useSelector from "../../hooks/use-selector";

const Table: Types.TableComponent = ({
  children,
  columns,
  hideColumnIndicators,
  rowIndicatorWidth,
  columnIndicatorWidth,
  stickyHeaders,
}) => {
  const columnDimensions = useSelector((state) => state.columnDimensions);
  const columnCount = columns + (hideColumnIndicators ? 0 : 1);
  const defaultColWidth = columnIndicatorWidth || "50px";
  const columnNodes = range(columnCount).map((i) => {
    // 第一列是行号列，使用 rowIndicatorWidth 控制宽度
    if (i === 0 && !hideColumnIndicators) {
      return (
        <col
          key={i}
          style={{
            width: rowIndicatorWidth || "50px",
            minWidth: "0",
            maxWidth: rowIndicatorWidth || "50px",
          }}
        />
      );
    }
    // 数据列：优先使用用户 resize 后的宽度，否则使用传入的默认列宽
    const columnIndex = hideColumnIndicators ? i : i - 1;
    const columnWidth = columnDimensions[columnIndex]?.width;
    return (
      <col
        key={i}
        style={{
          width: columnWidth ? `${columnWidth}px` : defaultColWidth,
          minWidth: columnWidth ? `${columnWidth}px` : defaultColWidth,
        }}
      />
    );
  });

  if (stickyHeaders) {
    const childArray = React.Children.toArray(children);
    const headerRow = childArray[0];
    const bodyRows = childArray.slice(1);
    return (
      <table className="Spreadsheet__table">
        <colgroup>{columnNodes}</colgroup>
        <thead>{headerRow}</thead>
        <tbody>{bodyRows}</tbody>
      </table>
    );
  }

  return (
    <table className="Spreadsheet__table">
      <colgroup>{columnNodes}</colgroup>
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
