import type { InputJson } from "@prisma/client";

export const mockInputJson: InputJson = {
  id: 1,
  name: "test-json",
  content: { key: "value" },
  keys: ["key"],
  keysAndValues: { key: "value" },
  createdAt: new Date("2024-01-01T00:00:00Z"),
  updatedAt: new Date("2024-01-01T00:00:00Z"),
};
