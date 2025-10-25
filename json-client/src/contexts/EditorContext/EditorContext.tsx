import React, { createContext, useReducer } from "react";

import { EditorContext as EditorContextT } from "@src/entities/contexts";
import { EditorProviderProps } from "@src/entities/props";

import {
  initialState,
  EditorReducer,
} from "@src/contexts/EditorContext/EditorReducer";

export const EditorContext = createContext<EditorContextT | null>(null);

export const EditorProvider = ({ children }: EditorProviderProps) => {
  const [state, dispatch] = useReducer(EditorReducer, initialState);

  return (
    <EditorContext.Provider
      value={{
        state: state,
        dispatch: dispatch,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
