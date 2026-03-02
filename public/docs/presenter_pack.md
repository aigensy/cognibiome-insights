# CogniBiome — Presenter Pack

**Version:** 2026-03-01 | **Audience:** Yana Evteeva (presenter) and science-fair judges

> **One-sentence disclaimer — say this at any point if needed:**
> "This is an educational hypothesis generator, not a medical device."

This pack consolidates everything needed for a live judging session into one document:
the 2-minute walkthrough script, Methods & Rigor presenter cues, speech scripts, Q&A prep,
and ISEF display guidance.

> **Canonical presenter resource.** The earlier standalone files (`presenter_guide.md`,
> `methods_rigor_presenter_mode.md`, `speech_package.md`) have been archived to
> `public/docs/_archive/`. This Presenter Pack supersedes all of them.

---

## Project Positioning (for judges and students)

**What CogniBiome Insights is:**
CogniBiome Insights is an **educational simulator** demonstrating a rigorous, staged modeling
workflow for diet → gut biology → cognition problems. The primary contribution is the
**reproducible D → X → M → Y framework** and documentation of how one would solve the full
problem with larger paired datasets and sufficient compute.

**On "offline-first":**
Offline-first is a **science-fair presentation constraint** — the app must work reliably without
internet during judging. It is not a research objective. The same architecture would support a
backend training pipeline in a future phase.

**On the teen pilot (n=66):**
The pilot provides **real measured association results** (diet score vs four cognitive tasks).
It does not measure biological intermediates (no microbiome, no metabolomics). The association
signal motivates the modeling framework but does not establish a mechanism.

**On microbiome and metabolite layers:**
These are **modeled proxies** built from frozen demo coefficients. They are used to teach
mechanism and enable "what-if" scenario exploration — not to claim measured biological data.

**On the research goal:**
Diet–cognition association is used as a **deliberately challenging case study** to build and
demonstrate a correct end-to-end scientific workflow. The general problem remains limited by
data pairing, confounder control, and compute. Many similar multi-layer biology problems
**become tractable in principle** with sufficient paired data and proper workflow — this project
demonstrates that workflow.

---

## What This Version Does and Does Not Claim

**DOES:**
- Demonstrates deterministic simulation runs with SHA-256 run hash and reproducible exports
- Teaches core concepts: correlation, confounding, proxy variables, mechanistic reasoning
- Allows side-by-side scenario comparison for learning
- Clearly labels all intermediate outputs as **MODELED PROXY**
- Separates real measured pilot evidence from modeled proxy layers

**DOES NOT:**
- Prove causality between diet and cognition
- Diagnose or predict individual health outcomes
- Claim microbiome or metabolites were measured in the teen pilot
- Claim final population-level effect sizes
- Assert the simulator coefficients are trained on any real paired dataset in this build

---

## Part 1 — Before Judges Arrive: Setup Checklist

1. Open the app at `/`.
2. Click **Presenter** in the top-right bar so it reads **Presenter ON**.
3. Press **F11** (full-screen) if the venue allows it.
4. Confirm the top-left shows **OFFLINE-FIRST**.
5. Confirm the Dashboard shows `Pilot: n=66` and `Runs: 0` (reset if needed).
6. To clean state between judging groups:
   - Turn Presenter Mode **OFF**
   - Click **Reset** (top-right, only visible when Presenter Mode is OFF)
   - Turn Presenter Mode **ON** again

---

## Part 2 — What Presenter Mode Changes

Presenter Mode is a "demo simplifier." When **ON**:

- Sidebar shows the full judge-flow screens (six items):
  Dashboard · Pilot Results · Simulator · Compare Scenarios · Methods & Rigor · Export Report
- This Presenter Pack link remains accessible via the Docs section.
- Foundation and Data doc categories are hidden to reduce noise.
- The app makes **no runtime API calls** in any mode (offline-first presentation constraint).

| Control | Where | What it does | What to say |
|---|---|---|---|
| **OFFLINE-FIRST** badge | top-left | confirms no network needed during judging | "The demo works without Wi-Fi — a presentation reliability requirement." |
| **Presenter / Presenter ON** | top-right | toggles Presenter Mode | "This narrows the app to the judge path." |
| **Reset** | top-right (Presenter OFF only) | clears runs + resets sliders | "Reset makes the next demo repeatable." |

