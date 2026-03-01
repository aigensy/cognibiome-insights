# CogniBiome — Presenter Guide (Presenter Mode)

**Generated (UTC):** 2026-03-01  
**Purpose:** a live demo script + a self-contained reference covering every screen, control, and likely judge question.  
**How to open this guide:** Presenter Mode ON → sidebar → **Presenter Guide** (the only doc link visible in Presenter Mode).

---

## 0) The 20-second framing (say this first)

"CogniBiome is an **offline-first** science-fair demo app that models the **diet → microbiome → metabolites → cognition** pathway.  
It is **not** a diagnostic tool and does **not** claim causality. It is a transparent simulator + a validation view using a small real pilot dataset."

---

## 1) Presenter setup checklist (before judges arrive)

1. Open the app at `/`.
2. Turn **Presenter Mode ON** (Top bar → **Presenter**).
3. Press **F11** (full-screen) if allowed.
4. Confirm the top-left shows **OFFLINE-FIRST**.
5. Confirm Dashboard shows:
   - `Pilot: n=66` (or "loaded")
   - `Runs: 0` (ideally — reset if needed)
6. If you need to clean state between judging groups:
   - Turn Presenter Mode **OFF**
   - Click **Reset** (top-right)
   - Turn Presenter Mode **ON** again

**Note:** Reset is intentionally hidden while Presenter Mode is ON to keep the judge path clean.

---

## 2) What Presenter Mode changes (explain only if asked)

Presenter Mode is a "demo simplifier":

- The sidebar shows **only** the four judge-path screens:
  - Dashboard (`/`)
  - Pilot Results (`/pilot`)
  - Simulator (`/simulator`)
  - Compare Scenarios (`/compare`)
- Plus this **Presenter Guide** link (the only doc accessible in Presenter Mode).
- The full Docs section, Export Report, Methods & Rigor, and Public Datasets are hidden to reduce visual noise.
- The app remains **offline-first** and makes **no runtime API calls** regardless of mode.

---

## 3) Top bar controls (everything the judge can see)

| Control | Where | What it does | What to say (1 line) |
|---|---|---|---|
| **OFFLINE-FIRST** badge | top-left | reminds that the demo works without network | "This demo is offline-first; all files are bundled." |
| **OFFLINE** indicator | top-left (when browser reports no network) | reflects browser network state | "Even if this shows OFFLINE, the app still works." |
| **Presenter / Presenter ON** | top-right | toggles Presenter Mode | "Presenter Mode narrows the app to the judge path." |
| **Reset** | top-right (only when Presenter Mode OFF) | clears local runs + resets simulator + reloads pilot CSV | "Reset makes the next demo repeatable." |
| **Presenter Guide** | sidebar (only when Presenter Mode ON) | opens this guide in the Docs viewer | "This is our demo runbook, accessible inside the app." |

---

## 4) The 2-minute demo script (recommended)

### 4.1 Dashboard (`/`) — 20 seconds

**Do:** Point to title + OFFLINE-FIRST badge.  
**Say:**
- "This is the offline-first demo dashboard."
- "Pilot dataset is loaded (n=66), and runs are stored locally in the browser."

**Do:** Click **Pilot Results** in the sidebar.

---

### 4.2 Pilot Results (`/pilot`) — 45 seconds

**What to show**
- The **REAL DATA** badge: *"de-identified teen pilot, n=66; computed live from CSV; no synthetic points."*
- The scatter plots: Diet Score vs each cognitive metric (stroop, language, memory, logical, overall).
- The two toggles:
  - **Regression line** — draws a least-squares fit line per plot
  - **Show quartiles** — shows distribution quartiles (UI toggle exists; chart overlay is a planned phase-2 feature)

**Script**
1. "This page is the **validation anchor**. These points are real pilot measurements; nothing here is simulated."
2. Turn **Regression line ON**: "We compute simple regression live from the CSV. p-values are approximate and **not causal proof**."
3. Turn **Show quartiles ON**: "Quartiles show distribution and robustness, not causality."

**Do:** Click **Simulator** in the sidebar.

---

### 4.3 Simulator (`/simulator`) — 40 seconds

