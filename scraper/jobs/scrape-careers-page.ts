import { browserApi } from "../apis/browser-api";
import type {
  PredicateParams,
  PrivateAtsInfo,
  ScrapedSoftwareJobsInfoWithListJobsUrl,
} from "../model/jobs-model";
import { getPathName, hasId, toAbsoluteUrl } from "../utils/domain-utils";
import { readJSONFile, writeJSONFile } from "../utils/file-utils";
import { scrapePublicAtsDomains } from "./scrape-ats-domains";
import {
  PRIVATE_ATS_DOMAINS,
  HASHTAG_CAREERS_KEYWORDS,
  CAREERS_KEYWORDS,
  EXCLUDED_JOBS_KEYWORDS,
  SEARCH_KEYWORDS,
} from "./jobs-keywords";
import {
  acceptCookies,
  buildContainsSelector,
  buildSelector,
  clickAndGetPage,
  JOBS_DATA_FILES,
  findAndHandle,
  selectElementByText,
  selectFromPage,
  waitForDomContentLoaded,
} from "./jobs-utils";
import type { CheerioAPI } from "cheerio";
import {
  scrapeSoftwareJobsInfoFromUrls,
  scrapeSoftwareJobsInfoFromListJobsUrl,
  scrapeSoftwareJobUrlsFromDom,
} from "./scrape-list-jobs-page";

type CareersPageInfo = {
  $: CheerioAPI;
  careersUrl: string;
};

const scrapePrivateAtsDomains = ({
  $,
  careersUrl,
}: CareersPageInfo): Promise<null> => {
  return findAndHandle<null>({
    $,
    domSearchParams: [
      { keywords: PRIVATE_ATS_DOMAINS, tags: ["a"], attr: "href" },
    ],
    handler: async ({ keyword, attrValue }) => {
      console.warn(
        `${scrapePrivateAtsDomains.name}]: Private ATS found for ${careersUrl} with keyword ${keyword}`,
      );
      const privateAtsData =
        readJSONFile<PrivateAtsInfo[]>(JOBS_DATA_FILES.privateAts) ?? [];
      privateAtsData.push({ careersUrl, keyword, attrValue });
      writeJSONFile(JOBS_DATA_FILES.privateAts, privateAtsData);
      return null;
    },
  });
};

const scrapeHashtagKeywords = ({
  $,
  careersUrl,
}: CareersPageInfo): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  return findAndHandle<ScrapedSoftwareJobsInfoWithListJobsUrl>({
    $,
    domSearchParams: [
      { keywords: HASHTAG_CAREERS_KEYWORDS, tags: ["a"], attr: "href" },
    ],
    handler: async () => {
      const listJobsUrl = careersUrl;
      const softwareJobUrls = scrapeSoftwareJobUrlsFromDom({ $, listJobsUrl });
      const scrapedSoftwareJobsInfo =
        await scrapeSoftwareJobsInfoFromUrls(softwareJobUrls);
      return {
        scrapedSoftwareJobsInfo,
        listJobsUrl,
      };
    },
  });
};

const scrapeJobsKeywords = ({
  $,
  careersUrl,
}: CareersPageInfo): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  return findAndHandle<ScrapedSoftwareJobsInfoWithListJobsUrl>({
    $,
    domSearchParams: [
      {
        keywords: CAREERS_KEYWORDS,
        excludedKeywords: EXCLUDED_JOBS_KEYWORDS,
        tags: ["a"],
        attr: "href",
        predicate: ({ keyword, attrValue }: PredicateParams) =>
          toAbsoluteUrl({ url: careersUrl, href: attrValue }) !== careersUrl &&
          getPathName(attrValue).includes(keyword) &&
          !hasId(attrValue),
      },
    ],
    handler: async ({ attrValue }) => {
      const listJobsUrl = toAbsoluteUrl({ url: careersUrl, href: attrValue });
      const scrapedSoftwareJobsInfoWithListJobsUrl =
        await scrapeSoftwareJobsInfoFromListJobsUrl(listJobsUrl);
      return scrapedSoftwareJobsInfoWithListJobsUrl;
    },
  });
};

const scrapeSearchKeywords = ({
  $,
  careersUrl,
}: CareersPageInfo): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  return findAndHandle<ScrapedSoftwareJobsInfoWithListJobsUrl>({
    $,
    domSearchParams: [
      { keywords: SEARCH_KEYWORDS, tags: ["input", "button"], attr: "value" },
      { keywords: SEARCH_KEYWORDS, tags: ["button"], attr: "title" },
    ],
    handler: async ({ keyword, tags, attr }) => {
      const listJobsUrl = await browserApi(async (page) => {
        await page.goto(careersUrl);
        await waitForDomContentLoaded({ page, timeout: 2000 });
        await acceptCookies({ page });
        const selector = buildSelector({ keyword, tags, attr });
        const element = await selectFromPage({ page, selector });
        if (!element) {
          return null;
        }
        const jobsPage = await clickAndGetPage({ element, page });
        return jobsPage.url();
      });
      const scrapedSoftwareJobsInfoWithListJobsUrl =
        await scrapeSoftwareJobsInfoFromListJobsUrl(listJobsUrl);
      return scrapedSoftwareJobsInfoWithListJobsUrl;
    },
  });
};

const scrapeContainSearchKeywords = async ({
  $,
  careersUrl,
}: CareersPageInfo): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  const containsSelector = buildContainsSelector({
    keywords: SEARCH_KEYWORDS,
    tags: ["button"],
  });
  const elements = $(containsSelector);
  if (elements.length === 0) {
    return null;
  }

  const listJobsUrl = await browserApi(async (page) => {
    await page.goto(careersUrl);
    await waitForDomContentLoaded({ page, timeout: 2000 });
    await acceptCookies({ page });
    const element = await selectElementByText({
      page,
      keyword: SEARCH_KEYWORDS[0]!,
      tag: "button",
    });
    if (!element) {
      return null;
    }
    const jobsPage = await clickAndGetPage({ element, page });
    return jobsPage.url();
  });
  const scrapedSoftwareJobsInfoWithListJobsUrl =
    await scrapeSoftwareJobsInfoFromListJobsUrl(listJobsUrl);
  return scrapedSoftwareJobsInfoWithListJobsUrl;
};

const scrapeSoftwareJobsKeywords = async ({
  $,
  careersUrl,
}: CareersPageInfo): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  const listJobsUrl = careersUrl;
  const softwareJobUrls = scrapeSoftwareJobUrlsFromDom({ $, listJobsUrl });
  if (softwareJobUrls.length === 0) {
    return null;
  }
  const scrapedSoftwareJobsInfo =
    await scrapeSoftwareJobsInfoFromUrls(softwareJobUrls);
  return {
    scrapedSoftwareJobsInfo,
    listJobsUrl,
  };
};

export const scrapeCareersPage = async ({
  $,
  careersUrl,
}: CareersPageInfo): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  return (
    (await scrapePublicAtsDomains({ $ })) ??
    (await scrapePrivateAtsDomains({ $, careersUrl })) ??
    (await scrapeHashtagKeywords({ $, careersUrl })) ??
    (await scrapeJobsKeywords({ $, careersUrl })) ??
    (await scrapeSearchKeywords({ $, careersUrl })) ??
    (await scrapeContainSearchKeywords({ $, careersUrl })) ??
    (await scrapeSoftwareJobsKeywords({ $, careersUrl }))
  );
};
