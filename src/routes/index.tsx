import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [{ title: "MEOWTON" }],
  }),
});

function Home() {
  return (
    <section className="hero">
      <p className="hero-kicker">AAPL pair · {SITE.chainName}</p>
      <h1 className="hero-title">
        The apple falls.
        <br />
        The cat catches.
      </h1>
      <p className="hero-lede">
        Not the first cat on AAPL. The bet is the hook.
      </p>
      <p className="hero-hint">Tap to leap</p>
    </section>
  );
}
