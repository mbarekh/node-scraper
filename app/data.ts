import { CompanyInfo } from "@/scraper/model/companies-model";
import { NormalizedSoftwareJobInfo } from "@/scraper/model/jobs-model";
import { readJSONFile } from "@/scraper/utils/file-utils";

export const companiesInfo = readJSONFile<CompanyInfo[]>(
  "scraper/companies/data/companies-info.json",
)
  .filter((companyInfo) => companyInfo.linkedinUrl)
  .slice(0, 50);

export const jobsInfo = readJSONFile<NormalizedSoftwareJobInfo[]>(
  "scraper/jobs/data/jobs-info.json",
);
