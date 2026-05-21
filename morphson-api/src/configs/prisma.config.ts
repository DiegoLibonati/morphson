import { PrismaClient } from "@prisma/client";

import { envs } from "@/configs/env.config";

export const prisma = new PrismaClient({
  datasourceUrl: envs.DATABASE_URL,
  log:
    envs.ENV === "test"
      ? []
      : envs.ENV === "production"
        ? ["error"]
        : envs.PRISMA_LOG_QUERIES
          ? ["query", "warn", "error"]
          : ["warn", "error"],
});
