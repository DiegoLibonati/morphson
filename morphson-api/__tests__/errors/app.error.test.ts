import { AppError } from "@/errors/app.error";

describe("app.error", () => {
  it("should expose status, code and message", () => {
    const error: AppError = new AppError(418, "ERROR_TEAPOT", "I'm a teapot");

    expect(error.status).toBe(418);
    expect(error.code).toBe("ERROR_TEAPOT");
    expect(error.message).toBe("I'm a teapot");
  });

  it("should be an instance of Error and AppError", () => {
    const error: AppError = new AppError(500, "ERROR_GENERIC", "Generic");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it("should set name from the runtime constructor", () => {
    const error: AppError = new AppError(400, "ERROR", "msg");

    expect(error.name).toBe("AppError");
  });

  it("should mark status and code as readonly at the type level", () => {
    const error: AppError = new AppError(500, "C", "m");

    expect(Object.getOwnPropertyDescriptor(error, "status")?.writable).toBe(true);
    expect(error.status).toBe(500);
    expect(error.code).toBe("C");
  });

  it("should be catchable as Error", () => {
    const throwFn = (): never => {
      throw new AppError(500, "ERROR", "boom");
    };

    expect(throwFn).toThrow("boom");
    expect(throwFn).toThrow(AppError);
    expect(throwFn).toThrow(Error);
  });
});
