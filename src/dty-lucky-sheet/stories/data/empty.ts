import { Sheet } from "../../core/types";

export const empty: Sheet = {
  name: "Empty Sheet",
  id: "empty-sheet",
  order: 0,
  status: 1,
  row: 20,
  column: 10,
  celldata: [], // 空数组，表示没有数据
};

export default empty;

