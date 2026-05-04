import type { Request, Response } from "express";

import { FileController } from "@/controllers/file.controller";

import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";
import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("file.controller", () => {
  describe("getContent", () => {
    it("should return 200 with file content when file is present", () => {
      const fileContent = '{"hello":"world"}';
      const req = {
        file: { buffer: Buffer.from(fileContent) },
      } as unknown as Request;
      const res: Response = buildRes();

      FileController.getContent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_SUCCESS.getFileContent,
        message: MESSAGES_SUCCESS.getFileContent,
        data: fileContent,
      });
    });

    it("should return 404 when no file is attached to the request", () => {
      const req = { file: undefined } as unknown as Request;
      const res: Response = buildRes();

      FileController.getContent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.foundFile,
        message: MESSAGES_NOT.foundFile,
      });
    });

    it("should return 500 when buffer.toString throws", () => {
      const req = {
        file: {
          buffer: {
            toString: (): never => {
              throw new Error("Buffer error");
            },
          },
        },
      } as unknown as Request;
      const res: Response = buildRes();

      FileController.getContent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
