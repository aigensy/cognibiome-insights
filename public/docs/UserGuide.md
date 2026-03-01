# CogniBiome Insights — User Guide

**Version:** 1.0  
**Last updated:** March 2026

CogniBiome Insights is an educational research prototype that models diet-driven microbiome and neurotransmitter pathways influencing cognitive performance. This guide walks you through the application’s main features, screens, and workflows.

---

## Table of Contents

1. [Overview](#overview)
2. [Presenter Mode](#presenter-mode)
3. [Dashboard](#dashboard)
4. [Pilot Results](#pilot-results)
5. [Simulator](#simulator)
6. [Methods & Rigor](#methods--rigor)
7. [Compare Scenarios](#compare-scenarios)
8. [Export Report](#export-report)
9. [Help & Documentation](#help--documentation)

---

## Overview

CogniBiome Insights combines two core components:

- **Pilot Results** — Real, de-identified teen pilot data (n=66) with correlations between diet score and cognitive metrics. Nothing here is simulated.
- **Simulator** — A deterministic pipeline that models Diet → Microbiome → Metabolites → Cognition. All simulator outputs are clearly labeled as **modeled proxies**, not measured biomarkers.

The application is **offline-first**: all data and computation run in your browser. No server calls are required.

---

## Presenter Mode

**Presenter Mode** is a demo-focused view that simplifies the interface for presentations and walkthroughs.

### How to Enable

Click the **Presenter** button in the top-right of the TopBar. When active, the button displays **Presenter ON** and uses a highlighted style.

### What It Changes

| Feature | Normal Mode | Presenter Mode |
|--------|-------------|-----------------|
| Sidebar | Full navigation (Docs, Public Datasets, etc.) | Judge-flow screens only: Dashboard, Pilot Results, Simulator, Compare, Methods, Export |
| Reset button | Visible | Hidden (keeps demo path clean) |
| Dashboard | Standard tiles | Adds **Demo Sequence — Judge Path** card with suggested flow |
| Pilot Results | Standard view | Highlights key correlation rows (Overall Score, Language Test, Logical Reasoning) with "Mention in speech" badges |
| Simulator | Full descriptions, NHANES reference panel | Streamlined view; Run Hash shows a pulsing cue to mention reproducibility |
| Methods | Standard view | **Presenter cue** badge on Limitations card; disclaimers highlighted |

### Data Badges

The application uses two badge types to distinguish data sources:

- **REAL DATA** — De-identified pilot measurements, computed live from CSV. No synthetic points. Shown on Pilot Results.
- **MODELED PROXY** — Outputs from the deterministic simulator. Not measured biomarkers. Shown on Simulator outputs (Microbiome, Metabolites, Cognition) and in Compare.

These badges help you and your audience clearly separate measured evidence from modeled hypotheses.

---

## Dashboard

The Dashboard is your home screen and navigation hub.

![Dashboard View](../../e2e/screenshots/01-dashboard-presenter.png)

### Key Elements

- **Title** — "CogniBiome Dashboard" with subtitle describing the diet–microbiome–cognition modeling focus.
- **Status badges** — Demo Param Set v0, Pilot dataset status (e.g., `Pilot: n=66`), and number of saved simulation runs.
- **Demo Sequence card** (Presenter Mode only) — A suggested judge-path flow: Pilot Results → Simulator → Methods & Rigor → Export Report.
- **Navigation tiles** — Clickable cards for Pilot Results, Simulator, Export Report, Methods & Rigor, and Compare Scenarios.
- **Disclaimer** — Reminder that this is an educational prototype, not medical advice or a diagnostic device.

### Getting Started

1. Confirm the pilot dataset is loaded (badge shows `Pilot: n=66` or similar).
2. Use the tiles to navigate to Pilot Results (real data) or Simulator (modeled pipeline).

---

## Pilot Results

The Pilot Results page displays real pilot data: diet scores and cognitive test scores from de-identified teenagers.

![Pilot Results View](../../e2e/screenshots/02-pilot-presenter.png)

### Data Badge

A green **REAL DATA** badge appears at the top, stating: *"de-identified teen pilot, n=66 • computed live from CSV • no synthetic points."*

### Dataset Metadata

- **Rows** — Number of records.
- **Source** — Origin of the dataset (e.g., bundled pilot CSV).
- **Loaded At** — Timestamp when the dataset was loaded.
- **SHA-256** — Hash for integrity verification.

### Summary Statistics

A table shows mean, median, standard deviation, min, and max for each cognitive metric (Stroop Test, Language Test, Memory Test, Logical Reasoning, Overall Score).

### Correlations Table

Correlations between Diet Score and each cognitive metric:

- **Pearson r** — Correlation coefficient.
- **p-value (approx)** — Approximate two-tailed p-value (Abramowitz & Stegun formula). Do not interpret as proof of causality.
- **n** — Sample size.

In Presenter Mode, key rows (Overall Score, Language Test, Logical Reasoning) are highlighted with a "Mention in speech" badge.

### Scatter Plots

Scatter plots show Diet Score (x-axis) vs. each cognitive metric (y-axis). Toggles allow you to show or hide:

- Regression line
- Quartiles

### Controls

- **Regression line** — Toggle to show the best-fit line.
- **Show quartiles** — Toggle to display quartile bands.

---

## Simulator

The Simulator runs a deterministic Diet → Microbiome → Metabolites → Cognition pipeline.

![Simulator View](../../e2e/screenshots/03-simulator-presenter.png)

### Diet Inputs (D)

Four sliders control diet proxies:

| Input | Unit | Description |
|-------|------|-------------|
| Fiber Intake | g/day (proxy) | Dietary fiber from whole grains, legumes, vegetables, fruits |
| Added Sugar | g/day (proxy) | Added sugars from processed foods and beverages |
| Saturated Fat | g/day (proxy) | Saturated fatty acids from animal and processed sources |
| Omega-3 / PUFA | g/day (proxy) | Omega-3 polyunsaturated fatty acid intake (EPA/DHA proxy) |

A **Derived Diet Score (proxy)** is computed from these inputs and displayed as a badge.

### Run Simulation

Click **Run Simulation** to execute the three-stage pipeline. Results appear in the right column.

### Outputs (Modeled Proxies)

Each output section is labeled with a **MODELED PROXY** badge:

1. **Microbiome (X)** — Bifidobacterium, Lactobacillus, F:B Ratio.
2. **Metabolites (M)** — Acetate, Propionate, Butyrate, 5-HTP Index.
3. **Cognition (Y)** — Stroop Test, Language Test, Memory Test, Logical Reasoning, Overall Score.

### Run Provenance

- **Run Hash** — SHA-256 hash of the run. Same inputs always produce the same hash (reproducible).
- **Model Versions** — Stage 1, 2, and 3 model identifiers for traceability.

In Presenter Mode, a pulsing indicator next to "Run Hash" reminds you to mention reproducibility.

---

## Methods & Rigor

The Methods & Rigor page documents limitations, guardrails, and data sources.

![Methods & Rigor View](../../e2e/screenshots/04-methods-presenter.png)

### Limitations & Scientific Wording

Three core disclaimers are highlighted:

1. **Modeled proxies** — All microbiome and metabolite outputs are modeled/estimated proxies, not measured biomarkers from pilot participants.
2. **Non-causal** — The simulator generates testable hypotheses; it does not prove causality or mechanism.
3. **Non-diagnostic** — Educational research prototype. Not medical advice. Not a diagnostic device.

In Presenter Mode, a **Presenter cue** badge indicates these lines are important to emphasize.

### Leakage Guardrails

A checklist documents how data leakage is avoided:

- Pilot dataset is validation-only (not used for training or tuning).
- No peeking during tuning; model artifacts frozen before pilot validation.
- Fit-only-on-train (preprocessing fitted on training data only, conceptually).
- Duplicate/near-duplicate awareness (pilot records are unique de-identified entries).

### Data Sources (Paired vs Unpaired)

A table describes each pipeline stage:

- **D→X** — Diet to microbiome (frozen demo coefficients; UNPAIRED in v0.1).
- **X→M** — Microbiome to metabolites (frozen demo coefficients; UNPAIRED).
- **M→Y** — Metabolites to cognition (frozen demo coefficients; UNPAIRED).
- **Validation** — Pilot (n=66) for Diet Score ↔ Cognitive metrics only; PAIRED for that relationship.

### MiMeDB Evidence

- **License not confirmed** badge — MiMeDB snapshot is used for reference context.
- Searchable tables of metabolites and microbes from MiMeDB v2 CSV exports.
- **UNPAIRED** — Current v0.1 uses frozen demo coefficients; future phases may train on paired datasets where available.

---

## Compare Scenarios

Compare two saved simulation runs side by side.

![Compare Scenarios View](../../e2e/screenshots/05-compare-presenter.png)

### Run Selection

- **Run A** and **Run B** — Dropdowns to select from saved runs (identified by run hash and timestamp).
- **Swap A/B** — Button to exchange Run A and Run B.

### Comparison Tables

When two different runs are selected, tables show:

- **Diet Inputs + Diet Score Proxy** — Fiber, Added Sugar, Sat. Fat, Omega-3, Diet Score.
- **Microbiome Outputs (Modeled Proxy)** — Bifidobacterium, Lactobacillus, F:B Ratio.
- **Metabolite Outputs (Modeled Proxy)** — Acetate, Propionate, Butyrate, 5-HTP Index.
- **Cognition Outputs (Modeled Proxy)** — Stroop, Language, Memory, Logical, Overall.

Each table includes:

- **Run A** and **Run B** values.
- **Δ (B − A)** — Absolute difference (green = B higher, red = B lower).
- **% Δ** — Percent change.

All outputs are labeled as modeled proxies. The page states: *"Side-by-side comparison of two saved simulation runs. All outputs are modeled proxies — not measured values."*

---

## Export Report

Generate a one-page HTML report for any saved simulation run.

![Export Report View](../../e2e/screenshots/06-export-presenter.png)

### Select Run

Choose a run from the dropdown (by hash and timestamp).

### Report Options

- **Include Pilot Summary** — Adds n, mean/median table, and diet↔cognition correlations from the real pilot dataset. Requires pilot data to be loaded.
- **Include Leakage Checklist** — Adds the Methods & Rigor leakage guardrails as a checklist block.

### Format & Export

- **Download HTML** — Saves a self-contained HTML file.
- **Print to PDF** — Opens the report in a new tab and triggers the browser print dialog (use "Print to PDF" or "Save as PDF" in the dialog).

### Report Contents

The exported report includes:

- Run hash and timestamp
- Model versions (Stage 1, 2, 3)
- Diet inputs and Diet Score proxy
- Microbiome, Metabolite, and Cognition outputs (all labeled as modeled proxies)
- Optional pilot summary and leakage checklist
- Disclaimers block (non-causal, non-diagnostic, modeled proxy, pilot validation, demo params)

---

## Help & Documentation

The Help/Docs viewer provides access to project documentation, including the Presenter Guide.

![Help Docs — Presenter Guide](../../e2e/screenshots/07-helpdocs-presenter-guide.png)

### Presenter Guide (DOC-026)

In Presenter Mode, the **Presenter Guide** link appears in the sidebar. It contains:

- One-sentence disclaimer for quick reference
- Full speech script
- Presenter setup checklist
- 2-minute walkthrough script aligned with each screen
- Scientific background (3-stage pipeline, pilot dataset, key metabolites)
- Q&A preparation
- Reference for where to find key information in the app

### Other Documentation

When Presenter Mode is off, the Docs section includes Foundation, Data, and Reference tabs with additional project documents (SRS, BRD, User Guide, etc.).

---

## Quick Reference

| Screen | Purpose |
|--------|---------|
| Dashboard | Home and navigation hub |
| Pilot Results | Real n=66 data; correlations and scatter plots |
| Simulator | Diet → Microbiome → Metabolites → Cognition pipeline |
| Methods & Rigor | Limitations, guardrails, data sources |
| Compare Scenarios | Side-by-side run comparison |
| Export Report | Generate downloadable HTML report |

---

## Important Disclaimers

- This application is an **educational hypothesis generator**, not a medical device.
- Pilot data shows **correlation**, not causation.
- Simulator outputs are **modeled proxies**, not measured biomarkers.
- p-values in the correlation table are **approximate**; do not interpret as statistically confirmed findings.
- The app is **offline-first**; all computation runs in your browser.

---

*For technical details, data sources, and scientific background, see the Methods & Rigor page and the Presenter Guide (Help → Foundation → Presenter Guide).*
