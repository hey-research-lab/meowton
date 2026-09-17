# MEOWTON

**The apple falls. The cat catches.**

AAPL-eşli memecoin · Robinhood Chain `4663` · Uniswap v4 self-deployed hook.

Hazırlık özeti. 16–17 Eylül 2026. Token / hook / basket CA yok. Sahte adres yok.

---

## 1. Ne olduğu, ne olmadığı

Isaac Newton + meow. Düşen elma = tokenize **AAPL**. Kedi yakalar.

Üç eksen:

| Eksen | Durum |
| --- | --- |
| Kedi + AAPL teması | **İlk değil.** Apple Cat (`$AAPLCAT`), iCat, “AAPL CAT” canlı. |
| Newton / yerçekimi / düşen elma | İsim ve tema boş görünüyor. Kolay kopyalanır. “İlk” buna dayanmaz. |
| Harici hisse oracle yönüne bağlı asimetrik fee | **Savunulan ilk.** Canlı öncül bulunamadı. |

Saha cümlesi:

> Not the first cat on AAPL. The bet is the hook: external stock-oracle direction, asymmetric fees. Unaudited. Not a payout.

Market-hours kapısı (StonkHook V3/V4) **kopyalanmaz.** O eksen dolu. MEOWTON saate bakmaz, AAPL’ın son oracle print’ine göre **yöne** bakar.

---

## 2. Mekanik

Hook, her swap’ta Chainlink `RHAAPL / USD` okur.

1. `updatedAt` **15 dakikadan** eskiyse → feed **asleep**. Asimetri kapalı. Statik fee.
2. Print taze ve AAPL **son print’e göre düşüyorsa** → alım ucuz, satım pahalı. Kedi elmayı yakalar.
3. Print taze ve AAPL **yükseliyor veya yataysa** → simetrik “walk” fee.

Fee’ler quote asset’te (AAPL). Biriken ücret **Newton’s basket**’te AAPL olarak durur. Merkle yok, keeper yok, airdrop dili yok, çağırana ödeme yok.

### Önerilen fee (hook henüz yok — sitede “proposed, not live”)

| Mod | Koşul | Buy | Sell |
| --- | --- | --- | --- |
| `sleep` | Feed > 15 dk eski / yön yok | 1.00% | 1.00% |
| `fall` | AAPL son print’e göre ↓ | 0.05% | 2.50% |
| `rise` | AAPL son print’e göre ↑ veya düz | 0.30% | 0.30% |

Kod: [`src/lib/site.ts`](src/lib/site.ts) `FEES`. Canlı okuma: [`src/lib/aapl.ts`](src/lib/aapl.ts).

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
| **MEOWTON token** | — | pending |
| **Hook** | — | pending |
| **Pool** | — | pending |
| **Basket** | — | pending |

Feed doğrulandı: `description()` = `Robinhood AAPL / USD`, `decimals()` = 8. 16 Eylül 2026 ~19:09 UTC print ≈ **$332.12**; NYSE kapalıyken age > 15 dk → sitede **ASLEEP**.

