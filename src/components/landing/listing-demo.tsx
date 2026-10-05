import { useState } from "react";
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
      title: "led bulb cheap good quality factory wholesale price china supplier",
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
      title: "LED light bulb manufacturer good price",
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

export function ListingDemo() {
  const [market, setMarket] = useState<MarketView>("alibaba");
  const [mode, setMode] = useState<Mode>("polished");
  const listing = COPY[market][mode];

  return (
    <figure className="rounded-card border border-line bg-card p-4 sm:p-6">
      <figcaption className="sr-only">
        Sample lighting listing, draft compared with a ValidMix rewrite
      </figcaption>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 rounded-md border border-line p-1" role="group" aria-label="Marketplace">
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
        <div className="grid grid-cols-2 rounded-md border border-line p-1" role="group" aria-label="Listing version">
          <Toggle pressed={mode === "draft"} onClick={() => setMode("draft")} label="Draft" />
          <Toggle
            pressed={mode === "polished"}
            onClick={() => setMode("polished")}
            label="Polished"
          />
        </div>
      </div>

      <div key={`${market}-${mode}`} className="demo-swap mt-5">
        <p className="text-xs font-medium tracking-wide text-faint uppercase">{listing.titleLabel}</p>
        <p className="mt-2 text-lg leading-snug font-medium text-balance text-ink">{listing.title}</p>
        <dl className="mt-5 divide-y divide-line border-y border-line">
          {listing.rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="text-sm text-muted">{label}</dt>
              <dd
                className={cn(
                  "text-right text-sm font-medium tabular-nums",
                  value === "—" || value === "discuss" || value === "yes" || value === "white" || value === "normal" || value === "many"
                    ? "text-faint"
                    : "text-ink",
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-pretty text-muted">{listing.note}</p>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted">Listing score</span>
          <span className="font-display text-2xl text-ink tabular-nums">{listing.score}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-paper-2" aria-hidden="true">
          <div className="score-fill" style={{ width: `${listing.score}%` }} />
        </div>
      </div>
    </figure>
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
