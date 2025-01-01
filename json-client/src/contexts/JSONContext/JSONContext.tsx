import React, {
  Reducer,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

import { InputJson, OutputJson } from "@/src/entities/entities";
import {
  JSONAction,
  JSONState,
  JSONContext as JSONContextT,
} from "@/src/entities/json-context.d";

import {
  initialState,
  reducer,
} from "@/src/contexts/JSONContext/reducer/reducer";

interface JSONProviderProps {
  children: React.ReactNode;
}

export const JSONContext = createContext<JSONContextT | undefined>(undefined);

export const JSONProvider: React.FunctionComponent<JSONProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer<Reducer<JSONState, JSONAction>>(
    reducer,
    initialState
  );

  const handleUpdateInputJson = (inputJson: InputJson): void => {
    return dispatch({
      type: "INPUT_JSON_UPDATE",
      payload: {
        id: inputJson.id,
        name: inputJson.name,
        file: inputJson.file!,
        content: inputJson.content,
        keys: inputJson.keys,
      },
    });
  };

  const handleInputJsonContentUpdate = (inputContent: string): void => {
    return dispatch({
      type: "INPUT_JSON_CONTENT_UPDATE",
      payload: { content: inputContent },
    });
  };

  const handleInputJsonFileUpdate = (inputFile: File): void => {
    return dispatch({
      type: "INPUT_JSON_FILE_UPDATE",
      payload: { file: inputFile },
    });
  };

  const handleClearJson = (): void => {
    return dispatch({
      type: "CONTEXT_CLEAR",
      payload: null,
    });
  };

  const handleInputJsons = (inputJsons: InputJson[]): void => {
    return dispatch({
      type: "INPUT_JSONS",
      payload: { inputJsons: inputJsons },
    });
  };

  const handleOutputJsons = (outputJsons: OutputJson[]): void => {
    return dispatch({
      type: "OUTPUT_JSONS",
      payload: { outputJsons: outputJsons },
    });
  };

  const handleFillJsons = (
    inputJsons: InputJson[],
    outputJsons: OutputJson[]
  ): void => {
    return dispatch({
      type: "OUTPUT_AND_INPUT_JSONS",
      payload: { inputJsons: inputJsons, outputJsons: outputJsons },
    });
  };

  const handleUpdateOutputJson = (outputJson: OutputJson): void => {
    return dispatch({
      type: "OUTPUT_JSON_UPDATE",
      payload: {
        id: outputJson.id,
        name: outputJson.name,
        model: outputJson.model,
      },
    });
  };

  const handleOutputJsonModelUpdate = (outputContent: string): void => {
    return dispatch({
      type: "OUTPUT_JSON_MODEL_UPDATE",
      payload: { model: outputContent },
    });
  };

  const handleLoading = (loading: boolean): void => {
    return dispatch({
      type: "LOADING",
      payload: { loading: loading },
    });
  };

  useEffect(() => {
    if (state.loading) {
      document.body.style.overflow = "hidden";
      return;
    }
    document.body.style.overflow = "auto";
  }, [state.loading]);

  return (
    <JSONContext.Provider
      value={{
        inputJson: state.inputJson,
        outputJson: state.outputJson,
        jsons: state.jsons,
        loading: state.loading,
        handleUpdateInputJson: handleUpdateInputJson,
        handleInputJsonFileUpdate: handleInputJsonFileUpdate,
        handleInputJsonContentUpdate: handleInputJsonContentUpdate,
        handleInputJsons: handleInputJsons,
        handleOutputJsons: handleOutputJsons,
        handleFillJsons: handleFillJsons,
        handleUpdateOutputJson: handleUpdateOutputJson,
        handleOutputJsonModelUpdate: handleOutputJsonModelUpdate,
        handleLoading: handleLoading,
        handleClearJson: handleClearJson,
      }}
    >
      {children}
    </JSONContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useJSONContext = (): JSONContextT => {
  return useContext(JSONContext)!;
};
