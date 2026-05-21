import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodError } from "zod";
import type { ValidateConfig } from "@/types/app";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_ERROR, MESSAGES_NOT } from "@/constants/messages.constant";

import { BadRequestError } from "@/errors/bad_request.error";

const FIELD_TO_ERROR: Record<string, { code: string; message: string }> = {
  name: { code: CODES_NOT.validName, message: MESSAGES_NOT.validName },
  content: { code: CODES_NOT.validContent, message: MESSAGES_NOT.validContent },
  idInputJson: { code: CODES_NOT.validInputJsonId, message: MESSAGES_NOT.validInputJsonId },
  idOutputJson: { code: CODES_NOT.validOutputJsonId, message: MESSAGES_NOT.validOutputJsonId },
  outputJsonNameToSave: { code: CODES_NOT.validName, message: MESSAGES_NOT.validName },
  contentJsonToTransform: { code: CODES_NOT.validContent, message: MESSAGES_NOT.validContent },
};

const toBadRequest = (err: ZodError): BadRequestError => {
  const issue = err.issues[0];
  const field = issue?.path[0];
  const mapped = typeof field === "string" ? FIELD_TO_ERROR[field] : undefined;
  return new BadRequestError(
    mapped?.code ?? CODES_ERROR.validation,
    mapped?.message ?? issue?.message ?? MESSAGES_ERROR.validation
  );
};

export const validate = (schemas: ValidateConfig): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        next(toBadRequest(result.error));
        return;
      }
      req.params = result.data as typeof req.params;
    }
    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        next(toBadRequest(result.error));
        return;
      }
    }
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        next(toBadRequest(result.error));
        return;
      }
      req.body = result.data;
    }
    next();
  };
};
