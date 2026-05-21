import { apiFile, apiInput, apiOutput, apiTransform } from "@/services/axios";

describe("axios", () => {
  describe("apiFile", () => {
    it("should be created with the file base URL", () => {
      expect(apiFile.defaults.baseURL).toBe("/api/v1/file");
    });
  });

  describe("apiInput", () => {
    it("should be created with the inputs base URL", () => {
      expect(apiInput.defaults.baseURL).toBe("/api/v1/inputs");
    });
  });

  describe("apiOutput", () => {
    it("should be created with the outputs base URL", () => {
      expect(apiOutput.defaults.baseURL).toBe("/api/v1/outputs");
    });
  });

  describe("apiTransform", () => {
    it("should be created with the transform base URL", () => {
      expect(apiTransform.defaults.baseURL).toBe("/api/v1/transform");
    });
  });
});
