import type { ListingScore, MarkId, ScoreResponse } from "@/lib/score-listing";

if (typeof window !== "undefined") {
  throw new Error("score-listing.server is server-only");
}

type Lang = "en" | "zh" | "vi";

type ModelJson = {
  isListing?: boolean;
  blocked?: boolean;
  pageTitle?: string;
  marks?: { id?: string; points?: number; finding?: string }[];
};

const MARKS: MarkId[] = ["title", "specs", "description", "photos", "claims"];

const MARKETS = [
  "alibaba.com",
  "made-in-china.com",
  "globalsources.com",
  "indiamart.com",
  "1688.com",
  "dhgate.com",
  "ec21.com",
  "aliexpress.com",
];

const ADVICE =
  /\b(should|shouldn't|ought to|rewrite|you need to|try to|change the|add the|add a|remove the|put the|make sure|consider)\b|建议|应该|应当|请把|请将|改成|加上|删掉|nên |hãy |đừng |cần phải/i;

const RULES = `You score one B2B product listing.
You do not rewrite it and you do not tell the seller how to fix it.
No advice, no steps, no replacement title, no "should", "add", "remove", "change", "建议", "应该", "nên", "hãy".
Each finding is one sentence about what is already in the text.
Scores are integers from 0 to 20:
- title: whether the product, size, or model is actually named, and whether the title is stuffed with search words
- specs: whether filter fields contain real values and units, or blanks and words like yes, normal, discuss
- description: whether it says what the product does, what it does not do, and what is in the box, or only a factory slogan
- photos: only what the text says about pictures. If it does not describe them, points are 0 and the finding says the text does not describe the photos
- claims: certificates and superlatives that are in the text. Do not punish a page for naming no certificate. Do punish "best", "No.1", and a certificate with no model
Return JSON only, with keys isListing, blocked, pageTitle, marks.
pageTitle is the product title copied from the text, not from the URL.
marks is an array of {id, points, finding} for title, specs, description, photos, claims, in that order.
If the text is not a product listing, isListing is false.`;

const cache = new Map<string, ListingScore>();
const recent: number[] = [];

function takeSlot() {
  const now = Date.now();
  while (recent.length && now - recent[0] > 60 * 60 * 1000) recent.shift();
  if (recent.length >= 30) return false;
  recent.push(now);
  return true;
}

function remember(key: string, score: ListingScore) {
  if (cache.size > 40) {
    const first = cache.keys().next().value;
    if (first) cache.delete(first);
  }
  cache.set(key, score);
}

function normalizeInput(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function isMarketplace(hostname: string) {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return MARKETS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function isPrivateAddress(ip: string) {
  const normalized = ip.toLowerCase().replace(/^::ffff:/, "");
  if (normalized === "::1" || normalized === "0.0.0.0") return true;
  if (normalized.startsWith("fe80:") || normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  const parts = normalized.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => part < 0 || part > 255 || Number.isNaN(part))) return false;
  const [a, b] = parts;
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

async function isPublicHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/\.$/, "").replace(/^\[|\]$/g, "");
  if (!host || host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return false;
  const net = await import("node:net");
  if (net.isIP(host)) return !isPrivateAddress(host);
  try {
    const dns = await import("node:dns/promises");
    const records = await dns.lookup(host, { all: true, verbatim: true });
    if (!records.length) return false;
    return records.every((record) => !isPrivateAddress(record.address));
  } catch {
    return false;
  }
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/"/gi, '"')
    .replace(/&#39;|'/gi, "'")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
}

function extract(html: string, base: string) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = decodeEntities((titleMatch?.[1] ?? "").replace(/\s+/g, " ").trim()).slice(0, 180);
  const links: string[] = [];
  const hrefs = html.matchAll(/href\s*=\s*["']([^"']+)["']/gi);
  for (const match of hrefs) {
    if (links.length >= 300) break;
    const href = match[1];
    if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:")) continue;
    try {
      const absolute = new URL(href, base);
      if (absolute.protocol === "http:" || absolute.protocol === "https:") links.push(absolute.toString());
    } catch {
      /* skip bad hrefs */
    }
  }
  const text = decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  ).slice(0, 10000);
  return { title, text, links };
}

function looksBlocked(status: number, text: string, html: string) {
  if (status >= 400) return true;
  const sample = `${html.slice(0, 2500)} ${text.slice(0, 400)}`.toLowerCase();
  if (/captcha|bxpunish|access denied|just a moment|verify you are human|robot check|attention required|punish page/.test(sample)) {
    return true;
  }
  return text.length < 80;
}

function looksLikeListing(text: string, url: string) {
  if (/product-detail|\/product\/|\/item\/|\/offer\/|proddetail/i.test(url) && text.length > 500) return true;
  const hits = text.match(
    /moq|min(?:imum)?\.?\s*order|specification|model(?:\s*number|\s*no)?|wattage|起订|型号|规格|thông số|số lượng|fob price|unit price/gi,
  );
  return text.length > 800 && (hits?.length ?? 0) >= 2;
}

function productRank(href: string) {
  try {
    const url = new URL(href);
    if (!isMarketplace(url.hostname) && !/\/product|\/item|\/offer|proddetail/i.test(url.pathname)) return 0;
    if (/product-detail|\/item\/|\/offer\/|proddetail|product-details/i.test(href)) return 3;
    if (/\/product\//i.test(url.pathname)) return 2;
    return 0;
  } catch {
    return 0;
  }
}

function pickProductLink(links: string[], self: string) {
  let best = "";
  let rank = 0;
  const seen = new Set<string>();
  for (const link of links) {
    if (seen.has(link) || link === self) continue;
    seen.add(link);
    const next = productRank(link);
    if (next > rank) {
      rank = next;
      best = link;
    }
    if (rank === 3) break;
  }
  return best;
}

async function fetchPublic(start: string) {
  let current = start;
  for (let hop = 0; hop < 4; hop += 1) {
    const url = new URL(current);
    if (!(await isPublicHost(url.hostname))) return null;
    const response = await fetch(current, {
      redirect: "manual",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return null;
      current = new URL(location, current).toString();
      continue;
    }
    const html = (await response.text()).slice(0, 1_500_000);
    return { finalUrl: current, status: response.status, html };
  }
  return null;
}

function languageName(lang: Lang) {
  if (lang === "zh") return "Chinese (simplified)";
  if (lang === "vi") return "Vietnamese";
  return "English";
}

function parseModel(raw: string): ModelJson | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as ModelJson;
  } catch {
    return null;
  }
}

function scrubFinding(value: string) {
  const parts = value
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[。！？.!?])/);
  const kept = parts.map((part) => part.trim()).filter((part) => part && !ADVICE.test(part));
  const joined = kept.join("");
  if (joined.length <= 180) return joined;
  const cut = joined.slice(0, 180);
  const space = cut.lastIndexOf(" ");
  return (space > 80 ? cut.slice(0, space) : cut).trim();
}

