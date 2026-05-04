import axios from "axios";

import { apiOutput } from "@/services/axios";
import outputService from "@/services/outputService";

import { mockOutputJson } from "@tests/__mocks__/outputJson.mock";

jest.mock("@/services/axios", () => ({
  apiFile: { post: jest.fn() },
  apiInput: { get: jest.fn(), post: jest.fn() },
  apiOutput: { get: jest.fn() },
  apiTransform: { post: jest.fn() },
}));

const mockAxiosError = (status: number): Error =>
  Object.assign(new Error("Request failed"), {
    response: { status },
    isAxiosError: true,
  });

describe("outputService", () => {
  describe("getAll", () => {
    it("should return all output jsons on success", async () => {
      const mockResponseData = { code: "200", message: "OK", data: [mockOutputJson] };
      (apiOutput.get as jest.Mock).mockResolvedValue({ data: mockResponseData });

      const result = await outputService.getAll();

      expect(result).toEqual(mockResponseData);
      expect(apiOutput.get).toHaveBeenCalledWith("/");
    });

    it("should throw with HTTP error message on axios error", async () => {
      (apiOutput.get as jest.Mock).mockRejectedValue(mockAxiosError(500));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(outputService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });

    it("should re-throw non-axios errors", async () => {
      (apiOutput.get as jest.Mock).mockRejectedValue(new Error("Network failure"));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      await expect(outputService.getAll()).rejects.toThrow("Network failure");
    });
  });

  describe("getById", () => {
    it("should return the output json by id on success", async () => {
      const mockResponseData = {
        code: "200",
        message: "OK",
        data: { outputJson: mockOutputJson },
      };
      (apiOutput.get as jest.Mock).mockResolvedValue({ data: mockResponseData });

      const result = await outputService.getById("1");

      expect(result).toEqual(mockResponseData);
      expect(apiOutput.get).toHaveBeenCalledWith("/1");
    });

    it("should throw with HTTP error message on axios error", async () => {
      (apiOutput.get as jest.Mock).mockRejectedValue(mockAxiosError(404));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(outputService.getById("1")).rejects.toThrow("HTTP error! status: 404");
    });

    it("should re-throw non-axios errors", async () => {
      (apiOutput.get as jest.Mock).mockRejectedValue(new Error("Network failure"));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      await expect(outputService.getById("1")).rejects.toThrow("Network failure");
    });
  });
});
