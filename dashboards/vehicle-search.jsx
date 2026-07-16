// Vehicle Recall Search — type a model / keyword and see every matching recall.
// $SEARCH is a filter<string> matched against the model's lowercase
// subject+description haystack; this component commits a contains-filter
// ('%tundra%') built with the runtime's `filters` helpers, so escaping is
// always correct. The text box is debounced so we don't re-run the query on
// every keystroke.
import React, { useState, useEffect } from "react";
import { Panel, filters, useGiven } from "@malloyyo/dashboard";

const SUGGESTIONS = ["Tundra", "Bolt", "F-150", "Takata", "airbag", "Silverado"];

// The human term inside a contains-filter: '%tundra%' -> 'tundra'.
const termOf = (src) => (src ?? "").replace(/^%|%$/g, "").replace(/\\(.)/g, "$1");

export default function Dashboard({ givens }) {
  const search = useGiven("SEARCH");
  const committed = termOf(search.value ?? "");
  const commitTerm = (term) => {
    const next = term.trim();
    if (next && next.toLowerCase() !== committed) search.set(filters.contains(next.toLowerCase()));
  };

  // Local input state; commit to the given (which re-runs the query) on a delay.
  const [text, setText] = useState(committed);
  useEffect(() => {
    const id = setTimeout(() => commitTerm(text), 450);
    return () => clearTimeout(id);
  }, [text]);

  const pick = (s) => {
    setText(s);
    commitTerm(s);
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
          onKeyDown={(e) => e.key === "Enter" && commitTerm(text)}
          autoFocus
        />
        <button style={styles.button} onClick={() => commitTerm(text)}>
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
              ...(s.toLowerCase() === committed ? styles.chipActive : null),
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

const styles = {
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
