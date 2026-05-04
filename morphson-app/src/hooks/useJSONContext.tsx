import { useContext } from "react";

import type { UseJSONContext } from "@/types/hooks";

import { JSONContext } from "@/contexts/JSONContext/JSONContext";

export const useJSONContext = (): UseJSONContext => {
  const context = useContext(JSONContext);
  if (!context) {
    throw new Error("useJSONContext must be used within JSONProvider");
  }
  return context;
};
