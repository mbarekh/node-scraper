// GREENHOUSE
export type GreenhouseResponse = {
  jobs: GreenhouseJobPosting[];
  meta: { total: number };
};

type GreenhouseJobPosting = {
  absolute_url: string;
  data_compliance: GreenhouseDataCompliance[];
  internal_job_id: number;
  location: GreenhouseLocation;
  metadata: GreenhouseMetadataItem[];
  id: number;
  updated_at: string;
  requisition_id: string;
  title: string;
  company_name: string;
  first_published: string;
  language: string;
  content: string;
  departments: GreenhouseDepartment[];
  offices: GreenhouseOffice[];
};

type GreenhouseDataCompliance = {
  type: string;
  requires_consent: boolean;
  requires_processing_consent: boolean;
  requires_retention_consent: boolean;
  retention_period: number | null;
  demographic_data_consent_applies: boolean;
};

type GreenhouseLocation = {
  name: string;
};

type GreenhouseMetadataItem = {
  id: number;
  name: string;
  value: string | null;
  value_type: string;
};

type GreenhouseDepartment = {
  id: number;
  name: string;
  child_ids: number[];
  parent_id: number | null;
};

type GreenhouseOffice = {
  id: number;
  name: string;
  location: string;
  child_ids: number[];
  parent_id: number | null;
};

// ASHBYHQ
export type AshbyhqJobResponse = {
  jobs: AshbyhqJobPosting[];
  apiVersion: string;
};

type AshbyhqJobPosting = {
  id: string;
  title: string;
  department: string;
  team: string;
  employmentType: string;
  location: string;
  secondaryLocations: AshbyhqSecondaryLocation[];
  publishedAt: string;
  isListed: boolean;
  isRemote: boolean;
  workplaceType: string;
  address: AshbyhqAddress;
  jobUrl: string;
  applyUrl: string;
  descriptionHtml: string;
  descriptionPlain: string;
  compensation: AshbyCompensation;
};

type AshbyhqSecondaryLocation = {
  location: string;
  address: AshbyhqAddress;
};

type AshbyhqAddress = {
  postalAddress: AshbyhqPostalAddress;
};

type AshbyhqPostalAddress = {
  addressCountry: string;
};

type AshbyhqCompensationInterval = "1 YEAR" | "NONE";

type AshbyhqCompensationType = "Salary" | "Bonus" | "EquityPercentage";

type AshbyhqCompensationComponent = {
  id: string;
  summary: string;
  compensationType: AshbyhqCompensationType;
  interval: AshbyhqCompensationInterval;
  currencyCode: string | null;
  minValue: number | null;
  maxValue: number | null;
};

type SummaryComponent = {
  compensationType: AshbyhqCompensationType;
  interval: AshbyhqCompensationInterval;
  currencyCode: string | null;
  minValue: number | null;
  maxValue: number | null;
};

type CompensationTier = {
  id: string;
  tierSummary: string;
  title: string | null;
  additionalInformation: string | null;
  components: AshbyhqCompensationComponent[];
};

export type AshbyCompensation = {
  compensationTierSummary: string;
  scrapeableCompensationSalarySummary: string;
  compensationTiers: CompensationTier[];
  summaryComponents: SummaryComponent[];
};

// LEVER
export type LeverResponse = LeverJobPosting[];

type LeverJobPosting = {
  additionalPlain: string;
  additional: string;
  categories: LeverCategories;
  createdAt: number;
  descriptionPlain: string;
  description: string;
  id: string;
  lists: LeverListItem[];
  text: string;
  country: string;
  workplaceType: string;
  opening: string;
  openingPlain: string;
  descriptionBody: string;
  descriptionBodyPlain: string;
  hostedUrl: string;
  applyUrl: string;
  salaryRange?: LeverSalaryRange;
};

type LeverSalaryRange = {
  min: number;
  max: number;
  currency: string;
  interval: string;
};

type LeverCategories = {
  commitment: string;
  department: string;
  location: string;
  team: string;
  allLocations: string[];
};

type LeverListItem = {
  text: string;
  content: string;
};

// WORKABLE
export type WorkableResponse = {
  name: string;
  description: string;
  jobs: Job[];
};

type Job = {
  title: string;
  shortcode: string;
  code: string;
  employment_type: string;
  telecommuting: boolean;
  department: string | null;
  url: string;
  shortlink: string;
  application_url: string;
  published_on: string;
  created_at: string;
  country: string;
  city: string;
  state: string;
  education: string;
  experience: string;
  function: string;
  industry: string;
  locations: JobLocation[];
  description: string;
};

type JobLocation = {
  country: string;
  countryCode: string;
  city: string;
  region: string | null;
  hidden: boolean;
};

// MYWORKDAY
export type MyworkdayResponse = {
  total: number;
  jobPostings: MyWorkdayJobPosting[];
  facets: Facet[];
  userAuthenticated: boolean;
};

type MyWorkdayJobPosting = {
  title: string;
  externalPath: string;
  timeType: string;
  locationsText: string;
  postedOn: string;
  bulletFields: { label: string; value: string }[];
};

type Facet = {
  facetParameter: string;
  descriptor?: string;
  values: { [key: string]: unknown }[];
};

export type MyworkdayJobPostingResponse = {
  jobPostingInfo: MyworkdayJobPostingInfo;
  hiringOrganization: MyworkdayHiringOrganization;
  userAuthenticated: boolean;
};

type MyworkdayJobPostingInfo = {
  id: string;
  title: string;
  jobDescription: string;
  location: string;
  postedOn: string;
  startDate: string;
  timeType: string;
  jobReqId: string;
  jobPostingId: string;
  jobPostingSiteId: string;
  country: MyworkdayCountry;
  canApply: boolean;
  posted: boolean;
  includeResumeParsing: boolean;
  jobRequisitionLocation: MyworkdayJobRequisitionLocation;
  externalUrl: string;
  questionnaireId: string;
};

type MyworkdayCountry = {
  descriptor: string;
  id: string;
  alpha2Code?: string;
};

type MyworkdayJobRequisitionLocation = {
  descriptor: string;
  country: MyworkdayCountry;
};

type MyworkdayHiringOrganization = {
  name: string;
  url: string;
};
