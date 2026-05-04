import type { Request, Response } from "express";

import { OutputController } from "@/controllers/output.controller";

import { OutputService } from "@/services/output.service";

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

describe("output.controller", () => {
  describe("getAll", () => {
    it("should return 200 with all output jsons", async () => {
      (OutputService.getAllOutputs as jest.Mock).mockResolvedValue([mockOutputJson]);
      const req = buildReq();
      const res: Response = buildRes();

      await OutputController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getAllOutputJsons,
        message: MESSAGES_SUCCESS.getAllOutputJsons,
        data: [mockOutputJson],
      });
    });

    it("should return 500 when service throws", async () => {
      (OutputService.getAllOutputs as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = buildReq();
      const res: Response = buildRes();

      await OutputController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getById", () => {
    it("should return 200 with the output json for a valid integer id", async () => {
      (OutputService.getOutputById as jest.Mock).mockResolvedValue(mockOutputJson);
      const req = buildReq({ params: { id: "1" } });
      const res: Response = buildRes();

      await OutputController.getById(req, res);

      expect(OutputService.getOutputById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getOutputJson,
        message: MESSAGES_SUCCESS.getOutputJson,
        data: { outputJson: mockOutputJson },
      });
    });

    it("should return 400 when id is not a valid integer", async () => {
      const req = buildReq({ params: { id: "abc" } });
      const res: Response = buildRes();

      await OutputController.getById(req, res);

      expect(OutputService.getOutputById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validOutputJsonId,
        message: MESSAGES_NOT.validOutputJsonId,
        data: null,
      });
    });

    it("should return 400 when id is zero", async () => {
      const req = buildReq({ params: { id: "0" } });
      const res: Response = buildRes();

      await OutputController.getById(req, res);

      expect(OutputService.getOutputById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 when id is a float", async () => {
      const req = buildReq({ params: { id: "1.5" } });
      const res: Response = buildRes();

      await OutputController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 when service throws", async () => {
      (OutputService.getOutputById as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = buildReq({ params: { id: "1" } });
      const res: Response = buildRes();

      await OutputController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
