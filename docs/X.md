# X kit — MEOWTON

18 Eylül 2026. CA yok. Airdrop yok. Moon dili yok.

Dosyalar `public/x/`.

| Parça | Dosya | Ölçü |
| --- | --- | --- |
| Profil | [`logo.png`](../public/x/logo.png) | 800×800 |
| Banner | [`banner.jpg`](../public/x/banner.jpg) | 1500×500 |
| Cover | [`cover.jpg`](../public/x/cover.jpg) | 1500×600 |
| Post 1 | [`first-post.jpg`](../public/x/first-post.jpg) | 1600×1067 (3:2) |
| Article cover | [`article-cover-1500.jpg`](../public/x/article-cover-1500.jpg) | 1500×600 (5:2) |
| OG | [`og.jpg`](../public/og.jpg) | 1200×630 |

---

## Profil

**Display name:** `MEOWTON`

**Handle:** [@MeowtonLOL](https://x.com/MeowtonLOL)

**Location:** `Robinhood Chain`

**Website:** `https://meowton.lol`

**Bio (paste):**

```
He required an apple. Gravity was a rumor.
$MEOWTON × $AAPL · Robinhood Chain
Unaudited. Not a payout.
meowton.lol
```

---

## Sıra

1. **Post 1** — pin. Mit. Adres yok.
2. **Article** — 5:2 cover. Sistem.
3. **Post 2** — Article’ı quote’la. Cümleler Post 1 ile aynı değil.
4. **Post 3** — CA + Trade. Aşağıdaki şablon. Pin durur.

Aynı cümleyi iki yerde kullanma.

---

## Post 1 (pin)

Görsel: `public/x/first-post.jpg` (3:2)

Newton oturdu. Elma düştü. Pair / vault / burn bu postta yok.

```
Newton sat still. The apple did not.

We kept the tree.

$MEOWTON is a cat on Robinhood Chain.
The quote is tokenized Apple — not a stable pool wearing a logo.

He required an apple.
Unaudited. Not a payout.

meowton.lol
```

---

## Article (X longform)

Kapak **5:2**. [`article-cover-1500.jpg`](../public/x/article-cover-1500.jpg) (1500×600). Master: [`article-cover.jpg`](../public/x/article-cover.jpg) (2160×864).

X → Premium → Articles → New article → cover 1500×600.

Title / subtitle / body: [`ARTICLE.md`](ARTICLE.md).

Canlı: https://meowton.lol/article

**Title**

```
He required an apple.
```

**Subtitle**

```
$MEOWTON is paired with tokenized $AAPL. Pair, vault, burn.
```

Body: ARTICLE.md içindeki “Body (paste below the cover)” bloğu. CA yokken de çıkar. Adres icat etme.

---

## Post 2 (quote the Article)

Görsel yok. Compose → Article’ı quote. Pin durur. Bu cümleler Post 1’de yok.

```
A sticker is not a market.

$MEOWTON trades against $AAPL.
Volume can park stock in a community vault.
Meme-side fees can burn — if the pad actually splits them.
The creator does not take a bag at create.

The orchard is weather.
The rails are the watch.

Read the note, then sit with the print.

meowton.lol/article
```

---

## Post 3 (CA — gelince yapıştır)

Pin durur. Post 1/2 cümlelerini tekrarlama.

**Önce:** token adresi **`1e18` ile bitmeli**. Bitmiyorsa tweet yok — LONG’da yeniden create. Adres uydurma.

`PASTE_CA` → receipt’teki token. İki yerde aynı string.

```
The receipt is in.

$MEOWTON × $AAPL on Robinhood Chain.

CA
PASTE_CA

Trade
https://app.long.xyz/tokens/PASTE_CA

Watch the rails. Unaudited. Not a payout.
meowton.lol
```

Aynı dakika sitede: `src/lib/site.ts` → `tokenCa` / `poolCa` / `basketCa`. HUD’da Trade yanar.

---

## Yedek (görselsiz, 280 altı)

```
Newton sat still. The apple did not.
$MEOWTON · Robinhood Chain
meowton.lol
```
