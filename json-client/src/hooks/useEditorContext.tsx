import { useContext } from "react";

import { UseEditorContext } from "@src/entities/hooks";

import { EditorContext } from "@src/contexts/EditorContext/EditorContext";

export const useEditorContext = (): UseEditorContext => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within EditorProvider");
  }
  return context;
};
