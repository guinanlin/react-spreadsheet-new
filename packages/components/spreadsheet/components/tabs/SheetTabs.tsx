import * as React from "react";
import classNames from "classnames";
import * as Types from "../../types";
import "./SheetTabs.css";

/**
 * SheetTabs component - Renders a tab bar for switching between sheets
 */
const SheetTabs: React.FC<Types.SheetTabsProps> = ({
  sheets,
  activeSheetId,
  onSheetChange,
  darkMode = false,
}) => {
  const handleTabClick = React.useCallback(
    (sheetId: string) => {
      if (sheetId !== activeSheetId) {
        onSheetChange(sheetId);
      }
    },
    [activeSheetId, onSheetChange]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, sheetId: string) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleTabClick(sheetId);
      }
    },
    [handleTabClick]
  );

  return (
    <div className={classNames("SheetTabs", { "SheetTabs--dark": darkMode })}>
      <div className="SheetTabs__container">
        {sheets.map((sheet) => {
          const isActive = sheet.id === activeSheetId;
          return (
            <button
              key={sheet.id}
              type="button"
              className={classNames("SheetTab", {
                "SheetTab--active": isActive,
              })}
              onClick={() => handleTabClick(sheet.id)}
              onKeyDown={(e) => handleKeyDown(e, sheet.id)}
              aria-selected={isActive}
              role="tab"
              tabIndex={isActive ? 0 : -1}
            >
              <span className="SheetTab__name">{sheet.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SheetTabs;

