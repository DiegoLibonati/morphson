export const getJsonTransformed = async (
  object: Record<string, unknown>,
  inputKeys: string[],
  inputKeysAndValues: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const entries = await Promise.all(
    Object.entries(object).map(async ([key, value]): Promise<[string, unknown]> => {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return [
          key,
          await getJsonTransformed(value as Record<string, unknown>, inputKeys, inputKeysAndValues),
        ];
      }

      if (typeof value === "string") {
        const valueKey = value.replace("input.", "");
        if (inputKeys.includes(valueKey)) {
          return [key, inputKeysAndValues[valueKey]];
        }
      }

      return [key, value];
    })
  );

  return Object.fromEntries(entries);
};
