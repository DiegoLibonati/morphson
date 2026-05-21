import { execSync } from "child_process";

import { mockEnvs } from "./__mocks__/envs.mock";

export default (): void => {
  execSync("docker compose -f test.docker-compose.yml up -d --wait", {
    stdio: "inherit",
    env: {
      ...process.env,
      DB_USER: mockEnvs.DB_USER,
      DB_PASSWORD: mockEnvs.DB_PASSWORD,
      DB_NAME: mockEnvs.DB_NAME,
    },
  });

  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: mockEnvs.DATABASE_URL },
  });
};
