# CogniBiome — Presenter Guide (Presenter Mode)

**Generated (UTC):** 2026-03-01  
**Purpose:** a live demo script + a self-contained reference covering every screen, control, and likely judge question.  
**How to open this guide:** Presenter Mode ON → sidebar → **Presenter Guide** (the only doc link visible in Presenter Mode).

---

## One-sentence disclaimer (say this at any point if needed)

> "This version is an **educational hypothesis generator**, not a medical device."

---

## 1) Final Speech

### Decoding the Gut–Brain Axis: From Honest Simulation to Real-World Machine Learning

Good morning judges. My name is Yana Evteeva.

My question is simple, but the biology is complex:
If diet is linked to attention and memory, what physical pathway could connect the food on our plate to performance in the brain through the gut–brain axis?

Step 1 was real data.
In 2025, I collected de-identified pilot data from 66 high school students. Each student completed a diet survey and four cognitive tests: Stroop, memory recall, language, and logical reasoning.

When I analyzed the dataset, diet score showed a moderate positive relationship with overall cognitive score: Pearson r about 0.37, with an approximate two-tailed p around 0.003.
But the pattern was the most important part: language and logical reasoning showed clearer relationships, while Stroop and memory were much weaker in this sample.
So my pilot supports correlation, not causation, and it does not prove a biological mechanism.

Step 2 was the hard part: building a mechanism you can see.
We know gut microbes transform diet into bioactive molecules, including short-chain fatty acids like butyrate, which are plausible intermediates in gut–brain signaling.
But I learned the key limitation: in healthy teenagers, it is not realistic for a student project to measure detailed diet, stool metagenomics, blood metabolomics, and cognition in the same individuals at the same time.

So I made a scientific decision.
Instead of pretending I built a medical-grade predictor, I built CogniBiome Insights as two honest, auditable components:

First, a Pilot Results dashboard that shows the real n=66 dataset with charts, correlations, and regressions. Nothing is simulated there.

Second, a deterministic simulator.
You adjust diet proxies like fiber, added sugar, saturated fat, and omega-3 proxy.
The app propagates those inputs through three stages: Diet to a modeled microbiome layer, microbiome to modeled metabolite proxies, and metabolites to modeled cognitive domains.
Every run generates a SHA-256 run hash and logs model versions, so the output is reproducible and inspectable.

Now the most valuable part of the project: what I learned by hitting the limits.

Lesson one: reference data is not training data.
Databases like MiMeDB, Reactome, and WikiPathways help map what could happen mechanistically, but they do not automatically provide paired numeric measurements needed to train an AI.

Lesson two: the "perfect dataset" is not openly available.
I could not find a single open dataset that combines detailed diet logs, gut metagenomics, metabolomics, and standardized cognitive testing in the same healthy people.
So claiming a fully predictive gut–brain model today would be scientifically unsafe.

Lesson three: computation matters.
Real microbiome pipelines can involve large sequencing datasets and heavy feature engineering. A browser-only app cannot do that honestly.

Because of this, my roadmap is modular and data-driven:
Phase 1: keep the UI lightweight and reproducible, but add a Python backend later to train models stage-by-stage only where paired public datasets exist.
For example, published cohorts like ZOE PREDICT demonstrate large-scale diet and microbiome measurement, and iHMP's IBDMDB provides longitudinal paired multi-omics for rigorous microbiome-to-metabolite validation.
Phase 2: for cognition specifically, the gold standard is a paired cohort. That requires a properly approved study design or a research partnership.

In summary, I built a transparent bridge from correlation to mechanism.
CogniBiome Insights shows real pilot evidence, clearly separates what is measured versus modeled, and provides a reproducible simulator to generate testable hypotheses.

Thank you. I would be happy to answer questions about the biology, the data limits, or the software architecture.

---

## 2) Presenter setup checklist (before judges arrive)

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

## 3) What Presenter Mode changes (explain only if asked)

Presenter Mode is a "demo simplifier":

