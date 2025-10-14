import type { Sheet } from "../../core/types";

export const freeze: Sheet = {
  name: "Freeze",
  id: "freeze-sheet",
  status: 1,
  order: 0,
  row: 84,
  column: 60,
  config: {
    merge: {},
    rowlen: {},
  },
  celldata: [
    { r: 0, c: 0, v: { v: 1, m: "1", ct: { fa: "General", t: "n" } } },
    { r: 0, c: 1, v: { v: 2, m: "2", ct: { fa: "General", t: "n" } } },
    { r: 0, c: 2, v: { v: 3, m: "3", ct: { fa: "General", t: "n" } } },
    { r: 0, c: 3, v: { v: 4, m: "4", ct: { fa: "General", t: "n" } } },
    { r: 0, c: 4, v: { v: 5, m: "5", ct: { fa: "General", t: "n" } } },
    { r: 1, c: 0, v: { v: 2, m: "2", ct: { fa: "General", t: "n" } } },
    { r: 1, c: 1, v: { v: 3, m: "3", ct: { fa: "General", t: "n" } } },
    { r: 1, c: 2, v: { v: 4, m: "4", ct: { fa: "General", t: "n" } } },
    { r: 2, c: 0, v: { v: 3, m: "3", ct: { fa: "General", t: "n" } } },
    { r: 2, c: 1, v: { v: 4, m: "4", ct: { fa: "General", t: "n" } } },
    { r: 3, c: 0, v: { v: 4, m: "4", ct: { fa: "General", t: "n" } } },
  ],
  frozen: {
    type: "rangeBoth",
    range: {
      row_focus: 3,
      column_focus: 1,
    },
  },
};

export default freeze;

