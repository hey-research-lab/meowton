import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalFoot } from "@/components/legal-foot";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms — MEOWTON" },
      {
        name: "description",
        content:
          "Terms for the MEOWTON website. Entertainment. Unaudited. Not a payout.",
      },
    ],
  }),
});

function TermsPage() {
  return (
    <article className="paper paper-legal">
      <p className="paper-kicker">Effective 17 September 2026</p>
      <h1 className="paper-title">Terms of use.</h1>
      <div className="paper-body">
        <p>
          These terms cover this website — the orchard, the copy, the live
          AAPL print. They do not cover the {SITE.pad.name} app. If you
          create, trade, or claim fees through {SITE.pad.name},{" "}
          {SITE.pad.operator}’s{" "}
          <a
            className="ext-link"
            href={SITE.pad.terms}
            target="_blank"
            rel="noreferrer"
          >
            Terms of Use
          </a>{" "}
          (effective {SITE.pad.termsEffective}) govern that interface. The App
          and the Protocol are distinct. Removing an asset from the App does
          not remove it from the chain.
        </p>

        <section className="legal-block">
          <h2>1. What this is</h2>
          <p>
            {SITE.name} is a meme coin for entertainment, humour, parody,
            satire, and internet culture. The joke is Newton and a cat. The
            pair is tokenized $AAPL on {SITE.chainName}. Names, tickers,
            images, and orchard copy may be fictional or irreverent. They do
            not establish affiliation, endorsement, or ownership.
          </p>
          <p>
            The token may become worthless. Do not buy it on an expectation of
            profit, price appreciation, guaranteed liquidity, or future work
            by us, {SITE.pad.operator}, Apple, or Robinhood. Words like
            “moon” or “100x” — if they ever appear in community chat — are
            jokes, not a guarantee. Unaudited. Not a payout. Not an airdrop.
          </p>
        </section>

        <section className="legal-block">
          <h2>2. Who we are not</h2>
          <p>
            This project is not Apple Inc., Robinhood Markets, Inc., Robinhood
            Assets (Jersey) Limited, {SITE.pad.operator}, Uniswap Labs, or the
            estate of Isaac Newton. Names, tickers, and orchard pictures do not
            imply affiliation, sponsorship, or endorsement.
          </p>
          <p>
            Tokenized $AAPL is a Stock Token issued by Robinhood Assets
            (Jersey) Limited. It can give economic exposure. It is not
            ownership of Apple shares. Issuer documents:{" "}
            <a
              className="ext-link"
              href="https://docs.robinhood.com/rhj"
              target="_blank"
              rel="noreferrer"
            >
              docs.robinhood.com/rhj
            </a>
            . {SITE.pad.operator}’s terms state Stock Tokens are not
            registered under US securities laws and may not be offered, sold,
            or delivered, directly or indirectly, in the United States or to
            or for the account or benefit of US persons.
          </p>
        </section>

        <section className="legal-block">
          <h2>3. The pad and the hook</h2>
          <p>
            Distribution is intended on {SITE.pad.name} ({SITE.pad.app}),
            anchored to $AAPL. {SITE.pad.name} uses its own pool hook
            (Airlock). That hook is not ours. Directional, oracle-set fees
            described on{" "}
            <Link to="/how" className="ext-link">
              How
            </Link>{" "}
            are proposed for a self-deployed Uniswap v4 pool. They are not live
            on the pad. Do not treat the table as the fee you will pay on{" "}
            {SITE.pad.name}.
          </p>
          <p>
            {SITE.pad.operator} may change protocol fees, fee allocation, claim
            procedures, liquidity structures, routing, and other mechanics.
            Typical create on their launcher puts the whole supply in the
            pool. The creator receives no tokens at launch. Community mode, if
            switched on, routes a portion of fees toward a vault that can hold
            AAPL. That vault is the pad’s, not a promise of income.
          </p>
        </section>

        <section className="legal-block">
          <h2>4. Eligibility</h2>
          <p>
            You must be 18 or older and allowed by the laws that apply to you.
            Stock Tokens and meme coins are restricted in some places,
            including for US persons. This site does not check your
            jurisdiction. {SITE.pad.name} may. You are responsible for staying
            on the lawful side of that line.
          </p>
        </section>

        <section className="legal-block">
          <h2>5. Self-custody</h2>
          <p>
            This website does not hold keys, take deposits, or execute swaps.
            If you connect a wallet to {SITE.pad.name} or any other venue, you
            authorise the transaction. Onchain actions are typically
            irreversible. Review the token address, permissions, network, and
            amounts before you sign.
          </p>
        </section>

        <section className="legal-block">
          <h2>6. Data on the orchard</h2>
          <p>
            The HUD reads a public Chainlink feed ({SITE.feedName}). Prices,
            age, and the asleep / fall / rise chip can be late, wrong, or
            frozen when the equity session is closed. They are not a quote,
            not advice, and not the pad’s execution price.
          </p>
        </section>

        <section className="legal-block">
          <h2>7. Content</h2>
          <p>
            The listing name, ticker, image, and description on{" "}
            {SITE.pad.name} are submitted by the creator. The creator must
            have the rights to use them. Submitting that card to{" "}
            {SITE.pad.name} grants {SITE.pad.operator} the licence described
            in their terms — to host, display, and technically adapt the
            listing so it can appear in the App.
          </p>
        </section>

        <section className="legal-block">
          <h2>8. No advice</h2>
          <p>
            Nothing on this site is investment, legal, or tax advice. You are
            responsible for your own taxes and for the risk of loss, including
            total loss. Past prints, orchard animation, and proposed fees are
            not a performance record.
          </p>
        </section>

        <section className="legal-block">
          <h2>9. As-is</h2>
          <p>
            The site and any related contracts are provided as-is. No warranty
            of merchantability, fitness, or non-infringement. To the extent
            the law allows, liability for this website is limited to US$0 —
            you paid nothing to read it.
          </p>
          <p>
            Trading through {SITE.pad.name} is under {SITE.pad.operator}’s
            terms, governed by the laws of the State of Delaware, United
            States, except where mandatory protections apply. Their address:{" "}
            {SITE.pad.address}.
          </p>
        </section>

        <section className="legal-block">
          <h2>10. Changes</h2>
          <p>
            These terms can change when the copy on this page changes. Trading
            terms for {SITE.pad.name} change when {SITE.pad.operator} updates{" "}
            <a
              className="ext-link"
              href={SITE.pad.terms}
              target="_blank"
              rel="noreferrer"
            >
              app.long.xyz/terms
            </a>
            . Privacy for this site:{" "}
            <Link to="/privacy" className="ext-link">
              Privacy
            </Link>
            .
          </p>
        </section>

        <p className="fine">{SITE.field}</p>
        <LegalFoot />
      </div>
    </article>
  );
}
