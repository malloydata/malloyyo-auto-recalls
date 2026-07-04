// Vehicle Recall Search — type a model / keyword and see every matching recall.
// Drives the model's `vehicle_search_dashboard` query via the SEARCH given.
// The text box is debounced so we don't re-run the query on every keystroke.
import { useState, useEffect } from "react";

const SUGGESTIONS = ["Tundra", "Bolt", "F-150", "Takata", "airbag", "Silverado"];

export default function Dashboard({ manifest, givens, setGiven, Panel }) {
  const spec = manifest.givens.find((g) => g.name === "SEARCH");
  const committed: string = givens.SEARCH ?? spec?.default ?? "";

  // Local input state; commit to the given (which re-runs the query) on a delay.
  const [text, setText] = useState(committed);
  useEffect(() => {
    const id = setTimeout(() => {
      const next = text.trim();
      if (next && next !== committed) setGiven("SEARCH", next);
    }, 450);
    return () => clearTimeout(id);
  }, [text]);

  const commitNow = () => {
    const next = text.trim();
    if (next && next !== committed) setGiven("SEARCH", next);
  };
  const pick = (s: string) => {
    setText(s);
    setGiven("SEARCH", s);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>NHTSA Vehicle Recalls</div>
          <h1 style={styles.title}>Vehicle Recall Search</h1>
        </div>
      </header>

      <div style={styles.searchRow}>
        <input
          style={styles.input}
          value={text}
          placeholder="Search a model or keyword — e.g. Tundra, F-150, airbag"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commitNow()}
          autoFocus
        />
        <button style={styles.button} onClick={commitNow}>
          Search
        </button>
      </div>

      <div style={styles.chips}>
        <span style={styles.chipLabel}>Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => pick(s)}
            style={{
              ...styles.chip,
              ...(s === committed ? styles.chipActive : null),
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <p style={styles.subhead}>
        Matches recalls whose subject or description contains{" "}
        <strong>“{committed}”</strong> (case-insensitive), across every
        manufacturer.
      </p>

      <div style={styles.panel}>
        <Panel givens={givens} />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#1a1f2b",
    width: "100%",
    boxSizing: "border-box",
    padding: "28px 32px 48px",
  },
  header: { borderBottom: "1px solid #e6e8ee", paddingBottom: 18 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6b7280",
    fontWeight: 600,
  },
  title: { fontSize: 26, fontWeight: 700, margin: "4px 0 0" },
  searchRow: { display: "flex", gap: 10, margin: "20px 0 12px" },
  input: {
    flex: 1,
    fontSize: 16,
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #cdd2dd",
    outline: "none",
    color: "#1a1f2b",
  },
  button: {
    fontSize: 15,
    fontWeight: 600,
    padding: "0 22px",
    borderRadius: 10,
    border: "none",
    background: "#1a1f2b",
    color: "#fff",
    cursor: "pointer",
  },
  chips: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  chipLabel: { fontSize: 13, color: "#6b7280" },
  chip: {
    fontSize: 13,
    padding: "5px 12px",
    borderRadius: 999,
    border: "1px solid #cdd2dd",
    background: "#fff",
    color: "#374151",
    cursor: "pointer",
  },
  chipActive: { background: "#eef2ff", borderColor: "#6366f1", color: "#3730a3" },
  subhead: { color: "#4b5563", fontSize: 14, margin: "16px 0 20px" },
  panel: {
    background: "#fff",
    border: "1px solid #e6e8ee",
    borderRadius: 12,
    padding: 16,
  },
};