- The sidebar shows the **full judge-flow screens** (six items):
  - Dashboard (`/`)
  - Pilot Results (`/pilot`)
  - Simulator (`/simulator`)
  - Compare Scenarios (`/compare`)
  - Methods & Rigor (`/methods`)
  - Export Report (`/export`)
- Plus this **Presenter Guide** link (pinned, always accessible in Presenter Mode).
- The Docs section and Public Datasets are hidden to reduce visual noise during the demo.
- The app remains **offline-first** and makes **no runtime API calls** regardless of mode.

---

## 4) Top bar controls (everything the judge can see)

| Control | Where | What it does | What to say (1 line) |
|---|---|---|---|
| **OFFLINE-FIRST** badge | top-left | reminds that the demo works without network | "This demo is offline-first; all files are bundled." |
| **OFFLINE** indicator | top-left (when browser reports no network) | reflects browser network state | "Even if this shows OFFLINE, the app still works." |
| **Presenter / Presenter ON** | top-right | toggles Presenter Mode | "Presenter Mode narrows the app to the judge path." |
| **Reset** | top-right (only when Presenter Mode OFF) | clears local runs + resets simulator + reloads pilot CSV | "Reset makes the next demo repeatable." |
| **Presenter Guide** | sidebar (only when Presenter Mode ON) | opens this guide in the Docs viewer | "This is our demo runbook, accessible inside the app." |

---

## 5) The 2-minute walkthrough script (aligned with the speech)

### 5.1 Dashboard (`/`) — 20 seconds

**Do:** Point to title + OFFLINE-FIRST badge.  
**Say:**
- "This is the offline-first demo dashboard."
- "Pilot dataset is loaded (n=66), and runs are stored locally in the browser."

**Do:** Click **Pilot Results** in the sidebar.

---

### 5.2 Pilot Results (`/pilot`) — 45 seconds

**What to show**
- The **REAL DATA** badge: *"de-identified teen pilot, n=66; computed live from CSV; no synthetic points."*
- The **correlations table** — point to the highlighted rows for **Overall Score**, **Language Test**, and **Logical Reasoning**.

**Script**
1. "This page is the **validation anchor**. These points are real pilot measurements; nothing here is simulated."
2. Point to the **Overall Score** row (highlighted): "Diet score showed r ≈ 0.37 with overall cognitive score — approximate p ≈ 0.003. Directionally consistent with the hypothesis, but not causal proof."
3. Point to the **Language Test** row (also highlighted): "Language showed the clearest signal in this sample. Stroop and memory were weaker — which is honest, not cherry-picked."
4. Point to the **Logical Reasoning** row (also highlighted): "Logical reasoning also showed a meaningful signal — consistent with the speech."
5. "p-values here are approximate — do not interpret them as statistically confirmed findings."

**Do:** Click **Simulator** in the sidebar.

---

### 5.3 Simulator (`/simulator`) — 40 seconds

**What to show**
- Diet input sliders: **Fiber**, **Added Sugar**, **Saturated Fat**, **Omega-3 / PUFA**
- **Run Simulation** button
- Result panels: Microbiome proxy → Metabolite proxies → Cognition outputs
- The **Run Hash** cue (look for the pulsing indicator next to "Run Hash")

**Script**
1. "Now we simulate the **mechanistic chain**: Diet → Microbiome proxies → Metabolite proxies → Cognitive domain outputs."
2. Increase **Fiber** to high, decrease **Omega-3** to low (or vice versa). "Changing diet inputs shifts the predicted microbiome composition, which shifts metabolite levels, which shifts the cognitive output estimates."
3. Click **Run Simulation**.
4. Point to the **Run Hash**: "Every run generates a SHA-256 hash and records model versions — **same inputs always produce the same outputs**. This is reproducibility, not a black box."

**Do:** Note the run hash aloud (first 8 characters is enough). Then optionally run a second scenario.

---

### 5.4 Export Report (`/export`) — optional, 20 seconds

