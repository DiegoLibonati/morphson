import { execSync } from "child_process";

module.exports = async () => {
  console.log("Starting db container...");
  try {
    // Levanta el contenedor db si no está corriendo
    execSync("docker-compose up -d db", { stdio: "inherit" });
    console.log("db container is running!");
  } catch (error) {
    console.error("Error starting db container:", error);
    throw error;
  }
};
