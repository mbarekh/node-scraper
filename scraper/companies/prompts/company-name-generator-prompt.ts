import {
  forbiddenIndustries,
  authorizedIndustries,
} from "../../model/companies-model";

export const getCompanyNamesGeneratorPrompt = ({
  count,
  location,
}: {
  count: number;
  location: string;
}): string => {
  const companyNamesGeneratorPrompt = `Generate exactly ${count} real company names in ${location} that are likely to hire Software Engineers.

Rules:
- Return ONLY a valid JSON array of strings.
- The array must contain exactly ${count} unique company names.
- Companies must have active engineering teams and regularly hire software engineers.
- Every company must have at least 10,000 followers on LinkedIn.
- Every company must have at most 300,000 followers on LinkedIn.
- Prefer companies in software, SaaS, AI, cloud, cybersecurity, gaming, or tech-enabled industries.
- Use ONLY authorized industries: ${authorizedIndustries.join("|")}.
- NEVER include companies from forbidden industries: ${forbiddenIndustries.join("|")}.
- Do not include explanations, numbering, markdown, or any extra text.

Output format example:
["Company A", "Company B"]`;
  return companyNamesGeneratorPrompt;
};