**Do:** Turn Presenter Mode OFF, navigate to Export Report, turn back ON.  
**Script:**
- "We can generate a one-page HTML report for any saved run. It includes the run hash, model versions, diet inputs, modeled outputs, and disclaimers — fully auditable."
- "The disclaimer block is part of every export: this is an educational hypothesis generator, not a diagnostic tool."

---

### 5.5 Methods & Rigor (`/methods`) — optional, 20 seconds

**Do:** Turn Presenter Mode OFF, navigate to Methods, turn back ON.  
**Script:**
- Point to the **Disclaimers block** (highlighted in Presenter Mode): "proxy models vs measured data — I want the judges to see this explicitly."
- "The current build uses **frozen demo coefficients** — not trained on NHANES or any external dataset in this version. The data sources table shows what is current vs what is a future plan."

---

## 6) Scientific background (have this ready for deeper questions)

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
- **What the scatter plots show:** correlations between Diet Score (composite) and cognitive test scores. The strongest signals were Overall Score (r ≈ 0.37) and Language Test. Stroop and Memory were weaker in this sample.

### Key metabolites (gut–brain axis)
- **Short-chain fatty acids (SCFAs):** butyrate, acetate, propionate — produced by gut bacteria fermenting dietary fiber; butyrate in particular has anti-inflammatory and neuroprotective roles. SCFAs can also influence blood-brain barrier integrity.
- **Tryptophan pathway:** gut bacteria modulate tryptophan availability; tryptophan is the precursor for serotonin (~90% of which is produced in the gut) and for indoles including indole-3-propionic acid (neuroprotective). Gut hormones and the vagus nerve are additional signaling routes — direct causality should not be overclaimed.
- **GABA:** certain Lactobacillus and Bifidobacterium strains produce GABA, the main inhibitory neurotransmitter.

### What "proxy" means
All simulator outputs are clearly labeled as **modeled proxies** — estimates from a deterministic linear coefficient model with frozen demo coefficients, not measured biomarkers. The model is a hypothesis generator for educational purposes. The current v0.1 coefficients are **not trained on any external dataset**; future phases plan stage-wise training where paired public data exists.

---

## 7) Q&A prep (scientifically safe, bullet format)

### Mechanisms
- SCFAs (especially butyrate) can influence blood-brain barrier integrity via epigenetic regulation of tight junctions — plausible intermediate, not proven in this project.
- Gut hormone signaling (GLP-1, PYY) and vagus nerve afferents are additional gut–brain routes.
- **Avoid overclaiming:** do not say "gut bacteria directly cause better memory." Say "there are plausible signaling pathways that future paired studies could test."

### Data & statistics
- p-values in the correlation table are **approximate** (Abramowitz & Stegun formula), not corrected for multiple comparisons.
- The diet score is self-reported — subject to recall bias and measurement noise.
- n=66 is small; unmeasured confounders (sleep, exercise, socioeconomic factors) cannot be excluded.
- Multiple comparisons caveat: five cognitive metrics tested; significance threshold not adjusted.

### Software architecture
- The app is **browser-only** today — all computation runs client-side in the browser, no server calls.
- Future plan: a **Python/FastAPI backend** with scikit-learn or XGBoost models, trained stage-by-stage on paired datasets. The UI is designed to stay offline-first (results cached locally).
- SHA-256 run hashes and model version logging are already in place to support future reproducibility requirements.

### Datasets (future roadmap)
- **ZOE PREDICT:** large-scale UK cohort with simultaneous diet logging, gut metagenomics, and metabolomics — demonstrates what paired data could look like; public metagenomes are available, richer metadata may require a data access request.
- **iHMP / IBDMDB (Integrative Human Microbiome Project):** longitudinal paired multi-omics (metagenomics + metabolomics + host data) — the primary rigorous source for microbiome-to-metabolite validation in this roadmap.
- **NHANES:** nutrient intake codebook ranges used as UI reference context only — not a training dataset in this build.
- **HMP community resources:** used as offline reference index (study IDs, accession numbers) — not an IBD training set and not participant-level data.

