import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalFoot } from "@/components/legal-foot";
import { HOLD, SITE, xUrl } from "@/lib/site";

export const Route = createFileRoute("/article")({
  component: ArticlePage,
  head: () => ({
    meta: [
      { title: "He required an apple. — MEOWTON" },
      {
        name: "description",
        content:
          "How $MEOWTON is paired with tokenized $AAPL. Pair, vault, burn. Unaudited. Not a payout.",
      },
    ],
  }),
});

function ArticlePage() {
  return (
    <article className="paper paper-note">
      <figure className="note-cover-wrap">
        <img
          className="note-cover"
          src="/x/article-cover.jpg"
          width={2160}
          height={864}
          alt="A voxel cat in a Newton coat sits in an orchard. A red apple hangs above its head."
        />
      </figure>
      <div className="note-inner">
        <p className="paper-kicker">A note from @{SITE.xHandle}</p>
        <h1 className="paper-title">{SITE.tagline}</h1>
        <p className="note-dek">
          {SITE.pair}. Pair, vault, burn. {SITE.community} {SITE.chartLine}
        </p>

        <div className="paper-body note-body">
          <p>Gravity was a rumor until something hit him.</p>
          <p>
            The orchard keeps that joke. The book underneath it is not a joke:{" "}
            {SITE.ticker} is quoted in tokenized $AAPL — Apple as the other
            side of the pair, not a sticker on a dollar pool.
          </p>
          <p>This is the system. Three live moves. Then the pad. Then what a buyer actually holds.</p>

          <h2>01 · Pair</h2>
          <p>
            A normal memecoin prices against ETH or a stablecoin. {SITE.ticker}{" "}
            does not. Every trade is the cat against Robinhood’s $AAPL stock
            token, on {SITE.chainName}. When the print moves, the book is
            Apple. {SITE.chartLine}
          </p>
          <p>
            That does not make the token a share. It does not pay a dividend. It
            does not vote. It means the deepest market is $MEOWTON / $AAPL — one
            pair, on chain, not a fan-art token sitting in a USD pool with an
            apple in the logo.
          </p>

          <h2>02 · Vault</h2>
          <p>
            Create is on {SITE.pad.name}, community mode on. A cut of trading
            fees can settle into a vault that holds AAPL. We call it Newton’s
            basket. Volume compounds it. The vault only fills if people
            actually trade. It is not a coupon. It is not an airdrop. Holders,
            not the creator, point what sits there.
          </p>
          <p>{HOLD.thesis}</p>

          <h2>03 · Burn</h2>
          <p>
            Meme-side fees on {SITE.pad.name} can burn or lock {SITE.ticker}.
            Supply tightens only if their splitter actually burns. We do not
            take a creator bag at create. The whole {SITE.listing.supply}{" "}
            supply is meant to go in the AAPL pool.
          </p>
          <p>
            Pair fills the book. Vault can fill with stock. Burn, if the pad
            splits it, tightens the cat. That is the machine.
          </p>

          <h2>The pad</h2>
          <p>
            Do not deploy a homemade ERC-20 first. {SITE.pad.name}’s Airlock
            emits the token, the AAPL pool, and the vault in the create
            transaction. A different contract is a different product. Their
            protocol keeps a cut. Their{" "}
            <a
              className="ext-link"
              href={SITE.pad.terms}
              target="_blank"
              rel="noreferrer"
            >
              terms
            </a>{" "}
            bind the trade. Stock tokens are not offered to US persons. 18+.
            Self-custody. The app is not the protocol.
          </p>
          <p>
            Token CA is live on{" "}
            <Link to="/basket" className="ext-link">
              /basket
            </Link>
            . Pool and vault stay pending until those receipts exist. The
            header says Trade.
          </p>

          <h2>Weather, not the fee</h2>
          <p>
            The orchard still reads Chainlink {SITE.feedName} so you can see
            the print — asleep, fall, rise. That chip is weather. It is not
            the swap fee you pay on {SITE.pad.name}. A later directional hook
            is a story until it is mined. Uniswap v4 bakes the hook into the
            pool. Launching on {SITE.pad.name} means their hook, their fee.
          </p>

          <h2>If you buy</h2>
          <ul className="note-get">
            {HOLD.get.map((row) => (
              <li key={row.t}>
                <strong>{row.t}.</strong> {row.d}
              </li>
            ))}
          </ul>
          <ul className="hold-not">
            {HOLD.not.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <h2>Not the first cat</h2>
          <p>
            {SITE.field} The name is a spoken joke — meow-ton / new-ton — not a
            typo of Newton. The bet is the pair and the basket, not a claim of
            being first on Apple.
          </p>

          <p className="note-close">
            He required an apple. Gravity was a rumor. The orchard is open.
          </p>

          <p className="fine">
            Short version on{" "}
            <Link to="/how" className="ext-link">
              /how
            </Link>
            . Print on{" "}
            <Link to="/fall" className="ext-link">
              /fall
            </Link>
            . X:{" "}
            <a className="ext-link" href={xUrl()} target="_blank" rel="noreferrer">
              @{SITE.xHandle}
            </a>
            . Trading, when it exists, on {SITE.pad.name}. Unaudited. Not a
            payout. Not affiliated with Apple, Robinhood, or Long Inc.
          </p>
          <LegalFoot />
        </div>
      </div>
    </article>
  );
}
