# MEOWTON

**The apple falls. The cat catches.**

AAPL-paired memecoin on Robinhood Chain (`4663`). Uniswap v4 self-deployed hook.
The site is live. Token, hook, pool, and basket addresses are not.

> Not the first cat on AAPL. The bet is the hook: external stock-oracle direction, asymmetric fees. Unaudited. Not a payout.

## Pair

**MEOWTON / AAPL** — not MEWTON. The joke is spoken: *meow-ton* / *new-ton*.
`$MEWTON` reads as a typo of Newton and loses the cat.

## Mechanic (proposed, not live)

The hook reads Chainlink `RHAAPL / USD` on every swap.

| Mode | Condition | Buy | Sell |
| --- | --- | --- | --- |
| sleep | Feed older than 15 minutes, or no direction | 1.00% | 1.00% |
| fall | Fresh print, AAPL down vs last oracle round | 0.05% | 2.50% |
| rise | Fresh print, AAPL up or flat | 0.30% | 0.30% |

Fees accrue in AAPL in Newton’s basket. No merkle, no keeper, no airdrop, no caller payout.

## Addresses

| Role | Value |
| --- | --- |
| Chain | `4663` Robinhood Chain |
| AAPL | `0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9` |
| Feed | `0x6B22A786bAa607d76728168703a39Ea9C99f2cD0` |
| PoolManager | `0x8366a39CC670B4001A1121B8F6A443A643e40951` |
| MEOWTON / hook / pool / basket | pending |

No fabricated contract addresses. Wire them in `src/lib/site.ts` when they exist.

## Site

- `/` living orchard
- `/how` mechanic and proposed fees
- `/fall` live oracle
- `/basket` pending contracts

Copy is English. There is no buy button.

## Next

Hook spec → audit → v4 hook flags + salt → ERC-20 → AAPL/MEOWTON pool → basket → CAs in `site.ts` → X + domain.
