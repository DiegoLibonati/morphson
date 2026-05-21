import type { NextFunction, Request, Response } from "express";
import type { InputCreateBody, InputIdParams } from "@/types/zod";

import { InputController } from "@/controllers/input.controller";

import { InputService } from "@/services/input.service";

import { NotFoundError } from "@/errors/not_found.error";

import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";

import { mockInputJson } from "@tests/__mocks__/inputJson.mock";

jest.mock("@/services/input.service");

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

describe("input.controller", () => {
  describe("getAll", () => {
    it("should return 200 with all input jsons", async () => {
      (InputService.getAllInputs as jest.Mock).mockResolvedValue([mockInputJson]);
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InputController.getAll(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getAllInputJsons,
        message: MESSAGES_SUCCESS.getAllInputJsons,
        data: [mockInputJson],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should forward to next when service throws", async () => {
      const dbError = new Error("DB error");
      (InputService.getAllInputs as jest.Mock).mockRejectedValue(dbError);
      const req: Request = buildReq();
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InputController.getAll(req, res, next);

      expect(next).toHaveBeenCalledWith(dbError);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("should return 200 with the input json when it exists", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(mockInputJson);
      const req: Request<InputIdParams> = buildReq<InputIdParams>({
        params: { idInputJson: "1" },
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InputController.getById(req, res, next);

      expect(InputService.getInputById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getInputJson,
        message: MESSAGES_SUCCESS.getInputJson,
        data: { inputJson: mockInputJson },
      });
    });

    it("should forward NotFoundError to next when the input json does not exist", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(null);
      const req: Request<InputIdParams> = buildReq<InputIdParams>({
        params: { idInputJson: "99999" },
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InputController.getById(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.code).toBe(CODES_NOT.foundInputJson);
      expect(error.message).toBe(MESSAGES_NOT.foundInputJson);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should forward to next when service throws", async () => {
      const dbError = new Error("DB error");
      (InputService.getInputById as jest.Mock).mockRejectedValue(dbError);
      const req: Request<InputIdParams> = buildReq<InputIdParams>({
        params: { idInputJson: "1" },
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InputController.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });

  describe("upload", () => {
    it("should return 201 with the created input json for valid input", async () => {
      (InputService.createInput as jest.Mock).mockResolvedValue(mockInputJson);
      const body: InputCreateBody = {
        name: "test-json",
        content: '{"key":"value"}',
      };
      const req: Request = buildReq({ body });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InputController.upload(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.inputJsonUploaded,
        message: MESSAGES_SUCCESS.inputJsonUploaded,
        data: { inputJson: mockInputJson },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should compute flattened keys and pass them to the service", async () => {
      (InputService.createInput as jest.Mock).mockResolvedValue(mockInputJson);
      const body: InputCreateBody = {
        name: "nested",
        content: JSON.stringify({ a: { b: "c" }, top: 1 }),
      };
      const req: Request = buildReq({ body });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InputController.upload(req, res, next);

      expect(InputService.createInput).toHaveBeenCalledWith({
        name: "nested",
        content: { a: { b: "c" }, top: 1 },
        keys: ["a.b", "top"],
        keysAndValues: { "a.b": "c", top: 1 },
      });
    });

    it("should forward to next when content is not valid JSON", async () => {
      const body: InputCreateBody = {
        name: "broken",
        content: "not-json",
      };
      const req: Request = buildReq({ body });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InputController.upload(req, res, next);

      expect(InputService.createInput).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect((next as jest.Mock).mock.calls[0][0]).toBeInstanceOf(SyntaxError);
    });

    it("should forward to next when service throws", async () => {
      const dbError = new Error("DB error");
      (InputService.createInput as jest.Mock).mockRejectedValue(dbError);
      const body: InputCreateBody = { name: "x", content: '{"key":"value"}' };
      const req: Request = buildReq({ body });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await InputController.upload(req, res, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });
  });
});
