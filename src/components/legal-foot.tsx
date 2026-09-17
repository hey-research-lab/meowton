import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export function LegalFoot({ home = false }: { home?: boolean }) {
  return (
    <p className={home ? "hero-legal" : "legal-foot"}>
      <Link to="/terms" className="legal-link">
        Terms
      </Link>
      <span aria-hidden="true">·</span>
      <Link to="/privacy" className="legal-link">
        Privacy
      </Link>
      <span aria-hidden="true">·</span>
      <a
        className="legal-link"
        href={SITE.pad.app}
        target="_blank"
        rel="noreferrer"
      >
        {SITE.pad.name}
      </a>
      <span aria-hidden="true">·</span>
      <a
        className="legal-link"
        href={SITE.pad.terms}
        target="_blank"
        rel="noreferrer"
      >
        LONG terms
      </a>
    </p>
  );
}
