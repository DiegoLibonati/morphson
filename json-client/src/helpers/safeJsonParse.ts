export const safeJsonParse = (str: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};
