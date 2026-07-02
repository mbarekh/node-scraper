import { getJson } from "serpapi";
import type { GoogleResponse } from "../model/google-api-model.ts";
import { SERP_API_KEY } from "./api-keys";

export const googleApi = async ({
  query,
  engine,
  location,
  hl,
  gl,
}: {
  query: string;
  engine: "google" | "google_ai_mode";
  location?: string;
  hl?: string;
  gl?: string;
}): Promise<GoogleResponse> => {
  try {
    return (await getJson({
      q: query,
      api_key: SERP_API_KEY,
      engine: engine,
      location: location ?? "United States",
      hl: hl ?? "en",
      gl: gl ?? "us",
    })) as GoogleResponse;
  } catch (error) {
    console.error(`Google API error on query "${query}"`, error);
    return {
      organic_results: [],
      text_blocks: [],
    };
  }
};
