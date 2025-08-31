import { execSync } from "child_process";

module.exports = async () => {
  console.log("Stopping db container...");
  try {
    execSync(
      `docker-compose -f ../dev.docker-compose.yaml down -v --remove-orphans`,
      {
        stdio: "inherit",
      }
    );
    console.log("db container stopped!");
  } catch (error) {
    console.error("Error stopping db container:", error);
  }
};
