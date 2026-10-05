import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/landing/locale";
import { scoreListing, type ListingScore, type ScoreError } from "@/lib/score-listing";
import { cn } from "@/lib/utils";

function listingUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function ScoreForm({ id, tone = "paper" }: { id: string; tone?: "paper" | "ink" }) {
  const { t, lang } = useI18n();
  const [listing, setListing] = useState("");
  const [error, setError] = useState("");
  const [pasted, setPasted] = useState("");
  const [needsPaste, setNeedsPaste] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ListingScore | null>(null);
  const onInk = tone === "ink";

  if (result) {
    return (
      <div className="demo-card border border-line p-5 text-ink" role="status">
        <p className="text-sm font-medium text-muted">{t.form.scored}</p>
        {result.pageTitle ? <p className="card-title mt-2 text-lg text-pretty">{result.pageTitle}</p> : null}
        <a
          href={result.url}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block truncate text-sm text-muted underline-offset-4 hover:underline"
        >
          {result.url}
        </a>
        <p className="hero-title mt-4 text-6xl tabular-nums text-ink">{result.score}</p>
        <p className="text-sm text-muted">{t.form.outOf}</p>
        <ul className="mt-5 flex flex-col gap-4 border-t border-line pt-4">
          {result.marks.map((mark) => (
            <li key={mark.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="card-title text-base">{t.form.marks[mark.id]}</span>
                <span className="text-sm tabular-nums text-muted">{mark.points}/20</span>
              </div>
              {mark.finding ? <p className="mt-1 text-sm text-pretty text-muted">{mark.finding}</p> : null}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm font-medium text-ink">{t.form.scoreOnly}</p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-3 text-sm font-medium underline-offset-4 hover:underline"
        >
          {t.form.change}
        </button>
      </div>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;
    if (!listing.trim()) {
      setError(t.form.linkMissing);
      return;
    }
    const next = listingUrl(listing);
    if (!next) {
      setError(t.form.linkBad);
      return;
    }
    if (needsPaste && pasted.trim().length < 80) {
      setError(t.form.pasteShort);
      return;
    }
    setError("");
    setPending(true);
    try {
      const response = await scoreListing({
        data: { url: next, lang, text: needsPaste ? pasted.trim() : "" },
      });
      if (!response.ok) {
        if (response.error === "blocked") setNeedsPaste(true);
        setError(t.form[errorKey(response.error)]);
        return;
      }
      setNeedsPaste(false);
      setResult(response.score);
    } catch {
      setError(t.form.failed);
    } finally {
      setPending(false);
    }
  };

  return (
    <form id={id} onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-listing`} className={onInk ? "text-paper" : undefined}>
          {t.form.link}
        </Label>
        <Input
          id={`${id}-listing`}
          name="listing"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder={t.form.linkPlaceholder}
          value={listing}
          disabled={pending}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : `${id}-help`}
          onChange={(event) => {
            setListing(event.target.value);
            setNeedsPaste(false);
            if (error) setError("");
          }}
          className={onInk ? "border-paper/25 bg-paper text-ink" : undefined}
        />
      </div>
      {needsPaste ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-paste`} className={onInk ? "text-paper" : undefined}>
            {t.form.paste}
          </Label>
          <textarea
            id={`${id}-paste`}
            name="listing-text"
            rows={6}
            value={pasted}
            disabled={pending}
            placeholder={t.form.pastePlaceholder}
            onChange={(event) => {
              setPasted(event.target.value);
              if (error) setError("");
            }}
            className="min-h-32 rounded-md border border-line bg-card px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
          />
        </div>
      ) : null}
      <Button type="submit" variant={onInk ? "inverse" : "primary"} disabled={pending}>
        {pending ? t.form.scoring : needsPaste ? t.form.pasteButton : t.form.button}
      </Button>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : (
        <p id={`${id}-help`} className={cn("text-sm", onInk ? "text-paper/70" : "text-muted")}>
          {needsPaste ? t.form.pasteHelp : t.form.helper}
        </p>
      )}
    </form>
  );
}

function errorKey(error: ScoreError): "linkBad" | "blocked" | "notListing" | "unavailable" | "failed" | "busy" {
  if (error === "bad_url") return "linkBad";
  if (error === "blocked") return "blocked";
  if (error === "not_listing") return "notListing";
  if (error === "unavailable") return "unavailable";
  if (error === "busy") return "busy";
  return "failed";
}
