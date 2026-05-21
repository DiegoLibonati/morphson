import type { NextFunction, Request, Response } from "express";

import { NotFoundError } from "@/errors/not_found.error";

import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";
import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";

export const FileController = {
  getContent: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const file = req.file;
      if (!file) throw new NotFoundError(CODES_NOT.foundFile, MESSAGES_NOT.foundFile);
      const content = file.buffer.toString("utf-8");
      res.status(200).json({
        code: CODES_SUCCESS.getFileContent,
        message: MESSAGES_SUCCESS.getFileContent,
        data: content,
      });
    } catch (e) {
      next(e);
    }
  },
};
