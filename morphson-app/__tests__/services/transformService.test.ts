import axios from "axios";

import { apiTransform } from "@/services/axios";
import transformService from "@/services/transformService";

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

describe("transformService", () => {
  describe("transform", () => {
    it("should return the blob on success", async () => {
      const mockBlob = new Blob(['{"result": "ok"}'], { type: "application/json" });
      (apiTransform.post as jest.Mock).mockResolvedValue({ data: mockBlob });

      const payload = {
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: '{"key":"input.key"}',
      };

      const result = await transformService.transform(payload);

      expect(result).toBe(mockBlob);
      expect(apiTransform.post).toHaveBeenCalledWith("/", payload, { responseType: "blob" });
    });

    it("should throw with HTTP error message on axios error", async () => {
      (apiTransform.post as jest.Mock).mockRejectedValue(mockAxiosError(422));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const payload = {
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: "{}",
      };

      await expect(transformService.transform(payload)).rejects.toThrow("HTTP error! status: 422");
    });

    it("should re-throw non-axios errors", async () => {
      (apiTransform.post as jest.Mock).mockRejectedValue(new Error("Network failure"));
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      const payload = {
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: "{}",
      };

      await expect(transformService.transform(payload)).rejects.toThrow("Network failure");
    });
  });
});
