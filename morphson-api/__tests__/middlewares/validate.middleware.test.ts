import { z } from "zod";

import type { NextFunction, Request, RequestHandler, Response } from "express";

import { validate } from "@/middlewares/validate.middleware";

import { BadRequestError } from "@/errors/bad_request.error";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

const buildReq = (overrides: Partial<Request> = {}): Request => {
  return {
    params: {},
    query: {},
    body: {},
    ...overrides,
  } as Request;
};

const buildRes = (): Response => ({}) as Response;

describe("validate.middleware", () => {
  describe("params", () => {
    it("should call next without error when params are valid", () => {
      const schema = z.object({ idInputJson: z.string().regex(/^[1-9]\d*$/) });
      const handler: RequestHandler = validate({ params: schema });
      const req: Request = buildReq({ params: { idInputJson: "5" } });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    it("should call next with BadRequestError when params are invalid", () => {
      const schema = z.object({ idInputJson: z.string().regex(/^[1-9]\d*$/) });
      const handler: RequestHandler = validate({ params: schema });
      const req: Request = buildReq({ params: { idInputJson: "abc" } });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.code).toBe(CODES_NOT.validInputJsonId);
      expect(error.message).toBe(MESSAGES_NOT.validInputJsonId);
    });

    it("should overwrite req.params with the parsed data", () => {
      const schema = z.object({
        idInputJson: z.string().regex(/^[1-9]\d*$/),
      });
      const handler: RequestHandler = validate({ params: schema });
      const req: Request = buildReq({ params: { idInputJson: "7", extra: "drop" } });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      expect(req.params).toEqual({ idInputJson: "7" });
    });

    it("should map idOutputJson validation errors to the output id code", () => {
      const schema = z.object({ idOutputJson: z.string().regex(/^[1-9]\d*$/) });
      const handler: RequestHandler = validate({ params: schema });
      const req: Request = buildReq({ params: { idOutputJson: "0" } });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      const error = (next as jest.Mock).mock.calls[0][0] as BadRequestError;
      expect(error.code).toBe(CODES_NOT.validOutputJsonId);
    });
  });

  describe("query", () => {
    it("should call next without error when query is valid", () => {
      const schema = z.object({ q: z.string().min(1) });
      const handler: RequestHandler = validate({ query: schema });
      const req: Request = buildReq({ query: { q: "hello" } });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      expect(next).toHaveBeenCalledWith();
    });

    it("should call next with BadRequestError when query is invalid", () => {
      const schema = z.object({ q: z.string().min(1) });
      const handler: RequestHandler = validate({ query: schema });
      const req: Request = buildReq({ query: {} });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error).toBeInstanceOf(BadRequestError);
    });
  });

  describe("body", () => {
    it("should call next without error when body is valid", () => {
      const schema = z.object({ name: z.string().min(1), content: z.string().min(1) });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { name: "x", content: "y" } });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      expect(next).toHaveBeenCalledWith();
    });

    it("should overwrite req.body with the parsed data", () => {
      const schema = z.object({
        name: z.string().trim().min(1),
      });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { name: "  hello  ", extra: 42 } });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      expect(req.body).toEqual({ name: "hello" });
    });

    it("should map 'name' field errors to the validName code", () => {
      const schema = z.object({ name: z.string().min(3) });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { name: "" } });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      const error = (next as jest.Mock).mock.calls[0][0] as BadRequestError;
      expect(error.code).toBe(CODES_NOT.validName);
      expect(error.message).toBe(MESSAGES_NOT.validName);
    });

    it("should map 'content' field errors to the validContent code", () => {
      const schema = z.object({ content: z.string().min(1) });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { content: "" } });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      const error = (next as jest.Mock).mock.calls[0][0] as BadRequestError;
      expect(error.code).toBe(CODES_NOT.validContent);
      expect(error.message).toBe(MESSAGES_NOT.validContent);
    });

    it("should fall back to the validation code when the failing field is unknown", () => {
      const schema = z.object({ unknownField: z.string().min(1) });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { unknownField: "" } });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      const error = (next as jest.Mock).mock.calls[0][0] as BadRequestError;
      expect(error.code).toBe(CODES_ERROR.validation);
    });

    it("should propagate the Zod issue message when the field is unmapped", () => {
      const schema = z.object({ unknownField: z.string().min(3, "too short") });
      const handler: RequestHandler = validate({ body: schema });
      const req: Request = buildReq({ body: { unknownField: "a" } });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      const error = (next as jest.Mock).mock.calls[0][0] as BadRequestError;
      expect(error.code).toBe(CODES_ERROR.validation);
      expect(error.message).toBe("too short");
    });
  });

  describe("combined", () => {
    it("should call next without error when no schemas are provided", () => {
      const handler: RequestHandler = validate({});
      const next: NextFunction = jest.fn();

      handler(buildReq(), buildRes(), next);

      expect(next).toHaveBeenCalledWith();
    });

    it("should short-circuit when params fail and not run body or query", () => {
      const paramsSchema = z.object({ idInputJson: z.string().regex(/^[1-9]\d*$/) });
      const bodySpy = jest.fn();
      const bodySchema = z.object({}).refine((): boolean => {
        bodySpy();
        return true;
      });
      const handler: RequestHandler = validate({ params: paramsSchema, body: bodySchema });
      const req: Request = buildReq({ params: { idInputJson: "abc" }, body: {} });
      const next: NextFunction = jest.fn();

      handler(req, buildRes(), next);

      expect(bodySpy).not.toHaveBeenCalled();
      expect((next as jest.Mock).mock.calls[0][0]).toBeInstanceOf(BadRequestError);
    });
  });
});
