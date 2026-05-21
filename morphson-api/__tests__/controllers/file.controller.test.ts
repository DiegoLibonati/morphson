import type { NextFunction, Request, Response } from "express";

import { FileController } from "@/controllers/file.controller";

import { NotFoundError } from "@/errors/not_found.error";

import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const buildNext = (): NextFunction => jest.fn();

describe("file.controller", () => {
  describe("getContent", () => {
    it("should return 200 with file content when file is present", () => {
      const fileContent = '{"hello":"world"}';
      const req = {
        file: { buffer: Buffer.from(fileContent) },
      } as unknown as Request;
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      FileController.getContent(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getFileContent,
        message: MESSAGES_SUCCESS.getFileContent,
        data: fileContent,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with NotFoundError when no file is attached", () => {
      const req = { file: undefined } as unknown as Request;
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      FileController.getContent(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.code).toBe(CODES_NOT.foundFile);
      expect(error.message).toBe(MESSAGES_NOT.foundFile);
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should call next when buffer.toString throws", () => {
      const error = new Error("Buffer error");
      const req = {
        file: {
          buffer: {
            toString: (): never => {
              throw error;
            },
          },
        },
      } as unknown as Request;
      const res: Response = buildRes();
      const next: NextFunction = buildNext();

      FileController.getContent(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
