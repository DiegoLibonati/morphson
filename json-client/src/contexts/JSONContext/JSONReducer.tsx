import { JSONReducer as JSONReducerT } from "@src/entities/contexts";
import { JSONState } from "@src/entities/states";

export const initialState: JSONState = {
  inputJson: {
    id: null,
    name: "",
    content: null,
    keys: [],
    keysAndValues: null,
    createdAt: null,
    updatedAt: null,
  },
  outputJson: {
    id: null,
    name: "",
    transformationModel: null,
    createdAt: null,
    updatedAt: null,
  },
  jsons: {
    inputJsons: [],
    outputJsons: [],
  },
  loading: false,
};

export const JSONReducer = (state: JSONState, action: JSONReducerT) => {
  switch (action.type) {
    case "INPUT_JSON_UPDATE":
      return {
        ...state,
        inputJson: {
          ...state.inputJson,
          id: action.payload.id,
          name: action.payload.name,
          content: action.payload.content,
          keys: action.payload.keys,
        },
      };
    case "INPUT_JSON_CONTENT_UPDATE":
      return {
        ...state,
        inputJson: {
          ...state.inputJson,
          content: action.payload.content,
        },
      };
    case "INPUT_JSONS":
      return {
        ...state,
        jsons: {
          ...state.jsons,
          inputJsons: action.payload.inputJsons,
        },
      };
    case "OUTPUT_JSONS":
      return {
        ...state,
        jsons: {
          ...state.jsons,
          outputJsons: action.payload.outputJsons,
        },
      };
    case "OUTPUT_AND_INPUT_JSONS":
      return {
        ...state,
        jsons: {
          ...state.jsons,
          inputJsons: action.payload.inputJsons,
          outputJsons: action.payload.outputJsons,
        },
      };
    case "OUTPUT_JSON_UPDATE":
      return {
        ...state,
        outputJson: {
          ...state.outputJson,
          id: action.payload.id,
          name: action.payload.name,
          transformationModel: action.payload.transformationModel,
        },
      };
    case "OUTPUT_JSON_MODEL_UPDATE":
      return {
        ...state,
        outputJson: {
          ...state.outputJson,
          transformationModel: action.payload.transformationModel,
        },
      };
    case "LOADING":
      return {
        ...state,
        loading: action.payload.loading,
      };
    case "CONTEXT_CLEAR":
      const { loading, ...rest } = initialState;
      return {
        ...state,
        ...rest,
      };
    default:
      throw new Error("Unknown action: " + (action as JSONReducerT)?.type);
  }
};
