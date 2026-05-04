import type { OutputJson } from "@prisma/client";

export const mockOutputJson: OutputJson = {
  id: 1,
  name: "test-output",
  transformationModel: { firstName: "input.name" },
  createdAt: new Date("2024-01-01T00:00:00Z"),
  updatedAt: new Date("2024-01-01T00:00:00Z"),
};
