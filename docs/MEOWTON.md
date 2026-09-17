# MEOWTON

**The apple falls. The cat catches.**

AAPL-eşli memecoin · Robinhood Chain `4663` · launch pad: **LONG** (`app.long.xyz`).

Hazırlık özeti. 17 Eylül 2026. Token / hook / basket CA yok. Sahte adres yok.

---

## 1. Ne olduğu, ne olmadığı

Isaac Newton + meow. Düşen elma = tokenize **AAPL**. Kedi yakalar.

Üç eksen:

| Eksen | Durum |
| --- | --- |
| Kedi + AAPL teması | **İlk değil.** Apple Cat (`$AAPLCAT`), iCat, “AAPL CAT” canlı. LONG’ta `$MEOW` AMD pair’i var — **MEOWTON değil.** |
| Newton / yerçekimi / düşen elma | İsim ve tema boş görünüyor. Kolay kopyalanır. “İlk” buna dayanmaz. |
| Harici hisse oracle yönüne bağlı asimetrik fee | **Savunulan ilk.** Canlı öncül bulunamadı. LONG Airlock bunu taşımaz. |

Saha cümlesi:

> Not the first cat on AAPL. The bet is the hook: external stock-oracle direction, asymmetric fees. Unaudited. Not a payout.

Market-hours kapısı (StonkHook V3/V4) **kopyalanmaz.** O eksen dolu. MEOWTON saate bakmaz, AAPL’ın son oracle print’ine göre **yöne** bakar. Bu tablo LONG pad fee’si değildir.

---

## 2. Mekanik

Hook, her swap’ta Chainlink `RHAAPL / USD` okur. **Önerilen, unmined.** LONG pool’unda çalışmaz.

1. `updatedAt` **15 dakikadan** eskiyse → feed **asleep**. Asimetri kapalı. Statik fee.
2. Print taze ve AAPL **son print’e göre düşüyorsa** → alım ucuz, satım pahalı. Kedi elmayı yakalar.
3. Print taze ve AAPL **yükseliyor veya yataysa** → simetrik “walk” fee.

Fee’ler quote asset’te (AAPL). Biriken ücret **Newton’s basket**’te AAPL olarak durur. Merkle yok, keeper yok, airdrop dili yok, çağırana ödeme yok.

### Önerilen fee (hook henüz yok — sitede “proposed, not the pad’s”)

| Mod | Koşul | Buy | Sell |
| --- | --- | --- | --- |
| `sleep` | Feed > 15 dk eski / yön yok | 1.00% | 1.00% |
| `fall` | AAPL son print’e göre ↓ | 0.05% | 2.50% |
| `rise` | AAPL son print’e göre ↑ veya düz | 0.30% | 0.30% |

Kod: [`src/lib/site.ts`](src/lib/site.ts) `FEES`. Canlı okuma: [`src/lib/aapl.ts`](src/lib/aapl.ts). Orchard chip = sitemizin okuması, LONG execution fee değil.

### Neden saat değil, yön

StonkHookV3 `0x9265…9AcC` ve V4 `0x9ef4…9aCc` NYSE seansına kilitliyor. EasyA, PAIR, PumpV4StockHook, StockFeeHookImmutable sabit hisse-bacağı fee. Hepsi **zaman** veya **sabit bps**.

Uniswap dokümanı “price oracle / price momentum” dinamik fee’yi kavram olarak listeliyor; harici bir hissenin yönüne bağlı asimetrik fee canlı deploy olarak bulunamadı. BandHook (PR) pool’un **kendi** varlığının oracle’ı — AAPL değil.

### Kırılganlıklar (bilinçli)

- Chainlink hisse feed’leri **24/5**. Gece, hafta sonu, tatil: son fiyatta donar, heartbeat yok. DEX 24/7. Asimetri tam da sapmanın büyük olduğu saatlerde kapanır — bu yüzden stale → statik.
- `oraclePaused()` kurumsal işlemde feed’i dondurur.
- Feed yazımı ile swap arası gecikme: arbitraj. Stale kapısı bunu sınırlar, yok etmez.
- Yön v1’de **önceki kapanış** değil **son oracle round**. Daha sıkı “vs prior close” sonra.

