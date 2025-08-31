import { execSync } from "child_process";

module.exports = async () => {
  console.log("Starting db container...");
  try {
    const dbUrl =
      process.env.DATABASE_URL ||
      "postgresql://root:admin@host.docker.internal:5432/jsondb?schema=public";

    execSync("docker-compose -f ../dev.docker-compose.yaml up -d db", {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: dbUrl,
      },
    });
    console.log("db container is running!");

    await new Promise((res) => setTimeout(res, 3000));

    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: dbUrl,
      },
    });
    console.log("Migrations applied!");
  } catch (error) {
    console.error("Error starting db container:", error);
    throw error;
  }
};
