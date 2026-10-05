import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/components/landing/locale";
import { PLAN_PRICE, isPaidPlan, usd } from "@/components/landing/plan-context";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>) => ({
    plan: typeof search.plan === "string" && isPaidPlan(search.plan) ? search.plan : undefined,
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { t } = useI18n();
  const { plan } = Route.useSearch();
  const copy = plan ? t.plans[plan] : null;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-5 md:px-8">
          <a href="/" className="shrink-0">
            <span className="wordmark wordmark-nav">
              <img src="/wordmark.png" alt="ValidMix" />
            </span>
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        {copy && plan ? (
          <>
            <p className="text-sm font-medium text-muted">{t.pricingKicker}</p>
            <h1 className="mt-3 font-display text-section text-balance text-ink">
              {copy.name} {usd(PLAN_PRICE[plan])}
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-ink">{copy.line}</p>
            <p className="mt-8 max-w-xl text-pretty text-ink">{t.checkoutBody}</p>
            <p className="mt-6">
              <a
                href="https://www.paypal.com"
                className="text-sm font-medium text-muted underline decoration-line underline-offset-4 hover:text-ink"
              >
                {t.checkoutPaypal}
              </a>
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-section text-balance text-ink">{t.checkoutTitle}</h1>
            <p className="mt-4 text-ink">{t.checkoutMissing}</p>
          </>
        )}
        <p className="mt-10">
          <a href="/#pricing" className="text-sm font-medium text-ink underline-offset-4 hover:underline">
            {t.checkoutBack}
          </a>
        </p>
      </main>
    </div>
  );
}
