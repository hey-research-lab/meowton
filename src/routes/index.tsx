import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [{ title: "MEOWTON" }],
  }),
});

function Home() {
  return null;
}
