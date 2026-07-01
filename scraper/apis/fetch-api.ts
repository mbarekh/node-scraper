import { getUrlWithParams } from "../utils/domain-utils.ts";

export const fetchApi = {
  get: async <T>({
    url,
    shouldParse = true,
    params,
  }: {
    url: string;
    shouldParse?: boolean;
    params?: Record<string, any>;
  }): Promise<{ data: T; headers: Headers }> => {
    const urlWithParams = getUrlWithParams({ url, params });
    const response = await fetch(urlWithParams);
    const data: T = shouldParse ? await response.json() : await response.text();
    return {
      data,
      headers: response.headers,
    };
  },
  post: async <T>({
    url,
    payload,
  }: {
    url: string;
    payload?: Record<string, any>;
  }): Promise<{ data: T; headers: Headers }> => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const data: T = await response.json();
    return {
      data,
      headers: response.headers,
    };
  },
};
