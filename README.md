# malloyyo-auto-recalls

A [Malloy](https://www.malloydata.dev/) semantic model over NHTSA vehicle-recall
data, analyzed by component category and recall trends over time.

## Contents

- `auto_recalls.malloy` — the `auto_recalls` source: recalls with a derived
  `component_category` classification, measures (`recall_count`,
  `total_affected_vehicles`, …), and views for recent recalls and yearly trends.
- `index.malloy` — entry point that re-exports the `auto_recalls` source.

Data source: `https://storage.googleapis.com/malloyyo/auto_recalls/auto_recalls.parquet`
(NHTSA recalls: https://www.nhtsa.gov/recalls)

## Running

Open the folder in VS Code with the
[Malloy extension](https://marketplace.visualstudio.com/items?itemName=malloydata.malloy-vscode),
or use the Malloyyo MCP server configured in `.mcp.json`.
