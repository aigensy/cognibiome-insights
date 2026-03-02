# CogniBiome — Speech Package

**Document type:** timing-safe speech materials  
**Version:** 2026-03-01  
**Audience:** presenter (Yana Evteeva); judges; science-fair reviewers

> **One-sentence disclaimer (say aloud at any point if needed):**
> "This version is an educational hypothesis generator, not a medical device."

---

## Part 1 — 2-Minute Project Video Script (max 2:00)

> **Timing guide:** each section is labeled with cumulative elapsed time.
> Read at a calm, measured pace — roughly 130 words per minute.
> Total word count: ~240 words (~1:50 at 130 wpm).

---

**(0:00) Opening**

My name is Yana Evteeva.

My question: if diet is linked to attention and memory, what biological pathway could connect them?

---

**(0:12) The real data**

In 2025, I collected a de-identified pilot dataset from 66 high-school students.
Each student completed a diet survey and four well-known cognitive tasks/tests.

When I computed the correlations, overall cognitive score versus diet score showed:
Pearson r equal to 0.367, with an approximate p-value of 0.003.
Language and logical reasoning showed similar positive relationships.
Stroop and memory were weaker.

Correlation does not establish mechanism — and the pilot does not include microbiome data.

---

**(0:40) The engineering decision**

No single publicly available dataset combines diet, gut metagenomics, metabolomics, and cognition
in the same healthy teenagers.

So instead of claiming a model I did not have the data to train,
I built CogniBiome Insights: two honest, auditable components.

---

**(0:58) Component one — Pilot Results**

The Pilot Results screen loads the real CSV and computes all statistics live.
Nothing is simulated there.

---

**(1:08) Component two — Simulator**

The Simulator lets you adjust diet inputs — fiber, added sugar, saturated fat, omega-3 proxy.
The app propagates them through three modeled stages:
diet to a microbiome proxy layer, microbiome to metabolite proxies, metabolites to cognitive domains.

Every run generates a SHA-256 run hash and records model versions, making the output
reproducible and inspectable.

---

**(1:30) What I learned**

Reference databases like MiMeDB are evidence context, not training data.
The perfect paired dataset does not exist for healthy teens.
And heavy omics pipelines require backend compute — a browser app cannot do that honestly.

---

**(1:45) Roadmap**

The app architecture is designed to accept trained artifact files later,
when paired datasets and a proper training pipeline are in place.

---

**(1:55) Close**

CogniBiome Insights: real data, transparent simulation, honest limits.

---

## Part 2 — 2–3 Minute Judge Script (ISEF-style sections)

> **Timing guide:** cumulative elapsed time shown for each section.
> Total word count: ~380 words (~3:00 at 130 wpm with pauses).
> Shorten to ~2:30 by omitting the bracketed optional sentences.

---

### INTRODUCTION (0:00–0:20)

My research question is: if diet is correlated with attention and memory, what plausible biological
pathway through the gut–brain axis could explain that relationship?

---

### METHODS (0:20–1:00)

I collected a de-identified pilot dataset from 66 high-school students: one composite diet score
and four well-known cognitive tasks/tests — Stroop, memory recall, language fluency, and logical
reasoning.

The Pilot Results screen in the app loads this CSV live, computes summary statistics, Pearson
correlations, and approximate p-values using a deterministic statistics engine.

The pilot dataset is **validation-only** and is never used to set simulator parameters.

[Optional: All p-values displayed are labeled "approximate as displayed in the app" and are
computed with the Abramowitz and Stegun formula — not corrected for multiple comparisons.]

---

### RESULTS (1:00–1:30)

For overall cognition versus diet score:

- Pearson r equals 0.367, with an approximate p-value of 0.003 — as displayed in the app.

Language and logical reasoning show similar moderate positive correlations.
Stroop and memory are weaker in this sample.

These are descriptive correlations. They are directionally consistent with the gut–brain hypothesis
but do not establish causation or control for confounders such as sleep, exercise, or
socioeconomic factors.

---

### DISCUSSION (1:30–2:15)

Correlation does not show mechanism. To model the pathway, I would need paired measurements of
diet, gut metagenomics, metabolomics, and cognition in the same individuals.

That data does not exist as a single open, ethically accessible source for healthy teenagers.

So I built a deterministic simulator that makes the hypothesized pathway explicit.
Gut microbes ferment dietary fiber into short-chain fatty acids, including butyrate, which has
plausible roles in gut–brain signaling via blood-brain barrier regulation and vagus nerve pathways.

The simulator outputs — microbiome proxies, metabolite proxies, and cognitive domain estimates —
are all labeled "modeled proxy." They are not measured biomarkers.
Each run produces a SHA-256 run hash and records model versions for full reproducibility.

---

### CONCLUSIONS (2:15–2:40)

The deliverable today is an offline, reproducible hypothesis generator that clearly separates
measured outputs from modeled outputs.

Future work requires:
- Paired multi-omics datasets, such as iHMP/IBDMDB for microbiome-to-metabolite modeling,
  and ZOE PREDICT for diet-to-microbiome modeling.
- A backend training pipeline — the app architecture supports swapping in trained JSON artifact
  files without code changes.
- For the cognition stage specifically, a properly approved paired study or research partnership.

---

## Part 3 — 20-Second Answer: "Abstract vs App Mismatch"

> **Use this if a judge asks why the app looks different from the submitted abstract.**

"The abstract describes the research design: real pilot data plus a computational model of the
gut–brain pathway. The app implements exactly that — the Pilot Results screen shows the real
n=66 dataset, and the Simulator implements the hypothesized diet-to-cognition pipeline.
The abstract notes that model parameters are based on published reference data; in this build,
those parameters are frozen demo coefficients pending a future training pipeline.
Everything is transparently labeled in the app."

---

## Part 4 — Quick-Reference Card (print and keep at table)

| Situation | What to say |
|---|---|
| Judge asks "Is this causal?" | "No — all outputs are labeled modeled proxies. The pilot shows correlation, not mechanism." |
| Judge asks "Did you train this model?" | "The current build uses frozen demo coefficients. Training requires paired datasets not yet available." |
| Judge asks "What are those p-values?" | "Approximate, as displayed in the app — Abramowitz and Stegun formula, not corrected for multiple comparisons." |
| Judge asks "Is this a diagnostic tool?" | "No. One-sentence disclaimer: educational hypothesis generator, not a medical device." |
| Judge asks "Can I reproduce this run?" | "Yes — same inputs always produce the same SHA-256 run hash. The hash is shown in the Simulator provenance panel." |
| Judge asks about HMP or NHANES | "Both are used as reference context in this build, not as training data. HMP1 is a healthy-baseline resource." |
| Judge asks about iHMP or ZOE PREDICT | "Those are our future training targets — documented in the Presentation Addendum." |
