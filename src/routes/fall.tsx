import { createFileRoute } from "@tanstack/react-router";
import { LegalFoot } from "@/components/legal-foot";
import { useAapl } from "@/lib/use-aapl";
import {
  explorerAddress,
  formatAge,
  formatBps,
  formatPct,
  formatSignedUsd,
  formatUsd,
  MODE_LABEL,
  shorten,
  SITE,
} from "@/lib/site";

export const Route = createFileRoute("/fall")({
  component: FallPage,
  head: () => ({
    meta: [{ title: "Fall — MEOWTON" }],
  }),
});

function FallPage() {
  const q = useAapl();
  const d = q.data;
  const updated =
    d?.updatedAt != null
      ? new Date(d.updatedAt * 1000).toISOString().replace(".000Z", "Z")
      : "—";
  const mode = d?.mode ?? "sleep";

  return (
    <article className="paper">
      <p className="paper-kicker">Live · {SITE.pair}</p>
      <h1 className="paper-title">AAPL, last print.</h1>
      <div className="paper-body">
        <p>
          Direction is versus the previous Chainlink round — not prior close,
          not NYSE hours. If the print is stale, this orchard sleeps. The
          chip is ours. The swap fee on {SITE.pad.name} is theirs.
        </p>
        <dl className="stat-grid mt-6">
          <div className="stat-row">
            <dt>Print</dt>
            <dd>{d?.price != null ? formatUsd(d.price) : "—"}</dd>
          </div>
          <div className="stat-row">
            <dt>Last print</dt>
            <dd>{d?.prevPrice != null ? formatUsd(d.prevPrice) : "—"}</dd>
          </div>
          <div className="stat-row">
            <dt>Delta</dt>
            <dd>
              {d?.delta != null
                ? `${formatSignedUsd(d.delta)} (${formatPct(d.deltaPct ?? 0)})`
                : "—"}
            </dd>
          </div>
          <div className="stat-row">
            <dt>Age</dt>
            <dd>{d?.ageSec != null ? formatAge(d.ageSec) : "—"}</dd>
          </div>
          <div className="stat-row">
            <dt>Mode</dt>
            <dd>
              <span className="mode-chip" data-mode={mode}>
                <i aria-hidden="true" />
                {MODE_LABEL[mode]}
              </span>
            </dd>
          </div>
          <div className="stat-row">
            <dt>Buy / sell</dt>
            <dd>
              {d ? `${formatBps(d.buyBps)} / ${formatBps(d.sellBps)}` : "—"}
            </dd>
          </div>
          <div className="stat-row">
            <dt>Updated</dt>
            <dd>{updated}</dd>
          </div>
          <div className="stat-row">
            <dt>Feed</dt>
            <dd>
              <a
                className="ext-link"
                href={explorerAddress(SITE.aaplFeed)}
                target="_blank"
                rel="noreferrer"
              >
                {shorten(SITE.aaplFeed)}
              </a>
            </dd>
          </div>
        </dl>
        {d?.error ? (
          <p className="mt-4 font-mono text-sm text-apple">{d.error}</p>
        ) : null}
        <aside className="aside">
          {SITE.feedName}, 8 decimals, total return. Proposed fees — the
          directional hook is not deployed. Asleep here is the honest night
          state, not a bug.
        </aside>
        <p className="fine">Unaudited. Not a payout. Not the first cat on AAPL.</p>
        <LegalFoot />
      </div>
    </article>
  );
}
