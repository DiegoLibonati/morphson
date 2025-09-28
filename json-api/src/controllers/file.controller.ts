import { Request, Response } from "express";

import { getExceptionMessage } from "@src/helpers/get_exception_message.helper";

import {
  MESSAGES_NOT,
  MESSAGES_SUCCESS,
} from "@src/constants/messages.constant";
import { CODES_NOT, CODES_SUCCESS } from "@src/constants/codes.constant";

export const FileController = {
  getContent: (req: Request, res: Response) => {
    try {
      const file = req.file;

      if (!file)
        return res.status(404).json({
          code: CODES_NOT.foundFile,
          message: MESSAGES_NOT.foundFile,
        });

      const content = file!.buffer.toString("utf-8");

      return res.status(200).json({
        code: CODES_SUCCESS.getFileContent,
        message: MESSAGES_SUCCESS.getFileContent,
        content: content,
      });
    } catch (e) {
      const response = getExceptionMessage(e);
      return res.status(500).json(response);
    }
  },
};
