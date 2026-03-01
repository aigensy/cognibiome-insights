# Guser guide (CogniBiome, 2026 judge-ready demo build)

**Generated (UTC):** 2026-03-01T06:15:04Z  
**App type:** offline-first PWA, deterministic simulator / hypothesis generator (not diagnostic, not causal proof)

---

## 0. What this guide covers (and what it does not)

This guide documents the **current** CogniBiome codebase (the Vite/React app in this repo):
- the **frontend stack** and runtime behavior
- the **data boundary** rules (pilot validation-only; modeled proxies)
- the **file tree** and where each major feature lives
- every **screen** and every **interactive control** (buttons, toggles, uploads)
- every **document** listed in the in-app **Help / Docs** viewer

It does **not** claim that model artifacts were trained inside the app. The simulator uses **frozen JSON artifacts** (demo placeholders in this build).

---

## 1. 2-minute judge demo path (recommended)

1) **Pilot Results**  
   Show the “REAL DATA” badge and the live scatter plots (diet score vs cognitive metrics).

2) **Methods & Rigor**  
   Show the “non-causal / non-diagnostic / proxy outputs” disclaimers and the data-source transparency table.

3) **Simulator**  
   Change a diet slider (e.g., increase Fiber, decrease Added Sugar), run the simulation, and show:
   - Microbiome proxies (modeled)
   - Metabolite proxies (modeled)
   - Cognitive outputs (modeled) + Run Hash

4) **Export Report**  
   Generate and download the HTML report for the run.

---

## 2. Scientific framing guardrails (must match project packet)

This app is a **computational modeling + visualization tool**:
- **It generates testable hypotheses. It does not prove causality.**
- **It is not medical advice and not a diagnostic device.**
- The teen pilot dataset (n=66) is **de-identified** and **validation-only** (never used for training).
- Microbiome and metabolite values shown in the app are **MODELED / ESTIMATED proxies**, not measured teen biomarkers.

These guardrails align with the project plan’s pipeline framing (diet → microbiome → metabolite → cognition) and its statement that the pilot dataset is for validation only.  

---

## 3. Tech stack (frontend + “backend”)

### 3.1 Frontend
- **React 18 + TypeScript** (Vite build)
- **React Router** for routes
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)
- **Recharts** for plots
- **vite-plugin-pwa** for offline caching (Workbox)

### 3.2 Backend (none in v0.1)
There is **no server** and no database in this build.

All persistence is browser-local:
- simulation runs are stored in **localStorage**
- pilot CSV is loaded from `/public/pilot/…` or via local upload (Admin mode)

No external APIs are called at runtime (offline-first requirement).

---

## 4. Data & artifacts used at runtime

### 4.1 Pilot dataset (real, validation-only)
- File: `/public/pilot/pilot_dataset_n66.csv`
- Loaded by: `src/lib/pilotParser.ts`
- Used by screens:
  - **Pilot Results** (stats + correlations + scatter charts)
  - **Export Report** (optional pilot stats/correlations section)

**Integrity rules enforced**
- Required numeric fields: `diet_score`, `stroop_test`, `language_test`, `memory_test`, `logical_test`, `overall_score`
- Drops `Unnamed:` columns
- Detects duplicated Diet Score columns and blocks stats if values differ
- Checks that `overall_score ≈ sum(stroop + language + memory + logical)` per row (±0.15)

### 4.2 Simulator model artifacts (demo placeholders in this build)
- Files:
  - `/public/models/stage1.json` (Diet → Microbiome proxy)
  - `/public/models/stage2.json` (Microbiome proxy → Metabolite proxy)
  - `/public/models/stage3.json` (Metabolite proxy → Cognition outputs)
- Loaded by: `src/lib/simulator.ts`
- Properties:
  - deterministic linear coefficients + output clamping ranges
  - metadata includes `is_demo: true`

**Important:** These artifacts are **directional demo parameters**, not trained results. Replace them later with trained artifacts exported offline.

### 4.3 Offline reference snapshots (UI evidence only)
Stored under `/public/reference/…` and used for:
- NHANES nutrient-range context panels (Simulator + Public Datasets)
- MiMeDB snapshot table (Methods & Rigor)
- Reference evidence cards and licensing transparency (Docs viewer)

