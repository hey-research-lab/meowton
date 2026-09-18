import { createFileRoute } from "@tanstack/react-router";
import { CopyText } from "@/components/copy-text";
import { LegalFoot } from "@/components/legal-foot";
import { explorerAddress, HOLD, longTradeUrl, shorten, SITE } from "@/lib/site";

export const Route = createFileRoute("/basket")({
  component: BasketPage,
  head: () => ({
    meta: [{ title: "Basket — MEOWTON" }],
  }),
});

function Row({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null;
  href?: string | null;
}) {
  return (
    <div className="stat-row">
      <dt>{label}</dt>
      <dd>
        {value && href ? (
          <a className="ext-link" href={href} target="_blank" rel="noreferrer">
            {value}
          </a>
        ) : value ? (
          <span>{value}</span>
        ) : (
          <span className="text-gold">pending</span>
        )}
      </dd>
    </div>
  );
}

function Addr({ label, value }: { label: string; value: string | null }) {
  return (
    <Row
      label={label}
      value={value ? shorten(value) : null}
      href={value ? explorerAddress(value) : null}
    />
  );
}

function BasketPage() {
  const trade = SITE.tokenCa ? longTradeUrl(SITE.tokenCa) : null;

  return (
    <article className="paper">
      <p className="paper-kicker">Newton’s basket</p>
      <h1 className="paper-title">Create on LONG. Catch later.</h1>
      <div className="paper-body">
        <p>
          Launch is on {SITE.pad.name}, pair {SITE.listing.quote}. Community
          mode on. The whole {SITE.listing.supply} supply goes into the pool.
          The creator receives no tokens. Fees that can sit in AAPL go to
          their vault — the basket on this pad. Addresses for {SITE.ticker}{" "}
          stay pending until the receipt exists. No fake CA. No pre-deployed
          ERC-20, no custom hook, no extra contract before you sign — LONG’s
          factory emits token, pool, Airlock and vault in that transaction.
        </p>
        <p className="mt-4">{HOLD.thesis}</p>
        <ul className="hold-not">
          {HOLD.not.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p className="launch-cta-wrap">
          <a
            className="launch-cta"
            href={SITE.pad.create}
            target="_blank"
            rel="noreferrer"
          >
            Open {SITE.pad.name}
          </a>
          <span className="launch-cta-note">
            Wallet on {SITE.chainName}. Their{" "}
            <a
              className="ext-link"
              href={SITE.pad.terms}
              target="_blank"
              rel="noreferrer"
            >
              terms
            </a>{" "}
            apply the moment you sign.
          </span>
        </p>

        <h2 className="mt-10 font-display text-xl font-medium text-ink">
          Create card
        </h2>
        <p className="mt-2 text-sm text-muted">
          Paste into {SITE.pad.name}. Ticker is letters only. Name is{" "}
          {SITE.listing.name} — not MEWTON. Quote is AAPL. Website is{" "}
          {SITE.domain}. Image is the 800×800 mark.
        </p>
        <div className="copy-stack">
          <CopyText label="Name" value={SITE.listing.name} />
          <CopyText label="Ticker" value={SITE.listing.ticker} />
          <CopyText label="Quote" value={SITE.listing.quote} />
          <CopyText label="Quote CA" value={SITE.aaplToken} />
          <CopyText
            label="Community mode"
            value={SITE.listing.communityMode ? "on" : "off"}
          />
          <CopyText label="Website" value={SITE.listing.website} />
          <CopyText
            label="Description"
            value={SITE.listing.description}
            mono={false}
          />
        </div>
        <p className="listing-blurb">{SITE.listing.description}</p>
        <p className="fine mt-3">
          Image · {SITE.listing.image} · X pending
        </p>

        <h2 className="mt-10 font-display text-xl font-medium text-ink">
          After the receipt
        </h2>
        <dl className="stat-grid mt-2">
          <Row label="Pad" value={SITE.pad.name} href={SITE.pad.app} />
          <Row
            label="Trade"
            value={trade ? "Open on LONG" : null}
            href={trade}
          />
          <Addr label="Token" value={SITE.tokenCa} />
          <Addr label="Pool" value={SITE.poolCa} />
          <Addr label="Basket / vault" value={SITE.basketCa} />
          <Addr label="Our hook" value={SITE.hookCa} />
        </dl>

        <h2 className="mt-10 font-display text-xl font-medium text-ink">
          Pad contracts
        </h2>
        <p className="mt-2 text-sm text-muted">
          {SITE.pad.operator}’s launcher. Not {SITE.ticker}. Do not paste these
          as the token.
        </p>
        <dl className="stat-grid mt-2">
          <Addr label="LongLauncher" value={SITE.pad.factory} />
          <Addr label="Airlock" value={SITE.pad.airlock} />
          <Addr label="Pad hook" value={SITE.pad.hook} />
          <Addr label="AAPL" value={SITE.aaplToken} />
          <Addr label="Feed" value={SITE.aaplFeed} />
          <Addr label="PoolManager" value={SITE.poolManager} />
        </dl>
        <aside className="aside">
          Chain {SITE.chainId}. Create, trade, and fee claims run through{" "}
          {SITE.pad.name} —{" "}
          <a
            className="ext-link"
            href={SITE.pad.terms}
            target="_blank"
            rel="noreferrer"
          >
            their terms
          </a>
          {" · "}
          <a
            className="ext-link"
            href={SITE.pad.privacy}
            target="_blank"
            rel="noreferrer"
          >
            their privacy
          </a>
          . The directional hook is still unmined. Invented holdings would be
          a different product.
        </aside>
        <p className="fine">{SITE.field}</p>
        <LegalFoot />
      </div>
    </article>
  );
}
