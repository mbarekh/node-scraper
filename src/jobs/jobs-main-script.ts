import { readJSONFile, writeJSONFile } from "../utils/file-utils.ts";
import { JOBS_DATA_FILES } from "./jobs-utils.ts";
import { normalizeSoftwareJobsInfo } from "./normalize-software-jobs.ts";
import { scrapeWebsitePage } from "./scrape-website-page.ts";
import type { CompanyInfo } from "../model/companies-model.ts";
import type { NormalizedSoftwareJobInfo, ScrapedSoftwareJobsInfoWithListJobsUrl } from "../model/jobs-model.ts";
import { COMPANIES_DATA_FILES } from "../companies/companies-utils.ts";
import { getToday, isLessThanFourMonths } from "../utils/extra-utils.ts";
import { scrapeSoftwareJobsInfoFromListJobsUrl } from "./scrape-list-jobs-page.ts";

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