---

## 5. Repository structure (annotated)

### 5.1 Top-level
- `public/` — runtime assets served by the app (docs, datasets, model artifacts)
- `src/` — React application source
- `app_context/` — audit copy of the foundation pack and reference packs (what was uploaded/used)
- `scripts/` — helper scripts (bundle extraction, MiMeDB build, Cyrillic check)
- `.lovable/plan.md` — implementation roadmap used when building this repo

### 5.2 Key source files
- `src/App.tsx` — router + app shell
- `src/contexts/AppContext.tsx` — global state:
  - Presenter mode
  - Admin mode (`?admin=true`)
  - Loaded pilot dataset
  - Last simulation run
  - Simulator inputs + Reset behavior

**Core engines**
- `src/lib/pilotParser.ts` — strict CSV ingestion + integrity checks
- `src/lib/statistics.ts` — summary stats + Pearson r + approximate p-values
- `src/lib/simulator.ts` — deterministic D→X→M→Y pipeline + run hash + localStorage persistence
- `src/world_model/worldModel.ts` — “world model” labels, units, slider ranges, disclaimers, and a deterministic `dietScoreProxy`

**Screens**
- `src/pages/Dashboard.tsx`
- `src/pages/PilotResults.tsx`
- `src/pages/Simulator.tsx`
- `src/pages/Compare.tsx`
- `src/pages/ExportReport.tsx`
- `src/pages/Methods.tsx`
- `src/pages/PublicDatasets.tsx`
- `src/pages/HelpDocs.tsx`

---


## 5.3 Cleaned docs file structure (current)

Canonical docs locations after cleanup:
- `/public/docs/` — app-facing authored docs (`cognibiome_user_guide.md`, `implementation_plan.md`, PDF→JSON docs)
- `/public/docs/screenshots/` — screenshots embedded by the guide
- `/public/foundation_pack/` — foundation JSON docs + docs index used by the viewer
- `/public/reference/` — reference snapshots used by Methods/Public Datasets/Docs

Removed duplicates:
- removed duplicate root guide file: `/public/CogniBiome App User Guide.md`
- removed duplicate structured guide JSON: `/public/docs/cognibiome_user_guide.json`

## 6. Global UI controls (appear on every screen)

### 6.1 Sidebar navigation
Routes:
- Dashboard (`/`)
- Pilot Results (`/pilot`)
- Simulator (`/simulator`)
- Compare Scenarios (`/compare`)
- Export Report (`/export`)
- Methods & Rigor (`/methods`)
- Public Datasets (`/datasets`)

### 6.2 Top bar controls
- **Presenter Mode toggle**
  - ON: sidebar shows only the “judge path” items (Dashboard, Pilot Results, Simulator, Compare)
  - OFF: shows all screens
- **Reset Demo State** (hidden in Presenter Mode)
  - clears saved runs from localStorage
  - resets simulator sliders to defaults
  - clears loaded pilot dataset (it will reload automatically)
- **Docs section in sidebar**
  - open **Docs** in the left menu and pick a document by category (Foundation / Data / Reference)
  - viewer route remains `/help` with doc selection via URL query (`?doc=...`)
- **Offline indicator**
  - shows OFFLINE when the browser reports no network

### 6.3 Admin mode (URL flag)
Enable Admin mode by opening the app with:
- `?admin=true`

Admin mode currently enables:
- Pilot CSV upload control in Pilot Results

Admin mode does **not** enable model-artifact uploads in this build.

---

## 7. Screen-by-screen reference (purpose + controls)

## 7.1 Dashboard (`/`)
**Purpose:** fastest entry point for judges, showing “what to click next”.

**Main UI blocks**
- project title line
- badges (app version, pilot dataset loaded status, saved run count)
- navigation tiles

**Controls**
- click any tile to navigate to that screen

---

## 7.2 Pilot Results (`/pilot`)
**Purpose:** show real pilot (n=66) results transparently and reproducibly.

**What it computes (live from CSV)**
- summary statistics (mean, median, SD, min, max, n)
- Pearson correlations: diet_score vs each cognitive metric
- scatter plots for each metric vs diet_score

**Badges**
- “REAL DATA (de-identified teen pilot, n=66) • computed live • no synthetic points”
- dataset source (bundled vs upload)
- dataset SHA-256 (if computed)

