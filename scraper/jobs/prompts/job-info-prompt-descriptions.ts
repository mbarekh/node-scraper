import type { ScrapedSoftwareJobInfo } from "../../model/jobs-model.ts";

export const jobInfoPromptPartDescriptions = (input: ScrapedSoftwareJobInfo): string => {
  return `Your task is to transform raw scraped job data into a structured JSON format.

INPUT:
Given this JSON object representing raw scraped job data:
${JSON.stringify(input, null, 2)}

OUTPUT:
Return ONLY a valid JSON object of the following type:
{
  skills: string[],
  description: string[],
  requirements: string[],
  benefits: string[],
  overview: string,
  seniority: "entry" | "junior" | "mid" | "senior" | "lead",
  category: "frontend" | "backend" | "fullstack" | "devops",
}

FIELD-SPECIFIC GUIDANCE:

skills:
- Extract ONLY core searchable tech skills explicitly required or preferred for the role.
- Return ONLY atomic canonical technology names.
- Split grouped skills.
- Keep only: programming languages, frameworks, libraries, tools, platforms, databases, and explicitly required architectural patterns or system paradigms (e.g., microservices, distributed systems).
- Exclude soft skills, methodologies, generic concepts, certifications, minor tools, company-description technologies, and inferred skills.
- Prefer precision over recall.
- Maximum 15 skills.
- Return an array of strings.

description:
- Extract ONLY the core purpose and responsibilities of the role.
- Focus on what the candidate will do (role scope, impact, main tasks).
- Preserve original wording, terminology, and phrasing.
- Ignore the section title itself.

requirements:
- Extract ONLY candidate expectations and qualifications.
- Include:
  - Required or preferred experience (e.g. years)
  - Technical competencies tied to expectations
  - Education if explicitly required
- Preserve original wording, terminology, and phrasing.
- Ignore the section title itself.

benefits:
- Extract all benefits, including (but not limited to):
    - remote or flexible work
    - salary/compensation, bonus, equity/stock
    - health/dental/vision insurance
    - retirement plans (e.g. 401k)
    - PTO/leave
    - explicit allowances (e.g. wellness, learning).
- Rewrite any fragmented or unclear text into a short, coherent sentence.
- Ignore section titles.

overview:
- Write a concise job summary in 2 sentences (maximum 35 words total).
- Sentence 1: Clearly state the role, main responsibility, and key technologies or domain.
- Sentence 2: Add only meaningful context about the work itself (e.g., product scope, engineering focus, or team mission).
- Avoid repetition between sentences.

seniority:
- Categorize the seniority level of this job based on required experience.
- Choose one: "entry" (0 years), "junior" (1-2 years), "mid" (3-6 years), "senior" (7+ years), "lead" (8+ years).
- If unclear, infer the most likely minimum level.

category:
- Categorize the job into one of: "frontend" | "backend" | "fullstack" | "devops".
- Infer based on title and content.

GENERAL INSTRUCTIONS:
- Extract and normalize the information from the input to fit the output schema.
- Do not include any explanatory text or formatting in the output, only the JSON object.
- if the input does not describe a role in software development or devOps, return an empty object {}.`;
};
