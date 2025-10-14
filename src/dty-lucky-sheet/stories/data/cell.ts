import { Sheet } from "../../core/types";

export const cell: Sheet = {
  name: "Cell Data",
  id: "sheet_cell",
  order: 0,
  status: 1,
  celldata: [
    { r: 0, c: 0, v: { v: "Name", m: "Name", bg: "#f0f0f0", bl: 1 } },
    { r: 0, c: 1, v: { v: "Age", m: "Age", bg: "#f0f0f0", bl: 1 } },
    { r: 0, c: 2, v: { v: "City", m: "City", bg: "#f0f0f0", bl: 1 } },
    { r: 1, c: 0, v: { v: "Alice", m: "Alice" } },
    { r: 1, c: 1, v: { v: 25, m: "25" } },
    { r: 1, c: 2, v: { v: "New York", m: "New York" } },
    { r: 2, c: 0, v: { v: "Bob", m: "Bob" } },
    { r: 2, c: 1, v: { v: 30, m: "30" } },
    { r: 2, c: 2, v: { v: "London", m: "London" } },
    { r: 3, c: 0, v: { v: "Charlie", m: "Charlie" } },
    { r: 3, c: 1, v: { v: 35, m: "35" } },
    { r: 3, c: 2, v: { v: "Tokyo", m: "Tokyo" } },
  ],
  row: 20,
  column: 10,
};

export default cell;

