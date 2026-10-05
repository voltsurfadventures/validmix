import { useEffect, useState } from "react";
import { useI18n } from "@/components/landing/locale";
import { cn } from "@/lib/utils";

type MarketView = "alibaba" | "mic";
type Mode = "draft" | "polished";

type Listing = {
  titleLabel: string;
  title: string;
  rows: [string, string][];
  note: string;
  score: number;
};

const COPY: Record<MarketView, Record<Mode, Listing>> = {
  alibaba: {
    draft: {
      titleLabel: "Product title",
      title: "LED bulb lamp is very good quality and cheap price, we factory hot sale, welcome inquiry best supplier",
      rows: [
        ["Wattage", "—"],
        ["Lamp base", "—"],
        ["Color temperature", "white"],
        ["Certification", "yes"],
        ["Min. order", "discuss"],
      ],
      note: "Keyword-stuffed title. Required attributes are empty, so buyers cannot filter or quote.",
      score: 34,
    },
    polished: {
      titleLabel: "Product title",
      title: "9W A60 LED Bulb, E27, 3000K–6500K, CE & RoHS, MOQ 1,000 pcs",
      rows: [
        ["Wattage", "9W"],
        ["Lamp base", "E27 / B22"],
        ["Color temperature", "3000K / 4000K / 6500K"],
        ["Certification", "CE, RoHS"],
        ["Min. order", "1,000 pcs"],
      ],
      note: "A searchable spec title. Attributes match the filters buyers actually use.",
      score: 92,
    },
  },
  mic: {
    draft: {
      titleLabel: "Product name",
      title: "We are make LED light bulb, quality very high, price is cheap, many stock please contact now",
      rows: [
        ["Model number", "A60"],
        ["Material", "—"],
        ["Voltage", "normal"],
        ["Place of origin", "China"],
        ["Supply ability", "many"],
      ],
      note: "The Made-in-China spec table is too vague for a purchasing shortlist.",
      score: 31,
    },
    polished: {
      titleLabel: "Product name",
      title: "A60 LED Bulb 9W E27 220V, PC + Aluminum, 25,000h, Ningbo",
      rows: [
        ["Model number", "VM-A60-9W"],
        ["Material", "PC cover, aluminum heat sink"],
        ["Voltage", "AC 175–265V"],
        ["Place of origin", "Ningbo, China"],
        ["Supply ability", "500,000 pcs / month"],
      ],
      note: "A specification table a buyer can paste straight into an RFQ.",
      score: 90,
    },
  },
};

type Phase = "hold-bad" | "deleting-bad" | "typing-good" | "hold-good" | "deleting-good" | "typing-bad";

function useRewrite(bad: string, good: string) {
  const [text, setText] = useState(bad);
  const [phase, setPhase] = useState<Phase>("hold-bad");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setText(good);
      setPhase("hold-good");
      return;
    }

    let cancelled = false;
    let timer = 0;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(() => resolve(), ms);
      });

    const erase = async (source: string) => {
      for (let i = source.length; i >= 0; i -= 1) {
        if (cancelled) return;
        setText(source.slice(0, i));
        await wait(26);
      }
    };

    const type = async (source: string) => {
      for (let i = 1; i <= source.length; i += 1) {
        if (cancelled) return;
        setText(source.slice(0, i));
        await wait(38);
      }
    };

    const run = async () => {
      while (!cancelled) {
        setPhase("hold-bad");
        setText(bad);
        await wait(80);
        if (cancelled) return;

        setPhase("deleting-bad");
        await erase(bad);
        if (cancelled) return;
        await wait(180);

        setPhase("typing-good");
        await type(good);
        if (cancelled) return;

        setPhase("hold-good");
        setText(good);
        await wait(1400);
        if (cancelled) return;

        setPhase("deleting-good");
        await erase(good);
        if (cancelled) return;
        await wait(180);

        setPhase("typing-bad");
        await type(bad);
        if (cancelled) return;
      }
    };

    void run();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [bad, good]);

  return { text, phase };
}

export function ListingDemo() {
  const [market, setMarket] = useState<MarketView>("alibaba");

  return (
    <figure className="demo-card p-4 sm:p-6">
      <figcaption className="sr-only">
        Sample listing. The title deletes, then the rewrite is typed.
      </figcaption>
      <div className="grid grid-cols-2 rounded-md border border-line bg-paper p-1" role="group" aria-label="Marketplace">
        <Toggle
          pressed={market === "alibaba"}
          onClick={() => setMarket("alibaba")}
          label="Alibaba"
        />
        <Toggle
          pressed={market === "mic"}
          onClick={() => setMarket("mic")}
          label="Made-in-China"
        />
      </div>
      <AnimatedListing key={market} market={market} />
    </figure>
  );
}

function AnimatedListing({ market }: { market: MarketView }) {
  const { t } = useI18n();
  const draft = COPY[market].draft;
  const polished = COPY[market].polished;
  const { text, phase } = useRewrite(draft.title, polished.title);
  const done = phase === "hold-good" || phase === "deleting-good";
  const listing = done ? polished : draft;
  const typing = phase !== "hold-bad" && phase !== "hold-good";
  const status =
    phase === "deleting-bad"
      ? t.demo.deleting
      : phase === "typing-good"
        ? t.demo.typing
        : phase === "hold-good" || phase === "deleting-good"
          ? t.demo.rewritten
          : phase === "typing-bad"
            ? t.demo.restoring
            : t.demo.messy;
  const note =
    market === "alibaba"
      ? done
        ? t.demo.noteGoodAli
        : t.demo.noteDraftAli
      : done
        ? t.demo.noteGoodMic
        : t.demo.noteDraftMic;
  const titleLabel = market === "alibaba" ? t.demo.productTitle : t.demo.productName;

  return (
    <>
      <p className="mt-4 text-sm font-medium text-muted">{status}</p>
      <div className="mt-3">
        <p className="text-xs font-medium tracking-wide text-faint uppercase">{titleLabel}</p>
        <p className="demo-title mt-2 text-lg leading-snug font-semibold text-ink" aria-hidden="true">
          {text}
          {typing ? <span className="type-caret" /> : null}
        </p>
        <dl className="mt-4 divide-y divide-line border-y border-line">
          {listing.rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="text-sm text-muted">{label}</dt>
              <dd
                className={cn(
                  "text-right text-sm font-medium tabular-nums",
                  value === "—" ||
                    value === "discuss" ||
                    value === "yes" ||
                    value === "white" ||
                    value === "normal" ||
                    value === "many"
                    ? "text-faint"
                    : "text-ink",
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-pretty text-muted">{note}</p>
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted">Listing score</span>
            <span className="font-display text-2xl text-ink tabular-nums">{listing.score}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-paper-2" aria-hidden="true">
            <div className="score-fill" style={{ width: `${listing.score}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}

function Toggle({
  pressed,
  onClick,
  label,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "h-9 rounded-sm px-3 text-sm font-medium transition-[background-color,color] duration-150",
        pressed ? "bg-ink text-paper" : "text-muted hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}
