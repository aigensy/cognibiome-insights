# Trifold Board Design

**Project:** CogniBiome Insights — Modeling Diet-Driven Microbiome and Neurotransmitter Pathways Influencing Cognitive Performance

**Student:** Yana Evteeva | **School:** Dr. Ronald E. McNair Academic High School | **Coordinator:** Maria Nolau

> This document synthesizes the full trifold board layout, all printable visuals, and the required Display & Safety compliance statement.

---

## Full Board Preview

![Trifold Full Board Preview](images/trifold_full_preview.png)

*Figure 0. Full physical trifold board preview. Created by Yana Evteeva.*

---

## Top Banner

**Title:** CogniBiome Insights: Modeling Diet-Driven Microbiome and Neurotransmitter Pathways Influencing Cognitive Performance

**Student:** Yana Evteeva | **School:** Dr. Ronald E. McNair Academic High School | **Coordinator:** Maria Nolau

**Safety & Display Compliance Statement** *(required, top-right corner of board):*

> The Diet Score and app provide only information about the project as conducted and do not contain any reference to potential human subjects research. All referenced studies are public, non-identifiable, and used for simulation and project development.

**What this is:**
- Offline-first deterministic simulator + real pilot analytics (n=66 teen dataset).
- Educational hypothesis generator.

**What this is NOT:**
- NOT medical advice. NOT a diagnostic device. NOT proof of causality.
- The teen pilot has no measured microbiome or metabolomics — those are modeled proxy layers.

**Key idea:** Diet can shift gut microbial metabolism (e.g., SCFAs and neuroactive precursor pathways), which may plausibly influence cognitive domains.

---

## Left Panel — Problem & Objectives

### Abstract

Diet quality is frequently associated with cognitive performance, but testing a full mechanism in humans is difficult because it would require measuring diet, microbiome composition, metabolites, and cognition in the same individuals. This project addresses that gap with a transparent, judge-ready approach: **(1) analyze a de-identified teen pilot dataset (n=66) for correlation signals**, and **(2) implement an offline-first, deterministic simulator that makes the proposed biological pathway explicit**.

In the pilot dataset (diet score + four cognitive tests), higher diet scores show moderate positive correlations with **overall score** and with **language** and **logical reasoning**. To explore a plausible mechanism (without overclaiming), CogniBiome implements a three-stage pipeline: **Diet inputs (D)** → **Modeled microbiome proxies (X)** → **Modeled metabolite proxies (M)** → **Modeled cognition outputs (Y)**. In the current build, the simulator uses **frozen, replaceable parameter artifacts** (no training occurs inside the app) and generates a **run hash** so outputs are reproducible.

This work is presented as an **educational hypothesis generator**. It does not diagnose, does not provide medical advice, and does not claim causality.

### Research Question

How can diet-associated cognition signals be explored using an explicit, reproducible diet→microbiome→metabolite→cognition pathway model while clearly separating real measurements from modeled proxy layers?

### Hypothesis

Teens with higher diet quality scores will show higher cognitive performance, especially in domains sensitive to attention and reasoning. A biologically plausible explanation is that higher-fiber/omega-3 dietary patterns can shift gut microbial metabolism toward short-chain fatty acid (SCFA) production and toward neuroactive precursor pathways, which may influence inflammation and signaling relevant to cognition. This project tests correlation in the pilot dataset and uses a deterministic simulator to represent the proposed mechanism transparently — not to claim causality.

### Background Research

- The **gut–brain axis** links gut and brain through immune, endocrine, neural (including vagal), and metabolic signaling.
- Gut microbes can produce **SCFAs** (acetate, propionate, butyrate) from dietary fiber, which are plausible mediators via inflammation and barrier-related signaling.
- Microbial metabolism can also influence pathways connected to neurotransmitter-related chemistry (e.g., tryptophan-related routes and GABA in specific strains).
- Critical constraint: most datasets do not measure all layers together in the same people; therefore, this build separates **measured pilot correlations** from **modeled proxy layers**.

