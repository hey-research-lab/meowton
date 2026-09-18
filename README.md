# MEOWTON

**He required an apple.**

AAPL-paired memecoin on Robinhood Chain (`4663`). Launch pad: [LONG](https://app.long.xyz).
The site is live. Token, pool, and basket addresses are not.

> Not the first cat on AAPL. The bet is the hook: external stock-oracle direction, asymmetric fees. Unaudited. Not a payout.

## Pair

**MEOWTON / AAPL** — not MEWTON. The joke is spoken: *meow-ton* / *new-ton*.
`$MEWTON` reads as a typo of Newton and loses the cat.

## Pad

Distribution is on LONG, quote $AAPL, community mode on. LONG’s Airlock hook
is not ours. The directional fee table on `/how` is proposed for a later
self-deployed pool — not what you pay on the pad.

Trading on LONG is governed by [their terms](https://app.long.xyz/terms) and
[privacy notice](https://app.long.xyz/privacy). This site: `/terms`, `/privacy`.

## Mechanic (proposed, not the pad’s)

The hook would read Chainlink `RHAAPL / USD` on every swap.

| Mode | Condition | Buy | Sell |
| --- | --- | --- | --- |
| sleep | Feed older than 15 minutes, or no direction | 1.00% | 1.00% |
| fall | Fresh print, AAPL down vs last oracle round | 0.05% | 2.50% |
| rise | Fresh print, AAPL up or flat | 0.30% | 0.30% |

Fees would accrue in AAPL in Newton’s basket. On LONG, the stand-in is the
community vault. No merkle, no keeper, no airdrop, no caller payout.

## Addresses

| Role | Value |
| --- | --- |
| Chain | `4663` Robinhood Chain |
| AAPL | `0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9` |
| Feed | `0x6B22A786bAa607d76728168703a39Ea9C99f2cD0` |
| PoolManager | `0x8366a39CC670B4001A1121B8F6A443A643e40951` |
| Pad | https://app.long.xyz |
| MEOWTON | `0x21676bE78C8C0c8F639bAc5238a4a13B0e111e18` |
| hook / pool / basket | pending |

No fabricated pool or vault addresses. Wire them in `src/lib/site.ts` when they exist.

## Site

- `/` living orchard
- `/how` pad + proposed fees
- `/fall` live oracle
- `/basket` listing card + token CA
- `/terms` website terms (points at LONG for the trading app)
- `/privacy` website privacy (optional wallet connect)

Copy is English. Trade is on LONG.

## Next

LONG create (AAPL, community mode, website `https://meowton.lol`) → CAs in `site.ts` → X.
Hook remains a separate, later pool — or it stays a story.
