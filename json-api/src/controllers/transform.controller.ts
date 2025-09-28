import fs from "fs";
import path from "path";
import { Request, Response } from "express";

import { InputService } from "@src/services/input.service";
import { OutputService } from "@src/services/output.service";

import { getExceptionMessage } from "@src/helpers/get_exception_message.helper";
import { isInteger } from "@src/helpers/is_integer.helper";
import { isEmptyObject } from "@src/helpers/is_empty_object.helper";
import { getJsonTransformed } from "@src/helpers/get_json_transformed.helper";

import { CODES_NOT } from "@src/constants/codes.constant";
import { MESSAGES_NOT } from "@src/constants/messages.constant";

export const TransformController = {
  transform: async (req: Request, res: Response) => {
    try {
      const body: Record<string, string | boolean> = req.body;

      const idInputJson = body.idInputJson as string;
      const saveOutputJson = body.saveOutputJson as boolean;
      const outputJsonNameToSave = (body.outputJsonNameToSave as string).trim();
      const contentJsonToTransform = (
        body.contentJsonToTransform as string
      ).trim();

      if (!idInputJson || !isInteger(idInputJson)) {
        return res.status(400).json({
          code: CODES_NOT.validInputJsonId,
          message: MESSAGES_NOT.validInputJsonId,
          data: null,
        });
      }

      if (saveOutputJson && !outputJsonNameToSave) {
        return res.status(400).json({
          code: CODES_NOT.validName,
          message: MESSAGES_NOT.validName,
          data: null,
        });
      }

      if (
        !contentJsonToTransform ||
        contentJsonToTransform === "{}" ||
        isEmptyObject(contentJsonToTransform)
      ) {
        return res.status(400).json({
          code: CODES_NOT.validContent,
          message: MESSAGES_NOT.validContent,
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

      if (saveOutputJson) {
        const data = {
          name: outputJsonNameToSave,
          transformationModel: JSON.parse(contentJsonToTransform),
        };

        await OutputService.createOutput(data);
      }

      const jsonTransformed = await getJsonTransformed(
        JSON.parse(contentJsonToTransform),
        inputJson.keys,
        inputJson.keysAndValues as Record<string, unknown>
      );

      const filename = `${inputJson.name}_transformed.json`;
      const filePath = path.join(__dirname, filename);

      fs.writeFileSync(filePath, JSON.stringify(jsonTransformed, null, 2));

      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader("Content-Type", "application/json");

      return res.status(200).download(filePath, (err) => {
        if (!err) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (e: unknown) {
      const response = getExceptionMessage(e);
      return res.status(500).json(response);
    }
  },
};
