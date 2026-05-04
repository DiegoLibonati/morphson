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

  const expectLoadToThrow = (message: string): void => {
    expect(() => {
      jest.isolateModules(() => {
        jest.requireActual("@/configs/env.config");
      });
    }).toThrow(message);
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

  it("should use PORT from env when set", () => {
    process.env.PORT = "3000";

    const envs: Envs = loadEnvs();

    expect(envs.PORT).toBe(3000);
  });

  it("should default ENV to 'development' when NODE_ENV is not set", () => {
    delete process.env.NODE_ENV;

    const envs: Envs = loadEnvs();

    expect(envs.ENV).toBe("development");
  });

  it("should default DB_SCHEMA to 'public' when DB_SCHEMA is not set", () => {
    delete process.env.DB_SCHEMA;

    const envs: Envs = loadEnvs();

    expect(envs.DATABASE_URL).toContain("?schema=public");
  });

  it("should throw when DB_HOST is not set", () => {
    delete process.env.DB_HOST;

    expectLoadToThrow("Missing required environment variable: DB_HOST");
  });

  it("should throw when DB_USER is not set", () => {
    delete process.env.DB_USER;

    expectLoadToThrow("Missing required environment variable: DB_USER");
  });

  it("should throw when DB_PASSWORD is not set", () => {
    delete process.env.DB_PASSWORD;

    expectLoadToThrow("Missing required environment variable: DB_PASSWORD");
  });

  it("should throw when DB_NAME is not set", () => {
    delete process.env.DB_NAME;

    expectLoadToThrow("Missing required environment variable: DB_NAME");
  });
});
