import { prisma } from "@/configs/prisma.config";
import { prisma as prismaAgain } from "@/configs/prisma.config";

describe("prisma.config", () => {
  it("should export a PrismaClient instance", () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe("function");
    expect(typeof prisma.$disconnect).toBe("function");
    expect(typeof prisma.$transaction).toBe("function");
  });

  it("should export the same instance on repeated imports (singleton)", () => {
    expect(prisma).toBe(prismaAgain);
  });
});
