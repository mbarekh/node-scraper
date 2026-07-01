export const MIN_FOLLOWERS_COUNT = 5_000;

export const extractLinkedinId = (url: string): string | null => {
  if (!url) return null;

  const match = url.match(/linkedin\.com\/company\/([^\/?#]+)/i);
  return match?.[1]?.toLowerCase() ?? null;
};

export const getLinkedinUrl = (linkedinId: string): string => {
  return `https://linkedin.com/company/${linkedinId}`;
};

export const parseFollowersCount = (text: string) => {
  if (typeof text !== "string" || !text) return -1;

  const match = text.match(/([\d,.]+)\s*([kmb])?\+?\s*(linkedin\s+)?follower/i);
  if (!match || !match[1]) return -1;

  let value = parseFloat(match[1]?.replace(/,/g, ""));
  const suffix = match[2]?.toLowerCase();

  if (suffix === "k") value *= 1_000;
  if (suffix === "m") value *= 1_000_000;
  if (suffix === "b") value *= 1_000_000_000;

  return Math.round(value);
};
