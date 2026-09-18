import { useEffect, useState } from "react";
import { ConnectButton } from "@/components/connect-button";
import { useHoldings, useVault } from "@/lib/use-holdings";
import { useWallet } from "@/lib/wallet";
import { useAapl } from "@/lib/use-aapl";
import {
  explorerAddress,
  explorerToken,
  formatAge,
  formatBps,
  formatPct,
  formatSignedUsd,
  formatUsd,
  HOLD,
  longTradeUrl,
  MODE_LABEL,
  shorten,
  SITE,
} from "@/lib/site";

type FallTab = "print" | "fees";
type BasketTab = "watch" | "vault" | "trade";

function useClientReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rail-stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function FallPanel() {
  const [tab, setTab] = useState<FallTab>("print");
  const ready = useClientReady();
  const q = useAapl();
  const d = ready ? q.data : undefined;
  const mode = d?.mode ?? "sleep";

  return (
    <section className="rail" aria-label="Fall">
      <header className="rail-head">
        <p className="rail-kicker">Fall</p>
        <h2 className="rail-title">AAPL print</h2>
      </header>
      <div className="rail-tabs" role="tablist" aria-label="Fall sections">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "print"}
          className="rail-tab"
          onClick={() => setTab("print")}
        >
          Print
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "fees"}
          className="rail-tab"
          onClick={() => setTab("fees")}
        >
          Fees
        </button>
      </div>
      <div className="rail-body">
        {tab === "print" ? (
          <dl className="rail-stats">
            <Stat label="Last" value={d?.price != null ? formatUsd(d.price) : "—"} />
            <Stat
              label="Delta"
              value={
                d?.delta != null
                  ? `${formatSignedUsd(d.delta)} (${formatPct(d.deltaPct ?? 0)})`
                  : "—"
              }
            />
            <Stat
              label="Age"
              value={d?.ageSec != null ? formatAge(d.ageSec) : "—"}
            />
            <Stat
              label="Weather"
              value={
                <span className="mode-chip" data-mode={mode}>
                  <i aria-hidden="true" />
                  {MODE_LABEL[mode]}
                </span>
              }
            />
          </dl>
        ) : (
          <>
            <dl className="rail-stats">
              <Stat
                label="Buy / sell"
                value={d ? `${formatBps(d.buyBps)} / ${formatBps(d.sellBps)}` : "—"}
              />
            </dl>
            <p className="rail-note">
              Proposed orchard weather. Not the pad fee. Hook is unmined.
            </p>
          </>
        )}
        <div className="rail-actions">
          <button type="button" className="rail-btn" onClick={() => void q.refetch()}>
            Refresh
          </button>
          <a
            className="rail-btn rail-btn-ghost"
            href={explorerAddress(SITE.aaplFeed)}
            target="_blank"
            rel="noreferrer"
          >
            Feed
          </a>
        </div>
      </div>
    </section>
  );
}

function BasketPanel() {
  const [tab, setTab] = useState<BasketTab>("watch");
  const address = useWallet((s) => s.address);
  const holdings = useHoldings(address);
  const vault = useVault();
  const h = holdings.data;
  const trade = SITE.tokenCa ? longTradeUrl(SITE.tokenCa) : SITE.pad.create;

  return (
    <section className="rail" aria-label="Basket">
      <header className="rail-head">
        <p className="rail-kicker">Basket</p>
        <h2 className="rail-title">Your watch</h2>
      </header>
      <div className="rail-tabs" role="tablist" aria-label="Basket sections">
        {(["watch", "vault", "trade"] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className="rail-tab"
            onClick={() => setTab(id)}
          >
            {id === "watch" ? "Watch" : id === "vault" ? "Vault" : "Trade"}
          </button>
        ))}
      </div>
      <div className="rail-body">
        {tab === "watch" ? (
          address ? (
            <>
              <dl className="rail-stats">
                <Stat label="Wallet" value={shorten(address)} />
                <Stat label="ETH" value={h?.eth ?? "—"} />
                <Stat label="$AAPL" value={h?.aapl ?? "—"} />
                <Stat
                  label={SITE.ticker}
                  value={SITE.tokenCa ? (h?.meowton ?? "—") : "CA pending"}
                />
              </dl>
              {h?.error ? <p className="rail-note">{h.error}</p> : null}
              <p className="rail-note">
                Reads {SITE.chainName}. No CA yet means no {SITE.ticker} to count.
              </p>
              <div className="rail-actions">
                <button
                  type="button"
                  className="rail-btn"
                  onClick={() => void holdings.refetch()}
                >
                  Refresh
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="rail-copy">
                Connect MetaMask or OKX on {SITE.chainName}. After you buy on LONG,
                this rail counts the bag. Not a payout.
              </p>
              <ConnectButton />
            </>
          )
        ) : null}

        {tab === "vault" ? (
          <>
            <p className="rail-copy">{HOLD.thesis}</p>
            <dl className="rail-stats">
              <Stat
                label="Vault AAPL"
                value={SITE.basketCa ? (vault.data?.vaultAapl ?? "—") : "pending"}
              />
              <Stat
                label="Vault"
                value={SITE.basketCa ? shorten(SITE.basketCa) : "pending"}
              />
            </dl>
            <p className="rail-note">
              Community vault fills from fees after create. Dry until the receipt.
            </p>
          </>
        ) : null}

        {tab === "trade" ? (
          <>
            <p className="rail-copy">
              Pair is {SITE.listing.quote}. Create and swap run on {SITE.pad.name}.
            </p>
            <div className="rail-actions">
              <a className="rail-btn" href={trade} target="_blank" rel="noreferrer">
                Open {SITE.pad.name}
              </a>
              {SITE.tokenCa ? (
                <a
                  className="rail-btn rail-btn-ghost"
                  href={explorerToken(SITE.tokenCa)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Token
                </a>
              ) : null}
            </div>
            <p className="rail-note">Their terms apply the moment you sign.</p>
          </>
        ) : null}
      </div>
    </section>
  );
}

export function HomeRails() {
  const [mobile, setMobile] = useState<"fall" | "basket">("fall");

  return (
    <div className="home-dock">
      <div className="home-dock-desktop">
        <FallPanel />
        <BasketPanel />
      </div>
      <div className="home-dock-mobile">
        <div className="rail-tabs rail-tabs-mobile" role="tablist" aria-label="Home panels">
          <button
            type="button"
            className="rail-tab"
            aria-selected={mobile === "fall"}
            onClick={() => setMobile("fall")}
          >
            Fall
          </button>
          <button
            type="button"
            className="rail-tab"
            aria-selected={mobile === "basket"}
            onClick={() => setMobile("basket")}
          >
            Basket
          </button>
        </div>
        {mobile === "fall" ? <FallPanel /> : <BasketPanel />}
      </div>
    </div>
  );
}
