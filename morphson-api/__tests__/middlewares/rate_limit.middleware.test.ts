import type { NextFunction, Request, RequestHandler, Response } from "express";

describe("rate_limit.middleware", () => {
  const originalEnv: NodeJS.ProcessEnv = process.env;

  beforeEach((): void => {
    process.env = { ...originalEnv };
  });

  afterAll((): void => {
    process.env = originalEnv;
  });

  const loadRateLimiter = (): RequestHandler => {
    let handler!: RequestHandler;
    jest.isolateModules(() => {
      handler = jest.requireActual("@/middlewares/rate_limit.middleware").rateLimiter;
    });
    return handler;
  };

  const buildReq = (): Request => ({}) as Request;
  const buildRes = (): Response => ({}) as Response;

  it("should call next without rate limiting when RATE_LIMIT_MAX is 0 (passthrough)", () => {
    process.env.RATE_LIMIT_MAX = "0";

    const rateLimiter: RequestHandler = loadRateLimiter();

    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = jest.fn();

    rateLimiter(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should export a function when RATE_LIMIT_MAX is greater than 0", () => {
    process.env.RATE_LIMIT_MAX = "10";
    process.env.RATE_LIMIT_WINDOW_MS = "60000";

    const rateLimiter: RequestHandler = loadRateLimiter();

    expect(typeof rateLimiter).toBe("function");
  });

  it("should default to passthrough when RATE_LIMIT_MAX is not set", () => {
    delete process.env.RATE_LIMIT_MAX;

    const rateLimiter: RequestHandler = loadRateLimiter();
    const next: NextFunction = jest.fn();

    rateLimiter(buildReq(), buildRes(), next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
