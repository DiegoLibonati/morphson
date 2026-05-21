import fs from "fs";
import path from "path";

import type { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { TransformBody } from "@/types/zod";

import { InputService } from "@/services/input.service";
import { OutputService } from "@/services/output.service";

import { NotFoundError } from "@/errors/not_found.error";

import { getJsonTransformed } from "@/helpers/get_json_transformed.helper";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

export const TransformController = {
  transform: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { idInputJson, saveOutputJson, outputJsonNameToSave, contentJsonToTransform } =
        req.body as TransformBody;

      const inputJson = await InputService.getInputById(idInputJson);
      if (!inputJson)
        throw new NotFoundError(CODES_NOT.foundInputJson, MESSAGES_NOT.foundInputJson);

      if (saveOutputJson && outputJsonNameToSave) {
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
    } catch (e) {
      next(e);
    }
  },
};
