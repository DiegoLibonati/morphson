import type { OutputJson } from "@prisma/client";
import type { OutputJsonCreatePayload } from "@/types/payloads";

import { OutputService } from "@/services/output.service";

import { OutputDAO } from "@/daos/output.dao";

import { mockOutputJson } from "@tests/__mocks__/outputJson.mock";

jest.mock("@/daos/output.dao");

describe("output.service", () => {
  describe("getAllOutputs", () => {
    it("should return all output jsons from the DAO", async () => {
      (OutputDAO.findMany as jest.Mock).mockResolvedValue([mockOutputJson]);

      const result: OutputJson[] = await OutputService.getAllOutputs();

      expect(OutputDAO.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockOutputJson]);
    });

    it("should return an empty array when the DAO returns no records", async () => {
      (OutputDAO.findMany as jest.Mock).mockResolvedValue([]);

      const result: OutputJson[] = await OutputService.getAllOutputs();

      expect(result).toEqual([]);
    });
  });

  describe("getOutputById", () => {
    it("should return the output json for the given id", async () => {
      (OutputDAO.findById as jest.Mock).mockResolvedValue(mockOutputJson);

      const result: OutputJson | null = await OutputService.getOutputById("1");

      expect(OutputDAO.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockOutputJson);
    });
  });

  describe("getOutputByName", () => {
    it("should return the output json for the given name", async () => {
      (OutputDAO.findByName as jest.Mock).mockResolvedValue(mockOutputJson);

      const result: OutputJson | null = await OutputService.getOutputByName("test-output");

      expect(OutputDAO.findByName).toHaveBeenCalledWith("test-output");
      expect(result).toEqual(mockOutputJson);
    });
  });

  describe("createOutput", () => {
    it("should create and return the new output json", async () => {
      const payload: OutputJsonCreatePayload = {
        name: "new-output",
        transformationModel: { firstName: "input.name" },
      };
      (OutputDAO.create as jest.Mock).mockResolvedValue(mockOutputJson);

      const result: OutputJson = await OutputService.createOutput(payload);

      expect(OutputDAO.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockOutputJson);
    });
  });

  describe("deleteOutput", () => {
    it("should delete and return the output json for the given name", async () => {
      (OutputDAO.deleteByName as jest.Mock).mockResolvedValue(mockOutputJson);

      const result: OutputJson = await OutputService.deleteOutput("test-output");

      expect(OutputDAO.deleteByName).toHaveBeenCalledWith("test-output");
      expect(result).toEqual(mockOutputJson);
    });
  });
});
