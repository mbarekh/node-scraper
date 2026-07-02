import type { ScrapedSoftwareJobInfo } from "../../model/jobs-model";

export const jobInfoPromptPartGeneral = (
  input: ScrapedSoftwareJobInfo,
): string => {
  return `Your task is to transform raw scraped job data into a structured JSON format.

INPUT:
Given this JSON object representing raw scraped job data:
${JSON.stringify(input, null, 2)}

OUTPUT:
Return ONLY a valid JSON object of the following type:
{
  url: string,
  title: string,
  employmentType: "fulltime" | "parttime" | "contract" | "internship",
  publishedAt: string (YYYY-MM-DD format) | null,
  salaryRange: {
    min: number,
    max: number,
    interval: "year" | "month" | "day" | "hour",
    currency: "USD" | "EUR" | "GBP" | "CAD" | string,
    bonus: boolean;
    equity: boolean;
  } | null,
}

type businessRegion = "emea" | "apac" | "amer"

type Continent = "northamerica" | "southamerica" | "europe" | "asia" | "africa" | "oceania"

FIELD-SPECIFIC GUIDANCE:

url:
- Copy as-is.

title:
- Infer from title or content.

employmentType:
- Normalize to one of: "fulltime", "parttime", "contract", "internship".
- Infer from employmentType or content.
- If not specified, default to "fulltime".

publishedAt:
- Convert to format (YYYY-MM-DD).
- If no date is available, return null.

salaryRange:
- Extract salary ONLY if explicitly stated in the job post.
- Parse into:
  - min (number)
  - max (number)
  - interval (hour, day, month, year)
  - currency (ISO code if possible)
  - bonus (boolean)
  - equity (boolean)
- Do NOT infer or estimate missing salary data.
- If salary is not explicitly provided, return null.

GENERAL INSTRUCTIONS:
- Extract and normalize the information from the input to fit the output schema.
- Do not include any explanatory text or formatting in the output, only the JSON object.
- if the input does not describe a role in software development or devOps, return an empty object {}.`;
};
