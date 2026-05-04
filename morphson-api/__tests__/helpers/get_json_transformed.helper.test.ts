import { getJsonTransformed } from "@/helpers/get_json_transformed.helper";

describe("get_json_transformed.helper", () => {
  const inputKeys: string[] = ["name", "age", "address.city"];
  const inputKeysAndValues: Record<string, unknown> = {
    name: "World",
    age: 30,
    "address.city": "New York",
  };

  it("should return an empty object for an empty input", async () => {
    const result: Record<string, unknown> = await getJsonTransformed({}, [], {});

    expect(result).toEqual({});
  });

  it("should replace string values that match an input key after stripping 'input.' prefix", async () => {
    const result: Record<string, unknown> = await getJsonTransformed(
      { greeting: "input.name" },
      inputKeys,
      inputKeysAndValues
    );

    expect(result).toEqual({ greeting: "World" });
  });

  it("should keep string values that do not match any input key", async () => {
    const result: Record<string, unknown> = await getJsonTransformed(
      { note: "static-value" },
      inputKeys,
      inputKeysAndValues
    );

    expect(result).toEqual({ note: "static-value" });
  });

  it("should keep non-string primitive values as-is", async () => {
    const result: Record<string, unknown> = await getJsonTransformed(
      { count: 42, active: true },
      inputKeys,
      inputKeysAndValues
    );

    expect(result).toEqual({ count: 42, active: true });
  });

  it("should recurse into nested objects", async () => {
    const result: Record<string, unknown> = await getJsonTransformed(
      { user: { fullName: "input.name", years: "input.age" } },
      inputKeys,
      inputKeysAndValues
    );

    expect(result).toEqual({ user: { fullName: "World", years: 30 } });
  });

  it("should treat arrays as leaf values without recursing", async () => {
    const result: Record<string, unknown> = await getJsonTransformed(
      { tags: ["input.name", "static"] },
      inputKeys,
      inputKeysAndValues
    );

    expect(result).toEqual({ tags: ["input.name", "static"] });
  });

  it("should handle multiple replacements at the same level", async () => {
    const result: Record<string, unknown> = await getJsonTransformed(
      { field1: "input.name", field2: "input.age" },
      inputKeys,
      inputKeysAndValues
    );

    expect(result).toEqual({ field1: "World", field2: 30 });
  });
});
