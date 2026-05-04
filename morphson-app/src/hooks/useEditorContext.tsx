import { useContext } from "react";

import type { UseEditorContext } from "@/types/hooks";

import { EditorContext } from "@/contexts/EditorContext/EditorContext";

export const useEditorContext = (): UseEditorContext => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditorContext must be used within EditorProvider");
  }
  return context;
};
