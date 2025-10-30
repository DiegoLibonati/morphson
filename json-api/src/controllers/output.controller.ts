import { Request, Response } from "express";

import { OutputService } from "@src/services/output.service";

import { getExceptionMessage } from "@src/helpers/get_exception_message.helper";
import { isInteger } from "@src/helpers/is_integer.helper";

import {
  MESSAGES_NOT,
  MESSAGES_SUCCESS,
} from "@src/constants/messages.constant";
import { CODES_NOT, CODES_SUCCESS } from "@src/constants/codes.constant";

export const OutputController = {
  getAll: async (_: Request, res: Response) => {
    try {
      const outputJsons = await OutputService.getAllOutputs();

      res.status(200).json({
        code: CODES_SUCCESS.getAllOutputJsons,
        message: MESSAGES_SUCCESS.getAllOutputJsons,
        data: outputJsons,
      });
    } catch (e) {
      const response = getExceptionMessage(e);
      res.status(500).json(response);
    }
  },
  getById: async (req: Request, res: Response) => {
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

      if (!outputJson) {
        res.status(404).json({
          code: CODES_NOT.foundOutputJson,
          message: MESSAGES_NOT.foundOutputJson,
          data: null,
        });
        return;
      }

      res.status(200).json({
        code: CODES_SUCCESS.getOutputJson,
        message: MESSAGES_SUCCESS.getOutputJson,
        data: {
          outputJson: outputJson,
        },
      });
    } catch (e) {
      const response = getExceptionMessage(e);
      res.status(500).json(response);
    }
  },
};
