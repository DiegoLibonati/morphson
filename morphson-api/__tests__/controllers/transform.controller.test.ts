import fs from "fs";

import type { Request, Response } from "express";

import { TransformController } from "@/controllers/transform.controller";

import { InputService } from "@/services/input.service";
import { OutputService } from "@/services/output.service";

import { CODES_NOT } from "@/constants/codes.constant";

import { mockInputJson } from "@tests/__mocks__/inputJson.mock";

jest.mock("@/services/input.service");
jest.mock("@/services/output.service");

const buildReq = <P extends Record<string, string> = Record<string, string>>(
  overrides: { params?: P; body?: unknown; query?: unknown } = {}
): Request<P> => {
  return { params: {} as P, query: {}, body: {}, ...overrides } as Request<P>;
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
    it("should return 400 when idInputJson is not a valid integer", async () => {
      const req = buildReq({
        body: {
          idInputJson: "abc",
          saveOutputJson: false,
          outputJsonNameToSave: "",
          contentJsonToTransform: '{"greeting":"input.name"}',
        },
      });
      const res: Response = buildRes();

      await TransformController.transform(req, res);

      expect(InputService.getInputById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: CODES_NOT.validInputJsonId })
      );
    });

    it("should return 400 when idInputJson is zero", async () => {
      const req = buildReq({
        body: {
          idInputJson: "0",
          saveOutputJson: false,
          outputJsonNameToSave: "",
          contentJsonToTransform: '{"greeting":"input.name"}',
        },
      });
      const res: Response = buildRes();

      await TransformController.transform(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 when saveOutputJson is true but outputJsonNameToSave is empty", async () => {
      const req = buildReq({
        body: {
          idInputJson: "1",
          saveOutputJson: true,
          outputJsonNameToSave: "   ",
          contentJsonToTransform: '{"greeting":"input.name"}',
        },
      });
      const res: Response = buildRes();

      await TransformController.transform(req, res);

      expect(InputService.getInputById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: CODES_NOT.validName }));
    });

    it("should return 400 when contentJsonToTransform is empty", async () => {
      const req = buildReq({
        body: {
          idInputJson: "1",
          saveOutputJson: false,
          outputJsonNameToSave: "",
          contentJsonToTransform: "   ",
        },
      });
      const res: Response = buildRes();

      await TransformController.transform(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: CODES_NOT.validContent })
      );
    });

    it("should return 400 when contentJsonToTransform is '{}'", async () => {
      const req = buildReq({
        body: {
          idInputJson: "1",
          saveOutputJson: false,
          outputJsonNameToSave: "",
          contentJsonToTransform: "{}",
        },
      });
      const res: Response = buildRes();

      await TransformController.transform(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should transform and download the file when inputs are valid and saveOutputJson is false", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(mockInputJson);

      const req = buildReq({
        body: {
          idInputJson: "1",
          saveOutputJson: false,
          outputJsonNameToSave: "",
          contentJsonToTransform: '{"greeting":"input.name"}',
        },
      });
      const res: Response = buildRes();

      await TransformController.transform(req, res);

      expect(InputService.getInputById).toHaveBeenCalledWith("1");
      expect(OutputService.createOutput).not.toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.download).toHaveBeenCalled();
    });

    it("should call createOutput when saveOutputJson is true", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(mockInputJson);
      (OutputService.createOutput as jest.Mock).mockResolvedValue({});

      const req = buildReq({
        body: {
          idInputJson: "1",
          saveOutputJson: true,
          outputJsonNameToSave: "my-output",
          contentJsonToTransform: '{"greeting":"input.name"}',
        },
      });
      const res: Response = buildRes();

      await TransformController.transform(req, res);

      expect(OutputService.createOutput).toHaveBeenCalledWith({
        name: "my-output",
        transformationModel: { greeting: "input.name" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should delete the temp file after download via the callback", async () => {
      (InputService.getInputById as jest.Mock).mockResolvedValue(mockInputJson);

      const req = buildReq({
        body: {
          idInputJson: "1",
          saveOutputJson: false,
          outputJsonNameToSave: "",
          contentJsonToTransform: '{"greeting":"input.name"}',
        },
      });
      const res: Response = buildRes();

      await TransformController.transform(req, res);

      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it("should return 500 when service throws", async () => {
      (InputService.getInputById as jest.Mock).mockRejectedValue(new Error("DB error"));

      const req = buildReq({
        body: {
          idInputJson: "1",
          saveOutputJson: false,
          outputJsonNameToSave: "",
          contentJsonToTransform: '{"greeting":"input.name"}',
        },
      });
      const res: Response = buildRes();

      await TransformController.transform(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
