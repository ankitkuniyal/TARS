import { firecrawl } from "@/lib/firecrawl";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const URL_REGEX = /https?:\/\/[^\s]+/g;
export const helloWorld = inngest.createFunction(
  { id: "web scrapping" },
  { event: "demo/firecrawl" },
  async ({ event, step }) => {
    const { prompt } = event.data as { prompt: string };
    const urls = (await step.run("extracted-urls", async () => {
      return prompt.match(URL_REGEX) ?? [];
    })) as string[];
    const scrappedContent = await step.run("scrapped-url", async () => {
      const results = Promise.all(
        urls.map(async (url) => {
          const result = await firecrawl.scrape(url, { formats: ["markdown"] });
          return result.markdown ?? null;
        }),
      );
      return (await results).filter(Boolean).join("\n\n");
    });
    const finalPrompt = scrappedContent
      ? `Content :\n${scrappedContent}\n\n Question : ${prompt}`
      : prompt;
    await step.run("generate-text", async () => {
      return await generateText({
        model: google("gemini-2.5-flash"),
        prompt: finalPrompt,
      });
    });
  },
);
