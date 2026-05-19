import { readJSONFile, writeJSONFile } from "../utils/file-utils.ts";
import { JOBS_DATA_FILES } from "./jobs-utils.ts";
import { normalizeSoftwareJobsInfo } from "./normalize-software-jobs.ts";
import { scrapeWebsitePage } from "./scrape-website-page.ts";
import type { CompanyInfo } from "../model/companies-model.ts";
import type { NormalizedSoftwareJobInfo, ScrapedSoftwareJobsInfoWithListJobsUrl } from "../model/jobs-model.ts";
import { COMPANIES_DATA_FILES } from "../companies/companies-utils.ts";
import { getToday, isLessThanFourMonths } from "../utils/extra-utils.ts";
import { scrapeSoftwareJobsInfoFromListJobsUrl } from "./scrape-list-jobs-page.ts";
import { mapToPublicAtsDomain, PUBLIC_ATS_DOMAINS_SCRAPERS } from "./scrape-ats-domains.ts";

const jobsInfo = readJSONFile<NormalizedSoftwareJobInfo[]>(JOBS_DATA_FILES.jobsInfo) ?? [];
const companiesInfo = readJSONFile<CompanyInfo[]>(COMPANIES_DATA_FILES.companiesInfo);
const updatedCompaniesInfo: CompanyInfo[] = [];

let scrapedCompaniesCount = parseInt(process.argv[2] ?? "") ?? 0;
let jobsInfoCount = jobsInfo.length;
let updatedCompaniesInfoCount = 0;

for (const companyInfo of companiesInfo) {
  if (!scrapedCompaniesCount || !companyInfo.id || isLessThanFourMonths(companyInfo.lastScrapedAt)) {
    updatedCompaniesInfo.push(companyInfo);
    continue;
  }
  scrapedCompaniesCount--;
  let scrapedSoftwareJobsInfoWithListJobsUrl: ScrapedSoftwareJobsInfoWithListJobsUrl | null = null;

  scrapedSoftwareJobsInfoWithListJobsUrl = companyInfo.listJobsUrl
    ? await scrapeSoftwareJobsInfoFromListJobsUrl(companyInfo.listJobsUrl)
    : await scrapeWebsitePage(companyInfo.website);

  if (!scrapedSoftwareJobsInfoWithListJobsUrl) {
    updatedCompaniesInfo.push(companyInfo);
  } else {
    updatedCompaniesInfoCount++;
    const { scrapedSoftwareJobsInfo, listJobsUrl } = scrapedSoftwareJobsInfoWithListJobsUrl;
    updatedCompaniesInfo.push({ ...companyInfo, listJobsUrl, lastScrapedAt: getToday() });
    const normalizedSoftwareJobsInfo = await normalizeSoftwareJobsInfo({
      scrapedSoftwareJobsInfo,
      companyId: companyInfo.id,
    });
    jobsInfo.push(...normalizedSoftwareJobsInfo);
  }
}

writeJSONFile<CompanyInfo[]>(COMPANIES_DATA_FILES.companiesInfo, updatedCompaniesInfo);
writeJSONFile<NormalizedSoftwareJobInfo[]>(JOBS_DATA_FILES.jobsInfo, jobsInfo);

console.log(`Updated ${updatedCompaniesInfoCount} companiesInfo in ${COMPANIES_DATA_FILES.companiesInfo}`);
console.log(`Added ${jobsInfo.length - jobsInfoCount} jobs in ${JOBS_DATA_FILES.jobsInfo}`);

// add states USA
// add more busineesRegion in prompt and double check location prompt
// Use codex to add some city in the US and other locaiton like Emirate, Brazil (cf kraken)
// unsucribe zenrows (before 24 MAY 2026)
// type token calculation for map cities, countries...

// make stats to know which skills send to the frontend

// AI salary estimation (brave/google api + openAI)
// remove B2B
// fix compagnies industry
// verify AI error for companyInfo
// github repo
// SERP-API TODOOOOO update for loop instead of first element
// domain fullstackjobs.io to buy
// expand countries/cities map using AI

// dont forget worlwide case in the filtering process
// Pagination jobs if new url
// Log for each found case to establish stats
// remove big tech companies of companies.json???
// search public ats in job description and then link every ats link job to the official job post (ex: pandadoc greenhouse)

// const websites = [
// "https://zenrows.com",
// "https://duolingo.com",
// "https://kraken.com",
// "https://kpler.com",
// "https://verneek.com",
// "https://castandcrew.com",
// "https://chime.com",
// "https://kraken.tech",
// "https://doctolib.fr",
// "https://datadoghq.com",
// "https://atomicsemi.com",
// "https://softworldinc.com",
// "https://pandadoc.com",
// ];
