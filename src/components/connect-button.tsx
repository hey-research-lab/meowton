import { useEffect, useRef, useState } from "react";
import { useWallet, walletInstalled, type WalletKind } from "@/lib/wallet";
import { explorerAddress, shorten, SITE } from "@/lib/site";

const WALLETS: { id: WalletKind; label: string; href: string }[] = [
  { id: "metamask", label: "MetaMask", href: "https://metamask.io/download" },
  { id: "okx", label: "OKX Wallet", href: "https://www.okx.com/download" },
];

export function ConnectButton({ compact = false }: { compact?: boolean }) {
  const { address, chainId, connecting, error, connect, disconnect, hydrate } = useWallet();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open]);

  const wrong = address && chainId != null && chainId !== SITE.chainId;

  return (
    <div className="connect-wrap" ref={box}>
      {address ? (
        <button
          type="button"
          className="connect-btn is-on"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {wrong ? "Wrong chain" : shorten(address)}
        </button>
      ) : (
        <button
          type="button"
          className="connect-btn"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {connecting ? "Connecting…" : compact ? "Connect" : "Connect wallet"}
        </button>
      )}
      {open ? (
        <div className="connect-menu" role="menu">
          {address ? (
            <>
              <p className="connect-meta">
                {shorten(address)}
                {wrong ? ` · not ${SITE.chainName}` : ` · ${SITE.chainName}`}
              </p>
              <a
                className="connect-item"
                href={explorerAddress(address)}
                target="_blank"
                rel="noreferrer"
              >
                View on explorer
              </a>
              {wrong ? (
                <button
                  type="button"
                  className="connect-item"
                  onClick={() => {
                    const kind = useWallet.getState().kind;
                    if (kind) void connect(kind);
                  }}
                >
                  Switch to {SITE.chainName}
                </button>
              ) : null}
              <button
                type="button"
                className="connect-item"
                onClick={() => {
                  disconnect();
                  setOpen(false);
                }}
              >
                Disconnect
              </button>
            </>
          ) : (
            WALLETS.map((w) => {
              const installed = walletInstalled(w.id);
              return installed ? (
                <button
                  key={w.id}
                  type="button"
                  className="connect-item"
                  onClick={() => {
                    void connect(w.id).then(() => setOpen(false));
                  }}
                >
                  {w.label}
                </button>
              ) : (
                <a
                  key={w.id}
                  className="connect-item"
                  href={w.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  Install {w.label}
                </a>
              );
            })
          )}
          {error ? <p className="connect-error">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
