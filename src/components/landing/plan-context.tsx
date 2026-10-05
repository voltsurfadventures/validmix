export type PaidPlanId = "bench" | "floor" | "line";
export type PlanId = "sample" | PaidPlanId;

export const PLAN_ORDER: PlanId[] = ["sample", "bench", "floor", "line"];

export const PLAN_PRICE: Record<PlanId, number> = {
  sample: 0,
  bench: 99,
  floor: 249,
  line: 590,
};

export function isPaidPlan(value: string | undefined): value is PaidPlanId {
  return value === "bench" || value === "floor" || value === "line";
}

export function usd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