---

## Part 3 — 2-Minute Walkthrough Script

### Dashboard (`/`) — 20 seconds

**Do:** Point to title + OFFLINE-FIRST badge.

**Say:**
- "This is the demo dashboard. The app works fully offline — a reliability requirement for science-fair judging."
- "Pilot dataset is loaded (n=66). Simulation runs are stored locally in the browser."

**Do:** Click **Pilot Results** in the sidebar.

---

### Pilot Results (`/pilot`) — 45 seconds

**What to show:**

- The **REAL DATA** badge: *"de-identified teen pilot, n=66 · computed live from CSV · no synthetic points."*
- The **correlations table** — point to the highlighted rows.

**Script:**

1. "This page is the **validation anchor**. These are real pilot measurements — nothing here is simulated."
2. Point to **Overall Score** (highlighted): "Diet score showed r ≈ 0.37 with overall cognitive score — approximate p ≈ 0.003. Directionally consistent with the hypothesis, but not causal proof."
3. Point to **Language Test** (highlighted): "Language showed the clearest signal. Stroop and memory were weaker — which is honest, not cherry-picked."
4. Point to **Logical Reasoning** (highlighted): "Logical reasoning also showed a meaningful signal, consistent with the speech."
5. "p-values here are approximate — do not interpret them as statistically confirmed findings."

**Do:** Click **Simulator** in the sidebar.

---

### Simulator (`/simulator`) — 40 seconds

**What to show:** Diet input sliders · Run Simulation button · result panels · Run Hash

**Script:**

1. "Now we simulate the **mechanistic chain**: Diet → Microbiome proxies → Metabolite proxies → Cognitive domain outputs."
2. Increase **Fiber** to high, decrease **Added Sugar**. "Changing diet inputs shifts the predicted microbiome composition, which shifts metabolite levels, which shifts the cognitive output estimates."
3. Click **Run Simulation**.
4. Point to the **Run Hash**: "Every run generates a SHA-256 hash and records model versions — **same inputs always produce the same outputs**. Reproducibility, not a black box."

**Do:** Note the run hash aloud (first 8 characters is enough). Optionally run a second scenario.

---

### Export Report (`/export`) — optional, 20 seconds

**Do:** Navigate to Export Report from the sidebar.

**Say:** "We can generate a one-page HTML report for any saved run. It includes the run hash, model versions, diet inputs, modeled outputs, and the full disclaimers — fully auditable."

---

### Methods & Rigor (`/methods`) — optional, 20 seconds

**Do:** Navigate to Methods & Rigor from the sidebar.

**Point to the Limitations card** (highlighted with a ring in Presenter Mode):

**Say:** "This is the transparency layer: these three statements are the scientific guardrails I want judges to see explicitly."

The three statements (read almost verbatim if asked):
- "All microbiome and metabolite outputs are MODELED / ESTIMATED proxies — not measured biomarkers from pilot participants."
- "This simulator generates testable hypotheses. It does NOT prove causality or mechanism."
- "Educational research prototype. NOT medical advice. NOT a diagnostic device."

---

## Part 4 — Methods & Rigor: Presenter Cues

### Limitations & Scientific Wording

The **Presenter cue** badge in Presenter Mode marks the card to point to. It is a reminder to verbally acknowledge these limitations during the judging session — not a button.

The small clarification line under the disclaimers explains the key pilot data constraint:
- The teen pilot does **not** include measured microbiome or metabolomics.
- Intermediate outputs (X = microbiome, M = metabolites) are **proxy model outputs**, not pilot biomarker measurements.

### Leakage Guardrails

Four checkmarks confirm anti-overfitting protections:

| Check | Meaning |
|---|---|
| Pilot dataset is validation-only | Not used for training or tuning |
| No peeking during tuning | Artifacts frozen before pilot validation |
| Fit-only-on-train (conceptual) | Preprocessing fit on training data only in a future pipeline |
| Duplicate/near-duplicate awareness | Pilot records are unique de-identified entries |

### Data Sources (Paired vs Unpaired)

