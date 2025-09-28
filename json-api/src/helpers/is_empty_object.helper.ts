export const isEmptyObject = (str: string): boolean => {
  const regex = /^\{\s*\}$/;
  return regex.test(str);
};
