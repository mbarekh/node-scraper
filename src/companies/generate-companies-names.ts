import { readJSONFile, writeJSONFile } from "../utils/file-utils.ts";
import type { CompanyInfo } from "../model/companies-model.ts";
import { openaiApi } from "../apis/openai-api.ts";
import { getCompanyNamesGeneratorPrompt } from "./prompts/company-name-generator-prompt.ts";
import { COMPANIES_DATA_FILES } from "./companies-utils.ts";

export const generateCompaniesNames = async ({ count, location }: { count: number; location: string }) => {
  if (count <= 0) {
    return;
  }

  const oldCompanies = readJSONFile<CompanyInfo[]>(COMPANIES_DATA_FILES.companiesInfo);

  const newCompanies: string[] = await openaiApi({
    prompt: getCompanyNamesGeneratorPrompt({ count, location }),
    format: "json",
    model: "gpt-5.2",
  });

  const oldCompaniesSet = new Set(oldCompanies.map(({ name }) => name));

  const allCompanies = [
    ...oldCompanies,
    ...newCompanies.map((name) => ({ name })).filter(({ name }) => !oldCompaniesSet.has(name)),
  ];

  writeJSONFile(COMPANIES_DATA_FILES.companiesInfo, allCompanies);

  console.log(`Input companies (new): ${newCompanies.length}`);
  console.log(`Existing companies: ${oldCompanies.length}`);
  console.log(`Added after merge: ${allCompanies.length - oldCompanies.length}`);
  console.log(`Total companies: ${allCompanies.length}`);
};
