import * as React from "react";
import classNames from "classnames";
import * as Types from "../../types";
import * as Actions from "../../core/actions";
import useDispatch from "../../hooks/use-dispatch";
import useSelector from "../../hooks/use-selector";

/** 触发 resize 的右侧感应区域宽度（px）；手柄 div 也是这个宽度 */
const RESIZE_HANDLE_WIDTH = 8;
const MIN_COLUMN_WIDTH = 50;

const ColumnIndicator: Types.ColumnIndicatorComponent = ({
  column,
  label,
  selected,
  onSelect,
}) => {
  const dispatch = useDispatch();
  const thRef = React.useRef<HTMLTableCellElement>(null);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isOverHandle, setIsOverHandle] = React.useState(false);
  const resizeStateRef = React.useRef<{
    startX: number;
    startWidth: number;
    column: number;
  } | null>(null);

  const isNearRightEdge = React.useCallback(
    (event: React.MouseEvent<HTMLTableCellElement>) => {
      const th = event.currentTarget;
      const rect = th.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      return rect.width - offsetX <= RESIZE_HANDLE_WIDTH;
    },
    []
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (isResizing || isOverHandle) {
        event.stopPropagation();
        return;
      }
      onSelect(column, event.shiftKey);
    },
    [onSelect, column, isResizing, isOverHandle]
  );

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLTableCellElement>) => {
      if (resizeStateRef.current) return;
      setIsOverHandle(isNearRightEdge(event));
    },
    [isNearRightEdge]
  );

  const handleMouseLeave = React.useCallback(() => {
    if (!resizeStateRef.current) {
      setIsOverHandle(false);
    }
  }, []);

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLTableCellElement>) => {
      if (!isNearRightEdge(event)) return;

      event.preventDefault();
      event.stopPropagation();

      const th = event.currentTarget;
      const rect = th.getBoundingClientRect();
      setIsResizing(true);
      resizeStateRef.current = {
        startX: event.clientX,
        startWidth: rect.width,
        column,
      };
    },
    [column, isNearRightEdge]
  );

  React.useEffect(() => {
    if (!isResizing || !resizeStateRef.current) {
      return;
    }

    let rafId: number | null = null;

    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (!resizeStateRef.current) return;

      // 使用 requestAnimationFrame 优化性能，确保在生产环境中也能正常工作
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        if (!resizeStateRef.current) return;

        const deltaX = event.clientX - resizeStateRef.current.startX;
        const newWidth = Math.max(
          MIN_COLUMN_WIDTH,
          resizeStateRef.current.startWidth + deltaX
        );

        // 实时更新列宽
        dispatch(Actions.setColumnWidth(resizeStateRef.current.column, newWidth));
        rafId = null;
      });
    };

    const handleGlobalMouseUp = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      setIsResizing(false);
      setShowResizeCursor(false);
      resizeStateRef.current = null;
    };

    document.addEventListener("mousemove", handleGlobalMouseMove, { passive: false });
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
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
        "Spreadsheet__header--resize-cursor": isOverHandle || isResizing,
      })}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      tabIndex={0}
    >
      {label !== undefined ? label : columnIndexToLabel(column)}
      {/* 始终挂载 resize 手柄，通过 CSS hover / active 控制可见性 */}
      <div className="Spreadsheet__column-resize-handle" />
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
