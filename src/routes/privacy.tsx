import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalFoot } from "@/components/legal-foot";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy — MEOWTON" },
      {
        name: "description",
        content:
          "Privacy notice for the MEOWTON website. No accounts. No wallet on this site.",
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <article className="paper paper-legal">
      <p className="paper-kicker">Effective 17 September 2026</p>
      <h1 className="paper-title">Privacy notice.</h1>
      <div className="paper-body">
        <p>
          This notice is for the {SITE.name} website. It is not{" "}
          {SITE.pad.operator}’s notice. If you use {SITE.pad.name} — connect a
          wallet, launch, or trade — their{" "}
          <a
            className="ext-link"
            href={SITE.pad.privacy}
            target="_blank"
            rel="noreferrer"
          >
            Privacy Notice
          </a>{" "}
          (effective {SITE.pad.termsEffective}) applies to that app, including
          Privy, PostHog, and Sentry. Their contact: {SITE.pad.contact}.
        </p>

        <section className="legal-block">
          <h2>1. No account here</h2>
          <p>
            This site has no sign-in, no embedded wallet, and no profile. We
            do not ask for a name, email, or seed. We do not hold private
            keys. We do not use Privy.
          </p>
        </section>

        <section className="legal-block">
          <h2>2. What the orchard reads</h2>
          <p>
            A server function calls {SITE.chainName} RPC to read the public
            Chainlink aggregator at {SITE.aaplFeed} ({SITE.feedName}). That
            call returns onchain numbers: price, round, timestamp. It is not
            tied to you.
          </p>
          <p>
            The falling apples and the cat are drawn in your browser. Catch
            counts stay in that tab. They are not sent to us.
          </p>
        </section>

        <section className="legal-block">
          <h2>3. Logs we do not control</h2>
          <p>
            The host and any CDN in front of this site may keep ordinary
            request logs: IP address, user agent, path, time. We do not use
            those logs for advertising. We do not sell them. We do not run
            third-party ad cookies. We do not run PostHog or Sentry on this
            orchard.
          </p>
        </section>

        <section className="legal-block">
          <h2>4. Onchain is public</h2>
          <p>
            If you later trade {SITE.ticker} or $AAPL, that activity lives on{" "}
            {SITE.chainName}. Anyone can read it. {SITE.pad.name} may associate
            a wallet with analytics once you connect there — wallet address,
            Privy identifier, and, depending on login, an X handle or email.
            That is their processing, described at{" "}
            <a
              className="ext-link"
              href={SITE.pad.privacy}
              target="_blank"
              rel="noreferrer"
            >
              app.long.xyz/privacy
            </a>
            . Disconnecting there ends new association; the chain does not
            forget.
          </p>
        </section>

        <section className="legal-block">
          <h2>5. Cookies</h2>
          <p>
            This site does not set an analytics cookie. Your browser may store
            ordinary session data for the page. Blocking storage will not stop
            you from reading the orchard; it may reset the tap hint.
          </p>
        </section>

        <section className="legal-block">
          <h2>6. Listing content</h2>
          <p>
            The name, ticker, image, and description pasted into{" "}
            {SITE.pad.name} become public by design. They can appear in the
            App and on the chain. We cannot edit or hide an onchain record.
          </p>
        </section>

        <section className="legal-block">
          <h2>7. Changes</h2>
          <p>
            The notice is the text on this page. Terms for the website:{" "}
            <Link to="/terms" className="ext-link">
              Terms
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
