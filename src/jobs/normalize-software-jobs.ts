import { openaiApi } from "../apis/openai-api.ts";
import type {
  ScrapedSoftwareJobInfo,
  NormalizedSoftwareJobInfo,
  City,
  Country,
  Continent,
  Skill,
  JobNormalizationError,
  businessRegion,
  Location,
  State,
  CityMap,
} from "../model/jobs-model.ts";
import { lowerCaseTrim, compact, uniq } from "../utils/extra-utils.ts";
import { readJSONFile, writeJSONFile } from "../utils/file-utils.ts";
import { JOBS_DATA_FILES } from "./jobs-utils.ts";
import { CITIES_MAP, CONTINENTS_MAP, COUNTRIES_MAP } from "./map/job-info-map.ts";
import {
  OPTIMIZED_SKILLS_MAP,
  OPTIMIZED_CONTINENTS_MAP,
  OPTIMIZED_COUNTRIES_MAP,
  OPTIMIZED_CITIES_MAP,
  OPTIMIZED_BUSINESS_REGION,
  OPTIMIZED_STATES_MAP,
} from "./map/optimized-job-info-map.ts";
import { jobInfoPromptPartGeneral } from "./prompts/job-info-prompt-general.ts";
import { jobInfoPromptPartDescriptions } from "./prompts/job-info-prompt-descriptions.ts";
import { jobInfoPromptPartLocations } from "./prompts/job-info-prompt-locations.ts";

export const normalizeSoftwareJobsInfo = async ({
  scrapedSoftwareJobsInfo,
  companyId,
}: {
  scrapedSoftwareJobsInfo: ScrapedSoftwareJobInfo[];
  companyId: string;
}): Promise<NormalizedSoftwareJobInfo[]> => {
  const normalizedSoftwareJobsInfo: NormalizedSoftwareJobInfo[] = [];
  let normalizedSoftwareJobInfo: NormalizedSoftwareJobInfo | null = null;
  for (const softwareJobInfo of scrapedSoftwareJobsInfo) {
    try {
      const [general, descriptions, locations] = await Promise.all([
        openaiApi({ format: "json", model: "gpt-5-mini", prompt: jobInfoPromptPartGeneral(softwareJobInfo) }),
        openaiApi({ format: "json", model: "gpt-5-mini", prompt: jobInfoPromptPartDescriptions(softwareJobInfo) }),
        openaiApi({ format: "json", model: "gpt-5-mini", prompt: jobInfoPromptPartLocations(softwareJobInfo) }),
      ]);
      normalizedSoftwareJobInfo = {
        ...general,
        ...descriptions,
        ...locations,
      } as NormalizedSoftwareJobInfo;
      if (!normalizedSoftwareJobInfo.skills || !normalizedSoftwareJobInfo.locations) {
        throw new Error(`[${normalizeSoftwareJobsInfo.name}]: Normalization failed for ${softwareJobInfo.url}`);
      }
      normalizedSoftwareJobInfo.companyId = companyId;
      normalizedSoftwareJobInfo.workplaceTypes = uniq(
        normalizedSoftwareJobInfo.locations.map(({ workplaceType }) => workplaceType),
      );
      normalizedSoftwareJobInfo.skills = compact(normalizedSoftwareJobInfo.skills.map(normalizeSkill));
      normalizedSoftwareJobInfo.locations = normalizedSoftwareJobInfo.locations.map(normalizeLocation);
      normalizedSoftwareJobInfo.remoteLocationTokens = uniq(
        normalizedSoftwareJobInfo.locations
          .filter(({ workplaceType }) => workplaceType === "remote")
          .reduce((acc, location) => [...acc, ...mapLocationToToken(location)], [] as string[]),
      );
      normalizedSoftwareJobInfo.onsiteOrHybrifLocationTokens = uniq(
        normalizedSoftwareJobInfo.locations
          .filter(({ workplaceType }) => workplaceType !== "remote")
          .reduce((acc, location) => [...acc, ...mapLocationToToken(location)], [] as string[]),
      );
      normalizedSoftwareJobsInfo.push(normalizedSoftwareJobInfo);
      console.log(`[${normalizeSoftwareJobsInfo.name}]: Normalization done for ${normalizedSoftwareJobInfo.url}`);
    } catch (error) {
      console.error(error);
      const jobsErrorsData = readJSONFile<JobNormalizationError[]>(JOBS_DATA_FILES.jobsErrors) ?? [];
      jobsErrorsData.push({
        url: softwareJobInfo.url,
        error: error?.toString() ?? "",
        normalizedJobInfo: normalizedSoftwareJobInfo,
      });
      writeJSONFile(JOBS_DATA_FILES.jobsErrors, jobsErrorsData);
    }
  }
  return normalizedSoftwareJobsInfo;
};

