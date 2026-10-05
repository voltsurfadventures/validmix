import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  Languages,
  ListChecks,
  Menu,
  ShieldCheck,
  SplitSquareHorizontal,
  X,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingDemo } from "@/components/landing/listing-demo";
import { useI18n, type Lang } from "@/components/landing/locale";
import { CURRENCIES, formatMoney, PLANS, type PlanId, usePlan } from "@/components/landing/plan-context";
import { ScoreForm } from "@/components/landing/score-form";
import { cn } from "@/lib/utils";

const PLACES = [
  "Alibaba",
  "Made-in-China",
  "Global Sources",
  "IndiaMART",
  "1688",
  "DHgate",
  "EC21",
  "AliExpress",
];

const ICONS = [FileText, ListChecks, Languages, Camera, ShieldCheck, SplitSquareHorizontal];

const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "zh", label: "中文" },
  { id: "vi", label: "VI" },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <main>
        <Hero />
        <Product />
        <Method />
        <Pricing />
        <Stories />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function useNav() {
  const { t } = useI18n();
  return [
    { href: "#product", label: t.nav.product },
    { href: "#method", label: t.nav.method },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#stories", label: t.nav.stories },
  ];
}

function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-2 text-sm" role="group" aria-label="Language">
      {LANGS.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={lang === item.id}
          onClick={() => setLang(item.id)}
          className={cn("font-medium", lang === item.id ? "text-ink" : "text-quiet hover:text-ink")}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function SiteHeader() {
  const { t } = useI18n();
  const nav = useNav();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  const follow = (href: string) => {
    setOpen(false);
    const target = document.querySelector(href);
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-paper/95 backdrop-blur-sm transition-[border-color] duration-150",
        scrolled || open ? "border-line" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <a href="#top" className="shrink-0" onClick={close}>
          <span className="wordmark wordmark-nav">
            <img src="/wordmark.png" alt="ValidMix" />
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-muted hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <LangSwitch />
          <Button asChild>
            <a href="#signup">{t.cta}</a>
          </Button>
        </div>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md border border-line md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? t.menuClose : t.menuOpen}</span>
          <span className="relative size-5">
            <Menu
              className={cn("menu-icon", open && "menu-icon-out")}
              strokeWidth={1.75}
            />
            <X
              className={cn("menu-icon", !open && "menu-icon-out")}
              strokeWidth={1.75}
            />
          </span>
        </button>
      </div>
      <div id="mobile-nav" className={cn("nav-panel absolute inset-x-0 top-full z-30 bg-paper md:hidden", open ? "border-b border-line" : "pointer-events-none")} data-open={open ? "true" : "false"}>
        <div>
          <nav className="flex flex-col gap-1 px-5 pt-2 pb-5" aria-label="Mobile">
            <div className="mb-2">
              <LangSwitch />
            </div>
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  follow(item.href);
                }}
                className="flex h-11 items-center text-base font-medium text-ink"
              >
                {item.label}
              </a>
            ))}
            <Button asChild className="mt-2">
              <a
                href="#signup"
                onClick={(event) => {
                  event.preventDefault();
                  follow("#signup");
                }}
              >
                {t.cta}
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="mx-auto max-w-6xl px-5 pt-5 pb-16 md:px-8 md:pt-8 md:pb-24">
      <ul className="flex flex-wrap justify-between gap-x-6 gap-y-2 text-sm font-medium text-quiet">
        {PLACES.map((place) => (
          <li key={place}>{place}</li>
        ))}
      </ul>
      <div className="mt-5 grid items-start gap-6 lg:mt-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <h1 className="hero-title rise text-display text-balance text-ink">{t.heroTitle}</h1>
          <div className="mt-5 lg:hidden">
            <ListingDemo />
          </div>
          <p className="rise rise-2 mt-5 max-w-xl text-lg text-pretty text-ink">{t.heroSub}</p>
          <div className="rise rise-3 mt-8">
            <ScoreForm id="hero-signup" />
          </div>
          <ul className="mt-8 flex flex-col gap-2 text-sm text-ink sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {t.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:block">
          <ListingDemo />
        </div>
      </div>
    </section>
  );
}

