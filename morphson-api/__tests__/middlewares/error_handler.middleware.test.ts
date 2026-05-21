import type { NextFunction, Request, Response } from "express";

import { errorHandler } from "@/middlewares/error_handler.middleware";

import { logger } from "@/configs/logger.config";

import { AppError } from "@/errors/app.error";
import { BadRequestError } from "@/errors/bad_request.error";
import { NotFoundError } from "@/errors/not_found.error";

import { CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_ERROR } from "@/constants/messages.constant";

jest.mock("@/configs/logger.config", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

const buildReq = (): Request => ({}) as Request;

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const buildNext = (): NextFunction => jest.fn();

describe("error_handler.middleware", () => {
  it("should respond with 500 and the generic error code and message for an unknown error", () => {
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

  it("should respond with the AppError status, code and message when error is an AppError", () => {
    const error: AppError = new AppError(418, "ERROR_TEAPOT", "I'm a teapot");
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({
      code: "ERROR_TEAPOT",
      message: "I'm a teapot",
    });
  });

  it("should respond with 400 for a BadRequestError", () => {
    const error: BadRequestError = new BadRequestError("ERR_BAD", "Bad");
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ code: "ERR_BAD", message: "Bad" });
  });

  it("should respond with 404 for a NotFoundError", () => {
    const error: NotFoundError = new NotFoundError("NF", "Not found");
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should log via logger.error when status is 500 or higher", () => {
    const error: Error = new Error("Boom");
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith({ err: error }, error.message);
  });

  it("should not log when status is below 500", () => {
    const error: BadRequestError = new BadRequestError("C", "m");
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(logger.error).not.toHaveBeenCalled();
  });

  it("should not call next", () => {
    const error: Error = new Error("Any error");
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
  });
});
