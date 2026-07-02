import { scraperApi } from "../apis/scraper-api";
import { toAbsoluteUrl } from "../utils/domain-utils";
import { readJSONFile, writeJSONFile } from "../utils/file-utils";
import { JOBS_DATA_FILES, findAndHandle } from "./jobs-utils";
import { CAREERS_KEYWORDS } from "./jobs-keywords";
import { scrapeCareersPage } from "./scrape-careers-page";
import type {
  HtmlTag,
  ScrapedSoftwareJobsInfoWithListJobsUrl,
} from "../model/jobs-model";
import { scrapePublicAtsDomains } from "./scrape-ats-domains";

export const scrapeWebsitePage = async (
  website: string,
): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  try {
    const websiteScraperApiResponse = await scraperApi({ url: website });
    if (!websiteScraperApiResponse) {
      throw Error(
        `[${scrapeWebsitePage.name}]: Scraper api null response for ${website}`,
      );
    }
    const { $: websiteDom, url: finalWebsiteUrl } = websiteScraperApiResponse;
    let scrapedSoftwareJobsInfoWithListJobsUrl = await scrapePublicAtsDomains({
      $: websiteDom,
    });
    if (scrapedSoftwareJobsInfoWithListJobsUrl) {
      return scrapedSoftwareJobsInfoWithListJobsUrl;
    }

    const careersUrl = await findAndHandle<string>({
      $: websiteDom,
      domSearchParams: [
        {
          keywords: CAREERS_KEYWORDS,
          tags: ["a", "nl-button" as HtmlTag],
          attr: "href",
        },
      ],
      handler: async ({ attrValue }) => {
        return toAbsoluteUrl({ url: finalWebsiteUrl, href: attrValue });
      },
    });
    if (!careersUrl) {
      throw Error(
        `[${scrapeWebsitePage.name}]: No careers URL found for ${website}`,
      );
    }

    const careersScraperApiResponse = await scraperApi({ url: careersUrl });
    if (!careersScraperApiResponse) {
      throw Error(
        `[${scrapeWebsitePage.name}]: Scraper api null response for ${careersUrl}`,
      );
    }
    const { $: careersDOM, url: finalCareersUrl } = careersScraperApiResponse;
    scrapedSoftwareJobsInfoWithListJobsUrl = await scrapeCareersPage({
      $: careersDOM,
      careersUrl: finalCareersUrl,
    });
    if (!scrapedSoftwareJobsInfoWithListJobsUrl) {
      throw Error(
        `[${scrapeWebsitePage.name}]: No jobs url found in ${website}`,
      );
    }
    return scrapedSoftwareJobsInfoWithListJobsUrl;
  } catch (error) {
    console.error(error);
    const data =
      readJSONFile<Array<{ website: string; error: string }>>(
        JOBS_DATA_FILES.careersErrors,
      ) ?? [];
    data.push({ website, error: error?.toString() ?? "" });
    writeJSONFile(JOBS_DATA_FILES.careersErrors, data);
    return null;
  }
};
