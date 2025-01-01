
import { execSync } from "child_process";

module.exports = async () => {
  console.log("Stopping db container...");
  try {
    // Detiene el contenedor db
    execSync("docker-compose down", { stdio: "inherit" });
    console.log("db container stopped!");
  } catch (error) {
    console.error("Error stopping db container:", error);
  }
};
