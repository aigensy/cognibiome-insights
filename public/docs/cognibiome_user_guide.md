# CogniBiome — User Guide (Judge Walkthrough + Full UI Reference)

## 1. Project goal

**Goal:** Provide an **offline-first**, **deterministic** web app that:

1) Shows **real results** from a de-identified teen pilot dataset (**n=66**) as transparent charts and statistics (diet score vs cognitive tests).

2) Demonstrates a **mechanistic hypothesis pipeline** as a deterministic simulator:

**Diet inputs (D)** → **modeled microbiome proxies (X)** → **modeled metabolite / neurotransmitter-precursor proxies (M)** → **modeled cognition outputs (Y)**

3) Enforces scientific guardrails in UI language:
- **Not medical advice**
- **Not a diagnostic tool**
- **Not a proof of causality**
- Pilot dataset is **validation-only** (not used for training)

---

## 2. How the goal is achieved (what the app actually does)

### 2.1 Offline-first operation
- The app ships all demo data as static files under `/public/**` (pilot CSV, model JSONs, reference JSONs, and the foundation pack).
- A PWA service worker caches app assets (JS/CSS/HTML/JSON/CSV/TXT/MD) after first load, so the demo can run with no network.

### 2.2 Deterministic simulator with provenance
- The simulator reads **frozen model artifacts** from:
  - `/public/models/stage1.json` (D→X)
  - `/public/models/stage2.json` (X→M)
  - `/public/models/stage3.json` (M→Y)
- A **Run Hash** is computed as **SHA-256** of:
  - normalized diet inputs + model version identifiers
- The run is saved locally (browser **localStorage**) so it can be:
  - compared (Compare Scenarios)
  - exported (Export Report)

### 2.3 Separation of pilot dataset vs simulator
- The teen pilot dataset is loaded from `/public/pilot/pilot_dataset_n66.csv`.
- The app computes:
  - summary statistics (mean, median, SD, min, max)
  - Pearson correlations (diet score vs each cognitive metric)
- Pilot results are **computed live from CSV**, and the simulator is **not trained inside the app**.

---

## 3. Global UI and navigation

### 3.1 Layout
- Left **Sidebar**: main navigation.
- Top **App Bar**:
  - Offline status badge
  - Presenter Mode toggle
  - Reset Demo State (hidden in Presenter Mode)
  - Docs button (Help / Docs screen)

### 3.2 Sidebar items (normal mode)
- Dashboard
- Pilot Results
- Simulator
- Compare Scenarios
- Export Report
- Methods & Rigor
- Public Datasets
- Help / Docs is opened from the top bar (Docs button).

### 3.3 Presenter Mode
**Presenter Mode** is designed to reduce UI noise during judging.
Effects:
- Sidebar shows only the “judge path” items: **Dashboard, Pilot Results, Simulator, Compare Scenarios**
- Reset button is hidden
- Some descriptive helper text is hidden (for example, diet slider descriptions in Simulator)

### 3.4 Admin Mode (CSV upload)
Admin Mode is enabled by adding a query param to the URL:

- `?admin=true`

Effects:
- “ADMIN” badge appears in the top bar
- Pilot Results screen shows an **Upload CSV** control

Admin Mode does not add model-upload controls in this build.

### 3.5 Reset Demo State
Top bar → **Reset** (not available in Presenter Mode).

Reset does:
- Clears saved simulation runs from localStorage
- Resets Simulator inputs to default values
- Clears the loaded pilot dataset in memory (it will be reloaded automatically when you open Dashboard or Pilot Results)

---

## 4. Screen-by-screen guide

## 4.1 Dashboard (`/`)
**Purpose:** A fast “home base” for judges and presenters.

### What you see
- Project title line: “Modeling Diet-Driven Microbiome and Neurotransmitter Pathways Influencing Cognitive Performance”
- Badges:
  - Demo Param Set v0
  - Pilot dataset row count (if loaded)
  - Number of saved simulation runs
- Navigation tiles:
  - Pilot Results
  - Simulator
  - Export Report
  - Methods & Rigor
  - Compare Scenarios

