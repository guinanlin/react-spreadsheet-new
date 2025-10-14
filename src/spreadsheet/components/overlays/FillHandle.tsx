import * as React from "react";
import { Dimensions } from "../../types";
import * as Actions from "../../core/actions";
import useDispatch from "../../hooks/use-dispatch";
import useSelector from "../../hooks/use-selector";
import * as Matrix from "../../data-structures/matrix";

export type FillHandleProps = {
  /** Dimensions of the selected area */
  dimensions: Dimensions | null;
};

const FillHandle: React.FC<FillHandleProps> = ({ dimensions }) => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const filling = useSelector((state) => state.filling);
  const selected = useSelector((state) => state.selected);
  const data = useSelector((state) => state.model.data);

  // 如果没有选中区域或选中区域为空，不显示
  const selectedRange = selected.toRange(data);
  if (!dimensions || !selectedRange || selected.size(data) === 0) {
    return null;
  }

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(true);
      dispatch(Actions.startFill());

      let lastPoint: { row: number; column: number } | null = null;

      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        // 找到鼠标位置对应的单元格
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element) {
          // 查找最近的包含 data-row 和 data-column 的元素
          let cellElement: Element | null = element;
          
          // 尝试找到 td 元素
          if (!cellElement.hasAttribute("data-row")) {
            cellElement = element.closest("td[data-row][data-column]");
          }
          
          if (cellElement) {
            const rowStr = cellElement.getAttribute("data-row");
            const colStr = cellElement.getAttribute("data-column");
            
            if (rowStr !== null && colStr !== null) {
              const row = parseInt(rowStr, 10);
              const column = parseInt(colStr, 10);
              
              if (!isNaN(row) && !isNaN(column)) {
                // 只在点变化时才 dispatch，避免重复
                if (!lastPoint || lastPoint.row !== row || lastPoint.column !== column) {
                  lastPoint = { row, column };
                  dispatch(Actions.fillDrag({ row, column }));
                  // console.log("Fill drag to:", row, column);
                }
              }
            }
          }
        }
      };

      const handleMouseUp = (e: MouseEvent) => {
        setIsDragging(false);
        setIsHovering(false);
        // 检测是否按下 Ctrl 键来决定使用智能填充还是简单复制
        const useSmartFill = e.ctrlKey || e.metaKey;
        // console.log("End fill, useSmartFill:", useSmartFill, "lastPoint:", lastPoint);
        dispatch(Actions.endFill(useSmartFill));
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        lastPoint = null;
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [dispatch]
  );

  const handleMouseEnter = React.useCallback(() => {
    if (!isDragging) {
      setIsHovering(true);
    }
  }, [isDragging]);

  const handleMouseLeave = React.useCallback(() => {
    if (!isDragging) {
      setIsHovering(false);
    }
  }, [isDragging]);

  // 组件卸载时清理状态
  React.useEffect(() => {
    return () => {
      setIsDragging(false);
      setIsHovering(false);
    };
  }, []);

  // 只在悬停时显示
  if (!isHovering && !filling) {
    return (
      <div
        className="Spreadsheet__fill-handle-trigger"
        style={{
          position: "absolute",
          left: dimensions.left + dimensions.width - 6,
          top: dimensions.top + dimensions.height - 6,
          width: 12,
          height: 12,
          cursor: "crosshair",
          pointerEvents: "auto",
        }}
        onMouseEnter={handleMouseEnter}
      />
    );
  }

  return (
    <>
      {/* 触发区域 - 比可见手柄稍大，便于鼠标操作 */}
      <div
        className="Spreadsheet__fill-handle-trigger"
        style={{
          position: "absolute",
          left: dimensions.left + dimensions.width - 6,
          top: dimensions.top + dimensions.height - 6,
          width: 12,
          height: 12,
          cursor: "crosshair",
          pointerEvents: "auto",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* 可见的填充手柄 */}
      <div
        className="Spreadsheet__fill-handle"
        style={{
          position: "absolute",
          left: dimensions.left + dimensions.width - 3,
          top: dimensions.top + dimensions.height - 3,
          width: 6,
          height: 6,
          cursor: "crosshair",
          pointerEvents: "auto",
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </>
  );
};

export default FillHandle;

