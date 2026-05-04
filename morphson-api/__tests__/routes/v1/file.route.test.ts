import request from "supertest";

import type { Response } from "supertest";

import app from "@/app";

describe("file.route", () => {
  const baseUrl = "/api/v1/file";

  describe("POST /api/v1/file/content", () => {
    it("should return 200 with file content when a valid JSON file is uploaded", async () => {
      const fileContent = '{"hello":"world"}';

      const response: Response = await request(app)
        .post(`${baseUrl}/content`)
        .attach("file", Buffer.from(fileContent), {
          filename: "test.json",
          contentType: "application/json",
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(fileContent);
      expect(response.body.code).toBe("SUCCESS_GET_FILE_CONTENT");
    });

    it("should return 404 when no file is attached", async () => {
      const response: Response = await request(app).post(`${baseUrl}/content`);

      expect(response.status).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND_FILE");
    });
  });
});
