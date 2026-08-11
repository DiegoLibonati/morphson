import { envs, loadedEnvFiles } from "@/configs/env.config";
import { logger } from "@/configs/logger.config";
import { prisma } from "@/configs/prisma.config";

import { verifyDbConnection } from "@/helpers/verify_db_connection.helper";

import app from "@/app";

const PORT = envs.PORT;
const ENV = envs.ENV;
const BASE_URL = envs.BASE_URL;

const onInit = (): void => {
  const baseUrl = ENV === "development" ? `http://localhost:${PORT}` : BASE_URL;
  logger.info(
    { env: ENV, baseUrl, envFiles: loadedEnvFiles },
    `Server running in ${ENV} mode on ${baseUrl}`
  );

  void verifyDbConnection();
};

const server = app.listen(PORT, onInit);

const shutdown = (): void => {
  server.close((err?: Error) => {
    void prisma.$disconnect().finally(() => {
      process.exit(err ? 1 : 0);
    });
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("SIGUSR2", shutdown);
