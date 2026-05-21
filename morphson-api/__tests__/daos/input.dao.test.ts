import { Prisma } from "@prisma/client";

import type { InputJson } from "@prisma/client";
import type { InputJsonCreatePayload } from "@/types/zod";

import { InputDAO } from "@/daos/input.dao";

import { prisma } from "@/configs/prisma.config";

const validPayload: InputJsonCreatePayload = {
  name: "test-json",
  content: { key: "value" },
  keys: ["key"],
  keysAndValues: { key: "value" },
};

describe("input.dao", () => {
  beforeEach(async (): Promise<void> => {
    await prisma.inputJson.deleteMany();
  });

  describe("findMany", () => {
    it("should return an empty array when no records exist", async () => {
      const result: InputJson[] = await InputDAO.findMany();

      expect(result).toEqual([]);
    });

    it("should return all input json records", async () => {
      await prisma.inputJson.create({ data: validPayload });
      await prisma.inputJson.create({ data: { ...validPayload, name: "test-json-2" } });

      const result: InputJson[] = await InputDAO.findMany();

      expect(result).toHaveLength(2);
    });
  });

  describe("findById", () => {
    it("should return the record when it exists", async () => {
      const created: InputJson = await prisma.inputJson.create({ data: validPayload });

      const result: InputJson | null = await InputDAO.findById(String(created.id));

      expect(result).not.toBeNull();
      expect(result!.id).toBe(created.id);
      expect(result!.name).toBe(validPayload.name);
    });

    it("should return null when no record exists with that id", async () => {
      const result: InputJson | null = await InputDAO.findById("99999");

      expect(result).toBeNull();
    });
  });

  describe("findByName", () => {
    it("should return the record when it exists by name", async () => {
      await prisma.inputJson.create({ data: validPayload });

      const result: InputJson | null = await InputDAO.findByName(validPayload.name);

      expect(result).not.toBeNull();
      expect(result!.name).toBe(validPayload.name);
    });

    it("should return null when no record has the given name", async () => {
      const result: InputJson | null = await InputDAO.findByName("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should insert and return the record with a generated id and timestamps", async () => {
      const result: InputJson = await InputDAO.create(validPayload);

      expect(result.id).toEqual(expect.any(Number));
      expect(result.name).toBe(validPayload.name);
      expect(result.keys).toEqual(validPayload.keys);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it("should persist the record to the database", async () => {
      const created: InputJson = await InputDAO.create(validPayload);

      const fromDb: InputJson | null = await prisma.inputJson.findUnique({
        where: { id: created.id },
      });

      expect(fromDb).not.toBeNull();
      expect(fromDb?.name).toBe(validPayload.name);
    });

    it("should throw a P2002 error when creating a record with a duplicate name", async () => {
      await prisma.inputJson.create({ data: validPayload });

      try {
        await InputDAO.create(validPayload);
        fail("Expected to throw");
      } catch (error) {
        expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2002");
      }
    });
  });

  describe("deleteByName", () => {
    it("should delete the record and return it", async () => {
      await prisma.inputJson.create({ data: validPayload });

      const result: InputJson = await InputDAO.deleteByName(validPayload.name);

      expect(result.name).toBe(validPayload.name);

      const fromDb: InputJson | null = await prisma.inputJson.findUnique({
        where: { name: validPayload.name },
      });
      expect(fromDb).toBeNull();
    });

    it("should throw a P2025 error when deleting a record that does not exist", async () => {
      try {
        await InputDAO.deleteByName("nonexistent");
        fail("Expected to throw");
      } catch (error) {
        expect(error).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        expect((error as Prisma.PrismaClientKnownRequestError).code).toBe("P2025");
      }
    });
  });
});