---

## 3. Zincir ve adresler

| Rol | Adres | Not |
| --- | --- | --- |
| Chain | `4663` | Robinhood Chain, ETH gas |
| RPC | `https://rpc.mainnet.chain.robinhood.com` | Batch yok |
| Explorer | [robinhoodchain.blockscout.com](https://robinhoodchain.blockscout.com) | |
| AAPL token | `0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9` | On-chain `symbol()` = AAPL |
| AAPL feed | `0x6B22A786bAa607d76728168703a39Ea9C99f2cD0` | Chainlink dizin: `RHAAPL / USD`, 8 decimals, Total Return (multiplier dahil) |
| v4 PoolManager | `0x8366a39CC670B4001A1121B8F6A443A643e40951` | Hood docs |
| Pad | [app.long.xyz](https://app.long.xyz) | Long Inc. Airlock hook. PoolKey onların. |
| LongLauncher | `0x22e99278308b393ea1260859b181ad7e78f5eeed` | Factory |
| Airlock | `0xeb7c034704ef8dcd2d32324c1545f62fb4ad0862` | Doppler Airlock |
| Pad hook | `0x4e3468951d49f2eea976ed0d6e75ffcb44a9a544` | DopplerHookInitializer |
| **MEOWTON token** | — | pending |
| **Hook (ours)** | — | pad: Airlock · ours: unmined |
| **Pool** | — | pending |
| **Basket** | — | LONG community vault, pending |

Feed doğrulandı: `description()` = `Robinhood AAPL / USD`, `decimals()` = 8. NYSE kapalıyken age > 15 dk → sitede **ASLEEP**.

Kaynak: [Chainlink Robinhood tokenized equities](https://docs.chain.link/data-feeds/tokenized-equity-feeds/robinhood), dizin JSON `feeds-robinhood-mainnet.json`.

---

## 4. Launch kararı

Uniswap v4’te hook adresi `PoolKey` içinde. **Sonradan takılmaz.**

| Pad | AAPL pair | Özel hook | Sonuç |
| --- | --- | --- | --- |
| **Pons v2** | Sadece onaylı quote | Yok — paylaşımlı meme hook | Catapoolt için doğruydu. MEOWTON için değil. |
| **Long.xyz** | Native (AAPL hacmi büyük) | Yok — Airlock | Pazar orada. Yön-fee ölür. Apple Cat 2 riski. |
| PAIR / Bankr / EasyA / letscash | Sabit pad hook | Yok | Elenir. |
| **Doğrudan v4** | Sen kurarsın | Evet | Mekanik ayakta. Dağıtım zayıf. |

**Karar 17 Eylül 2026 — dağıtım: LONG.** Kullanıcı `app.long.xyz` üzerinden basacak.

Bu, yön-fee iddiasını bu pool’da öldürür. Site yalan söylemez:

- Orchard + canlı print durur (marka).
- Fee tablosu “proposed, not the pad’s” kalır.
- Basket = LONG **Community mode** vault (AAPL sink). Create’de community mode **açık**.
- Create gerçeği: arzın tamamı havuza gider, creator token almaz. LONG protokol kesintisi (tipik ~%5) onların; fee’leri değiştirme hakkı terms’te.
- Trade URL: `https://app.long.xyz/tokens/{CA}` — CA gelince `site.ts`.

İkinci pool (kendi hook) sonradan açılırsa likidite parçalanır. V2 olarak ayrı karar.

Pons v2 referans (Catapoolt, karıştırma): factory `0x7eD5…7e`, docs [docs.ponsfamily.com/v2](https://docs.ponsfamily.com/v2).

---

## 5. LONG listing kartı

Create formuna birebir. Ticker **harf only** (rakam/boşluk/tire zincir reddeder). `$MEOW` AMD pair’i LONG’ta var — **MEOWTON ayrı**.

| Alan | Değer |
| --- | --- |
| Name | `MEOWTON` |
| Ticker | `MEOWTON` (MEWTON değil) |
| Quote | AAPL `0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9` |
| Supply | pad default, typically `1,000,000,000` |
| Community mode | **ON** |
| Image | `public/x/logo.png` (800×800) |
| Website | https://meowton.lol |
| X | pending |
| Description | The apple falls. The cat catches. $MEOWTON is paired with tokenized $AAPL on Robinhood Chain. Not the first cat on AAPL. Unaudited. Not a payout. Not affiliated with Apple, Robinhood, or Long Inc. |

Yasal:

- Token ticareti: [app.long.xyz/terms](https://app.long.xyz/terms) (effective **8 September 2026**) · [privacy](https://app.long.xyz/privacy)
- Operator: Long Inc., 1013 Centre Road, Suite 403-B, Wilmington, DE 19805. Delaware law. Contact `info@long.xyz` (onların, bizim değil).
- Meme coin: entertainment / humour / parody / satire. “moon” / “100x” garanti değil.
- Stock Tokens: US persons’a sunulmaz / satılmaz / teslim edilmez (LONG terms).
- 18+. Self-custody. App ≠ Protocol.
- Bu site: `/terms` · `/privacy` (orchard; hesap yok; cüzdan yok; Privy/PostHog/Sentry yok)

---

## 6. Site (preview)

Living orchard. Steve Hood ritmi, Catapoolt meadow değil.

- Tam ekran bahçe, kedi yürür, elmalar düşer. Tıkla → zıpla. Kozmetik.
- HUD: `$MEOWTON · AAPL $xx · FALL/RISE/ASLEEP · CA pending`
- Nav: **How · Fall · Basket · X** (X handle henüz yok)
- Footer: Terms · Privacy · LONG · LONG terms
- Metin İngilizce. CA yok, buy butonu yok, airdrop yok.

| Route | İçerik |
| --- | --- |
| `/` | Bahçe + tagline + feed modu |
| `/how` | Pair / Pad / Basket + önerilen fee tablosu (not the pad’s) |
| `/fall` | Canlı oracle: fiyat, vs last print, age |
| `/basket` | LONG create kartı (copy) + pending CA + pad kontratları |
| `/terms` | Site terms; LONG terms’e pointer |
| `/privacy` | Site privacy; LONG privacy’ye pointer |

Palette: ink `#1c1410` · parchment `#f4ead8` · apple `#c41e3a` · leaf `#3d6b3a` · gold `#c4a35a`  
Type: Fraunces + IBM Plex Mono.

### Görseller

| Dosya | Kullanım |
| --- | --- |
| `public/world/orchard.jpg` | Sahne |
| `public/sprites/cat-walk.png` | Kedi (yüz kameraya) |
| `public/sprites/cat-sit.png` | Oturan kedi |
| `public/sprites/apple-a.png` / `apple-b.png` | Düşen elma |
| `public/x/logo.png` | 800×800 — LONG image |
| `public/x/banner.jpg` | 1500×500 |
| `public/x/cover.jpg` | 1500×600 (5:2) |
| `public/og.jpg` | 1200×630 share card |
| `public/favicon.svg` | Elma + kedi kulağı |

Domain: [meowton.lol](https://meowton.lol). GitHub / X boş.

---

## 7. Likidite ve regülasyon

Tipik AAPL-meme havuzu sığ ($3K–$30K; birkaç $700K+). Arzın %10–30’unu çıkarmak için havuz, pozisyonun ~3 katı derinlikte olmalı. Kilitli LP = çıkış beklentisini baştan bırak.

Vlad Tenev hisse-eşli meme’i tolere ediyor. AMC CEO itirazı var. SEC tokenize hisse yapılarını inceliyor. Tema/mekanikten bağımsız arka plan riski.

LONG terms: meme coins entertainment; Stock Tokens not for every jurisdiction; Delaware / Long Inc.

---

## 8. Yapılacak sıra

```
LONG create (AAPL quote, community mode ON, listing card)
→ CA + vault + pool → site.ts TOKEN_CA / BASKET_CA / POOL_CA
→ HUD Trade → app.long.xyz/tokens/{CA}
→ X handle
→ (ayrı karar) hook spec → audit → self-deployed v4 pool
```

Sahte CA basılmaz. Harvest/basket bakiyesi adres gerçek olana kadar dry.

---
