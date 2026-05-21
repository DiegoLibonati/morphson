import request from "supertest";

import type { Response } from "supertest";
import type { InputJson } from "@prisma/client";

import app from "@/app";

import { prisma } from "@/configs/prisma.config";

const baseUrl = "/api/v1/inputs";

const seedInput = async (
  overrides: Partial<{ name: string; content: object }> = {}
): Promise<InputJson> => {
  return prisma.inputJson.create({
    data: {
      name: overrides.name ?? "template",
      content: overrides.content ?? { field: "value" },
      keys: ["field"],
      keysAndValues: { field: "value" },
    },
  });
};

describe("input.route", () => {
  beforeEach(async (): Promise<void> => {
    await prisma.outputJson.deleteMany();
    await prisma.inputJson.deleteMany();
  });

  describe(`GET ${baseUrl}`, () => {
    it("should return 200 with an empty array when no records exist", async () => {
      const response: Response = await request(app).get(baseUrl);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.code).toBe("SUCCESS_GET_ALL_INPUT_JSONS");
    });

    it("should return 200 with all input jsons", async () => {
      await seedInput({ name: "template-1" });
      await seedInput({ name: "template-2" });

      const response: Response = await request(app).get(baseUrl);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe(`GET ${baseUrl}/:id`, () => {
    it("should return 200 with the input json when it exists", async () => {
      const created: InputJson = await seedInput();

      const response: Response = await request(app).get(`${baseUrl}/${created.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.inputJson.id).toBe(created.id);
      expect(response.body.code).toBe("SUCCESS_GET_INPUT_JSON");
    });

    it("should return 400 when id is not a valid integer", async () => {
      const response: Response = await request(app).get(`${baseUrl}/abc`);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("NOT_VALID_INPUT_JSON_ID");
    });

    it("should return 400 when id is zero", async () => {
      const response: Response = await request(app).get(`${baseUrl}/0`);

      expect(response.status).toBe(400);
    });

    it("should return 404 when the record does not exist", async () => {
      const response: Response = await request(app).get(`${baseUrl}/99999`);

      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND_INPUT_JSON");
    });
  });

  describe(`POST ${baseUrl}`, () => {
    it("should return 201 with the created input json", async () => {
      const payload: { name: string; content: string } = {
        name: "new-template",
        content: JSON.stringify({ firstName: "John", age: 30 }),
      };

      const response: Response = await request(app).post(baseUrl).send(payload);

      expect(response.status).toBe(201);
      expect(response.body.code).toBe("SUCCESS_INPUT_JSON_UPLOADED");
      expect(response.body.data.inputJson.name).toBe("new-template");

      const fromDb: InputJson | null = await prisma.inputJson.findUnique({
        where: { name: "new-template" },
      });
      expect(fromDb).not.toBeNull();
    });

    it("should return 400 when name is empty", async () => {
      const response: Response = await request(app)
        .post(baseUrl)
        .send({ name: "   ", content: '{"key":"value"}' });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("NOT_VALID_NAME");

      const count: number = await prisma.inputJson.count();
      expect(count).toBe(0);
    });

    it("should return 400 when content is '{}'", async () => {
      const response: Response = await request(app)
        .post(baseUrl)
        .send({ name: "test", content: "{}" });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("NOT_VALID_CONTENT");
    });

    it("should return 400 when content is an empty string", async () => {
      const response: Response = await request(app)
        .post(baseUrl)
        .send({ name: "test", content: "   " });

      expect(response.status).toBe(400);
    });
  });
});
