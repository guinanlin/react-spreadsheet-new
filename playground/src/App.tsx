import * as React from "react";
import "@/styles/globals.css";
import {
  Spreadsheet,
  createEmptyMatrix,
  type CellBase,
} from "@/spreadsheet";

type Cell = CellBase<string | undefined>;

const ROWS = 8;
const COLS = 5;

/**
 * 日常开发时只跑 `pnpm dev:playground`，在这里挂你正在改的组件即可。
 * 全量文档与回归仍用 `pnpm dev`（Storybook）。
 */
export default function App() {
  const [data, setData] = React.useState(() =>
    createEmptyMatrix<Cell>(ROWS, COLS)
  );

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <header
        style={{
          flexShrink: 0,
          padding: "8px 12px",
          borderBottom: "1px solid #e5e5e5",
          fontSize: 14,
        }}
      >
        Playground — 编辑{" "}
        <code style={{ fontSize: 13 }}>playground/src/App.tsx</code>
      </header>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Spreadsheet data={data} onChange={setData} />
      </div>
    </div>
  );
}
