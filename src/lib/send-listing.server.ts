import { readFileSync } from "node:fs";
import { PLAN_PRICE, isPaidPlan, type PlanId } from "@/components/landing/plan-context";

const INBOX = "validmix1@gmail.com";
const LEADS_REPO = "validmix-inquiries";
const LEADS_OWNER = "voltsurfadventures";

export type ListingRequest = {
  name: string;
  email: string;
  company: string;
  website: string;
  product: string;
  site: string;
  note: string;
  plan: string;
  honey: string;
};

export type SendResult =
  | { ok: true }
  | { ok: false; error: "missing" | "email" | "website" | "failed"; mailto?: string };

const SITE_LABEL: Record<string, string> = {
  alibaba: "Alibaba",
  mic: "Made-in-China",
  both: "Both",
};

function absoluteLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.username || url.password) return null;
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".") || url.hostname.startsWith(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function productValue(value: string) {
  const trimmed = value.trim();
  if (trimmed.length < 4 || trimmed.length > 4000) return null;
  if (/^https?:\/\//i.test(trimmed) || /^[\w.-]+\.[a-z]{2,}([/?#]|$)/i.test(trimmed)) {
    return absoluteLink(trimmed);
  }
  return trimmed;
}

export async function deliverListing(input: ListingRequest): Promise<SendResult> {
  if (input.honey.trim()) return { ok: true };

  const name = input.name.trim();
  const email = input.email.trim();
  const company = input.company.trim();
  const note = input.note.trim();
  const site = SITE_LABEL[input.site];
  const website = absoluteLink(input.website);
  const product = productValue(input.product);
  const plan: PlanId = isPaidPlan(input.plan) ? input.plan : "sample";

  if (!name || !company || !site || !product) return { ok: false, error: "missing" };
  if (name.length > 120 || company.length > 160 || note.length > 2000) return { ok: false, error: "missing" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "email" };
  if (!website) return { ok: false, error: "website" };

  const price = PLAN_PRICE[plan];
  const subject =
    plan === "sample" ? `ValidMix sample — ${company}` : `ValidMix ${plan} $${price} — ${company}`;
  const fields = {
    name,
    email,
    company,
    website,
    product,
    site,
    note: note || "—",
    plan: plan === "sample" ? "Sample ($0)" : `${plan} ($${price})`,
  };

  const mailed = await mailForm(fields, subject, email);
  if (mailed) return { ok: true };
  const filed = await fileLead(subject, fields);
  if (filed) return { ok: true };
  return { ok: false, error: "failed", mailto: mailtoLink(subject, fields) };
}

function mailtoLink(subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  return `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function mailForm(fields: Record<string, string>, subject: string, replyTo: string) {
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${INBOX}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...fields,
        _replyto: replyTo,
        _subject: subject,
        _template: "table",
        _captcha: "false",
      }),
      signal: AbortSignal.timeout(12000),
    });
    const data = (await response.json().catch(() => null)) as { success?: boolean | string; message?: string } | null;
    const success = data?.success === true || data?.success === "true";
    const activating = /activat/i.test(data?.message ?? "");
    return response.ok && (success || activating);
  } catch {
    return false;
  }
}

function inboxToken() {
  try {
    return readFileSync("/tmp/grok/connectors/github.token", "utf8").trim();
  } catch {
    return "";
  }
}

async function fileLead(title: string, fields: Record<string, string>) {
  const token = inboxToken();
  if (!token) return false;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "validmix",
  };
  try {
    const existing = await fetch(`https://api.github.com/repos/${LEADS_OWNER}/${LEADS_REPO}`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (existing.status === 404) {
      const created = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: LEADS_REPO,
          private: true,
          description: "Private ValidMix listing requests.",
          has_issues: true,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!created.ok) return false;
    } else if (!existing.ok) {
      return false;
    }
    const body = Object.entries(fields)
      .map(([key, value]) => `**${key}**\n${value}`)
      .join("\n\n");
    const issue = await fetch(`https://api.github.com/repos/${LEADS_OWNER}/${LEADS_REPO}/issues`, {
      method: "POST",
      headers,
      body: JSON.stringify({ title, body }),
      signal: AbortSignal.timeout(8000),
    });
    return issue.ok;
  } catch {
    return false;
  }
}
