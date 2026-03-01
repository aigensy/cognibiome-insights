# References & Licenses (Offline Reference Pack)

This folder contains **offline snapshots / reference metadata** to support the CogniBiome demo.  
The app is designed to work **offline-first**; these reference files must not require live API calls.

## USDA FoodData Central (FDC)

The FoodData Central datasets used in this snapshot were obtained from the USDA’s official FDC downloads and API.  The USDA states that FoodData Central data are in the **public domain**.  Its license terms note that the data are released under the Creative Commons CC0 1.0 Universal dedication and that no permission is needed to copy, modify or distribute them【161108883791467†L151-L156】.  The USDA encourages users to cite FoodData Central as the source of the data.

- **Homepage:** https://fdc.nal.usda.gov/
- **API Guide:** https://fdc.nal.usda.gov/api-guide/
- **Suggested citation:** U.S. Department of Agriculture, Agricultural Research Service. *FoodData Central* (release 2025-12-18). Available at fdc.nal.usda.gov.

## Reactome

Reactome is a curated knowledgebase of biological pathways.  The Reactome license states that all data in the Reactome database and files derived from the data are released under the **Creative Commons CC0 public domain dedication** and may be copied, modified and redistributed without permission【522492786839169†L205-L209】.  Attribution is encouraged but not required.  (Note that Reactome artwork and branding remain protected and are not redistributed here.)

- **Homepage:** https://reactome.org/
- **License:** https://reactome.org/license (data portions are CC0【522492786839169†L205-L209】)

## WikiPathways

WikiPathways is an open, community‑curated pathway resource.  According to its licence terms page, all content on WikiPathways is released under the **Creative Commons CC0 waiver**, meaning the pathways may be freely reused and remixed without restriction【727961340315441†L31-L41】【727961340315441†L74-L82】.  Users are encouraged to link back to the licence page when redistributing content.

- **Homepage:** https://www.wikipathways.org/
- **License terms:** https://classic.wikipathways.org/index.php/WikiPathways%3ALicense_Terms

## MiMeDB

MiMeDB (Human Microbial Metabolome Database) is a database linking metabolites to their microbial producers and human phenotypes.  The MiMeDB “Compliance” page notes that its data are released under the **Creative Commons CC BY‑NC 4.0** licence【365295997183177†L804-L855】.  This licence permits reuse, adaptation and distribution of the data for non‑commercial purposes as long as attribution is provided.

- **Homepage:** https://mimedb.org/
- **License:** CC BY‑NC 4.0【365295997183177†L804-L855】

Because Cloudflare security prevented programmatic download of the MiMeDB CSVs, we compiled a small set of microbe–metabolite relationships from peer‑reviewed literature instead (see *mimedb.json*).  These records are included under the CC BY‑NC licence of the source publications.

---

## Usage guardrails for judging
- These sources are used **only for evidence cards / definitions**.  
- The simulator is a **deterministic hypothesis generator** and does not prove causality.
- This app is not medical advice and not a diagnostic device.