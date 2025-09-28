import { InputJson, OutputJson } from "@src/entities/entities.d";

export type JSONState = {
  inputJson: InputJson;
  outputJson: OutputJson;
  jsons: {
    inputJsons: InputJson[];
    outputJsons: OutputJson[];
  };
  loading: boolean;
};

export type JSONAction =
  | {
      type: "INPUT_JSON_UPDATE";
      payload: Pick<InputJson, "id" | "name", "content", "keys">;
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
  inputJson: InputJson;
  outputJson: OutputJson;
  jsons: {
    inputJsons: InputJson[];
    outputJsons: OutputJson[];
  };
  loading: boolean;
  handleUpdateInputJson: (inputJson: InputJson) => void;
  handleInputJsonContentUpdate: (
    inputContent: Pick<InputJson, "content">
  ) => void;
  handleInputJsons: (inputJsons: InputJson[]) => void;
  handleOutputJsons: (outputJsons: OutputJson[]) => void;
  handleFillJsons: (inputJsons: InputJson[], outputJsons: OutputJson[]) => void;
  handleUpdateOutputJson: (outputJson: OutputJson) => void;
  handleOutputJsonModelUpdate: (
    outputContent: Pick<OutputJson, "transformationModel">
  ) => void;
  handleLoading: (loading: boolean) => void;
  handleClearJson: () => void;
};

export interface JSONProviderProps {
  children: React.ReactNode;
}
