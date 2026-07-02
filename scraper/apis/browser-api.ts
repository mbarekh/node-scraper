import ScrapingBrowser, { ProxyCountry } from "@zenrows/browser-sdk";
import { chromium, type Page } from "playwright";
import { ZENROWS_API_KEY } from "./api-keys";

export const browserApi = async <T>(
  fn: (page: Page) => Promise<T>,
): Promise<T> => {
  const scrapingBrowser = new ScrapingBrowser({ apiKey: ZENROWS_API_KEY });
  const connectionURL = scrapingBrowser.getConnectURL({
    proxy: { location: ProxyCountry.US },
  });
  const browser = await chromium.connectOverCDP(connectionURL);
  const page = await browser.newPage();

  try {
    return await fn(page);
  } catch (error) {
    console.error("Browser API error:", error);
    return {} as T;
  } finally {
    await browser.close();
  }
};
