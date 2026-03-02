# References & Licenses (Offline Reference Pack)

This folder contains **offline snapshots / reference metadata** to support the CogniBiome demo.  
The app is designed to work **offline-first**; these reference files must not require live API calls.

## USDA FoodData Central (FDC)

The FoodData Central datasets used in this snapshot were obtained from the USDA's official FDC downloads and API.  The USDA states that FoodData Central data are in the **public domain**.  Its license terms note that the data are released under the Creative Commons CC0 1.0 Universal dedication and that no permission is needed to copy, modify or distribute them.  The USDA encourages users to cite FoodData Central as the source of the data.

- **Homepage:** https://fdc.nal.usda.gov/
- **API Guide:** https://fdc.nal.usda.gov/api-guide/
- **License page:** https://fdc.nal.usda.gov/help.html (see "Terms of Service")
- **Accessed:** 2026-03-01
- **Suggested citation:** U.S. Department of Agriculture, Agricultural Research Service. *FoodData Central* (release 2025-12-18). Available at fdc.nal.usda.gov.

## Reactome

Reactome is a curated knowledgebase of biological pathways.  The Reactome license states that all data in the Reactome database and files derived from the data are released under the **Creative Commons CC0 public domain dedication** and may be copied, modified and redistributed without permission.  Attribution is encouraged but not required.  (Note that Reactome artwork and branding remain protected and are not redistributed here.)

- **Homepage:** https://reactome.org/
- **License page:** https://reactome.org/license
- **Accessed:** 2026-03-01

## WikiPathways

WikiPathways is an open, community‑curated pathway resource.  According to its licence terms page, all content on WikiPathways is released under the **Creative Commons CC0 waiver**, meaning the pathways may be freely reused and remixed without restriction.  Users are encouraged to link back to the licence page when redistributing content.

- **Homepage:** https://www.wikipathways.org/
- **License terms:** https://classic.wikipathways.org/index.php/WikiPathways%3ALicense_Terms
- **Accessed:** 2026-03-01

## MiMeDB

MiMeDB (Human Microbial Metabolome Database) is a database linking metabolites to their microbial producers and human phenotypes.

- **Homepage:** https://mimedb.org/
- **Accessed:** 2026-03-01

**How the snapshot was built:**
The `mimedb.json` snapshot is built offline from locally-obtained MiMeDB v2 CSV exports
(`local/mimedb_metabolites_v2.csv` and `local/mimedb_microbes_v2.csv`) using the build script
`scripts/build-mimedb.ts`. The metabolite and microbe list records are extracted directly from
these CSV files.

**Why microbe↔metabolite links are literature-derived:**
The MiMeDB v2 CSV exports do not include a microbe↔metabolite join table — the
`microbe_relations` column contains a count only (no microbe IDs). Therefore, all entries in
the `microbe_metabolite_links` array are derived from peer-reviewed literature for the target
metabolites used in the CogniBiome D→X→M→Y pipeline. Every such link carries
`"source_in_mimedb_csv": false` and is labeled accordingly in the app.

**License:**
MiMeDB's official license terms were not confirmed at the time of this build. The snapshot is
used here solely as educational reference context. No copyrighted text or database content is
redistributed beyond the minimal metabolite/microbe reference records needed for the evidence
cards. Consult https://mimedb.org/ for current terms before any further redistribution.

---

## Usage guardrails for judging
- These sources are used **only for evidence cards / definitions**.  
- The simulator is a **deterministic hypothesis generator** and does not prove causality.
- This app is not medical advice and not a diagnostic device.
