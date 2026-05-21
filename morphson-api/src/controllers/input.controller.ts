import type { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { InputCreateBody, InputIdParams } from "@/types/zod";

import { InputService } from "@/services/input.service";

import { NotFoundError } from "@/errors/not_found.error";

import { getPeers } from "@/helpers/get_peers.helper";

import { MESSAGES_NOT, MESSAGES_SUCCESS } from "@/constants/messages.constant";
import { CODES_NOT, CODES_SUCCESS } from "@/constants/codes.constant";

export const InputController = {
  getAll: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const inputJsons = await InputService.getAllInputs();
      res.status(200).json({
        code: CODES_SUCCESS.getAllInputJsons,
        message: MESSAGES_SUCCESS.getAllInputJsons,
        data: inputJsons,
      });
    } catch (e) {
      next(e);
    }
  },

  getById: async (
    req: Request<InputIdParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { idInputJson } = req.params;
      const inputJson = await InputService.getInputById(idInputJson);
      if (!inputJson)
        throw new NotFoundError(CODES_NOT.foundInputJson, MESSAGES_NOT.foundInputJson);
      res.status(200).json({
        code: CODES_SUCCESS.getInputJson,
        message: MESSAGES_SUCCESS.getInputJson,
        data: { inputJson },
      });
    } catch (e) {
      next(e);
    }
  },

  upload: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, content: contentStr } = req.body as InputCreateBody;
      const content = JSON.parse(contentStr) as Record<string, unknown>;
      const keysAndValues = await getPeers(content);
      const keys = Object.keys(keysAndValues);
      const inputJson = await InputService.createInput({
        name,
        content: content as unknown as Prisma.InputJsonValue,
        keys,
        keysAndValues: keysAndValues as unknown as Prisma.InputJsonValue,
      });
      res.status(201).json({
        code: CODES_SUCCESS.inputJsonUploaded,
        message: MESSAGES_SUCCESS.inputJsonUploaded,
        data: { inputJson },
      });
    } catch (e) {
      next(e);
    }
  },
};
