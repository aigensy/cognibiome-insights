# External Datasets Overview — CogniBiome

This document consolidates all external dataset information for the CogniBiome application: which external sources are used, how they are embedded offline, how bundled snapshots were prepared, and licensing notes.

**Key principle:** the app works fully offline without any network dependencies. All external sources are used exclusively as pre-prepared reference snapshots bundled with the project. No pilot data is transmitted externally. Bundling is controlled by `/public/reference/public_datasets_manifest.json` (`included: true`).

---

## Decision Matrix: Which External Sources Are Used

| Source | Used? | How used (inside the app) | What was prepared |
|---|---|---|---|
| **USDA FoodData Central (FDC)** | **YES** | "Food/Nutrient Evidence" layer: explains why diet changes affect fiber / sugar / saturated fat at the nutrient level. CC0. | `reference/usda_fdc.json` (food list + nutrients) and nutrient → diet-component mapping. |
| **Reactome** | **YES** | "Pathway cards": brief biological pathway cards (e.g. tryptophan/serotonin) with citations. CC0 data / CC BY 4.0 illustrations. | `reference/reactome.json` (selected pathways + descriptions + identifiers). |
| **WikiPathways (JSON)** | **YES** | "Mechanism diagrams" layer: local JSON for key pathway diagrams. WikiPathways content under CC0 waiver. | `reference/wikipathways.json` with selected pathways + `wikipathways_license.md`. |
| **MiMeDB (Microbial Metabolome DB)** | **YES** | "Microbe ↔ metabolite evidence" layer: reference associations between microbes and metabolites. License/terms: see official MiMeDB terms at https://mimedb.org/. | `reference/mimedb.json` (relevant fields only) + `REFERENCES_AND_LICENSES.md`. |
| **PubChem** | **NO** | Not used in v1: adds network dependency and is not critical for the demo. PubChem does not issue API keys. | Nothing prepared. |
| **HMDB** | **NO** | Not used: higher licensing risk and volume; MiMeDB + Reactome cover the needed associations. | Nothing prepared. |

---

## How External Data Is Embedded (No Network Required)

### 1) FDC (USDA) — Nutrients as Diet Score explanation

- **UI:** "Nutrition Evidence" panel (in Methods & Rigor / Simulator).
- **Function:** when the user adjusts "diet quality" in the simulator, the app shows which nutrients typically shift and why that is biologically plausible.
- **Technically:** the app reads a **local JSON file** — no live API call.
- **Why:** the FDC API requires a data.gov API key that cannot be published (it can be deactivated), and is subject to rate limits. A local snapshot is safer for offline/judge demonstrations.

### 2) Reactome — Pathway Cards

- **UI:** "Pathway Cards" block with 5–10 cards, each: name → brief description → "why it matters" (no medical claims) → citation.
- **Technically:** local `reactome.json`.
- **Licenses:** Reactome explicitly describes licenses (CC0 for data, CC BY 4.0 for illustrations/branding).

### 3) WikiPathways — Local Pathway Diagrams

- **UI:** small gallery (2–4) of diagrams/schemas in "Methods & Rigor".
- **Technically:** local `*.json` files, no network requests.
- **Licenses:** CC0 waiver.

### 4) MiMeDB — Microbe ↔ Metabolite Reference

- **UI:** "Evidence table" (search/filter) + educational context.
- **Technically:** local JSON, pre-filtered to a small set of rows and fields (fast load). All links are marked `source_in_mimedb_csv: false` because the MiMeDB CSV exports do not include a join table; links are literature-derived and labeled "cannot confirm from parsed MiMeDB CSV" in the UI.
- **License/terms:** cannot confirm from this repo; see official MiMeDB terms at https://mimedb.org/.

---

## Bundled Reference Snapshots

These files are **small, offline-friendly reference snapshots** that support the Public Datasets screen. They are **not training datasets** and **do not contain participant-level records**.

**Key rule:** the app makes **no runtime API calls**. "Bundled = Yes" means a snapshot file exists under `/public/reference/` and is listed with `included: true` in `/public/reference/public_datasets_manifest.json`.

Access date for this snapshot set: 2026-03-01 (UTC).

### How bundling works

