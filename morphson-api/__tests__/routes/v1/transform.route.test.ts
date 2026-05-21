import request from "supertest";

import type { Response } from "supertest";
import type { InputJson, OutputJson } from "@prisma/client";

import app from "@/app";

import { prisma } from "@/configs/prisma.config";

const baseUrl = "/api/v1/transform";

const seedInput = async (): Promise<InputJson> => {
  return prisma.inputJson.create({
    data: {
      name: "transform-template",
      content: { greeting: "input.name" },
      keys: ["name"],
      keysAndValues: { name: "World" },
    },
  });
};

describe("transform.route", () => {
  beforeEach(async (): Promise<void> => {
    await prisma.inputJson.deleteMany();
    await prisma.outputJson.deleteMany();
  });

  describe(`POST ${baseUrl}`, () => {
    it("should return 200 with a JSON file download when inputs are valid", async () => {
      const seeded: InputJson = await seedInput();

      const response: Response = await request(app)
        .post(baseUrl)
        .send({
          idInputJson: String(seeded.id),
          saveOutputJson: false,
          outputJsonNameToSave: "",
          contentJsonToTransform: JSON.stringify({ greeting: "input.name" }),
        });

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.headers["content-disposition"]).toContain("attachment");
      expect(response.headers["content-disposition"]).toContain(
        "transform-template_transformed.json"
      );
    });

    it("should save an OutputJson record when saveOutputJson is true", async () => {
      const seeded: InputJson = await seedInput();

      await request(app)
        .post(baseUrl)
        .send({
          idInputJson: String(seeded.id),
          saveOutputJson: true,
          outputJsonNameToSave: "saved-output",
          contentJsonToTransform: JSON.stringify({ greeting: "input.name" }),
        });

      const fromDb: OutputJson | null = await prisma.outputJson.findUnique({
        where: { name: "saved-output" },
      });
      expect(fromDb).not.toBeNull();
    });

    it("should not save an OutputJson record when saveOutputJson is false", async () => {
      const seeded: InputJson = await seedInput();

      await request(app)
        .post(baseUrl)
        .send({
          idInputJson: String(seeded.id),
          saveOutputJson: false,
          outputJsonNameToSave: "",
          contentJsonToTransform: JSON.stringify({ greeting: "input.name" }),
        });

      const count: number = await prisma.outputJson.count();
      expect(count).toBe(0);
    });

    it("should return 400 when idInputJson is not a valid integer", async () => {
      const response: Response = await request(app)
        .post(baseUrl)
        .send({
          idInputJson: "abc",
          saveOutputJson: false,
          outputJsonNameToSave: "",
          contentJsonToTransform: JSON.stringify({ greeting: "input.name" }),
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("NOT_VALID_INPUT_JSON_ID");
    });

    it("should return 400 when saveOutputJson is true but outputJsonNameToSave is empty", async () => {
      const response: Response = await request(app)
        .post(baseUrl)
        .send({
          idInputJson: "1",
          saveOutputJson: true,
          outputJsonNameToSave: "   ",
          contentJsonToTransform: JSON.stringify({ greeting: "input.name" }),
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("NOT_VALID_NAME");
    });

    it("should return 400 when contentJsonToTransform is '{}'", async () => {
      const response: Response = await request(app).post(baseUrl).send({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: "{}",
      });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("NOT_VALID_CONTENT");
    });

    it("should return 400 when contentJsonToTransform is empty", async () => {
      const response: Response = await request(app).post(baseUrl).send({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: "   ",
      });

      expect(response.status).toBe(400);
    });

    it("should return 404 when the referenced InputJson does not exist", async () => {
      const response: Response = await request(app)
        .post(baseUrl)
        .send({
          idInputJson: "99999",
          saveOutputJson: false,
          outputJsonNameToSave: "",
          contentJsonToTransform: JSON.stringify({ greeting: "input.name" }),
        });

      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND_INPUT_JSON");
    });
  });
});
