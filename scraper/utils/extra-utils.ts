export const compact = <T>(arr: Array<T | null | undefined>): T[] => {
  return arr.filter((item): item is T => Boolean(item));
};

export const stringifyFunction = (fn: () => void): string => {
  return `(${fn.toString()})()`;
};

export const wait = async (delay: number): Promise<void> => {
  await new Promise((res) => setTimeout(res, delay));
};

export const randomNumber = ({ min, max }: { min: number; max: number }): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const trim = (s: string | null): string => {
  return s?.replace(/\s+/g, " ").trim() ?? "";
};

export const lowerCaseTrim = (s: string | null): string => {
  return trim(s).toLowerCase();
};

export const getToday = (): string => {
  return new Date().toISOString().split("T")[0]!;
};

export const isLessThanFourMonths = (date: string | undefined): boolean => {
  if (!date) {
    return false;
  }
  const inputDate = new Date(date);
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
  return inputDate > fourMonthsAgo;
};

export const uniq = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};
