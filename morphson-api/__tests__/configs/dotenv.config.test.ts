import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { getEnvFileCandidates, loadEnvFiles } from "@/configs/dotenv.config";

describe("dotenv.config", () => {
  const originalEnv: NodeJS.ProcessEnv = process.env;
  let tempDir: string;

  beforeEach((): void => {
    process.env = { ...originalEnv };
    delete process.env.NODE_ENV;
    tempDir = mkdtempSync(join(tmpdir(), "dotenv-config-"));
    jest.spyOn(process, "cwd").mockReturnValue(tempDir);
  });

  afterEach((): void => {
    jest.restoreAllMocks();
    process.env = originalEnv;
    rmSync(tempDir, { recursive: true, force: true });
  });

  const writeEnvFile = (file: string, content: string): void => {
    writeFileSync(join(tempDir, file), content, "utf-8");
  };

  describe("getEnvFileCandidates", () => {
    it("should return the four candidates in precedence order for development", () => {
      const candidates: string[] = getEnvFileCandidates("development");

      expect(candidates).toEqual([
        ".env.development.local",
        ".env.local",
        ".env.development",
        ".env",
      ]);
    });

    it("should return the four candidates in precedence order for production", () => {
      const candidates: string[] = getEnvFileCandidates("production");

      expect(candidates).toEqual([
        ".env.production.local",
        ".env.local",
        ".env.production",
        ".env",
      ]);
    });

    it("should return only the two test candidates for test", () => {
      const candidates: string[] = getEnvFileCandidates("test");

      expect(candidates).toEqual([".env.test.local", ".env.test"]);
    });
  });

  describe("loadEnvFiles", () => {
    it("should return an empty list when no env files exist", () => {
      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([]);
    });

    it("should load variables from .env", () => {
      writeEnvFile(".env", "DOTENV_TEST_VAR=from-env");

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env"]);
      expect(process.env.DOTENV_TEST_VAR).toBe("from-env");
    });

    it("should not override variables already present in process.env", () => {
      process.env.DOTENV_TEST_VAR = "from-process";
      writeEnvFile(".env", "DOTENV_TEST_VAR=from-env");

      loadEnvFiles();

      expect(process.env.DOTENV_TEST_VAR).toBe("from-process");
    });

    it("should prefer .env.local over .env", () => {
      writeEnvFile(".env.local", "DOTENV_TEST_VAR=from-local");
      writeEnvFile(".env", "DOTENV_TEST_VAR=from-env");

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.local", ".env"]);
      expect(process.env.DOTENV_TEST_VAR).toBe("from-local");
    });

    it("should prefer .env.<mode> over .env", () => {
      process.env.NODE_ENV = "development";
      writeEnvFile(".env.development", "DOTENV_TEST_VAR=from-mode");
      writeEnvFile(".env", "DOTENV_TEST_VAR=from-env");

      loadEnvFiles();

      expect(process.env.DOTENV_TEST_VAR).toBe("from-mode");
    });

    it("should prefer .env.local over .env.<mode>", () => {
      process.env.NODE_ENV = "development";
      writeEnvFile(".env.local", "DOTENV_TEST_VAR=from-local");
      writeEnvFile(".env.development", "DOTENV_TEST_VAR=from-mode");

      loadEnvFiles();

      expect(process.env.DOTENV_TEST_VAR).toBe("from-local");
    });

    it("should prefer .env.<mode>.local over all other files", () => {
      process.env.NODE_ENV = "development";
      writeEnvFile(".env.development.local", "DOTENV_TEST_VAR=from-mode-local");
      writeEnvFile(".env.local", "DOTENV_TEST_VAR=from-local");
      writeEnvFile(".env.development", "DOTENV_TEST_VAR=from-mode");
      writeEnvFile(".env", "DOTENV_TEST_VAR=from-env");

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([
        ".env.development.local",
        ".env.local",
        ".env.development",
        ".env",
      ]);
      expect(process.env.DOTENV_TEST_VAR).toBe("from-mode-local");
    });

    it("should prefer the process NODE_ENV over the one declared in env files", () => {
      process.env.NODE_ENV = "production";
      writeEnvFile(".env", "NODE_ENV=development");
      writeEnvFile(".env.production", "DOTENV_TEST_VAR=from-production");
      writeEnvFile(".env.development", "DOTENV_TEST_VAR=from-development");

      loadEnvFiles();

      expect(process.env.DOTENV_TEST_VAR).toBe("from-production");
    });

    it("should resolve the mode from the NODE_ENV declared in .env", () => {
      writeEnvFile(".env", "NODE_ENV=production");
      writeEnvFile(".env.production", "DOTENV_TEST_VAR=from-production");

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.production", ".env"]);
      expect(process.env.DOTENV_TEST_VAR).toBe("from-production");
    });

    it("should prefer the NODE_ENV declared in .env.local over the one in .env", () => {
      writeEnvFile(".env.local", "NODE_ENV=production");
      writeEnvFile(".env", "NODE_ENV=development");
      writeEnvFile(".env.production", "DOTENV_TEST_VAR=from-production");
      writeEnvFile(".env.development", "DOTENV_TEST_VAR=from-development");

      loadEnvFiles();

      expect(process.env.DOTENV_TEST_VAR).toBe("from-production");
    });

    it("should default the mode to development when NODE_ENV is not declared anywhere", () => {
      writeEnvFile(".env.development", "DOTENV_TEST_VAR=from-development");

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.development"]);
      expect(process.env.DOTENV_TEST_VAR).toBe("from-development");
    });

    it("should ignore .env and .env.local in test mode but load .env.test", () => {
      process.env.NODE_ENV = "test";
      writeEnvFile(".env", "DOTENV_TEST_VAR=from-env");
      writeEnvFile(".env.local", "DOTENV_TEST_VAR=from-local");
      writeEnvFile(".env.test", "DOTENV_TEST_MODE_VAR=from-test");

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.test"]);
      expect(process.env.DOTENV_TEST_VAR).toBeUndefined();
      expect(process.env.DOTENV_TEST_MODE_VAR).toBe("from-test");
    });

    it("should prefer .env.test.local over .env.test in test mode", () => {
      process.env.NODE_ENV = "test";
      writeEnvFile(".env.test.local", "DOTENV_TEST_VAR=from-test-local");
      writeEnvFile(".env.test", "DOTENV_TEST_VAR=from-test");

      const loadedFiles: string[] = loadEnvFiles();

      expect(loadedFiles).toEqual([".env.test.local", ".env.test"]);
      expect(process.env.DOTENV_TEST_VAR).toBe("from-test-local");
    });
  });
});
