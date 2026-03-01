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

**Important note on license:** We include only short educational notes and citations referencing MiMeDB; no copyrighted text is redistributed. The microbe–metabolite associations in `mimedb.json` were compiled from peer-reviewed literature rather than downloaded from the MiMeDB CSV exports (Cloudflare security prevented programmatic access). Whether those literature-derived records fall under a CC BY‑NC 4.0 restriction cannot be confirmed from the MiMeDB website alone — **I cannot confirm this** without direct access to the MiMeDB Compliance page or an official data export. The `mimedb.json` file therefore marks each link with `"source_in_mimedb_csv": false` and labels it "cannot confirm from parsed MiMeDB CSV" in the UI evidence cards.

---

## Usage guardrails for judging
- These sources are used **only for evidence cards / definitions**.  
- The simulator is a **deterministic hypothesis generator** and does not prove causality.
- This app is not medical advice and not a diagnostic device.
