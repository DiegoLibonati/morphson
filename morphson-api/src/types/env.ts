import type { Env, LogLevel } from "@/types/app";

export interface Envs {
  PORT: number;
  ENV: Env;
  BASE_URL: string;
  DATABASE_URL: string;
  PRISMA_LOG_QUERIES: boolean;
  LOG_LEVEL: LogLevel;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
  BODY_LIMIT: string;
  SEED_DEFAULT_DATA: boolean;
}
