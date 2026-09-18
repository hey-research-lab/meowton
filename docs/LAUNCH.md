# LONG create — no pre-contract

Do not deploy an ERC-20, hook, or vault before signing on [app.long.xyz](https://app.long.xyz).

LONG’s launcher (`0x22e99278…eeed`) emits the token, the AAPL pool, Airlock and the community vault in the create transaction. A homemade contract is a different product and will not be this pair.

## Wallet

- Network: Robinhood Chain (`4663`)
- RPC: `https://rpc.mainnet.chain.robinhood.com`
- Explorer: `https://robinhoodchain.blockscout.com`
- Quote in wallet: enough AAPL (`0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9`) plus gas. LONG prices the initial pool in the quote token.

## Create card

| Field | Value |
|---|---|
| Name | `MEOWTON` |
| Ticker | `MEOWTON` |
| Quote | AAPL |
| Quote CA | `0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9` |
| Community mode | ON |
| Website | `https://meowton.lol` |
| Image | `public/x/logo.png` (800×800) |
| Description | the blurb on /basket |

## After the receipt

Send three addresses: token, pool, vault. They go into `src/lib/site.ts` (`tokenCa`, `poolCa`, `basketCa`). Trade URL becomes `app.long.xyz/tokens/{token}`.

`hookCa` stays empty. Their Airlock hook is already in `SITE.pad.hook`.

## Legal

Terms effective 8 September 2026. Stock tokens: US persons closed. 18+. App ≠ Protocol. No moon language on the listing.
