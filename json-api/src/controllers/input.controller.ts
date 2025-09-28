import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

import { InputService } from "@src/services/input.service";

import { getExceptionMessage } from "@src/helpers/get_exception_message.helper";
import { isEmptyObject } from "@src/helpers/is_empty_object.helper";
import { getPeers } from "@src/helpers/get_peers.helper";
import { isInteger } from "@src/helpers/is_integer.helper";

import {
  MESSAGES_NOT,
  MESSAGES_SUCCESS,
} from "@src/constants/messages.constant";
import { CODES_NOT, CODES_SUCCESS } from "@src/constants/codes.constant";

export const InputController = {
  getAll: async (_: Request, res: Response) => {
    try {
      const inputJsons = await InputService.getAllInputs();

      return res.status(200).json({
        code: CODES_SUCCESS.getAllInputJsons,
        message: MESSAGES_SUCCESS.getAllInputJsons,
        data: inputJsons,
      });
    } catch (e) {
      const response = getExceptionMessage(e);
      return res.status(500).json(response);
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const idInputJson = req.params.id;

      if (!idInputJson || !isInteger(idInputJson)) {
        return res.status(400).json({
          code: CODES_NOT.validInputJsonId,
          message: MESSAGES_NOT.validInputJsonId,
          data: null,
        });
      }

      const inputJson = await InputService.getInputById(idInputJson);

      if (!inputJson) {
        return res.status(404).json({
          code: CODES_NOT.foundInputJson,
          message: MESSAGES_NOT.foundInputJson,
          data: null,
        });
      }

      return res.status(200).json({
        code: CODES_SUCCESS.getInputJson,
        message: MESSAGES_SUCCESS.getInputJson,
        data: {
          inputJson: inputJson,
        },
      });
    } catch (e) {
      const response = getExceptionMessage(e);
      return res.status(500).json(response);
    }
  },
  upload: async (req: Request, res: Response) => {
    try {
      const body: { name: string; content: string } = req.body;

      const name = body.name.trim();
      let content = body.content.trim();

      if (!name) {
        return res.status(400).json({
          code: CODES_NOT.validName,
          message: MESSAGES_NOT.validName,
        });
      }

      if (!content || content === "{}" || isEmptyObject(content)) {
        return res.status(400).json({
          code: CODES_NOT.validContent,
          message: MESSAGES_NOT.validContent,
          data: null,
        });
      }

      content = JSON.parse(body.content);

      const keysAndValues = await getPeers(content);
      const keys = Object.keys(keysAndValues);

      const json = await InputService.createInput({
        name: name,
        content: content as Prisma.InputJsonValue,
        keys: keys,
        keysAndValues: keysAndValues as Prisma.InputJsonValue,
      });

      const data = {
        inputJson: json,
      };

      return res.status(201).json({
        code: CODES_SUCCESS.inputJsonUploaded,
        message: MESSAGES_SUCCESS.inputJsonUploaded,
        data: data,
      });
    } catch (e: unknown) {
      const response = getExceptionMessage(e);
      return res.status(500).json(response);
    }
  },
};
