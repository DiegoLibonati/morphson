const EMPTY_OBJECT_RE = /^\{\s*\}$/;

export const isEmptyObject = (str: string): boolean => EMPTY_OBJECT_RE.test(str);
