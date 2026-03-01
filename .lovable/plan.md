

# CogniBiome — Implementation Plan

## Phase 1: Static Assets & Project Foundation
1. **Extract all bundle files into `/public/`** — Place foundation_pack/**, reference/*.json, pilot/pilot_dataset_n66.csv, and external_sources_for_Gut_overview.txt under `/public/` so they're fetchable at runtime. Optionally mirror to `/app_context/` for audit.
2. **Generate Demo Param Set v0** — Create `/public/models/stage1.json`, `stage2.json`, `stage3.json` with monotonic directional demo coefficients, labeled "Demo parameters (directional), replaceable".
3. **Dark theme + app shell** — Configure dark "AI research console" theme (high contrast, clean typography). Build sidebar layout with 6 nav items (Dashboard, Pilot Results, Simulator, Export Report, Methods & Rigor, Compare Scenarios). Top bar: CogniBiome title, Presenter Mode toggle, Reset button, Help/Docs button.

## Phase 2: World Model & Core Engines
4. **Create `/src/world_model/worldModel.ts`** — Typed graph defining DietFeatures, MicrobeGenera, MetaboliteProxies, CognitiveDomains, EvidenceSources with labels, units, ranges, disclaimers, and stage wiring (D→X→M→Y).
5. **Pilot CSV parser** — Client-side ingestion: drop `Unnamed:` columns, handle duplicate Diet Score columns, map to canonical fields (diet_score, stroop_test, language_test, memory_test, logical_test, overall_score), row-wise integrity check (overall_score == sum of subtests).
6. **Statistics engine** — Compute mean, median, n per metric. Pearson r for diet_score vs each cognitive metric. p-values labeled "approximate" (no external stats library).
7. **Simulation engine** — Deterministic 3-stage pipeline reading JSON artifacts from `/public/models/`. Compute `run_hash = sha256(JSON.stringify({normalized_inputs, model_versions}))`. Persist runs to localStorage with hash, timestamp, inputs, outputs, model_versions, notes.

## Phase 3: All 7 Screens
8. **Dashboard (SCR-001)** — Navigation tiles to all sections, model version badge, last run summary card, "Educational research prototype" disclaimer badge.
9. **Pilot Results (SCR-002)** — Summary stats table, correlation table (Pearson r + approximate p-values), 5 scatter plots (diet_score vs each metric) with regression line toggle and quartile toggle. Prominent "REAL DATA (de-identified teen pilot, n=66) • computed live from CSV • no synthetic points" badge. Upload CSV option.
10. **Simulator (SCR-003)** — 4 diet sliders (fiber_proxy, added_sugar_proxy, sat_fat_proxy, omega3_proxy) with derived diet_score_proxy. Run button → 3 output panels (Microbiome: Bifidobacterium/Lactobacillus/F:B ratio; Metabolites: acetate/propionate/butyrate/5-HTP index; Cognition: all 5 metrics). All labeled "MODELED / ESTIMATED (proxy)". Provenance panel with run_hash + model versions.
11. **Export Report (SCR-004)** — Select stored run by run_hash. Generate downloadable HTML report with: run provenance, diet inputs, stage outputs (proxy-labeled), pilot summary chart/table, leakage checklist status, disclaimers. Print-to-PDF button via window.print().
12. **Methods & Rigor (SCR-005)** — Three card sections: (A) Limitations & scientific wording (modeled proxies, non-causality, non-diagnostic), (B) Leakage guardrails checklist (validation-only pilot, no peeking, fit-only-on-train, duplicate awareness), (C) Data Sources table (Stage/Inputs/Outputs/Dataset types/Notes). Evidence panel with pathway cards from reference JSONs using cautious "supports plausibility" language.
13. **Compare Scenarios (SCR-006)** — Side-by-side Scenario A/B diet controls, comparison charts for all stage outputs, save/export comparison.
14. **Help/Docs Viewer (SCR-007)** — Load `/foundation_pack/docs_index.json` (uses `items[]` key). List documents with category tabs (Foundation, Reference, Data). Render: JSON → pretty-print + derived table for requirements; CSV → table preview (first 100 rows); MD → rendered Markdown; TXT → preformatted text. Copy and Download actions per document. Fully offline, read-only.

## Phase 4: Evidence Library
15. **Evidence panel integration** — Read `/public/reference/usda_fdc.json` for nutrient definitions, `reactome.json` + `wikipathways.json` for pathway cards, `mimedb.json` for microbe↔metabolite links (empty-state if unpopulated). All labeled as "illustrative / proxy / supports plausibility" — not official full exports.

## Phase 5: Presenter Mode, Reset & Admin
16. **Presenter Mode** — Toggle hides admin/advanced controls. Shows "2-minute demo path" stepper: Pilot Results → Methods & Rigor → Simulator → Export.
17. **Reset demo state** — Confirmation dialog → restore default scenario values, clear stored runs from localStorage.
18. **Hidden Admin controls** — URL param `?admin=true` reveals: model artifact upload, pilot CSV replace.

## Phase 6: Tests
19. **TST-001** — Vitest: pilot CSV parsing produces 66 rows, correct canonical columns, integrity check passes.
20. **TST-002** — Vitest: stats/correlation computation returns stable numeric values (no NaN).
21. **TST-003** — Vitest: simulation determinism — same inputs → same outputs + same run_hash.
22. **TST-007** — Vitest: Help/Docs viewer loads docs_index.json and renders JSON/CSV/MD/TXT without network calls.

