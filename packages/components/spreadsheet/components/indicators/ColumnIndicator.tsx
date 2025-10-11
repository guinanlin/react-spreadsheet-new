import * as React from "react";
import classNames from "classnames";
import * as Types from "../../types";
import * as Actions from "../../core/actions";
import useDispatch from "../../hooks/use-dispatch";
import useSelector from "../../hooks/use-selector";

const RESIZE_HANDLE_WIDTH = 5; // 可拖动区域的宽度（像素）
const MIN_COLUMN_WIDTH = 50; // 最小列宽（像素）

const ColumnIndicator: Types.ColumnIndicatorComponent = ({
  column,
  label,
  selected,
  onSelect,
}) => {
  const dispatch = useDispatch();
  const thRef = React.useRef<HTMLTableCellElement>(null);
  const [isResizing, setIsResizing] = React.useState(false);
  const [showResizeCursor, setShowResizeCursor] = React.useState(false);
  const resizeStateRef = React.useRef<{
    startX: number;
    startWidth: number;
    column: number;
  } | null>(null);

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      // 如果正在调整大小或者在调整柄区域，不触发选择
      if (isResizing || showResizeCursor) {
        event.stopPropagation();
        return;
      }
      onSelect(column, event.shiftKey);
    },
    [onSelect, column, isResizing, showResizeCursor]
  );

  const handleMouseMove = React.useCallback((event: React.MouseEvent<HTMLTableCellElement>) => {
    if (resizeStateRef.current) {
      return; // 正在拖动时不检查光标
    }

    const th = event.currentTarget;
    const rect = th.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const isNearRightEdge = rect.width - offsetX <= RESIZE_HANDLE_WIDTH;

    setShowResizeCursor(isNearRightEdge);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    if (!resizeStateRef.current) {
      setShowResizeCursor(false);
    }
  }, []);

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLTableCellElement>) => {
      const th = event.currentTarget;
      const rect = th.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const isNearRightEdge = rect.width - offsetX <= RESIZE_HANDLE_WIDTH;

      if (isNearRightEdge) {
        event.preventDefault();
        event.stopPropagation();

        const currentWidth = rect.width;
        setIsResizing(true);
        resizeStateRef.current = {
          startX: event.clientX,
          startWidth: currentWidth,
          column,
        };
      }
    },
    [column]
  );

  React.useEffect(() => {
    if (!isResizing || !resizeStateRef.current) {
      return;
    }

    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (!resizeStateRef.current) return;

      const deltaX = event.clientX - resizeStateRef.current.startX;
      const newWidth = Math.max(
        MIN_COLUMN_WIDTH,
        resizeStateRef.current.startWidth + deltaX
      );

      // 实时更新列宽
      dispatch(Actions.setColumnWidth(resizeStateRef.current.column, newWidth));
    };

    const handleGlobalMouseUp = () => {
      setIsResizing(false);
      setShowResizeCursor(false);
      resizeStateRef.current = null;
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isResizing, dispatch]);

  return (
    <th
      ref={thRef}
      className={classNames("Spreadsheet__header", "Spreadsheet__header--column", {
        "Spreadsheet__header--selected": selected,
        "Spreadsheet__header--resizing": isResizing,
        "Spreadsheet__header--resize-cursor": showResizeCursor,
      })}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      tabIndex={0}
    >
      {label !== undefined ? label : columnIndexToLabel(column)}
      {showResizeCursor && (
        <div className="Spreadsheet__column-resize-handle" />
      )}
    </th>
  );
};

export default ColumnIndicator;

export const enhance = (
  ColumnIndicatorComponent: Types.ColumnIndicatorComponent
): React.FC<Omit<Types.ColumnIndicatorProps, "selected" | "onSelect">> => {
  return function ColumnIndicatorWrapper(props) {
    const dispatch = useDispatch();
    const selectEntireColumn = React.useCallback(
      (column: number, extend: boolean) =>
        dispatch(Actions.selectEntireColumn(column, extend)),
      [dispatch]
    );
    const selected = useSelector((state) =>
      state.selected.hasEntireColumn(props.column)
    );
    return (
      <ColumnIndicatorComponent
        {...props}
        selected={selected}
        onSelect={selectEntireColumn}
      />
    );
  };
};

function columnIndexToLabel(column: number): string {
  let label = "";
  let index = column;
  while (index >= 0) {
    label = String.fromCharCode(65 + (index % 26)) + label;
    index = Math.floor(index / 26) - 1;
  }
  return label;
}
