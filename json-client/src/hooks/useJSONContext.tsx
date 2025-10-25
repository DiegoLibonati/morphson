import { useContext } from "react";

import { UseJSONContext } from "@src/entities/hooks";

import { JSONContext } from "@src/contexts/JSONContext/JSONContext";

export const useJSONContext = (): UseJSONContext => {
  const context = useContext(JSONContext);
  if (!context) {
    throw new Error("useJSONContext must be used within JSONProvider");
  }
  return context;
};