**Paired** = inputs and outputs measured in the **same participants** (required for supervised ML training).
**Unpaired** = reference context only — not sufficient to claim a trained predictive mapping.

| Stage | Current status | What would be needed |
|---|---|---|
| D→X (Diet → Microbiome proxies) | **UNPAIRED** — frozen demo coefficients; NHANES is UI reference context only | Paired diet + metagenomics cohort (e.g., ZOE PREDICT) |
| X→M (Microbiome proxies → Metabolites) | **UNPAIRED** — frozen demo coefficients; MiMeDB is reference context | Paired metagenomics + metabolomics cohort (e.g., iHMP/IBDMDB) |
| M→Y (Metabolites → Cognitive outputs) | **UNPAIRED** — frozen demo coefficients | Paired metabolomics + standardized cognitive test cohort |
| Validation | **PAIRED** for Diet Score ↔ Cognitive metrics only (n=66 teen pilot) | No microbiome or metabolomics in the pilot |

### MiMeDB Snapshot (offline reference)

The MiMeDB section in Methods & Rigor displays a searchable offline snapshot built from MiMeDB v2 CSV exports (metabolites + microbes). Three important constraints:

- The MiMeDB CSV exports **do not include a microbe↔metabolite join table**. The `microbe_relations` column is a count only (no microbe IDs).
- Therefore, any microbe↔metabolite links shown in the app are **literature-derived associations**, not confirmed from the MiMeDB CSV. Every link carries `source_in_mimedb_csv: false`.
- The UI labels this section accordingly. The "License not confirmed" badge is intentional — no license claim is asserted from within the repo.

**Presenter-safe wording for MiMeDB:**
"MiMeDB is bundled as an offline reference snapshot. Microbe↔metabolite links are literature-derived — not confirmed from the MiMeDB CSV exports, because those exports do not include a join table."

---

## Part 5 — Full Judge Speech (2–3 minutes)

### Decoding the Gut–Brain Axis: From Honest Simulation to Real-World Machine Learning

Good morning judges. My name is Yana Evteeva.

My question is simple, but the biology is complex: if diet is linked to attention and memory, what physical pathway could connect the food on our plate to performance in the brain through the gut–brain axis?

**Step 1 was real data.**
In 2025, I collected de-identified pilot data from 66 high-school students. Each student completed a diet survey and four cognitive tests: Stroop, memory recall, language, and logical reasoning.

When I analyzed the dataset, diet score showed a moderate positive relationship with overall cognitive score: Pearson r ≈ 0.37, approximate two-tailed p ≈ 0.003.
The pattern was key: language and logical reasoning showed clearer relationships; Stroop and memory were weaker. My pilot supports correlation, not causation, and it does not prove a biological mechanism.

**Step 2 was the hard part: building a mechanism you can see.**
We know gut microbes transform diet into bioactive molecules — short-chain fatty acids like butyrate are plausible intermediates in gut–brain signaling. But in healthy teenagers, it is not realistic for a student project to measure detailed diet, stool metagenomics, blood metabolomics, and cognition in the same individuals at the same time.

So I made a scientific decision.
Instead of claiming a model I did not have data to train, I built CogniBiome Insights as two honest, auditable components:

First, a Pilot Results dashboard showing the real n=66 dataset with charts, correlations, and regressions. Nothing is simulated there.

Second, a deterministic simulator.
You adjust diet proxies — fiber, added sugar, saturated fat, omega-3 proxy.
The app propagates inputs through three stages: Diet → modeled microbiome layer → modeled metabolite proxies → modeled cognitive domains.
Every run generates a SHA-256 run hash and logs model versions, so the output is reproducible and inspectable.

**What I learned by hitting the limits:**

- Reference databases like MiMeDB, Reactome, and WikiPathways provide mechanistic context, but they are not training data.
- The paired dataset needed to train a predictive gut-to-brain model does not yet exist for healthy teenagers.
- Heavy omics pipelines require backend compute — a browser app cannot do that honestly.

**Roadmap:** Phase 1 keeps the UI lightweight and reproducible. A Python backend added later will train models stage-by-stage only where paired public datasets exist — ZOE PREDICT for diet-to-microbiome, iHMP/IBDMDB for microbiome-to-metabolite. For the cognition stage, a properly approved paired cohort or research partnership is required.

