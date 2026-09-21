import React, { useState } from "react";
import { useQuery, useUrlState } from "@malloyyo/dashboard";

// ---------- look & feel ----------
const BG = "#0a1326";
const INK = "#e6edf7";
const MUTED = "rgba(230,237,247,0.6)";
const LINE = "rgba(120,190,255,0.55)";
const EDGE = "rgba(255,255,255,0.09)";
const GLASS = "rgba(255,255,255,0.035)";
const SANS = "Inter, -apple-system, 'Segoe UI', system-ui, sans-serif";
const MONO = "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";

// category -> color + position on the car (viewBox 1000 x 420, car faces right)
const CATS = {
  "Fuel / engine / powertrain": { short: "Engine & powertrain", color: "#ff7a45", x: 845, y: 245 },
  "Suspension & steering": { short: "Suspension & steering", color: "#ffc53d", x: 632, y: 292 },
  "Brakes": { short: "Brakes", color: "#ff4d4f", x: 760, y: 322 },
  "Electrical / electronics / software": { short: "Electrical & software", color: "#00d8ff", x: 700, y: 222 },
  "Tires & wheels": { short: "Tires & wheels", color: "#b37feb", x: 250, y: 322 },
  "Airbags, seat belts & seats": { short: "Airbags, belts & seats", color: "#ff85c0", x: 470, y: 228 },
  "Equipment & accessories": { short: "Equipment & accessories", color: "#a0d911", x: 128, y: 246 },
  "Structure & body": { short: "Structure & body", color: "#4096ff", x: 330, y: 272 },
  "Lighting & visibility": { short: "Lighting & visibility", color: "#f5f5f5", x: 952, y: 262 },
  "Driver assistance (ADAS)": { short: "Driver assistance", color: "#2ee6b6", x: 652, y: 150 },
  "Uncategorized": { short: "Uncategorized", color: "#7d8597", x: null, y: null },
};
const colorOf = (c) => (CATS[c] ? CATS[c].color : "#999");
const shortOf = (c) => (CATS[c] ? CATS[c].short : c);

const fmtBig = (n) =>
  n >= 1e9 ? (n / 1e9).toFixed(1) + "B" : n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(0) + "K" : String(Math.round(n));
const fmtInt = (n) => Math.round(n).toLocaleString();

const METRICS = {
  vehicles: { label: "Vehicles affected", get: (c) => c.vehicles, fmt: fmtBig },
  recalls: { label: "Recall campaigns", get: (c) => c.recalls, fmt: fmtInt },
  dnd: { label: "Do-not-drive advisories", get: (c) => c.dnd, fmt: fmtInt },
};

// ---------- queries ----------
// Every query lives in dashboards/recall-anatomy.malloy; this component only
// names them. Shaping (ranking, top-N, ordering) stays in Malloy.