---

## Center Panel — Methodology & Key Results

### Materials

- De-identified teen pilot CSV (n=66): diet_score, stroop_test, language_test, memory_test, logical_test, overall_score
- CogniBiome Insights offline-first web app (Pilot Results + deterministic Simulator + Export)
- Frozen simulator artifacts: stage1.json, stage2.json, stage3.json (replaceable demo parameters)
- Optional offline reference snapshots for evidence cards (NHANES, MiMeDB subset, HMP)

### Procedure

1. Load pilot dataset (n=66) and validate integrity: overall_score = stroop + language + memory + logical (row-wise check).
1. Compute summary statistics for each metric (n, mean, median, min/max).
1. Compute Pearson correlations between diet_score and each cognitive metric. Note: p-values shown are approximate as displayed in the app.
1. Run deterministic simulations in the D→X→M→Y pipeline:
   - Input (D): fiber_proxy, added_sugar_proxy, sat_fat_proxy, omega3_proxy
   - Output (X): bifidobacterium, lactobacillus, firmicutes:bacteroidetes ratio (MODELED)
   - Output (M): acetate, propionate, butyrate, 5-HTP precursor index (MODELED)
   - Output (Y): stroop, language, memory, logical, overall (MODELED)
1. Save each run locally with provenance: model versions + SHA-256 run hash (same inputs → same outputs).

### Visual 1 — Scatter Plots: Diet Score vs Cognitive Metrics

![Validating Proxies: Diet Score and Cognitive Metrics](images/scatter_diet_vs_cognition.png)

*Figure 1. Scatter plots of Diet Score (0–12) vs Overall Cognition, Language Score, and Logical Reasoning Score (0–10) with regression lines. Pearson r shown per plot. Generated from de-identified pilot dataset (n=66). Created by Yana Evteeva.*

### Results Table: Correlation — Diet Score vs Cognitive Metrics

*(Pearson r rounded to 0.001. p-values are "approximate as displayed" and are not corrected for multiple comparisons.)*

| Cognitive metric | Pearson r | p-value (approx) | n |
|---|---:|---:|---:|
| Overall score | 0.367 | 0.0033 | 66 |
| Language test | 0.353 | 0.0052 | 66 |
| Logical reasoning | 0.336 | 0.0088 | 66 |
| Stroop test | 0.060 | 1.0000 | 66 |
| Memory test | 0.071 | 1.0000 | 66 |

*Note: Values above are as displayed in the CogniBiome Insights app computed live from the pilot CSV.*

**Objective summary:** In this sample, diet score shows the strongest positive association with **overall**, **language**, and **logical** scores.

### Visual 2 — Bar Chart: Pearson r Correlation across Cognitive Metrics

![Pearson r Correlation across Cognitive Metrics](images/pearson_r_bar_chart.png)

*Figure 2. Bar chart comparing Pearson r values across cognitive metrics. Values as displayed in the CogniBiome Insights app. Created by Yana Evteeva.*

### Visual 3 — Computational Pipeline: MEASURED vs MODELED (proxy)

![Computational Pipeline: MEASURED vs MODELED proxy Data](images/computational_pipeline.png)

*Figure 3. D→X→M→Y pipeline diagram. Blue solid arrows = MEASURED DATA stages; green dashed arrows = MODELED PROXY stages. Created by Yana Evteeva (original diagram).*

### Visual 4 — Reproducibility and Computational Rigor

![Reproducibility and Computational Rigor: Validated Results](images/reproducibility_box.png)

*Figure 4. Reproducibility demonstration. The SHA-256 run hash guarantees that identical inputs produce identical outputs. The hash shown (8e5f1b2c3d4e) is an example. Created by Yana Evteeva (original diagram).*

**Key principle:** Same Inputs → Same Outputs (verified by SHA-256 Run Hash)

