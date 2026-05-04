import type { InputJson } from "@prisma/client";
import type { InputJsonCreatePayload } from "@/types/payloads";

import { InputService } from "@/services/input.service";

import { InputDAO } from "@/daos/input.dao";

import { mockInputJson } from "@tests/__mocks__/inputJson.mock";

jest.mock("@/daos/input.dao");

describe("input.service", () => {
  describe("getAllInputs", () => {
    it("should return all input jsons from the DAO", async () => {
      (InputDAO.findMany as jest.Mock).mockResolvedValue([mockInputJson]);

      const result: InputJson[] = await InputService.getAllInputs();

      expect(InputDAO.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockInputJson]);
    });

    it("should return an empty array when the DAO returns no records", async () => {
      (InputDAO.findMany as jest.Mock).mockResolvedValue([]);

      const result: InputJson[] = await InputService.getAllInputs();

      expect(result).toEqual([]);
    });
  });

  describe("getInputById", () => {
    it("should return the input json for the given id", async () => {
      (InputDAO.findById as jest.Mock).mockResolvedValue(mockInputJson);

      const result: InputJson | null = await InputService.getInputById("1");

      expect(InputDAO.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockInputJson);
    });
  });

  describe("getInputByName", () => {
    it("should return the input json for the given name", async () => {
      (InputDAO.findByName as jest.Mock).mockResolvedValue(mockInputJson);

      const result: InputJson | null = await InputService.getInputByName("test-json");

      expect(InputDAO.findByName).toHaveBeenCalledWith("test-json");
      expect(result).toEqual(mockInputJson);
    });
  });

  describe("createInput", () => {
    it("should create and return the new input json", async () => {
      const payload: InputJsonCreatePayload = {
        name: "new-json",
        content: { key: "value" },
        keys: ["key"],
        keysAndValues: { key: "value" },
      };
      (InputDAO.create as jest.Mock).mockResolvedValue(mockInputJson);

      const result: InputJson = await InputService.createInput(payload);

      expect(InputDAO.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockInputJson);
    });
  });

  describe("deleteInput", () => {
    it("should delete and return the input json for the given name", async () => {
      (InputDAO.deleteByName as jest.Mock).mockResolvedValue(mockInputJson);

      const result: InputJson = await InputService.deleteInput("test-json");

      expect(InputDAO.deleteByName).toHaveBeenCalledWith("test-json");
      expect(result).toEqual(mockInputJson);
    });
  });
});