// ---------- the car ----------
function CarBlueprint({ cats, metric, selected, hovered, onSelect, onHover }) {
  const M = METRICS[metric];
  const max = Math.max(1, ...cats.map((c) => M.get(c)));
  const placed = cats.filter((c) => CATS[c.name] && CATS[c.name].x != null);
  const order = [...placed].sort((a, b) => M.get(b) - M.get(a));
  const focus = hovered || selected;

  return (
    <svg viewBox="0 0 1000 420" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <pattern id="grid-sm" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(120,190,255,0.06)" strokeWidth="1" />
        </pattern>
        <pattern id="grid-lg" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#grid-sm)" />
          <path d="M100 0H0V100" fill="none" stroke="rgba(120,190,255,0.12)" strokeWidth="1" />
        </pattern>
        <radialGradient id="floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,216,255,0.25)" />
          <stop offset="100%" stopColor="rgba(0,216,255,0)" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1000" height="420" fill="url(#grid-lg)" />
      <ellipse cx="505" cy="384" rx="470" ry="18" fill="url(#floor)" />
      <line x1="20" y1="382" x2="980" y2="382" stroke="rgba(120,190,255,0.25)" strokeDasharray="4 6" />

      <g fill="none" stroke={LINE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M40 300 L40 248 Q44 214 92 206 L252 196 Q304 124 372 108 L598 102 Q652 108 704 190 L882 206 Q950 216 966 252 L966 298 Q962 318 940 320 L832 320 A72 72 0 0 0 688 320 L322 320 A72 72 0 0 0 178 320 L62 320 Q40 318 40 300 Z"
          fill="rgba(64,150,255,0.05)"
        />
        <path d="M272 196 Q314 136 378 122 L476 118 L476 194 Z" fill="rgba(0,216,255,0.06)" />
        <path d="M490 118 L592 116 Q634 124 670 190 L490 192 Z" fill="rgba(0,216,255,0.06)" />
        <path d="M476 196 L476 318 M676 196 L676 318" strokeOpacity="0.5" />
        <path d="M252 198 L262 318" strokeOpacity="0.35" />
        <path d="M430 238 h26 M628 238 h26" strokeWidth="3" strokeOpacity="0.7" />
        <path d="M60 262 Q140 258 250 256 L880 250 Q930 250 960 262" strokeOpacity="0.25" />
        <path d="M944 238 Q962 240 964 256 L940 256 Q936 244 944 238 Z" strokeOpacity="0.8" />
        <path d="M42 232 L60 230 L60 256 L42 256 Z" strokeOpacity="0.8" />
        <path d="M704 190 L716 170 L736 172" strokeOpacity="0.6" />
      </g>

      {[250, 760].map((cx) => (
        <g key={cx} fill="none" stroke={LINE} strokeWidth="2">
          <circle cx={cx} cy="322" r="58" fill="rgba(10,19,38,0.9)" />
          <circle cx={cx} cy="322" r="44" strokeOpacity="0.4" />
          <circle cx={cx} cy="322" r="18" strokeOpacity="0.8" />
          {[0, 72, 144, 216, 288].map((a) => (
            <line
              key={a}
              x1={cx + 18 * Math.cos((a * Math.PI) / 180)}
              y1={322 + 18 * Math.sin((a * Math.PI) / 180)}
              x2={cx + 42 * Math.cos((a * Math.PI) / 180)}
              y2={322 + 42 * Math.sin((a * Math.PI) / 180)}
              strokeOpacity="0.45"
            />
          ))}
        </g>
      ))}

      <g stroke="rgba(120,190,255,0.3)" fill="rgba(120,190,255,0.45)" fontFamily={MONO} fontSize="10">
        <line x1="40" y1="404" x2="966" y2="404" />
        <line x1="40" y1="398" x2="40" y2="410" />
        <line x1="966" y1="398" x2="966" y2="410" />
        <text x="503" y="400" textAnchor="middle" stroke="none">NHTSA RECALL CAMPAIGNS · 1966–2026</text>
      </g>

      {order.map((c) => {
        const P = CATS[c.name];
        const v = M.get(c);
        const r = 7 + Math.sqrt(v / max) * 38;
        const isSel = c.name === selected;
        const isFocus = c.name === focus;
        const dim = focus && !isFocus;
        return (
          <g
            key={c.name}
            style={{ cursor: "pointer" }}
            opacity={dim ? 0.45 : 1}
            onClick={() => onSelect(c.name)}
            onMouseEnter={() => onHover(c.name)}
            onMouseLeave={() => onHover(null)}
          >
            <circle cx={P.x} cy={P.y} r={r} fill={P.color} className="ra-pulse" style={{ transformOrigin: P.x + "px " + P.y + "px", animationDelay: (P.x % 7) * 0.25 + "s" }} opacity="0.35" />
            <circle cx={P.x} cy={P.y} r={r} fill={P.color} fillOpacity={isFocus ? 0.4 : 0.22} stroke={P.color} strokeWidth={isFocus ? 2.5 : 1.2} filter="url(#glow)" />
            {isSel && <circle cx={P.x} cy={P.y} r={r + 7} fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.5" strokeDasharray="3 4" className="ra-spin" style={{ transformOrigin: P.x + "px " + P.y + "px" }} />}
            <circle cx={P.x} cy={P.y} r="4" fill="#fff" />
          </g>
        );
      })}

      {(() => {
        const c = cats.find((k) => k.name === focus);
        if (!c || !CATS[c.name] || CATS[c.name].x == null) return null;
        const P = CATS[c.name];
        const v = M.get(c);
        const r = 7 + Math.sqrt(v / max) * 38;
        const up = P.y > 120;
        const ly = up ? P.y - r - 34 : P.y + r + 20;
        const lx = Math.min(880, Math.max(120, P.x));
        return (
          <g pointerEvents="none">
            <line x1={P.x} y1={up ? P.y - r : P.y + r} x2={lx} y2={up ? ly + 12 : ly - 14} stroke={P.color} strokeOpacity="0.8" />
            <text x={lx} y={ly} textAnchor="middle" fontFamily={SANS} fontSize="15" fontWeight="700" fill={INK} stroke={BG} strokeWidth="5" paintOrder="stroke">
              {shortOf(c.name)}
            </text>
            <text x={lx} y={ly + 17} textAnchor="middle" fontFamily={MONO} fontSize="12" fill={P.color} stroke={BG} strokeWidth="4" paintOrder="stroke">
              {M.fmt(v)} {METRICS[metric].label.toLowerCase()}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

// ---------- small SVG helpers ----------
function Sparkline({ values, color }) {
  const W = 300, H = 60;
  if (!values.length) return null;
  const max = Math.max(1, ...values.map((d) => d.v));
  const x = (i) => (i / Math.max(1, values.length - 1)) * W;
  const y = (v) => H - 4 - (v / max) * (H - 10);
  const line = values.map((d, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(d.v).toFixed(1)).join(" ");
  const peak = values.reduce((a, b) => (b.v > a.v ? b : a), values[0]);
  const pi = values.indexOf(peak);
  return (
    <svg viewBox={"0 0 " + W + " " + (H + 14)} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={line + " L" + W + " " + H + " L0 " + H + " Z"} fill="url(#spark-fill)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" />
      <circle cx={x(pi)} cy={y(peak.v)} r="3.5" fill="#fff" />
      <text x={Math.min(W - 4, Math.max(4, x(pi)))} y={y(peak.v) - 7} textAnchor="middle" fontFamily={MONO} fontSize="10" fill={INK}>
        peak {peak.year}
      </text>
      <text x="0" y={H + 12} fontFamily={MONO} fontSize="10" fill={MUTED}>{values[0].year}</text>
      <text x={W} y={H + 12} textAnchor="end" fontFamily={MONO} fontSize="10" fill={MUTED}>{values[values.length - 1].year}</text>
    </svg>
  );
}

function BarList({ items, color }) {
  const max = Math.max(1, ...items.map((d) => d.v));
  return (
    <div style={{ display: "grid", gap: 7 }}>
      {items.map((d) => (
        <div key={d.label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 3, gap: 10 }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={d.label}>{d.label}</span>
            <span style={{ fontFamily: MONO, color: MUTED }}>{fmtInt(d.v)}</span>
          </div>
          <div style={{ height: 5, borderRadius: 5, background: "rgba(255,255,255,0.06)" }}>
            <div style={{ width: (d.v / max) * 100 + "%", height: "100%", borderRadius: 5, background: "linear-gradient(90deg, " + color + "66, " + color + ")" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MixChart({ order, byYear, years, focus, onHover, onSelect }) {
  const W = 1000, H = 260, L = 8, R = 8, T = 10, B = 26;
  if (years.length < 2) return null;
  const x = (yr) => L + ((yr - years[0]) / (years[years.length - 1] - years[0])) * (W - L - R);
  const y = (s) => T + (1 - s) * (H - T - B);
  const totals = years.map((yr) => order.reduce((s, c) => s + ((byYear[c] || {})[yr] || 0), 0) || 1);
  const cum = years.map(() => 0);
  const layers = order.map((c) => {
    const lo = cum.slice();
    const hi = years.map((yr, i) => (cum[i] += ((byYear[c] || {})[yr] || 0) / totals[i]));
    const top = years.map((yr, i) => (i ? "L" : "M") + x(yr).toFixed(1) + " " + y(hi[i]).toFixed(1)).join(" ");
    const bot = years
      .map((yr, i) => "L" + x(yr).toFixed(1) + " " + y(lo[i]).toFixed(1))
      .reverse()
      .join(" ");
    return { c, d: top + " " + bot + " Z" };
  });
  return (
    <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: "auto", display: "block" }} onMouseLeave={() => onHover(null)}>
      {layers.map(({ c, d }) => (
        <path
          key={c}
          d={d}
          fill={colorOf(c)}
          fillOpacity={!focus ? 0.75 : c === focus ? 0.95 : 0.14}
          stroke={BG}
          strokeWidth="0.6"
          style={{ cursor: "pointer", transition: "fill-opacity 180ms" }}
          onMouseEnter={() => onHover(c)}
          onClick={() => onSelect(c)}
        />
      ))}
      {years.filter((yr) => yr % 5 === 0).map((yr) => (
        <text key={yr} x={x(yr)} y={H - 8} textAnchor="middle" fontFamily={MONO} fontSize="11" fill={MUTED}>{yr}</text>
      ))}
    </svg>
  );
}

// ---------- the dashboard ----------
export default function Dashboard() {
  const [metric, setMetric] = useUrlState("metric", "vehicles");
  const [selected, setSelected] = useUrlState("part", "Airbags, seat belts & seats");
  const [hovered, setHovered] = useState(null);

  const summary = useQuery({ query: "category_summary" });
  const yearsQ = useQuery({ query: "category_by_year" });
  const comps = useQuery({ query: "top_components_by_category" });
  const makers = useQuery({ query: "top_manufacturers_by_category" });
  const biggest = useQuery({ query: "largest_campaigns_by_category" });

  const cats = (summary.rows ?? []).map((r) => ({
    name: String(r.component_category),
    recalls: Number(r.recall_count) || 0,
    vehicles: Number(r.total_affected_vehicles) || 0,
    dnd: Number(r.do_not_drive) || 0,
    park: Number(r.park_outside) || 0,
    completion: r.avg_completion == null ? null : Number(r.avg_completion),
  }));
  const M = METRICS[metric] || METRICS.vehicles;
  const metricKey = METRICS[metric] ? metric : "vehicles";
  const tot = {
    recalls: cats.reduce((s, c) => s + c.recalls, 0),
    vehicles: cats.reduce((s, c) => s + c.vehicles, 0),
    dnd: cats.reduce((s, c) => s + c.dnd, 0),
    park: cats.reduce((s, c) => s + c.park, 0),
  };
  const ranked = [...cats].sort((a, b) => M.get(b) - M.get(a));
  const maxM = Math.max(1, ...cats.map((c) => M.get(c)));
  const sel = cats.find((c) => c.name === selected) || cats[0];
  const selColor = sel ? colorOf(sel.name) : "#fff";

  const byYear = {};
  const yearSet = new Set();
  for (const r of yearsQ.rows ?? []) {
    const c = String(r.component_category);
    const yr = Number(r.recall_year);
    yearSet.add(yr);
    (byYear[c] = byYear[c] || {})[yr] = Number(r.recall_count) || 0;
  }
  const years = [...yearSet].sort((a, b) => a - b);
  const focus = hovered || (sel && sel.name);
  const shareIn = (c, from, to) => {
    let a = 0, t = 0;
    for (const yr of years) {
      if (yr < from || yr > to) continue;
      for (const k of Object.keys(byYear)) t += byYear[k][yr] || 0;
      a += (byYear[c] || {})[yr] || 0;
    }
    return t ? (a / t) * 100 : 0;
  };

  const pick = (q, key, labelKey) =>
    (q.rows ?? []).filter((r) => sel && String(r.component_category) === sel.name).map((r) => ({ label: String(r[labelKey]), v: Number(r[key]) || 0 }));
  const selComps = pick(comps, "recall_count", "Component");
  const selMakers = pick(makers, "recall_count", "Manufacturer");
  const selBig = (biggest.rows ?? []).filter((r) => sel && String(r.component_category) === sel.name);
  const spark = sel ? years.map((yr) => ({ year: yr, v: (byYear[sel.name] || {})[yr] || 0 })) : [];

  const card = { background: GLASS, border: "1px solid " + EDGE, borderRadius: 18, padding: 20 };
  const kicker = { fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, fontWeight: 600 };
  const loadingAny = summary.loading;
  const err = summary.error || yearsQ.error || comps.error || makers.error || biggest.error;

  return (
    <div
      style={{
        fontFamily: SANS,
        color: INK,
        background:
          "radial-gradient(1200px 500px at 70% -10%, rgba(0,216,255,0.14), transparent 60%), radial-gradient(900px 500px at 0% 100%, rgba(255,77,79,0.10), transparent 60%), " + BG,
        borderRadius: 22,
        padding: "34px 30px 40px",
        minHeight: "100%",
      }}
    >
      <style>{
        "@keyframes ra-pulse { 0% { transform: scale(1); opacity: .35 } 70% { transform: scale(1.55); opacity: 0 } 100% { transform: scale(1.55); opacity: 0 } }" +
        "@keyframes ra-spin { to { transform: rotate(360deg) } }" +
        ".ra-pulse { animation: ra-pulse 2.6s ease-out infinite }" +
        ".ra-spin { animation: ra-spin 14s linear infinite }" +
        ".ra-btn { transition: background 150ms, color 150ms }" +
        ".ra-row { transition: background 150ms }" +
        ".ra-row:hover { background: rgba(255,255,255,0.05) !important }"
      }</style>

      <div style={kicker}>NHTSA vehicle recalls · component anatomy</div>
      <h1 style={{ fontSize: 40, lineHeight: 1.08, fontWeight: 750, letterSpacing: "-0.02em", margin: "10px 0 10px" }}>
        Where cars{" "}
        <span style={{ background: "linear-gradient(90deg,#00d8ff,#ff85c0 55%,#ff7a45)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
          break
        </span>
      </h1>
      <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.6, maxWidth: 760, margin: 0 }}>
        Every recall campaign since 1966, mapped onto the part of the car it fixes. Bubbles grow with the measure you pick.
        Click a part to open its file: what fails, who builds it, and the biggest campaigns.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "26px 0 22px" }}>
        {[
          [fmtInt(tot.recalls), "recall campaigns"],
          [fmtBig(tot.vehicles), "vehicles named in recalls"],
          [fmtInt(tot.dnd), "do-not-drive advisories"],
          [fmtInt(tot.park), "park-outside advisories"],
        ].map(([v, l]) => (
          <div key={l} style={{ ...card, padding: "14px 18px", flex: "1 1 170px" }}>
            <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 600 }}>{loadingAny ? "…" : v}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>

      {err && <p style={{ color: "#ff7875" }}>Some data failed to load: {String(err)}</p>}

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <span style={kicker}>Size by</span>
        <div style={{ display: "inline-flex", padding: 4, borderRadius: 999, background: "rgba(255,255,255,0.05)", border: "1px solid " + EDGE }}>
          {Object.entries(METRICS).map(([k, m]) => (
            <button
              key={k}
              className="ra-btn"
              onClick={() => setMetric(k)}
              style={{
                border: "none",
                cursor: "pointer",
                padding: "7px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: SANS,
                background: metricKey === k ? INK : "transparent",
                color: metricKey === k ? BG : MUTED,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "flex-start" }}>
        <div style={{ ...card, padding: 14, flex: "1.7 1 560px", minWidth: 0 }}>
          {loadingAny ? (
            <div style={{ height: 380, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED }}>Loading the blueprint…</div>
          ) : (
            <CarBlueprint cats={cats} metric={metricKey} selected={sel && sel.name} hovered={hovered} onSelect={setSelected} onHover={setHovered} />
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 4, marginTop: 8 }}>
            {ranked.map((c) => {
              const isSel = sel && c.name === sel.name;
              return (
                <div
                  key={c.name}
                  className="ra-row"
                  onClick={() => setSelected(c.name)}
                  onMouseEnter={() => setHovered(c.name)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    cursor: "pointer",
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid " + (isSel ? colorOf(c.name) + "88" : "transparent"),
                    background: isSel ? colorOf(c.name) + "14" : "transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 9, background: colorOf(c.name), boxShadow: "0 0 10px " + colorOf(c.name) }} />
                    <span style={{ flex: 1, fontWeight: isSel ? 700 : 500 }}>{shortOf(c.name)}</span>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: MUTED }}>{M.fmt(M.get(c))}</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 3, background: "rgba(255,255,255,0.05)", marginTop: 6 }}>
                    <div style={{ width: (M.get(c) / maxM) * 100 + "%", height: "100%", borderRadius: 3, background: colorOf(c.name) }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ ...card, flex: "1 1 300px", minWidth: 0, borderTop: "3px solid " + selColor, boxShadow: "0 0 60px -30px " + selColor }}>
          {!sel ? (
            <div style={{ color: MUTED }}>Loading…</div>
          ) : (
            <div>
              <div style={kicker}>Component file</div>
              <h2 style={{ fontSize: 24, fontWeight: 750, margin: "6px 0 2px", color: selColor, letterSpacing: "-0.01em" }}>{shortOf(sel.name)}</h2>
              <div style={{ fontSize: 12.5, color: MUTED }}>
                {tot.recalls ? ((sel.recalls / tot.recalls) * 100).toFixed(1) : 0}% of campaigns ·{" "}
                {tot.vehicles ? ((sel.vehicles / tot.vehicles) * 100).toFixed(1) : 0}% of vehicles named
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0 18px" }}>
                {[
                  [fmtInt(sel.recalls), "campaigns"],
                  [fmtBig(sel.vehicles), "vehicles"],
                  [sel.completion == null ? "—" : sel.completion.toFixed(0) + "%", "avg. fix completion"],
                  [fmtInt(sel.dnd), "do-not-drive"],
                ].map(([v, l]) => (
                  <div key={l} style={{ padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid " + EDGE }}>
                    <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600 }}>{v}</div>
                    <div style={{ fontSize: 11.5, color: MUTED }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ ...kicker, marginBottom: 6 }}>Campaigns per year</div>
              <Sparkline values={spark} color={selColor} />

              {selComps.length > 0 && (
                <div>
                  <div style={{ ...kicker, margin: "18px 0 8px" }}>NHTSA component codes</div>
                  <BarList items={selComps} color={selColor} />
                </div>
              )}

              {selMakers.length > 0 && (
                <div>
                  <div style={{ ...kicker, margin: "18px 0 8px" }}>Most campaigns by maker</div>
                  <BarList items={selMakers} color={selColor} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {sel && selBig.length > 0 && (
        <div style={{ ...card, marginTop: 18 }}>
          <div style={kicker}>Largest campaigns · {shortOf(sel.name)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginTop: 12 }}>
            {selBig.map((r) => (
              <a
                key={String(r.recall_url)}
                href={String(r.recall_url)}
                target="_blank"
                rel="noreferrer"
                className="ra-row"
                style={{ textDecoration: "none", color: INK, padding: 14, borderRadius: 14, border: "1px solid " + EDGE, background: "rgba(255,255,255,0.025)", display: "block" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: selColor }}>{fmtBig(Number(r.affected))}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>{String(r.recall_date).slice(0, 10)}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, margin: "6px 0 4px", lineHeight: 1.35 }}>{String(r.Subject)}</div>
                <div style={{ fontSize: 12, color: MUTED }}>
                  {String(r.Manufacturer)}
                  {r.do_not_drive === true && <span style={{ marginLeft: 8, color: "#ff4d4f", fontWeight: 700 }}>DO NOT DRIVE</span>}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ ...card, marginTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={kicker}>The mix over time</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "4px 0 0" }}>Share of recall campaigns by component, 1980–2025</h3>
          </div>
          {focus && years.length > 0 && (
            <div style={{ fontSize: 13.5 }}>
              <span style={{ color: colorOf(focus), fontWeight: 700 }}>{shortOf(focus)}</span>
              <span style={{ color: MUTED }}> · </span>
              <span style={{ fontFamily: MONO }}>{shareIn(focus, 1980, 1984).toFixed(1)}%</span>
              <span style={{ color: MUTED }}> in 1980–84 → </span>
              <span style={{ fontFamily: MONO, color: colorOf(focus), fontWeight: 700 }}>{shareIn(focus, 2021, 2025).toFixed(1)}%</span>
              <span style={{ color: MUTED }}> in 2021–25</span>
            </div>
          )}
        </div>
        <div style={{ marginTop: 14 }}>
          {yearsQ.loading ? (
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED }}>Loading…</div>
          ) : (
            <MixChart order={cats.map((c) => c.name)} byYear={byYear} years={years} focus={focus} onHover={setHovered} onSelect={setSelected} />
          )}
        </div>
        <p style={{ fontSize: 12, color: MUTED, margin: "10px 0 0" }}>
          Categories come from the model's component_category, which maps NHTSA component codes and recall subjects to parts of the car.
          Vehicle counts add up each campaign's potentially affected vehicles, so a car recalled twice counts twice.
        </p>
      </div>
    </div>
  );
}
