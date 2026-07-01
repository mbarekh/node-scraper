import { generateCompaniesNames } from "./generate-companies-names.ts";
import { scrapeCompaniesInfo } from "./scrape-companies-info.ts";

const main = async () => {
  const updatedCompaniesCount = parseInt(process.argv[2] ?? "") || 0;
  const generatedCompaniesCount = parseInt(process.argv[3] ?? "") || 0;
  await generateCompaniesNames({ count: generatedCompaniesCount, location: "United States" });
  await scrapeCompaniesInfo({ updatedCompaniesCount });
};

main();
