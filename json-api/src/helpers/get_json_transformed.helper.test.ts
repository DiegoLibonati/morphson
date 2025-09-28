import { getJsonTransformed } from "@src/helpers/get_json_transformed.helper";

describe("getJsonTransformed.ts", () => {
  test("It should transform keys that match inputKeys and replace their values from inputKeysAndValues", async () => {
    const inputObject = {
      key1: "input.value1",
      key2: "someOtherValue",
    };
    const inputKeys = ["value1"];
    const inputKeysAndValues = {
      value1: "newValue1",
    };

    const result = await getJsonTransformed(
      inputObject,
      inputKeys,
      inputKeysAndValues
    );

    expect(result).toEqual({
      key1: "newValue1",
      key2: "someOtherValue",
    });
  });

  test("It should transform nested objects correctly", async () => {
    const inputObject = {
      level1: {
        key1: "input.value1",
        key2: "input.value2",
      },
      key3: "input.value3",
    };
    const inputKeys = ["value1", "value3"];
    const inputKeysAndValues = {
      value1: "newValue1",
      value3: "newValue3",
    };

    const result = await getJsonTransformed(
      inputObject,
      inputKeys,
      inputKeysAndValues
    );

    expect(result).toEqual({
      level1: {
        key1: "newValue1",
        key2: "input.value2",
      },
      key3: "newValue3",
    });
  });

  test("It should handle non-object values correctly", async () => {
    const inputObject = {
      key1: "input.value1",
      key2: 123,
      key3: null,
      key4: ["input.value2"],
    };
    const inputKeys = ["value1"];
    const inputKeysAndValues = {
      value1: "newValue1",
    };

    const result = await getJsonTransformed(
      inputObject,
      inputKeys,
      inputKeysAndValues
    );

    expect(result).toEqual({
      key1: "newValue1",
      key2: 123,
      key3: null,
      key4: ["input.value2"],
    });
  });
});
