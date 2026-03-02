# Source-of-Truth Guide — CogniBiome Runtime Docs

## Canonical Sources (Do Not Overwrite Without Review)

| File / folder | Source of truth | How updated |
|---|---|---|
| `public/docs/user_guide.md` | Manually maintained user guide (updated.md from incoming zip) | Replace file manually from `to_add/` or the updated .md |
| `public/reference/nhanes_nutrient_reference.csv` | Incoming snapshot zip (`reference_snapshots*.zip`) | Copy from `to_add/`, verify sha256 matches `public_datasets_manifest.json` |
| `public/reference/public_datasets_manifest.json` | Incoming snapshot zip | Copy from `to_add/`, never let `extract:bundle` overwrite |
| `public/docs/external_datasets_overview.md` | This repo | Consolidated external datasets doc (replaces external_sources_overview.md, public_datasets_README.md, README_data_build.md) |
| `public/external_sources_for_Gut_overview.txt` | This repo (English) | Edit in-repo; do NOT restore from old bundle containing Russian text |
| `public/foundation_pack/docs_index.json` | This repo | Manually edited; guarded by `extract:bundle` safe-mode |

## extract:bundle Behaviour

`npm run extract:bundle` operates in **safe mode by default**: it skips any
`/public/` file that already exists, so it cannot silently revert hand-edited
docs.

To overwrite existing public files from the bundle:

```
npm run extract:bundle -- --force
```

Only use `--force` when you have intentionally updated the bundle source
(`COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md`) and want to push those changes to
`/public/`.

## Cyrillic Gate

`npm test` automatically runs `npm run check:no-cyrillic` as a pretest step.
This scans ALL files under `public/**` (no exclusions) and fails if any
Cyrillic characters are found. This prevents Russian-language build artifacts
from being shipped in the runtime.

## MiMeDB Links

All entries in `public/reference/mimedb.json` → `microbe_metabolite_links`
have `source_in_mimedb_csv: false`. They are literature-derived associations,
not confirmed from the MiMeDB CSV join table (which does not exist in the v2
export). The UI always labels them **"unconfirmed"**.

## Audit Copies

Canonical audit copies of snapshot files live under `app_context/reference_snapshots/`:

```
app_context/reference_snapshots/reference/
  nhanes_nutrient_reference.csv
  public_datasets_manifest.json
  public_datasets_README.md
```

These are read-only reference copies and are never served at runtime.
