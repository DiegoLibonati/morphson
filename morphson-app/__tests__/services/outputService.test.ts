import axios from "axios";
import { http, HttpResponse } from "msw";

import outputService from "@/services/outputService";

import { mockOutputJson } from "@tests/__mocks__/outputJson.mock";
import { mockMswServer } from "@tests/__mocks__/mswServer.mock";

describe("outputService", () => {
  describe("getAll", () => {
    it("should return all output jsons on success", async () => {
      const result = await outputService.getAll();

      expect(result).toEqual({
        code: "200",
        message: "OK",
        data: [mockOutputJson],
      });
    });

    it("should throw an HTTP error when the API responds with a 500", async () => {
      mockMswServer.use(
        http.get("/api/v1/outputs/", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(outputService.getAll()).rejects.toThrow(/HTTP error! status: 500/);
    });

    it("should rethrow the original error when it is not an axios error", async () => {
      mockMswServer.use(
        http.get("/api/v1/outputs/", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      await expect(outputService.getAll()).rejects.not.toThrow(/HTTP error!/);
    });
  });

  describe("getById", () => {
    it("should return the output json matching the id on success", async () => {
      const result = await outputService.getById("1");

      expect(result.data.outputJson.id).toBe(1);
      expect(result.code).toBe("200");
    });

    it("should throw an HTTP error when the API responds with a 404", async () => {
      mockMswServer.use(
        http.get("/api/v1/outputs/:id", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(outputService.getById("999")).rejects.toThrow(/HTTP error! status: 404/);
    });

    it("should rethrow the original error when it is not an axios error", async () => {
      mockMswServer.use(
        http.get("/api/v1/outputs/:id", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      await expect(outputService.getById("1")).rejects.not.toThrow(/HTTP error!/);
    });
  });
});
