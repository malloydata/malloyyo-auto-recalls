// Manufacturer Recall Profile — pick a manufacturer, see its recall history.
// Renders the model's `manufacturer_dashboard` query, driven by the MANUFACTURER
// given. All the charts/tables come from Malloy's renderer inside <Panel>.

export default function Dashboard({ manifest, givens, setGiven, Panel }) {
  const spec = manifest.givens.find((g) => g.name === "MANUFACTURER");
  const options: string[] = spec?.options ?? [];
  const current: string = givens.MANUFACTURER ?? spec?.default ?? options[0];

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
            onChange={(e) => setGiven("MANUFACTURER", e.target.value)}
          >
            {options.map((o) => (
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

const styles: Record<string, React.CSSProperties> = {
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
