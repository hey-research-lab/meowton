import { createFileRoute } from "@tanstack/react-router";
import { LegalFoot } from "@/components/legal-foot";
import { FEE_ORDER, FEES, HOLD, MODE_LABEL, formatBps, SITE } from "@/lib/site";

export const Route = createFileRoute("/how")({
  component: HowPage,
  head: () => ({
    meta: [{ title: "How — MEOWTON" }],
  }),
});

function HowPage() {
  return (
    <article className="paper">
      <p className="paper-kicker">{SITE.community}</p>
      <h1 className="paper-title">Pair. Vault. Burn.</h1>
      <div className="paper-body">
        <p>
          {SITE.pair}. Not a USD pair. {SITE.chartLine} Create is on{" "}
          {SITE.pad.name}, community mode on. This site still reads Chainlink{" "}
          {SITE.feedName} so you can see the print. The pad’s hook is not
          ours. The directional table is later.
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
            <h2>Vault</h2>
            <p>
              Community mode — on at create — routes a cut of every trade into
              Newton’s basket. Quote-side fees can sit there as AAPL. Volume
              compounds it. The vault is not a coupon and not a payout. Holders
              point it, not the creator.
            </p>
          </li>
          <li>
            <h2>Burn</h2>
            <p>
              Meme-side fees on {SITE.pad.name} can burn or lock{" "}
              {SITE.ticker}. Supply only tightens if their splitter actually
              burns. We do not take a creator bag at create. The whole{" "}
              {SITE.listing.supply} supply goes in the AAPL pool.
            </p>
          </li>
        </ol>

        <h2 className="mt-10 font-display text-xl font-medium text-ink">
          The pad
        </h2>
        <p className="mt-2">
          Launch is {SITE.pad.name}’s Airlock. Do not deploy a homemade ERC-20
          first — that contract will not be this pair. Their protocol keeps a
          cut. Their terms let them change fees later. Airlock cannot be swapped
          for our directional hook after the pool exists.
        </p>

        <h2 className="mt-10 font-display text-xl font-medium text-ink">
          If you buy
        </h2>
        <p className="mt-2">{HOLD.thesis}</p>
        <ol className="step-list mt-8">
          {HOLD.get.map((row) => (
            <li key={row.t}>
              <h2>{row.t}</h2>
              <p>{row.d}</p>
            </li>
          ))}
        </ol>
        <ul className="hold-not">
          {HOLD.not.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

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
