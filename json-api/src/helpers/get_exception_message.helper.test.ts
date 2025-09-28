import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { getExceptionMessage } from "@src/helpers/get_exception_message.helper";

import { CODES_ERROR } from "@src/constants/codes.constant";
import { MESSAGES_ERROR } from "@src/constants/messages.constant";

describe("getExceptionMessage.ts", () => {
  test("It should return a specific code/message for PrismaClientKnownRequestError with code P2002", () => {
    const prismaError = new PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "4.15.0",
      }
    );

    const result = getExceptionMessage(prismaError);

    expect(result).toEqual({
      code: CODES_ERROR.jsonAlreadyExistsInDatabase,
      message: MESSAGES_ERROR.jsonAlreadyExistsInDatabase,
    });
  });

  test("It should return the default code/message for PrismaClientKnownRequestError with a different code", () => {
    const prismaError = new PrismaClientKnownRequestError("Some other error", {
      code: "P2001",
      clientVersion: "4.15.0",
    });

    const result = getExceptionMessage(prismaError);

    expect(result).toEqual({
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });

  test("It should return the default code/message for a non-Prisma error", () => {
    const genericError = new Error("Some generic error");

    const result = getExceptionMessage(genericError);

    expect(result).toEqual({
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });

  test("It should return the default code/message for an unknown error type", () => {
    const unknownError = { message: "Some unknown error" };

    const result = getExceptionMessage(unknownError);

    expect(result).toEqual({
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });
});
