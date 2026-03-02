# CogniBiome Insights — Study Guide & Reference (Student Edition)

> **What this is:** a learning guide for Yana (and other students) that explains *every key idea and term* used in the CogniBiome project in simple language.  
> **What this is not:** medical advice, a diagnostic tool, or proof of causality.  
> **How to use:** read in order the first time; later, jump to the Glossary and “Judge Questions” sections when preparing.

---


## Table of Contents

1. [Quick project summary](#quick-project-summary-one-page)
2. [Part A — Biology foundations](#part-a-biology-foundations-no-prior-bio-required)
3. [Part B — Data and statistics foundations](#part-b-data-and-statistics-foundations-no-prior-stats-required)
4. [Part C — The pilot dataset](#part-c-the-pilot-dataset-what-is-real-in-this-project)
5. [Part D — The simulator](#part-d-the-simulator-how-the-app-works-in-plain-language)
6. [Part E — Reference databases](#part-e-reference-databases-what-they-are-what-they-are-not)
7. [Part F — Judge questions](#part-f-judge-questions-short-safe-answers)
8. [Glossary](#glossary-quick-reference)
9. [Answers to quick checks](#answers-to-quick-checks)
10. [Image Credits](#image-credits)

---

## Quick project summary (one page)

### The big idea
Diet can influence cognition through the gut–brain axis. The pathway is complex, so we use a **transparent simulator** to explore “what-if” scenarios.

### The pipeline (the core model idea)
**D → X → M → Y**

- **D (Diet inputs):** fiber, added sugar, saturated fat, omega-3 proxy  
- **X (Microbiome proxies):** simplified “microbe balance” indicators  
- **M (Metabolite proxies):** simplified chemical output indicators (SCFAs + serotonin-precursor proxy)  
- **Y (Cognition proxies):** modeled changes in cognitive domains

### Measured vs modeled (VERY IMPORTANT)
**Measured (real):**
- Pilot teen dataset (**n = 66**) has **diet score + cognitive test results**.

**Modeled (proxy):**
- Microbiome and metabolites are **not measured in the teens**.  
- Those layers are **estimated** by the simulator to explain a plausible mechanism and to support hypothesis-testing.

---

## Part A — Biology foundations (no prior bio required)

### A1) The microbiome (what it means)
Your gut contains trillions of microorganisms (mostly bacteria). The community is called the **gut microbiome**.

Simple picture:
- If you feed the system a lot of **fiber** (plants, whole grains), microbes that can use fiber tend to increase.
- If you feed the system a lot of **added sugar**, a different pattern may dominate.

![The Microbiome: Good Bacteria vs Sugar-Loving Microbes](images/module2_concept1_microbiome.png)

*Figure 1. Conceptual microbiome shift with diet patterns. Created by Yana Evteeva.*

#### Key terms
- **Microbiome:** the community of microbes living in the gut.
- **Microbe / bacterium:** a microscopic organism.
- **Genus:** a category name for microbes (like “last name” grouping; e.g., *Bifidobacterium*).
- **Relative abundance:** “what percent of the microbes belong to group X”.

#### Quick check (answers at the end)
1) What is the microbiome?  
2) What does “relative abundance” mean?

---

### A2) Metabolites (what microbes produce)
Microbes “eat” parts of your diet (especially fiber) and produce small molecules. These molecules are called **metabolites**.

The most important example set in this project:
- **SCFAs (short-chain fatty acids):** acetate, propionate, butyrate

![Metabolites: The Chemical Messages from the Gut](images/module2_concept2_metabolites.png)

*Figure 2. Conceptual metabolite output from diet-driven microbial patterns. Created by Yana Evteeva.*

#### Why SCFAs are used in this project
Because they are:
- a common output of fiber fermentation,
- widely discussed in gut research,
- a practical minimal “proxy metabolite layer” for a small offline simulator.

#### Key terms
- **Metabolite:** small molecule made by metabolism (by microbes or by your body).
- **SCFA:** short-chain fatty acid (acetate, propionate, butyrate).

#### Quick check
1) What is a metabolite?  
2) Name the “big 3” SCFAs used here.

---

### A3) The gut–brain axis (how signals can reach the brain)
The gut and brain can communicate in multiple ways. We simplify into three “lanes”:

- **Neural lane:** signals through nerves (example: vagus nerve)  
- **Chemical lane:** molecules in blood can influence body systems that affect the brain  
- **Immune lane:** inflammation-related signals can affect brain function indirectly

![The Gut–Brain Axis: The Communication Highway](images/module2_concept3_gut_brain_axis.png)

*Figure 3. Three-lane gut–brain communication concept. Created by Yana Evteeva.*

#### Key terms
- **Vagus nerve:** a major nerve connecting gut signals to the brainstem.
- **Inflammation:** immune activation (helpful when controlled; harmful when chronic).

#### Quick check
1) Name the three “lanes” of the gut–brain axis.

---

## Part B — Data and statistics foundations (no prior stats required)

### B1) What is a variable?
A **variable** is a number that can change between people.

Examples in this project:
- Diet Score
- Stroop score
- Memory score
- Overall cognitive score

### B2) What is correlation (Pearson r)?
Correlation answers:
> “When one number goes up, does the other tend to go up too?”

**Pearson r** ranges from −1 to +1:
- **+1:** strong upward relationship  
- **0:** no clear linear relationship  
- **−1:** strong downward relationship  

**Important:** correlation does not prove causation.

#### Common confusion (must know)
- Ice cream sales and sunburns correlate. Ice cream does not cause sunburns.
- A third factor (summer heat) causes both.

### B3) What is a p-value (simple and honest)
A p-value is a way to ask:
> “If there were truly no relationship, how surprising is the correlation we observed?”

In this project, p-values are presented as **approximate** (a quick estimation is enough for a demo). Do not oversell p-values as “proof”.

### B4) Confounders (hidden variables)
A **confounder** is a factor that affects both variables.

Example:
- Students who sleep more might eat better and also perform better.
- Sleep would “confound” the diet–cognition relationship.

#### Quick check
1) What does r measure?  
2) Why doesn’t correlation prove causation?  
3) What is a confounder?

---

## Part C — The pilot dataset (what is real in this project)

### C1) What was measured (real teen pilot, n = 66)
The pilot contains:
- a diet quality score (from a survey)
- four cognitive tests:
  - Stroop (attention / processing control)
  - memory recall
  - language/vocabulary
  - logical reasoning

### C2) What was found (how to talk about it)
In the pilot, diet score showed a **moderate positive correlation** with overall cognition (r ≈ 0.37; p-value shown as approximate in the app).

A correct way to say it:
> “In this sample, higher diet score is associated with higher overall cognitive score. This does not prove diet causes cognition, but it is a meaningful pattern worth investigating.”

A risky way to say it (avoid):
> “Diet causes better cognition.”

#### Quick check
1) What makes the pilot “real”?  
2) What is the biggest limitation of the pilot for mechanism?

