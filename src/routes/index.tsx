import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/landing/home-page";
import { PlanProvider } from "@/components/landing/plan-context";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <PlanProvider>
      <HomePage />
    </PlanProvider>
  );
}
