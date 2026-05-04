export const safeJsonParse = (str: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(str) as Record<string, unknown>;
  } catch {
    return null;
  }
};
