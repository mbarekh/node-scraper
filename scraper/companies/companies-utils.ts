import path from "path";

const companiesDataFolderPath = path.join("scraper", "companies", "data");

export const COMPANIES_DATA_FILES = {
  companiesInfo: path.join(companiesDataFolderPath, "companies-info.json"),
  smallCompanies: path.join(companiesDataFolderPath, "small-companies.json"),
  errorCompanies: path.join(companiesDataFolderPath, "error-companies.json"),
  forbiddenCompanies: path.join(companiesDataFolderPath, "forbidden-companies.json"),
};
