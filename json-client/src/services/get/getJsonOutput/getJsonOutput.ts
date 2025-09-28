import { outputApi } from "@src/services/axios";

export const getJsonOutput = (idOutputJson: string) => {
  return outputApi.get(`/${idOutputJson}`);
};
