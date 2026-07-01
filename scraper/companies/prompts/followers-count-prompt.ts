export const getFollowersCountPrompt = (input: string): string => {
  return `Extract the number of LinkedIn followers from the text below.

Rules:
- Return ONLY the final number.
- No words.
- No commas.
- No symbols.
- Convert:
  K = x1,000
  M = x1,000,000
  B = x1,000,000,000
- Ignore "+" and "~" symbols.
- If no followers is found, return -1.

Text:
${input}
`;
};
