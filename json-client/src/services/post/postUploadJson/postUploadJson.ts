import { inputApi } from "@src/services/export";

export const postUploadJson = (formData: { name: string; content: string }) => {
  return inputApi.post("/upload", formData);
};