function clamp(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(20, Math.round(value)));
}

function toScore(data: ModelJson, fallbackUrl: string): ScoreResponse {
  if (data.isListing === false || !Array.isArray(data.marks) || data.marks.length === 0) {
    return { ok: false, error: data.blocked ? "blocked" : "not_listing" };
  }
  const marks = MARKS.map((id) => {
    const found = data.marks?.find((mark) => mark.id === id);
    return {
      id,
      points: clamp(Number(found?.points)),
      finding: scrubFinding(String(found?.finding ?? "")),
    };
  });
  const pageTitle = String(data.pageTitle ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  return {
    ok: true,
    score: {
      url: fallbackUrl,
      pageTitle,
      score: marks.reduce((sum, mark) => sum + mark.points, 0),
      marks,
    },
  };
}

async function callModel(input: string): Promise<ModelJson | "unavailable" | "failed"> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return "unavailable";
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.20-0309-non-reasoning",
      temperature: 0,
      max_tokens: 700,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: RULES },
        { role: "user", content: input },
      ],
    }),
    signal: AbortSignal.timeout(35000),
  });
  if (response.status === 401 || response.status === 403) return "unavailable";
  if (!response.ok) return "failed";
  const body = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const text = body.choices?.[0]?.message?.content ?? "";
  const parsed = text ? parseModel(text) : null;
  return parsed ?? "failed";
}

async function scoreText(url: string, title: string, text: string, lang: Lang) {
  const input = `Write every finding in ${languageName(lang)}.
Score only the listing text below. Do not invent lines that are not in the text.

URL: ${url}
TITLE: ${title}
TEXT:
${text}`;
  const result = await callModel(input);
  if (result === "unavailable" || result === "failed") return { ok: false, error: result } as const;
  return toScore(result, url);
}

export async function runScore(raw: string, lang: Lang, pasted = ""): Promise<ScoreResponse> {
  const url = normalizeInput(raw);
  if (!url) return { ok: false, error: "bad_url" };
  const excerpt = pasted.replace(/\s+/g, " ").trim().slice(0, 8000);
  const key = `${lang}|${url.toString()}|${excerpt.slice(0, 160)}`;
  const cached = cache.get(key);
  if (cached) return { ok: true, score: cached };
  if (!takeSlot()) return { ok: false, error: "busy" };

  try {
    const scored =
      excerpt.length >= 80 ? await scoreText(url.toString(), "", excerpt, lang) : await scoreTarget(url, lang);
    if (scored.ok) remember(key, scored.score);
    return scored;
  } catch {
    return { ok: false, error: "failed" };
  }
}

async function scoreTarget(url: URL, lang: Lang, depth = 0): Promise<ScoreResponse> {
  const page = await fetchPublic(url.toString());
  if (!page) return { ok: false, error: "blocked" };
  const extracted = extract(page.html, page.finalUrl);
  if (looksBlocked(page.status, extracted.text, page.html)) return { ok: false, error: "blocked" };
  if (depth === 0) {
    const productLink = pickProductLink(extracted.links, page.finalUrl);
    if (productLink) return scoreTarget(new URL(productLink), lang, 1);
  }
  if (!looksLikeListing(extracted.text, page.finalUrl)) return { ok: false, error: "not_listing" };
  return scoreText(page.finalUrl, extracted.title, extracted.text, lang);
}
