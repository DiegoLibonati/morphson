import { inputApi } from "@src/services/axios";

export const getJsonInputs = () => {
  return inputApi.get("/");
};