**Controls**
- **Regression line** (switch)
  - ON: draws a fitted line per plot (least-squares)
  - OFF: scatter-only
- **Show quartiles** (switch)
  - Present in UI state, but **not implemented yet** (no quartile overlays are rendered in v0.1)
- **Upload CSV** (Admin mode only)
  - accepts a local `.csv`
  - re-parses dataset; replaces in-memory dataset for this session

**Special dialog: duplicated Diet Score columns**
If the uploaded CSV contains multiple Diet Score columns with different values, a dialog appears:
- dropdown to select the correct Diet Score column
- **Confirm Selection** button to re-parse with that mapping

---

## 7.3 Simulator (`/simulator`)
**Purpose:** run a deterministic diet→microbiome→metabolites→cognition simulation.

**Diet inputs (sliders)**
- Fiber Intake (g/day proxy)
- Added Sugar (g/day proxy)
- Saturated Fat (g/day proxy)
- Omega-3 / PUFA (g/day proxy)

**Computed output**
- `dietScoreProxy` — deterministic composite computed in `src/world_model/worldModel.ts`

**Buttons**
- **Run Simulation**
  - loads the 3 stage artifacts from `/public/models/…`
  - computes outputs (D→X→M→Y)
  - computes `runHash = sha256(JSON.stringify({normalized_inputs, model_versions}))`
  - saves run to localStorage
  - updates “last run” state for the dashboard/export screens

**Panels**
- Microbiome proxy outputs (modeled)
- Metabolite proxy outputs (modeled)
- Cognitive outputs (modeled)
- Provenance panel
  - full Run Hash (for reproducibility)
  - demo-params disclaimer (hidden in Presenter mode)

**NHANES reference ranges panel**
- collapsible panel showing min/max reference ranges from the shipped NHANES nutrient snapshot CSV
- this panel is UI context only; it does not change model math

**Failure modes**
- if model artifact fetch fails (missing file, invalid JSON), the app shows a “Simulation failed” toast with the error string.

---

## 7.4 Compare Scenarios (`/compare`)
**Purpose:** compare two saved simulation runs side-by-side.

**Precondition:** at least 2 runs saved (create them in Simulator first).

**Controls**
- select **Scenario A** run (dropdown)
- select **Scenario B** run (dropdown)
- swap A/B
- table shows:
  - A value, B value
  - absolute delta
  - percent delta

---

## 7.5 Export Report (`/export`)
**Purpose:** generate a single-page HTML report for a selected run.

**Controls**
- **Select run** (dropdown)
- toggles:
  - include pilot summary (stats + correlations)
  - include leakage checklist
- buttons:
  - **Generate** (renders an HTML preview)
  - **Download HTML**
  - **Print** (uses browser print dialog)

**Export contents**
- run provenance (run hash, model versions)
- inputs, modeled outputs
- disclaimers (non-causal, non-diagnostic, modeled-proxy)
- optional pilot summary section (real dataset)
- optional leakage checklist

---

## 7.6 Methods & Rigor (`/methods`)
**Purpose:** proactively answer judge questions about validity, leakage, and limitations.

**Sections**
- “What this is / what it is not” disclaimers
- leakage guardrails checklist (UI version of the rules)
- data source table (by stage: D→X, X→M, M→Y, validation)
- MiMeDB snapshot explorer (searchable)

**MiMeDB snapshot controls**
- search input (filters metabolites/microbes/links)
- tab switch: Metabolites / Microbes / Links
- table view of the selected tab

---

## 7.7 Public Datasets (`/datasets`)
**Purpose:** show status of the public datasets listed in the project plan, without inventing what is included.

**Source of truth**
- `/public/reference/public_datasets_manifest.json`

**Controls**
- search input (filters datasets)
- per-dataset “View” opens dataset details
- download/preview actions when the manifest marks a file as included

This screen is meant to clearly separate:
- datasets actually included as local snapshots
- datasets planned but not included (with reasons)

---

## 7.8 Help / Docs (`/help`)
**Purpose:** show all packaged docs and reference snapshots inside the app, offline.

