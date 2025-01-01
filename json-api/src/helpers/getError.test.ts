import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { getError } from "./getError";

test("It should return a specific message for PrismaClientKnownRequestError with code P2002", () => {
  const prismaError = new PrismaClientKnownRequestError(
    "Unique constraint failed",
    {
      code: "P2002",
      clientVersion: "4.15.0",
    }
  );

  const result = getError(prismaError);

  expect(result).toBe(
    "A JSON with the specified name already exists in the database!"
  );
});

test("It should return the default message for PrismaClientKnownRequestError with a different code", () => {
  const prismaError = new PrismaClientKnownRequestError("Some other error", {
    code: "P2001",
    clientVersion: "4.15.0",
  });

  const result = getError(prismaError);

  expect(result).toBe("Failure to load custom message for this error");
});

test("It should return the default message for a non-Prisma error", () => {
  const genericError = new Error("Some generic error");

  const result = getError(genericError);

  expect(result).toBe("Failure to load custom message for this error");
});

test("It should return the default message for an unknown error type", () => {
  const unknownError = { message: "Some unknown error" };

  const result = getError(unknownError);

  expect(result).toBe("Failure to load custom message for this error");
});
