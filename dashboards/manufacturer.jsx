// Manufacturer Recall Profile — pick a manufacturer, see its recall history.
// The `# artifact` tag on the model's `manufacturer_dashboard` query declares
// this dashboard (including its Ford starting value); $MANUFACTURER's
// declaration carries the # suggest tag that fills the dropdown (top
// manufacturers by recall count). All the charts/tables come from Malloy's
// renderer inside <Panel>.
import React from "react";
import { Panel, filters, useGiven, useOptions } from "@malloyyo/dashboard";

export default function Dashboard({ givens }) {
  const manufacturer = useGiven("MANUFACTURER");
  const { options, loading } = useOptions("MANUFACTURER");
  // The given holds a filter EXPRESSION; option values are raw column values,
  // so escape on commit ('Tesla, Inc.' would otherwise parse as alternatives)
  // and unwrap for display.
  const current = filters.values(manufacturer.value ?? "")?.[0] ?? "";

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>NHTSA Vehicle Recalls</div>
          <h1 style={styles.title}>Manufacturer Recall Profile</h1>
        </div>
        <label style={styles.control}>
          <span style={styles.controlLabel}>Manufacturer</span>
          <select
            style={styles.select}
            value={current}
            onChange={(e) => manufacturer.set(filters.oneOf(e.target.value))}
          >
            {(loading ? [current] : options).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      </header>

      <p style={styles.subhead}>
        Recall counts, affected-vehicle totals, trend over time, and the most
        recent recalls for <strong>{current}</strong>.
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
  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap",
    borderBottom: "1px solid #e6e8ee",
    paddingBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6b7280",
    fontWeight: 600,
  },
  title: { fontSize: 26, fontWeight: 700, margin: "4px 0 0" },
  control: { display: "flex", flexDirection: "column", gap: 6, minWidth: 300 },
  controlLabel: {
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
  subhead: { color: "#4b5563", fontSize: 14, margin: "16px 0 20px" },
  panel: {
    background: "#fff",
    border: "1px solid #e6e8ee",
    borderRadius: 12,
    padding: 16,
  },
};
