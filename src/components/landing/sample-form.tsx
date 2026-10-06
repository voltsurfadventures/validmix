import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/landing/locale";
import { type PaidPlanId } from "@/components/landing/plan-context";
import { sendListing } from "@/lib/send-listing";
import { cn } from "@/lib/utils";

type Site = "alibaba" | "mic" | "both";

export function SampleForm({ id, plan, tone = "ink" }: { id: string; plan?: PaidPlanId; tone?: "ink" | "paper" }) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [product, setProduct] = useState("");
  const [site, setSite] = useState<Site | "">("");
  const [note, setNote] = useState("");
  const [honey, setHoney] = useState("");
  const [error, setError] = useState("");
  const [mailto, setMailto] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const onInk = tone === "ink";

  if (sent) {
    return (
      <div
        className={cn("rounded-card border p-6", onInk ? "border-paper/20 bg-paper text-ink" : "border-line bg-card text-ink")}
        role="status"
      >
        <p className="text-pretty">{plan ? t.form.paySuccess : t.form.success}</p>
      </div>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending) return;
    if (!name.trim() || !email.trim() || !company.trim() || !website.trim() || !product.trim() || !site) {
      setError(t.form.missing);
      return;
    }
    setError("");
    setMailto("");
    setPending(true);
    try {
      const result = await sendListing({
        data: {
          name,
          email,
          company,
          website,
          product,
          site,
          note,
          plan: plan ?? "sample",
          honey,
        },
      });
      if (!result.ok) {
        setError(
          result.error === "email"
            ? t.form.emailBad
            : result.error === "website"
              ? t.form.websiteBad
              : result.error === "missing"
                ? t.form.missing
                : t.form.failed,
        );
        setMailto(result.mailto ?? "");
        return;
      }
      setSent(true);
    } catch {
      setError(t.form.failed);
    } finally {
      setPending(false);
    }
  };

  const sites: { id: Site; label: string }[] = [
    { id: "alibaba", label: t.form.siteAli },
    { id: "mic", label: t.form.siteMic },
    { id: "both", label: t.form.siteBoth },
  ];

  return (
    <form id={id} onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Field id={`${id}-name`} label={t.form.name} onInk={onInk}>
        <Input id={`${id}-name`} name="name" autoComplete="name" value={name} disabled={pending} onChange={(event) => setName(event.target.value)} className="bg-paper" />
      </Field>
      <Field id={`${id}-email`} label={t.form.email} onInk={onInk}>
        <Input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          disabled={pending}
          onChange={(event) => setEmail(event.target.value)}
          className="bg-paper"
        />
      </Field>
      <Field id={`${id}-company`} label={t.form.company} onInk={onInk}>
        <Input
          id={`${id}-company`}
          name="organization"
          autoComplete="organization"
          value={company}
          disabled={pending}
          onChange={(event) => setCompany(event.target.value)}
          className="bg-paper"
        />
      </Field>
      <Field id={`${id}-website`} label={t.form.website} onInk={onInk}>
        <Input
          id={`${id}-website`}
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder={t.form.websitePlaceholder}
          value={website}
          disabled={pending}
          onChange={(event) => setWebsite(event.target.value)}
          className="bg-paper"
        />
      </Field>
      <Field id={`${id}-product`} label={t.form.product} onInk={onInk}>
        <textarea
          id={`${id}-product`}
          name="product"
          rows={4}
          placeholder={t.form.productPlaceholder}
          value={product}
          disabled={pending}
          onChange={(event) => setProduct(event.target.value)}
          className="min-h-24 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
        />
      </Field>
      <fieldset>
        <legend className={cn("text-sm font-medium", onInk ? "text-paper" : "text-ink")}>{t.form.site}</legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label={t.form.site}>
          {sites.map((item) => (
            <label
              key={item.id}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-3 text-center text-sm font-medium",
                site === item.id
                  ? onInk
                    ? "border-paper bg-paper text-ink"
                    : "border-ink bg-ink text-paper"
                  : onInk
                    ? "border-paper/30 text-paper"
                    : "border-line text-ink",
              )}
            >
              <input
                type="radio"
                name={`${id}-site`}
                value={item.id}
                checked={site === item.id}
                disabled={pending}
                onChange={() => setSite(item.id)}
                className="sr-only"
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>
      <Field id={`${id}-note`} label={t.form.note} hint={t.form.noteOptional} onInk={onInk}>
        <textarea
          id={`${id}-note`}
          name="note"
          rows={3}
          value={note}
          disabled={pending}
          onChange={(event) => setNote(event.target.value)}
          className="min-h-20 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
        />
      </Field>
      <input
        name="company_url"
        tabIndex={-1}
        autoComplete="off"
        value={honey}
        onChange={(event) => setHoney(event.target.value)}
        className="absolute -left-[9999px] h-px w-px"
        aria-hidden="true"
      />
      <Button type="submit" variant={onInk ? "inverse" : "primary"} disabled={pending}>
        {pending ? t.form.sending : plan ? t.form.payButton : t.form.button}
      </Button>
      {error ? (
        <p className={cn("text-sm", onInk ? "text-paper" : "text-ink")} role="alert">
          {error}
          {mailto ? (
            <>
              {" "}
              <a href={mailto} className="font-medium underline underline-offset-4">
                {t.form.emailInstead}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  onInk,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  onInk: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={onInk ? "text-paper" : "text-ink"}>
        {label}
        {hint ? <span className={cn("font-normal", onInk ? "text-paper/60" : "text-muted")}> {hint}</span> : null}
      </Label>
      {children}
    </div>
  );
}