### Buttons and behavior
- Clicking a tile navigates to the corresponding screen.
- In Presenter Mode, a “2-Minute Demo Path” card appears:
  - Pilot Results → Methods & Rigor → Simulator → Export

---

## 4.2 Pilot Results (`/pilot`)
**Purpose:** Show the real teen pilot dataset (n=66) with honest, computed statistics.

### Data loading behavior
- On first open, the app automatically loads `/public/pilot/pilot_dataset_n66.csv`.
- The dataset is validated strictly:
  - Required numeric columns must exist:
    - `diet_score`, `stroop_test`, `language_test`, `memory_test`, `logical_test`, `overall_score`
  - Integrity rule check:
    - `overall_score` must equal the sum of the four subtests (tolerance ±0.15)

### What you see (when dataset is valid)
1) **REAL DATA badge**
- “REAL DATA (de-identified teen pilot, n=66) • computed live from CSV • no synthetic points”

2) **Dataset Metadata**
- Rows
- Source (bundled vs upload)
- Loaded time
- SHA-256 (computed from raw CSV text)

3) **Summary Statistics table**
- n, mean, median, SD, min, max per metric

4) **Correlations table**
- Pearson r (diet score vs each cognitive metric, including overall)
- Approximate p-value (with a warning: not proof of causality)

5) **Scatter plots**
- One scatter plot for each cognitive metric vs diet score
- Optional regression line overlay

### Controls
- **Regression line** toggle:
  - ON: displays a regression line overlay per chart
  - OFF: scatter only

- **Show quartiles** toggle:
  - **Current behavior in this build:** the toggle changes state but does not change any chart output (quartile rendering is not implemented yet).

### Admin-only: Upload CSV
Visible only in Admin Mode (`?admin=true`).
- Uploading a CSV replaces the current dataset in memory for this session.

### Special case: multiple Diet Score columns
If the uploaded CSV contains multiple diet score columns with different values:
- A dialog appears asking you to select the canonical diet score column.
- Stats and charts are blocked until you confirm the selection.

---

## 4.3 Simulator (`/simulator`)
**Purpose:** Run a deterministic “Diet → Microbiome → Metabolites → Cognition” pipeline.

### Inputs (D)
Four sliders (proxy units):
- Fiber Intake (g/day proxy)
- Added Sugar (g/day proxy)
- Saturated Fat (g/day proxy)
- Omega-3 / PUFA (g/day proxy)

Below the sliders:
- **Derived Diet Score (proxy)** badge
  - This is a deterministic function of the four inputs.

### Run Simulation button
Click **Run Simulation**:
- Loads model artifacts from `/public/models/stage1.json`, `stage2.json`, `stage3.json`
- Computes outputs deterministically
- Computes a SHA-256 **Run Hash**
- Saves the run into localStorage
- Shows a toast notification with the hash prefix

### Outputs (X, M, Y)
Outputs are always labeled as **MODELED PROXY** (not measured in pilot teens).

**Microbiome (X)**
- Bifidobacterium (relative abundance proxy)
- Lactobacillus (relative abundance proxy)
- Firmicutes:Bacteroidetes ratio (proxy)

**Metabolites (M)**
- acetate (proxy score)
- propionate (proxy score)
- butyrate (proxy score)
- 5-HTP precursor index (proxy)

**Cognition (Y)**
- Stroop test (modeled)
- Language test (modeled)
- Memory test (modeled)
- Logical reasoning (modeled)
- Overall score (sum of the four modeled subtests)

### Provenance panel
- Shows full Run Hash
- Mentions demo-parameter disclaimer in non-presenter mode:
  - “Demo parameters (directional), replaceable”
  - “Frozen before pilot validation” (wording only; no performance numbers are shown)

---

## 4.4 Compare Scenarios (`/compare`)
**Purpose:** Compare two saved simulation runs side-by-side.

### Prerequisite
You must have at least two saved runs (run the Simulator twice with different inputs).

### Controls
- **Run A** dropdown
- **Run B** dropdown
- **Swap A/B** button