function Product() {
  const { t } = useI18n();
  return (
    <section id="product" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-sm font-medium text-muted">{t.featuresKicker}</p>
        <h2 className="mt-3 max-w-2xl font-display text-section text-balance text-ink">{t.featuresTitle}</h2>
        <p className="mt-4 max-w-2xl text-pretty text-ink">{t.featuresIntro}</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.map((feature, index) => {
            const Icon = ICONS[index] ?? FileText;
            return (
              <article key={feature.title} className="card-lift rounded-card border border-line bg-card p-6">
                <div className="flex size-10 items-center justify-center rounded-md border border-line text-navy">
                  <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="card-title mt-5 text-lg text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm text-pretty text-muted">{feature.body}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-10">
          <Button asChild variant="secondary">
            <a href="#signup">
              {t.featureCta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Method() {
  const { t } = useI18n();
  return (
    <section id="method" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-sm font-medium text-muted">{t.methodKicker}</p>
        <h2 className="mt-3 max-w-2xl font-display text-section text-balance text-ink">{t.methodTitle}</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {t.steps.map((step, index) => (
            <li key={step.title} className="border-t border-ink pt-5">
              <p className="font-display text-2xl text-ink tabular-nums">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="card-title mt-3 text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-pretty text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pricing() {
  const { t } = useI18n();
  const { plan, setPlan, annual, setAnnual, currency, setCurrency, rates } = usePlan();
  const tiers: { id: PlanId; featured?: boolean; blurb: string; points: string[] }[] = [
    { id: "bench", blurb: t.benchBlurb, points: t.benchPoints },
    { id: "floor", featured: true, blurb: t.floorBlurb, points: t.floorPoints },
  ];

  const choose = (id: PlanId) => {
    setPlan(id);
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted">{t.pricingKicker}</p>
            <h2 className="mt-3 max-w-xl font-display text-section text-balance text-ink">{t.pricingTitle}</h2>
            <p className="mt-4 max-w-xl text-pretty text-ink">{t.pricingIntro}</p>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-3">
            <label className="flex items-center justify-between gap-3 text-sm font-medium text-ink">
              <span>{t.currency}</span>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as typeof currency)}
                className="h-11 rounded-md border border-line bg-card px-3 text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>
            <div className="billing-track" role="radiogroup" aria-label="Billing period">
              <span className="billing-pill" data-annual={annual ? "true" : "false"} aria-hidden="true" />
              <BillingOption checked={!annual} onSelect={() => setAnnual(false)} label={t.monthly} />
              <BillingOption checked={annual} onSelect={() => setAnnual(true)} label={t.annual} />
            </div>
          </div>
        </div>

        <div className="mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
          {tiers.map((tier) => {
            const details = PLANS[tier.id];
            const price = annual ? details.yearly : details.monthly;
            const priceLabel = formatMoney(price, currency, rates);
            const selected = plan === tier.id;
            return (
              <article
                key={tier.id}
                className={cn(
                  "card-lift flex flex-col rounded-card border bg-card p-6",
                  tier.featured ? "border-ink" : "border-line",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl text-ink">{details.name}</h3>
                  {tier.featured ? (
                    <span className="rounded-md bg-ink px-2 py-1 text-xs font-medium text-paper">{t.mostChosen}</span>
                  ) : null}
                </div>
                <p className="mt-2 min-h-12 text-sm text-pretty text-muted">{tier.blurb}</p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-section text-ink tabular-nums">{priceLabel}</span>
                  <span className="text-sm text-muted">{annual ? t.perYear : t.perMonth}</span>
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {tier.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm text-ink">
                      <Check className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={tier.featured || selected ? "primary" : "secondary"}
                  onClick={() => choose(tier.id)}
                >
                  {t.continue} {details.name}
                </Button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BillingOption({
  checked,
  onSelect,
  label,
}: {
  checked: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        "relative z-10 h-10 rounded-pill text-sm font-medium transition-colors duration-150",
        checked ? "text-paper" : "text-muted hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}

function Stories() {
  const { t } = useI18n();
  return (
    <section id="stories" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-sm font-medium text-muted">{t.storiesKicker}</p>
        <h2 className="mt-3 max-w-2xl font-display text-section text-balance text-ink">{t.storiesTitle}</h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {t.stories.map((story) => (
            <figure key={story.name} className="card-lift flex flex-col rounded-card border border-line bg-card p-6">
              <blockquote className="flex-1 text-pretty text-ink">“{story.quote}”</blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <p className="font-medium text-ink">{story.name}</p>
                <p className="mt-1 text-sm text-muted">{story.role}</p>
                <p className="mt-2 text-xs font-medium tracking-wide text-faint uppercase">{story.where}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const { t } = useI18n();
  return (
    <section id="signup" className="scroll-mt-24 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="font-display text-section text-balance">{t.finalTitle}</h2>
          <p className="mt-4 max-w-md text-pretty text-paper/80">{t.finalBody}</p>
        </div>
        <ScoreForm id="footer-signup" tone="ink" />
      </div>
    </section>
  );
}

function SiteFooter() {
  const { t } = useI18n();
  const nav = useNav();
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <span className="wordmark wordmark-footer">
            <img src="/wordmark.png" alt="" />
          </span>
          <p className="mt-4 max-w-sm text-sm text-pretty text-muted">{t.footer}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium" aria-label="Footer">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-muted hover:text-ink">
              {item.label}
            </a>
          ))}
          <a href="#signup" className="text-ink">
            {t.ctaShort}
          </a>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-8 md:px-8">
        <p className="text-xs text-faint">© 2026 ValidMix</p>
      </div>
    </footer>
  );
}
