import { createServerFn } from "@tanstack/react-start";

export type MarkId = "title" | "specs" | "description" | "photos" | "claims";

export type ListingScore = {
  url: string;
  pageTitle: string;
  score: number;
  marks: { id: MarkId; points: number; finding: string }[];
};

export type ScoreError = "bad_url" | "blocked" | "not_listing" | "unavailable" | "failed" | "busy";

export type ScoreResponse = { ok: true; score: ListingScore } | { ok: false; error: ScoreError };

export const scoreListing = createServerFn({ method: "POST" })
  .validator((input: { url: string; lang: "en" | "zh" | "vi"; text?: string }) => {
    if (!input || typeof input.url !== "string" || input.url.length > 2000) {
      throw new Error("bad_url");
    }
    if (input.lang !== "en" && input.lang !== "zh" && input.lang !== "vi") {
      throw new Error("bad_lang");
    }
    if (input.text != null && (typeof input.text !== "string" || input.text.length > 12000)) {
      throw new Error("bad_text");
    }
    return { url: input.url, lang: input.lang, text: input.text?.trim() ?? "" };
  })
  .handler(async ({ data }): Promise<ScoreResponse> => {
    const { runScore } = await import("./score-listing.server");
    return runScore(data.url, data.lang, data.text);
  });
