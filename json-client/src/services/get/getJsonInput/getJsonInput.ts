import { inputApi } from "@src/services/axios";

export const getJsonInput = (idInputJson: string) => {
  return inputApi.get(`/${idInputJson}`);
};
