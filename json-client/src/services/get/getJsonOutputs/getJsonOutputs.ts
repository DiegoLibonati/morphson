import { outputApi } from "@src/services/axios";

export const getJsonOutputs = () => {
  return outputApi.get("/");
};
