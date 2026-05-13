import React, { useCallback, useRef, useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { DtyLuckySheet, DtyLuckySheetInstance } from "../components/DtyLuckySheet";
import type { Sheet } from "../core/types";
import { parseExcelFile } from "./utils/excel-import";

export default {
  title: "DtyLuckySheet/API",
  component: DtyLuckySheet,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof DtyLuckySheet>;

const ApiExecContainer: React.FC<{
  onRun: () => unknown;
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

/**
 * 导入本地 Excel / xlsx / xls / xlsb / csv（多工作表）。
 * 导入后强制重挂载以替换_workbook_，并可查看降级提示列表。
 */
export const ImportExcel: StoryFn<typeof DtyLuckySheet> = () => {
  const ref = useRef<DtyLuckySheetInstance>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [workbookNonce, setWorkbookNonce] = useState(0);
  const [data, setData] = useState<Sheet[]>([
    {
      name: "Sheet1",
      id: "api-import-empty",
      order: 0,
      row: 20,
      column: 14,
      config: {},
    },
  ]);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [errorText, setErrorText] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);

  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // FileList 在同一 input 上常为 live：须先取出 File，再清空 value；
    // 否则清空后长度为 0，会误判「未选择文件」且无任何解析错误提示。
    const fileList = e.target.files;
    const pickBeforeReset = fileList?.item(0) ?? undefined;
    e.target.value = "";
    const file = pickBeforeReset;
    if (!file) return;

    setStatus("loading");
    setErrorText("");
    setWarnings([]);

    try {
      const { sheets: nextSheets, warnings: w } = await parseExcelFile(file);

      setData(nextSheets);
      setWarnings(w);
      setStatus("ok");
      setWorkbookNonce((n) => n + 1);
      setTimeout(() => {
        ref.current?.calculateFormula?.();
      }, 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorText(msg);
      setStatus("error");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: 8,
          background: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.xlsb,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={status === "loading"}
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: "6px 16px",
            background: status === "loading" ? "#999" : "#52c41a",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            marginRight: 12,
          }}
        >
          {status === "loading" ? "导入中..." : "导入 Excel"}
        </button>
        <span style={{ color: "#555" }}>
          选择 `.xlsx` / `.xls` / `.xlsb` / `.csv`；将导入全部工作表。
        </span>
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: "#888",
            maxWidth: 720,
          }}
        >
          说明：边框、图表、透视表、条件格式等高级特性可能不会完全映射，以单元格的值为准；
          仅在实际遇到兼容性问题时会出现下方警告列表。
        </div>
        {status === "loading" && (
          <span style={{ marginLeft: 12, color: "#1890ff" }}>解析中…</span>
        )}
        {status === "ok" && (
          <span style={{ marginLeft: 12, color: "#389e0d" }}>导入成功。</span>
        )}
        {status === "error" && (
          <span style={{ marginLeft: 12, color: "#cf1322" }}>
            {errorText || "导入失败"}
          </span>
        )}
        {warnings.length > 0 && (
          <details style={{ marginTop: 8 }}>
            <summary style={{ cursor: "pointer", color: "#595959" }}>
              降级 / 警告（{warnings.length}）
            </summary>
            <ul
              style={{
                margin: "8px 0 0",
                paddingLeft: 18,
                maxHeight: 120,
                overflow: "auto",
                fontSize: 12,
                color: "#666",
              }}
            >
              {warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <DtyLuckySheet
          key={workbookNonce}
          ref={ref}
          data={data}
          onChange={onChange}
          allowEdit
        />
      </div>
    </div>
  );
};
