import { transformApi } from "@src/services/export";

type Body = {
  idInputJson: string;
  saveOutputJson: boolean;
  outputJsonNameToSave: string;
  contentJsonToTransform: string;
};

export const postTransformJson = (body: Body) => {
  return transformApi.post("/", body, { responseType: "blob" });
};
