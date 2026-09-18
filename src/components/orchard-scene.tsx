import { lazy, Suspense, useEffect, useState } from "react";
import { useNewton } from "@/lib/newton";

const OrchardCanvas = lazy(() =>
  import("@/components/orchard-canvas").then((mod) => ({
    default: mod.OrchardCanvas,
  })),
);

export function OrchardScene() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    useNewton.getState().reset(reduced);
    setReady(true);
  }, []);

  return (
    <div className="orchard-stage" aria-hidden="true">
      {ready ? (
        <Suspense fallback={null}>
          <OrchardCanvas />
        </Suspense>
      ) : null}
      <div className="orchard-vignette" />
    </div>
  );
}
