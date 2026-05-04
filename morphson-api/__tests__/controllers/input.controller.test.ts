import type { Request, Response } from "express";

import { InputController } from "@/controllers/input.controller";

import { InputService } from "@/services/input.service";

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

describe("input.controller", () => {
  describe("getAll", () => {
    it("should return 200 with all input jsons", async () => {
      (InputService.getAllInputs as jest.Mock).mockResolvedValue([mockInputJson]);
      const req = buildReq();
      const res: Response = buildRes();

      await InputController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getAllInputJsons,
        message: MESSAGES_SUCCESS.getAllInputJsons,
        data: [mockInputJson],
      });
    });

    it("should return 500 when service throws", async () => {
      (InputService.getAllInputs as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = buildReq();
      const res: Response = buildRes();

      await InputController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getById", () => {
    it("should return 200 with the input json for a valid integer id", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(mockInputJson);
      const req = buildReq({ params: { id: "1" } });
      const res: Response = buildRes();

      await InputController.getById(req, res);

      expect(InputService.getInputById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getInputJson,
        message: MESSAGES_SUCCESS.getInputJson,
        data: { inputJson: mockInputJson },
      });
    });

    it("should return 400 when id is not a valid integer", async () => {
      const req = buildReq({ params: { id: "abc" } });
      const res: Response = buildRes();

      await InputController.getById(req, res);

      expect(InputService.getInputById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validInputJsonId,
        message: MESSAGES_NOT.validInputJsonId,
        data: null,
      });
    });

    it("should return 400 when id is zero", async () => {
      const req = buildReq({ params: { id: "0" } });
      const res: Response = buildRes();

      await InputController.getById(req, res);

      expect(InputService.getInputById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 when id is negative", async () => {
      const req = buildReq({ params: { id: "-1" } });
      const res: Response = buildRes();

      await InputController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 when service throws", async () => {
      (InputService.getInputById as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = buildReq({ params: { id: "1" } });
      const res: Response = buildRes();

      await InputController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("upload", () => {
    it("should return 201 with the created input json for valid input", async () => {
      (InputService.createInput as jest.Mock).mockResolvedValue(mockInputJson);
      const req = buildReq({
        body: { name: "test-json", content: '{"key":"value"}' },
      });
      const res: Response = buildRes();

      await InputController.upload(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: CODES_SUCCESS.inputJsonUploaded,
          message: MESSAGES_SUCCESS.inputJsonUploaded,
        })
      );
    });

    it("should return 400 when name is empty after trim", async () => {
      const req = buildReq({ body: { name: "   ", content: '{"key":"value"}' } });
      const res: Response = buildRes();

      await InputController.upload(req, res);

      expect(InputService.createInput).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.validName,
        message: MESSAGES_NOT.validName,
      });
    });

    it("should return 400 when content is an empty string after trim", async () => {
      const req = buildReq({ body: { name: "test", content: "   " } });
      const res: Response = buildRes();

      await InputController.upload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: CODES_NOT.validContent })
      );
    });

    it("should return 400 when content is '{}'", async () => {
      const req = buildReq({ body: { name: "test", content: "{}" } });
      const res: Response = buildRes();

      await InputController.upload(req, res);

      expect(InputService.createInput).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 when content is an empty object with spaces", async () => {
      const req = buildReq({ body: { name: "test", content: "{  }" } });
      const res: Response = buildRes();

      await InputController.upload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 when service throws", async () => {
      (InputService.createInput as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = buildReq({ body: { name: "test", content: '{"key":"value"}' } });
      const res: Response = buildRes();

      await InputController.upload(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
