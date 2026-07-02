import Openai from "openai";
import type { ResponsesModel } from "openai/resources";
import { OPENAI_API_KEY } from "./api-keys";

const openai = new Openai({ apiKey: OPENAI_API_KEY });

export const openaiApi = async ({
  prompt,
  format,
  model,
  temperature,
}: {
  prompt: string;
  format: "json" | "number" | "string";
  model: ResponsesModel;
  temperature?: number;
}) => {
  try {
    const response = await openai.responses.create({
      model,
      input: prompt,
      temperature,
    });

    switch (format) {
      case "json":
        return JSON.parse(response.output_text);
      case "number":
        return parseFloat(response.output_text);
      default:
        return response.output_text;
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {};
  }
};
