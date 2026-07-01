import type { ScrapedSoftwareJobInfo } from "../../model/jobs-model.ts";

export const jobInfoPromptPartLocations = (input: ScrapedSoftwareJobInfo): string => {
  return `Transform the raw scraped job data into structured JSON.

INPUT:
${JSON.stringify(input, null, 2)}

────────────────────────
OUTPUT FORMAT
────────────────────────

- If the input does not describe a software development or DevOps role, return:
{}

- Otherwise, return:
{ "locations": Location[] }

type Location =
  | { scope: "worldwide", workplaceType: WorkplaceType }
  | { scope: "businessRegion", businessRegion: businessRegion, workplaceType: WorkplaceType }
  | { scope: "continent", continent: Continent, workplaceType: WorkplaceType }
  | { scope: "country", country: string, workplaceType: WorkplaceType }
  | { scope: "state", state: string, workplaceType: WorkplaceType }
  | { scope: "city", country: string, city: string, workplaceType: WorkplaceType }

type WorkplaceType = "remote" | "hybrid" | "onsite"

type businessRegion = "emea" | "apac" | "amer"

type Continent =
  | "northamerica"
  | "southamerica"
  | "europe"
  | "asia"
  | "africa"
  | "oceania"

────────────────────────
LOCATION EXTRACTION PRIORITY
────────────────────────

Extract ALL locations using this priority order:
1. Header / title / labels (highest priority)
2. Job description
3. Company description (lowest priority)

Conflict handling:
- Higher-priority sources override lower-priority sources.
- If there is no conflict, include all detected locations.

────────────────────────
LOCATION GRANULARITY
────────────────────────

- A single hierarchical location expression (for example country-state-city or country > state > city or city, state, country) is ONE location, not multiple locations.
- For one hierarchical expression, emit only the most specific geographic scope present: city if it includes a city, otherwise state, otherwise country.

────────────────────────
LOCATION RULES
────────────────────────

WORLDWIDE
- Use scope: "worldwide" ONLY IF the text explicitly contains:
  - "remote worldwide"
  - "remote anywhere in the world"
  - "remote globally"
- Never infer worldwide from:
  - remote
  - remote-first
  - distributed team
  - international
  - Europe
  - EMEA
  - AMER
  - APAC
  - missing data
- If workplaceType is not mentioned, assume "remote"

Result:
{ scope: "worldwide", workplaceType }

BUSINESS REGION
- Use scope: "businessRegion" for EMEA, APAC, or AMER
- If workplaceType is not mentioned, assume "remote"

Result:
{ scope: "businessRegion", businessRegion, workplaceType }

CONTINENT
- Use scope: "continent" for continent-level locations
- If workplaceType is not mentioned, assume "remote"

Result:
{ scope: "continent", continent, workplaceType }

COUNTRY
- Use scope: "country" for country-level locations
- If workplaceType is not mentioned, assume "remote"

Result:
{ scope: "country", country, workplaceType }

State
- Use scope: "state" for state-level locations
- If workplaceType is not mentioned, assume "remote"

Result:
{ scope: "state", state, workplaceType }

CITY
- Use scope: "city" for city-level locations
- If workplaceType is not mentioned, assume "onsite"

Result:
{ scope: "city", country, city, workplaceType }`;
};
