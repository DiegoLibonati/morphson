import type { NextFunction, Request, Response } from "express";

import { errorHandler } from "@/middlewares/error_handler.middleware";

import { CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_ERROR } from "@/constants/messages.constant";

const buildReq = (): Request => ({}) as Request;

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const buildNext = (): NextFunction => jest.fn();

describe("error_handler.middleware", () => {
  beforeEach((): void => {
    jest.spyOn(console, "error").mockImplementation((): void => {
      // Empty fn
    });
  });

  it("should respond with 500 and the generic error code and message", () => {
    const error: Error = new Error("Something exploded");
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });

  it("should not call next", () => {
    const error: Error = new Error("Any error");
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should log err.stack when available", () => {
    const consoleSpy = jest.spyOn(console, "error");
    const error: Error = new Error("Error with stack");
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(consoleSpy).toHaveBeenCalledWith(error.stack);
  });

  it("should log err.message when stack is not available", () => {
    const consoleSpy = jest.spyOn(console, "error");
    const error: Error = new Error("No stack error");
    delete error.stack;
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(consoleSpy).toHaveBeenCalledWith("No stack error");
  });
});
