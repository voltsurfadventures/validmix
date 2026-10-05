import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/landing/home-page";
import { LocaleProvider } from "@/components/landing/locale";
import { PlanProvider } from "@/components/landing/plan-context";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <LocaleProvider>
      <PlanProvider>
        <HomePage />
      </PlanProvider>
    </LocaleProvider>
  );
}
