import { jsonApi } from "@/src/services/export";

export const postUploadJson = (formData: { name: string; content: string }) => {
  return jsonApi.post("/json/upload", formData);
};
