import { useEffect } from "react";
import { JACKETS, readStoredJacket } from "@/lib/jackets";
import { useNewton } from "@/lib/newton";

export function CatPicker() {
  const jacket = useNewton((s) => s.jacket);
  const setJacket = useNewton((s) => s.setJacket);

  useEffect(() => {
    const stored = readStoredJacket();
    if (stored !== useNewton.getState().jacket) setJacket(stored);
  }, [setJacket]);

  return (
    <div className="coat-row" role="group" aria-label="Jacket color">
      {JACKETS.map((item) => (
        <button
          key={item.id}
          type="button"
          className="coat-swatch"
          aria-label={item.label}
          aria-pressed={jacket === item.id}
          title={item.label}
          style={{ background: item.swatch }}
          onClick={() => setJacket(item.id)}
        />
      ))}
    </div>
  );
}
