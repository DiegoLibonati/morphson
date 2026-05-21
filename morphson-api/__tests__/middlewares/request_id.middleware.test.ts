import type { NextFunction, Request, Response } from "express";

import { requestId } from "@/middlewares/request_id.middleware";

const HEADER = "x-request-id";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const buildReq = (incomingHeader?: string): Request => {
  return {
    header: jest.fn((name: string): string | undefined => {
      if (name === HEADER) return incomingHeader;
      return undefined;
    }),
  } as unknown as Request;
};

const buildRes = (): Response => {
  return { setHeader: jest.fn() } as unknown as Response;
};

describe("request_id.middleware", () => {
  it("should use the incoming x-request-id when present", () => {
    const req: Request = buildReq("client-supplied-id");
    const res: Response = buildRes();
    const next: NextFunction = jest.fn();

    requestId(req, res, next);

    expect(req.id).toBe("client-supplied-id");
    expect(res.setHeader).toHaveBeenCalledWith(HEADER, "client-supplied-id");
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should generate a UUID when the header is missing", () => {
    const req: Request = buildReq(undefined);
    const res: Response = buildRes();
    const next: NextFunction = jest.fn();

    requestId(req, res, next);

    expect(req.id).toMatch(UUID_RE);
    expect(res.setHeader).toHaveBeenCalledWith(HEADER, req.id);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should generate a UUID when the header is an empty string", () => {
    const req: Request = buildReq("");
    const res: Response = buildRes();
    const next: NextFunction = jest.fn();

    requestId(req, res, next);

    expect(req.id).toMatch(UUID_RE);
  });

  it("should always call next exactly once", () => {
    const req: Request = buildReq("anything");
    const res: Response = buildRes();
    const next: NextFunction = jest.fn();

    requestId(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
