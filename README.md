# CogniBiome Insights

**Offline-first deterministic simulator + pilot analytics for the gut–brain axis**

> **Science-fair demo build (v0.1) — educational hypothesis generator, not a diagnostic or causal ML system.**

---

## What is this project?

CogniBiome Insights investigates whether a plausible computational pathway exists connecting
diet → gut microbiome → metabolites → cognitive performance.

The 2025 pilot collected de-identified data from 66 high-school students (diet survey + four
cognitive tests). That dataset shows moderate correlations between diet quality and cognitive scores.
The simulator makes the mechanistic hypothesis visible and auditable — it is **not** a trained
predictive model.

---

## What is real vs modeled

| Component | Status | Source |
|---|---|---|
| **Pilot Results** (scatter plots, correlations) | **Real measured data** | `pilot_dataset_n66.csv` — de-identified, n=66 |
| **Simulator microbiome outputs** | Modeled proxy | Frozen demo coefficients (`/public/models/stage1.json`) |
| **Simulator metabolite outputs** | Modeled proxy | Frozen demo coefficients (`/public/models/stage2.json`) |
| **Simulator cognitive outputs** | Modeled proxy | Frozen demo coefficients (`/public/models/stage3.json`) |
| **Reference snapshots** (NHANES, HMP, etc.) | UI context only | Metadata-only; no participant data; no training source |

The pilot CSV is used **for validation analytics only**. No model coefficients were trained in this
build — all simulator stages run on frozen demo parameters.

---

## Pilot findings (from the real n=66 dataset)

These values are computed live by `src/lib/statistics.ts` from `pilot_dataset_n66.csv`.
p-values are **approximate as displayed in-app** (Abramowitz & Stegun formula; not corrected for
multiple comparisons).

| Cognitive metric | Pearson r | p-value (approx) |
|---|---|---|
| Overall score | 0.367 | 0.00329 |
| Language test | 0.353 | 0.00517 |
| Logical reasoning | 0.336 | 0.00876 |
| Memory test | lower | not highlighted |
| Stroop test | lower | not highlighted |

**Interpretation:** Positive correlations are directionally consistent with the gut–brain
hypothesis. They do **not** establish causation and are not corrected for confounders
(sleep, exercise, socioeconomic factors) or multiple comparisons.

---

## Reproducibility

Every simulation run is:

1. **Deterministic** — identical slider inputs always produce identical numeric outputs.
2. **Versioned** — the run records the semantic versions of all three stage JSON artifacts.
3. **Hashed** — a SHA-256 `runHash` is computed from `sha256(JSON.stringify({normalized_inputs, model_versions}))` and stored in localStorage.

Model artifact files (frozen in this build):

```
public/models/stage1.json   (Diet → Microbiome proxy)
public/models/stage2.json   (Microbiome proxy → Metabolite proxy)
public/models/stage3.json   (Metabolite proxy → Cognitive outputs)
```

---

## Lessons learned

1. **Reference databases ≠ paired training datasets.**
   MiMeDB, Reactome, and WikiPathways provide mechanistic plausibility context but do not supply
   the paired numeric measurements needed to train a supervised model.

2. **No single open dataset contains diet + microbiome + metabolomics + cognition together.**
   Published cohorts like ZOE PREDICT demonstrate large-scale diet-microbiome measurement; iHMP/IBDMDB
   provides longitudinal paired multi-omics. But no publicly available dataset currently combines all
   four modalities in healthy teenagers.

3. **Heavy pipelines require backend compute; browser-only is not appropriate for full omics processing.**
   Real metagenomics pipelines involve GBs of sequencing data, assembly, and feature engineering.
   A browser PWA can display results but cannot perform this processing honestly.

---

## Roadmap (future work — not in this build)

| Phase | Description | Dependency |
|---|---|---|
| **Phase 2 (future)** | Python/FastAPI backend + offline training pipeline | Paired datasets with access approval |
| **Phase 2** | Stage-wise model training with scikit-learn or XGBoost | D→X: ZOE PREDICT (if access granted); X→M: iHMP/IBDMDB |
| **Phase 2** | Replace frozen demo artifacts with trained `stage*.json` exports | Trained artifacts + MODEL_CARD.md |
| **Phase 3 (future)** | Paired cognition cohort or research partnership | Institutional approval + IRB |

