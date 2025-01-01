import { Config } from "@/src/entities/config";

export const APP_CONFIG: Config = {
  API_URL: import.meta.env.VITE_API_URL,
  API_PREFIX: import.meta.env.VITE_API_PREFIX,
};
