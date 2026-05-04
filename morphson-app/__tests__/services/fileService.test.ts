import axios from "axios";

import { apiFile } from "@/services/axios";
import fileService from "@/services/fileService";

jest.mock("@/services/axios", () => ({
  apiFile: { post: jest.fn() },
  apiInput: { get: jest.fn(), post: jest.fn() },
  apiOutput: { get: jest.fn() },
  apiTransform: { post: jest.fn() },
}));

describe("fileService", () => {
  describe("getContent", () => {
    it("should return response data on success", async () => {
      const mockFormData = new FormData();
      const mockResponseData = { code: "200", message: "OK", data: "file content" };
      (apiFile.post as jest.Mock).mockResolvedValue({ data: mockResponseData });

      const result = await fileService.getContent(mockFormData);

      expect(result).toEqual(mockResponseData);
      expect(apiFile.post).toHaveBeenCalledWith("/content", mockFormData);
    });

    it("should throw with HTTP error message on axios error with response", async () => {
      const mockFormData = new FormData();
      const mockError = Object.assign(new Error("Request failed"), {
        response: { status: 404 },
        isAxiosError: true,
      });
      (apiFile.post as jest.Mock).mockRejectedValue(mockError);
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      await expect(fileService.getContent(mockFormData)).rejects.toThrow(
        "HTTP error! status: 404 - Request failed"
      );
    });

    it("should re-throw non-axios errors", async () => {
      const mockFormData = new FormData();
      const mockError = new Error("Network failure");
      (apiFile.post as jest.Mock).mockRejectedValue(mockError);
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      await expect(fileService.getContent(mockFormData)).rejects.toThrow("Network failure");
    });
  });
});
