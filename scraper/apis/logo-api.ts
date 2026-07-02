import fs from "fs";
import path from "path";
import axios from "axios";
import { pipeline } from "stream/promises";
import { getDomain } from "../utils/domain-utils";

const downloadLogoHelper = async ({
  domain,
  logoAbsolutePath,
}: {
  domain: string;
  logoAbsolutePath: string;
}) => {
  const imageUrl = `https://logos-api.apistemic.com/domain:${domain}`;

  const response = await axios.get(imageUrl, {
    responseType: "stream",
    validateStatus: (status) => status >= 200 && status < 300,
  });

  await pipeline(response.data, fs.createWriteStream(logoAbsolutePath));
};

export const downloadLogoApi = async ({
  website,
  logoFileName,
}: {
  website: string;
  logoFileName: string;
}) => {
  try {
    const domain = getDomain(website);
    if (!domain) throw Error("Domain not found error");
    const logoAbsolutePath = path.join(
      process.cwd(),
      "src",
      "companies",
      "logos",
      logoFileName,
    );
    if (!fs.existsSync(logoAbsolutePath)) {
      await downloadLogoHelper({ domain, logoAbsolutePath });
    }
  } catch (error) {
    console.error(`Failed to download logo for ${website}:`, error);
  }
};
