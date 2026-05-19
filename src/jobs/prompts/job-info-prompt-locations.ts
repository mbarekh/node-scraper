import type { ScrapedSoftwareJobInfo } from "../../model/jobs-model.ts";

export const jobInfoPromptPartLocations = (input: ScrapedSoftwareJobInfo): string => {
  return `Transform raw scraped job data into structured JSON format.

INPUT:
${JSON.stringify(input, null, 2)}

GOAL:
Extract ONLY explicitly stated location and work arrangement data.

────────────────────────
CORE RULES
────────────────────────
- Use only explicit information (no inference or expansion).
- Each distinct statement = one rule.

────────────────────────
PRIORITY ORDER (CRITICAL)
────────────────────────
1. Header / title / labels (highest priority)
2. Job description
3. Company description (lowest priority)

Header overrides description text in conflicts. If no conficts, include both.

────────────────────────
WORLDWIDE (STRICT)
────────────────────────
Only allow:
{ scope: "worldwide", workplaceType }

IF AND ONLY IF text explicitly contains: remote worldwide, remote anywhere in the world, remote globally

Never infer worldwide from:
remote, remote-first, distributed team, international, Europe, EMEA, AMER, APAC, or missing data.

────────────────────────
LOCATION TYPES
────────────────────────
Return:
{
  "locations": Location[],
}

locations types:

1. worldwide
{ scope: "worldwide", workplaceType }

2. businessRegion (emea | apac | amer)
{ scope: "businessRegion", businessRegion, workplaceType }

3. continent (northamerica | southamerica | europe | asia | africa | oceania)
{ scope: "continent", continent, workplaceType }

4. country
{ scope: "country", country, workplaceType }

5. city
{ scope: "city", country, city, workplaceType }

────────────────────────
WORKPLACE TYPE
────────────────────────
"remote" | "hybrid" | "onsite"

- Must be explicitly stated.
- Cities only allow hybrid/onsite.
- Do not assume remote for regions or continents.
- if the input does not describe a role in software development or devOps, return an empty object {}.`;
};
