export const SITE = {
  name: "MEOWTON",
  ticker: "$MEOWTON",
  pair: "$MEOWTON × $AAPL",
  tagline: "He required an apple.",
  field:
    "Not the first cat on AAPL. Live: AAPL pair and a community vault. The directional hook is later. Unaudited. Not a payout.",
  domain: "meowton.lol",
  url: "https://meowton.lol",
  xHandle: null as string | null,
  launchAt: null as number | null,
  chainId: 4663,
  chainName: "Robinhood Chain",
  rpc: "https://rpc.mainnet.chain.robinhood.com",
  explorer: "https://robinhoodchain.blockscout.com",
  aaplToken: "0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9",
  aaplFeed: "0x6B22A786bAa607d76728168703a39Ea9C99f2cD0",
  poolManager: "0x8366a39CC670B4001A1121B8F6A443A643e40951",
  tokenCa: null as string | null,
  hookCa: null as string | null,
  poolCa: null as string | null,
  basketCa: null as string | null,
  staleSec: 15 * 60,
  feedDecimals: 8,
  feedName: "Robinhood AAPL / USD",
  pad: {
    name: "LONG",
    operator: "Long Inc.",
    address: "1013 Centre Road, Suite 403-B, Wilmington, DE 19805",
    app: "https://app.long.xyz",
    terms: "https://app.long.xyz/terms",
    privacy: "https://app.long.xyz/privacy",
    create: "https://app.long.xyz",
    termsEffective: "8 September 2026",
    contact: "info@long.xyz",
    factory: "0x22e99278308b393ea1260859b181ad7e78f5eeed",
    airlock: "0xeb7c034704ef8dcd2d32324c1545f62fb4ad0862",
    hook: "0x4e3468951d49f2eea976ed0d6e75ffcb44a9a544",
  },
  listing: {
    name: "MEOWTON",
    ticker: "MEOWTON",
    quote: "AAPL",
    supply: "1,000,000,000",
    communityMode: true,
    image: "/x/logo.png",
    website: "https://meowton.lol",
    description:
      "He required an apple. $MEOWTON is paired with tokenized $AAPL on Robinhood Chain. Not the first cat on AAPL. Unaudited. Not a payout. Not affiliated with Apple, Robinhood, or Long Inc.",
  },
} as const;

/** What a buyer actually holds on LONG. Not a coupon. */
export const HOLD = {
  thesis:
    "You buy a cat quoted in AAPL. Volume can fill a community vault with AAPL. Holders, not the creator, point that vault.",
  get: [
    {
      t: "AAPL on the other side",
      d: "Every trade is $MEOWTON against tokenized $AAPL. The book is Apple, not a stablecoin.",
    },
    {
      t: "No creator bag at create",
      d: "The whole 1,000,000,000 supply goes in the pool. We do not receive tokens from LONG’s create.",
    },
    {
      t: "Newton’s basket",
      d: "Community mode routes a cut of trading fees into a vault that can hold AAPL. That stock sits there until holders move it.",
    },
    {
      t: "Burns, if the pad splits them",
      d: "LONG’s community splitter can burn a share of the meme-side fee. Supply only moves if their hook actually burns.",
    },
  ],
  not: [
    "Not Apple equity. Not a dividend. Not a coupon from us.",
    "Not an automatic AAPL airdrop to your wallet.",
    "Not the fall/rise fee table — that hook is unmined. You pay LONG’s fee.",
    "Not a promise the vault pays you. Price can go to zero.",
  ],
} as const;

export type FeeMode = "sleep" | "fall" | "rise";

export const MODE_LABEL: Record<FeeMode, string> = {
  sleep: "asleep",
  fall: "fall",
  rise: "rise",
};

export const FEES: Record<
  FeeMode,
  { buyBps: number; sellBps: number; when: string }
> = {
  sleep: {
    buyBps: 100,
    sellBps: 100,
    when: "Feed older than 15 minutes, or no direction",
  },
  fall: {
    buyBps: 5,
    sellBps: 250,
    when: "Fresh print, AAPL down vs last oracle round",
  },
  rise: {
    buyBps: 30,
    sellBps: 30,
    when: "Fresh print, AAPL up or flat vs last oracle round",
  },
};

export const FEE_ORDER: FeeMode[] = ["sleep", "fall", "rise"];

export function explorerAddress(addr: string) {
  return `${SITE.explorer}/address/${addr}`;
}

export function longTradeUrl(ca: string | null = SITE.tokenCa) {
  if (!ca) return SITE.pad.app;
  return `${SITE.pad.app}/tokens/${ca}`;
}

export function formatBps(bps: number) {
  return `${(bps / 100).toFixed(2)}%`;
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatSignedUsd(n: number) {
  const abs = formatUsd(Math.abs(n));
  if (n > 0) return `+${abs}`;
  if (n < 0) return `−${abs}`;
  return abs;
}

export function formatPct(n: number) {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(n).toFixed(2)}%`;
}

export function formatAge(sec: number) {
  if (sec < 60) return `${Math.max(0, Math.floor(sec))}s`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  if (h < 48) return rm ? `${h}h ${rm}m` : `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

export function formatTMinus(now = Date.now()) {
  if (!SITE.launchAt) return "T–";
  const ms = SITE.launchAt - now;
  if (ms <= 0) return "T-0";
  const totalM = Math.floor(ms / 60_000);
  const d = Math.floor(totalM / (60 * 24));
  const h = Math.floor(totalM / 60);
  if (d >= 2) return `T–${d}d`;
  if (h >= 1) return `T–${h}h`;
  return `T–${Math.max(1, totalM)}m`;
}

export function shorten(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function resolveMode(input: {
  nowSec: number;
  updatedAtSec: number | null;
  lastAnswer: bigint | null;
  prevAnswer: bigint | null;
}): FeeMode {
  if (input.updatedAtSec == null || input.lastAnswer == null) return "sleep";
  if (input.nowSec - input.updatedAtSec > SITE.staleSec) return "sleep";
  if (input.prevAnswer == null) return "sleep";
  if (input.lastAnswer < input.prevAnswer) return "fall";
  return "rise";
}
