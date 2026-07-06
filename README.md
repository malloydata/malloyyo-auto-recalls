# malloyyo-auto-recalls

A [Malloy](https://www.malloydata.dev/) semantic model over NHTSA vehicle-recall
data, analyzed by component category and recall trends over time — with three
**model-declared dashboards** (see `docs/repo-artifacts.md` in the malloyyo repo
for the design).

## Contents

- `auto_recalls.malloy` — the `auto_recalls` source: recalls with a derived
  `component_category` classification, a lowercase `search_text` haystack,
  measures (`recall_count`, `total_affected_vehicles`, …), the dashboard givens,
  a `manufacturer_options` suggestions query, and three `# artifact`-tagged
  dashboard queries.
- `index.malloy` — entry point that re-exports the source, givens, and queries.
- `dashboards/<slug>/Dashboard.tsx` — the dashboards' custom React components.

Data source: `https://storage.googleapis.com/malloyyo/auto_recalls/auto_recalls.parquet`
(NHTSA recalls: https://www.nhtsa.gov/recalls)

## Dashboards — declared in the model, not in JSON

There is no manifest file. Each dashboard is a query tagged `# artifact`; the
filters are `filter<T>` givens applied with `~`, so **an empty expression means
"no filter"** — `recall_list` needs no `($X = '' or …)` sentinel logic:

```malloy
given:
  # label="Manufacturer" control=select suggest { query=manufacturer_options dimension=Manufacturer }
  MANUFACTURER :: filter<string> is f''
  # label="Component" control=select suggest { source=auto_recalls dimension=Component }
  COMPONENT :: filter<string> is f''
  # label="Park outside advisory"
  PARK_OUTSIDE :: boolean is false

# artifact { name="manufacturer" title="Manufacturer Recall Profile" givens { MANUFACTURER="Ford Motor Company" } }
query: manufacturer_dashboard is auto_recalls -> { where: Manufacturer ~ $MANUFACTURER … }
```

Notable patterns exercised here:

- **Curated options via a named query** — `suggest { query=manufacturer_options
  dimension=Manufacturer }` fills the manufacturer dropdown from the top-60-by-
  recall-count query (governed, reviewable Malloy — not a string in a tag).
- **Distinct-values options** — `suggest { source=auto_recalls dimension=Component }`.
- **Per-dashboard defaults** — the profile starts on Ford, the recall list on
  "everything", from the same shared given (`# artifact { … givens { … } }`).
- **Search** — the `SEARCH` given filters the `search_text` dimension; the
  components commit `filters.contains(term)` so escaping is always correct
  (values like `Tesla, Inc.` must be committed with `filters.oneOf`, never raw —
  a bare comma parses as filter alternatives).
- **Boolean givens** → the `<Checkbox given="PARK_OUTSIDE"/>` widget.

| slug | query | notes |
|---|---|---|
| `manufacturer` | `manufacturer_dashboard` | select fed by `manufacturer_options`, Ford default |
| `vehicle-search` | `vehicle_search_dashboard` | debounced search, `%tundra%` default |
| `recall-list` | `recall_list` | every filter optional, Checkbox widgets, Clear button |

## Running

- `malloyyo dashboard dev` — preview server with hot reload.
- `malloyyo lint` — validates the tagged queries, given suggest declarations,
  and the `Dashboard.tsx` files.
- Or open the folder in VS Code with the
  [Malloy extension](https://marketplace.visualstudio.com/items?itemName=malloydata.malloy-vscode),
  or use the Malloyyo MCP server configured in `.mcp.json`.
