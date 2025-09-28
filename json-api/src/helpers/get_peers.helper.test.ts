import { getPeers } from "@src/helpers/get_peers.helper";

describe("getPeers.ts", () => {
  test("It should flatten an object with nested properties", async () => {
    const inputObject = {
      level1: {
        level2: {
          key1: "value1",
          key2: "value2",
        },
        key3: "value3",
      },
      key4: "value4",
    };

    const result = await getPeers(inputObject);

    expect(result).toEqual({
      "level1.level2.key1": "value1",
      "level1.level2.key2": "value2",
      "level1.key3": "value3",
      key4: "value4",
    });
  });

  test("It should handle an empty object", async () => {
    const inputObject = {};

    const result = await getPeers(inputObject);

    expect(result).toEqual({});
  });

  test("It should handle non-object values at the root level", async () => {
    const inputObject = {
      key1: "value1",
      key2: 123,
      key3: null,
      key4: [1, 2, 3],
    };

    const result = await getPeers(inputObject);

    expect(result).toEqual({
      key1: "value1",
      key2: 123,
      key3: null,
      key4: [1, 2, 3],
    });
  });

  test("It should handle nested objects with arrays correctly", async () => {
    const inputObject = {
      level1: {
        key1: "value1",
        key2: ["value2", "value3"],
      },
    };

    const result = await getPeers(inputObject);

    expect(result).toEqual({
      "level1.key1": "value1",
      "level1.key2": ["value2", "value3"],
    });
  });

  test("It should reject with an error if the function fails", async () => {
    const inputObject = {
      key1: "value1",
    };

    jest.spyOn(Object, "entries").mockImplementationOnce(() => {
      throw new Error("Mocked failure");
    });

    await expect(getPeers(inputObject)).rejects.toThrow("Mocked failure");

    jest.restoreAllMocks();
  });
});
