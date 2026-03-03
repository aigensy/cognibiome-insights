# Modeling Diet-Driven Microbiome and Neurotransmitter Pathways Influencing Cognitive Performance

**CogniBiome: Diet → Microbiome → Metabolites → Cognition Simulator**

**Author:** [Yana Evteeva](https://www.linkedin.com/in/yana-evteeva)

**Online:** [CogniBiome](https://cobi.lovable.app)

> **Gut–Brain Axis Explorer and Hypothesis Generator** — deterministic, offline-first research simulator.
> Not a diagnostic device. Not medical advice. Not causal proof.

---

## Table of Contents

1. [Short description](#short-description)
2. [Main objectives](#main-objectives)
3. [Abstract](#abstract)
4. [Research question](#research-question)
5. [Hypothesis](#hypothesis)
6. [Biological rationale](#biological-rationale)
7. [Key findings (pilot dataset, n = 66)](#key-findings-pilot-dataset-n-66)
8. [What is real vs modeled](#what-is-real-vs-modeled)
9. [Reproducibility](#reproducibility)
10. [Limitations](#limitations)
11. [Future directions](#future-directions)
12. [Get it from GitHub and run locally](#get-it-from-github-and-run-locally)
13. [Repository structure](#repository-structure)
14. [Tech stack](#tech-stack)
15. [Scientific guardrails](#scientific-guardrails)
16. [Lessons learned](#lessons-learned)
17. [Academic Validation & Exhibitions](#academic-validation--exhibitions)
18. [Roadmap (future work)](#roadmap-future-work-not-in-this-build)

---

## Short description

CogniBiome is a **deterministic, offline-first research simulator** that demonstrates a
transparent, reproducible workflow for studying the
**diet → gut microbiome → metabolite (neurotransmitter-related) → cognition** pathway.

It implements a D→X→M→Y modeling framework with clear separation of measured evidence
(pilot diet + cognition) from modeled proxy layers (microbiome/metabolites). A de-identified
pilot dataset (n = 66) is used for correlation benchmarking. The app runs as a PWA with no
network dependency.

---

## Main objectives

1. **Demonstrate a general workflow** for a hard, multi-layer biology problem:
   Diet → Microbiome → Metabolites → Cognition, with clear stage boundaries (D → X → M → Y).
2. **Build a deterministic, reproducible simulator** that clearly separates:
   - **Measured evidence** (pilot diet + cognition),
   - **Modeled proxy mechanisms** (microbiome/metabolites).
3. **Quantify an association signal** in the pilot dataset (diet score vs cognitive domains)
   without causal claims.
4. **Document the data/compute requirements** needed for true stage-wise training and
   validation on paired cohorts.
5. **Offline-first PWA** — runs without network access; reproducible exports.

---

## Abstract

Diet quality is frequently associated with cognitive performance, yet directly testing a full
biological mechanism would require simultaneous measurement of diet, gut microbiome
composition, metabolite production, and cognition. This project presents **CogniBiome**, a
transparent, reproducible **deterministic simulator** that demonstrates a general workflow for
connecting these layers when enough **paired multi-omics + cognition data** and compute exist.

A de-identified adolescent pilot dataset (n = 66) containing a composite diet score and four
standardized cognitive assessments (attention/Stroop, memory, language, logical reasoning;
plus an overall composite) was analyzed to quantify diet–cognition associations. Pearson
correlations show a **moderate positive association** between diet score and overall cognition
(r = 0.367), with stronger associations for language (r = 0.353) and logical reasoning
(r = 0.336).

Because the pilot dataset does not include microbiome or metabolomics measurements,
intermediate layers are represented as **modeled proxies** rather than measured biomarkers.
The simulator is designed for **structured hypothesis generation and feasibility analysis**,
not diagnosis, medical use, or causal inference.

---

## Research question

How can **diet–cognition associations** be explored using a **transparent, reproducible
stage-wise workflow** that models intermediate **microbiome and metabolite layers** as proxies
when direct measurements are unavailable?

---

## Hypothesis

In a de-identified adolescent pilot sample, **higher diet quality** will be **modestly
associated** with higher cognitive performance, with the **strongest associations** expected
in **language** and **logical reasoning**. A staged simulator using literature-based proxy
mappings can **illustrate plausible intermediate pathways** without claiming causality or a
fully solved mechanism.

---

## Biological rationale

The **gut–brain axis** links diet, gut microbes, and brain function through multiple routes:

- **Fermentation of dietary fiber** by gut microbes can produce **short-chain fatty acids
  (SCFAs)** (acetate, propionate, butyrate), which may influence inflammation regulation,
  gut barrier integrity, and signaling relevant to brain health.
- Diet can affect microbial pathways involved in **tryptophan metabolism** and availability
  of precursors for neurotransmitter-related signaling.
- Some microbes can contribute to production or modulation of compounds related to
  **neuroactive signaling** (e.g., GABA-related pathways) and immune signaling that may
  affect cognition.

Because directly measuring all layers is difficult in typical research settings, CogniBiome
uses **proxy layers** to demonstrate how the mechanism would be tested in a fully instrumented
cohort.

---

## Key findings (pilot dataset, n = 66)

Pearson correlations between diet score and cognitive domains — computed live from
`pilot_dataset_n66.csv`. p-values are **approximate as displayed** (Abramowitz & Stegun
formula; not corrected for multiple comparisons).

| Cognitive metric | Pearson r | p-value (approx) |
|---|---:|---:|
| Overall score | 0.367 | 0.00329 |
| Language test | 0.353 | 0.00517 |
| Logical reasoning | 0.336 | 0.00876 |
| Memory test | lower | — |
| Stroop test | lower | — |

**Explained variance (overall):** r² ≈ 0.135 (~13.5% of variation in overall cognition
associated with diet score in this pilot sample).

These are **observational correlations**, not evidence of causation.

---

## What is real vs modeled

| Component | Status | Source |
|---|---|---|
| **Pilot Results** (scatter plots, correlations) | **Real measured data** | `pilot_dataset_n66.csv` — de-identified, n = 66 |
| **Simulator microbiome outputs** | Modeled proxy | Frozen demo coefficients (`public/models/stage1.json`) |
| **Simulator metabolite outputs** | Modeled proxy | Frozen demo coefficients (`public/models/stage2.json`) |
| **Simulator cognitive outputs** | Modeled proxy | Frozen demo coefficients (`public/models/stage3.json`) |
| **Reference snapshots** (NHANES, HMP, etc.) | UI context only | Metadata-only; no participant data; no training source |

The pilot CSV is used **for association benchmarking only**. No model coefficients were
trained in this build — all simulator stages run on frozen demo parameters.

---

## Reproducibility

Every simulation run is:

1. **Deterministic** — identical slider inputs always produce identical numeric outputs.
2. **Versioned** — the run records the semantic versions of all three stage JSON artifacts.
3. **Hashed** — a SHA-256 `runHash` is computed from the serialized inputs and model versions and stored in localStorage.

Model artifact files (frozen in this build):

```
public/models/stage1.json   (Diet → Microbiome proxy)
public/models/stage2.json   (Microbiome proxy → Metabolite proxy)
public/models/stage3.json   (Metabolite proxy → Cognitive outputs)
```

---

## Limitations

- **Observational, correlational design:** no causal inference.
- **Self-reported diet:** potential recall and reporting bias.
- **No microbiome or metabolomics measurements:** intermediate layers are modeled proxies,
  not empirically measured biomarkers.
- **Uncontrolled confounders:** sleep, stress, socioeconomic factors, workload, etc.
- **Small sample (n = 66):** limits generalizability and stability of estimates.
- **Multiple comparisons:** p-values are approximate; not adjusted for multiple testing.
- **Simulator is not trained on paired cohorts:** outputs are illustrative, not validated
  predictions.

---

## Future directions

- Obtain or collaborate on a cohort with **paired measurements**: diet + microbiome
  sequencing + metabolomics + standardized cognition.
- Implement **stage-wise supervised training** (D→X, X→M, M→Y) with strict provenance,
  pre-registration where possible, and external validation.
- Prefer **longitudinal or intervention designs** to reduce confounding and improve causal
  interpretability.
- Expand transparency: dataset manifests, versioned coefficients, sensitivity analyses, and
  stronger evidence traceability.
- If a suitable public cohort exists, create an **offline reference snapshot** plus a
  documented training pipeline to reproduce results.

---

## Get it from GitHub and run locally

### Clone the repository

```bash
git clone git@github.com:aigensy/cognibiome-insights.git
cd cognibiome-insights
```

If you use HTTPS instead of SSH:

```bash
git clone https://github.com/aigensy/cognibiome-insights.git
cd cognibiome-insights
```

### Install dependencies

Requires **Node.js 20+** and npm.

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open `http://localhost:8080` in your browser (port is set to `8080` in `vite.config.ts`; if you change it there, use the matching port).

### Other useful commands

```bash
# Lint + test + production build in one step (CI equivalent)
npm run verify

# Unit and component tests only (Vitest)
npm test

# Production build only
npm run build

# Preview the production build locally
npm run build && npm run preview

# Lint only
npm run lint
```

### Playwright E2E tests (optional, requires a production build)

```bash
# Install Playwright browsers (first time only — may require root for OS deps)
npx playwright install --with-deps chromium

# Build, then run E2E tests (starts vite preview automatically)
npm run build
npx playwright test
```

### Updating Developer Guide screenshots

Screenshots for `public/docs/developer_guide.md` and `public/docs/user_guide.md` live in `public/docs/screenshots/app/`. Update them explicitly:

```bash
npm install
npm run update-userguide
```

This builds the app, runs the Playwright E2E spec, writes screenshots into `public/docs/screenshots/app/`, updates the timestamp in `developer_guide.md`, and commits the changes. CI does not auto-update screenshots; use this command when UI changes require new docs visuals.

---

## Repository structure

```
cognibiome-insights/
├── public/
│   ├── docs/                   Markdown docs shown in the in-app Docs viewer
│   │   ├── user_guide.md           Canonical user guide
│   │   ├── presenter_pack.md       Consolidated presenter guide + speech scripts
│   │   ├── objective_and_claims_policy.md  What the project is/is not (claims policy)
│   │   ├── cognibiome_study_guide.md       Student learning reference
│   │   ├── talk_script.md          Primary presentation talking script ("Talking Story")
│   │   ├── talk_script2.md         Alternative talking script
│   │   ├── developer_guide.md      Internal developer reference
│   │   ├── implementation_plan.md  Build plan and future roadmap
│   │   ├── external_datasets_overview.md   Overview of external reference datasets
│   │   ├── image_credits.md        Image credit list
│   │   ├── trifold/                Trifold board content
│   │   │   ├── initial/            Original trifold panels (TOP_BANNER, LEFT/CENTER/RIGHT)
│   │   │   └── final/              Final trifold variant (12 section files)
│   │   ├── screenshots/app/        App screenshots for user/developer guides (updated via npm run update-userguide)
│   │   └── images/                 Embedded images for docs
│   ├── foundation_pack/        Project requirements and design artifacts (shown in Docs viewer)
│   │   ├── docs_index.json         Master index of all in-app documents
│   │   ├── user_requirements.json  User requirements (UR-001 … UR-015)
│   │   ├── BRD/                    Business Requirements Document
│   │   │   ├── brd.json
│   │   │   └── business_knowledge.json
│   │   └── SRS/                    Software Requirements Specification
│   │       ├── gui_spec.json
│   │       └── traceable_requirements.json
│   ├── models/                 Frozen demo stage artifacts (not trained)
│   │   ├── stage1.json             Diet → Microbiome proxy coefficients
│   │   ├── stage2.json             Microbiome proxy → Metabolite proxy coefficients
│   │   └── stage3.json             Metabolite proxy → Cognitive output coefficients
│   ├── pilot/
│   │   └── pilot_dataset_n66.csv   De-identified teen pilot dataset (n=66, real data)
│   └── reference/              Offline reference snapshots (metadata only, no training data)
│       ├── mimedb.json             MiMeDB microbe/metabolite reference index
│       ├── reactome.json           Reactome pathway reference
│       ├── wikipathways.json       WikiPathways reference
│       ├── usda_fdc.json           USDA FDC nutrient reference
│       ├── nhanes_nutrient_reference.csv
│       ├── hmp_reference.json      Human Microbiome Project reference
│       └── REFERENCES_AND_LICENSES.md
├── src/
│   ├── lib/
│   │   ├── pilotParser.ts          CSV ingestion, column mapping, integrity checks
│   │   ├── statistics.ts           Pearson r, p-values, summary stats
│   │   ├── simulator.ts            Deterministic 3-stage pipeline + SHA-256 run hash
│   │   └── utils.ts                Shared utilities
│   ├── pages/
│   │   ├── Dashboard.tsx           Home screen with navigation tiles and model version badge
│   │   ├── PilotResults.tsx        Pilot dataset charts, correlation table, scatter plots
│   │   ├── Simulator.tsx           Diet sliders → stage output panels + provenance card
│   │   ├── Methods.tsx             Leakage guardrails, data sources table, disclaimers
│   │   ├── Compare.tsx             Side-by-side scenario comparison
│   │   ├── ExportReport.tsx        1-page HTML/PDF report generator
│   │   ├── HelpDocs.tsx            In-app Docs viewer (renders MD/JSON/CSV offline)
│   │   └── PublicDatasets.tsx      External datasets reference page
│   ├── contexts/
│   │   └── AppContext.tsx          Global state: presenterMode, pilotDataset, simulation runs
│   ├── world_model/
│   │   └── worldModel.ts           Pipeline wiring, labels, units, ranges, DISCLAIMERS
│   ├── components/
│   │   └── AppSidebar.tsx          Sidebar navigation; Presenter Mode filtering
│   └── test/                   Vitest test suite
│       ├── docsIndex.test.ts        Validates docs_index.json integrity
│       ├── exportReport.test.ts     Export HTML generation tests
│       ├── screens.presenterMode.test.tsx  Screen-contract tests for demo routes
│       ├── presenterMode.test.tsx   Presenter mode UI behavior
│       ├── statistics.test.ts       Statistics engine unit tests
│       ├── pilotParser.test.ts      CSV parser unit tests
│       └── ...
├── scripts/
│   ├── build-mimedb.ts             Builds mimedb.json from local CSV exports
│   ├── extract-bundle.ts           Bundle extraction helper
│   ├── generate-upload-files-manifest.ts  Generates UPLOAD_FILES_MANIFEST.md
│   └── update-userguide.mjs        Regenerates developer guide screenshots (npm run update-userguide)
├── e2e/
│   ├── presenterMode.spec.ts       Playwright E2E tests + screenshot capture
│   └── screenshots/                Transient output (gitignored); docs screenshots in public/docs/screenshots/app/
├── app_context/                Audit mirror of public/foundation_pack/ and reference/
├── PROVENANCE_NOTE.md          Data provenance and licensing notes
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript (Vite) |
| UI | shadcn/ui (Radix UI) + Tailwind CSS |
| Charts | Recharts |
| Offline / PWA | vite-plugin-pwa (Workbox) |
| Tests | Vitest + React Testing Library |
| E2E | Playwright |
| Backend | **None** (browser-only in this build) |

---

## Scientific guardrails

- All simulator outputs are labeled **MODELED PROXY** in the UI.
- No output is described as a diagnostic result or as causal evidence.
- The pilot dataset is never used to fit or tune simulator parameters.
- p-values displayed are approximate (A&S formula); interpret as descriptive only.
- The project abstract and project plan PDFs are preserved verbatim in the Docs viewer.

---

## Lessons learned

1. **Reference databases ≠ paired training datasets.** MiMeDB, Reactome, and WikiPathways
   provide mechanistic plausibility context but do not supply the paired numeric measurements
   needed to train a supervised model.
2. **No single open dataset contains diet + microbiome + metabolomics + cognition together.**
   Published cohorts like ZOE PREDICT demonstrate large-scale diet-microbiome measurement;
   iHMP/IBDMDB provides longitudinal paired multi-omics. But no publicly available dataset
   currently combines all four modalities in healthy teenagers.
3. **Heavy pipelines require backend compute; browser-only is not appropriate for full omics
   processing.** Real metagenomics pipelines involve GBs of sequencing data, assembly, and
   feature engineering. A browser PWA can display results but cannot perform this processing
   honestly.

---

## Academic Validation & Exhibitions

- Presented at **Hudson County STEM Showcase** — March 2, 2026  
- Developed in alignment with **Regeneron ISEF** standards  
- Display & Safety review requirements applied  
- Documentation follows international science fair standards  

Exhibitions serve as independent validation of rigor and quality. The app is not designed exclusively for competition use.

---

## Roadmap (future work — not in this build)

| Phase | Description | Dependency |
|---|---|---|
| **Phase 2 (future)** | Python/FastAPI backend + offline training pipeline | Paired datasets with access approval |
| **Phase 2** | Stage-wise model training (scikit-learn / XGBoost): D→X, X→M, M→Y | D→X: ZOE PREDICT (if access granted); X→M: iHMP/IBDMDB |
| **Phase 2** | Replace frozen demo artifacts with trained `stage*.json` exports | Trained artifacts + MODEL_CARD.md |
| **Phase 3 (future)** | Paired cognition cohort or research partnership | Institutional approval + IRB |

The web app is designed to accept swapped-in trained artifacts without code changes — only
the JSON stage files need to be replaced. The offline-first PWA architecture supports
a future backend training phase.
