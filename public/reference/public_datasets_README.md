# Public Datasets Reference Snapshots (Offline-First)

These files are **small, offline-friendly reference snapshots** that support the Project Plan's
"Public Datasets Status" screen. They are **not training datasets** and **do not contain
participant-level records**.

**Key rule:** the app makes **no runtime API calls**. "Bundled = Yes" means a snapshot file exists
under `/public/reference/` and is listed with `included: true` in:
`/public/reference/public_datasets_manifest.json`.

Access date for this snapshot set: 2026-03-01 (UTC).

---

## How bundling works

- **Canonical manifest path:** `/public/reference/public_datasets_manifest.json`
- **`included: true`** in the manifest controls whether the app build treats a dataset as bundled. The UI reads this field at runtime (via a local fetch of the manifest JSON) and displays "Bundled = Yes" or "Not bundled" accordingly.
- **Metadata-only snapshots** are used when raw datasets are too large or carry usage constraints that prevent redistribution. These snapshots contain only study IDs, titles, and official entry-point URLs -- enough for offline review without redistributing restricted data.

---

## NHANES -- `nhanes_nutrient_reference.csv`

A small table of **variable names and observed ranges** transcribed from the NHANES
2021-2022 DR1TOT_L (Day 1 total nutrient intakes) documentation.

- Contains: variable code, nutrient name, units, min/max observed values.
- Does **not** contain participant-level NHANES records.
- Used in this build as **UI reference context only** (Simulator reference ranges panel).
  NHANES is **not** a training source for any model coefficient in this build.

Primary source page:
- https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2021/DataFiles/DR1TOT_L.htm

---

## HMP -- `hmp_reference.json`

A small **resource index** pointing to official HMP/iHMP "QIIME community profiling" (HMQCP)
download endpoints (OTU table + mapping/notes).

- Contains: file names + official URLs.
- Does **not** bundle the large OTU tables themselves.

**Important:** HMP Phase 1 (HMP1) is primarily a **healthy-baseline** reference resource --
it characterizes microbial diversity in healthy adults. It is **not** an IBD training dataset
and is **not** used as a training source in this build. The relevant disease-focused paired
multi-omics resource for this project's roadmap is **iHMP/IBDMDB** (see "Future target datasets"
section below).

Example official resource URL:
- http://downloads.ihmpdcc.org/data/HMQCP/otu_table_psn_v35.txt.gz

---

## American Gut -- `american_gut_reference.json`

A small **index of primary accessions and entry points** for the American Gut Project.

- ENA project: PRJEB11419 (sequences + metadata)
- Qiita study: 10317 (processed BIOM artifacts + metadata, depending on availability)

Primary ENA page:
- https://www.ebi.ac.uk/ena/browser/view/PRJEB11419

---

## MetaboLights -- `metabolights_reference.json`

A small list of **MetaboLights study accessions and titles** that are explicitly relevant to
gut/microbiome or gut-brain axis contexts.

- Contains: MetaboLights accession + title + a reference page link.
- Does **not** contain metabolite matrices.

---

## Metabolomics Workbench -- `metabolomics_workbench_reference.json`

A small list of **Metabolomics Workbench study IDs and titles/contexts** relevant to gut microbiome
or microbiome-metabolome studies.

- Contains: Study ID + title (when available in snapshot sources) + reference page link.
- Does **not** contain metabolite matrices.

---

## Manifest

The bundled status in the UI is driven by:

- `/public/reference/public_datasets_manifest.json`

It stores:
- dataset name
- bundled file path
- row_count (number of records in the snapshot file)
- sha256 of the snapshot file contents
- provenance source URL

---

## Future target datasets (not bundled in this offline-first build)

The following datasets are identified in the project roadmap as targets for future backend
training pipelines. They are **not bundled** in the current build and are listed here for
transparency and planning purposes only.

### iHMP / IBDMDB -- Integrative Human Microbiome Project, IBDMDB sub-study

- **What it provides:** longitudinal paired multi-omics -- stool metagenomics,
  metatranscriptomics, and metabolomics from the same participants across multiple timepoints.
- **Relevance:** primary candidate for the X->M (microbiome -> metabolites) stage of the
  future training pipeline. Rigorous paired design makes it suitable for supervised modeling
  of microbiome-to-metabolite relationships.
- **Population:** patients with Crohn's disease and ulcerative colitis (not healthy teens).
  Cross-population transfer to a healthy-teen context would require careful validation.
- **Access:** via the HMP Data Coordination Center portal (https://hmpdacc.org/).
- **Status in this build:** not bundled. Metadata index available in `hmp_reference.json`.

### ZOE PREDICT -- large-scale diet and microbiome cohort

- **What it provides:** simultaneous dietary intake records, gut metagenomics, blood
  metabolomics, and glycemic response data at scale (UK cohort, thousands of participants).
- **Relevance:** primary candidate for the D->X (diet -> microbiome) stage of the future
  training pipeline. Demonstrates that paired diet + microbiome measurement is feasible.
- **Access:** public metagenome sequences are available via ENA. Richer dietary metadata
  and matched metabolomics may require a formal data access request to the ZOE team.
- **Status in this build:** not bundled. No ZOE PREDICT data is included in any reference snapshot.

> **Note:** Both datasets above are labeled "not bundled in this offline-first build."
> Their inclusion in future phases depends on data access approval, dataset compatibility
> with the teen-cohort context, and availability of paired cognition data.
