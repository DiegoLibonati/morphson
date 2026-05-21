describe("logger.config", () => {
  const originalEnv: NodeJS.ProcessEnv = process.env;

  beforeEach((): void => {
    process.env = { ...originalEnv };
  });

  afterAll((): void => {
    process.env = originalEnv;
  });

  const loadLogger = (): { logger: { level: string; info: unknown; error: unknown } } => {
    let mod!: { logger: { level: string; info: unknown; error: unknown } };
    jest.isolateModules(() => {
      mod = jest.requireActual("@/configs/logger.config");
    });
    return mod;
  };

  it("should export a pino logger with the configured level in test env", () => {
    process.env.NODE_ENV = "test";
    process.env.LOG_LEVEL = "warn";

    const { logger } = loadLogger();

    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(logger.level).toBe("warn");
  });

  it("should default the level to 'info' when LOG_LEVEL is not set", () => {
    process.env.NODE_ENV = "test";
    delete process.env.LOG_LEVEL;

    const { logger } = loadLogger();

    expect(logger.level).toBe("info");
  });

  it("should respect LOG_LEVEL=debug", () => {
    process.env.NODE_ENV = "test";
    process.env.LOG_LEVEL = "debug";

    const { logger } = loadLogger();

    expect(logger.level).toBe("debug");
  });

  it("should respect LOG_LEVEL=silent", () => {
    process.env.NODE_ENV = "test";
    process.env.LOG_LEVEL = "silent";

    const { logger } = loadLogger();

    expect(logger.level).toBe("silent");
  });
});
