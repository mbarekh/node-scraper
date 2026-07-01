import { stringifyFunction } from "../utils/extra-utils.ts";
import { ZENROWS_API_KEY } from "./api-keys.ts";
import { load, type CheerioAPI } from "cheerio";
import { fetchApi } from "./fetch-api.ts";

const getScraperParams = ({ url }: { url: string }) => {
  const scrollDown = () => window.scrollTo(0, document.body.scrollHeight);
  const jsInstructions = [{ wait: 2000 }, { evaluate: stringifyFunction(scrollDown) }, { wait: 2000 }];

  return {
    url,
    apikey: ZENROWS_API_KEY!,
    mode: "auto",
    js_instructions: JSON.stringify(jsInstructions),
  };
};

export const scraperApi = async ({ url }: { url: string }): Promise<{ $: CheerioAPI; url: string } | null> => {
  try {
    if (!url) {
      throw new Error(`[${scraperApi.name}]: URL is null`);
    }
    const { data, headers } = await fetchApi.get<string>({
      url: "https://api.zenrows.com/v1/",
      params: getScraperParams({ url }),
      shouldParse: false,
    });

    return {
      $: load(data),
      url: headers.get("zr-final-url") ?? url,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