---

## Part D — The simulator (how the app works in plain language)

### D1) Why we need a simulator
To study a mechanism, you would ideally measure:
diet + microbiome + metabolites + cognition in the same people.

That is hard (especially in teens), so the simulator fills the missing middle with **modeled proxy layers**.

### D2) Deterministic simulator (what “deterministic” means)
Deterministic means:
> same inputs → same outputs

Like a calculator: if you type the same inputs, you get the same results.

### D3) “Model artifacts” (what stage1/stage2/stage3 really are)
The simulator uses **frozen parameter files** (JSON artifacts), not a live training system inside the app.

This matters for judge wording:
- Safe: “frozen demo coefficients” / “replaceable artifacts”
- Risky: “pre-trained model” (sounds like you trained it in this build)

### D4) Run hash (why it exists)
Each run gets a **SHA-256 hash** based on the inputs and model version. Think of it as a digital receipt:
- If you repeat the same run, you should get the same hash.

#### Quick check
1) What does deterministic mean?  
2) What is a proxy layer?  
3) What is the run hash for?

---

## Part E — Reference databases (what they are, what they are not)

### E1) Reference database vs training dataset
A **reference database** tells you that a link is biologically plausible (example: “some microbes can produce metabolite X”).

A **training dataset** is paired measurements where inputs and outputs are measured together (needed for supervised learning).

