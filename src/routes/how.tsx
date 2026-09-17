import { createFileRoute } from "@tanstack/react-router";
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
      <p className="paper-kicker">Proposed · not live</p>
      <h1 className="paper-title">The hook does not watch the clock.</h1>
      <div className="paper-body">
        <p>
          It watches AAPL. Each swap reads Chainlink {SITE.feedName}. Direction
          sets the fee. The session clock used by market-hours hooks is not this
          mechanic.
        </p>

        <ol className="step-list mt-8">
          <li>
            <h2>Read</h2>
            <p>
              If the oracle print is older than 15 minutes, the feed is asleep.
              Asymmetry turns off. Fees go static. Chainlink equity feeds run
              24/5. The DEX does not. Stale means static — by design.
            </p>
          </li>
          <li>
            <h2>Fall</h2>
            <p>
              A fresh print, AAPL down versus the last oracle round: the cat is
              catching. Buy is cheap. Sell is dear. Up or flat, the walk is
              symmetric.
            </p>
          </li>
          <li>
            <h2>Basket</h2>
            <p>
              Fees accrue in AAPL inside Newton’s basket. No merkle. No keeper.
              No airdrop. No payout to the caller.
            </p>
          </li>
        </ol>

        <h2 className="mt-10 font-display text-xl font-medium text-ink">
          Proposed fees
        </h2>
        <p className="mt-2 text-sm text-muted">
          Quote asset is AAPL. Not live. Not a promise.
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
          Uniswap v4 bakes the hook into the PoolKey. It cannot be bolted on
          later. Pad launch without this hook is a different token. Direct
          pool, or the mechanic dies.
        </aside>

        <p className="fine">{SITE.field}</p>
      </div>
    </article>
  );
}
