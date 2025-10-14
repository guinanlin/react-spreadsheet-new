import React, { useCallback, useRef, useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { DtyLuckySheet, DtyLuckySheetInstance } from "../components/DtyLuckySheet";
import type { Sheet } from "../core/types";

export default {
  title: "DtyLuckySheet/API",
  component: DtyLuckySheet,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof DtyLuckySheet>;

const ApiExecContainer: React.FC<{
  onRun: () => any;
  children?: React.ReactNode;
}> = ({ children, onRun }) => {
  const [result, setResult] = useState<string>();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      <div style={{ flexShrink: 0, padding: 8, background: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
        <button
          type="button"
          onClick={() => {
            const res = onRun?.();
            setResult(res != null ? JSON.stringify(res) : "undefined");
          }}
          style={{
            padding: "6px 16px",
            background: "#1890ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Run
        </button>
        {result && (
          <span style={{ marginLeft: 16 }}>
            <span style={{ color: "#aaa" }}>result: </span>
            <span style={{ color: "#333" }}>{result}</span>
          </span>
        )}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

/**
 * 获取单元格值
 */
export const GetCellValue: StoryFn<typeof DtyLuckySheet> = () => {
  const ref = useRef<DtyLuckySheetInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      id: "1",
      celldata: [{ r: 0, c: 0, v: { v: "fortune", m: "fortune" } }],
      order: 0,
      row: 10,
      column: 10,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  
  return (
    <ApiExecContainer
      onRun={() => {
        return ref.current?.getCellValue(0, 0);
      }}
    >
      <DtyLuckySheet ref={ref} data={data} onChange={onChange} />
    </ApiExecContainer>
  );
};

/**
 * 设置单元格值
 */
export const SetCellValue: StoryFn<typeof DtyLuckySheet> = () => {
  const ref = useRef<DtyLuckySheetInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      id: "1",
      order: 0,
      row: 10,
      column: 10,
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  
  return (
    <ApiExecContainer
      onRun={() => {
        for (let i = 0; i < 5; i += 1) {
          for (let j = 0; j < 5; j += 1) {
            ref.current?.setCellValue(i, j, `${i},${j}`);
          }
        }
        return "Values set!";
      }}
    >
      <DtyLuckySheet ref={ref} data={data} onChange={onChange} allowEdit={true} />
    </ApiExecContainer>
  );
};

/**
 * 清除单元格
 */
export const ClearCell: StoryFn<typeof DtyLuckySheet> = () => {
  const ref = useRef<DtyLuckySheetInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      id: "1",
      order: 0,
      row: 10,
      column: 10,
      celldata: [
        { r: 0, c: 0, v: { v: "Hello", m: "Hello" } },
        { r: 1, c: 1, v: { v: "World", m: "World" } },
      ],
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.clearCell(0, 0);
        ref.current?.clearCell(1, 1);
        return "Cells cleared!";
      }}
    >
      <DtyLuckySheet ref={ref} data={data} onChange={onChange} allowEdit={true} />
    </ApiExecContainer>
  );
};

/**
 * 开始编辑单元格
 */
export const StartEdit: StoryFn<typeof DtyLuckySheet> = () => {
  const ref = useRef<DtyLuckySheetInstance>(null);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      id: "1",
      order: 0,
      row: 10,
      column: 10,
      celldata: [
        { r: 0, c: 0, v: { v: "Click to edit", m: "Click to edit" } },
      ],
    },
  ]);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  
  return (
    <ApiExecContainer
      onRun={() => {
        ref.current?.startEdit(0, 0);
        return "Started editing cell A1";
      }}
    >
      <DtyLuckySheet ref={ref} data={data} onChange={onChange} allowEdit={true} />
    </ApiExecContainer>
  );
};
