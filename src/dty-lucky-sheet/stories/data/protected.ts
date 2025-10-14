import type { Sheet } from "../../core/types";

const protectedSheet: Sheet = {
  name: "protected",
  id: "protected-1",
  status: 1,
  order: 0,
  config: {
    // authority: { sheet: 1 },
  },
  celldata: [
    { r: 0, c: 0, v: { v: "can edit", m: "can edit" } },
    { r: 0, c: 1, v: { v: "is locked", m: "is locked" } },
    { r: 0, c: 2, v: { v: "default is locked", m: "default is locked" } },
  ],
};

const partialEditableSheet: Sheet = {
  name: "partial editable",
  id: "protected-2",
  status: 0,
  order: 1,
  config: {
    columnlen: {
      "0": 200,
      "1": 200,
    },
  },
  celldata: [
    { r: 0, c: 1, v: { v: "protected column", m: "protected column" } },
    { r: 1, c: 0, v: { v: "protected row", m: "protected row" } },
  ],
};

const editableSheet: Sheet = {
  name: "editable",
  id: "protected-3",
  status: 0,
  order: 2,
  celldata: [
    { r: 0, c: 0, v: { v: "can edit", m: "can edit" } },
    { r: 0, c: 1, v: { v: "is locked", m: "is locked" } },
    { r: 0, c: 2, v: { v: "default can edit", m: "default can edit" } },
  ],
};

export const protectedData = [protectedSheet, partialEditableSheet, editableSheet];

export default protectedData;