In summary: I built a transparent bridge from correlation to mechanism. CogniBiome Insights shows real pilot evidence, clearly separates measured from modeled, and provides a reproducible simulator to generate testable hypotheses.

Thank you. I am happy to answer questions about the biology, the data limits, or the software architecture.

---

## Part 6 — 2-Minute Project Video Script (max 2:00)

> Timing guide: ~130 words per minute. Total ≈ 240 words ≈ 1:50.

**(0:00)** My name is Yana Evteeva. My question: if diet is linked to attention and memory, what biological pathway could connect them?

**(0:12)** In 2025, I collected a de-identified pilot dataset from 66 high-school students. Each completed a diet survey and four standardized cognitive tests. Overall cognitive score versus diet score showed Pearson r = 0.367, approximate p = 0.003. Language and logical reasoning showed similar positive relationships. Stroop and memory were weaker. Correlation does not establish mechanism — and the pilot does not include microbiome data.

**(0:40)** No single publicly available dataset combines diet, gut metagenomics, metabolomics, and cognition in the same healthy teenagers. So instead of claiming a model I did not have the data to train, I built CogniBiome Insights: two honest, auditable components.

**(0:58)** The Pilot Results screen loads the real CSV and computes all statistics live. Nothing is simulated there.

**(1:08)** The Simulator lets you adjust diet inputs. The app propagates them through three modeled stages: diet to a microbiome proxy layer, microbiome to metabolite proxies, metabolites to cognitive domains. Every run generates a SHA-256 run hash and records model versions, making the output reproducible and inspectable.

**(1:30)** Reference databases like MiMeDB are evidence context, not training data. The perfect paired dataset does not exist for healthy teens. Heavy omics pipelines require backend compute — a browser app cannot do that honestly.

**(1:45)** The app architecture is designed to accept trained artifact files later, when paired datasets and a proper training pipeline are in place.

**(1:55)** CogniBiome Insights: real data, transparent simulation, honest limits.

---

## Part 7 — Q&A Prep

### Judge asks: "Is this causal?"
"No — all simulator outputs are labeled modeled proxies. The pilot shows correlation, not mechanism."

### Judge asks: "Did you train this model?"
"The current build uses frozen demo coefficients — not trained on NHANES or any external dataset. Training requires paired datasets not yet available for healthy teens."

### Judge asks: "What are those p-values?"
"Approximate, as displayed in the app — Abramowitz and Stegun formula, not corrected for multiple comparisons. They are descriptive signals, not confirmatory statistics."

### Judge asks: "Is this a diagnostic tool?"
"No. One-sentence disclaimer: educational hypothesis generator, not a medical device."

### Judge asks: "Can I reproduce this run?"
"Yes — same inputs always produce the same SHA-256 run hash. The hash is shown in the Simulator provenance panel."

### Judge asks about NHANES
"Used as reference context for nutrient ranges — not a training dataset in this build."

### Judge asks about HMP or MiMeDB
"Both are reference context only. HMP1 is a healthy-baseline resource. MiMeDB provides metabolite and microbe reference lists — microbe↔metabolite links are literature-derived, not from the CSV join table."

### Judge asks about iHMP or ZOE PREDICT
"Those are our future training targets — documented in the Presentation Addendum."

### Mechanisms (deeper questions)
- SCFAs (especially butyrate) can influence blood-brain barrier integrity via epigenetic regulation of tight junctions — plausible intermediate, not proven in this project.
- Gut hormone signaling (GLP-1, PYY) and vagus nerve afferents are additional gut–brain routes.
- **Avoid overclaiming:** say "there are plausible signaling pathways that future paired studies could test."

### Data & statistics
- p-values are approximate (Abramowitz & Stegun), not corrected for multiple comparisons.
- Diet score is self-reported — subject to recall bias and measurement noise.
- n=66 is a small pilot; unmeasured confounders (sleep, exercise, socioeconomic factors) cannot be excluded.

