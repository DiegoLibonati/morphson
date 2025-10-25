import { InputJson, OutputJson } from "@src/entities/app";
import { EditorState, JSONState, ModalState } from "@src/entities/states";

export type EditorReducer = {
  type: "SET_TEXT";
  payload: { text: string };
};

export type EditorContext = {
  state: EditorState;
  dispatch: React.Dispatch<EditorReducer>;
};

export type JSONReducer =
  | {
      type: "INPUT_JSON_UPDATE";
      payload: Pick<InputJson, "id" | "name" | "content" | "keys">;
    }
  | {
      type: "INPUT_JSON_CONTENT_UPDATE";
      payload: Pick<InputJson, "content">;
    }
  | {
      type: "CONTEXT_CLEAR";
      payload: null;
    }
  | {
      type: "INPUT_JSONS";
      payload: {
        inputJsons: InputJson[];
      };
    }
  | {
      type: "OUTPUT_JSONS";
      payload: {
        outputJsons: OutputJson[];
      };
    }
  | {
      type: "OUTPUT_AND_INPUT_JSONS";
      payload: {
        inputJsons: InputJson[];
        outputJsons: OutputJson[];
      };
    }
  | {
      type: "OUTPUT_JSON_UPDATE";
      payload: Pick<OutputJson, "id" | "name" | "transformationModel">;
    }
  | {
      type: "OUTPUT_JSON_MODEL_UPDATE";
      payload: Pick<OutputJson, "transformationModel">;
    }
  | {
      type: "LOADING";
      payload: { loading: boolean };
    };

export type JSONContext = {
  state: JSONState;
  dispatch: React.Dispatch<JSONReducer>;
};

export type ModalReducer = {
  type: "SET_MODAL";
  payload: { message: string; open: boolean };
};

export type ModalContext = {
  state: ModalState;
  dispatch: React.Dispatch<ModalReducer>;
};
