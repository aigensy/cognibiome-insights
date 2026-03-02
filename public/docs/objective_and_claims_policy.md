# CogniBiome Insights — Objective & Claims Policy

**Created by:** Yana Evteeva | **Version:** 2026-03-01
**Audience:** Science-fair judges, reviewers, and students

> This document is the canonical single-page reference for what CogniBiome Insights is,
> what it claims, and what it explicitly does not claim.

---

## What this project is

CogniBiome Insights is a **student research project and educational simulator** demonstrating
a rigorous, staged modeling workflow for diet → gut biology → cognition problems.

The primary contribution is the **reproducible D → X → M → Y framework** and documentation
of how one would approach the full problem correctly when sufficient paired data and compute
are available. Diet–cognition association is used as a deliberately challenging case study.

---

## What "offline-first" means here

Offline-first is a **science-fair presentation reliability constraint** — the app must work
without internet during judging. It is not a research objective. The same architecture is
designed to accept trained model artifacts in a future backend phase.

---

## Role of the pilot dataset (n=66)

| What the pilot IS | What the pilot is NOT |
|---|---|
| Real de-identified teen data (diet score + 4 cognitive tests) | A microbiome or metabolomics dataset |
| Source for association charts (Pearson r, scatter plots) | A training or tuning source for simulator parameters |
| Benchmark for directional consistency checks | Proof of causality |

The pilot provides an **association signal only**. It has no microbiome or metabolomics
measurements, so it cannot validate the full biological pipeline. It is never used to fit
or tune simulator demo parameters.

---

## Meaning of MODELED PROXY outputs

All microbiome, metabolite, and cognitive outputs from the Simulator are **modeled proxies**:

- Built from **frozen demo coefficients** (directional placeholders in `stage1/2/3.json`)
- **Not trained** on any dataset inside this app
- **Not trained on NHANES** or any other public dataset in this build
- Labeled **MODELED PROXY** throughout the UI

These outputs are for hypothesis exploration and teaching — not for clinical prediction,
diagnosis, or causal inference.

---

## What this version DOES

- Demonstrates deterministic simulation runs with SHA-256 run hash and reproducible exports
- Teaches core concepts: correlation, confounding, proxy variables, mechanistic reasoning
- Allows side-by-side scenario comparison for learning
- Clearly separates real measured pilot evidence from modeled proxy layers

## What this version DOES NOT claim

- Does not prove causality between diet and cognition
- Does not diagnose or predict individual health outcomes
- Does not claim microbiome or metabolites were measured in the teen pilot
- Does not claim final population-level effect sizes
- Does not assert simulator coefficients are trained on any real paired dataset

---

## Future work (not in this build)

A future backend phase would replace frozen demo artifacts with trained stage models built
offline from properly licensed paired datasets (e.g., ZOE PREDICT for diet↔microbiome,
iHMP/IBDMDB for microbiome↔metabolomics). Many similar multi-layer biology problems
**become tractable in principle** with sufficient paired data and proper workflow — this
project demonstrates that workflow.
