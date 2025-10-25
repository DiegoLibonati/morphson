import React, { createContext, useEffect, useReducer } from "react";

import { JSONContext as JSONContextT } from "@src/entities/contexts";
import { JSONProviderProps } from "@src/entities/props";

import {
  initialState,
  JSONReducer,
} from "@src/contexts/JSONContext/JSONReducer";

export const JSONContext = createContext<JSONContextT | null>(null);

export const JSONProvider = ({ children }: JSONProviderProps) => {
  const [state, dispatch] = useReducer(JSONReducer, initialState);

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
