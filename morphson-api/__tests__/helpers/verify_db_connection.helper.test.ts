import { logger } from "@/configs/logger.config";
import { prisma } from "@/configs/prisma.config";

import { verifyDbConnection } from "@/helpers/verify_db_connection.helper";

jest.mock("@/configs/prisma.config", () => ({
  prisma: { $queryRaw: jest.fn() },
}));

jest.mock("@/configs/logger.config", () => ({
  logger: { info: jest.fn(), warn: jest.fn() },
}));

const RETRY_WARN_MESSAGE = "Database connection failed. Retrying...";
const VERIFIED_INFO_MESSAGE = "Database connection verified.";

const mockQueryRaw = prisma.$queryRaw as unknown as jest.Mock;
const mockLogger = logger as unknown as { info: jest.Mock; warn: jest.Mock };

describe("verify_db_connection.helper", () => {
  describe("verifyDbConnection", () => {
    it("should return true and log info when the database responds on the first attempt", async () => {
      mockQueryRaw.mockResolvedValue([]);

      const result: boolean = await verifyDbConnection({ baseDelayMs: 1 });

      expect(result).toBe(true);
      expect(mockQueryRaw).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith({ attempt: 1 }, VERIFIED_INFO_MESSAGE);
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it("should retry and return true when the database responds after a failure", async () => {
      mockQueryRaw.mockRejectedValueOnce(new Error("connection refused")).mockResolvedValue([]);

      const result: boolean = await verifyDbConnection({ baseDelayMs: 1 });

      expect(result).toBe(true);
      expect(mockQueryRaw).toHaveBeenCalledTimes(2);
      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        { attempt: 1, retries: 5, retryInMs: 1 },
        RETRY_WARN_MESSAGE
      );
      expect(mockLogger.info).toHaveBeenCalledWith({ attempt: 2 }, VERIFIED_INFO_MESSAGE);
    });

    it("should log warns with exponential backoff payloads between failed attempts", async () => {
      mockQueryRaw.mockRejectedValue(new Error("connection refused"));

      await verifyDbConnection({ retries: 4, baseDelayMs: 1 });

      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        1,
        { attempt: 1, retries: 4, retryInMs: 1 },
        RETRY_WARN_MESSAGE
      );
      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        2,
        { attempt: 2, retries: 4, retryInMs: 2 },
        RETRY_WARN_MESSAGE
      );
      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        3,
        { attempt: 3, retries: 4, retryInMs: 4 },
        RETRY_WARN_MESSAGE
      );
    });

    it("should return false and log a final warn when all retries are exhausted", async () => {
      mockQueryRaw.mockRejectedValue(new Error("connection refused"));

      const result: boolean = await verifyDbConnection({ retries: 3, baseDelayMs: 1 });

      expect(result).toBe(false);
      expect(mockQueryRaw).toHaveBeenCalledTimes(3);
      expect(mockLogger.warn).toHaveBeenCalledTimes(3);
      expect(mockLogger.warn).toHaveBeenLastCalledWith(
        expect.stringContaining("could not be verified after 3 attempts")
      );
    });

    it("should cap the retry delay at maxDelayMs", async () => {
      mockQueryRaw.mockRejectedValue(new Error("connection refused"));

      await verifyDbConnection({ retries: 4, baseDelayMs: 2, maxDelayMs: 3 });

      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        1,
        { attempt: 1, retries: 4, retryInMs: 2 },
        RETRY_WARN_MESSAGE
      );
      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        2,
        { attempt: 2, retries: 4, retryInMs: 3 },
        RETRY_WARN_MESSAGE
      );
      expect(mockLogger.warn).toHaveBeenNthCalledWith(
        3,
        { attempt: 3, retries: 4, retryInMs: 3 },
        RETRY_WARN_MESSAGE
      );
    });

    it("should not log info when the database never responds", async () => {
      mockQueryRaw.mockRejectedValue(new Error("connection refused"));

      await verifyDbConnection({ retries: 2, baseDelayMs: 1 });

      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });
});
