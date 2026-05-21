import type { ExceptionInfo } from "@/types/helpers";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";
import { ConflictError } from "@/errors/conflict.error";
import { NotFoundError } from "@/errors/not_found.error";
import { UnauthorizedError } from "@/errors/unauthorized.error";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_ERROR, MESSAGES_NOT } from "@/constants/messages.constant";

describe("get_exception_message.helper", () => {
  describe("with AppError instances", () => {
    it("should map a raw AppError to its status, code and message", () => {
      const error: AppError = new AppError(422, "ERROR_X", "Some message");

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result).toEqual({ status: 422, code: "ERROR_X", message: "Some message" });
    });

    it("should map BadRequestError to status 400", () => {
      const error: BadRequestError = new BadRequestError("ERR_BAD", "Bad request");

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result.status).toBe(400);
      expect(result.code).toBe("ERR_BAD");
      expect(result.message).toBe("Bad request");
    });

    it("should map UnauthorizedError to status 401", () => {
      const error: UnauthorizedError = new UnauthorizedError("ERR_AUTH", "Not allowed");

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result.status).toBe(401);
    });

    it("should map NotFoundError to status 404 with its code and message", () => {
      const error: NotFoundError = new NotFoundError(
        CODES_NOT.foundInputJson,
        MESSAGES_NOT.foundInputJson
      );

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result.status).toBe(404);
      expect(result.code).toBe(CODES_NOT.foundInputJson);
      expect(result.message).toBe(MESSAGES_NOT.foundInputJson);
    });

    it("should map ConflictError to status 409", () => {
      const error: ConflictError = new ConflictError("ERR_CONFLICT", "Conflict");

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result.status).toBe(409);
    });
  });

  describe("with non-AppError throwables", () => {
    it("should return 500 with generic code for a standard Error", () => {
      const error: Error = new Error("Something went wrong");

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result.status).toBe(500);
      expect(result.code).toBe(CODES_ERROR.generic);
      expect(result.message).toBe(MESSAGES_ERROR.generic);
    });

    it("should return 500 with generic code for a non-Error throwable", () => {
      const result: ExceptionInfo = getExceptionMessage("unexpected string error");

      expect(result.status).toBe(500);
      expect(result.code).toBe(CODES_ERROR.generic);
      expect(result.message).toBe(MESSAGES_ERROR.generic);
    });

    it("should return 500 with generic code for null", () => {
      const result: ExceptionInfo = getExceptionMessage(null);

      expect(result.status).toBe(500);
      expect(result.code).toBe(CODES_ERROR.generic);
    });

    it("should return 500 with generic code for undefined", () => {
      const result: ExceptionInfo = getExceptionMessage(undefined);

      expect(result.status).toBe(500);
    });
  });
});
