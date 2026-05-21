import { z } from "zod";

import type { Envs } from "@/types/env";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5050),
  BASE_URL: z.string().default(""),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_SCHEMA: z.string().default("public"),
  PRISMA_LOG_QUERIES: z.stringbool().default(false),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().nonnegative().default(0),
  BODY_LIMIT: z.string().default("1gb"),
  SEED_DEFAULT_DATA: z.stringbool().default(false),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SCHEMA } = parsed.data;

export const envs: Envs = {
  ENV: parsed.data.NODE_ENV,
  PORT: parsed.data.PORT,
  BASE_URL: parsed.data.BASE_URL,
  DATABASE_URL: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}`,
  PRISMA_LOG_QUERIES: parsed.data.PRISMA_LOG_QUERIES,
  LOG_LEVEL: parsed.data.LOG_LEVEL,
  RATE_LIMIT_WINDOW_MS: parsed.data.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX: parsed.data.RATE_LIMIT_MAX,
  BODY_LIMIT: parsed.data.BODY_LIMIT,
  SEED_DEFAULT_DATA: parsed.data.SEED_DEFAULT_DATA,
};