The web app is designed to remain offline-first and accept swapped-in trained artifacts
without code changes — only the JSON stage files need to be replaced.

---

## How to verify (CI / headless)

### One-command full check

```bash
npm run verify
```

This runs `npm run lint && npm run test && npm run build` in sequence.
Exit code 0 means the codebase is lint-clean, all tests pass, and the production bundle builds successfully.

### Unit / component tests (Vitest + React Testing Library)

```bash
npm test
```

The test suite includes **screen-contract tests** (`src/test/screens.presenterMode.test.tsx`) that render every judge-critical route in a jsdom environment with `presenterMode = true` and assert presence of key strings without a running browser:

| Route | Asserted strings |
|---|---|
| `/` (Dashboard) | `Demo Sequence — Judge Path`, `NOT medical advice` |
| `/pilot` | `REAL DATA`, `p-value (approx)`, `Pearson r` |
| `/simulator` | `MODELED PROXY`, `Run Hash`, run-hash presenter cue element |
| `/methods` | `Paired`, `UNPAIRED`, `License not confirmed`, `Relations count (export)` |
| `/compare` | `modeled proxies`, `not measured values` |
| `/export` | `Download HTML`, `Print to PDF` |
| `/help?doc=DOC-026` | `Presenter Guide (Presenter Mode)`, `educational hypothesis generator` |

Tests use substring matching (`toContain` / `getAllByText`) so layout changes don't break them.

### Playwright E2E + screenshots (CI only)

Full-browser screenshot tests live in `e2e/presenterMode.spec.ts`.
They require a production build and a running vite preview server:

```bash
# Build first
npm run build

# Install Playwright browsers (first time only)
npx playwright install --with-deps chromium

# Run E2E tests (starts vite preview automatically)
npx playwright test
```

Screenshots are written to `e2e/screenshots/` with names like `01-dashboard-presenter.png`.

In CI (GitHub Actions) the `e2e` job:
1. Runs after the `verify` job passes.
2. Installs Playwright browsers with OS dependencies.
3. Builds the app.
4. Runs the spec and uploads `e2e/screenshots/` and `playwright-report/` as artifacts retained for 30 days.

### CI workflow (GitHub Actions)

`.github/workflows/ci.yml` triggers on every push and pull request to `main`/`master`:

```
verify job:
  → checkout → setup-node@22 → npm ci → lint → test → build
  → uploads dist/ as artifact

e2e job (runs after verify):
  → checkout → setup-node@22 → npm ci
  → install Playwright browsers
  → build → playwright test
  → uploads screenshots + playwright-report/ as artifacts
```

Artifacts are available in the GitHub Actions run summary page.

## Quick start

```bash
# Install dependencies
npm install

# Local development server
npm run dev

# Run tests (Vitest)
npm test

# Lint + test + build in one command
npm run verify

# Production build only
npm run build

# Lint
npm run lint
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript (Vite) |
| UI | shadcn/ui (Radix UI) + Tailwind CSS |
| Charts | Recharts |
| Offline | vite-plugin-pwa (Workbox) |
| Tests | Vitest + Testing Library |
| Backend | **None** (browser-only in this build) |

---

## Repository structure

```
public/
  docs/          Markdown + JSON docs shown in the in-app Docs viewer
  foundation_pack/  SRS, BRD, requirements, docs_index.json
  models/        Frozen stage JSON artifacts (demo params, not trained)
  pilot/         pilot_dataset_n66.csv (real, de-identified, n=66)
  reference/     Offline reference snapshots (NHANES ranges, HMP index, etc.)
src/
  lib/           pilotParser, statistics, simulator
  pages/         React page components (one per screen)
  contexts/      AppContext (presenterMode, pilotDataset, runs)
  world_model/   worldModel.ts (labels, units, disclaimers, pipeline wiring)
  test/          Vitest test suite
scripts/         Build helpers (mimedb, manifest, Cyrillic check)
```

---

## Scientific guardrails

- All simulator outputs are labeled **MODELED PROXY** in the UI.
- No output is described as a diagnostic result or as causal evidence.
- The pilot dataset is never used for model training.
- p-values displayed are approximate (A&S formula); interpret as descriptive only.
- The project abstract and project plan PDFs are preserved verbatim in the Docs viewer.