### Output
Tables showing Run A, Run B, and differences:
- Diet inputs + diet score proxy
- Microbiome outputs
- Metabolite outputs
- Cognition outputs

Delta columns:
- Δ (B − A)
- % Δ = (B − A) / |A| × 100

Color semantics:
- Green: B higher than A
- Red: B lower than A
- Grey: no change or undefined (%Δ when A=0)

---

## 4.5 Export Report (`/export`)
**Purpose:** Generate a judge-friendly, 1-page report for a selected run.

### Prerequisite
At least one saved simulation run must exist.

### Step-by-step
1) **Select Run** (dropdown)
2) Choose options:
   - Include Pilot Summary (on by default)
   - Include Leakage Checklist (on by default)
3) Export:
   - **Download HTML**: saves a self-contained HTML file
   - **Print to PDF**: opens a new tab and triggers the browser print dialog (use “Save to PDF”)

### What the HTML report contains
- Run provenance:
  - Run Hash
  - Timestamp
  - Stage model identifiers (from model artifacts)
- Inputs:
  - fiber, sugar, sat fat, omega-3
  - diet score proxy
- Outputs:
  - microbiome proxies
  - metabolite proxies
  - cognition proxies
- Optional Pilot Summary:
  - Summary statistics
  - Correlations table (with p-value approximation disclaimer)
  - If pilot dataset is not loaded, report shows: “Cannot confirm — pilot dataset not loaded.”
- Optional Leakage Guardrails Checklist:
  - Validation-only pilot
  - No peeking during tuning
  - Fit-only-on-train (conceptual)
  - Duplicate awareness
- Disclaimers:
  - non-causal
  - non-diagnostic
  - modeled proxies
  - pilot validation-only
  - demo-parameter disclaimer

---

## 4.6 Methods & Rigor (`/methods`)
**Purpose:** Provide judge-facing guardrails, limitations, and reference evidence.

### Section A: Limitations & scientific wording
Cards explicitly state:
- Microbiome/metabolites are modeled proxies (not measured in pilot teens)
- The simulator does not prove causality
- Not medical advice, not a diagnostic device
There is also a short paragraph restating the boundary between modeled proxies and measured pilot outcomes.

### Section B: Leakage Guardrails
A checklist-style UI presenting leakage prevention statements.
Important: the checklist is informational. It does not compute leakage metrics.

### Section C: Data Sources (Paired vs Unpaired)
A table listing stages and dataset types (for transparency).
Note: In this build, the simulator itself does not load NHANES or other large public datasets at runtime. See the “Public Datasets Status” screen for the honest implementation status.

### Section D: MiMeDB Evidence
A local snapshot viewer for the MiMeDB-based reference file:
- Loads `/public/reference/mimedb.json`
- Shows:
  - snapshot metadata (row counts and matched items)
  - license line
  - search bar
  - tabs:
    - Microbe↔Metabolite Links
    - Metabolites
    - Microbes

If the file is missing:
- Displays a message and suggests running:
  - `npm run build:mimedb`

**Known issue (source review):** the current UI expects link fields named `evidence` and `note`, but the generated JSON provides `evidence_note` and `literature_context`. As a result, the “Evidence” and “Note” columns in the links table may render as blank in this build.

---

## 4.7 Public Datasets Status (`/datasets`)
**Purpose:** A judge-facing, honest status page for the large public datasets listed in the Project Plan, plus the **offline reference snapshots** that are actually bundled in this build.

### 4.7.1 Public datasets list (plan vs what is bundled)
The screen lists:
- NHANES
- HMP
- American Gut
- Metabolomics Workbench
- MetaboLights

For each dataset, it shows:
- What it is
- Intended role in the 3-stage pipeline (D→X→M→Y)
- Current status in this app: **Snapshot bundled** vs **Not bundled**
- If not bundled: **why** (licensing/size/access) + where to download officially (links are shown but the app does not fetch them)

### 4.7.2 Offline snapshot manifest (what ships with the demo)
This build loads the manifest file:
- `/public/reference/public_datasets_manifest.json`

