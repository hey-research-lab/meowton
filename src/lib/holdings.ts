import { createServerFn } from "@tanstack/react-start";
import { SITE } from "@/lib/site";

export type Holdings = {
  address: string;
  eth: string | null;
  aapl: string | null;
  meowton: string | null;
  vaultAapl: string | null;
  error?: string;
};

const BALANCE_OF = "0x70a08231";
const DECIMALS = "0x313ce567";
const RPC_TIMEOUT_MS = 4_000;

function padAddr(addr: string) {
  return addr.replace(/^0x/i, "").toLowerCase().padStart(64, "0");
}

function isAddr(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

async function rpc(method: string, params: unknown[]): Promise<string> {
  const errors: string[] = [];
  for (const url of SITE.rpcs) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), RPC_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`rpc ${res.status}`);
      const json = (await res.json()) as { result?: string; error?: { message?: string } };
      if (json.error?.message) throw new Error(json.error.message);
      if (json.result == null) throw new Error("empty");
      return json.result;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "fail");
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(errors[0] || "rpc unread");
}

function formatUnits(hex: string, decimals: number) {
  const raw = BigInt(hex);
  if (decimals <= 0) return raw.toString();
  const base = 10n ** BigInt(decimals);
  const whole = raw / base;
  const frac = (raw % base).toString().padStart(decimals, "0").replace(/0+$/, "").slice(0, 6);
  return frac ? `${whole.toString()}.${frac}` : whole.toString();
}

async function tokenBalance(token: string, owner: string) {
  const [bal, decHex] = await Promise.all([
    rpc("eth_call", [{ to: token, data: `${BALANCE_OF}${padAddr(owner)}` }, "latest"]),
    rpc("eth_call", [{ to: token, data: DECIMALS }, "latest"]).catch(() => "0x12"),
  ]);
  const decimals = Number.parseInt(decHex, 16);
  return formatUnits(bal, Number.isFinite(decimals) ? decimals : 18);
}

export const fetchVault = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ vaultAapl: string | null }> => {
    if (!SITE.basketCa) return { vaultAapl: null };
    try {
      const vaultAapl = await tokenBalance(SITE.aaplToken, SITE.basketCa);
      return { vaultAapl };
    } catch {
      return { vaultAapl: null };
    }
  },
);

export const fetchHoldings = createServerFn({ method: "POST" })
  .validator((u: unknown) => {
    const address =
      typeof u === "object" && u && "address" in u ? String((u as { address: string }).address) : "";
    if (!isAddr(address)) throw new Error("bad address");
    return { address };
  })
  .handler(async ({ data }): Promise<Holdings> => {
    const address = data.address;
    try {
      const ethHex = await rpc("eth_getBalance", [address, "latest"]);
      const aapl = await tokenBalance(SITE.aaplToken, address).catch(() => null);
      const meowton = SITE.tokenCa
        ? await tokenBalance(SITE.tokenCa, address).catch(() => null)
        : null;
      const vaultAapl = SITE.basketCa
        ? await tokenBalance(SITE.aaplToken, SITE.basketCa).catch(() => null)
        : null;
      return {
        address,
        eth: formatUnits(ethHex, 18),
        aapl,
        meowton,
        vaultAapl,
      };
    } catch (err) {
      return {
        address,
        eth: null,
        aapl: null,
        meowton: null,
        vaultAapl: null,
        error: err instanceof Error ? err.message : "unread",
      };
    }
  });
