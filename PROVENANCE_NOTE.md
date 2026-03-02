# Provenance Note — CogniBiome Insights

## Offline-First Rule

This application is designed to run **completely offline** with no runtime external API calls.
All reference data (pathways, nutrient tables, microbe–metabolite links) is bundled as static
JSON/CSV files under `public/reference/`. The runtime app never fetches data from third-party
servers during operation.

## Where Snapshots Live

| Location | Purpose |
|---|---|
| `public/reference/` | Runtime reference files served by the app (Vite static assets) |
| `app_context/reference/` | Audit copies of the same reference files |
| `app_context/reference_snapshots/` | Point-in-time read-only snapshot copies |
| `app_context/foundation_pack/` | Project BRD, SRS, and design documents |
| `app_context/pilot/` | Pilot dataset (n=66 synthetic records) |

## What the Manifests Mean

Two manifests are maintained and **auto-generated** by `npm run manifest:all`:

- **`public/UPLOAD_FILES_MANIFEST.md`** — lists every file under `public/`, with size in bytes
  and SHA-256 hash. Use this to verify the integrity of runtime assets.
- **`app_context/UPLOAD_FILES_MANIFEST.md`** — lists every file under `app_context/`, with the
  same format. Use this to verify the audit pack.

Both manifests exclude themselves from hashing (marked as `(self)`). Regenerate with:

```bash
npm run manifest:all
```

## MiMeDB Snapshot — Build Process and Provenance

The `public/reference/mimedb.json` file is built by running `npm run build:mimedb` offline.
The build script (`scripts/build-mimedb.ts`) reads two locally-obtained CSV files:

- `local/mimedb_metabolites_v2.csv` — MiMeDB v2 metabolite export
- `local/mimedb_microbes_v2.csv` — MiMeDB v2 microbe export

These files are **not committed** to the repository (they must be obtained directly from MiMeDB
before running the build script).

**Why microbe↔metabolite links are literature-derived:**
The MiMeDB CSV exports provide metabolite and microbe lists, but the `microbe_relations` column
in the metabolites export contains only a **count** — it does not provide individual microbe IDs
or a join table. No reliable microbe↔metabolite join table is present in the v2 CSV exports.
Therefore, the `microbe_metabolite_links` entries in `mimedb.json` are derived from
peer-reviewed literature for the target metabolites, and every link carries
`"source_in_mimedb_csv": false`.

**What `source_in_mimedb_csv: false` means:**
This flag applies exclusively to the `microbe_metabolite_links` array. It does NOT mean that
metabolite or microbe list records came from outside the CSV — those records are extracted
directly from the MiMeDB CSV exports.

**Licensing:**
MiMeDB's license terms have not been independently confirmed from the repo. Consult the
official MiMeDB website (https://mimedb.org/) before redistributing any derived content.
The `mimedb.json` file therefore makes no license assertion and is provided for educational
reference context only.

## Data Source Summary

| Source | License | Included |
|---|---|---|
| USDA FoodData Central | CC0 (public domain) | Yes — `usda_fdc.json` |
| Reactome | CC0 (data) | Yes — `reactome.json` |
| WikiPathways | CC0 waiver | Yes — `wikipathways.json` |
| MiMeDB | Unconfirmed (literature-derived records only) | Yes — `mimedb.json` |
| NHANES DR1TOT_L | NCHS Data User Agreement | Yes — `nhanes_nutrient_reference.csv` |
| HMP OTU table | Redistribution unclear | No |
| American Gut (Qiita) | Requires login | No |
| MetaboLights | Dataset-specific | No |
| Metabolomics Workbench | Non-commercial only | No |

## Citation for This Repository

If referencing this offline demo pack, please cite the individual upstream sources as listed in
`public/reference/REFERENCES_AND_LICENSES.md`.
