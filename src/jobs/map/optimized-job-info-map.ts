import {
  SKILLS_MAP,
  CONTINENTS_MAP,
  CITIES_MAP,
  COUNTRIES_MAP,
  BUSINESS_REGIONS_MAP,
  STATES_MAP,
} from "./job-info-map.ts";

export const OPTIMIZED_SKILLS_MAP = Object.values(SKILLS_MAP).reduce(
  (acc, skill) => {
    for (const alias of skill.aliases) {
      acc[alias] = skill.id;
    }
    return acc;
  },
  {} as Record<string, string>,
);

export const OPTIMIZED_BUSINESS_REGION = Object.values(BUSINESS_REGIONS_MAP).reduce(
  (acc, businessRegion) => {
    for (const alias of businessRegion.aliases) {
      acc[alias] = businessRegion.id;
    }
    return acc;
  },
  {} as Record<string, string>,
);

export const OPTIMIZED_CONTINENTS_MAP = Object.values(CONTINENTS_MAP).reduce(
  (acc, continent) => {
    for (const alias of continent.aliases) {
      acc[alias] = continent.id;
    }
    return acc;
  },
  {} as Record<string, string>,
);

export const OPTIMIZED_CITIES_MAP = Object.values(CITIES_MAP).reduce(
  (acc, city) => {
    for (const alias of city.aliases) {
      acc[alias] = city.id;
    }
    return acc;
  },
  {} as Record<string, string>,
);

export const OPTIMIZED_STATES_MAP = Object.values(STATES_MAP).reduce(
  (acc, state) => {
    for (const alias of state.aliases) {
      acc[alias] = state.id;
    }
    return acc;
  },
  {} as Record<string, string>,
);

export const OPTIMIZED_COUNTRIES_MAP = Object.values(COUNTRIES_MAP).reduce(
  (acc, country) => {
    for (const alias of country.aliases) {
      acc[alias] = country.id;
    }
    return acc;
  },
  {} as Record<string, string>,
);
