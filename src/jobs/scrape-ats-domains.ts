import type {
  AshbyhqJobResponse,
  GreenhouseResponse,
  LeverResponse,
  MyworkdayJobPostingResponse,
  MyworkdayResponse,
  WorkableResponse,
} from "../model/ats-model.ts";
import { extractCompanyName, getUrlWithParams } from "../utils/domain-utils.ts";
import type { ScrapedSoftwareJobInfo, ScrapedSoftwareJobsInfoWithListJobsUrl } from "../model/jobs-model.ts";
import { findAndHandle, hasSoftwareKeyword, optimizeContentForAI } from "./jobs-utils.ts";
import { compact, randomNumber, wait } from "../utils/extra-utils.ts";
import { fetchApi } from "../apis/fetch-api.ts";
import { decode } from "html-entities";
import { load, type CheerioAPI } from "cheerio";
import { PUBLIC_ATS_DOMAINS, type ATS_DOMAIN_KEY } from "./jobs-keywords.ts";
import { scraperApi } from "../apis/scraper-api.ts";

const scrapeSoftwareJobsGreenhouse = async (url: string): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  const regexes = [
    /^https:\/\/job-boards\.greenhouse\.io\/embed\/job_board\?for=([a-z0-9_\-\.]+)/i,
    /^https:\/\/job-boards\.greenhouse\.io\/([a-z0-9_\-\.]+)\/jobs\/\d+/i,
    /^https:\/\/boards-api\.greenhouse\.io\/v1\/boards\/([a-z0-9_\-\.]+)\/departments/i,
    /^https:\/\/boards-api\.greenhouse\.io\/v1\/boards\/([a-z0-9_\-\.]+)\/jobs/i,
  ];
  try {
    const companyName = extractCompanyName({ url, regexes });
    const listJobsUrl = getUrlWithParams({
      url: `https://boards-api.greenhouse.io/v1/boards/${companyName}/jobs`,
      params: { content: true },
    });
    const { data } = await fetchApi.get<GreenhouseResponse>({ url: listJobsUrl });
    const scrapedSoftwareJobsInfo: ScrapedSoftwareJobInfo[] = data.jobs
      .filter((jobInfo) => hasSoftwareKeyword(jobInfo.title))
      .map((jobInfo) => ({
        url: jobInfo.absolute_url,
        publishedAt: jobInfo.updated_at,
        title: jobInfo.title,
        location: jobInfo.location.name,
        content: optimizeContentForAI(load(decode(jobInfo.content).replace(/\n/g, ""))),
      }));
    return {
      scrapedSoftwareJobsInfo,
      listJobsUrl,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const scrapeSoftwareJobsAshbyhq = async (url: string): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  try {
    const regexes = [
      /^https:\/\/jobs\.ashbyhq\.com\/([a-z0-9_\-\.]+)/i,
      /^https:\/\/api\.ashbyhq\.com\/posting-api\/job-board\/([a-z0-9_\-\.]+)/i,
    ];
    const companyName = extractCompanyName({ url, regexes });
    const listJobsUrl = getUrlWithParams({
      url: `https://api.ashbyhq.com/posting-api/job-board/${companyName}`,
      params: { includeCompensation: true },
    });
    const { data } = await fetchApi.get<AshbyhqJobResponse>({ url: listJobsUrl });
    const scrapedSoftwareJobsInfoWithoutSalaries: ScrapedSoftwareJobInfo[] = data.jobs
      .filter((jobInfo) => hasSoftwareKeyword(jobInfo.title) && !jobInfo.compensation.compensationTierSummary)
      .map((jobInfo) => ({
        url: jobInfo.jobUrl,
        publishedAt: jobInfo.publishedAt,
        title: jobInfo.title,
        location: [jobInfo.location, jobInfo.secondaryLocations.map(({ location }) => location)].join(","),
        content: jobInfo.descriptionPlain,
        workplaceType: jobInfo.workplaceType,
        employmentType: jobInfo.employmentType,
        salaryRange: jobInfo.compensation.compensationTierSummary,
      }));
    const jobUrlsWithSalaries = data.jobs
      .filter((jobInfo) => hasSoftwareKeyword(jobInfo.title) && jobInfo.compensation.compensationTierSummary)
      .map(({ jobUrl }) => jobUrl);
    const scrapedSoftwareJobsInfoWithSalaries: ScrapedSoftwareJobInfo[] = [];
    for (const jobUrl of jobUrlsWithSalaries) {
      const content = await scraperApi({ url: jobUrl });
      if (!content) {
        continue;
      }
      scrapedSoftwareJobsInfoWithSalaries.push({
        url: jobUrl,
        content: optimizeContentForAI(content.$),
      });
      await wait(randomNumber({ min: 2000, max: 5000 }));
    }
    const scrapedSoftwareJobsInfo: ScrapedSoftwareJobInfo[] = [
      ...scrapedSoftwareJobsInfoWithoutSalaries,
      ...scrapedSoftwareJobsInfoWithSalaries,
    ];
    return {
      scrapedSoftwareJobsInfo,
      listJobsUrl,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const scrapeSoftwareJobsLever = async (url: string): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  try {
    const regexes = [
      /^https:\/\/jobs\.lever\.co\/([a-z0-9_\-\.]+)/i,
      /^https:\/\/api\.lever\.co\/v0\/postings\/([a-z0-9_\-\.]+)/i,
    ];
    const companyName = extractCompanyName({ url, regexes });
    const listJobsUrl = getUrlWithParams({
      url: `https://api.lever.co/v0/postings/${companyName}`,
      params: { mode: "json" },
    });
    const { data } = await fetchApi.get<LeverResponse>({ url: listJobsUrl });
    const scrapedSoftwareJobsInfo: ScrapedSoftwareJobInfo[] = data
      .filter((jobInfo) => hasSoftwareKeyword(jobInfo.text))
      .map((jobInfo) => {
        const content = compact([
          jobInfo.description,
          ...jobInfo.lists.map((item) => `<h3>${item.text}</h3>${item.content}`),
        ])
          .join(" ")
          .replace(/\n/g, "");
        return {
          url: jobInfo.hostedUrl,
          publishedAt: new Date(jobInfo.createdAt).toString(),
          title: jobInfo.text,
          location: jobInfo.categories.location,
          content: optimizeContentForAI(load(content)),
          workplaceType: jobInfo.workplaceType,
          salaryRange: JSON.stringify(jobInfo.salaryRange),
        };
      });
    return {
      scrapedSoftwareJobsInfo,
      listJobsUrl,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const scrapeSoftwareJobsWorkable = async (url: string): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  try {
    const regexes = [
      /^https:\/\/apply\.workable\.com\/([a-z0-9_\-\.]+)/i,
      /^https:\/\/apply\.workable\.com\/api\/v1\/widget\/accounts\/([a-z0-9_\-\.]+)/i,
    ];
    const companyName = extractCompanyName({ url, regexes });
    const listJobsUrl = getUrlWithParams({
      url: `https://apply.workable.com/api/v1/widget/accounts/${companyName}`,
      params: { details: true },
    });
    const { data } = await fetchApi.get<WorkableResponse>({ url: listJobsUrl });
    const scrapedSoftwareJobsInfo: ScrapedSoftwareJobInfo[] = data.jobs
      .filter((job) => hasSoftwareKeyword(job.title))
      .map((job) => ({
        url: job.url,
        publishedAt: job.created_at,
        title: job.title,
        location: `${job.country} ${job.city}`,
        content: optimizeContentForAI(load(job.description.replace(/\n/g, ""))),
        employmentType: job.employment_type,
      }));
    return {
      scrapedSoftwareJobsInfo,
      listJobsUrl,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const scrapeSoftwareJobsMyworkdayjobs = async (url: string): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  try {
    const regexes = [
      /https:\/\/([a-z0-9_\-\.]+)\.([a-z0-9_\-\.]+)\.myworkdayjobs.com\/([a-z0-9_\-\.]+)/i,
      /https:\/\/([a-z0-9_\-\.]+)\.([a-z0-9_\-\.]+)\.myworkdayjobs.com\/wday\/cxs\/([a-z0-9_\-\.]+)/i,
    ];
    const match = regexes.map((r) => url.match(r)).find(Boolean) ?? null;
    if (!match || !match[1] || !match[2] || !match[3]) {
      throw Error(`[${scrapeSoftwareJobsMyworkdayjobs.name}]: URL ${url} does not match expected pattern`);
    }
    const [, tenant, wdServer, site] = match;
    const rootUrl = `https://${tenant}.${wdServer}.myworkdayjobs.com/wday/cxs/${tenant}/${site}`;
    const listJobsUrl = `${rootUrl}/jobs`;
    const { data } = await fetchApi.post<MyworkdayResponse>({
      url: listJobsUrl,
      payload: { appliedFacets: {}, limit: 20, offset: 0 },
    });
    const softwarejobUrls = data.jobPostings
      .filter((jobInfo) => hasSoftwareKeyword(jobInfo.title))
      .map((jobInfo) => `${rootUrl}${jobInfo.externalPath}`);

    const scrapedSoftwareJobsInfo: ScrapedSoftwareJobInfo[] = [];
    for (const softwarejobUrl of softwarejobUrls) {
      await wait(randomNumber({ min: 2000, max: 5000 }));
      const { data } = await fetchApi.get<MyworkdayJobPostingResponse>({ url: softwarejobUrl });
      const jobInfo = data.jobPostingInfo;
      if (!jobInfo.canApply) {
        continue;
      }
      scrapedSoftwareJobsInfo.push({
        url: jobInfo.externalUrl,
        title: jobInfo.title,
        content: optimizeContentForAI(load(jobInfo.jobDescription.replace(/\n/g, ""))),
        location: `${jobInfo.country.descriptor} ${jobInfo.location}`,
        publishedAt: jobInfo.postedOn,
        employmentType: jobInfo.timeType,
      });
    }
    return {
      scrapedSoftwareJobsInfo,
      listJobsUrl,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const PUBLIC_ATS_DOMAINS_SCRAPERS = {
  "greenhouse.io": scrapeSoftwareJobsGreenhouse,
  "ashbyhq.com": scrapeSoftwareJobsAshbyhq,
  "lever.co": scrapeSoftwareJobsLever,
  "workable.com": scrapeSoftwareJobsWorkable,
  "myworkdayjobs.com": scrapeSoftwareJobsMyworkdayjobs,
};

export const scrapePublicAtsDomains = ({
  $,
}: {
  $: CheerioAPI;
}): Promise<ScrapedSoftwareJobsInfoWithListJobsUrl | null> => {
  return findAndHandle<ScrapedSoftwareJobsInfoWithListJobsUrl>({
    $,
    domSearchParams: [
      { keywords: PUBLIC_ATS_DOMAINS, tags: ["a", "link"], attr: "href" },
      { keywords: PUBLIC_ATS_DOMAINS, tags: ["iframe"], attr: "src" },
    ],
    handler: async ({ keyword, attrValue }) => {
      return await PUBLIC_ATS_DOMAINS_SCRAPERS[keyword as ATS_DOMAIN_KEY](attrValue);
    },
  });
};

export const mapToPublicAtsDomain = (url: string | undefined = ""): ATS_DOMAIN_KEY | null => {
  const atsDomain = Object.keys(PUBLIC_ATS_DOMAINS_SCRAPERS).find((atsDomain) => url.includes(atsDomain));
  return (atsDomain as ATS_DOMAIN_KEY) ?? null;
};
