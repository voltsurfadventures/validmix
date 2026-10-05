import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MARKETS, PLANS, type MarketId, usePlan } from "@/components/landing/plan-context";
import { cn } from "@/lib/utils";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm({
  id,
  tone = "paper",
  compact = false,
}: {
  id: string;
  tone?: "paper" | "ink";
  compact?: boolean;
}) {
  const { plan, setPlan, saved, saveRequest, clearRequest } = usePlan();
  const [email, setEmail] = useState("");
  const [market, setMarket] = useState<MarketId>("both");
  const [error, setError] = useState("");

  const onInk = tone === "ink";

  if (saved) {
    return (
      <div
        className={cn(
          "rounded-xl border p-5",
          onInk ? "border-paper/20 bg-ink-soft" : "border-line bg-card",
        )}
        role="status"
      >
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm",
              onInk ? "bg-paper text-ink" : "bg-ink text-paper",
            )}
            aria-hidden="true"
          >
            <Check className="size-4" strokeWidth={2} />
          </span>
          <div>
            <p className={cn("font-medium", onInk ? "text-paper" : "text-ink")}>
              Request received for {saved.email}
            </p>
            <p className={cn("mt-1 text-sm text-pretty", onInk ? "text-paper/75" : "text-muted")}>
              We’ll rewrite one live listing for {marketLabel(saved.market)} and email the{" "}
              {PLANS[saved.plan].name} version to this address.
            </p>
            <button
              type="button"
              onClick={clearRequest}
              className={cn(
                "mt-3 text-sm font-medium underline-offset-4 hover:underline",
                onInk ? "text-paper" : "text-ink",
              )}
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = email.trim();
    if (!next) {
      setError("Enter a work email.");
      return;
    }
    if (!EMAIL.test(next)) {
      setError("That email does not look complete.");
      return;
    }
    setError("");
    saveRequest({ email: next, plan, market });
  };

  return (
    <form id={id} onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-email`} className={onInk ? "text-paper" : undefined}>
          Work email
        </Label>
        <div className={cn("flex flex-col gap-3", compact && "sm:flex-row sm:items-start")}>
          <div className="min-w-0 flex-1">
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@factory.com"
              value={email}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError("");
              }}
              className={onInk ? "border-paper/25 bg-paper" : undefined}
            />
            {error ? (
              <p id={`${id}-error`} className="mt-2 text-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          {compact ? (
            <Button type="submit" variant={onInk ? "inverse" : "primary"} className="sm:shrink-0">
              Request a score
            </Button>
          ) : null}
        </div>
      </div>

      <fieldset className={cn("min-w-0", compact && "hidden")}>
        <legend className={cn("text-sm font-medium", onInk ? "text-paper" : "text-ink")}>
          Marketplace
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {MARKETS.map((item) => {
            const selected = market === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setMarket(item.id)}
                className={cn(
                  "h-11 rounded-md border px-3 text-sm font-medium transition-[background-color,color,border-color] duration-150",
                  onInk
                    ? selected
                      ? "border-paper bg-paper text-ink"
                      : "border-paper/25 text-paper hover:border-paper/50"
                    : selected
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-card text-ink hover:border-ink/40",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {!compact ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="flex flex-col gap-2 text-sm font-medium">
            <span className={onInk ? "text-paper" : "text-ink"}>Plan</span>
            <select
              value={plan}
              onChange={(event) => setPlan(event.target.value as typeof plan)}
              className="h-11 rounded-md border border-line bg-card px-3 text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
            >
              {(Object.keys(PLANS) as (keyof typeof PLANS)[]).map((id) => (
                <option key={id} value={id}>
                  {PLANS[id].name}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" variant={onInk ? "inverse" : "primary"} size="lg">
            Request a listing score
          </Button>
        </div>
      ) : (
        <p className={cn("text-sm", onInk ? "text-paper/70" : "text-muted")}>
          We’ll rewrite one live listing on the {PLANS[plan].name} plan and email it here. No newsletter.
        </p>
      )}
    </form>
  );
}

function marketLabel(market: MarketId) {
  return MARKETS.find((item) => item.id === market)?.label ?? "your marketplace";
}
