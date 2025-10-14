import type { Sheet } from "../../core/types";

export const dataVerification: Sheet = {
  name: "DataVerification",
  id: "data-verification-sheet",
  status: 1,
  order: 0,
  row: 84,
  column: 60,
  config: {},
  celldata: [
    { r: 0, c: 0, v: { v: "2", m: "2", ct: { fa: "General", t: "n" } } },
    { r: 0, c: 1, v: { v: "a,b,c", m: "a,b,c", ct: { fa: "General", t: "g" } } },
    { r: 0, c: 2, v: { v: "b", m: "b", ct: { fa: "General", t: "g" } } },
    { r: 0, c: 3, v: { v: "14209083729", m: "14209083729", ct: { fa: "General", t: "n" } } },
    { r: 1, c: 0, v: { v: "2", m: "2", ct: { fa: "General", t: "n" } } },
    { r: 1, c: 1, v: { v: "3", m: "3", ct: { fa: "General", t: "n" } } },
    { r: 1, c: 2, v: { v: "abc", m: "abc", ct: { fa: "General", t: "g" } } },
    { r: 1, c: 3, v: { v: "aaaa", m: "aaaa", ct: { fa: "General", t: "g" } } },
  ],
};

export default dataVerification;

