export const sizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10001+"] as const;

export type Size = (typeof sizes)[number];

export const forbiddenIndustries = ["Gambling", "Adult"] as const;

export type ForbiddenIndustry = (typeof forbiddenIndustries)[number];

export const authorizedIndustries = [
  "Aerospace",
  "Agriculture",
  "Automotive",
  "Construction",
  "Charity",
  "Crypto",
  "E-Commerce",
  "Education",
  "Energy",
  "Events",
  "Finance",
  "Food",
  "Gaming",
  "Hardware",
  "Healthcare",
  "Hospitality",
  "Insurance",
  "Legal",
  "Logistics",
  "Manufacturing",
  "Marketing",
  "Materials",
  "Media",
  "Real Estate",
  "Recruitment",
  "Retail",
  "Science",
  "Software",
  "Sports",
  "Sustainability",
  "Telecom",
  "Transport",
  "Travel",
] as const;

export const industries = [...authorizedIndustries, ...forbiddenIndustries].sort();

export type Industry = (typeof industries)[number];

export const technologies = [
  "Artificial Intelligence",
  "API",
  "AR/VR",
  "Automation",
  "Bioinformatics",
  "Blockchain",
  "CRM",
  "Cloud Systems",
  "Cybersecurity",
  "Data Analytics",
  "DevOps",
  "DevTools",
  "Edge Computing",
  "Embedded",
  "Enterprise",
  "Geospatial",
  "Networking",
  "Privacy",
  "Robotics",
  "Semiconductors",
] as const;

export type Technology = (typeof technologies)[number];

export const businessTypes = [
  "Public Company",
  "Privately Held",
  "B2B",
  "B2C",
  "B2B2C",
  "Marketplace",
  "Nonprofit",
  "Government",
] as const;

export type BusinessType = (typeof businessTypes)[number];

export const customerTypes = ["B2B", "B2C", "B2G", "C2C", "B2B2C", "D2C"] as const;

export type CustomerType = (typeof customerTypes)[number];

export type CompanyInfo = {
  name: string;
  website: string;
  industry: Industry;
  customerTypes: CustomerType[];
  technology: Technology;
  companySize: Size;
  foundedYear: number;
  description: string[];
  id: string; // equal to linkedinId
  lastScrapedAt: string;
  linkedinUrl: string;
  overview?: string;
  followers: number;
  followersInfo?: string;
  listJobsUrl: string;
};
