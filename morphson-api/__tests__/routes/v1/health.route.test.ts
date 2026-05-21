import request from "supertest";

import type { Response } from "supertest";

import app from "@/app";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

describe("health.route", () => {
  const baseUrl = "/api/v1/health";

  describe(`GET ${baseUrl}/live`, () => {
    it("should return 200 with the healthLive code and message", async () => {
      const response: Response = await request(app).get(`${baseUrl}/live`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.healthLive,
        message: MESSAGES_SUCCESS.healthLive,
        data: null,
      });
    });
  });

  describe(`GET ${baseUrl}/ready`, () => {
    it("should return 200 with the healthReady code and message", async () => {
      const response: Response = await request(app).get(`${baseUrl}/ready`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        code: CODES_SUCCESS.healthReady,
        message: MESSAGES_SUCCESS.healthReady,
        data: null,
      });
    });
  });

  describe(`GET ${baseUrl}/unknown`, () => {
    it("should return 404 when the sub-path is not defined", async () => {
      const response: Response = await request(app).get(`${baseUrl}/unknown`);

      expect(response.status).toBe(404);
    });
  });
});
