import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { parse } from "dotenv";

const readEnvFile = (file: string): string | null => {
  try {
    return readFileSync(resolve(process.cwd(), file), "utf-8");
  } catch {
    return null;
  }
};

const resolveMode = (): string => {
  const processMode = process.env.NODE_ENV?.trim();
  if (processMode) return processMode;

  for (const file of [".env.local", ".env"]) {
    const content = readEnvFile(file);
    if (content === null) continue;

    const fileMode = parse(content).NODE_ENV?.trim();
    if (fileMode) return fileMode;
  }

  return "development";
};

export const getEnvFileCandidates = (mode: string): string[] => {
  // In test mode a developer's local .env/.env.local must never affect results
  if (mode === "test") return [".env.test.local", ".env.test"];

  return [`.env.${mode}.local`, ".env.local", `.env.${mode}`, ".env"];
};

export const loadEnvFiles = (): string[] => {
  const mode = resolveMode();
  const loadedFiles: string[] = [];

  for (const file of getEnvFileCandidates(mode)) {
    const content = readEnvFile(file);
    if (content === null) continue;

    for (const [key, value] of Object.entries(parse(content))) {
      process.env[key] ??= value;
    }

    loadedFiles.push(file);
  }

  return loadedFiles;
};
