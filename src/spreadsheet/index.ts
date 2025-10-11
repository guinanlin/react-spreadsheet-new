// Main Spreadsheet module exports
import Spreadsheet from "./components/Spreadsheet";
import DataEditor from "./components/cells/DataEditor";
import DataViewer from "./components/cells/DataViewer";
import Workbook from "./components/Workbook";
import SheetTabs from "./components/tabs/SheetTabs";

export default Spreadsheet;
export { Spreadsheet, DataEditor, DataViewer, Workbook, SheetTabs };
export type { Props, SpreadsheetRef } from "./components/Spreadsheet";

// Data structures
export { createEmpty as createEmptyMatrix } from "./data-structures/matrix";
export type { Matrix } from "./data-structures/matrix";
export {
  Selection,
  EmptySelection,
  EntireAxisSelection,
  EntireColumnsSelection,
  EntireRowsSelection,
  EntireSelection,
  EntireWorksheetSelection,
  InvalidIndexError,
  RangeSelection,
} from "./data-structures/selection";
export { PointRange } from "./data-structures/point-range";
export type { Point } from "./data-structures/point";

// Types
export type {
  CellBase,
  CellDescriptor,
  Mode,
  Dimensions,
  CellChange,
  CellComponentProps,
  CellComponent,
  DataViewerProps,
  DataViewerComponent,
  DataEditorProps,
  DataEditorComponent,
  ColumnIndicatorComponent,
  ColumnIndicatorProps,
  RowIndicatorComponent,
  RowIndicatorProps,
  CornerIndicatorComponent,
  CornerIndicatorProps,
  RowComponent,
  RowProps,
  TableComponent,
  TableProps,
  HeaderRowProps,
  HeaderRowComponent,
  WorkbookSheet,
  WorkbookProps,
  SheetTabsProps,
} from "./types";

// Formula engine
export { createFormulaParser, Model } from "./engine";