The manifest is the source-of-truth for:
- `included: true/false`
- `row_count` (for included snapshots)
- `sha256` for integrity
- `reason` for excluded datasets
- `provenance` (source_url + notes)

**Current packaged snapshot (included=true):**
- **NHANES nutrient dictionary (2021–2022 DR1TOT_L codebook)**
  - `/public/reference/nhanes_nutrient_reference.csv`

**Not bundled in this snapshot pack (included=false):**
- HMP
- American Gut
- MetaboLights
- Metabolomics Workbench

### 4.7.3 NHANES snapshot viewer
For included datasets, the page provides:
- A table preview (with search) for the snapshot file
- A “Download” action (static file download)
- A “Open in Docs” action (opens the same file in `/help`)

For NHANES specifically, the table shows:
- `variable_code`, `nutrient_name`, `unit`, `min_value`, `max_value`, `source_year_range`

**Important:** NHANES values here are **reference ranges from the codebook**, not participant-level data and not “training data” inside the app.


## 4.8 Help / Docs (`/help`)
**Purpose:** Offline documentation viewer for judges and for audit transparency.

**User Guide in Docs:** This guide itself is available in the Docs viewer (Foundation tab) once it is placed under `/public/docs/` and indexed in `/public/foundation_pack/docs_index.json`.

### Docs viewer quality fixes (important for judging)
This build intentionally avoids showing placeholder text when a field is missing.
Examples of fixes:
- If a JSON document does not include `purpose` / `objective`, those sections are **not rendered** (no “cannot confirm (missing field)” lines).
- If a section is an array of objects (for example, `data_sources`, `evidence`, `sources`), the viewer renders a **compact table** instead of raw `{...}` JSON blobs.
- CSV files render as a **table preview** (with basic paging/search) rather than raw text.


### Data source
- Loads `/public/foundation_pack/docs_index.json`
- Uses the `items[]` list to display all available documents.

### Search and filtering
- Search input filters documents by title, description, or path.
- Documents are grouped by category tabs.

### Viewer behaviors
When a document is selected:
- The viewer fetches the file path listed in docs_index.
- Two rendering modes are available for JSON:
  - Human View: summarized, human-readable sections (best for judges)
  - Raw JSON: formatted JSON

Other formats:
- CSV: renders a table preview of the first 100 data rows (RFC-4180 parser, supports quoted commas/newlines)
- Markdown: rendered as formatted markdown
- TXT/other: displayed in a monospaced preformatted view

### Buttons
- Copy: copies the current document text to clipboard
- Download: downloads the currently viewed document

---

## 4.9 Not Found (`/*`)
If a route does not exist, the app shows a 404 page with a link back to `/`.

---

## 5. Implementation notes from source review (what to be aware of)

These are not “science limitations”, but practical notes about the current build:

1) **Pilot Results quartiles toggle is not implemented.**
   - UI control exists, but charts do not change.

2) **MiMeDB links table field mismatch**
   - UI expects `evidence` / `note`
   - JSON provides `evidence_note` / `literature_context`

3) **No model-upload UI**
   - The simulator always reads `/public/models/stage*.json`
   - There is no admin UI to load replacement trained artifacts in this build

4) **Caution about dataset wording**
   - Some “Data Sources” text appears as hard-coded narrative.
   - The “Public Datasets Status” screen is the accurate place where “implemented vs not implemented” is documented.

---

## 6. Project Plan features that are not implemented in this build (and why)

This section maps directly to the **Project Plan** procedure and analysis items. The language below is intentionally judge-appropriate: factual, cautious, and explicit about scope.

### 6.1 External dataset ingestion and preprocessing (not implemented)
Project Plan steps 1–9 describe downloading and preprocessing:
- NHANES dietary intake (nutrients like fiber, sugar, sat fat, omega-3 proxies)
- USDA nutrient definition standardization
- public microbiome abundance profiles (genus tables, compositional transforms)
- metabolomics datasets (SCFAs and neurotransmitter-related metabolites)
- harmonization of metabolite IDs, units, and missing data handling

