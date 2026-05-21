import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";

describe("bad_request.error", () => {
  it("should set status to 400", () => {
    const error: BadRequestError = new BadRequestError("ERROR_BAD", "Bad input");

    expect(error.status).toBe(400);
  });

  it("should expose the code and message passed to the constructor", () => {
    const error: BadRequestError = new BadRequestError("ERROR_BAD", "Bad input");

    expect(error.code).toBe("ERROR_BAD");
    expect(error.message).toBe("Bad input");
  });

  it("should be an instance of AppError, Error and BadRequestError", () => {
    const error: BadRequestError = new BadRequestError("C", "m");

    expect(error).toBeInstanceOf(BadRequestError);
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
  });

  it("should set name to 'BadRequestError'", () => {
    const error: BadRequestError = new BadRequestError("C", "m");

    expect(error.name).toBe("BadRequestError");
  });
});
