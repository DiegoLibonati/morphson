import axios from "axios";

import { apiInput } from "@/services/axios";
import inputService from "@/services/inputService";

import { mockInputJson } from "@tests/__mocks__/inputJson.mock";

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

describe("inputService", () => {
  describe("getAll", () => {
    it("should return all input jsons on success", async () => {
      const mockResponseData = { code: "200", message: "OK", data: [mockInputJson] };
      (apiInput.get as jest.Mock).mockResolvedValue({ data: mockResponseData });

      const result = await inputService.getAll();

      expect(result).toEqual(mockResponseData);
      expect(apiInput.get).toHaveBeenCalledWith("/");
    });

    it("should throw with HTTP error message on axios error", async () => {
      (apiInput.get as jest.Mock).mockRejectedValue(mockAxiosError(500));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(inputService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });

    it("should re-throw non-axios errors", async () => {
      (apiInput.get as jest.Mock).mockRejectedValue(new Error("Network failure"));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      await expect(inputService.getAll()).rejects.toThrow("Network failure");
    });
  });

  describe("getById", () => {
    it("should return the input json by id on success", async () => {
      const mockResponseData = { code: "200", message: "OK", data: { inputJson: mockInputJson } };
      (apiInput.get as jest.Mock).mockResolvedValue({ data: mockResponseData });

      const result = await inputService.getById("1");

      expect(result).toEqual(mockResponseData);
      expect(apiInput.get).toHaveBeenCalledWith("/1");
    });

    it("should throw with HTTP error message on axios error", async () => {
      (apiInput.get as jest.Mock).mockRejectedValue(mockAxiosError(404));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(inputService.getById("1")).rejects.toThrow("HTTP error! status: 404");
    });

    it("should re-throw non-axios errors", async () => {
      (apiInput.get as jest.Mock).mockRejectedValue(new Error("Network failure"));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      await expect(inputService.getById("1")).rejects.toThrow("Network failure");
    });
  });

  describe("upload", () => {
    it("should upload and return the created input json on success", async () => {
      const mockResponseData = {
        code: "201",
        message: "Created",
        data: { inputJson: mockInputJson },
      };
      (apiInput.post as jest.Mock).mockResolvedValue({ data: mockResponseData });

      const payload = { name: "test.json", content: '{"key":"value"}' };
      const result = await inputService.upload(payload);

      expect(result).toEqual(mockResponseData);
      expect(apiInput.post).toHaveBeenCalledWith("/", payload);
    });

    it("should throw with HTTP error message on axios error", async () => {
      (apiInput.post as jest.Mock).mockRejectedValue(mockAxiosError(400));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(inputService.upload({ name: "test", content: "{}" })).rejects.toThrow(
        "HTTP error! status: 400"
      );
    });

    it("should re-throw non-axios errors", async () => {
      (apiInput.post as jest.Mock).mockRejectedValue(new Error("Network failure"));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      await expect(inputService.upload({ name: "test", content: "{}" })).rejects.toThrow(
        "Network failure"
      );
    });
  });
});
