import type { InputJson, OutputJson } from "@/types/app";

export interface EditorReducer {
  type: "SET_TEXT";
  payload: { text: string };
}

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

export interface ModalReducer {
  type: "SET_MODAL";
  payload: { message: string; open: boolean };
}
