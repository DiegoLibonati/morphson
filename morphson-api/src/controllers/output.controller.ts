import type { Request, Response } from "express";

import { OutputService } from "@/services/output.service";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";
import { isInteger } from "@/helpers/is_integer.helper";

import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";
import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";

export const OutputController = {
  getAll: async (_: Request, res: Response): Promise<void> => {
    try {
      const outputJsons = await OutputService.getAllOutputs();

      res.status(200).json({
        code: CODES_SUCCESS.getAllOutputJsons,
        message: MESSAGES_SUCCESS.getAllOutputJsons,
        data: outputJsons,
      });
    } catch (e) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },
  getById: async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const idOutputJson = req.params.id;

      if (!idOutputJson || !isInteger(idOutputJson)) {
        res.status(400).json({
          code: CODES_NOT.validOutputJsonId,
          message: MESSAGES_NOT.validOutputJsonId,
          data: null,
        });
        return;
      }

      const outputJson = await OutputService.getOutputById(idOutputJson);

      res.status(200).json({
        code: CODES_SUCCESS.getOutputJson,
        message: MESSAGES_SUCCESS.getOutputJson,
        data: { outputJson },
      });
    } catch (e) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },
};