**Current app status:** Not implemented.
- The app ships only small offline reference snapshots under `/public/reference/`, and does not run large dataset ingestion, harmonization, or transformations in the browser.

**Why not implemented for Monday judging (honest reason):**
- These datasets are large and require offline data engineering and careful data-use review.
- Implementing a correct preprocessing pipeline is out of scope for a safe, reproducible, offline demo build, and shipping partial processing without full provenance would increase the risk of scientific misinterpretation.

### 6.2 Training the 3 supervised learning models (not implemented)
Project Plan steps 11, 13, 15 describe training:
- Diet → Microbiome model
- Microbiome → Metabolites model
- Metabolites → Cognition model

**Current app status:** Not implemented inside the app.
- The app uses **Demo Param Set v0** (linear coefficients in JSON) and labels it as “directional, replaceable”.

**Why not implemented for Monday judging:**
- Training requires computational notebooks, validated feature engineering, and reproducible train/validation splits.
- This build prioritizes deterministic behavior and correct scientific disclaimers over rushing an unvalidated training pipeline into the demo.

### 6.3 Cross-validation and performance metrics (not implemented)
Project Plan includes cross-validation and metrics:
- R², MAE, RMSE
- cross-dataset testing for generalizability

**Current app status:** Not implemented.
- The app does not display model performance metrics for stages 1–3.

**Why not implemented:**
- The simulator parameters are not trained artifacts yet.
- Displaying performance metrics would require trained models and reproducible evaluation, otherwise it would be misleading.

### 6.4 Explainable AI (SHAP and permutation importance) (not implemented)
Project Plan includes explainability:
- SHAP values
- permutation importance

**Current app status:** Not implemented.
- There is no SHAP computation or SHAP JSON artifact in this build.
- The Public Datasets page explicitly documents this gap.

**Why not implemented:**
- SHAP is typically computed offline during model training (not efficiently in-browser).
- For a judge-ready offline demo, the correct path is to export small SHAP summary artifacts after training, then render them in the UI. That offline training step is not included in this build.

### 6.5 Pipeline integration using trained models (partially implemented as a demo)
Project Plan step 17 describes integrating the three trained models into an end-to-end pipeline.

**Current app status:** Implemented as a deterministic pipeline, but using demo coefficients:
- D→X→M→Y runs end-to-end in the Simulator.
- Outputs are labeled as modeled proxies.

**Why only partial:**
- The integration structure is implemented so judges can see the intended scientific pipeline and reproducibility plan.
- The trained artifacts and their provenance are not included yet, so the pipeline is a functional demonstration, not a final trained model deployment.

### 6.6 Validation against the teen pilot dataset (implemented only as pilot statistics, not as model validation)
Project Plan step 16 describes validating cognitive outcome predictions against the teen pilot dataset.

**Current app status:**
- The Pilot Results page computes correlations and summary stats from the real pilot dataset.
- The simulator does not perform a formal “prediction vs observed” validation comparison because the simulator is not yet a trained model.

**Why not implemented as formal validation:**
- Formal validation requires trained models and a defined evaluation protocol (for example, prediction error metrics on the pilot set).
- The pilot is treated as validation-only and remains isolated from any training in this build.

### 6.7 Simulation analyses (implemented, but based on demo parameters)
Project Plan step 18 describes simulation analyses by changing dietary variables (fiber up, sugar down) and recording predicted effects.

**Current app status:** Implemented in the Simulator and Compare Scenarios:
- You can change diet inputs and generate deterministic outputs.
- You can compare scenario outputs side-by-side.

**Judge-facing wording to use:**
- “These are deterministic simulated outputs based on a transparent demo parameter set. They demonstrate the pipeline behavior and reproducibility, not a final trained prediction model.”

---

## 7. Recommended judge walkthrough (2 minutes)
1) Dashboard: show purpose + disclaimers
2) Pilot Results: show REAL DATA badge, charts, and correlations
3) Methods & Rigor: show limitations + leakage guardrails
4) Simulator: run one scenario and show run hash
5) Compare: compare two scenarios (if time)
6) Export: download HTML or print to PDF