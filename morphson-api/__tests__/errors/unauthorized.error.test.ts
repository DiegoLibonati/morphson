import { AppError } from "@/errors/app.error";
import { UnauthorizedError } from "@/errors/unauthorized.error";

describe("unauthorized.error", () => {
  it("should set status to 401", () => {
    const error: UnauthorizedError = new UnauthorizedError("ERROR_UNAUTH", "Unauthorized");

    expect(error.status).toBe(401);
  });

  it("should expose the code and message passed to the constructor", () => {
    const error: UnauthorizedError = new UnauthorizedError("ERROR_UNAUTH", "Unauthorized");

    expect(error.code).toBe("ERROR_UNAUTH");
    expect(error.message).toBe("Unauthorized");
  });

  it("should be an instance of AppError, Error and UnauthorizedError", () => {
    const error: UnauthorizedError = new UnauthorizedError("C", "m");

    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });

  it("should set name to 'UnauthorizedError'", () => {
    const error: UnauthorizedError = new UnauthorizedError("C", "m");

    expect(error.name).toBe("UnauthorizedError");
  });
});