**How it works**
- loads the doc list from `/public/foundation_pack/docs_index.json`
- fetches each document on demand and renders:
  - JSON (pretty print + optional table rendering for arrays)
  - CSV (table preview)
  - Markdown
  - Plain text

**Controls**
- pick documents from the **left sidebar Docs tree** (Foundation / Data / Reference)
- in-viewer actions:
  - **Human View** (for JSON docs)
  - **Raw JSON**
  - **Copy** to clipboard
  - **Download**

**PDF handling**
The docs viewer does not render PDFs directly. Any PDF you want to show inside the app must be converted to JSON (or Markdown).  
This repo ships:
- Project Plan (PDF → JSON)
- Project Abstract (PDF → JSON)

---

## 8. Docs inventory (everything shown in Help / Docs)

| Doc ID | Title | Path | Type | Category | Used by | What it is |
|---|---|---|---|---|---|---|
| DOC-001 | User Requirements (UR) | `/foundation_pack/user_requirements.json` | JSON | Foundation | Help / Docs viewer | Primary user-level scope and acceptance criteria. |
| DOC-002 | BRD | `/foundation_pack/BRD/brd.json` | JSON | Foundation | Help / Docs viewer | Business requirements and success metrics. |
| DOC-003 | SRS Requirements (Traceable) | `/foundation_pack/SRS/traceable_requirements.json` | JSON | Foundation | Help / Docs viewer | Functional and non-functional requirements with traceability. |
| DOC-004 | GUI Spec | `/foundation_pack/SRS/gui_spec.json` | JSON | Foundation | Help / Docs viewer | Screens and flows for judge walkthrough. |
| DOC-005 | Database Schema | `/foundation_pack/SRS/database_schema.json` | JSON | Foundation | Help / Docs viewer | Entities and relationships. |
| DOC-006 | Data Contracts | `/foundation_pack/SRS/data_contracts.json` | JSON | Foundation | Help / Docs viewer | Ingestion and internal data shapes. |
| DOC-007 | NFR Budgets | `/foundation_pack/SRS/nfr_budgets.json` | JSON | Foundation | Help / Docs viewer | Performance budgets for demo reliability. |
| DOC-008 | Test Plan & CI | `/foundation_pack/SRS/test_plan_and_ci.json` | JSON | Foundation | Help / Docs viewer | Test cases and CI commands. |
| DOC-009 | Agentic Prompt Gates | `/foundation_pack/SRS/agentic_prompt_gates.json` | JSON | Foundation | Help / Docs viewer | Prompt-level guardrails for automation. |
| DOC-010 | Technical Requirements (TRD) | `/foundation_pack/SRS/trd.json` | JSON | Foundation | Help / Docs viewer | Implementation guidance and constraints. |
| DOC-011 | Assumptions | `/foundation_pack/assumptions.json` | JSON | Foundation | Help / Docs viewer | Assumptions to revisit and validate. |
| DOC-012 | Open Questions | `/foundation_pack/open_questions.json` | JSON | Foundation | Help / Docs viewer | Unknowns and blockers tracking. |
| DOC-013 | Questionnaire Answers | `/foundation_pack/user_questionnaire_answers.json` | JSON | Foundation | Help / Docs viewer | Answered questionnaire to ground requirements. |
| DOC-014 | Pilot Dataset (n=66) | `/pilot/pilot_dataset_n66.csv` | CSV | Data | Pilot Results, Export Report | De-identified pilot dataset used for dashboard validation. |
| DOC-015 | External Sources Overview | `/external_sources_for_Gut_overview.txt` | TXT | Reference | Help / Docs viewer | Source list used for evidence and background. |
| DOC-016 | Reference Data Build Notes | `/reference/README_data_build.md` | MD | Reference | Help / Docs viewer | How reference snapshots were prepared. |
| DOC-017 | References & Licenses | `/reference/REFERENCES_AND_LICENSES.md` | MD | Reference | Help / Docs viewer | Licenses and attribution notes for reference snapshots. |
| DOC-018 | Upload Manifest (SHA256) | `/UPLOAD_FILES_MANIFEST.md` | MD | Reference | Help / Docs viewer | Integrity list of uploaded artifacts with hashes. |
| DOC-019 | Guser guide | `/docs/cognibiome_user_guide.md` | MD | Foundation | Help / Docs viewer | Judge walkthrough + full UI reference. |
| DOC-020 | Public Datasets Manifest | `/reference/public_datasets_manifest.json` | JSON | Data | Public Datasets, Help / Docs viewer | Manifest of bundled reference snapshots with provenance and sha256. |
| DOC-021 | NHANES Nutrient Reference (2021–2022) | `/reference/nhanes_nutrient_reference.csv` | CSV | Data | Simulator (NHANES ranges), Public Datasets | Nutrient variable codebook ranges from NHANES DR1TOT_L (2021–2022). No participant-level data. |
| DOC-022 | Public Datasets README | `/reference/public_datasets_README.md` | MD | Data | Public Datasets, Help / Docs viewer | Provenance notes for all reference snapshots included or attempted. |
| DOC-023 | Implementation Plan (Lovable) | `/docs/implementation_plan.md` | MD | Foundation | Help / Docs viewer | Lovable implementation plan used as build roadmap (Phase 1–3). |
| DOC-024 | Project Plan (PDF → JSON) | `/docs/project_plan_pdf.json` | JSON | Foundation | Help / Docs viewer | Extracted text from Project Plan.pdf, stored as JSON for offline Docs viewer. |
| DOC-025 | Project Abstract (PDF → JSON) | `/docs/project_abstract_pdf.json` | JSON | Foundation | Help / Docs viewer | Extracted text from Project Abstract.pdf, stored as JSON for offline Docs viewer. |

