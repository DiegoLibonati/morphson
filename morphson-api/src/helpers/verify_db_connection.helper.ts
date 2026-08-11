import type { VerifyConnectionOptions } from "@/types/helpers";

import { logger } from "@/configs/logger.config";
import { prisma } from "@/configs/prisma.config";

export const verifyDbConnection = async (
  options: VerifyConnectionOptions = {}
): Promise<boolean> => {
  const retries = options.retries ?? 5;
  const baseDelayMs = options.baseDelayMs ?? 500;
  const maxDelayMs = options.maxDelayMs ?? 8000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      logger.info({ attempt }, "Database connection verified.");
      return true;
    } catch {
      if (attempt < retries) {
        const retryInMs = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
        logger.warn({ attempt, retries, retryInMs }, "Database connection failed. Retrying...");
        await new Promise((resolve) => {
          setTimeout(resolve, retryInMs);
        });
      }
    }
  }

  logger.warn(
    `Database connection could not be verified after ${retries} attempts. The server keeps running and Prisma will reconnect automatically once the database is reachable. If you are running without Docker, make sure the database is up and that the DB_* values in your .env point to it (e.g. DB_HOST=localhost instead of the compose service hostname).`
  );

  return false;
};
