import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/components/landing/locale";
import { cn } from "@/lib/utils";

type Site = "alibaba" | "mic" | "both";

type SampleRequest = {
  name: string;
  email: string;
  company: string;
  website: string;
  product: string;
  site: Site;
  note: string;
};

const KEY = "validmix-sample";

export function SampleForm({ id }: { id: string }) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [product, setProduct] = useState("");
  const [site, setSite] = useState<Site | "">("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-card border border-paper/20 bg-paper p-6 text-ink" role="status">
        <p className="text-pretty text-ink">{t.form.success}</p>
      </div>
    );
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !company.trim() || !website.trim() || !product.trim() || !site) {
      setError(t.form.missing);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(t.form.emailBad);
      return;
    }
    const request: SampleRequest = {
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      website: website.trim(),
      product: product.trim(),
      site,
      note: note.trim(),
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(request));
    } catch {
      /* the confirmation still shows; nothing is sent to a server */
    }
    setError("");
    setSent(true);
  };

  const sites: { id: Site; label: string }[] = [
    { id: "alibaba", label: t.form.siteAli },
    { id: "mic", label: t.form.siteMic },
    { id: "both", label: t.form.siteBoth },
  ];

  return (
    <form id={id} onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Field id={`${id}-name`} label={t.form.name}>
        <Input id={`${id}-name`} name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="bg-paper" />
      </Field>
      <Field id={`${id}-email`} label={t.form.email}>
        <Input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="bg-paper"
        />
      </Field>
      <Field id={`${id}-company`} label={t.form.company}>
        <Input
          id={`${id}-company`}
          name="organization"
          autoComplete="organization"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          className="bg-paper"
        />
      </Field>
      <Field id={`${id}-website`} label={t.form.website}>
        <Input
          id={`${id}-website`}
          name="url"
          type="text"
          autoComplete="url"
          placeholder={t.form.websitePlaceholder}
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="bg-paper"
        />
      </Field>
      <Field id={`${id}-product`} label={t.form.product}>
        <textarea
          id={`${id}-product`}
          name="product"
          rows={4}
          placeholder={t.form.productPlaceholder}
          value={product}
          onChange={(event) => setProduct(event.target.value)}
          className="min-h-24 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
        />
      </Field>
      <fieldset>
        <legend className="text-sm font-medium text-paper">{t.form.site}</legend>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label={t.form.site}>
          {sites.map((item) => (
            <label
              key={item.id}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-medium",
                site === item.id ? "border-paper bg-paper text-ink" : "border-paper/30 text-paper",
              )}
            >
              <input
                type="radio"
                name={`${id}-site`}
                value={item.id}
                checked={site === item.id}
                onChange={() => setSite(item.id)}
                className="sr-only"
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>
      <Field id={`${id}-note`} label={t.form.note} hint={t.form.noteOptional}>
        <textarea
          id={`${id}-note`}
          name="note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="min-h-20 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
        />
      </Field>
      <Button type="submit" variant="inverse">
        {t.form.button}
      </Button>
      {error ? (
        <p className="text-sm text-paper" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-paper">
        {label}
        {hint ? <span className="font-normal text-paper/60"> {hint}</span> : null}
      </Label>
      {children}
    </div>
  );
}
