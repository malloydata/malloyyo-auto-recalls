// Recall List — a filterable flat list of NHTSA recalls.
// Filters: manufacturer, component, free-text subject/description search, and
// two advisory checkboxes. Every given is optional — an empty filter
// expression means "all" (the model applies them with `~`, so no sentinel
// logic lives here). Dropdown options come from the givens' structured
// suggest tags; the search box commits a contains-filter built with `filters`.
import React, { useState, useEffect } from "react";
import { Panel, Checkbox, filters, useGiven, useOptions } from "@malloyyo/dashboard";

const ALL = ""; // empty filter expression = no filter

// The human term inside a contains-filter: '%fuel pump%' -> 'fuel pump'.
const termOf = (src) => (src ?? "").replace(/^%|%$/g, "").replace(/\\(.)/g, "$1");

function FilterSelect({ given, allLabel }) {
  const g = useGiven(given);
  const { options } = useOptions(given);
  // The given holds a filter EXPRESSION: '' = all, otherwise the picked column
  // value escaped into an exact match (a raw 'Tesla, Inc.' would parse as two
  // alternatives). Unwrap for the select's value, escape on commit.
  const current = filters.values(g.value ?? ALL)?.[0] ?? ALL;
  return (
    <label style={styles.field}>
      <span style={styles.label}>{g.spec?.tags?.label ?? given}</span>
      <select
        style={styles.select}
        value={current}
        onChange={(e) => g.set(e.target.value === ALL ? ALL : filters.oneOf(e.target.value))}
      >
        <option value={ALL}>{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Dashboard({ givens, setGiven }) {
  const search = useGiven("SEARCH");
  const parkOutside = useGiven("PARK_OUTSIDE");
  const doNotDrive = useGiven("DO_NOT_DRIVE");
  const committedTerm = termOf(search.value ?? "");

  // Debounced free-text search so we don't re-run on every keystroke. An empty
  // box commits the empty filter (= all).
  const [text, setText] = useState(committedTerm);
  useEffect(() => {
    const id = setTimeout(() => {
      const term = text.trim();
      if (term.toLowerCase() !== committedTerm) {
        search.set(term ? filters.contains(term.toLowerCase()) : ALL);
      }
    }, 450);
    return () => clearTimeout(id);
  }, [text]);

  const filtered =
    (givens.MANUFACTURER ?? ALL) !== ALL ||
    (givens.COMPONENT ?? ALL) !== ALL ||
    committedTerm !== "" ||
    !!parkOutside.value ||
    !!doNotDrive.value;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.eyebrow}>NHTSA Vehicle Recalls</div>
        <h1 style={styles.title}>Recall List</h1>
      </header>

      <div style={styles.filters}>
        <FilterSelect given="MANUFACTURER" allLabel="All manufacturers" />
        <FilterSelect given="COMPONENT" allLabel="All components" />

        <label style={{ ...styles.field, flex: 2, minWidth: 240 }}>
          <span style={styles.label}>Search subject / description</span>
          <input
            style={styles.input}
            value={text}
            placeholder="e.g. airbag, Tundra, fuel pump"
            onChange={(e) => setText(e.target.value)}
          />
        </label>
      </div>

      <div style={styles.checkboxRow}>
        <Checkbox given="PARK_OUTSIDE" />
        <Checkbox given="DO_NOT_DRIVE" />
        {filtered && (
          <button
            style={styles.clear}
            onClick={() => {
              setGiven("MANUFACTURER", ALL);
              setGiven("COMPONENT", ALL);
              setGiven("SEARCH", ALL);
              setGiven("PARK_OUTSIDE", false);
              setGiven("DO_NOT_DRIVE", false);
              setText("");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

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
  header: { borderBottom: "1px solid #e6e8ee", paddingBottom: 16 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6b7280",
    fontWeight: 600,
  },
  title: { fontSize: 26, fontWeight: 700, margin: "4px 0 0" },
  filters: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    margin: "20px 0 12px",
  },
  field: { display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 200 },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  select: {
    fontSize: 15,
    padding: "9px 12px",
    borderRadius: 8,
    border: "1px solid #cdd2dd",
    background: "#fff",
    color: "#1a1f2b",
    cursor: "pointer",
  },
  input: {
    fontSize: 15,
    padding: "9px 12px",
    borderRadius: 8,
    border: "1px solid #cdd2dd",
    outline: "none",
    color: "#1a1f2b",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    margin: "6px 0 20px",
  },
  clear: {
    marginLeft: "auto",
    fontSize: 13,
    padding: "6px 14px",
    borderRadius: 8,
    border: "1px solid #cdd2dd",
    background: "#fff",
    color: "#374151",
    cursor: "pointer",
  },
  panel: {
    background: "#fff",
    border: "1px solid #e6e8ee",
    borderRadius: 12,
    padding: 16,
  },
};
