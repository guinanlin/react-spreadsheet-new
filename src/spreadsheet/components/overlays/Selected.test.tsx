/**
 * @jest-environment jsdom
 */

import * as React from "react";
import { render } from "@testing-library/react";
import Selected from "./Selected";
import context from "../../core/context";
import { INITIAL_STATE } from "../../core/reducer";

describe("<Selected />", () => {
  test("renders", () => {
    render(
      <context.Provider value={[INITIAL_STATE, jest.fn()]}>
        <Selected />
      </context.Provider>
    );
  });
  expect(
    document.querySelector(
      ".Spreadsheet__floating-rect.Spreadsheet__floating-rect--selected"
    )
  );
});
