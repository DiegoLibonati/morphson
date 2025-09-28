export const getPeers = (
  object: Object,
  parentKey: string = "",
  acc: Record<string, unknown> = {}
): Promise<Record<string, unknown>> => {
  return new Promise(async (resolve, reject) => {
    try {
      for (const [key, value] of Object.entries(object)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof value === "object" && value && !Array.isArray(value)) {
          await getPeers(value, newKey, acc);
          continue;
        }

        acc[newKey] = value;
        continue;
      }

      resolve(acc);
    } catch (e) {
      reject(e);
    }
  });
};
