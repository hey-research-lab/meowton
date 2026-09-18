import { Link, useRouterState } from "@tanstack/react-router";
import { CatPicker } from "@/components/cat-picker";
import { LegalFoot } from "@/components/legal-foot";
import { OrchardScene } from "@/components/orchard-scene";
import { requestOrchardTap, useNewton } from "@/lib/newton";
import { useAapl } from "@/lib/use-aapl";
import {
  formatTMinus,
  formatUsd,
  longTradeUrl,
  MODE_LABEL,
  SITE,
} from "@/lib/site";

const NAV = [
  { to: "/how", label: "How" },
  { to: "/article", label: "Note" },
  { to: "/fall", label: "Fall" },
  { to: "/basket", label: "Basket" },
] as const;

function TickerBar() {
  const aapl = useAapl();
  const mode = aapl.data?.mode ?? "sleep";
  const price = aapl.data?.price;
  const trade = SITE.tokenCa ? longTradeUrl(SITE.tokenCa) : null;
  const line = [
    SITE.pair,
    price != null ? formatUsd(price) : "—",
    MODE_LABEL[mode],
    SITE.launchAt ? formatTMinus() : null,
    trade ? "TRADE" : "CA PENDING",
  ]
    .filter(Boolean)
    .join("   ·   ")
    .toUpperCase();

  return (
    <div className="ticker-bar">
      <div className="ticker-marquee" aria-label="Live feed">
        <div className="ticker-track">
          <span>{line}</span>
          <span aria-hidden="true">{line}</span>
          <span aria-hidden="true">{line}</span>
        </div>
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
        ) : null}
      </nav>
    </div>
  );
}

function Chrome() {
  return (
    <header className="site-chrome">
      <div className="chrome-stack">
        <TickerBar />
        <CatPicker />
      </div>
    </header>
  );
}

function Foot({ home }: { home: boolean }) {
  const hint = useNewton((s) => s.hint);
  const phase = useNewton((s) => s.phase);
  const TitleTag = home ? "h1" : "p";

  return (
    <footer className="site-foot">
      <div className="foot-bar">
        <div className="foot-brand">
          <TitleTag className="foot-title">{SITE.tagline}</TitleTag>
          <p className="foot-lede">Gravity was a rumor.</p>
        </div>
        <div className="foot-meta">
          {home ? (
            <p className="hero-hint" data-phase={phase}>
              {hint}
            </p>
          ) : null}
          <LegalFoot home />
        </div>
      </div>
    </footer>
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
      <Foot home={home} />
    </div>
  );
}
