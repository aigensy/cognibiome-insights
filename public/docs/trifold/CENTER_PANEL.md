# Center Panel — Methodology & Key Results

*Content for the center panel of the science fair trifold board. Student: Yana Evteeva, Dr. Ronald E. McNair Academic High School.*

---

## Materials

**Data & software (this build is computational):**

- De-identified teen pilot CSV (n=66): diet_score, stroop_test, language_test, memory_test, logical_test, overall_score
- CogniBiome Insights web app (Pilot Results + deterministic Simulator + Export; runs offline during judging as a presentation reliability requirement)
- Frozen simulator artifacts: stage1.json, stage2.json, stage3.json (replaceable demo parameters)
- Optional offline reference snapshots for "evidence cards" (USDA/FDC, Reactome, WikiPathways, MiMeDB subset)

---

## Procedure (condensed, numbered)

1. **Load pilot dataset (n=66)** and validate integrity:
   overall_score = stroop + language + memory + logical (row-wise check).
2. Compute **summary statistics** for each metric (n, mean, median, min/max).
3. Compute **Pearson correlations** between diet_score and each cognitive metric.
   Note: p-values shown are **approximate as displayed in the app**.
4. Run deterministic simulations in the **D→X→M→Y** pipeline:
   - Input (D): fiber_proxy, added_sugar_proxy, sat_fat_proxy, omega3_proxy
   - Output (X): bifidobacterium, lactobacillus, firmicutes:bacteroidetes ratio (MODELED)
   - Output (M): acetate, propionate, butyrate, 5-HTP precursor index (MODELED)
   - Output (Y): stroop, language, memory, logical, overall (MODELED)
5. Save each run locally with provenance: **model versions + SHA-256 run hash** (same inputs → same outputs).

---

## Results (real pilot dataset: n=66)

**Diet score range:** 10–26 (mean 16.52)

**Overall score range:** 36.7–70.7 (mean 51.26)

## Correlation: Diet Score vs Cognitive Metrics

*(Pearson r rounded to 0.001. p-values are "approximate as displayed" and are not corrected for multiple comparisons.)*

| Cognitive metric | Pearson r | p-value (approx) | n |
|---|---:|---:|---:|
| Overall score | 0.367 | 0.0033 | 66 |
| Language test | 0.353 | 0.0052 | 66 |
| Logical reasoning | 0.336 | 0.0088 | 66 |
| Stroop test | 0.060 | 1.0000 | 66 |
| Memory test | 0.071 | 1.0000 | 66 |

**Objective summary:** In this sample, diet score shows the strongest positive association with **overall**, **language**, and **logical** scores.

> *Table 1. Pearson r correlation coefficients from pilot dataset (n=66), computed live by CogniBiome Insights app. Created by Yana Evteeva.*
