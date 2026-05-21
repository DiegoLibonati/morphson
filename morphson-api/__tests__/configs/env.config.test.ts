import type { Envs } from "@/types/env";

describe("env.config", () => {
  const originalEnv: NodeJS.ProcessEnv = process.env;

  beforeEach((): void => {
    process.env = { ...originalEnv };
  });

  afterAll((): void => {
    process.env = originalEnv;
  });

  const loadEnvs = (): Envs => {
    let result!: Envs;
    jest.isolateModules(() => {
      result = jest.requireActual("@/configs/env.config").envs;
    });
    return result;
  };

  const expectLoadToThrow = (matcher: RegExp): void => {
    expect(() => {
      jest.isolateModules(() => {
        jest.requireActual("@/configs/env.config");
      });
    }).toThrow(matcher);
  };

  it("should build DATABASE_URL from individual env vars", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5433";
    process.env.DB_USER = "admin";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "test_db";
    process.env.DB_SCHEMA = "myschema";

    const envs: Envs = loadEnvs();

    expect(envs.DATABASE_URL).toBe(
      "postgresql://admin:secret@localhost:5433/test_db?schema=myschema"
    );
  });

  it("should default PORT to 5050 when PORT is not set", () => {
    delete process.env.PORT;

    const envs: Envs = loadEnvs();

    expect(envs.PORT).toBe(5050);
  });

  it("should coerce PORT from env when set", () => {
    process.env.PORT = "3000";

    const envs: Envs = loadEnvs();

    expect(envs.PORT).toBe(3000);
  });

  it("should default ENV to 'development' when NODE_ENV is not set", () => {
    delete process.env.NODE_ENV;

    const envs: Envs = loadEnvs();

    expect(envs.ENV).toBe("development");
  });

  it("should use ENV from NODE_ENV when set to a valid value", () => {
    process.env.NODE_ENV = "production";

    const envs: Envs = loadEnvs();

    expect(envs.ENV).toBe("production");
  });

  it("should default DB_SCHEMA to 'public' when DB_SCHEMA is not set", () => {
    delete process.env.DB_SCHEMA;

    const envs: Envs = loadEnvs();

    expect(envs.DATABASE_URL).toContain("?schema=public");
  });

  it("should default LOG_LEVEL to 'info' when not set", () => {
    delete process.env.LOG_LEVEL;

    const envs: Envs = loadEnvs();

    expect(envs.LOG_LEVEL).toBe("info");
  });

  it("should default BASE_URL to empty string when not set", () => {
    delete process.env.BASE_URL;

    const envs: Envs = loadEnvs();

    expect(envs.BASE_URL).toBe("");
  });

  it("should default RATE_LIMIT_WINDOW_MS to 15 minutes when not set", () => {
    delete process.env.RATE_LIMIT_WINDOW_MS;

    const envs: Envs = loadEnvs();

    expect(envs.RATE_LIMIT_WINDOW_MS).toBe(15 * 60 * 1000);
  });

  it("should default RATE_LIMIT_MAX to 0 when not set", () => {
    delete process.env.RATE_LIMIT_MAX;

    const envs: Envs = loadEnvs();

    expect(envs.RATE_LIMIT_MAX).toBe(0);
  });

  it("should default BODY_LIMIT to '1gb' when not set", () => {
    delete process.env.BODY_LIMIT;

    const envs: Envs = loadEnvs();

    expect(envs.BODY_LIMIT).toBe("1gb");
  });

  it("should default PRISMA_LOG_QUERIES to false when not set", () => {
    delete process.env.PRISMA_LOG_QUERIES;

    const envs: Envs = loadEnvs();

    expect(envs.PRISMA_LOG_QUERIES).toBe(false);
  });

  it("should coerce PRISMA_LOG_QUERIES truthy string to boolean", () => {
    process.env.PRISMA_LOG_QUERIES = "true";

    const envs: Envs = loadEnvs();

    expect(envs.PRISMA_LOG_QUERIES).toBe(true);
  });

  it("should default SEED_DEFAULT_DATA to false when not set", () => {
    delete process.env.SEED_DEFAULT_DATA;

    const envs: Envs = loadEnvs();

    expect(envs.SEED_DEFAULT_DATA).toBe(false);
  });

  it("should throw when DB_HOST is not set", () => {
    delete process.env.DB_HOST;

    expectLoadToThrow(/Invalid environment variables/);
  });

  it("should throw when DB_USER is not set", () => {
    delete process.env.DB_USER;

    expectLoadToThrow(/DB_USER/);
  });

  it("should throw when DB_PASSWORD is not set", () => {
    delete process.env.DB_PASSWORD;

    expectLoadToThrow(/DB_PASSWORD/);
  });

  it("should throw when DB_NAME is not set", () => {
    delete process.env.DB_NAME;

    expectLoadToThrow(/DB_NAME/);
  });

  it("should throw when DB_PORT cannot be coerced to a positive integer", () => {
    process.env.DB_PORT = "not-a-number";

    expectLoadToThrow(/DB_PORT/);
  });

  it("should throw when NODE_ENV is not one of the allowed values", () => {
    process.env.NODE_ENV = "staging";

    expectLoadToThrow(/NODE_ENV/);
  });

  it("should throw when LOG_LEVEL is not one of the allowed values", () => {
    process.env.LOG_LEVEL = "loud";

    expectLoadToThrow(/LOG_LEVEL/);
  });
});
