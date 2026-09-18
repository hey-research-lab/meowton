import { useEffect } from "react";
import { COATS, readStoredCoat } from "@/lib/cats";
import { useNewton } from "@/lib/newton";

export function CatPicker() {
  const coat = useNewton((s) => s.coat);
  const setCoat = useNewton((s) => s.setCoat);

  useEffect(() => {
    const stored = readStoredCoat();
    if (stored !== useNewton.getState().coat) setCoat(stored);
  }, [setCoat]);

  return (
    <div className="coat-row" role="group" aria-label="Cat coat">
      <span className="coat-label">Coat</span>
      {COATS.map((item) => (
        <button
          key={item.id}
          type="button"
          className="coat-swatch"
          aria-label={item.label}
          aria-pressed={coat === item.id}
          title={item.label}
          style={{ background: item.swatch }}
          onClick={() => setCoat(item.id)}
        />
      ))}
    </div>
  );
}