Kaynak: [Chainlink Robinhood tokenized equities](https://docs.chain.link/data-feeds/tokenized-equity-feeds/robinhood), dizin JSON `feeds-robinhood-mainnet.json`.

---

## 4. Launch kararı

Uniswap v4’te hook adresi `PoolKey` içinde. **Sonradan takılmaz.**

| Pad | AAPL pair | Özel hook | Sonuç |
| --- | --- | --- | --- |
| **Pons v2** | Sadece onaylı quote | Yok — paylaşımlı meme hook `0xE5e7…044` | Catapoolt için doğruydu. MEOWTON için değil. |
| **Long.xyz** | Native (AAPL hacmi büyük, ~590 token) | Yok — Airlock hook `0x4e34…a544` | Pazar orada. Mekanik ölür. Apple Cat 2. |
| PAIR / Bankr / EasyA / letscash | Sabit pad hook | Yok | Elenir. |
| **Doğrudan v4** | Sen kurarsın | Evet | Mekanik ayakta. Dağıtım zayıf. |

**Karar: 1 — kendi hook + AAPL/MEOWTON havuzu.** Long/Pons’a basılırsa “ilk” iddiası düşer ve aynı pool’a hook gelmez.

Pons v2 referans (Catapoolt, karıştırma): factory `0x7eD5…7e`, docs [docs.ponsfamily.com/v2](https://docs.ponsfamily.com/v2).

---

## 5. Site (preview)

Living orchard. Steve Hood ritmi, Catapoolt meadow değil.

- Tam ekran bahçe, kedi yürür, elmalar düşer. Tıkla → zıpla. Kozmetik.
- HUD: `$MEOWTON · AAPL $xx · FALL/RISE/ASLEEP · T-24 · CA pending`
- Nav: **How · Fall · Basket · X** (X handle henüz yok)
- Metin İngilizce. CA yok, buy butonu yok, airdrop yok.

| Route | İçerik |
| --- | --- |
| `/` | Bahçe + tagline + feed modu |
| `/how` | Üç adım, önerilen fee tablosu, self-deploy notu |
| `/fall` | Canlı oracle: fiyat, vs last print, age, buy/sell bps |
| `/basket` | Token / hook / basket — hepsi `pending` |

Palette: ink `#1c1410` · parchment `#f4ead8` · apple `#c41e3a` · leaf `#3d6b3a` · gold `#c4a35a`  
Type: Fraunces + IBM Plex Mono.

### Görseller

| Dosya | Kullanım |
| --- | --- |
| `public/world/orchard.jpg` | Sahne |
| `public/sprites/cat-walk.png` | Kedi (yüz kameraya) |
| `public/sprites/cat-sit.png` | Oturan kedi |
| `public/sprites/apple-a.png` / `apple-b.png` | Düşen elma |
| `public/x/logo.png` | 800×800 |
| `public/x/banner.jpg` | 1500×500 |
| `public/x/cover.jpg` | 1500×600 (5:2) |
| `public/og.jpg` | 1200×630 share card |
| `public/favicon.svg` | Elma + kedi kulağı |

Domain taslak: `meowton.xyz` (alınmadı). GitHub / X boş.

---

## 6. Likidite ve regülasyon

Tipik AAPL-meme havuzu sığ ($3K–$30K; birkaç $700K+). Arzın %10–30’unu çıkarmak için havuz, pozisyonun ~3 katı derinlikte olmalı. Kilitli LP = çıkış beklentisini baştan bırak.

Vlad Tenev hisse-eşli meme’i tolere ediyor. AMC CEO itirazı var. SEC tokenize hisse yapılarını inceliyor. Tema/mekanikten bağımsız arka plan riski.

---

## 7. Yapılacak sıra

```
Hook spec (beforeSwap: stale → static, else direction → asymmetric)
→ bağımsız audit
→ Uniswap v4 hook flags + salt (adres miner)
→ MEOWTON ERC-20
→ AAPL/MEOWTON pool (PoolManager, kilit politikası)
→ Basket (fee sink, AAPL)
→ site.ts: TOKEN_CA, HOOK_CA, POOL_CA, BASKET_CA
→ X handle + domain
```

Sahte CA basılmaz. Harvest/basket bakiyesi adres gerçek olana kadar dry.

---

## 8. Açık kapılar

- X hesabı
- Domain (meowton.xyz taslak)
- GitHub org
- Hook audit bütçesi
- LP miktarı ve kilit süresi (kalıcı mı, floor mı)
- `fall` karşılaştırmasını last-print’ten prior-close’a çekmek
- Tatil takvimi: v1’de gerekmez (stale kapısı yeterli); prior-close’a geçilirse gerekir

Rakip hook listesi haftalık taranır. Oracle-yön kopyası çıkarsa “ilk” düşer.
