import { useState } from "react";

export function CopyText({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [done, setDone] = useState(false);

  return (
    <div className="copy-row">
      <div className="copy-meta">
        <span className="copy-label">{label}</span>
        <span className={mono ? "copy-value" : "copy-value copy-value-plain"}>
          {value}
        </span>
      </div>
      <button
        type="button"
        className="copy-btn"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setDone(true);
            window.setTimeout(() => setDone(false), 1600);
          } catch {
            setDone(false);
          }
        }}
      >
        {done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