const normalizeLocation = (location: Location): Location => {
  if (location.scope === "city") {
    const city = normalizeCity(location.city);
    const country = normalizeCountry(location.country ?? CITIES_MAP[city]?.country ?? "");
    return {
      scope: "city",
      workplaceType: location.workplaceType,
      businessRegion: normalizebusinessRegion(COUNTRIES_MAP[country]?.businessRegion ?? ""),
      continent: normalizeContinent(COUNTRIES_MAP[country]?.continent),
      country,
      state: country === "unitedstates" ? normalizeState(CITIES_MAP[city]?.state ?? "") : undefined,
      city,
    };
  } else if (location.scope === "country") {
    return {
      scope: "country",
      workplaceType: location.workplaceType,
      businessRegion: normalizebusinessRegion(COUNTRIES_MAP[normalizeCountry(location.country)]?.businessRegion),
      continent: normalizeContinent(COUNTRIES_MAP[normalizeCountry(location.country)]?.continent),
      country: normalizeCountry(location.country),
    };
  } else if (location.scope === "continent") {
    return {
      scope: "continent",
      workplaceType: location.workplaceType,
      businessRegion: normalizebusinessRegion(CONTINENTS_MAP[normalizeContinent(location.continent)]?.businessRegion),
      continent: normalizeContinent(location.continent),
    };
  } else if (location.scope === "businessRegion") {
    return {
      scope: "businessRegion",
      workplaceType: location.workplaceType,
      businessRegion: normalizebusinessRegion(location.businessRegion),
    };
  } else {
    return {
      scope: "worldwide",
      workplaceType: location.workplaceType,
    };
  }
};

const mapLocationToToken = (location: Location): string[] => {
  return Object.entries(location)
    .filter(([key]) => !["scope", "workplaceType"].includes(key))
    .map(([key, value]) => `${key}:${value}`.toLowerCase());
};

const normalizeValue = <T extends string>({
  value,
  map,
  errorFile,
  ignoreNotFound,
  verbose,
}: {
  value: string;
  map: Record<string, string>;
  errorFile: string;
  ignoreNotFound: boolean;
  verbose: boolean;
}): T | null => {
  const alias = lowerCaseTrim(value);
  if (map[alias]) {
    return map[alias] as T;
  }
  const errors = readJSONFile<string[]>(errorFile) ?? [];
  errors.push(value);
  writeJSONFile(errorFile, errors);
  if (verbose) {
    console.error(`[${normalizeValue.name}]: Normalizated value not found for ${value} - Check ${errorFile}`);
  }
  return ignoreNotFound ? null : (value as T);
};

const normalizeSkill = (skill: string): Skill | null => {
  return normalizeValue<Skill>({
    value: skill,
    map: OPTIMIZED_SKILLS_MAP,
    errorFile: JOBS_DATA_FILES.skillsErrors,
    ignoreNotFound: true,
    verbose: false,
  });
};

const normalizebusinessRegion = (continent: string): businessRegion => {
  return normalizeValue<businessRegion>({
    value: continent,
    map: OPTIMIZED_BUSINESS_REGION,
    errorFile: JOBS_DATA_FILES.locationsErrors,
    ignoreNotFound: false,
    verbose: true,
  })!;
};

const normalizeContinent = (continent: string): Continent => {
  return normalizeValue<Continent>({
    value: continent,
    map: OPTIMIZED_CONTINENTS_MAP,
    errorFile: JOBS_DATA_FILES.locationsErrors,
    ignoreNotFound: false,
    verbose: true,
  })!;
};

const normalizeState = (state: string): State => {
  return normalizeValue<State>({
    value: state,
    map: OPTIMIZED_STATES_MAP,
    errorFile: JOBS_DATA_FILES.locationsErrors,
    ignoreNotFound: false,
    verbose: true,
  })!;
};

const normalizeCountry = (country: string): Country => {
  return normalizeValue<Country>({
    value: country,
    map: OPTIMIZED_COUNTRIES_MAP,
    errorFile: JOBS_DATA_FILES.locationsErrors,
    ignoreNotFound: false,
    verbose: true,
  })!;
};

const normalizeCity = (city: string): City => {
  return normalizeValue<City>({
    value: city,
    map: OPTIMIZED_CITIES_MAP,
    errorFile: JOBS_DATA_FILES.locationsErrors,
    ignoreNotFound: false,
    verbose: true,
  })!;
};
