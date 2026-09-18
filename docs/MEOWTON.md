# MEOWTON

**He required an apple.**  
*Gravity was a rumor.*

AAPL-eşli memecoin · Robinhood Chain `4663` · pad: **LONG** (`app.long.xyz`).

Canlı: [meowton.lol](https://meowton.lol) · [www.meowton.lol](https://www.meowton.lol) · repo `hoodseekxyz/meowton`.

18 Eylül 2026. Token / pool / basket CA yok. Sahte adres yok.

---

## 1. Ne olduğu, ne olmadığı

Isaac Newton + meow. Düşen elma = tokenize **$AAPL**. Kedi, yerçekimini ancak kafasına elma düşünce bulur.

Üç eksen:

| Eksen | Durum |
| --- | --- |
| Kedi + AAPL teması | **İlk değil.** Apple Cat (`$AAPLCAT`), iCat, “AAPL CAT” canlı. LONG’ta `$MEOW` AMD pair’i var — **MEOWTON değil.** |
| Newton / yerçekimi / düşen elma | İsim ve tema boş görünüyor. Kolay kopyalanır. “İlk” buna dayanmaz. |
| Harici hisse oracle yönüne bağlı asimetrik fee | **Savunulan ilk.** Canlı öncül bulunamadı. LONG Airlock bunu taşımaz. |

Saha cümlesi:

> Not the first cat on AAPL. Live: AAPL pair and a community vault. The directional hook is later. Unaudited. Not a payout.

### Alınca ne olur (canlı, pad)

Token almak **Apple hissesi almak değildir.** Kar payı, kupon, otomatik AAPL airdrop yok.

| Olur | Olmaz |
| --- | --- |
| Quote = tokenize $AAPL | Apple equity / temettü |
| 1B’nin tamamı havuzda, create’te creator bag 0 | Bize özel tahsis |
| Community vault fee’den AAPL biriktirebilir | Cüzdana otomatik ödeme |
| Holder’lar vault’u LONG araçlarıyla yönlendirir | Vaadedilmiş APY |
| Meme-tarafı fee burn’ü pad splitter’ına bağlı | Fall/rise tablo — unmined |

Fiyat sıfıra gidebilir. LONG terms imzada bağlar.

Market-hours kapısı (StonkHook V3/V4) **kopyalanmaz.** MEOWTON saate bakmaz, AAPL’ın son oracle print’ine göre **yöne** bakar. Bu tablo LONG pad fee’si değildir.

Ticker **MEOWTON** — MEWTON değil. Şaka konuşulur: *meow-ton* / *new-ton*.

---

## 2. Mekanik (önerilen, pad’in değil)

Hook, her swap’ta Chainlink `RHAAPL / USD` okur. **Önerilen, unmined.** LONG pool’unda çalışmaz.

1. `updatedAt` **15 dakikadan** eskiyse → feed **asleep**. Asimetri kapalı. Statik fee.
2. Print taze ve AAPL **son print’e göre düşüyorsa** → alım ucuz, satım pahalı.
3. Print taze ve AAPL **yükseliyor veya yataysa** → simetrik walk fee.

Fee’ler quote asset’te (AAPL). Biriken ücret **Newton’s basket**’te AAPL olarak durur. Merkle yok, keeper yok, airdrop dili yok, çağırana ödeme yok.

| Mod | Koşul | Buy | Sell |
| --- | --- | --- | --- |
| `sleep` | Feed > 15 dk eski / yön yok | 1.00% | 1.00% |
| `fall` | AAPL son print’e göre ↓ | 0.05% | 2.50% |
| `rise` | AAPL son print’e göre ↑ veya düz | 0.30% | 0.30% |

Kod: [`src/lib/site.ts`](../src/lib/site.ts) `FEES`. Canlı okuma: [`src/lib/aapl.ts`](../src/lib/aapl.ts). HUD chip = sitemizin okuması, LONG execution fee değil.

### Neden saat değil, yön

StonkHookV3 / V4 NYSE seansına kilitliyor. EasyA, PAIR, PumpV4StockHook sabit hisse-bacağı fee. Hepsi **zaman** veya **sabit bps**.

### Kırılganlıklar (bilinçli)

- Chainlink hisse feed’leri **24/5**. Gece / hafta sonu / tatil: son fiyatta donar. DEX 24/7. Stale → statik.
- `oraclePaused()` feed’i dondurur.
- Feed yazımı ile swap arası gecikme: arbitraj. Stale kapısı sınırlar, yok etmez.
- Yön v1’de **son oracle round**. “Vs prior close” sonra.

---

## 3. Zincir ve adresler

| Rol | Adres | Not |
| --- | --- | --- |
| Chain | `4663` | Robinhood Chain, ETH gas |
| RPC | `https://rpc.mainnet.chain.robinhood.com` | Batch yok |
| Explorer | [robinhoodchain.blockscout.com](https://robinhoodchain.blockscout.com) | |
| AAPL token | `0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9` | On-chain `symbol()` = AAPL |
| AAPL feed | `0x6B22A786bAa607d76728168703a39Ea9C99f2cD0` | `RHAAPL / USD`, 8 decimals, Total Return |
| v4 PoolManager | `0x8366a39CC670B4001A1121B8F6A443A643e40951` | Hood docs |
| Pad | [app.long.xyz](https://app.long.xyz) | Long Inc. Airlock hook. PoolKey onların. |
| LongLauncher | `0x22e99278308b393ea1260859b181ad7e78f5eeed` | Factory |
| Airlock | `0xeb7c034704ef8dcd2d32324c1545f62fb4ad0862` | Doppler Airlock |
| Pad hook | `0x4e3468951d49f2eea976ed0d6e75ffcb44a9a544` | DopplerHookInitializer |
| **MEOWTON token** | — | pending |
| **Hook (ours)** | — | unmined |
| **Pool** | — | pending |
| **Basket** | — | LONG community vault, pending |

Feed: `description()` = `Robinhood AAPL / USD`. NYSE kapalıyken age > 15 dk → HUD **ASLEEP**.

---

## 4. Launch kararı

Uniswap v4’te hook adresi `PoolKey` içinde. **Sonradan takılmaz.**

**Karar — dağıtım: LONG.** Create `app.long.xyz`, quote AAPL, community mode **ON**.

Bu, yön-fee iddiasını bu pool’da öldürür. Site yalan söylemez:

- Orchard + canlı print durur (marka).
- Fee tablosu “proposed, not the pad’s”.
- Basket = LONG community vault (AAPL sink).
- Create gerçeği: arzın tamamı havuza gider, creator token almaz. LONG protokol kesintisi (tipik ~%5) onların.
- Trade URL: `https://app.long.xyz/tokens/{CA}` — CA gelince `site.ts`.

İkinci pool (kendi hook) sonradan açılırsa likidite parçalanır. Ayrı karar.

---

## 5. LONG listing kartı

Ticker **harf only**. `$MEOW` AMD pair’i LONG’ta var — **MEOWTON ayrı**.

| Alan | Değer |
| --- | --- |
| Name | `MEOWTON` |
| Ticker | `MEOWTON` |
| Quote | AAPL `0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9` |
| Supply | pad default, typically `1,000,000,000` |
| Community mode | **ON** |
| Image | `public/x/logo.png` (800×800) |
| Website | https://meowton.lol |
| X | pending |
| Description | He required an apple. $MEOWTON is paired with tokenized $AAPL on Robinhood Chain. Not the first cat on AAPL. Unaudited. Not a payout. Not affiliated with Apple, Robinhood, or Long Inc. |

Yasal:

- Token ticareti: [app.long.xyz/terms](https://app.long.xyz/terms) (effective **8 September 2026**) · [privacy](https://app.long.xyz/privacy)
- Operator: Long Inc., 1013 Centre Road, Suite 403-B, Wilmington, DE 19805. Delaware. `info@long.xyz` (onların).
- Meme: entertainment / humour / parody / satire. Moon / 100x garanti değil.
- Stock Tokens: US persons’a sunulmaz (LONG terms).
- 18+. Self-custody. App ≠ Protocol.
- Bu site: `/terms` · `/privacy` — orchard; hesap yok; cüzdan yok; analytics yok.

---

## 6. Site (shipped)

Tam ekran **voxel orchard**. Minecraft-tarzı merged mesh, kedi, asılı ve düşen elmalar.

Chrome, `$AI` ritminde: üstte HUD bar, altta slogan footer — aynı parchment kapsül.

| Parça | Ne |
| --- | --- |
| Header | `$MEOWTON × $AAPL` · canlı AAPL print · ASLEEP/FALL/RISE · proposed bps · CA pending · How / Fall / Basket / X |
| Coat | [Minecraft wiki](https://minecraft.wiki/w/Cat) 11 tüy: Tabby, Red, Calico, British, Black, Jellie, Persian, Siamese, White, Ragdoll, Tuxedo. localStorage. White/Calico odd-eye. |
| Orchard | Three.js r186, greedy-olmayan face-culled voxel, InstancedMesh elmalar. Newton FSM: ignorant → falling → bonk → awake. Tap/space = leap. |
| Footer | `He required an apple.` · *Gravity was a rumor.* · sahne hint · Terms · Privacy · LONG · LONG terms |

| Route | İçerik |
| --- | --- |
| `/` | Bahçe. Slogan footer’da. Ortadaki kart yok — kedi kadrajın sahibi. |
| `/how` | Pair / Pad / Basket + önerilen fee tablosu (not the pad’s) |
| `/fall` | Canlı oracle: fiyat, vs last print, age |
| `/basket` | LONG create kartı (copy) + pending CA + pad kontratları |
| `/terms` | Site terms; LONG terms pointer |
| `/privacy` | Site privacy; LONG privacy pointer |

Palette: ink `#1c1410` · parchment `#f4ead8` · apple `#c41e3a` · leaf `#3d6b3a` · gold `#c4a35a`  
Type: Fraunces + IBM Plex Mono.

Kod: [`src/components/orchard-scene.tsx`](../src/components/orchard-scene.tsx) · [`src/lib/voxel-world.ts`](../src/lib/voxel-world.ts) · [`src/lib/cats.ts`](../src/lib/cats.ts) · [`src/lib/newton.ts`](../src/lib/newton.ts)

### Görseller

| Dosya | Kullanım |
| --- | --- |
| `public/x/logo.png` | 800×800 — X profil + LONG image |
| `public/x/banner.jpg` | 1500×500 — X header |
| `public/x/cover.jpg` | 1500×600 |
| `public/x/first-post.jpg` | 1600×900 — ilk post |
| `public/og.jpg` | 1200×630 |
| `public/favicon.svg` | Elma + kedi kulağı |

Sahne prosedürel voxel. Sprite tabakası kullanılmıyor.

X kit: [`docs/X.md`](X.md)

---

## 7. Likidite ve regülasyon

Tipik AAPL-meme havuzu sığ. Kilitli LP = çıkış beklentisini baştan bırak.

Vlad Tenev hisse-eşli meme’i tolere ediyor. SEC tokenize hisse yapılarını inceliyor. Tema/mekanikten bağımsız arka plan riski.

LONG terms: meme coins entertainment; Stock Tokens not for every jurisdiction.

---

## 8. Yapılacak sıra

```
LONG create (AAPL quote, community mode ON, listing card)
→ CA + vault + pool → site.ts tokenCa / basketCa / poolCa
→ HUD Trade → app.long.xyz/tokens/{CA}
→ X handle
→ DNS: meowton.lol apex → Vercel (www alias canlı)
→ (ayrı karar) hook spec → audit → self-deployed v4 pool
```

Sahte CA basılmaz. Basket bakiyesi adres gerçek olana kadar dry.

---

## 9. Stack

TanStack Start (Vite + React) · Three.js · Zustand · TanStack Query · Vercel.

GitHub: `https://github.com/hoodseekxyz/meowton` (private).  
Vercel team: `meowtonxyz` · project `meowton`.