---

## 9. Project plan alignment (what is implemented vs next phase)

### 9.1 Implemented in this build
- Offline-first app shell (PWA cache)
- Pilot dataset ingestion and validation-only analytics
- Deterministic 3-stage simulator (with demo artifacts)
- Export (HTML)
- Methods & Rigor section (guardrails + data-source transparency)
- Public dataset status screen (manifest-driven, offline)
- Help / Docs viewer (offline document transparency)

### 9.2 Not implemented yet (and why)
These items are implied by the project plan’s “train three supervised models on public datasets” method, but are **not** implemented inside the browser app:

1) **Full public dataset ingestion and preprocessing** (NHANES/HMP/American Gut/Metabolomics Workbench/MetaboLights)
   - reason: raw omics datasets are large and require heavy preprocessing not suitable for a judge-demo browser runtime

2) **Offline training pipeline**
   - reason: training belongs in a separate reproducible Python workflow (outside the web app)

3) **Model artifact export from trained models**
   - planned: export trained models into compact JSON artifacts and replace `/public/models/stage*.json`

4) **Quartile overlays in Pilot Results**
   - UI toggle exists, but chart overlays are not rendered yet

### 9.3 How next phase should be done (practical plan)
- Implement a **Python training + export pipeline** that produces:
  - `stage1.json`, `stage2.json`, `stage3.json` (or ONNX + small runtime)
  - a `MODEL_CARD.md` describing training datasets, pairing logic, and validation
- Keep the web app runtime simple:
  - only loads frozen artifacts
  - never trains in the browser
- Expand the `/public/reference/…` pack with small, properly licensed snapshots that support UI evidence cards.

---

## 10. Local development

### 10.1 Prerequisites
- Node.js (LTS recommended)
- npm (or bun)

### 10.2 Commands
- `npm install`
- `npm run dev` (local dev server)
- `npm run test` (Vitest)
- `npm run build` (production build)

---

## 11. Known limitations (explicit)

- Simulator artifacts are **demo placeholders** in this repo (not trained models).
- MiMeDB snapshot is a **curated subset** and includes limitations recorded in its metadata.
- Pilot quartile overlays are not implemented.
- No PDF rendering directly; PDFs must be converted to JSON/MD for the Docs viewer.

---

## 12. Main screen screenshots

### Dashboard
![Dashboard](/docs/screenshots/dashboard.png)

### Pilot Results
![Pilot Results](/docs/screenshots/pilot-results.png)

### Simulator
![Simulator](/docs/screenshots/simulator.png)

### Compare Scenarios
![Compare Scenarios](/docs/screenshots/compare.png)

### Public Datasets
![Public Datasets](/docs/screenshots/datasets.png)

### Help / Docs
![Help / Docs](/docs/screenshots/help-docs.png)

