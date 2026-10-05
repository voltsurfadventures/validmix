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
import { PLANS, type PlanId, usePlan } from "@/components/landing/plan-context";
import { SignupForm } from "@/components/landing/signup-form";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#product", label: "Product" },
  { href: "#method", label: "Method" },
  { href: "#pricing", label: "Pricing" },
  { href: "#stories", label: "Stories" },
];

const FEATURES = [
  {
    icon: FileText,
    title: "Titles buyers can filter",
    body: "Alibaba search favors a structured title: product, spec, use, certification. Inside the character limit, without keyword stuffing.",
  },
  {
    icon: ListChecks,
    title: "Attributes that are filled",
    body: "Blank wattage, material, or MOQ fields bury a SKU on both marketplaces. ValidMix completes the required set from your spec sheet.",
  },
  {
    icon: Languages,
    title: "English a buyer can quote",
    body: "Factory shorthand becomes lead time, packing, and incoterm language a procurement desk can forward internally.",
  },
  {
    icon: Camera,
    title: "A shot list, not a guess",
    body: "Each claim maps to a photo: nameplate, dimension, packaging, certification mark. The photographer knows what to shoot.",
  },
  {
    icon: ShieldCheck,
    title: "A compliance pass",
    body: "Superlatives, medical claims, and mismatched certificates get flagged before a listing is rejected or quietly discounted.",
  },
  {
    icon: SplitSquareHorizontal,
    title: "One brief, two marketplaces",
    body: "Alibaba and Made-in-China want different field order and length. You edit the product once. ValidMix shapes both listings.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Send the messy listing",
    body: "Paste a product URL, a spreadsheet row, or the Chinese spec. Model numbers stay exact. We do not invent specifications.",
  },
  {
    n: "02",
    title: "Review the rewrite",
    body: "Title, attributes, description, image notes, and a change log. Accept a line, edit it, or lock a term in your glossary.",
  },
  {
    n: "03",
    title: "Publish both versions",
    body: "Export an Alibaba-ready listing and a Made-in-China-ready listing. Your team posts. The log shows the factory what changed.",
  },
];

const TIERS: {
  id: PlanId;
  points: string[];
  featured?: boolean;
}[] = [
  {
    id: "bench",
    points: [
      "25 SKUs each month",
      "Alibaba or Made-in-China",
      "Title, attributes, and description",
      "Score before and after",
    ],
  },
  {
    id: "floor",
    featured: true,
    points: [
      "120 SKUs each month",
      "Both marketplaces, every SKU",
      "Keyword map and image brief",
      "Change log your team can follow",
    ],
  },
  {
    id: "line",
    points: [
      "Unlimited SKUs",
      "Five seats",
      "Glossary and tone lock",
      "Editor review on flagship SKUs",
    ],
  },
];

