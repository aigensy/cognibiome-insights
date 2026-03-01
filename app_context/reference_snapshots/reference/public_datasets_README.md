# Public Datasets Reference Snapshots (Offline-First)

These files are **small, offline-friendly reference snapshots** that support the Project Plan’s
“Public Datasets Status” screen. They are **not training datasets** and **do not contain
participant-level records**.

**Key rule:** the app makes **no runtime API calls**. “Bundled = Yes” means a snapshot file exists
under `/public/reference/` and is listed with `included: true` in:
`/public/reference/public_datasets_manifest.json`.

Access date for this snapshot set: 2026-03-01 (UTC).

---

## How bundling works

- **Canonical manifest path:** `/public/reference/public_datasets_manifest.json`
- **`included: true`** in the manifest controls whether the app build treats a dataset as bundled. The UI reads this field at runtime (via a local fetch of the manifest JSON) and displays "Bundled = Yes" or "Not bundled" accordingly.
- **Metadata-only snapshots** are used when raw datasets are too large or carry usage constraints that prevent redistribution. These snapshots contain only study IDs, titles, and official entry-point URLs — enough for offline review without redistributing restricted data.

---

## NHANES — `nhanes_nutrient_reference.csv`

A small table of **variable names and observed ranges** transcribed from the NHANES
2021–2022 DR1TOT_L (Day 1 total nutrient intakes) documentation.

- Contains: variable code, nutrient name, units, min/max observed values.
- Does **not** contain participant-level NHANES records.

Primary source page:
- https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2021/DataFiles/DR1TOT_L.htm

---

## HMP — `hmp_reference.json`

A small **resource index** pointing to official HMP/iHMP “QIIME community profiling” (HMQCP)
download endpoints (OTU table + mapping/notes).

- Contains: file names + official URLs.
- Does **not** bundle the large OTU tables themselves.

Example official resource URL:
- http://downloads.ihmpdcc.org/data/HMQCP/otu_table_psn_v35.txt.gz

---

## American Gut — `american_gut_reference.json`

A small **index of primary accessions and entry points** for the American Gut Project.

- ENA project: PRJEB11419 (sequences + metadata)
- Qiita study: 10317 (processed BIOM artifacts + metadata, depending on availability)

Primary ENA page:
- https://www.ebi.ac.uk/ena/browser/view/PRJEB11419

---

## MetaboLights — `metabolights_reference.json`

A small list of **MetaboLights study accessions and titles** that are explicitly relevant to
gut/microbiome or gut–brain axis contexts.

- Contains: MetaboLights accession + title + a reference page link.
- Does **not** contain metabolite matrices.

---

## Metabolomics Workbench — `metabolomics_workbench_reference.json`

A small list of **Metabolomics Workbench study IDs and titles/contexts** relevant to gut microbiome
or microbiome–metabolome studies.

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
