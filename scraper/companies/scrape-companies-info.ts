import { aiSearchCompanyInfo } from "./ai-search-company-info";
import { compact } from "../utils/extra-utils";
import { readJSONFile, writeJSONFile } from "../utils/file-utils";
import {
  extractLinkedinId,
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
    const linkedinId = extractLinkedinId(link);
    if (!linkedinId || linkedinIds.has(linkedinId)) {
      continue;
    }
    let followersInfo = displayed_link || "";
    const linkedinUrl = getLinkedinUrl(linkedinId);
    linkedinIds.add(linkedinId);
    let followers = parseFollowersCount(followersInfo);
    if (followers === -1) {
      const expandedItem = sitelinks?.expanded?.find(
        ({ link, snippet }) =>
          extractLinkedinId(link) === linkedinId &&
          parseFollowersCount(snippet) !== -1,
      );
      followers = parseFollowersCount(expandedItem?.snippet || "");
      followersInfo = expandedItem?.snippet || followersInfo;
    }
    if (0 <= followers && followers < MIN_FOLLOWERS_COUNT) {
      smallCompaniesInfo.push({
        ...companyInfo,
        id: linkedinId,
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
        linkedinId,
        overview,
        followers,
      });
    } catch (error) {
      console.log(error);
    }
    const companyInfoFinal = { ...companyInfo, ...companyInfoAi };
    if (companyInfoAi.followers < MIN_FOLLOWERS_COUNT) {
      smallCompaniesInfo.push({
        ...companyInfo,
        id: linkedinId,
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
        id: linkedinId,
        linkedinUrl,
        followers,
        overview,
      });
      addedToForbiddenCompaniesFile++;
      continue;
    }
    if (!companyInfoFinal.website || websites.has(companyInfoFinal.website)) {
      errorCompaniesInfo.push(companyInfoFinal);
      addedToErrorCompaniesFile++;
      continue;
    }
    websites.add(companyInfoFinal.website);
    await downloadLogoApi({
      website: companyInfoFinal.website,
      logoFileName: `${linkedinId}.png`,
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
