# Right Panel — Discussion & Reproducibility

*Content for the right panel of the science fair trifold board. Student: Yana Evteeva, Dr. Ronald E. McNair Academic High School.*

---

## Analysis (mechanistic interpretation; no overclaiming)

**What the pilot data shows (measured):**

- A moderate positive association between diet score and overall cognition, and similar signals for language and logical reasoning.

**What is modeled (proxy layers):**

- Teens do not have measured microbiome/metabolomics in the pilot dataset.
- The simulator provides a *transparent, reproducible* "what-if" pathway:
  Diet (D) → Microbiome proxies (X) → Metabolite proxies (M) → Cognition proxies (Y)

**Biological plausibility (high-level):**

- Higher fiber intake can increase microbial fermentation outputs (SCFAs), which are plausible mediators through inflammation and barrier-related signaling.
- Neuroactive precursor pathways (represented here as a proxy index, not a measured biomarker) provide a second plausible route.

**Why deterministic simulation matters for judging:**

- Same inputs + same artifacts → same outputs.
- Each run includes a SHA-256 hash so results are auditable and repeatable.

---

## Conclusion (evidence-based)

- In a de-identified teen pilot (n=66), higher diet scores correlate moderately with higher **overall cognitive score** and show similar positive correlations for **language** and **logical reasoning**.
- CogniBiome demonstrates a judge-ready, reproducible framework that **separates measured evidence (pilot correlations)** from **modeled proxy mechanisms (simulator layers)**. The app runs offline during judging as a presentation reliability constraint.
- The system supports hypothesis generation but does **not** establish causality and does **not** make medical claims.

---

## Limitations (realistic)

1. Pilot sample size (n=66) and observational design: correlation only; confounding likely (sleep, stress, workload, etc.).
2. Diet score is survey-derived (measurement noise / recall bias).
3. No measured teen microbiome or metabolomics: intermediate layers are modeled proxies.
4. Simulator artifacts are frozen demo parameters in this build (replaceable; not trained inside the app).
5. p-values are approximate as displayed and not corrected for multiple comparisons.

---

## Future Directions (expansion plan)

- Replace demo artifacts with **trained stage artifacts** built offline from **paired** public cohorts where access allows (stage-wise training).
- Add a backend training pipeline (outside the judging/demo environment) + clear model cards and dataset provenance.
- Pursue an appropriate paired cohort (or partnership) that measures cognition with metabolomics (especially challenging in adolescents).
- Expand evidence cards and reference snapshots with strict licensing and reproducibility logs.

---

## Suggested Visuals (what to print)

1. Scatter plots: Diet Score vs Overall / Language / Logical (with regression line).
2. Bar chart: Pearson r across the five cognitive metrics.
3. Pipeline diagram: D→X→M→Y with "MEASURED vs MODELED (proxy)" labels.
4. "Reproducibility box": run hash + "same inputs → same outputs."
5. Simple mechanism schematic: Fiber → SCFAs → inflammation/signaling → cognition (label "plausible pathway").

---

## Graphic Credit Reminders (for compliance)

- Every figure/diagram must have a small credit line ("Created by student" or "Image from …") and a reference list.

## References

- Sonnenburg, J. L. & Bäckhed, F. Diet–microbiota interactions as moderators of human metabolism. *Nature*, 535, 56–64 (2016).
- Cryan, J. F. et al. The microbiota–gut–brain axis. *Physiological Reviews*, 99(4), 1877–2013 (2019).
- MiMeDB: Wishart, D. S. et al. MiMeDB: the Human Microbial Metabolome Database. *Nucleic Acids Research*, 51(D1), D611–D620 (2023). [mimedb.org](https://mimedb.org/)
