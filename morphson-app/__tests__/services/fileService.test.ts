import axios from "axios";
import { http, HttpResponse } from "msw";

import fileService from "@/services/fileService";

import { mockMswServer } from "@tests/__mocks__/mswServer.mock";

describe("fileService", () => {
  describe("getContent", () => {
    it("should return the response data on success", async () => {
      const formData = new FormData();
      formData.append("file", new Blob(["{}"]), "test.json");

      const result = await fileService.getContent(formData);

      expect(result).toEqual({
        code: "200",
        message: "OK",
        data: '{"key":"value"}',
      });
    });

    it("should throw an HTTP error message when the API responds with a 500", async () => {
      mockMswServer.use(
        http.post("/api/v1/file/content", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const formData = new FormData();

      await expect(fileService.getContent(formData)).rejects.toThrow(/HTTP error! status: 500/);
    });

    it("should throw an HTTP error message when the API responds with a 404", async () => {
      mockMswServer.use(
        http.post("/api/v1/file/content", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      const formData = new FormData();

      await expect(fileService.getContent(formData)).rejects.toThrow(/HTTP error! status: 404/);
    });

    it("should rethrow the original error when it is not an axios error", async () => {
      mockMswServer.use(
        http.post("/api/v1/file/content", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      const formData = new FormData();

      await expect(fileService.getContent(formData)).rejects.not.toThrow(/HTTP error!/);
    });
  });
});
