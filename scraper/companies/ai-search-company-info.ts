import { getGoogleCompanyInfoPrompt } from "./prompts/google-company-info-prompt.ts";
import { getFollowersCountPrompt } from "./prompts/followers-count-prompt.ts";
import { getOpenaiCompanyInfoPrompt } from "./prompts/openai-company-info-prompt.ts";
import { googleApi } from "../apis/google-api.ts";
import { openaiApi } from "../apis/openai-api.ts";
import { normalizeWebsite } from "../utils/domain-utils.ts";
import { getLinkedinUrl, MIN_FOLLOWERS_COUNT } from "../utils/linkedin-utils.ts";
import type { CompanyInfo } from "../model/companies-model.ts";

export const aiSearchCompanyInfo = async ({
  linkedinId,
  overview,
  followers,
}: {
  linkedinId: string;
  overview: string;
  followers: number;
}) => {
  const linkedinUrl = getLinkedinUrl(linkedinId);

  const requestedInfo = [
    "website",
    "company size",
    "founded year",
    ...(followers === -1 ? ["number of followers"] : []),
  ].join(", ");

  const googleSearchLinkedin = await googleApi({
    query: getGoogleCompanyInfoPrompt({ requestedInfo, linkedinUrl }),
    engine: "google_ai_mode",
  });

  const googleAiResult = (googleSearchLinkedin.text_blocks ?? [])
    .map((item) => (item.type === "paragraph" ? item.snippet : item.list?.map(({ snippet }) => snippet).join("\n")))
    .join("\n");

  if (followers === -1) {
    followers = await openaiApi({
      prompt: getFollowersCountPrompt(googleAiResult),
      format: "number",
      model: "gpt-4.1-nano",
      temperature: 0,
    });
  }

  let companyInfo = {} as CompanyInfo;

  if (followers >= MIN_FOLLOWERS_COUNT) {
    companyInfo = await openaiApi({
      prompt: getOpenaiCompanyInfoPrompt({ overview, googleAiResult }),
      format: "json",
      model: "gpt-5-nano",
    });
    companyInfo.website = normalizeWebsite(companyInfo.website) ?? "";
  }

  return { ...companyInfo, linkedinId, linkedinUrl, followers };
};
