import * as React from "react";
import classNames from "classnames";
import * as Types from "../types";
import type { Matrix } from "../data-structures/matrix";
import Spreadsheet from "./Spreadsheet";
import SheetTabs from "./tabs/SheetTabs";
import "./Workbook.css";

/**
 * Workbook component - Container for multiple spreadsheet sheets
 * Provides Google Sheets-like tab interface for switching between sheets
 */
const Workbook = <CellType extends Types.CellBase = Types.CellBase>(
  props: Types.WorkbookProps<CellType>
): React.ReactElement => {
  const {
    sheets,
    defaultActiveSheet,
    activeSheet: controlledActiveSheet,
    onSheetChange,
    className,
    darkMode = false,
    rowIndicatorWidth,
    columnIndicatorWidth,
    ColumnIndicator,
    CornerIndicator,
    RowIndicator,
    Table,
    Row,
    HeaderRow,
    Cell,
    DataViewer,
    DataEditor,
    createFormulaParser,
    onChange,
    onModeChange,
    onSelect,
  } = props;

  // State management: support both controlled and uncontrolled modes
  const [internalActiveSheet, setInternalActiveSheet] = React.useState<string>(
    () => {
      const initialSheet =
        controlledActiveSheet || defaultActiveSheet || sheets[0]?.id;
      if (!initialSheet && sheets.length > 0) {
        console.warn(
          "Workbook: No active sheet specified and sheets array is empty"
        );
      }
      return initialSheet || "";
    }
  );

  // Determine current active sheet (controlled or uncontrolled)
  const activeSheetId =
    controlledActiveSheet !== undefined
      ? controlledActiveSheet
      : internalActiveSheet;

  // Find the current active sheet configuration
  const currentSheet = React.useMemo(
    () => sheets.find((sheet) => sheet.id === activeSheetId),
    [sheets, activeSheetId]
  );

  // Handle sheet change
  const handleSheetChange = React.useCallback(
    (sheetId: string) => {
      // Update internal state if in uncontrolled mode
      if (controlledActiveSheet === undefined) {
        setInternalActiveSheet(sheetId);
      }
      // Notify parent component
      onSheetChange?.(sheetId);
    },
    [controlledActiveSheet, onSheetChange]
  );

  // Handle data change for the current sheet
  const handleDataChange = React.useCallback(
    (data: Matrix<CellType>) => {
      onChange?.(activeSheetId, data);
    },
    [activeSheetId, onChange]
  );

  // Prepare sheet tabs data
  const sheetTabs = React.useMemo(
    () =>
      sheets.map((sheet) => ({
        id: sheet.id,
        name: sheet.name,
      })),
    [sheets]
  );

  // Warn if active sheet is not found
  React.useEffect(() => {
    if (sheets.length > 0 && !currentSheet) {
      console.warn(
        `Workbook: Active sheet "${activeSheetId}" not found in sheets array`
      );
    }
  }, [activeSheetId, currentSheet, sheets.length]);

  return (
    <div
      className={classNames("Workbook", className, {
        "Workbook--dark": darkMode,
      })}
    >
      <div className="Workbook__content">
        {currentSheet ? (
          <Spreadsheet
            key={currentSheet.id} // Remount Spreadsheet when switching sheets
            data={currentSheet.data}
            darkMode={darkMode}
            hideRowIndicators={currentSheet.hideRowIndicators}
            hideColumnIndicators={currentSheet.hideColumnIndicators}
            columnLabels={currentSheet.columnLabels}
            rowLabels={currentSheet.rowLabels}
            rowIndicatorWidth={rowIndicatorWidth}
            columnIndicatorWidth={columnIndicatorWidth}
            ColumnIndicator={ColumnIndicator}
            CornerIndicator={CornerIndicator}
            RowIndicator={RowIndicator}
            Table={Table}
            Row={Row}
            HeaderRow={HeaderRow}
            Cell={Cell as any}
            DataViewer={DataViewer as any}
            DataEditor={DataEditor as any}
            createFormulaParser={createFormulaParser}
            onChange={handleDataChange as any}
            onModeChange={onModeChange}
            onSelect={onSelect}
          />
        ) : (
          <div className="Workbook__empty">
            {sheets.length === 0
              ? "No sheets available"
              : `Sheet "${activeSheetId}" not found`}
          </div>
        )}
      </div>

      {sheets.length > 0 && (
        <SheetTabs
          sheets={sheetTabs}
          activeSheetId={activeSheetId}
          onSheetChange={handleSheetChange}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Workbook;

