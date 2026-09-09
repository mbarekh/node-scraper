import { aiSearchCompanyInfo } from "./ai-search-company-info";
import { compact } from "../utils/extra-utils";
import { readJSONFile, writeJSONFile } from "../utils/file-utils";
import {
  extractCompanyId,
  getLinkedinUrl,
  parseFollowersCount,
  MIN_FOLLOWERS_COUNT,
} from "../utils/linkedin-utils";
import { googleApi } from "../apis/google-api";
import { downloadLogoApi } from "../apis/logo-api";
import {
  forbiddenIndustries,
  type CompanyInfo,
} from "../model/companies-model";
import { COMPANIES_DATA_FILES } from "./companies-utils";
import { isValidWebsite } from "../utils/domain-utils";

export const scrapeCompaniesInfo = async ({
  updatedCompaniesCount,
}: {
  updatedCompaniesCount: number;
}) => {
  const companiesInfo = readJSONFile<CompanyInfo[]>(
    COMPANIES_DATA_FILES.companiesInfo,
  );
  const smallCompaniesInfo = readJSONFile<CompanyInfo[]>(
    COMPANIES_DATA_FILES.smallCompanies,
  );
  const errorCompaniesInfo = readJSONFile<CompanyInfo[]>(
    COMPANIES_DATA_FILES.errorCompanies,
  );
  const forbiddenCompaniesInfo = readJSONFile<CompanyInfo[]>(
    COMPANIES_DATA_FILES.forbiddenCompanies,
  );
  const companiesInfoUpdated: CompanyInfo[] = [];

  let addedToCompaniesFile = 0;
  let addedToSmallCompaniesFile = 0;
  let addedToErrorCompaniesFile = 0;
  let addedToForbiddenCompaniesFile = 0;

  const websites = new Set<string>(
    compact(companiesInfo.map(({ website }) => website)),
  );
  const linkedinIds = new Set<string>([
    ...compact(companiesInfo.map(({ id: linkedinId }) => linkedinId)),
    ...compact(smallCompaniesInfo.map(({ id: linkedinId }) => linkedinId)),
    ...compact(errorCompaniesInfo.map(({ id: linkedinId }) => linkedinId)),
    ...compact(forbiddenCompaniesInfo.map(({ id: linkedinId }) => linkedinId)),
  ]);

  for (const companyInfo of companiesInfo) {
    if (linkedinIds.has(companyInfo.id) || updatedCompaniesCount === 0) {
      companiesInfoUpdated.push(companyInfo);
      continue;
    }
    updatedCompaniesCount--;
    const googleSearchLinkedins = await googleApi({
      query: `site:linkedin.com/company ${companyInfo.name}`,
      engine: "google",
    });
    if (!googleSearchLinkedins.organic_results?.[0]) {
      companiesInfoUpdated.push(companyInfo);
      continue;
    }
    const {
      link,
      snippet: overview,
      displayed_link,
      sitelinks,
    } = googleSearchLinkedins.organic_results[0];
    const companyId = extractCompanyId(link);
    if (!companyId || linkedinIds.has(companyId)) {
      continue;
    }
    let followersInfo = displayed_link || "";
    const linkedinUrl = getLinkedinUrl(companyId);
    linkedinIds.add(companyId);
    let followers = parseFollowersCount(followersInfo);
    if (followers === -1) {
      const expandedItem = sitelinks?.expanded?.find(
        ({ link, snippet }) =>
          extractCompanyId(link) === companyId &&
          parseFollowersCount(snippet) !== -1,
      );
      followers = parseFollowersCount(expandedItem?.snippet || "");
      followersInfo = expandedItem?.snippet || followersInfo;
    }
    if (0 <= followers && followers < MIN_FOLLOWERS_COUNT) {
      console.log("Adding to small companies file", companyId, followers);
      smallCompaniesInfo.push({
        ...companyInfo,
        id: companyId,
        linkedinUrl,
        followers,
        overview,
        followersInfo,
      });
      addedToSmallCompaniesFile++;
      continue;
    }
    let companyInfoAi = {} as CompanyInfo;
    try {
      companyInfoAi = await aiSearchCompanyInfo({
        companyId,
        overview,
        followers,
      });
    } catch (error) {
      console.error(
        `Error while searching company info for ${companyId}:`,
        (error as Error).message,
      );
    }
    const companyInfoFinal: CompanyInfo = {
      ...companyInfo,
      ...companyInfoAi,
    };
    if ((companyInfoAi.followers ?? 0) < MIN_FOLLOWERS_COUNT) {
      smallCompaniesInfo.push({
        ...companyInfo,
        id: companyId,
        linkedinUrl,
        followers,
        overview,
        followersInfo,
      });
      addedToSmallCompaniesFile++;
      continue;
    }
    if (
      forbiddenIndustries.some(
        (industry) => industry === companyInfoAi.industry,
      )
    ) {
      forbiddenCompaniesInfo.push({
        ...companyInfo,
        ...companyInfoAi,
        id: companyId,
        linkedinUrl,
        followers,
        overview,
      });
      addedToForbiddenCompaniesFile++;
      continue;
    }
    if (
      !isValidWebsite(companyInfoFinal.website) ||
      websites.has(companyInfoFinal.website)
    ) {
      errorCompaniesInfo.push(companyInfoFinal);
      addedToErrorCompaniesFile++;
      continue;
    }
    websites.add(companyInfoFinal.website);
    await downloadLogoApi({
      website: companyInfoFinal.website,
      logoFileName: `${companyId}.png`,
    });
    companiesInfoUpdated.push(companyInfoFinal);
    addedToCompaniesFile++;
  }

  writeJSONFile<CompanyInfo[]>(
    COMPANIES_DATA_FILES.companiesInfo,
    companiesInfoUpdated,
  );
  writeJSONFile<CompanyInfo[]>(
    COMPANIES_DATA_FILES.smallCompanies,
    smallCompaniesInfo,
  );
  writeJSONFile<CompanyInfo[]>(
    COMPANIES_DATA_FILES.errorCompanies,
    errorCompaniesInfo,
  );
  writeJSONFile<CompanyInfo[]>(
    COMPANIES_DATA_FILES.forbiddenCompanies,
    forbiddenCompaniesInfo,
  );

  console.log(
    `Added ${addedToCompaniesFile} companies to ${COMPANIES_DATA_FILES.companiesInfo}`,
  );
  console.log(
    `Added ${addedToSmallCompaniesFile} companies to ${COMPANIES_DATA_FILES.smallCompanies}`,
  );
  console.log(
    `Added ${addedToErrorCompaniesFile} companies to ${COMPANIES_DATA_FILES.errorCompanies}`,
  );
  console.log(
    `Added ${addedToForbiddenCompaniesFile} companies to ${COMPANIES_DATA_FILES.forbiddenCompanies}`,
  );
};
