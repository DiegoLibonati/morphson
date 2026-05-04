import { getPeers } from "@/helpers/get_peers.helper";

describe("get_peers.helper", () => {
  it("should return an empty object for an empty input", async () => {
    const result: Record<string, unknown> = await getPeers({});

    expect(result).toEqual({});
  });

  it("should return flat keys for a flat object", async () => {
    const result: Record<string, unknown> = await getPeers({ name: "John", age: 30 });

    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should flatten nested objects with dot notation", async () => {
    const result: Record<string, unknown> = await getPeers({ user: { name: "John" } });

    expect(result).toEqual({ "user.name": "John" });
  });

  it("should flatten deeply nested objects", async () => {
    const result: Record<string, unknown> = await getPeers({ a: { b: { c: 42 } } });

    expect(result).toEqual({ "a.b.c": 42 });
  });

  it("should treat arrays as leaf values without recursing", async () => {
    const result: Record<string, unknown> = await getPeers({ tags: ["a", "b"] });

    expect(result).toEqual({ tags: ["a", "b"] });
  });

  it("should handle mixed flat and nested keys", async () => {
    const result: Record<string, unknown> = await getPeers({
      name: "Alice",
      address: { city: "NY", zip: "10001" },
    });

    expect(result).toEqual({
      name: "Alice",
      "address.city": "NY",
      "address.zip": "10001",
    });
  });

  it("should handle null values as leaf values", async () => {
    const result: Record<string, unknown> = await getPeers({ value: null });

    expect(result).toEqual({ value: null });
  });
});
