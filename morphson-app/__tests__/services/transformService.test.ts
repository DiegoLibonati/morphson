import axios from "axios";
import { http, HttpResponse } from "msw";

import transformService from "@/services/transformService";

import { mockMswServer } from "@tests/__mocks__/mswServer.mock";

describe("transformService", () => {
  describe("transform", () => {
    it("should return a blob on success", async () => {
      const payload = {
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: '{"key":"input.key"}',
      };

      const result = await transformService.transform(payload);

      expect(result).toBeInstanceOf(Blob);
      const text = await result.text();
      expect(JSON.parse(text)).toEqual({ transformed: true });
    });

    it("should throw an HTTP error when the API responds with a 422", async () => {
      mockMswServer.use(
        http.post("/api/v1/transform/", () => {
          return new HttpResponse(null, { status: 422 });
        })
      );

      const payload = {
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: "{}",
      };

      await expect(transformService.transform(payload)).rejects.toThrow(/HTTP error! status: 422/);
    });

    it("should throw an HTTP error when the API responds with a 500", async () => {
      mockMswServer.use(
        http.post("/api/v1/transform/", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const payload = {
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: "{}",
      };

      await expect(transformService.transform(payload)).rejects.toThrow(/HTTP error! status: 500/);
    });

    it("should rethrow the original error when it is not an axios error", async () => {
      mockMswServer.use(
        http.post("/api/v1/transform/", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      const payload = {
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: "{}",
      };

      await expect(transformService.transform(payload)).rejects.not.toThrow(/HTTP error!/);
    });
  });
});
