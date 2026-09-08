import { generateCompaniesNames } from "./generate-companies-names";
import { scrapeCompaniesInfo } from "./scrape-companies-info";

const main = async () => {
  const updatedCompaniesCount = parseInt(process.argv[2] ?? "") || 0;
  const generatedCompaniesCount = parseInt(process.argv[3] ?? "") || 0;
  console.log(`Updated companies count: ${updatedCompaniesCount}`);
  console.log(`Generated companies count: ${generatedCompaniesCount}`);
  await generateCompaniesNames({
    count: generatedCompaniesCount,
    location: "United States",
  });
  await scrapeCompaniesInfo({ updatedCompaniesCount });
};

main();
