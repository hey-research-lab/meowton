import { createFileRoute } from "@tanstack/react-router";
import { LegalFoot } from "@/components/legal-foot";
import { FEE_ORDER, FEES, MODE_LABEL, formatBps, SITE } from "@/lib/site";

export const Route = createFileRoute("/how")({
  component: HowPage,
  head: () => ({
    meta: [{ title: "How — MEOWTON" }],
  }),
});

function HowPage() {
  return (
    <article className="paper">
      <p className="paper-kicker">Three things, then you’re caught up</p>
      <h1 className="paper-title">The pair. The pad. The basket.</h1>
      <div className="paper-body">
        <p>
          {SITE.pair}. Create is on {SITE.pad.name}, anchored to tokenized
          $AAPL — not a USD pair. This site still reads Chainlink{" "}
          {SITE.feedName} so you can see the print. The pad’s hook is not
          ours.
        </p>

        <ol className="step-list mt-8">
          <li>
            <h2>Pair</h2>
            <p>
              {SITE.ticker} trades against tokenized $AAPL on {SITE.chainName}.
              Apple is the other side of the book — the print underneath the
              cat, not a mascot pasted on a stablecoin pool.
            </p>
          </li>
          <li>
            <h2>Pad</h2>
            <p>
              Launch is {SITE.pad.name}’s Airlock. Typical create puts the
              whole {SITE.listing.supply} supply into the AAPL pool. The
              creator receives no tokens. Their protocol keeps a cut. Their
              terms let them change fees later. Airlock cannot be swapped for
              our hook after the pool exists.
            </p>
          </li>
          <li>
            <h2>Basket</h2>
            <p>
              Community mode — on at create — sends a portion of trading fees
              toward a vault that can hold AAPL. That vault is Newton’s basket
              on this pad. It is not a burn. It is not a payout. It is not the
              directional table below.
            </p>
          </li>
        </ol>

        <h2 className="mt-10 font-display text-xl font-medium text-ink">
          Proposed fees — not the pad’s
        </h2>
        <p className="mt-2 text-sm text-muted">
          Quote asset is AAPL. For a self-deployed Uniswap v4 hook, later, if
          it is ever mined. Not live. Not what you pay on {SITE.pad.name}.
        </p>
        <div className="overflow-x-auto">
          <table className="fee-table">
            <thead>
              <tr>
                <th>Mode</th>
                <th>When</th>
                <th>Buy</th>
                <th>Sell</th>
              </tr>
            </thead>
            <tbody>
              {FEE_ORDER.map((mode) => {
                const row = FEES[mode];
                return (
                  <tr key={mode} data-mode={mode}>
                    <td className="uppercase">{MODE_LABEL[mode]}</td>
                    <td>{row.when}</td>
                    <td className="num">{formatBps(row.buyBps)}</td>
                    <td className="num">{formatBps(row.sellBps)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <aside className="aside">
          Uniswap v4 bakes the hook into the PoolKey. Launching on{" "}
          {SITE.pad.name} means their hook, their fee. The directional table
          stays proposed. Do not read the orchard chip as a rebate. Trading
          terms:{" "}
          <a
            className="ext-link"
            href={SITE.pad.terms}
            target="_blank"
            rel="noreferrer"
          >
            app.long.xyz/terms
          </a>
          .
        </aside>

        <p className="fine">{SITE.field}</p>
        <LegalFoot />
      </div>
    </article>
  );
}
