import { createFileRoute } from "@tanstack/react-router";
import { InvestorDesk } from "@/components/investor-desk";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [{ title: "MEOWTON" }],
  }),
});

function Home() {
  return <InvestorDesk />;
}
