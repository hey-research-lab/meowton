import { useState } from "react";
import { ConnectButton } from "@/components/connect-button";
import { useHoldings, useVault } from "@/lib/use-holdings";
import {
  explorerAddress,
  explorerToken,
  HOLD,
  longTradeUrl,
  shorten,
  SITE,
} from "@/lib/site";
import {
  addRobinhoodChain,
  useWallet,
  watchMeowtonToken,
} from "@/lib/wallet";

type Tab = "trade" | "wallet" | "vault";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="desk-stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

async function copy(text: string) {
  await navigator.clipboard.writeText(text);
}

export function InvestorDesk() {
  const [tab, setTab] = useState<Tab>("trade");
  const [flash, setFlash] = useState<string | null>(null);
  const address = useWallet((s) => s.address);
  const chainId = useWallet((s) => s.chainId);
  const holdings = useHoldings(address);
  const vault = useVault();
  const h = holdings.data;
  const ca = SITE.tokenCa;
  const trade = ca ? longTradeUrl(ca) : SITE.pad.create;
  const live = !!ca;

  async function ping(label: string, fn: () => Promise<void>) {
    try {
      await fn();
      setFlash(label);
      window.setTimeout(() => setFlash(null), 1600);
    } catch (err) {
      setFlash(err instanceof Error ? err.message : "Rejected");
      window.setTimeout(() => setFlash(null), 2200);
    }
  }

  return (
    <section className="desk" aria-label="Investor desk">
      <header className="desk-head">
        <div>
          <p className="desk-kicker">Desk</p>
          <h2 className="desk-title">Trade the pair</h2>
        </div>
      </header>

      <div className="desk-tabs" role="tablist" aria-label="Desk">
        {(["trade", "wallet", "vault"] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className="desk-tab"
            onClick={() => setTab(id)}
          >
            {id}
          </button>
        ))}
      </div>

      {tab === "trade" ? (
        <div className="desk-body">
          <p className="desk-copy">
            Pair is {SITE.listing.quote} on {SITE.chainName}. Swaps sign on{" "}
            {SITE.pad.name}. This desk does not hold keys.
          </p>
          <div className="desk-actions">
            <a className="desk-btn desk-btn-hot" href={trade} target="_blank" rel="noreferrer">
              {live ? `Buy on ${SITE.pad.name}` : `Open ${SITE.pad.name}`}
            </a>
            <a className="desk-btn" href={trade} target="_blank" rel="noreferrer">
              {live ? "Sell / swap" : "Create pair"}
            </a>
            <button
              type="button"
              className="desk-btn"
              disabled={!live}
              onClick={() => void ping("Copied CA", () => copy(ca as string))}
            >
              {live ? "Copy CA" : "CA pending"}
            </button>
            <button
              type="button"
              className="desk-btn"
              disabled={!live}
              onClick={() => void ping("Added token", () => watchMeowtonToken())}
            >
              Add token
            </button>
            <button
              type="button"
              className="desk-btn"
              onClick={() => void ping("Chain added", () => addRobinhoodChain())}
            >
              Add {SITE.chainName}
            </button>
            {ca ? (
              <a
                className="desk-btn"
                href={explorerToken(ca)}
                target="_blank"
                rel="noreferrer"
              >
                Explorer
              </a>
            ) : (
              <a
                className="desk-btn"
                href={SITE.explorer}
                target="_blank"
                rel="noreferrer"
              >
                Explorer
              </a>
            )}
          </div>
          <p className="desk-note">
            {SITE.pad.name} terms apply the moment you sign. Unaudited. Not a payout.
          </p>
        </div>
      ) : null}

      {tab === "wallet" ? (
        <div className="desk-body">
          {address ? (
            <>
              <dl className="desk-stats">
                <Stat label="Wallet" value={shorten(address)} />
                <Stat
                  label="Network"
                  value={
                    chainId === SITE.chainId ? SITE.chainName : `Wrong chain (${chainId ?? "—"})`
                  }
                />
                <Stat label="ETH" value={h?.eth ?? "—"} />
                <Stat label="$AAPL" value={h?.aapl ?? "—"} />
                <Stat
                  label={SITE.ticker}
                  value={live ? (h?.meowton ?? "—") : "CA pending"}
                />
              </dl>
              {h?.error ? <p className="desk-note">{h.error}</p> : null}
              <div className="desk-actions">
                <button
                  type="button"
                  className="desk-btn"
                  onClick={() => void holdings.refetch()}
                >
                  Refresh
                </button>
                <a
                  className="desk-btn"
                  href={explorerAddress(address)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View wallet
                </a>
                <a className="desk-btn desk-btn-hot" href={trade} target="_blank" rel="noreferrer">
                  Trade
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="desk-copy">
                Connect MetaMask or OKX. We read balances on {SITE.chainName}.
                After you buy on {SITE.pad.name}, this tab counts the bag.
              </p>
              <ConnectButton />
            </>
          )}
        </div>
      ) : null}

      {tab === "vault" ? (
        <div className="desk-body">
          <p className="desk-copy">{HOLD.thesis}</p>
          <dl className="desk-stats">
            <Stat
              label="Vault AAPL"
              value={SITE.basketCa ? (vault.data?.vaultAapl ?? "—") : "pending"}
            />
            <Stat
              label="Vault"
              value={SITE.basketCa ? shorten(SITE.basketCa) : "pending"}
            />
            <Stat label="Pool" value={SITE.poolCa ? shorten(SITE.poolCa) : "pending"} />
          </dl>
          <p className="desk-note">
            Community vault fills from fees after LONG create. Dry until the receipt.
          </p>
        </div>
      ) : null}

      {flash ? <p className="desk-flash">{flash}</p> : null}
    </section>
  );
}
