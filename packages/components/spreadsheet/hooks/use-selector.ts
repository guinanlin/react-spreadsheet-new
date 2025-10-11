import { useContextSelector } from "use-context-selector";
import context from "../core/context";
import * as Types from "../types";

function useSelector<T>(selector: (state: Types.StoreState) => T): T {
  return useContextSelector(context, ([state]) => selector(state));
}

export default useSelector;
