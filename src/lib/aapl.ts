import { createServerFn } from "@tanstack/react-start";
import { FEES, resolveMode, SITE, type FeeMode } from "@/lib/site";

export type AaplSnapshot = {
  ok: boolean;
  price: number | null;
  prevPrice: number | null;
  delta: number | null;
  deltaPct: number | null;
  updatedAt: number | null;
  ageSec: number | null;
  mode: FeeMode;
  buyBps: number;
  sellBps: number;
  roundId: string | null;
  description: string;
  error?: string;
};

const SELECTOR_LATEST = "0xfeaf968c";
const SELECTOR_GET_ROUND = "0x9a6fc8f5";
const CACHE_MS = 20_000;
const FAIL_CACHE_MS = 5_000;

let cache: { at: number; snap: AaplSnapshot } | null = null;

function asleep(error?: string): AaplSnapshot {
  const fees = FEES.sleep;
  return {
    ok: false,
    price: null,
    prevPrice: null,
    delta: null,
    deltaPct: null,
    updatedAt: null,
    ageSec: null,
    mode: "sleep",
    buyBps: fees.buyBps,
    sellBps: fees.sellBps,
    roundId: null,
    description: SITE.feedName,
    error,
  };
}

function word(hex: string, index: number): bigint {
  const body = hex.startsWith("0x") || hex.startsWith("0X") ? hex.slice(2) : hex;
  const slice = body.slice(index * 64, index * 64 + 64);
  if (slice.length < 64) throw new Error("short abi word");
  return BigInt(`0x${slice}`);
}

function toSigned256(n: bigint): bigint {
  const bits = 256n;
  const max = 1n << (bits - 1n);
  return n >= max ? n - (1n << bits) : n;
}

function scalePrice(answer: bigint): number {
  return Number(answer) / 10 ** SITE.feedDecimals;
}

async function ethCall(data: string): Promise<string> {
  const res = await fetch(SITE.rpc, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to: SITE.aaplFeed, data }, "latest"],
    }),
  });
  if (!res.ok) throw new Error(`rpc ${res.status}`);
  const json = (await res.json()) as {
    result?: string;
    error?: { message?: string };
  };
  if (json.error?.message) throw new Error(json.error.message);
  if (!json.result || json.result === "0x") throw new Error("empty result");
  return json.result;
}

function encodeGetRound(roundId: bigint): string {
  return `${SELECTOR_GET_ROUND}${roundId.toString(16).padStart(64, "0")}`;
}

async function readFeed(nowMs: number): Promise<AaplSnapshot> {
  const latest = await ethCall(SELECTOR_LATEST);
  const roundId = word(latest, 0);
  const answer = toSigned256(word(latest, 1));
  const updatedAt = Number(word(latest, 3));
  const price = scalePrice(answer);

  let prevAnswer: bigint | null = null;
  let prevPrice: number | null = null;
  try {
    const prevRaw = await ethCall(encodeGetRound(roundId - 1n));
    prevAnswer = toSigned256(word(prevRaw, 1));
    prevPrice = scalePrice(prevAnswer);
  } catch {
    prevAnswer = null;
    prevPrice = null;
  }

  const nowSec = Math.floor(nowMs / 1000);
  const ageSec = Number.isFinite(updatedAt) ? Math.max(0, nowSec - updatedAt) : null;
  const mode = resolveMode({
    nowSec,
    updatedAtSec: Number.isFinite(updatedAt) ? updatedAt : null,
    lastAnswer: answer,
    prevAnswer,
  });
  const fees = FEES[mode];
  const delta =
    prevPrice != null && Number.isFinite(price) ? price - prevPrice : null;
  const deltaPct =
    delta != null && prevPrice ? (delta / prevPrice) * 100 : null;

  return {
    ok: true,
    price,
    prevPrice,
    delta,
    deltaPct,
    updatedAt,
    ageSec,
    mode,
    buyBps: fees.buyBps,
    sellBps: fees.sellBps,
    roundId: roundId.toString(),
    description: SITE.feedName,
  };
}

export const fetchAapl = createServerFn({ method: "GET" }).handler(
  async (): Promise<AaplSnapshot> => {
    const now = Date.now();
    if (cache && now - cache.at < (cache.snap.ok ? CACHE_MS : FAIL_CACHE_MS)) {
      return cache.snap;
    }
    try {
      const snap = await readFeed(now);
      cache = { at: now, snap };
      return snap;
    } catch (err) {
      const snap = asleep(err instanceof Error ? err.message : "feed unread");
      cache = { at: now, snap };
      return snap;
    }
  },
);
