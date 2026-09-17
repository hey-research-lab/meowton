import { createFileRoute } from "@tanstack/react-router";
import {
  explorerAddress,
  shorten,
  SITE,
} from "@/lib/site";

export const Route = createFileRoute("/basket")({
  component: BasketPage,
  head: () => ({
    meta: [{ title: "Basket — MEOWTON" }],
  }),
});

function Row({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="stat-row">
      <dt>{label}</dt>
      <dd>
        {value ? (
          <a
            className="ext-link"
            href={explorerAddress(value)}
            target="_blank"
            rel="noreferrer"
          >
            {shorten(value)}
          </a>
        ) : (
          <span className="text-gold">pending</span>
        )}
      </dd>
    </div>
  );
}

function BasketPage() {
  return (
    <article className="paper">
      <p className="paper-kicker">Newton’s basket</p>
      <h1 className="paper-title">Nothing to harvest yet.</h1>
      <div className="paper-body">
        <p>
          Fee sink is AAPL. Addresses go live after the hook is mined, the
          token is deployed, and the pool is created. No fake CA. No dry
          harvest against a dummy.
        </p>
        <dl className="stat-grid mt-6">
          <Row label="Token" value={SITE.tokenCa} />
          <Row label="Hook" value={SITE.hookCa} />
          <Row label="Pool" value={SITE.poolCa} />
          <Row label="Basket" value={SITE.basketCa} />
        </dl>
        <h2 className="mt-10 font-display text-xl font-medium text-ink">
          Quote asset
        </h2>
        <dl className="stat-grid mt-2">
          <Row label="AAPL" value={SITE.aaplToken} />
          <Row label="Feed" value={SITE.aaplFeed} />
          <Row label="PoolManager" value={SITE.poolManager} />
        </dl>
        <aside className="aside">
          Chain {SITE.chainId}. When the basket exists, the balance will read
          from that address — not before.
        </aside>
        <p className="fine">{SITE.field}</p>
      </div>
    </article>
  );
}
