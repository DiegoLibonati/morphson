import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { GetExceptionInformation } from "@src/entities/helpers";

import { CODES_ERROR } from "@src/constants/codes.constant";
import { MESSAGES_ERROR } from "@src/constants/messages.constant";

export const getExceptionMessage = (e: unknown): GetExceptionInformation => {
  if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
    return {
      code: CODES_ERROR.jsonAlreadyExistsInDatabase,
      message: MESSAGES_ERROR.jsonAlreadyExistsInDatabase,
    };
  }

  return { code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic };
};
