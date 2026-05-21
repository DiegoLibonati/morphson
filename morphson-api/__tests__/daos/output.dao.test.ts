import { Prisma } from "@prisma/client";

import type { OutputJson } from "@prisma/client";
import type { OutputJsonCreatePayload } from "@/types/zod";

import { prisma } from "@/configs/prisma.config";

import { OutputDAO } from "@/daos/output.dao";

const validPayload: OutputJsonCreatePayload = {
  name: "test-output",
  transformationModel: { firstName: "input.name" },
};

describe("output.dao", () => {
  beforeEach(async (): Promise<void> => {
    await prisma.outputJson.deleteMany();
  });

  describe("findMany", () => {
    it("should return an empty array when no records exist", async () => {
      const result: OutputJson[] = await OutputDAO.findMany();

      expect(result).toEqual([]);
    });

    it("should return all output json records", async () => {
      await prisma.outputJson.create({ data: validPayload });
      await prisma.outputJson.create({ data: { ...validPayload, name: "test-output-2" } });

      const result: OutputJson[] = await OutputDAO.findMany();

      expect(result).toHaveLength(2);
    });
  });

  describe("findById", () => {
    it("should return the record when it exists", async () => {
      const created: OutputJson = await prisma.outputJson.create({ data: validPayload });

      const result: OutputJson | null = await OutputDAO.findById(String(created.id));

      expect(result).not.toBeNull();
      expect(result!.id).toBe(created.id);
      expect(result!.name).toBe(validPayload.name);
    });

    it("should return null when no record exists with that id", async () => {
      const result: OutputJson | null = await OutputDAO.findById("99999");

      expect(result).toBeNull();
    });
  });

  describe("findByName", () => {
    it("should return the record when it exists by name", async () => {
      await prisma.outputJson.create({ data: validPayload });

      const result: OutputJson | null = await OutputDAO.findByName(validPayload.name);

      expect(result).not.toBeNull();
      expect(result!.name).toBe(validPayload.name);
    });

    it("should return null when no record has the given name", async () => {
      const result: OutputJson | null = await OutputDAO.findByName("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should insert and return the record with a generated id and timestamps", async () => {
      const result: OutputJson = await OutputDAO.create(validPayload);

      expect(result.id).toEqual(expect.any(Number));
      expect(result.name).toBe(validPayload.name);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it("should persist the record to the database", async () => {
      const created: OutputJson = await OutputDAO.create(validPayload);

      const fromDb: OutputJson | null = await prisma.outputJson.findUnique({
        where: { id: created.id },
      });

      expect(fromDb).not.toBeNull();
      expect(fromDb?.name).toBe(validPayload.name);
    });

    it("should throw a P2002 error when creating a record with a duplicate name", async () => {
      await prisma.outputJson.create({ data: validPayload });

      try {
        await OutputDAO.create(validPayload);
        fail("Expected to throw");
      } catch (error) {
        expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2002");
      }
    });
  });

  describe("deleteByName", () => {
    it("should delete the record and return it", async () => {
      await prisma.outputJson.create({ data: validPayload });

      const result: OutputJson = await OutputDAO.deleteByName(validPayload.name);

      expect(result.name).toBe(validPayload.name);

      const fromDb: OutputJson | null = await prisma.outputJson.findUnique({
        where: { name: validPayload.name },
      });
      expect(fromDb).toBeNull();
    });

    it("should throw a P2025 error when deleting a record that does not exist", async () => {
      try {
        await OutputDAO.deleteByName("nonexistent");
        fail("Expected to throw");
      } catch (error) {
        expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2025");
      }
    });
  });
});