---

## Right Panel — Discussion & Reproducibility

### Analysis

**What the pilot data shows (measured):**
- A moderate positive association between diet score and overall cognition, and similar signals for language and logical reasoning.

**What is modeled (proxy layers):**
- The teen pilot does not include measured microbiome or metabolomics.
- The simulator provides a *transparent, reproducible* "what-if" pathway: Diet (D) → Microbiome proxies (X) → Metabolite proxies (M) → Cognition proxies (Y)

**Biological plausibility:**
- Higher fiber intake can increase microbial fermentation outputs (SCFAs), which are plausible mediators through inflammation and barrier-related signaling.
- Neuroactive precursor pathways (represented here as a proxy index, not a measured biomarker) provide a second plausible route.

### Visual 5 — Plausible Physiological Pathway: Fiber-to-Cognition

![Plausible Physiological Pathway: Fiber-to-Cognition](images/fiber_to_cognition_pathway.png)

*Figure 5. Mechanism schematic: Fiber Intake → SCFAs (Short-Chain Fatty Acids) → Reduced Inflammation + Cellular Signaling → Improved Cognition. Labeled "PLAUSIBLE PATHWAY" to distinguish from proven causality. Created by Yana Evteeva (original diagram).*

### Conclusion

- In a de-identified teen pilot (n=66), higher diet scores correlate moderately with higher **overall cognitive score** and show similar positive correlations for **language** and **logical reasoning**.
- CogniBiome demonstrates a judge-ready, offline-first framework that **separates measured evidence (pilot correlations)** from **modeled proxy mechanisms (simulator layers)**.
- The system supports hypothesis generation but does **not** establish causality and does **not** make medical claims.

### Limitations

1. Pilot sample size (n=66) and observational design: correlation only; confounding likely (sleep, stress, workload, etc.).
1. Diet score is survey-derived (measurement noise / recall bias).
1. No measured teen microbiome or metabolomics: intermediate layers are modeled proxies.
1. Simulator artifacts are frozen demo parameters in this build (replaceable; not trained inside the app).
1. p-values are approximate as displayed and not corrected for multiple comparisons.

### Future Directions

- Replace demo artifacts with **trained stage artifacts** built offline from **paired** public cohorts where access allows (stage-wise training).
- Add a backend training pipeline (outside the judging/demo environment) with clear model cards and dataset provenance.
- Pursue an appropriate paired cohort (or partnership) that measures cognition with metabolomics — especially challenging in adolescents.
- Expand evidence cards and reference snapshots with strict licensing and reproducibility logs.

### References

- Sonnenburg, J. L. & Bäckhed, F. Diet–microbiota interactions as moderators of human metabolism. *Nature*, 535, 56–64 (2016).
- Cryan, J. F. et al. The microbiota–gut–brain axis. *Physiological Reviews*, 99(4), 1877–2013 (2019).
- MiMeDB: Wishart, D. S. et al. MiMeDB: the Human Microbial Metabolome Database. *Nucleic Acids Research*, 51(D1), D611–D620 (2023). https://mimedb.org/

---

## Print Checklist

- [ ] Figure 1 — Scatter plots (Diet Score vs Overall / Language / Logical) — credit line required
- [ ] Figure 2 — Bar chart (Pearson r across five metrics) — credit line required
- [ ] Figure 3 — Computational pipeline (D→X→M→Y, MEASURED vs MODELED) — credit line required
- [ ] Figure 4 — Reproducibility box (run hash + same inputs → same outputs) — credit line required
- [ ] Figure 5 — Fiber-to-Cognition pathway schematic — credit line required
- [ ] Top banner with project title, student name, and safety compliance statement
- [ ] References section on Right Panel

---

*All diagrams in `trifold/images/` are original visuals created by Yana Evteeva for the science fair physical display board. Correlation values reflect the actual pilot dataset (n=66) as computed by the CogniBiome Insights app.*