const STORIES = [
  {
    quote:
      "Our Alibaba titles were factory shorthand. After the A60 rewrite, buyers filtered by color temperature and base instead of asking us to resend the spec.",
    name: "Chen Yu",
    role: "Export lead, Ningbo Harbor Lighting",
    where: "Alibaba",
  },
  {
    quote:
      "Half the Made-in-China attributes were blank. We stopped getting “please send specs” and started getting questions about MOQ and lead time.",
    name: "Amina Hassan",
    role: "Founder, Yiwu PackRight",
    where: "Made-in-China",
  },
  {
    quote:
      "We sell the same hardware on both sites. One brief, two formats. The change log is the document our factory actually follows.",
    name: "Lukas Berger",
    role: "Sales, Rhine & Pearl Trading",
    where: "Both marketplaces",
  },
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

function SiteHeader() {
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
          <img src="/wordmark.png" alt="ValidMix" className="h-8 w-auto sm:h-9" />
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-muted hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button asChild>
            <a href="#signup">Get a listing score</a>
          </Button>
        </div>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md border border-line md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
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
            {NAV.map((item) => (
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
                Get a listing score
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-5 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24">
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="rise text-sm font-medium tracking-wide text-muted">
            For suppliers on Alibaba and Made-in-China
          </p>
          <h1 className="rise rise-2 mt-4 font-display text-display text-balance text-ink">
            Factory specs, written so buyers inquire.
          </h1>
          <p className="rise rise-3 mt-5 max-w-xl text-lg text-pretty text-muted">
            ValidMix rewrites product listings — titles, required attributes, and buyer-language
            copy — so the right buyer can find the SKU and ask for a quote instead of basic specs.
          </p>
          <div className="rise rise-4 mt-8">
            <SignupForm id="hero-signup" compact />
          </div>
          <ul className="mt-8 flex flex-col gap-2 text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            <li>Model numbers stay exact</li>
            <li>Both marketplace formats</li>
            <li>A change log for the factory</li>
          </ul>
        </div>
        <div className="lg:pt-6">
          <ListingDemo />
        </div>
      </div>
    </section>
  );
}

function Product() {
  return (
    <section id="product" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-sm font-medium text-muted">Product</p>
        <h2 className="mt-3 max-w-2xl font-display text-section text-balance text-ink">
          What actually changes in the listing
        </h2>
        <p className="mt-4 max-w-2xl text-pretty text-muted">
          Buyers on Alibaba and Made-in-China.com decide from the title and the attribute table.
          ValidMix makes those fields complete, specific, and consistent with the product you ship.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-card border border-line bg-card p-6">
                <div className="flex size-10 items-center justify-center rounded-md border border-line text-ink">
                  <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm text-pretty text-muted">{feature.body}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-10">
          <Button asChild variant="secondary">
            <a href="#signup">
              Score a live listing
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section id="method" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-sm font-medium text-muted">Method</p>
        <h2 className="mt-3 max-w-2xl font-display text-section text-balance text-ink">
          Three steps from a factory sheet to a listing you can publish
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step) => (
            <li key={step.n} className="border-t border-ink pt-5">
              <p className="font-display text-2xl text-ink tabular-nums">{step.n}</p>
              <h3 className="mt-3 text-lg font-medium text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-pretty text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pricing() {
  const { plan, setPlan, annual, setAnnual } = usePlan();

  const choose = (id: PlanId) => {
    setPlan(id);
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Pricing</p>
            <h2 className="mt-3 max-w-xl font-display text-section text-balance text-ink">
              Priced by how many SKUs you publish
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-muted">
              USD. Monthly plans stop whenever you want. Annual plans include two months.
            </p>
          </div>
          <div
            className="billing-track w-full max-w-xs shrink-0"
            role="radiogroup"
            aria-label="Billing period"
          >
            <span className="billing-pill" data-annual={annual ? "true" : "false"} aria-hidden="true" />
            <BillingOption
              checked={!annual}
              onSelect={() => setAnnual(false)}
              label="Monthly"
            />
            <BillingOption checked={annual} onSelect={() => setAnnual(true)} label="Annual" />
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {TIERS.map((tier) => {
            const details = PLANS[tier.id];
            const price = annual ? details.yearly : details.monthly;
            const priceLabel = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(price);
            const selected = plan === tier.id;
            return (
              <article
                key={tier.id}
                className={cn(
                  "flex flex-col rounded-card border bg-card p-6",
                  tier.featured ? "border-ink" : "border-line",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl text-ink">{details.name}</h3>
                  {tier.featured ? (
                    <span className="rounded-sm border border-line px-2 py-1 text-xs font-medium text-muted">
                      Most desks
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 min-h-12 text-sm text-pretty text-muted">{details.blurb}</p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-section text-ink tabular-nums">{priceLabel}</span>
                  <span className="text-sm text-muted">{annual ? "per year" : "per month"}</span>
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
                  Continue with {details.name}
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
  return (
    <section id="stories" className="scroll-mt-24 border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-sm font-medium text-muted">Stories</p>
        <h2 className="mt-3 max-w-2xl font-display text-section text-balance text-ink">
          Desks that stopped resending the spec sheet
        </h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {STORIES.map((story) => (
            <figure key={story.name} className="flex flex-col rounded-card border border-line bg-card p-6">
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
  return (
    <section id="signup" className="scroll-mt-24 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="font-display text-section text-balance">
            Send one messy listing. We’ll show the polished version.
          </h2>
          <p className="mt-4 max-w-md text-pretty text-paper/75">
            A score on a live Alibaba or Made-in-China SKU, with the rewrite beside the original.
            Useful even if you stay on the Bench plan.
          </p>
        </div>
        <SignupForm id="footer-signup" tone="ink" />
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <img src="/wordmark.png" alt="" className="h-7 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-pretty text-muted">
            Listing polish for suppliers on Alibaba and Made-in-China.com. ValidMix is independent
            and is not affiliated with Alibaba Group or Focus Technology.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium" aria-label="Footer">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-muted hover:text-ink">
              {item.label}
            </a>
          ))}
          <a href="#signup" className="text-ink">
            Get a score
          </a>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-8 md:px-8">
        <p className="text-xs text-faint">© 2026 ValidMix</p>
      </div>
    </footer>
  );
}
