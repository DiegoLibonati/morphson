import React, { Reducer, createContext, useContext, useReducer } from "react";

import {
  EditorAction,
  EditorContext as EditorContextT,
  EditorProviderProps,
  EditorState,
} from "@src/entities/editor-context";

import {
  initialState,
  reducer,
} from "@src/contexts/EditorContext/reducer/reducer";

export const EditorContext = createContext<EditorContextT | undefined>(
  undefined
);

export const EditorProvider: React.FunctionComponent<EditorProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer<Reducer<EditorState, EditorAction>>(
    reducer,
    initialState
  );

  const handleSetText = (text: string): void => {
    return dispatch({
      type: "SET_TEXT",
      payload: { text: text },
    });
  };

  return (
    <EditorContext.Provider
      value={{
        text: state.text,
        handleSetText: handleSetText,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = (): EditorContextT => {
  return useContext(EditorContext)!;
};
