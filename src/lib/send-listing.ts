import { createServerFn } from "@tanstack/react-start";

export type SendResult =
  | { ok: true }
  | { ok: false; error: "missing" | "email" | "website" | "failed"; mailto?: string };

export const sendListing = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("bad");
    const raw = input as Record<string, unknown>;
    const text = (key: string, max: number) => {
      const value = raw[key];
      if (typeof value !== "string" || value.length > max) return "";
      return value;
    };
    return {
      name: text("name", 200),
      email: text("email", 200),
      company: text("company", 200),
      website: text("website", 500),
      product: text("product", 4000),
      site: text("site", 20),
      note: text("note", 2000),
      plan: text("plan", 20),
      honey: text("honey", 200),
    };
  })
  .handler(async ({ data }): Promise<SendResult> => {
    const { deliverListing } = await import("./send-listing.server");
    return deliverListing(data);
  });
