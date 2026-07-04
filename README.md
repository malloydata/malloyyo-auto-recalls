# malloyyo-auto-recalls

A [Malloy](https://www.malloydata.dev/) semantic model over NHTSA vehicle-recall
data, analyzed by component category and recall trends over time.

## Contents

- `auto_recalls.malloy` — the `auto_recalls` source: recalls with a derived
  `component_category` classification, measures (`recall_count`,
  `total_affected_vehicles`, …), and views for recent recalls and yearly trends.
- `index.malloy` — entry point that re-exports the `auto_recalls` source, its
  givens (`MANUFACTURER`, `SEARCH`), and the dashboard queries.
- `dashboards/` — interactive dashboards previewable with `malloyyo dashboard dev`:
  - `manufacturer/` — **Manufacturer Recall Profile**: pick a manufacturer, see its
    recall counts, affected-vehicle totals, yearly trend, breakdown by component
    category, and most-recent recalls. Driven by the `manufacturer_dashboard` query.
  - `vehicle-search/` — **Vehicle Recall Search**: type a model or keyword and see
    every matching recall across all manufacturers. Driven by the
    `vehicle_search_dashboard` query.

Data source: `https://storage.googleapis.com/malloyyo/auto_recalls/auto_recalls.parquet`
(NHTSA recalls: https://www.nhtsa.gov/recalls)

## Running

Open the folder in VS Code with the
[Malloy extension](https://marketplace.visualstudio.com/items?itemName=malloydata.malloy-vscode),
or use the Malloyyo MCP server configured in `.mcp.json`.
