import type { Request, Response } from "express";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";
import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";

export const FileController = {
  getContent: (req: Request, res: Response): void => {
    try {
      const file = req.file;

      if (!file) {
        res.status(404).json({
          code: CODES_NOT.foundFile,
          message: MESSAGES_NOT.foundFile,
        });
        return;
      }

      const content = file.buffer.toString("utf-8");

      res.status(200).json({
        code: CODES_SUCCESS.getFileContent,
        message: MESSAGES_SUCCESS.getFileContent,
        data: content,
      });
    } catch (e) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },
};
