import { Env, Envs } from "@src/entities/env";

export const envs: Envs = {
  PORT: Number(process.env.PORT) || 3000,
  ENV: (process.env.NODE_ENV as Env) || "development",
  BASE_URL: process.env.BASE_URL as string,
};