**What to show**
- Diet input sliders:
  - **Fiber Intake** (g/day proxy)
  - **Added Sugar** (g/day proxy)
  - **Saturated Fat** (g/day proxy)
  - **Omega-3 / PUFA** (g/day proxy)
- Derived **Diet Score (proxy)** — computed from the sliders
- **Run Simulation** button
- Result panels: Microbiome proxy → Metabolite proxies → Cognition outputs

**Script**
1. "Now we simulate the **mechanistic chain** in three stages: Diet inputs → Microbiome proxies → Metabolite proxies → Cognitive domain outputs."
2. Move one slider (example: increase Fiber to high, decrease Added Sugar to low).  
   "Changing diet inputs shifts the predicted microbiome composition, which shifts metabolite levels, which shifts the cognitive output estimates."
3. Click **Run Simulation**. "The run is deterministic — same inputs always produce the same outputs — and saved locally with a unique run hash for reproducibility."

**Do:** Run a second scenario (example: raise Added Sugar, lower Fiber), then click **Compare Scenarios**.

---

### 4.4 Compare Scenarios (`/compare`) — 15 seconds

**What to show**
- Select **Scenario A** and **Scenario B** from the dropdowns
- The Δ (delta) columns: absolute difference and percent change between runs

**Script**
- "Here we compare two scenarios side-by-side. The delta columns show exactly how diet changes propagate through all three model stages."

**Stop here** for a strict 2-minute demo.

---

## 5) Scientific background (have this ready for deeper questions)

### The 3-stage model pipeline

| Stage | Input → Output | What it models |
|---|---|---|
| **Stage 1** | Diet inputs → Microbiome proxies | How diet composition influences gut microbiome genus-level composition (Firmicutes/Bacteroidetes ratio, butyrate producers, etc.) |
| **Stage 2** | Microbiome proxies → Metabolite proxies | How microbiome composition influences key metabolites: SCFAs (butyrate, acetate, propionate), tryptophan, serotonin, GABA, indoles |
| **Stage 3** | Metabolite proxies → Cognitive outputs | How gut metabolites influence cognitive domain scores via the gut–brain axis |

### The pilot dataset (n=66 de-identified teens)
- **What it is:** dietary survey scores and cognitive test scores from a small pilot study.
- **What it is not:** microbiome or metabolomics measurements — those are not in the pilot data.
- **How it is used:** validation only. The pilot data appears in the Pilot Results scatter plots. It is **never used for model training**.
- **What the scatter plots show:** correlations between Diet Score (composite) and cognitive test scores. Positive correlations are directionally consistent with the model hypothesis.

### Key metabolites (gut–brain axis)
- **Short-chain fatty acids (SCFAs):** butyrate, acetate, propionate — produced by gut bacteria fermenting dietary fiber; butyrate in particular has anti-inflammatory and neuroprotective roles.
- **Tryptophan pathway:** gut bacteria modulate tryptophan availability; tryptophan is the precursor for serotonin (~90% of which is produced in the gut) and for indoles including indole-3-propionic acid (neuroprotective).
- **GABA:** certain Lactobacillus and Bifidobacterium strains produce GABA, the main inhibitory neurotransmitter.

### What "proxy" means
All simulator outputs are clearly labeled as **modeled proxies** — estimates from a deterministic linear coefficient model, not measured biomarkers. The model is a hypothesis generator for educational purposes.

---

## 6) If judges ask deeper questions (how to exit Presenter Mode safely)

Presenter Mode intentionally hides three pages. To show them:

1. Toggle Presenter Mode **OFF** (top-right button)
2. Navigate to the relevant page
3. Toggle back ON when done

### What is on each hidden page

#### Methods & Rigor (`/methods`)
- **"What this is / what it is not"** disclaimer block
- **Leakage guardrails checklist** — documents how pilot data is isolated from training
- **Data source table** — which public datasets feed which model stage (D→X, X→M, M→Y, validation)
- **MiMeDB snapshot explorer** — searchable table of microbe ↔ metabolite reference associations (literature-derived, labeled "cannot confirm from official CSV" per provenance rules)

**What to say:** "This is the transparency layer: disclaimers, limitations, and a full data-boundary checklist."

