export const getJsonTransformed = (
  object: Object,
  inputKeys: string[],
  inputKeysAndValues: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(object)) {
        if (typeof value === "object" && value && !Array.isArray(value)) {
          result[key] = await getJsonTransformed(
            value,
            inputKeys,
            inputKeysAndValues
          );
          continue;
        }

        const valueKey =
          typeof value === "string"
            ? (value as string).replace("input.", "")
            : value;

        if (!inputKeys.includes(valueKey)) {
          result[key] = value;
          continue;
        }

        result[key] = inputKeysAndValues[valueKey];
        continue;
      }

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
