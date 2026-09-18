import { create } from "zustand";
import { SITE } from "@/lib/site";

export type WalletKind = "metamask" | "okx";

type Eip1193 = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, fn: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, fn: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
  isOkxWallet?: boolean;
  isOKXWallet?: boolean;
  providers?: Eip1193[];
};

declare global {
  interface Window {
    ethereum?: Eip1193;
    okxwallet?: Eip1193;
  }
}

const CHAIN_HEX = `0x${SITE.chainId.toString(16)}`;
const STORAGE = "meowton-wallet-v1";

function listProviders(): Eip1193[] {
  if (typeof window === "undefined") return [];
  const eth = window.ethereum;
  const listed = eth?.providers?.length ? eth.providers : eth ? [eth] : [];
  const extra = window.okxwallet && !listed.includes(window.okxwallet) ? [window.okxwallet] : [];
  return [...listed, ...extra];
}

export function getProvider(kind: WalletKind): Eip1193 | null {
  const all = listProviders();
  if (kind === "okx") {
    return (
      window.okxwallet ??
      all.find((p) => p.isOkxWallet || p.isOKXWallet) ??
      null
    );
  }
  return (
    all.find((p) => p.isMetaMask && !p.isOkxWallet && !p.isOKXWallet) ??
    (window.ethereum?.isMetaMask ? window.ethereum : null)
  );
}

export function walletInstalled(kind: WalletKind) {
  return !!getProvider(kind);
}

async function ensureChain(provider: Eip1193) {
  const current = (await provider.request({ method: "eth_chainId" })) as string;
  if (current?.toLowerCase() === CHAIN_HEX) return;
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_HEX }],
    });
  } catch (err) {
    const code = (err as { code?: number })?.code;
    if (code !== 4902 && code !== -32603) throw err;
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: CHAIN_HEX,
          chainName: SITE.chainName,
          nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
          rpcUrls: [...SITE.rpcs],
          blockExplorerUrls: [SITE.explorer],
        },
      ],
    });
  }
}

type WalletState = {
  address: string | null;
  chainId: number | null;
  kind: WalletKind | null;
  error: string | null;
  connecting: boolean;
  connect: (kind: WalletKind) => Promise<void>;
  disconnect: () => void;
  hydrate: () => void;
};

let listening: { provider: Eip1193; onAcc: (a: unknown) => void; onChain: (c: unknown) => void } | null =
  null;

function detach() {
  if (!listening) return;
  listening.provider.removeListener?.("accountsChanged", listening.onAcc);
  listening.provider.removeListener?.("chainChanged", listening.onChain);
  listening = null;
}

function attach(provider: Eip1193) {
  detach();
  const onAcc = (accounts: unknown) => {
    const list = Array.isArray(accounts) ? (accounts as string[]) : [];
    if (!list[0]) useWallet.getState().disconnect();
    else useWallet.setState({ address: list[0], error: null });
  };
  const onChain = (id: unknown) => {
    const hex = String(id);
    useWallet.setState({ chainId: Number.parseInt(hex, 16) || null });
  };
  provider.on?.("accountsChanged", onAcc);
  provider.on?.("chainChanged", onChain);
  listening = { provider, onAcc, onChain };
}

export const useWallet = create<WalletState>((set, get) => ({
  address: null,
  chainId: null,
  kind: null,
  error: null,
  connecting: false,
  hydrate: () => {
    try {
      const raw = sessionStorage.getItem(STORAGE);
      if (!raw) return;
      const saved = JSON.parse(raw) as { kind: WalletKind };
      const provider = getProvider(saved.kind);
      if (!provider) return;
      void provider.request({ method: "eth_accounts" }).then((accounts) => {
        const list = Array.isArray(accounts) ? (accounts as string[]) : [];
        if (!list[0]) return;
        attach(provider);
        void provider.request({ method: "eth_chainId" }).then((id) => {
          set({
            address: list[0],
            kind: saved.kind,
            chainId: Number.parseInt(String(id), 16) || null,
          });
        });
      });
    } catch {
      /* ignore */
    }
  },
  connect: async (kind) => {
    const provider = getProvider(kind);
    if (!provider) {
      set({
        error:
          kind === "okx"
            ? "OKX Wallet is not installed."
            : "MetaMask is not installed.",
      });
      return;
    }
    set({ connecting: true, error: null, kind });
    try {
      const accounts = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (!accounts?.[0]) throw new Error("No account returned.");
      await ensureChain(provider);
      const chainHex = (await provider.request({ method: "eth_chainId" })) as string;
      attach(provider);
      sessionStorage.setItem(STORAGE, JSON.stringify({ kind }));
      set({
        address: accounts[0],
        chainId: Number.parseInt(chainHex, 16) || SITE.chainId,
        kind,
        connecting: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Wallet rejected the request.";
      set({ connecting: false, error: message, address: get().address });
    }
  },
  disconnect: () => {
    detach();
    try {
      sessionStorage.removeItem(STORAGE);
    } catch {
      /* ignore */
    }
    set({ address: null, chainId: null, kind: null, error: null, connecting: false });
  },
}));

export function onRobinhood(chainId: number | null) {
  return chainId === SITE.chainId;
}