#### Public Datasets (`/datasets`)
- A manifest-driven table showing which of the five project-plan datasets are bundled and which are not.
- Five datasets tracked: **NHANES**, **HMP**, **American Gut**, **MetaboLights**, **Metabolomics Workbench**.
- All five currently show **Bundled = Yes** — but for HMP, American Gut, MetaboLights, and Metabolomics Workbench, "bundled" means a **metadata-only offline snapshot** (study IDs, accession numbers, official entry-point URLs), not the full raw data (too large / usage constraints).
- The NHANES snapshot is a small CSV of nutrient variable codebook ranges — no participant-level data.

**What to say:** "This table is driven by a local manifest file. Some datasets are full snapshots; for large or restricted datasets we bundle metadata-only reference indexes."

#### Export Report (`/export`)
- Select a saved run, toggle options (pilot summary, leakage checklist), then click **Generate**.
- Produces a single-page HTML report you can download or print.
- Report includes: run hash, model versions, diet inputs, modeled outputs, disclaimers.

**What to say:** "We can generate a one-page reproducible summary of any run. The run hash lets you verify the exact inputs that produced these outputs."

---

## 7) Common judge questions (short answers)

- **"Is this causal?"**  
  "No. The app explicitly labels all outputs as modeled proxies. It is a hypothesis generator, not causal proof. p-values in the pilot plots are descriptive, not confirmatory."

- **"Where is the real microbiome or metabolomics data?"**  
  "The pilot dataset contains dietary scores and cognitive test scores only — no biomarker measurements. The app uses reference snapshots from five public datasets as evidence context, but those snapshots are metadata-only for the large datasets. Full raw omics data are not bundled due to size and usage constraints."

- **"How do you avoid data leakage?"**  
  "Pilot data is used only in the Pilot Results validation plots. The simulator runs on frozen coefficient artifacts and does not train in-app. There is no path from the pilot CSV to the model coefficients."

- **"Can you reproduce the same run?"**  
  "Yes. The simulator is deterministic — same slider inputs always produce the same numeric outputs. Each run is saved locally with a run hash computed from the normalized inputs and model versions."

- **"What are the model coefficients based on?"**  
  "The current build uses demo placeholder coefficients — directionally reasonable but not trained on the full public datasets. Phase 2 plans an offline Python training pipeline using the five public datasets, with trained artifacts replacing the placeholders."

- **"What is the sample size?"**  
  "The pilot study has n=66 de-identified teens. This is a small sample sufficient for a hypothesis-generating science fair demo but not for clinical conclusions."

- **"Why only four pages in Presenter Mode?"**  
  "Presenter Mode is intentionally minimal — it shows the core demo flow. The full app has additional pages (Methods & Rigor, Export, Public Datasets, Docs) accessible by turning Presenter Mode off."

- **"Is the data private?"**  
  "The pilot dataset is de-identified. No personally identifiable information is stored or displayed. All data processing happens locally in the browser — nothing is transmitted to any server."

---

## 8) Presenter "do not do this"

- Do **not** claim the simulator proves causality. Always say "modeled proxy" or "hypothesis generator."
- Do **not** claim the external datasets are fully raw-data bundled — they are metadata-only snapshots for the four large datasets.
- Do **not** present p-values from the pilot plots as statistically significant proof; say "directionally consistent" or "descriptive signal."
- Do **not** claim the model coefficients were trained on the full public datasets in this build — they are demo placeholders.
- Do **not** claim the app runs server-side code — all processing is client-side in the browser.

---

## 9) Reference: where to find things in the full app (Presenter Mode OFF)

| Topic | Where to look |
|---|---|
| Causality / leakage disclaimers | Methods & Rigor (`/methods`) → "What this is / what it is not" |
| Data source table (which dataset feeds which stage) | Methods & Rigor (`/methods`) → Data source table |
| Microbe ↔ metabolite reference associations | Methods & Rigor (`/methods`) → MiMeDB snapshot explorer |
| Dataset bundling status | Public Datasets (`/datasets`) |
| Run report (downloadable HTML) | Export Report (`/export`) |
| All supporting docs (SRS, BRD, User Guide, etc.) | Help / Docs (`/help`) — Foundation, Data, Reference tabs |
| This Presenter Guide (full) | Help / Docs (`/help`) → Foundation → Presenter Guide (DOC-026) |
