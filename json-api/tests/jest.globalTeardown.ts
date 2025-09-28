import { execSync } from "child_process";

export default async () => {
  console.log("🛑 Stopping test database container...");
  try {
    execSync(
      `docker-compose -f ../dev.docker-compose.yaml down -v --remove-orphans`,
      {
        stdio: "inherit",
      }
    );
    console.log("✅ DB container stopped!");
  } catch (error) {
    console.error("❌ Error stopping db container:", error);
  }
};
