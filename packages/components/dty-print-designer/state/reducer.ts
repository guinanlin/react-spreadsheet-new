import type {
  DataField,
  DataSourceRef,
  PageDefinition,
  PrintTemplateDefinition,
  TemplateElement,
  TemplateElementType,
} from "../schema/types";

export type ToolId = "pointer" | TemplateElementType;

export interface DesignerState {
  template: PrintTemplateDefinition;
  activeTool: ToolId;
  selectedId: string | null;
}

export type DesignerAction =
  | { type: "SET_TEMPLATE"; template: PrintTemplateDefinition }
  | { type: "SET_NAME"; name: string }
  | { type: "SET_TOOL"; tool: ToolId }
  | { type: "UPDATE_PAGE"; page: Partial<PageDefinition> }
  | { type: "ADD_ELEMENT"; element: TemplateElement }
  | {
      type: "UPDATE_ELEMENT";
      id: string;
      patch: Partial<TemplateElement>;
    }
  | { type: "MOVE_ELEMENT"; id: string; xMm: number; yMm: number }
  | { type: "RESIZE_ELEMENT"; id: string; widthMm: number; heightMm: number }
  | { type: "REMOVE_ELEMENT"; id: string }
  | { type: "SELECT"; id: string | null }
  | { type: "SET_DATA_SOURCE"; id?: string; label?: string }
  /** 更新数据源的任意字段（label/doctype/description/fields/sampleData） */
  | { type: "UPDATE_DATA_SOURCE"; patch: Partial<DataSourceRef> }
  /** 替换整个 dataSource.fields 数组 */
  | { type: "SET_DATA_SOURCE_FIELDS"; fields: DataField[] }
  /** 替换 dataSource.sampleData */
  | { type: "SET_SAMPLE_DATA"; sampleData: Record<string, unknown> | undefined };

export function reducer(
  state: DesignerState,
  action: DesignerAction
): DesignerState {
  switch (action.type) {
    case "SET_TEMPLATE":
      return { ...state, template: action.template };
    case "SET_NAME":
      return {
        ...state,
        template: touch({ ...state.template, name: action.name }),
      };
    case "SET_TOOL":
      return { ...state, activeTool: action.tool };
    case "UPDATE_PAGE":
      return {
        ...state,
        template: touch({
          ...state.template,
          page: { ...state.template.page, ...action.page },
        }),
      };
    case "ADD_ELEMENT":
      return {
        ...state,
        template: touch({
          ...state.template,
          elements: [...state.template.elements, action.element],
        }),
        selectedId: action.element.id,
        activeTool: "pointer",
      };
    case "UPDATE_ELEMENT":
      return {
        ...state,
        template: touch({
          ...state.template,
          elements: state.template.elements.map((el) =>
            el.id === action.id
              ? ({ ...el, ...action.patch } as TemplateElement)
              : el
          ),
        }),
      };
    case "MOVE_ELEMENT":
      return {
        ...state,
        template: touch({
          ...state.template,
          elements: state.template.elements.map((el) =>
            el.id === action.id
              ? {
                  ...el,
                  box: { ...el.box, xMm: action.xMm, yMm: action.yMm },
                }
              : el
          ),
        }),
      };
    case "RESIZE_ELEMENT":
      return {
        ...state,
        template: touch({
          ...state.template,
          elements: state.template.elements.map((el) =>
            el.id === action.id
              ? {
                  ...el,
                  box: {
                    ...el.box,
                    widthMm: action.widthMm,
                    heightMm: action.heightMm,
                  },
                }
              : el
          ),
        }),
      };
    case "REMOVE_ELEMENT":
      return {
        ...state,
        template: touch({
          ...state.template,
          elements: state.template.elements.filter(
            (el) => el.id !== action.id
          ),
        }),
        selectedId:
          state.selectedId === action.id ? null : state.selectedId,
      };
    case "SELECT":
      return { ...state, selectedId: action.id };
    case "SET_DATA_SOURCE":
      return {
        ...state,
        template: touch({
          ...state.template,
          dataSource: action.id
            ? { ...state.template.dataSource, id: action.id, label: action.label }
            : undefined,
        }),
      };
    case "UPDATE_DATA_SOURCE":
      return {
        ...state,
        template: touch({
          ...state.template,
          dataSource: { ...state.template.dataSource, ...action.patch },
        }),
      };
    case "SET_DATA_SOURCE_FIELDS":
      return {
        ...state,
        template: touch({
          ...state.template,
          dataSource: {
            ...state.template.dataSource,
            fields: action.fields,
          },
        }),
      };
    case "SET_SAMPLE_DATA":
      return {
        ...state,
        template: touch({
          ...state.template,
          dataSource: {
            ...state.template.dataSource,
            sampleData: action.sampleData,
          },
        }),
      };
    default:
      return state;
  }
}

function touch(t: PrintTemplateDefinition): PrintTemplateDefinition {
  return {
    ...t,
    metadata: {
      ...(t.metadata ?? {}),
      updatedAt: new Date().toISOString(),
    },
  };
}
