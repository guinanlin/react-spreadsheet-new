/**
 * @jest-environment jsdom
 */

import * as React from "react";
import { render } from "@testing-library/react";
import Copied from "./Copied";
import context from "../../core/context";
import { INITIAL_STATE } from "../../core/reducer";

describe("<Copied />", () => {
  test("renders", () => {
    render(
      <context.Provider value={[INITIAL_STATE, jest.fn()]}>
        <Copied />
      </context.Provider>
    );
  });
  expect(
    document.querySelector(
      ".Spreadsheet__floating-rect.Spreadsheet__floating-rect--copied"
    )
  );
});
