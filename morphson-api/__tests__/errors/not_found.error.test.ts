import { AppError } from "@/errors/app.error";
import { NotFoundError } from "@/errors/not_found.error";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

describe("not_found.error", () => {
  it("should set status to 404", () => {
    const error: NotFoundError = new NotFoundError("CODE", "message");

    expect(error.status).toBe(404);
  });

  it("should expose the code and message passed to the constructor", () => {
    const error: NotFoundError = new NotFoundError("CODE", "message");

    expect(error.code).toBe("CODE");
    expect(error.message).toBe("message");
  });

  it("should default to the route not found code and message when called with no arguments", () => {
    const error: NotFoundError = new NotFoundError();

    expect(error.code).toBe(CODES_NOT.foundRoute);
    expect(error.message).toBe(MESSAGES_NOT.foundRoute);
  });

  it("should be an instance of AppError, Error and NotFoundError", () => {
    const error: NotFoundError = new NotFoundError();

    expect(error).toBeInstanceOf(NotFoundError);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });

  it("should set name to 'NotFoundError'", () => {
    const error: NotFoundError = new NotFoundError();

    expect(error.name).toBe("NotFoundError");
  });
});
