export const getDomain = (url: string): string | null => {
  if (!isValidWebsite(url)) {
    return null;
  }
  return new URL(normalizeWebsite(url)!).hostname;
};

export const normalizeWebsite = (url: string): string | null => {
  if (!isValidWebsite(url)) {
    return null;
  }
  url = url.replace(/^(https?:\/\/)?(www\.)?/, "");
  const normalizedUrl = `https://${url}`;
  return normalizedUrl;
};

export const isValidWebsite = (url: string): boolean => {
  return /^(https?:\/\/)?(www\.)?([a-zA-Z0-9:#-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9._~:/?#\[\]@!$&'()*+,;=-]*)?$/i.test(
    url,
  );
};

export const getPathName = (url: string): string => {
  try {
    const fullUrl = new URL(url);
    return fullUrl.pathname;
  } catch {
    return url;
  }
};

export const hasId = (url: string = ""): boolean => {
  const numericIdRegex = /\d{6,}/;
  const guidLikeRegex = /[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{4,}/i;
  return numericIdRegex.test(url) || guidLikeRegex.test(url);
};

export const getCompanyName = (url: string): string => {
  const hostname = new URL(normalizeWebsite(url)!).hostname;
  return hostname.split(".")?.[0] ?? "";
};

export const toAbsoluteUrl = ({
  url,
  href,
}: {
  url: string;
  href: string;
}): string => {
  if (!href) {
    return url;
  }
  if (/^https:\/\//i.test(href)) {
    return href;
  }
  return new URL(href, url).href;
};

export const extractCompanyName = ({
  url,
  regexes,
}: {
  url: string;
  regexes: RegExp[];
}): string => {
  const companyName =
    regexes.map((r) => url.match(r)?.[1]).find(Boolean) ?? null;
  if (!companyName) {
    throw Error(
      `[${extractCompanyName.name}]: URL ${url} does not match expected pattern`,
    );
  }
  return companyName;
};

export const getUrlWithParams = ({
  url,
  params,
}: {
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
}): string => {
  if (!/^https:\/\//i.test(url)) {
    return "";
  }
  const urlWithParams = new URL(url);
  if (params) {
    urlWithParams.search = new URLSearchParams(params).toString();
  }
  return urlWithParams.toString();
};
