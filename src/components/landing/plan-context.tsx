import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createServerFn } from "@tanstack/react-start";

export type PlanId = "bench" | "floor";
export type Currency = "AUD" | "USD" | "EUR" | "CNY" | "VND";

export const CURRENCIES: Currency[] = ["AUD", "USD", "EUR", "CNY", "VND"];

export const PLANS: Record<PlanId, { name: string; monthly: number; yearly: number }> = {
  bench: { name: "Bench", monthly: 55, yearly: 550 },
  floor: { name: "Floor", monthly: 220, yearly: 2200 },
};

const FALLBACK_RATES: Record<Currency, number> = {
  AUD: 1,
  USD: 0.66,
  EUR: 0.6,
  CNY: 4.7,
  VND: 16800,
};

type SavedRequest = {
  email: string;
  plan: PlanId;
  listing: string;
};

type PlanState = {
  plan: PlanId;
  setPlan: (plan: PlanId) => void;
  annual: boolean;
  setAnnual: (annual: boolean) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: Record<Currency, number>;
  saved: SavedRequest | null;
  saveRequest: (request: SavedRequest) => void;
  clearRequest: () => void;
};

const loadRates = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const response = await fetch("https://api.frankfurter.app/latest?from=AUD&to=USD,EUR,CNY", {
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { rates?: Partial<Record<Currency, number>> };
    return data.rates ?? null;
  } catch {
    return null;
  }
});

const KEY = "validmix-request";
const CURRENCY_KEY = "validmix-currency";
const PlanContext = createContext<PlanState | null>(null);

function isPlan(value: string): value is PlanId {
  return value === "bench" || value === "floor";
}

function isCurrency(value: string): value is Currency {
  return CURRENCIES.includes(value as Currency);
}

export function formatMoney(aud: number, currency: Currency, rates: Record<Currency, number>) {
  const rate = rates[currency] ?? 1;
  const raw = aud * rate;
  const amount = currency === "VND" ? Math.round(raw / 1000) * 1000 : Math.round(raw);
  const locale = currency === "VND" ? "vi-VN" : currency === "CNY" ? "zh-CN" : "en-AU";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanId>("floor");
  const [annual, setAnnual] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>("AUD");
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [saved, setSaved] = useState<SavedRequest | null>(null);

  useEffect(() => {
    try {
      const storedCurrency = localStorage.getItem(CURRENCY_KEY);
      if (storedCurrency && isCurrency(storedCurrency)) setCurrencyState(storedCurrency);
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SavedRequest;
      if (parsed?.email && parsed.listing && isPlan(parsed.plan)) setSaved(parsed);
    } catch {
      /* ignore a bad local record */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadRates()
      .then((data) => {
        if (cancelled || !data) return;
        setRates((current) => ({ ...current, ...data, AUD: 1 }));
      })
      .catch(() => {
        /* keep the fallback rates */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = (next: Currency) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(CURRENCY_KEY, next);
    } catch {
      /* ignore */
    }
  };

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
      value={{
        plan,
        setPlan,
        annual,
        setAnnual,
        currency,
        setCurrency,
        rates,
        saved,
        saveRequest,
        clearRequest,
      }}
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
