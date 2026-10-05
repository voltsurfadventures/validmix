import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type PlanId = "bench" | "floor" | "line";
export type MarketId = "alibaba" | "mic" | "both";

export const PLANS: Record<
  PlanId,
  { name: string; monthly: number; yearly: number; blurb: string }
> = {
  bench: {
    name: "Bench",
    monthly: 79,
    yearly: 790,
    blurb: "Try it on a small catalog. One website.",
  },
  floor: {
    name: "Floor",
    monthly: 189,
    yearly: 1890,
    blurb: "The plan most factories use. Both websites.",
  },
  line: {
    name: "Line",
    monthly: 449,
    yearly: 4490,
    blurb: "For teams posting on both sites every week.",
  },
};

export const MARKETS: { id: MarketId; label: string }[] = [
  { id: "alibaba", label: "Alibaba" },
  { id: "mic", label: "Made-in-China" },
  { id: "both", label: "Both" },
];

type SavedRequest = {
  email: string;
  plan: PlanId;
  market: MarketId;
};

type PlanState = {
  plan: PlanId;
  setPlan: (plan: PlanId) => void;
  annual: boolean;
  setAnnual: (annual: boolean) => void;
  saved: SavedRequest | null;
  saveRequest: (request: SavedRequest) => void;
  clearRequest: () => void;
};

const KEY = "validmix-request";
const PlanContext = createContext<PlanState | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanId>("floor");
  const [annual, setAnnual] = useState(false);
  const [saved, setSaved] = useState<SavedRequest | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SavedRequest;
      if (parsed?.email && parsed.plan && parsed.market) setSaved(parsed);
    } catch {
      /* ignore a bad local record */
    }
  }, []);

  const saveRequest = (request: SavedRequest) => {
    setSaved(request);
    setPlan(request.plan);
    localStorage.setItem(KEY, JSON.stringify(request));
  };

  const clearRequest = () => {
    setSaved(null);
    localStorage.removeItem(KEY);
  };

  return (
    <PlanContext.Provider
      value={{ plan, setPlan, annual, setAnnual, saved, saveRequest, clearRequest }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const value = useContext(PlanContext);
  if (!value) throw new Error("usePlan must be used within PlanProvider");
  return value;
}
