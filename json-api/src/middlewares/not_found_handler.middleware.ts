import { Request, Response } from "express";

import { MESSAGES_NOT } from "@src/constants/messages.constant";
import { CODES_NOT } from "@src/constants/codes.constant";

export const notFoundHandler = (_: Request, res: Response) => {
  res
    .status(404)
    .json({ code: CODES_NOT.foundRoute, message: MESSAGES_NOT.foundRoute });
};
