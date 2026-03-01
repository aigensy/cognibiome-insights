# External Data Sources Overview — CogniBiome

This document describes the external reference datasets used in the CogniBiome application and explains how each is used in the offline-first 3-stage model.

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
  public_datasets_README.md
  README_data_build.md
```

---

## Summary

- **External sources used:** FDC (USDA), Reactome, WikiPathways, MiMeDB.
- **Not used:** PubChem and HMDB (not needed for v1; adds risk).
- All sources bundled as local JSON/CSV snapshots — no API keys required at runtime.
- For FDC, **no API key is needed** because a local snapshot is used, not a live API.
- License/attribution notes are in `REFERENCES_AND_LICENSES.md`.
