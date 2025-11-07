import * as React from "react";
import { DtyInput, type SuggestionItem } from "@/dtyinput";
import { CellBase, DataEditorComponent, DataViewerComponent } from "..";

type Value = string | undefined;
type Cell = CellBase<Value> & {
  value: Value;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_DATA: Record<string, SuggestionItem[]> = {
  a: [
    { id: "1", type: "normal", content: "Apple", value: "apple" },
    { id: "2", type: "normal", content: "Apricot", value: "apricot" },
    { id: "3", type: "normal", content: "Avocado", value: "avocado" },
  ],
  b: [
    { id: "4", type: "normal", content: "Banana", value: "banana" },
    { id: "5", type: "normal", content: "Blueberry", value: "blueberry" },
    { id: "6", type: "normal", content: "Blackberry", value: "blackberry" },
  ],
  c: [
    { id: "7", type: "normal", content: "Cherry", value: "cherry" },
    { id: "8", type: "normal", content: "Coconut", value: "coconut" },
    { id: "9", type: "normal", content: "Cranberry", value: "cranberry" },
  ],
};

const fetchSuggestions = async (query: string): Promise<SuggestionItem[]> => {
  await delay(500);

  if (!query) {
    return Object.values(MOCK_DATA).flat().slice(0, 5);
  }

  const firstLetter = query.toLowerCase()[0];
  const results = MOCK_DATA[firstLetter] || [];

  return [
    ...results,
    { id: "action", type: "action", content: "搜索更多结果", icon: "search" },
  ];
};

export const SelectView: DataViewerComponent<Cell> = ({ cell }) => {
  const value = cell?.value ?? "";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        color: value ? "#111" : "#999",
      }}
    >
      {value || "请选择"}
    </div>
  );
};

export const SelectEdit: DataEditorComponent<Cell> = ({
  cell,
  onChange,
  exitEditMode,
}) => {
  const [value, setValue] = React.useState(cell?.value ?? "");

  React.useEffect(() => {
    setValue(cell?.value ?? "");
  }, [cell?.value]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setValue(nextValue);
      onChange({ ...cell, value: nextValue });
    },
    [cell, onChange]
  );

  const handleSuggestionSelect = React.useCallback(
    (item: SuggestionItem) => {
      if (item.type === "action") {
        return;
      }

      const nextValue = item.value ??
        (typeof item.content === "string" ? item.content : item.content[0] ?? "");

      setValue(nextValue);
      onChange({ ...cell, value: nextValue });
      exitEditMode();
    },
    [cell, exitEditMode, onChange]
  );

  return (
    <DtyInput
      value={value}
      onChange={handleChange}
      placeholder="从服务器获取建议"
      showSuggestions
      fetchFromServer
      fetchSuggestions={fetchSuggestions}
      width="100%"
      autoFocus
      onSuggestionSelect={handleSuggestionSelect}
      onBlur={exitEditMode}
    />
  );
};
