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

## MiMeDB Links — Labeled Unconfirmed

The `public/reference/mimedb.json` file contains microbe–metabolite associations compiled from
peer-reviewed literature. These records were **not** derived from an official MiMeDB CSV export
(Cloudflare security blocked programmatic access). Each link carries `"source_in_mimedb_csv": false`
and is labeled "cannot confirm from parsed MiMeDB CSV" in the UI evidence cards.

Whether MiMeDB itself is licensed under CC BY-NC 4.0 has not been independently verified by
direct access to the MiMeDB Compliance page. Do not assert this license applies to our
literature-derived records without confirming it.

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
