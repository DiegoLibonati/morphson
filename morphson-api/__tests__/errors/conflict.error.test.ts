import { AppError } from "@/errors/app.error";
import { ConflictError } from "@/errors/conflict.error";

describe("conflict.error", () => {
  it("should set status to 409", () => {
    const error: ConflictError = new ConflictError("ERROR_CONFLICT", "Already exists");

    expect(error.status).toBe(409);
  });

  it("should expose the code and message passed to the constructor", () => {
    const error: ConflictError = new ConflictError("ERROR_CONFLICT", "Already exists");

    expect(error.code).toBe("ERROR_CONFLICT");
    expect(error.message).toBe("Already exists");
  });

  it("should be an instance of AppError, Error and ConflictError", () => {
    const error: ConflictError = new ConflictError("C", "m");

    expect(error).toBeInstanceOf(ConflictError);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });

  it("should set name to 'ConflictError'", () => {
    const error: ConflictError = new ConflictError("C", "m");

    expect(error.name).toBe("ConflictError");
  });
});
