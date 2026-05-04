import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import type { ExceptionInfo } from "@/types/helpers";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_ERROR, MESSAGES_NOT } from "@/constants/messages.constant";

describe("get_exception_message.helper", () => {
  describe("with PrismaClientKnownRequestError", () => {
    it("should return 404 with foundFile code when Prisma error code is P2025", () => {
      const error: PrismaClientKnownRequestError = new PrismaClientKnownRequestError(
        "Record not found",
        { code: "P2025", clientVersion: "5.0.0" }
      );

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result.status).toBe(404);
      expect(result.code).toBe(CODES_NOT.foundFile);
      expect(result.message).toBe(MESSAGES_NOT.foundFile);
    });

    it("should return 500 with generic code when Prisma error code is not P2025", () => {
      const error: PrismaClientKnownRequestError = new PrismaClientKnownRequestError(
        "Unique constraint violation",
        { code: "P2002", clientVersion: "5.0.0" }
      );

      const result: ExceptionInfo = getExceptionMessage(error);

      expect(result.status).toBe(500);
      expect(result.code).toBe(CODES_ERROR.generic);
      expect(result.message).toBe(MESSAGES_ERROR.generic);
    });
  });

  describe("with generic errors", () => {
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
    });
  });
});
