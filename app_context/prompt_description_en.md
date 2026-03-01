# CogniBiome Lovable Prompt — Detailed Description (English)

## Goal
This prompt instructs Lovable to generate a **judge‑ready, offline‑first PWA** called **CogniBiome** for the project:

**“Modeling Diet‑Driven Microbiome and Neurotransmitter Pathways Influencing Cognitive Performance.”**

The app must align with the submitted packet framing:
- It is a **deterministic simulator / hypothesis generator** (not a causal proof).
- It is **not medical advice** and **not a diagnostic device**.
- The teen pilot dataset (**n=66**) is **de‑identified** and **validation‑only**.
- Teens do **not** have measured microbiome/metabolomics; those layers are **modeled proxies**.

## Why “offline‑first” matters for judging
Science fair judging often happens with unreliable Wi‑Fi. The prompt therefore forces:
- local pilot charts computed from the CSV
- local deterministic simulation using frozen artifacts
- offline export to HTML (and optional print‑to‑PDF)

If required data is missing, the UI must request upload instead of inventing values.

## What “World Modeling” means here (practical, not philosophical)
“World modeling” in this app means building a **small typed graph** that represents the domain objects and their wiring:

**Entities**
- DietFeatures (inputs): fiber, added sugar, saturated fat, omega‑3 proxy (plus optional calories)
- NutrientProxies: definitions + units + tooltips
- MicrobeGenera (modeled): e.g., Bifidobacterium, Lactobacillus, F/B ratio
- MetaboliteProxies (modeled): acetate/propionate/butyrate scores, 5‑HTP precursor index
- CognitiveDomains (modeled): Stroop, memory, language, logical, overall
- EvidenceSources: USDA FDC / Reactome / WikiPathways / MiMeDB metadata and pathway IDs
- DatasetArtifacts: pilot CSV and model artifact bundles

**Relations**
DietFeatures → MicrobeGenera → MetaboliteProxies → CognitiveDomains

The purpose is **engineering consistency**:
- one canonical place for labels, units, ranges, disclaimers, and wiring
- deterministic behavior and UI generation
- easier traceability back to UR‑### and SRS‑REQ‑### requirements

This is not claiming a true biological causal graph; it is a controlled internal representation for a simulator.

## External reference snapshots (one JSON per source)
The app includes an “Evidence” layer that is **offline** and reads these files:

- `usda_fdc.json` — nutrient proxy definitions and a mapping from diet components to proxies (heuristic, clearly labeled)
- `reactome.json` — curated Reactome pathway IDs for pathway cards
- `wikipathways.json` — curated WikiPathways IDs (plus optional local diagram pointers)
- `mimedb.json` — schema placeholder for microbe↔metabolite evidence table (empty unless you later populate it)

These are used only for **tooltips, evidence cards, and references**, not for training models.

## Data leakage guardrails (judge‑facing)
The prompt forces a clear “Leakage Guardrails” explanation:
- pilot CSV is validation‑only
- no training/tuning on pilot data
- preprocessing “fit only on train” rule (if any model artifacts are swapped later)

## Deliverables the app must include
- Dashboard
- Pilot Results (real charts/tables from CSV; no synthetic points)
- Simulator (deterministic multi-stage run + run_hash)
- Methods & Rigor (limitations + disclaimers + leakage definition)
- Compare Scenarios (optional/SHOULD)
- Export 1‑page report (offline HTML, optional PDF)

## How to use this package in Lovable
Upload everything in this zip together with the prompt. The prompt explicitly lists every uploaded file and instructs Lovable to copy them into:
- `/app_context/...` (audit copies)
- `/public/reference/...` and `/public/pilot/...` (runtime)