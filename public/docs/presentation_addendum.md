# CogniBiome — Presentation Addendum

**Document type:** scientific narrative companion  
**Complements:** Project Abstract (DOC-025) — does not replace or modify it  
**Audience:** judges, reviewers, and collaborators who want the "what we learned" story behind the demo

---

## Why this document exists

The approved Project Abstract (DOC-025) describes the research question, design, and findings at
the level appropriate for submission. This addendum adds the engineering and scientific
decision-making context that a judge-ready demo build should be transparent about:
what the app actually does, what it honestly cannot do, and where it is going.

---

## What we learned

### 1. Reference databases are not training datasets

Databases like MiMeDB, Reactome, and WikiPathways are excellent for understanding what
*could* happen mechanistically — which microbes produce which metabolites under which conditions,
which pathways are plausible, and which literature supports a signaling route.

They do not, however, provide the paired numeric measurements needed to train a supervised
regression or classification model. A database entry saying "Bifidobacterium produces butyrate"
is mechanistic literature context — it is not a paired (diet input → butyrate concentration)
training example in a specific cohort.

### 2. The "perfect dataset" is not openly available

The ideal training set for this pipeline would combine, in the same individuals:
- detailed, validated dietary intake logs
- gut metagenomics (stool 16S rRNA or shotgun sequencing)
- plasma or stool metabolomics
- standardized cognitive assessments

No single publicly available dataset currently provides all four modalities together,
particularly in a healthy-teen population. Published cohorts like **ZOE PREDICT** demonstrate
large-scale simultaneous diet and microbiome measurement; **iHMP/IBDMDB** provides longitudinal
paired metagenomics and metabolomics — but in a disease context (IBD) rather than healthy
adolescents, and with metadata access constraints. Neither provides cognition data.

### 3. Browser-only computation has honest limits

Real metagenomics pipelines involve gigabytes of sequencing reads, quality filtering, taxonomic
classification, OTU/ASV table construction, and normalization. These steps require server-side or
HPC compute, not a browser JavaScript runtime.

Building a browser app that *claims* to run these pipelines would be scientifically dishonest.
Instead, the current build separates responsibilities cleanly:
- the web app handles **display, reproducibility, and hypothesis exploration**
- a future Python backend would handle **training and artifact export**

---

## Limitations

| Limitation | What it means in practice |
|---|---|
| Simulator uses frozen demo coefficients | Outputs are directional placeholders, not trained predictions |
| No participant-level omics data | All intermediate proxy values (microbiome, metabolites) are modeled, not measured |
| Pilot n=66 | Small sample; p-values are approximate and uncorrected for multiple comparisons |
| Self-reported diet | Diet scores are survey-based; subject to recall bias |
| No confounders controlled | Sleep, exercise, socioeconomic factors are not measured or adjusted for |
| Reference snapshots are metadata-only | NHANES, HMP, American Gut entries are index references, not raw participant data |

---

## Why simulator first

The simulator architecture was a deliberate scientific decision, not a shortcut:

1. **Transparency.** A deterministic, inspectable pipeline with frozen coefficients and SHA-256
   run hashes is more auditable than a black-box neural network trained on poorly-documented data.

2. **Honesty about what exists.** Claiming a fully trained gut–brain ML model is possible today
   would require data that does not exist in a single accessible, ethically clearable source.
   The simulator makes the mechanistic hypothesis visible while clearly labeling what is modeled.

3. **Forward compatibility.** The three-stage artifact files (`stage1.json`, `stage2.json`,
   `stage3.json`) are designed to be replaced with trained artifacts once paired data is available.
   The UI does not need to change — only the JSON files.

---

## Roadmap with dataset reality checks

### Stage D→X (Diet → Microbiome)

**Requirement:** large-scale paired dietary intake + gut metagenomics in the same individuals.

**Best current option:** ZOE PREDICT (UK cohort; diet + 16S/shotgun + metabolomics; not IBD-focused).
Public metagenome sequences are available; richer metadata may require a data access request.

**Honest status:** not yet implemented. Demo coefficients are directional placeholders.

### Stage X→M (Microbiome → Metabolites)

**Requirement:** paired metagenomics + metabolomics in the same samples, ideally longitudinal.

**Best current option:** iHMP / IBDMDB (Integrative Human Microbiome Project — IBDMDB sub-study).
Provides multi-timepoint stool metagenomics, metatranscriptomics, and metabolomics in the same
participants. Primary limitation: IBD population (not healthy teens). Access via HMP portal.

**Honest status:** not yet implemented.

### Stage M→Y (Metabolites → Cognition)

**Requirement:** paired plasma/stool metabolomics + standardized cognitive testing in the same
healthy individuals. This is the most constrained stage.

**Best current option:** no single open dataset found. Would require either:
- a new properly approved study design with institutional approval, or
- a research partnership with an existing cognition + microbiome cohort.

**Honest status:** not yet implemented. This stage requires the most future work.

### Future backend plan

```
Current (v0.1):    Browser-only app  →  frozen JSON stage artifacts
Future (Phase 2):  Python/FastAPI    →  stage-wise training on paired data
                   Export trained    →  replace stage*.json artifacts
                   UI unchanged      →  same React frontend, new artifact files
```

The Python backend would use scikit-learn or XGBoost for interpretability (not deep learning,
where mechanistic explanation is harder), with SHAP for feature importance validation.

---

## One-sentence summary

CogniBiome Insights is a transparent, reproducible educational simulator that shows real pilot
evidence and makes the diet–gut–brain hypothesis explorable — while being completely honest
about what has and has not been trained, what data exists, and what the path forward requires.
Offline-first operation is a presentation reliability constraint; the architecture is designed
to accept trained model artifacts in a future backend phase.
