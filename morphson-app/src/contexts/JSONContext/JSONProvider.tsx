import { useEffect, useReducer } from "react";

import type { JSX } from "react";
import type { JSONProviderProps } from "@/types/props";

import { JSONContext } from "@/contexts/JSONContext/JSONContext";
import { JSONReducer } from "@/contexts/JSONContext/JSONReducer";

export const JSONProvider = ({ children }: JSONProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(JSONReducer, {
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
  });

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
        state: state,
        dispatch: dispatch,
      }}
    >
      {children}
    </JSONContext.Provider>
  );
};