This difference is one of the most important judge questions.

### E2) What is included in the app (reference snapshots for demo)
The app uses small offline “reference snapshots” for demo and explanation:
- USDA FoodData Central (nutrients)
- pathway references (Reactome/WikiPathways)
- microbe ↔ metabolite evidence references (MiMeDB-style tables)

Important wording:
> “small curated offline reference snapshots”, not “full database dumps” and not “training datasets”.

Note: the app works without internet during judging — this is a **presentation reliability constraint**, not a research objective. These snapshots are background context; they are not used to train the simulator.

---

## Part F — Judge questions (short, safe answers)

### “Did you measure microbiome and metabolites in the teens?”
No. The teen pilot contains only diet score and cognitive tests. Microbiome and metabolite layers in the app are modeled proxy layers to explore plausible mechanisms.

### “So is this proof that diet causes cognition?”
No. The pilot is correlational. The simulator is a hypothesis generator and a teaching tool.

### “Then why include microbiome and metabolites at all?”
Because the gut–brain axis literature suggests plausible intermediate biology. The simulator helps visualize and test “what-if” scenarios while keeping measured vs modeled clearly separated.

### “Are your models trained in the app?”
No. This build uses frozen, deterministic artifacts so the demo works offline and is reproducible. Future work would replace artifacts with trained versions using paired public datasets.

---

## Glossary (quick reference)

- **Added sugar:** sugar added during processing (not naturally occurring sugar in whole fruit).
- **Causation:** A causes B (stronger than correlation).
- **Confounder:** hidden factor influencing both variables.
- **Correlation (Pearson r):** measure of linear association (−1 to +1).
- **Deterministic:** same inputs give same outputs.
- **Gut–brain axis:** communication network between gut and brain.
- **Metabolite:** small molecule produced by metabolism.
- **Microbiome:** community of microbes living in the gut.
- **Proxy:** an estimated stand-in for a missing measurement.
- **SCFA:** short-chain fatty acid (acetate, propionate, butyrate).
- **SHA-256:** hashing algorithm used to make a unique fingerprint for a run.

---

## Answers to quick checks

### A1
1) The microbiome is the community of microbes in the gut.  
2) Relative abundance means the percent of the community belonging to a group.

### A2
1) A metabolite is a small molecule made during metabolism.  
2) Acetate, propionate, butyrate.

### A3
1) Neural, chemical, immune lanes.

### B
1) r measures linear association.  
2) Because a third factor can cause both.  
3) A hidden factor affecting both variables.

### C
1) It comes from real teen survey + test measurements.  
2) It lacks biological intermediates (no microbiome/metabolites measured).

### D
1) Same inputs produce same outputs.  
2) A modeled stand-in for an unmeasured variable.  
3) It is a digital fingerprint of the run inputs + model version.

---

## Image Credits

All images in this guide and in associated CogniBiome documentation are student-created originals
or screenshots of the student's own application. No copyrighted third-party images are reproduced.

| Image | Credit |
|---|---|
| Gut–brain axis concept illustrations (Modules 2–3) | Created by Yana Evteeva (student-created original) |
| Trifold board visuals (scatter plots, bar chart, pipeline diagram) | Created by Yana Evteeva (student-created original; data from de-identified pilot dataset n=66) |
| Application screenshots | Screenshots of CogniBiome Insights (student project) |

For full image-by-image credits, see [Image Credits](image_credits.md).