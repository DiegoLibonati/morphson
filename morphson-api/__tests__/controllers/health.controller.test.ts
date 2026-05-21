import type { NextFunction, Request, Response } from "express";

import { HealthController } from "@/controllers/health.controller";

import { CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_SUCCESS } from "@/constants/messages.constant";

const buildReq = (): Request => ({}) as Request;

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const buildNext = (): NextFunction => jest.fn();

describe("health.controller", () => {
  describe("live", () => {
    it("should respond with 200 and the healthLive code", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      HealthController.live(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.healthLive,
        message: MESSAGES_SUCCESS.healthLive,
        data: null,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should forward to next when res.status throws", () => {
      const req: Request = buildReq();
      const error = new Error("status crashed");
      const res = {
        status: jest.fn(() => {
          throw error;
        }),
        json: jest.fn(),
      } as unknown as Response;
      const next: NextFunction = buildNext();

      HealthController.live(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("ready", () => {
    it("should respond with 200 and the healthReady code", () => {
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      HealthController.ready(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.healthReady,
        message: MESSAGES_SUCCESS.healthReady,
        data: null,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should forward to next when res.status throws", () => {
      const req: Request = buildReq();
      const error = new Error("status crashed");
      const res = {
        status: jest.fn(() => {
          throw error;
        }),
        json: jest.fn(),
      } as unknown as Response;
      const next: NextFunction = buildNext();

      HealthController.ready(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