- **Canonical manifest path:** `/public/reference/public_datasets_manifest.json`
- **`included: true`** in the manifest controls whether the app build treats a dataset as bundled. The UI reads this field at runtime (via a local fetch of the manifest JSON) and displays "Bundled = Yes" or "Not bundled" accordingly.
- **Metadata-only snapshots** are used when raw datasets are too large or carry usage constraints that prevent redistribution. These snapshots contain only study IDs, titles, and official entry-point URLs — enough for offline review without redistributing restricted data.

### NHANES — `nhanes_nutrient_reference.csv`

A small table of **variable names and observed ranges** transcribed from the NHANES 2021–2022 DR1TOT_L (Day 1 total nutrient intakes) documentation.

- Contains: variable code, nutrient name, units, min/max observed values.
- Does **not** contain participant-level NHANES records.
- Used in this build as **UI reference context only** (Simulator reference ranges panel). NHANES is **not** a training source for any model coefficient in this build.

Primary source page: https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2021/DataFiles/DR1TOT_L.htm

### HMP — `hmp_reference.json`

A small **resource index** pointing to official HMP/iHMP "QIIME community profiling" (HMQCP) download endpoints (OTU table + mapping/notes).

- Contains: file names + official URLs.
- Does **not** bundle the large OTU tables themselves.

**Important:** HMP Phase 1 (HMP1) is primarily a **healthy-baseline** reference resource — it characterizes microbial diversity in healthy adults. It is **not** an IBD training dataset and is **not** used as a training source in this build. The relevant disease-focused paired multi-omics resource for this project's roadmap is **iHMP/IBDMDB**.

### American Gut — `american_gut_reference.json`

A small **index of primary accessions and entry points** for the American Gut Project.

- ENA project: PRJEB11419 (sequences + metadata)
- Qiita study: 10317 (processed BIOM artifacts + metadata)

Primary ENA page: https://www.ebi.ac.uk/ena/browser/view/PRJEB11419

### MetaboLights — `metabolights_reference.json`

A small list of **MetaboLights study accessions and titles** explicitly relevant to gut/microbiome or gut-brain axis contexts.

- Contains: MetaboLights accession + title + a reference page link.
- Does **not** contain metabolite matrices.

### Metabolomics Workbench — `metabolomics_workbench_reference.json`

A small list of **Metabolomics Workbench study IDs and titles/contexts** relevant to gut microbiome or microbiome-metabolome studies.

- Contains: Study ID + title (when available) + reference page link.
- Does **not** contain metabolite matrices.

### Future target datasets (not bundled in this build)

The following datasets are identified in the project roadmap as targets for future backend training pipelines. They are **not bundled** in the current build.

**iHMP / IBDMDB** — Integrative Human Microbiome Project, IBDMDB sub-study
- Longitudinal paired multi-omics (stool metagenomics, metatranscriptomics, metabolomics).
- Primary candidate for the X→M (microbiome → metabolites) training stage.
- Population: Crohn's disease and ulcerative colitis patients; cross-population transfer to a healthy-teen context requires careful validation.
- Access: https://hmpdacc.org/

**ZOE PREDICT** — large-scale diet and microbiome cohort
- Simultaneous dietary intake records, gut metagenomics, blood metabolomics, and glycemic response data.
- Primary candidate for the D→X (diet → microbiome) training stage.
- Public metagenome sequences available via ENA; richer metadata may require formal data access request.

---

## Data Build Notes

This project is offline-first for judge review: the app must NOT call external APIs at runtime. External sources are packaged as small "reference snapshots" under `/public/reference/`.

To refresh them, use one of:
1. Manual download + filtering (Excel / pandas)
2. A web-enabled agent (ChatGPT Agent Mode) that downloads official datasets, filters a small subset, and writes JSON files back into the zip.

See `/agent/AGENT_MODE_DATA_COLLECTION_PROMPT.md` for the detailed agent prompt.

---

## Bundled Reference File Structure

```
reference/
  usda_fdc.json
  reactome.json
  wikipathways.json
  mimedb.json
  REFERENCES_AND_LICENSES.md
  nhanes_nutrient_reference.csv
  public_datasets_manifest.json
  README_data_build.md
```

---

## Summary

- **External sources used:** FDC (USDA), Reactome, WikiPathways, MiMeDB.
- **Not used:** PubChem and HMDB (not needed for v1; adds risk).
- All sources bundled as local JSON/CSV snapshots — no API keys required at runtime.
- License/attribution notes are in `REFERENCES_AND_LICENSES.md`.
