import { Request, Response, NextFunction } from "express";

import { CODES_ERROR } from "@src/constants/codes.constant";
import { MESSAGES_ERROR } from "@src/constants/messages.constant";

export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic });
};