### Software architecture
- The app is browser-only today — all computation runs client-side, no server calls.
- Future plan: Python/FastAPI backend with models trained stage-by-stage offline and exported as JSON artifacts. The UI is designed to accept swapped artifact files without code changes.

---

## Part 8 — 20-Second Answer: Abstract vs App Mismatch

> Use this if a judge asks why the app looks different from the submitted abstract.

"The abstract describes the research design: real pilot data plus a computational model of the gut–brain pathway. The app implements exactly that — Pilot Results shows the real n=66 dataset, and the Simulator implements the hypothesized diet-to-cognition pipeline. The abstract notes that model parameters are based on published reference data; in this build, those parameters are frozen demo coefficients pending a future training pipeline. Everything is transparently labeled in the app."

---

## Part 9 — Quick-Reference Card

| Situation | What to say |
|---|---|
| Judge asks "Is this causal?" | "No — all outputs are labeled modeled proxies. The pilot shows correlation, not mechanism." |
| Judge asks "Did you train this model?" | "Frozen demo coefficients. Training requires paired datasets not yet available." |
| Judge asks "What are those p-values?" | "Approximate, as displayed — Abramowitz & Stegun formula, not corrected for multiple comparisons." |
| Judge asks "Is this a diagnostic tool?" | "No. Educational hypothesis generator, not a medical device." |
| Judge asks "Can I reproduce this run?" | "Yes — same inputs always produce the same SHA-256 run hash." |
| Judge asks about NHANES | "Reference context for nutrient ranges — not a training dataset in this build." |
| Judge asks about iHMP / ZOE PREDICT | "Future training targets — documented in the Presentation Addendum." |

---

## Part 10 — Do NOT Say This (Guardrails)

- Do **not** claim the simulator proves causality. Always say "modeled proxy" or "hypothesis generator."
- Do **not** claim model coefficients were trained on NHANES, HMP, or any external dataset — they are frozen demo placeholders.
- Do **not** claim HMP Phase 1 is an IBD training dataset — it is a reference index. The IBD multi-omics resource is iHMP/IBDMDB.
- Do **not** claim ZOE PREDICT provides unrestricted full diet logs — public metagenomes are available; richer metadata may require a data access request.
- Do **not** present pilot p-values as statistically significant proof; say "directionally consistent" or "approximate descriptive signal."
- Do **not** claim external datasets are raw-data bundled — they are metadata-only snapshots for large datasets.
- Do **not** claim the app runs server-side code — all processing is client-side.

---

## Part 11 — Using Screenshots and Exports in a Virtual Display

> *ISEF display & safety guidance — applies if you prepare a virtual display board alongside the physical board.*

If you include screenshots from CogniBiome Insights (e.g., the Pilot Results page or Simulator output) on a virtual display or printed trifold:

- **No QR codes or active hyperlinks** on the display board. Judges must not navigate away from your display area.
- **Do not include images of research papers, lab notebooks, or third-party copyrighted figures** without explicit permission and a credit line.
- **Every graphic must have a credit line** directly beneath it. Use one of:
  - "Figure created by Yana Evteeva using CogniBiome Insights (student-built app)."
  - "Screenshot from CogniBiome Insights, student-built offline demo app."
  - "Scatter plot generated from de-identified pilot data (n=66). Created by student."
- **Do not claim the app itself is the ProjectBoard submission** — the app is a supporting tool; the project is the research.
- The scatter plots, bar charts, and pipeline diagram in `docs/trifold/images/` are original student-created visuals and can be credited as: "Diagram created by Yana Evteeva (original)."

---

## Part 12 — Where to Find Things (Presenter Mode OFF)

| Topic | Where to look |
|---|---|
| Causality / leakage disclaimers | Methods & Rigor (`/methods`) → Limitations card |
| Data source table (current vs future) | Methods & Rigor (`/methods`) → Data Sources table |
| MiMeDB snapshot (metabolites + microbes) | Methods & Rigor (`/methods`) → MiMeDB section |
| Dataset bundling status | Public Datasets (`/datasets`) |
| Run report (downloadable HTML) | Export Report (`/export`) |
| All supporting docs | Help / Docs (`/help`) |
| This Presenter Pack | Help / Docs (`/help`) → Presenter Pack |