---

## 8) If judges ask deeper questions (how to exit Presenter Mode safely)

Presenter Mode intentionally hides three pages. To show them:

1. Toggle Presenter Mode **OFF** (top-right button)
2. Navigate to the relevant page
3. Toggle back ON when done

### What is on each hidden page

#### Methods & Rigor (`/methods`)
- **Disclaimers block** (highlighted in Presenter Mode) — "proxy models vs measured data"
- **Leakage guardrails checklist** — documents how pilot data is isolated from training
- **Data source table** — current v0.1 (frozen demo coefficients, not trained on NHANES) vs future plan (train on paired datasets where access exists: iHMP/IBDMDB; ZOE PREDICT subject to access)
- **MiMeDB snapshot** (metabolites + microbes + export limitations; no confirmed links bundled in this build) — searchable tables of metabolites and microbes from MiMeDB v2 CSV exports; any "links" tab entries are labeled unconfirmed because the CSV exports do not include a verified microbe↔metabolite join table

**What to say:** "This is the transparency layer: disclaimers, limitations, and a full data-boundary checklist."

#### Public Datasets (`/datasets`)
- A manifest-driven table showing which project-plan datasets are bundled and which are not.
- Datasets tracked: **NHANES**, **HMP/iHMP**, **American Gut**, **MetaboLights**, **Metabolomics Workbench**.
- "Bundled" for large datasets means a **metadata-only offline snapshot** (study IDs, accession numbers, official entry-point URLs), not full raw data.
- The NHANES snapshot is a small CSV of nutrient variable codebook ranges — no participant-level data.

**What to say:** "This table is driven by a local manifest file. For large or restricted datasets we bundle metadata-only reference indexes — honest about scope."

#### Export Report (`/export`)
- Select a saved run, toggle options (pilot summary, leakage checklist), then click **Generate**.
- Produces a single-page HTML report you can download or print.
- Report includes: run hash, model versions, diet inputs, modeled outputs, disclaimers.

**What to say:** "We can generate a one-page reproducible summary of any run. The run hash lets you verify the exact inputs that produced these outputs."

---

## 9) Presenter "do not do this"

- Do **not** claim the simulator proves causality. Always say "modeled proxy" or "hypothesis generator."
- Do **not** claim the model coefficients were trained on NHANES, HMP, or any external dataset in this build — they are frozen demo placeholders.
- Do **not** claim HMP Phase 1 (HMP1) is an IBD training dataset — it is a reference index only. The IBD-relevant multi-omics resource is iHMP/IBDMDB.
- Do **not** claim ZOE PREDICT provides unrestricted full diet logs — public metagenomes are available; richer metadata may require a data access request.
- Do **not** present p-values from the pilot plots as statistically significant proof; say "directionally consistent" or "approximate descriptive signal."
- Do **not** claim the external datasets are fully raw-data bundled — they are metadata-only snapshots for the large datasets.
- Do **not** claim the app runs server-side code — all processing is client-side in the browser.

---

## 10) Reference: where to find things in the full app (Presenter Mode OFF)

| Topic | Where to look |
|---|---|
| Causality / leakage disclaimers | Methods & Rigor (`/methods`) → Disclaimers block |
| Data source table (current vs future) | Methods & Rigor (`/methods`) → Data Sources table |
| MiMeDB snapshot (metabolites + microbes; no confirmed links) | Methods & Rigor (`/methods`) → MiMeDB snapshot explorer |
| Dataset bundling status | Public Datasets (`/datasets`) |
| Run report (downloadable HTML) | Export Report (`/export`) |
| All supporting docs (SRS, BRD, User Guide, etc.) | Help / Docs (`/help`) — Foundation, Data, Reference tabs |
| This Presenter Guide (full) | Help / Docs (`/help`) → Foundation → Presenter Guide (DOC-026) |
