import request from "supertest";

import type { Response } from "supertest";
import type { OutputJson } from "@prisma/client";

import app from "@/app";

import { prisma } from "@/configs/prisma.config";

const baseUrl = "/api/v1/outputs";

const seedOutput = async (name = "test-output"): Promise<OutputJson> => {
  return prisma.outputJson.create({
    data: {
      name,
      transformationModel: { firstName: "input.name" },
    },
  });
};

describe("output.route", () => {
  beforeEach(async (): Promise<void> => {
    await prisma.outputJson.deleteMany();
    await prisma.inputJson.deleteMany();
  });

  describe(`GET ${baseUrl}`, () => {
    it("should return 200 with an empty array when no records exist", async () => {
      const response: Response = await request(app).get(baseUrl);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.code).toBe("SUCCESS_GET_ALL_OUTPUT_JSONS");
    });

    it("should return 200 with all output jsons", async () => {
      await seedOutput("output-1");
      await seedOutput("output-2");

      const response: Response = await request(app).get(baseUrl);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe(`GET ${baseUrl}/:id`, () => {
    it("should return 200 with the output json when it exists", async () => {
      const created: OutputJson = await seedOutput();

      const response: Response = await request(app).get(`${baseUrl}/${created.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.outputJson.id).toBe(created.id);
      expect(response.body.code).toBe("SUCCESS_GET_OUTPUT_JSON");
    });

    it("should return 400 when id is not a valid integer", async () => {
      const response: Response = await request(app).get(`${baseUrl}/abc`);

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("NOT_VALID_OUTPUT_JSON_ID");
    });

    it("should return 400 when id is zero", async () => {
      const response: Response = await request(app).get(`${baseUrl}/0`);

      expect(response.status).toBe(400);
    });

    it("should return 404 when the record does not exist", async () => {
      const response: Response = await request(app).get(`${baseUrl}/99999`);

      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND_OUTPUT_JSON");
    });
  });
});
