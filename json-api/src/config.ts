import { Config } from "@/src/entities/config.d";

export const API_CONFIG: Config = {
  PORT: Number(process.env.VITE_PORT) || 3000,
};
