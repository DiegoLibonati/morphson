export const getPeers = async (
  object: Record<string, unknown>,
  parentKey = "",
  acc: Record<string, unknown> = {}
): Promise<Record<string, unknown>> => {
  await Promise.all(
    Object.entries(object).map(async ([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        await getPeers(value as Record<string, unknown>, newKey, acc);
        return;
      }

      acc[newKey] = value;
    })
  );

  return acc;
};
