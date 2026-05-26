import type {
  CATEGORIES_MAP,
  CITIES_MAP,
  CONTINENTS_MAP,
  COUNTRIES_MAP,
  CURRENCIES_MAP,
  EMPLOYMENT_TYPES_MAP,
  BUSINESS_REGIONS_MAP,
  SENIORITY_MAP,
  SKILLS_MAP,
  STATES_MAP,
  WORKPLACE_TYPES_MAP,
} from "../jobs/map/job-info-map.ts";

export type JobNormalizationError = {
  url: string;
  error: string;
  normalizedJobInfo: NormalizedSoftwareJobInfo | null;
};

export type HtmlTag = keyof HTMLElementTagNameMap;

export type PredicateParams = {
  keyword: string;
  attrValue: string;
};

export type DomSearchParams = {
  keywords: readonly string[];
  tags: HtmlTag[];
  attr: string;
  excludedKeywords?: readonly string[];
  caseSensitive?: boolean;
  predicate?: (args: PredicateParams) => boolean;
};

export type HandlerParams = {
  keyword: string;
  attrValue: string;
  tags: HtmlTag[];
  attr: string;
};

export type PrivateAtsInfo = {
  careersUrl: string;
  keyword: string;
  attrValue: string;
};

export type ScrapedSoftwareJobInfo = {
  url: string;
  content: string;
  title?: string;
  publishedAt?: string;
  location?: string;
  salaryRange?: string;
  employmentType?: string;
  workplaceType?: string;
};

export type ScrapedSoftwareJobsInfoWithListJobsUrl = {
  scrapedSoftwareJobsInfo: ScrapedSoftwareJobInfo[];
  listJobsUrl: string;
};

export type NormalizedSoftwareJobInfo = {
  title: string;
  url: string;
  locations: Location[];
  remoteLocationTokens: string[];
  onsiteOrHybrifLocationTokens: string[];
  skills: Skill[];
  workplaceTypes: WorkplaceType[];
  employmentType: EmploymentType;
  description: string[];
  requirements: string[];
  benefits: string[];
  overview: string;
  seniority: Seniority;
  category: Category;
  publishedAt: string | null;
  companyId: string;
  salaryRange: SalaryRange | null;
};

export type Skill = keyof typeof SKILLS_MAP;

export type Scope = "worldwide" | "businessRegion" | "continent" | "country" | "state" | "city";

export type Location =
  | {
      scope: Extract<Scope, "worldwide">;
      workplaceType: WorkplaceType;
    }
  | {
      scope: Extract<Scope, "businessRegion">;
      businessRegion: BusinessRegion;
      workplaceType: WorkplaceType;
    }
  | {
      scope: Extract<Scope, "continent">;
      continent: Continent;
      businessRegion: BusinessRegion;
      workplaceType: WorkplaceType;
    }
  | {
      scope: Extract<Scope, "country">;
      workplaceType: WorkplaceType;
      businessRegion: BusinessRegion;
      continent: Continent;
      country: Country;
    }
  | {
      scope: Extract<Scope, "state">;
      workplaceType: WorkplaceType;
      businessRegion: BusinessRegion;
      continent: Continent;
      country: Country;
      state: State;
    }
  | {
      scope: Extract<Scope, "city">;
      workplaceType: Extract<WorkplaceType, "hybrid" | "onsite">;
      businessRegion: BusinessRegion;
      continent: Continent;
      country: Country;
      state?: State;
      city: City;
    };

export type SalaryRange = {
  max: number;
  min: number;
  interval: "year" | "month" | "day" | "hour";
  currency: Currency;
  bonus: boolean;
  equity: boolean;
};

export type Category = keyof typeof CATEGORIES_MAP;

export type Seniority = keyof typeof SENIORITY_MAP;

export type WorkplaceType = keyof typeof WORKPLACE_TYPES_MAP;

export type EmploymentType = keyof typeof EMPLOYMENT_TYPES_MAP;

export type Continent = keyof typeof CONTINENTS_MAP;

export type BusinessRegion = keyof typeof BUSINESS_REGIONS_MAP;

export type Country = keyof typeof COUNTRIES_MAP;

export type State = keyof typeof STATES_MAP;

export type City = keyof typeof CITIES_MAP;

export type Currency = keyof typeof CURRENCIES_MAP;

export type CityMap = {
  readonly id: string;
  readonly label: string;
  readonly aliases: string[];
  readonly search: { remote: string; onSiteOrHybrid: string };
  readonly country: Country;
  readonly continent: Continent;
  readonly businessRegion: BusinessRegion;
  readonly state?: State;
};
