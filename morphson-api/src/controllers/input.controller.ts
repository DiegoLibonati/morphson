import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { InputService } from "@/services/input.service";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";
import { isEmptyObject } from "@/helpers/is_empty_object.helper";
import { getPeers } from "@/helpers/get_peers.helper";
import { isInteger } from "@/helpers/is_integer.helper";

import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";
import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";

export const InputController = {
  getAll: async (_: Request, res: Response): Promise<void> => {
    try {
      const inputJsons = await InputService.getAllInputs();

      res.status(200).json({
        code: CODES_SUCCESS.getAllInputJsons,
        message: MESSAGES_SUCCESS.getAllInputJsons,
        data: inputJsons,
      });
    } catch (e) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },
  getById: async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const idInputJson = req.params.id;

      if (!idInputJson || !isInteger(idInputJson)) {
        res.status(400).json({
          code: CODES_NOT.validInputJsonId,
          message: MESSAGES_NOT.validInputJsonId,
          data: null,
        });
        return;
      }

      const inputJson = await InputService.getInputById(idInputJson);

      res.status(200).json({
        code: CODES_SUCCESS.getInputJson,
        message: MESSAGES_SUCCESS.getInputJson,
        data: { inputJson },
      });
    } catch (e) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },
  upload: async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as { name: string; content: string };

      const name = body.name.trim();
      const contentStr = body.content.trim();

      if (!name) {
        res.status(400).json({
          code: CODES_NOT.validName,
          message: MESSAGES_NOT.validName,
        });
        return;
      }

      if (!contentStr || contentStr === "{}" || isEmptyObject(contentStr)) {
        res.status(400).json({
          code: CODES_NOT.validContent,
          message: MESSAGES_NOT.validContent,
          data: null,
        });
        return;
      }

      const content = JSON.parse(contentStr) as Record<string, unknown>;

      const keysAndValues = await getPeers(content);
      const keys = Object.keys(keysAndValues);

      const json = await InputService.createInput({
        name,
        content: content as unknown as Prisma.InputJsonValue,
        keys,
        keysAndValues: keysAndValues as unknown as Prisma.InputJsonValue,
      });

      res.status(201).json({
        code: CODES_SUCCESS.inputJsonUploaded,
        message: MESSAGES_SUCCESS.inputJsonUploaded,
        data: { inputJson: json },
      });
    } catch (e: unknown) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },
};
