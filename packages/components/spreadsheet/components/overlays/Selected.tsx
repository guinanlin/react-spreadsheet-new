import * as React from "react";
import { getSelectedDimensions } from "../../core/util";
import FloatingRect from "./FloatingRect";
import FillHandle from "./FillHandle";
import useSelector from "../../hooks/use-selector";

const Selected: React.FC = () => {
  const selected = useSelector((state) => state.selected);
  const dimensions = useSelector(
    (state) =>
      selected &&
      getSelectedDimensions(
        state.rowDimensions,
        state.columnDimensions,
        state.model.data,
        state.selected
      )
  );
  const dragging = useSelector((state) => state.dragging);
  const filling = useSelector((state) => state.filling);
  const selectedSize = useSelector((state) => state.selected.size(state.model.data));
  const hidden = selectedSize < 2;
  
  return (
    <>
      <FloatingRect
        variant="selected"
        dimensions={dimensions}
        dragging={dragging}
        hidden={hidden}
      />
      <FillHandle dimensions={dimensions || null} dragging={dragging} />
    </>
  );
};

export default Selected;
