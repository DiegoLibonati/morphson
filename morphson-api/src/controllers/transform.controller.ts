import fs from "fs";
import path from "path";

import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { InputService } from "@/services/input.service";
import { OutputService } from "@/services/output.service";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";
import { isInteger } from "@/helpers/is_integer.helper";
import { isEmptyObject } from "@/helpers/is_empty_object.helper";
import { getJsonTransformed } from "@/helpers/get_json_transformed.helper";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

export const TransformController = {
  transform: async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as Record<string, string | boolean>;

      const idInputJson = body.idInputJson as string;
      const saveOutputJson = body.saveOutputJson as boolean;
      const outputJsonNameToSave = (body.outputJsonNameToSave as string).trim();
      const contentJsonToTransform = (body.contentJsonToTransform as string).trim();

      if (!idInputJson || !isInteger(idInputJson)) {
        res.status(400).json({
          code: CODES_NOT.validInputJsonId,
          message: MESSAGES_NOT.validInputJsonId,
          data: null,
        });
        return;
      }

      if (saveOutputJson && !outputJsonNameToSave) {
        res.status(400).json({
          code: CODES_NOT.validName,
          message: MESSAGES_NOT.validName,
          data: null,
        });
        return;
      }

      if (
        !contentJsonToTransform ||
        contentJsonToTransform === "{}" ||
        isEmptyObject(contentJsonToTransform)
      ) {
        res.status(400).json({
          code: CODES_NOT.validContent,
          message: MESSAGES_NOT.validContent,
          data: null,
        });
        return;
      }

      const inputJson = await InputService.getInputById(idInputJson);

      if (!inputJson) {
        throw new Error(`InputJson with id ${idInputJson} not found`);
      }

      if (saveOutputJson) {
        await OutputService.createOutput({
          name: outputJsonNameToSave,
          transformationModel: JSON.parse(contentJsonToTransform) as Prisma.InputJsonValue,
        });
      }

      const jsonTransformed = await getJsonTransformed(
        JSON.parse(contentJsonToTransform) as Record<string, unknown>,
        inputJson.keys,
        inputJson.keysAndValues as Record<string, unknown>
      );

      const filename = `${inputJson.name}_transformed.json`;
      const filePath = path.join(__dirname, filename);

      fs.writeFileSync(filePath, JSON.stringify(jsonTransformed, null, 2));

      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-Type", "application/json");

      res.status(200).download(filePath, () => {
        fs.unlinkSync(filePath);
      });
    } catch (e: unknown) {
      const { status, ...response } = getExceptionMessage(e);
      res.status(status).json(response);
    }
  },
};
