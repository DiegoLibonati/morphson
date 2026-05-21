import type { NextFunction, Request, Response } from "express";
import type { OutputIdParams } from "@/types/zod";

import { OutputController } from "@/controllers/output.controller";

import { OutputService } from "@/services/output.service";

import { NotFoundError } from "@/errors/not_found.error";

import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";

import { mockOutputJson } from "@tests/__mocks__/outputJson.mock";

jest.mock("@/services/output.service");

const buildReq = <P extends Record<string, string> = Record<string, string>>(
  overrides: { params?: P; body?: unknown; query?: unknown } = {}
): Request<P> => {
  return { params: {} as P, query: {}, body: {}, ...overrides } as Request<P>;
};

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const buildNext = (): NextFunction => jest.fn();

describe("output.controller", () => {
  describe("getAll", () => {
    it("should return 200 with all output jsons", async () => {
      (OutputService.getAllOutputs as jest.Mock).mockResolvedValue([mockOutputJson]);
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await OutputController.getAll(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getAllOutputJsons,
        message: MESSAGES_SUCCESS.getAllOutputJsons,
        data: [mockOutputJson],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should forward to next when service throws", async () => {
      const dbError = new Error("DB error");
      (OutputService.getAllOutputs as jest.Mock).mockRejectedValue(dbError);
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await OutputController.getAll(req, res, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });

  describe("getById", () => {
    it("should return 200 with the output json when it exists", async () => {
      (OutputService.getOutputById as jest.Mock).mockResolvedValue(mockOutputJson);
      const req: Request<OutputIdParams> = buildReq<OutputIdParams>({
        params: { idOutputJson: "1" },
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await OutputController.getById(req, res, next);

      expect(OutputService.getOutputById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getOutputJson,
        message: MESSAGES_SUCCESS.getOutputJson,
        data: { outputJson: mockOutputJson },
      });
    });

    it("should forward NotFoundError to next when the output json does not exist", async () => {
      (OutputService.getOutputById as jest.Mock).mockResolvedValue(null);
      const req: Request<OutputIdParams> = buildReq<OutputIdParams>({
        params: { idOutputJson: "99999" },
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await OutputController.getById(req, res, next);

      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.code).toBe(CODES_NOT.foundOutputJson);
      expect(error.message).toBe(MESSAGES_NOT.foundOutputJson);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should forward to next when service throws", async () => {
      const dbError = new Error("DB error");
      (OutputService.getOutputById as jest.Mock).mockRejectedValue(dbError);
      const req: Request<OutputIdParams> = buildReq<OutputIdParams>({
        params: { idOutputJson: "1" },
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await OutputController.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });
});
