import {
  sizes,
  industries,
  technologies,
  forbiddenIndustries,
  customerTypes,
} from "../../model/companies-model";
import { randomNumber } from "../../utils/extra-utils";

const promptThreeParagraphStandard = `
Generate a company description using the exact structure below.

FORMAT RULES:
- Return an array of exactly 3 strings.
- Each string must be 180-260 characters.
- The company name must appear only once in the entire array.
- Neutral, editorial tone.
- No repetition of ideas or sentence structures.

STRUCTURE:
1) Paragraph 1: Directly introduce the company, its mission, and core product or technology.
2) Paragraph 2: Explain how the product works or what differentiates it operationally.
3) Paragraph 3: Describe customers, market position, and industry relevance.
`;

const promptFourParagraphIndustryFirst = `
Generate a company description following these requirements.

FORMAT RULES:
- Return an array of exactly 4 strings.
- Paragraph lengths must follow this pattern:
  • Paragraph 1: 150-180 characters
  • Paragraph 2: 220-320 characters
  • Paragraph 3: 150-200 characters
  • Paragraph 4: 220-350 characters
- Mention the company name only once across the array.
- Maintain an objective, third-person editorial tone.
- Avoid repeating vocabulary.

STRUCTURE FLOW:
- Start with the broader industry context or problem.
- Then introduce the company and its core solution.
- Follow with operational or technological detail.
- Conclude with customers and market impact.
`;

const promptFiveParagraphAnalytical = `
Create a structured company overview.

FORMAT RULES:
- Return an array of exactly 5 strings.
- Each paragraph must be between 150 and 300 characters.
- Paragraphs must noticeably vary in sentence length and rhythm.
- Use the company name exactly once.
- Neutral, analytical tone.
- No filler language.

STRUCTURE LOGIC:
1) Begin with a concise description of the core product or platform.
2) Expand on the company's positioning and long-term objective.
3) Clarify the type of customers or industries served.
4) Add competitive or differentiating characteristics.
5) End with a statement about scale, growth stage, or market significance.
`;

const promptThreeParagraphMixedSentences = `
Write a company description using this strict format.

FORMAT RULES:
- Return an array of exactly 3 strings.
- Paragraph 1 must be a single long sentence (200-350 characters).
- Paragraph 2 must contain exactly 2 sentences (150-250 characters total).
- Paragraph 3 must contain 2-3 shorter sentences (180-280 characters total).
- The company name can appear only once in the entire response.
- Tone must be neutral and journalistic.
- Do not repeat phrasing or ideas.

CONTENT REQUIREMENTS:
- Cover mission and positioning.
- Explain the core technology or service.
- Identify customers and industry influence.
`;

const promptSingleParagraphDense = `
Generate a company description using the exact structure below.

FORMAT RULES:
- Return an array containing exactly 1 string.
- The paragraph must be between 300 and 600 characters.
- The company name must appear only once.
- Tone must be neutral, editorial, and non-promotional.
- Do not use generic marketing phrases (e.g., "leading provider", "innovative solutions", "cutting-edge").
- Avoid repetition and filler language.

CONTENT REQUIREMENTS:
- Clearly state the company’s mission and positioning.
- Explain its core product, service, or technology with at least one concrete operational detail.
- Identify its primary customers or market segment.
- Include one differentiating or market-relevance element.
`;

const companyDescriptionPrompts = [
  promptSingleParagraphDense,
  promptThreeParagraphStandard,
  promptFourParagraphIndustryFirst,
  promptFiveParagraphAnalytical,
  promptThreeParagraphMixedSentences,
  promptSingleParagraphDense,
];

export const getOpenaiCompanyInfoPrompt = ({
  overview,
  googleAiResult,
}: {
  overview: string;
  googleAiResult: string;
}) => {
  const randomPromptIndex = randomNumber({
    min: 0,
    max: companyDescriptionPrompts.length - 1,
  });
  const openaiCompanyInfoPromptOutput = `Return ONLY valid JSON.

Global rules:
- Use ONLY information from the provided input unless explicitly allowed to infer.
- If a STRICT field is not present in the input, return null.
- No explanations, no markdown, no text outside JSON.
- Use double quotes and no trailing commas.

JSON structure:

{
  "name": string;
  "website": string|null;
  "companySize": string|null;
  "foundedYear": number|null;
  "industry": string;
  "technology": string;
  "customerTypes": string[];
  "description": string[];
}

STRICT FIELDS (no inference allowed):
- "name": string;

- "website": string|null;

- "foundedYear": number|null;

- "companySize": string|null;
  - Allowed values: ${sizes.join("|")}

INFERRED FIELD:
- "industry": string;
  - Select the most relevant industries for the core business.
  - Must be EXACTLY one value from this list (case-sensitive, no synonyms, no new values): ${industries.join("|")}

- "technology": string;
  - Select the most relevant technology for the core business. 
  - Must be EXACTLY one value from this list (case-sensitive, no synonyms, no new values): ${technologies.join("|")}

- "customerTypes": string[];
  - Select one or multiple relevant customer types for the core business.
  - Must be EXACTLY one value from this list (case-sensitive, no synonyms, no new values): ${customerTypes.join("|")}
  
- description:
  - Follow the instructions below to generate the company description.
  ${companyDescriptionPrompts[randomPromptIndex]}`;

  const openaiCompanyInfoPromptInput = `overview: ${overview}\n description: ${googleAiResult}\n`;
  const openaiCompanyInfoPrompt = `${openaiCompanyInfoPromptOutput}\n${openaiCompanyInfoPromptInput}`;
  return openaiCompanyInfoPrompt;
};
