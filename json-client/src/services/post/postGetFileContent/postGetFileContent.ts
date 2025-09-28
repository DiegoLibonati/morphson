import { fileApi } from "@src/services/export";

export const postGetFileContent = (formData: FormData) => {
  return fileApi.post("/content", formData);
};
