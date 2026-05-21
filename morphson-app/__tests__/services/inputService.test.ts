import axios from "axios";
import { http, HttpResponse } from "msw";

import inputService from "@/services/inputService";

import { mockInputJson } from "@tests/__mocks__/inputJson.mock";
import { mockMswServer } from "@tests/__mocks__/mswServer.mock";

describe("inputService", () => {
  describe("getAll", () => {
    it("should return all input jsons on success", async () => {
      const result = await inputService.getAll();

      expect(result).toEqual({
        code: "200",
        message: "OK",
        data: [mockInputJson],
      });
    });

    it("should throw an HTTP error when the API responds with a 500", async () => {
      mockMswServer.use(
        http.get("/api/v1/inputs/", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(inputService.getAll()).rejects.toThrow(/HTTP error! status: 500/);
    });

    it("should rethrow the original error when it is not an axios error", async () => {
      mockMswServer.use(
        http.get("/api/v1/inputs/", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      await expect(inputService.getAll()).rejects.not.toThrow(/HTTP error!/);
    });
  });

  describe("getById", () => {
    it("should return the input json matching the id on success", async () => {
      const result = await inputService.getById("1");

      expect(result.data.inputJson.id).toBe(1);
      expect(result.code).toBe("200");
    });

    it("should throw an HTTP error when the API responds with a 404", async () => {
      mockMswServer.use(
        http.get("/api/v1/inputs/:id", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(inputService.getById("999")).rejects.toThrow(/HTTP error! status: 404/);
    });

    it("should rethrow the original error when it is not an axios error", async () => {
      mockMswServer.use(
        http.get("/api/v1/inputs/:id", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      await expect(inputService.getById("1")).rejects.not.toThrow(/HTTP error!/);
    });
  });

  describe("upload", () => {
    it("should upload and return the created input json on success", async () => {
      const payload = { name: "test.json", content: '{"key":"value"}' };

      const result = await inputService.upload(payload);

      expect(result.code).toBe("201");
      expect(result.data.inputJson.name).toBe("test.json");
      expect(result.data.inputJson.content).toEqual({ key: "value" });
    });

    it("should throw an HTTP error when the API responds with a 400", async () => {
      mockMswServer.use(
        http.post("/api/v1/inputs/", () => {
          return new HttpResponse(null, { status: 400 });
        })
      );

      await expect(inputService.upload({ name: "test", content: "{}" })).rejects.toThrow(
        /HTTP error! status: 400/
      );
    });

    it("should rethrow the original error when it is not an axios error", async () => {
      mockMswServer.use(
        http.post("/api/v1/inputs/", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      await expect(inputService.upload({ name: "test", content: "{}" })).rejects.not.toThrow(
        /HTTP error!/
      );
    });
  });
});
