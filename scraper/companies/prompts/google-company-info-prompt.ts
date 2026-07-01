export const getGoogleCompanyInfoPrompt = ({
  requestedInfo,
  linkedinUrl,
}: {
  requestedInfo: string;
  linkedinUrl: string;
}): string => {
  return `Extract ${requestedInfo} for ${linkedinUrl}; prioritize LinkedIn company page, fallback to reliable sources only if missing;`;
};
