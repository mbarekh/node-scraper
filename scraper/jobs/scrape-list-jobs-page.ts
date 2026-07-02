import { scraperApi } from "../apis/scraper-api";
import type {
  ScrapedSoftwareJobInfo,
  ScrapedSoftwareJobsInfoWithListJobsUrl,
} from "../model/jobs-model";
import { hasId, toAbsoluteUrl } from "../utils/domain-utils";
import { wait, randomNumber } from "../utils/extra-utils";
import { EXCLUDED_JOBS_KEYWORDS } from "./jobs-keywords";
import {
  buildSelector,
  hasSoftwareKeyword,
  optimizeContentForAI,
} from "./jobs-utils";
import type { CheerioAPI } from "cheerio";
import {
  mapToPublicAtsDomain,
  PUBLIC_ATS_DOMAINS_SCRAPERS,
  scrapePublicAtsDomains,
} from "./scrape-ats-domains";

export const scrapeSoftwareJobUrlsFromDom = ({
  $,
  listJobsUrl,
}: {
  $: CheerioAPI;
  listJobsUrl: string;
}): string[] => {
  const selector = buildSelector({
    tags: ["a"],
    attr: "href",
    keyword: "",
    excludedKeywords: EXCLUDED_JOBS_KEYWORDS,
  });
  return $(selector)
    .toArray()
    .map((node) => ({ node, href: $(node).attr("href") ?? "" }))
    .filter(({ href }) => hasId(href) || hasSoftwareKeyword(href))
    .map(({ node, href }) => ({
      description: $(node.parentNode ?? node)
        .text()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim(),
      href,
    }))
    .filter(({ description }) => hasSoftwareKeyword(description))
    .map(({ href = "" }) => toAbsoluteUrl({ url: listJobsUrl, href }));
};

export const scrapeSoftwareJobsInfoFromUrls = async (
  softwareJobUrls: string[],
): Promise<ScrapedSoftwareJobInfo[]> => {
  const softwareJobsInfo: ScrapedSoftwareJobInfo[] = [];
  for (const softwareJobUrl of softwareJobUrls) {
    const scraperApiResponse = await scraperApi({ url: softwareJobUrl });
    if (!scraperApiResponse) {
      continue;
    }
    softwareJobsInfo.push({
      url: softwareJobUrl,
      content: optimizeContentForAI(scraperApiResponse.$),
    });
    await wait(randomNumber({ min: 2000, max: 5000 }));
  }
  return softwareJobsInfo;
};

export const scrapeSoftwareJobsInfoFromListJobsUrl = async (
  listJobsUrl: string | null,
): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  if (!listJobsUrl) {
    return null;
  }
  const publicAtsDomain = mapToPublicAtsDomain(listJobsUrl);
  if (publicAtsDomain) {
    return await PUBLIC_ATS_DOMAINS_SCRAPERS[publicAtsDomain](listJobsUrl);
  }

  const jobsScraperApiResponse = await scraperApi({ url: listJobsUrl });
  if (!jobsScraperApiResponse) {
    throw Error(
      `[${scrapeSoftwareJobsInfoFromListJobsUrl.name}]: Scraper api null response for ${listJobsUrl}`,
    );
  }
  let scrapedSoftwareJobsInfoWithListJobsUrl = await scrapePublicAtsDomains({
    $: jobsScraperApiResponse.$,
  });
  if (scrapedSoftwareJobsInfoWithListJobsUrl) {
    return scrapedSoftwareJobsInfoWithListJobsUrl;
  }
  const softwareJobUrls = scrapeSoftwareJobUrlsFromDom({
    $: jobsScraperApiResponse.$,
    listJobsUrl,
  });
  const scrapedSoftwareJobsInfo =
    await scrapeSoftwareJobsInfoFromUrls(softwareJobUrls);
  return {
    scrapedSoftwareJobsInfo,
    listJobsUrl,
  };
};
