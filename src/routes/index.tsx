import { createFileRoute } from "@tanstack/react-router";
import { LegalFoot } from "@/components/legal-foot";
import { useNewton } from "@/lib/newton";
import { useAapl } from "@/lib/use-aapl";
import { formatBps, formatUsd, MODE_LABEL, SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [{ title: "MEOWTON" }],
  }),
});

const MARQUEE = [
  SITE.pair,
  "ANCHORED TO AAPL",
  "CREATE ON LONG",
  "COMMUNITY MODE ON",
  "PAD HOOK IS NOT OURS",
  "UNAUDITED · NOT A PAYOUT",
];

function Home() {
  const hint = useNewton((s) => s.hint);
  const phase = useNewton((s) => s.phase);
  const aapl = useAapl();
  const d = aapl.data;
  const mode = d?.mode ?? "sleep";

  return (
    <section className="hero">
      <p className="hero-kicker">{SITE.pair}</p>
      <h1 className="hero-title">
        The apple falls.
        <br />
        The cat catches.
      </h1>
      <p className="hero-lede">
        Gravity was a rumor until it hit him. {SITE.ticker} is paired with
        tokenized $AAPL on {SITE.pad.name} — not a USD pair. This orchard
        still reads the print.
      </p>
      <dl className="live-strip" aria-label="Live AAPL print">
        <div>
          <dt>Live · AAPL print</dt>
          <dd>{d?.price != null ? formatUsd(d.price) : "—"}</dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>
            <span className="mode-chip" data-mode={mode}>
              <i aria-hidden="true" />
              {MODE_LABEL[mode]}
            </span>
          </dd>
        </div>
        <div>
          <dt>Proposed</dt>
          <dd>
            {d ? `${formatBps(d.buyBps)} / ${formatBps(d.sellBps)}` : "—"}
          </dd>
        </div>
      </dl>
      <p className="hero-hint" data-phase={phase}>
        {hint}
      </p>
      <LegalFoot home />
      <div className="pair-marquee" aria-hidden="true">
        <div className="pair-track">
          {[0, 1].map((copy) => (
            <p key={copy}>
              {MARQUEE.map((item) => (
                <span key={`${copy}-${item}`}>{item}</span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
