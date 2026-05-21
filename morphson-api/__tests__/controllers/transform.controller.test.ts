import fs from "fs";

import type { NextFunction, Request, Response } from "express";

import { TransformController } from "@/controllers/transform.controller";

import { InputService } from "@/services/input.service";
import { OutputService } from "@/services/output.service";

import { NotFoundError } from "@/errors/not_found.error";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

import { mockInputJson } from "@tests/__mocks__/inputJson.mock";

jest.mock("@/services/input.service");
jest.mock("@/services/output.service");

const buildReq = (body: unknown): Request => {
  return { params: {}, query: {}, body } as Request;
};

const buildRes = (): Response => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
    setHeader: jest.fn(),
    download: jest.fn(),
  } as unknown as Response;
  (res.status as jest.Mock).mockReturnValue(res);
  (res.json as jest.Mock).mockReturnValue(res);
  (res.setHeader as jest.Mock).mockReturnValue(res);
  (res.download as jest.Mock).mockImplementation((_: string, cb: () => void) => {
    if (typeof cb === "function") cb();
  });
  return res;
};

const buildNext = (): NextFunction => jest.fn();

describe("transform.controller", () => {
  beforeEach((): void => {
    jest.spyOn(fs, "writeFileSync").mockImplementation((): void => {
      // Empty fn
    });
    jest.spyOn(fs, "unlinkSync").mockImplementation((): void => {
      // Empty fn
    });
  });

  describe("transform", () => {
    it("should transform and download the file when inputs are valid and saveOutputJson is false", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(mockInputJson);
      const req: Request = buildReq({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: '{"greeting":"input.key"}',
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await TransformController.transform(req, res, next);

      expect(InputService.getInputById).toHaveBeenCalledWith("1");
      expect(OutputService.createOutput).not.toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.download).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("should call createOutput when saveOutputJson is true and a name is provided", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(mockInputJson);
      (OutputService.createOutput as jest.Mock).mockResolvedValue({});
      const req: Request = buildReq({
        idInputJson: "1",
        saveOutputJson: true,
        outputJsonNameToSave: "my-output",
        contentJsonToTransform: '{"greeting":"input.key"}',
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await TransformController.transform(req, res, next);

      expect(OutputService.createOutput).toHaveBeenCalledWith({
        name: "my-output",
        transformationModel: { greeting: "input.key" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should not call createOutput when saveOutputJson is false even if a name is provided", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(mockInputJson);
      const req: Request = buildReq({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "ignored",
        contentJsonToTransform: '{"greeting":"input.key"}',
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await TransformController.transform(req, res, next);

      expect(OutputService.createOutput).not.toHaveBeenCalled();
    });

    it("should set the Content-Disposition and Content-Type headers", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(mockInputJson);
      const req: Request = buildReq({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: '{"greeting":"input.key"}',
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await TransformController.transform(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith(
        "Content-Disposition",
        `attachment; filename=${mockInputJson.name}_transformed.json`
      );
      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
    });

    it("should delete the temp file after download via the callback", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(mockInputJson);
      const req: Request = buildReq({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: '{"greeting":"input.key"}',
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await TransformController.transform(req, res, next);

      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it("should forward NotFoundError to next when the input json does not exist", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(null);
      const req: Request = buildReq({
        idInputJson: "99999",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: '{"greeting":"input.key"}',
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await TransformController.transform(req, res, next);

      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.code).toBe(CODES_NOT.foundInputJson);
      expect(error.message).toBe(MESSAGES_NOT.foundInputJson);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should forward to next when service throws", async () => {
      const dbError = new Error("DB error");
      (InputService.getInputById as jest.Mock).mockRejectedValue(dbError);
      const req: Request = buildReq({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: '{"greeting":"input.key"}',
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await TransformController.transform(req, res, next);

      expect(next).toHaveBeenCalledWith(dbError);
    });

    it("should forward SyntaxError to next when contentJsonToTransform is not valid JSON", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(mockInputJson);
      const req: Request = buildReq({
        idInputJson: "1",
        saveOutputJson: false,
        outputJsonNameToSave: "",
        contentJsonToTransform: "not-json",
      });
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      await TransformController.transform(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect((next as jest.Mock).mock.calls[0][0]).toBeInstanceOf(SyntaxError);
    });
  });
});
