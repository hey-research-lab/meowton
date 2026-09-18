import { createFileRoute } from "@tanstack/react-router";
import { HomeRails } from "@/components/home-rails";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [{ title: "MEOWTON" }],
  }),
});

function Home() {
  return <HomeRails />;
}
