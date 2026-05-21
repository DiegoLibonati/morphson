import type { NextFunction, Request, Response } from "express";
import type { OutputIdParams } from "@/types/zod";

import { OutputService } from "@/services/output.service";

import { NotFoundError } from "@/errors/not_found.error";

import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";
import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";

export const OutputController = {
  getAll: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const outputJsons = await OutputService.getAllOutputs();
      res.status(200).json({
        code: CODES_SUCCESS.getAllOutputJsons,
        message: MESSAGES_SUCCESS.getAllOutputJsons,
        data: outputJsons,
      });
    } catch (e) {
      next(e);
    }
  },

  getById: async (
    req: Request<OutputIdParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { idOutputJson } = req.params;
      const outputJson = await OutputService.getOutputById(idOutputJson);
      if (!outputJson)
        throw new NotFoundError(CODES_NOT.foundOutputJson, MESSAGES_NOT.foundOutputJson);
      res.status(200).json({
        code: CODES_SUCCESS.getOutputJson,
        message: MESSAGES_SUCCESS.getOutputJson,
        data: { outputJson },
      });
    } catch (e) {
      next(e);
    }
  },
};
