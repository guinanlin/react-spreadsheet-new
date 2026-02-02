import * as React from "react";
import FloatingRect from "./FloatingRect";
import useSelector from "../../hooks/use-selector";
import { getSelectedDimensions } from "../../core/util";
import { RangeSelection } from "../../data-structures/selection";

const FillPreview: React.FC = () => {
  const filling = useSelector((state) => state.filling);
  const fillRange = useSelector((state) => state.fillRange);
  const rowDimensions = useSelector((state) => state.rowDimensions);
  const columnDimensions = useSelector((state) => state.columnDimensions);
  const data = useSelector((state) => state.model.data);

  if (!filling || !fillRange) {
    return null;
  }

  // 将 fillRange 转换为 Selection 以使用 getSelectedDimensions
  const fillSelection = new RangeSelection(fillRange);

  const dimensions = getSelectedDimensions(
    rowDimensions,
    columnDimensions,
    data,
    fillSelection
  );

  return (
    <FloatingRect
      variant="fill-preview"
      dimensions={dimensions}
      dragging={false}
      hidden={false}
    />
  );
};

export default FillPreview;

