import { Link, useRouterState } from "@tanstack/react-router";
import { CatPicker } from "@/components/cat-picker";
import { OrchardScene } from "@/components/orchard-scene";
import { requestOrchardTap } from "@/lib/newton";
import { useAapl } from "@/lib/use-aapl";
import {
  formatBps,
  formatTMinus,
  formatUsd,
  longTradeUrl,
  MODE_LABEL,
  SITE,
} from "@/lib/site";

const NAV = [
  { to: "/how", label: "How" },
  { to: "/fall", label: "Fall" },
  { to: "/basket", label: "Basket" },
] as const;

function Chrome() {
  const aapl = useAapl();
  const mode = aapl.data?.mode ?? "sleep";
  const price = aapl.data?.price;
  const trade = SITE.tokenCa ? longTradeUrl(SITE.tokenCa) : null;

  return (
    <header className="site-chrome">
      <div className="chrome-stack">
        <div className="chrome-bar">
          <div className="hud-row" aria-label="Live feed">
          <Link to="/" className="font-medium text-ink no-underline">
            {SITE.pair}
          </Link>
          <span className="hud-dot">·</span>
          <span className="tabular-nums">
            {price != null ? formatUsd(price) : "—"}
          </span>
          <span className="hud-dot">·</span>
          <span className="mode-chip" data-mode={mode}>
            <i aria-hidden="true" />
            {MODE_LABEL[mode]}
          </span>
          <span className="hud-dot">·</span>
          <span className="tabular-nums">
            {aapl.data
              ? `${formatBps(aapl.data.buyBps)} / ${formatBps(aapl.data.sellBps)}`
              : "—"}
          </span>
          {SITE.launchAt ? (
            <>
              <span className="hud-dot">·</span>
              <span className="tabular-nums">{formatTMinus()}</span>
            </>
          ) : null}
          <span className="hud-dot">·</span>
          {trade ? (
            <a
              className="hud-trade"
              href={trade}
              target="_blank"
              rel="noreferrer"
            >
              Trade
            </a>
          ) : (
            <span>CA pending</span>
          )}
        </div>
        <nav className="nav-row" aria-label="Site">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link"
              activeOptions={{ exact: true }}
            >
              {item.label}
            </Link>
          ))}
          {SITE.xHandle ? (
            <a
              className="nav-link"
              href={`https://x.com/${SITE.xHandle}`}
              target="_blank"
              rel="noreferrer"
            >
              X
            </a>
          ) : (
            <span className="nav-link nav-link-muted" title="Handle pending">
              X
            </span>
          )}
        </nav>
        </div>
        <CatPicker />
      </div>
    </header>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const home = pathname === "/";

  return (
    <div className="relative min-h-dvh bg-parchment text-ink">
      <OrchardScene />
      <div
        className={home ? "jump-layer jump-layer-home" : "jump-layer jump-layer-strip"}
        onPointerDown={(event) => {
          event.preventDefault();
          requestOrchardTap();
        }}
      />
      <Chrome />
      <div className="pointer-events-none relative z-20">{children}</div>
    </div>
  );
}
