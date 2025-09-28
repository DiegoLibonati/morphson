import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Running prisma db push (dev mode)...");
      execSync("npx prisma db push", { stdio: "inherit" });
    } else if (process.env.NODE_ENV === "production") {
      console.log("🚀 Running prisma migrate deploy (prod mode)...");
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
    }
    console.log("✅ Database is up to date");
  } catch (err) {
    console.error("❌ Error initializing DB", err);
  }
})();

export default prisma;