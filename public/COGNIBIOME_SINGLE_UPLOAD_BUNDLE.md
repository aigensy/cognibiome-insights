# CogniBiome Lovable Single-Upload Bundle
**Purpose:** This single file contains every foundation document and dataset needed to build the CogniBiome app in Lovable, to avoid Lovable's 10-file upload limit.
## How Lovable must use this file
When you read this bundle:
1. Treat each `@@@FILE_BEGIN ...@@@` section as a **virtual file**.
2. Recreate the project file tree in the generated repository using the exact `path` and the exact file contents.
3. After generating files, the app must use those files as described in the prompt and in `foundation_pack/**`.
4. Integrity check: the content you write to disk should match the listed SHA-256 hashes.

## Virtual file index
| # | Path | Type | Bytes | SHA-256 (prefix) | Description |
|---:|---|---|---:|---|---|
| 1 | `UPLOAD_FILES_MANIFEST.md` | `md` | 3110 | `dd3228462172` | Manifest (paths + hashes) for integrity checks. |
| 2 | `agent/AGENT_MODE_DATA_COLLECTION_PROMPT.md` | `md` | 4539 | `afbfcb7175fd` | Agent-mode data collection prompt used for future expansions. |
| 3 | `external_sources_for_Gut_overview.txt` | `txt` | 12355 | `bd6998d77028` | External sources list (URLs and notes) used for evidence transparency. |
| 4 | `foundation_pack/BRD/brd.json` | `json` | 17505 | `e9eaf3dcde20` | Business Requirements Document (goals, scope, stakeholders, success metrics). |
| 5 | `foundation_pack/BRD/business_knowledge.json` | `json` | 10752 | `4b23574e629e` | Domain knowledge assumptions and context for the app. |
| 6 | `foundation_pack/SRS/agentic_prompt_gates.json` | `json` | 4018 | `e407cd248020` | Prompt gates to prevent scope creep and hallucinations. |
| 7 | `foundation_pack/SRS/data_contracts.json` | `json` | 6815 | `20f1860b4743` | Data contracts / JSON schemas for key entities. |
| 8 | `foundation_pack/SRS/database_schema.json` | `json` | 8409 | `fd8adb6800ce` | Database schema (Supabase/Postgres) including tables/columns. |
| 9 | `foundation_pack/SRS/gui_spec.json` | `json` | 6177 | `914b35ba61bb` | UI specification (screens, global controls, component rules). |
| 10 | `foundation_pack/SRS/nfr_budgets.json` | `json` | 1969 | `61a65a0010a4` | Performance + NFR budgets (latency, bundle size, limits). |
| 11 | `foundation_pack/SRS/test_plan_and_ci.json` | `json` | 6404 | `1e61b8e07551` | Test plan (what to test) and CI expectations. |
| 12 | `foundation_pack/SRS/traceable_requirements.json` | `json` | 17225 | `b9418dbb6e43` | Traceable SRS requirements (MUST/SHOULD) with rationale and cross-links. |
| 13 | `foundation_pack/SRS/trd.json` | `json` | 4092 | `dd3c1f6deb27` | Technical Requirements Document (architecture + component responsibilities). |
| 14 | `foundation_pack/assumptions.json` | `json` | 5840 | `4a0884661ea4` | Explicit assumptions used by the project. |
| 15 | `foundation_pack/docs_index.json` | `json` | 4865 | `02be61fd1507` | Index of all docs/sources the Help/Docs viewer must show. |
| 16 | `foundation_pack/open_questions.json` | `json` | 14556 | `52796fff9331` | Open questions / risks to track. |
| 17 | `foundation_pack/user_questionnaire_answers.json` | `json` | 16777 | `cd5cde498329` | Answers used to ground the project; avoids guessing. |
| 18 | `foundation_pack/user_requirements.json` | `json` | 19581 | `84d109f300dd` | User requirements list (UR-###) including Help/Docs viewer. |
| 19 | `pilot/pilot_dataset_n66.csv` | `csv` | 1456 | `90f26f961daa` | Pilot dataset used for demo modeling and charts. |
| 20 | `prompt_description_en.md` | `md` | 3763 | `98871d4186c8` | Human-readable overview of what the prompt builds. |
| 21 | `prompt_lovable_CogniBiome.txt` | `txt` | 14627 | `72d87aed3755` | Main build prompt to paste into Lovable (kept here for backup). |
| 22 | `reference/README_data_build.md` | `md` | 528 | `869fadaf4b44` | How reference datasets were prepared; reproducibility notes. |
| 23 | `reference/REFERENCES_AND_LICENSES.md` | `md` | 3303 | `02cc0c3c5b09` | Licensing and citation list for all external data. |
| 24 | `reference/mimedb.json` | `json` | 3800 | `df11a30ab5f4` | Curated subset of microbe–metabolite links (MiMeDB-inspired seed). |
| 25 | `reference/reactome.json` | `json` | 3757 | `92d7690571f6` | Reference dataset snapshot used by the model/pipeline. |
| 26 | `reference/usda_fdc.json` | `json` | 9449 | `395f1f80f691` | Reference dataset snapshot used by the model/pipeline. |
| 27 | `reference/wikipathways.json` | `json` | 2364 | `c3bd40d9e197` | Reference dataset snapshot used by the model/pipeline. |

---

## Embedded files

@@@FILE_BEGIN path="UPLOAD_FILES_MANIFEST.md" type="md" sha256="dd32284621729306403470342843a0a82182f9bb19f5328d3dd2a9ca26f8fd70"@@@
~~~text
# Upload Files Manifest (auto-generated)

Generated: 2026-03-01T00:14:33

| Path | Size (bytes) | SHA256 |
|---|---:|---|
| UPLOAD_FILES_MANIFEST.md | 3110 | (self) |
| agent/AGENT_MODE_DATA_COLLECTION_PROMPT.md | 4539 | afbfcb7175fd40ecce802781c9c92aabd9e94d0dfa682ae27356f9e6b93c7626 |
| external_sources_for_Gut_overview.txt | 12355 | bd6998d770283332095c8c13187f26b4efe95fcdbd503ea0f4d2772262355cd6 |
| foundation_pack/BRD/brd.json | 17505 | e9eaf3dcde201473d2aa922b1f942f3d9b4342900f0d9435d1dee12d04aa1d3b |
| foundation_pack/BRD/business_knowledge.json | 10752 | 4b23574e629e2294062815198a51b937cfdf1c72da2c083596e13e8a3d4a5c5c |
| foundation_pack/SRS/agentic_prompt_gates.json | 4018 | e407cd248020ca75b525a8dac0f9e2712e26f1c414a831ee9ca8e98dca06cdc7 |
| foundation_pack/SRS/data_contracts.json | 6815 | 20f1860b474390f8013f51f9df67b5c14220dbd2c88777268aa8f0c50ffe7334 |
| foundation_pack/SRS/database_schema.json | 8409 | fd8adb6800ce0ffc9242e37fb0c5b2d82906c39f4ba5c8e85f3677396a66a084 |
| foundation_pack/SRS/gui_spec.json | 6177 | 914b35ba61bb736e0c398d0af0c3226caebc86be4d5168d873e7aad3ebaf4c3e |
| foundation_pack/SRS/nfr_budgets.json | 1969 | 61a65a0010a4aa9af0911b74e86fda47c082a783f06e3fa73a85ef87bde391b9 |
| foundation_pack/SRS/test_plan_and_ci.json | 6404 | 1e61b8e075516f0d4c32b4b51831fd0d22083a855aff0c06d12e9c799765c814 |
| foundation_pack/SRS/traceable_requirements.json | 17225 | b9418dbb6e43e2cf90b165169dcabb6b0eb83e252c673a2c3e3d5b2b5618f5ee |
| foundation_pack/SRS/trd.json | 4092 | dd3c1f6deb271a30aa0d80c22723f7a84eaad3be7dec71af0aedac83a9655f8a |
| foundation_pack/assumptions.json | 5840 | 4a0884661ea47317a54e7362c9e90091b829e43c6c99ad1f26d3f8f2b6cd4459 |
| foundation_pack/docs_index.json | 4865 | 02be61fd1507e157eb4af47812e8ff790e823128287a4e1fd115094eaded99ac |
| foundation_pack/open_questions.json | 14556 | 52796fff9331647f5176295b429602e00916fbee5b94df49120e6f3b29956292 |
| foundation_pack/user_questionnaire_answers.json | 16777 | cd5cde498329abc4297ebb08c7c1ce91c8f1e77aa62a70b79ab5fbbd00cb206e |
| foundation_pack/user_requirements.json | 19581 | 84d109f300dd8f246c801acca2a55549d7086004f7af62bd9b6a86d07ee5cd92 |
| pilot/pilot_dataset_n66.csv | 1456 | 90f26f961daa3b559297cc41d3256c3b490876fef2970711edcd0714cea836d3 |
| prompt_description_en.md | 3763 | 98871d4186c8d0f14b4e8f90c6f27c02c799e3d8b8284b9f4b65582508f4a4f8 |
| prompt_lovable_CogniBiome.txt | 14627 | 72d87aed3755a46ab47f7b6ed086f10a2e9b9c5ef3aad63258688ae1201367f0 |
| reference/README_data_build.md | 528 | 869fadaf4b442f6c89ad468cea047f209e013df79e7316b39cb218f795dd1ae4 |
| reference/REFERENCES_AND_LICENSES.md | 3303 | 02cc0c3c5b09ade1ca7162e2587bae2285bb125dd38a0f9defd1c72bbe8b29d8 |
| reference/mimedb.json | 3276 | e2d48d2daf8eb4c06223e9196a70ec3243a2256e7c3723fee414508c673f8da4 |
| reference/reactome.json | 3757 | 92d7690571f6c2b81975ac6fdc22c4fcf08a100c6f7137cf76e79fc8e85a94d0 |
| reference/usda_fdc.json | 9449 | 395f1f80f6919b35c06ce9e4cfa76a35374e9e7045c4694b4c3f226d7d660845 |
| reference/wikipathways.json | 2364 | c3bd40d9e197d4a9f5aebba68ea680c58442a0f7ea8fd0ee6bb9b18b9c61c8e3 |
~~~
@@@FILE_END path="UPLOAD_FILES_MANIFEST.md"@@@

@@@FILE_BEGIN path="agent/AGENT_MODE_DATA_COLLECTION_PROMPT.md" type="md" sha256="afbfcb7175fd40ecce802781c9c92aabd9e94d0dfa682ae27356f9e6b93c7626"@@@
~~~text
# ChatGPT Agent Mode Prompt: Build External Reference Snapshots for CogniBiome

## ROLE
You are a Data Collection + Data Engineering agent for a science-fair app. Your job is to:
1) Collect a SMALL, judge-ready subset of external public datasets.
2) Convert them into offline “reference snapshots”.
3) Insert these snapshots into the provided zip: `prompt_lovable_CogniBiome.zip` under `/reference/`.

## STRICT RULES (ANTI-HALLUCINATION)
- Do not invent or guess data.
- Every extracted record MUST be traceable to a source file you downloaded.
- Prefer official sources only.
- Record the download date, release/version, and license for each source.
- Output must be small: target <= 300 rows per table (unless stated otherwise).

## INPUTS YOU WILL RECEIVE
- `prompt_lovable_CogniBiome.zip` (contains current placeholders under /reference/)
- Optional: an FDC API key (data.gov) provided by the user

## TARGET OUTPUT FILES (WRITE INTO THE ZIP)
Write/replace these files inside the zip:
- `reference/usda_fdc.json`
- `reference/reactome.json`
- `reference/wikipathways.json`
- `reference/mimedb.json`
- `reference/REFERENCES_AND_LICENSES.md`

If you produce extra intermediate CSVs, store them as:
- `reference/_build_artifacts/<name>.csv`

## WHAT TO COLLECT (MINIMUM “JUDGE-READY” SUBSET)

### A) USDA FoodData Central (FDC)
Goal: Map a small food list to nutrient proxies (fiber, sugars, saturated fat).
Steps:
1) Obtain data:
   - Either download the official dataset archive from FoodData Central (preferred), OR
   - Use the FDC API (requires data.gov API key) to fetch foods + nutrients.
2) Curate 25–60 foods relevant to:
   - High-fiber pattern (oats, beans, lentils, broccoli, berries)
   - Fermented foods (yogurt, kefir, kimchi)
   - High-sugar pattern (soda, candy)
   - High saturated fat pattern (burger, fries, pizza, cheese)
3) Build `reference/usda_fdc.json` with:
   - metadata: source, download_date, release info
   - `foods[]`: food_name, fdc_id (if available), serving_g (default 100), nutrients_per_100g {fiber_g, total_sugars_g, sat_fat_g}
   - `nutrient_mapping`: definitions of which nutrient names/ids were used for each proxy

### B) Reactome
Goal: A few pathway “evidence cards” for the gut-brain narrative.
Steps:
1) Use Reactome Content Service (or official downloads) to collect 6–12 pathways:
   - focus on tryptophan/serotonin, neurotransmitter metabolism, immune signaling, etc.
2) Build `reference/reactome.json` with:
   - metadata: release/version if available
   - `pathways[]`: reactome_id, name, species, top_level_parent (if available), short_summary (1–2 sentences copied/paraphrased from Reactome page, with source pointer)

### C) WikiPathways
Goal: Mechanism diagrams and IDs for 3–6 pathways.
Steps:
1) Use WikiPathways official download options OR the WikiPathways GitHub assets repo.
2) Collect pathway IDs (WP###) + titles, plus a PNG if available.
3) Build `reference/wikipathways.json` with:
   - `pathways[]`: wpid, title, species (if available), local_png_path (if you saved it), notes

### D) MiMeDB (Microbial Metabolome Database)
Goal: Microbe ↔ metabolite evidence links for a small set of metabolites.
Steps:
1) Download MiMeDB CSVs from its Downloads section:
   - “All MiMe Compounds (CSV)”
   - “All Microbes (CSV)”
2) From the compound file, extract a subset for these metabolites (or close matches):
   - butyrate, acetate, propionate, tryptophan, indole-3-propionic acid, GABA, serotonin (if present)
3) For each metabolite, extract its “Microbial Sources” (or equivalent) and create links.
4) Build `reference/mimedb.json` with:
   - metadata: MiMeDB version/date from the download page
   - `links[]`: metabolite_name, mimedb_metabolite_id, microbe_name, mimedb_microbe_id (if derivable), evidence_type (if present), citation (if present)

## LICENSE NOTES YOU MUST RECORD
Create/update `reference/REFERENCES_AND_LICENSES.md` with:
- FDC: published under CC0 / public domain (cite official text)
- Reactome data: CC0 (cite official license)
- WikiPathways content: CC0 waiver (cite official license)
- MiMeDB: CC BY-NC (cite MiMeDB paper or official statement)

## PACKAGING REQUIREMENTS
1) Replace files in the zip.
2) Do NOT change the foundation_pack JSONs.
3) Ensure the zip still contains:
   - `prompt_lovable_CogniBiome.txt`
   - `external_sources_for_Gut_overview.txt`
   - `pilot/pilot_dataset_n66.csv`

## DELIVERABLE
Return a new zip file with the same name: `prompt_lovable_CogniBiome.zip` containing populated snapshots.
~~~
@@@FILE_END path="agent/AGENT_MODE_DATA_COLLECTION_PROMPT.md"@@@

@@@FILE_BEGIN path="external_sources_for_Gut_overview.txt" type="txt" sha256="bd6998d770283332095c8c13187f26b4efe95fcdbd503ea0f4d2772262355cd6"@@@
~~~text
Ниже — **финальное (не “optional”) решение** по внешним источникам данных для Gut-приложения, как именно они используются, и **что вам нужно подготовить и загрузить в Lovable**.

---

## Принятое решение: какие внешние источники используются в приложении

Ключевой принцип для судей: **приложение работает офлайн и не зависит от сети**. Поэтому внешние источники используются **только как заранее подготовленные “reference snapshots”**, загруженные в Lovable вместе с проектом. Пилотные данные подростков **никуда наружу не отправляются**.

### Матрица решений

| Источник                             | Используем в приложении? | Как используется (внутри приложения)                                                                                                                                                                                   | Что подготовить и загрузить в Lovable                                                                                                                                                                                  |
| ------------------------------------ | -----------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **USDA FoodData Central (FDC)**      |                   **ДА** | “Food/Nutrient Evidence” слой: объясняет, *почему* изменение питания означает изменение **клетчатки / сахара / насыщенных жиров** (на уровне нутриентов). FDC данные в public domain (CC0).                            | `reference/fdc_foods_min.json` (малый список продуктов + нутриенты) и `reference/fdc_nutrients_map.json` (какие нутриенты поддерживают ваши “Diet components”). Лицензия/цитирование: FDC CC0. ([FoodData Central][1]) |
| **Reactome**                         |                   **ДА** | “Pathway cards”: краткие карточки биологических путей (например, триптофан/серотонин и т.п.) с ссылками/цитированием. Данные Reactome разрешены (CC0 для data; CC BY 4.0 для иллюстраций/брендинга).                   | `reference/reactome_pathways_min.json` (выбранные pathways + описания + identifiers) и `reference/reactome_license_cite.md`. ([Reactome][2])                                                                           |
| **WikiPathways (JSON)**              |                   **ДА** | “Mechanism diagrams” слой: **локальные** JSON/PNG для пары ключевых pathway-диаграмм, чтобы UI выглядел как настоящий исследовательский инструмент. Контент WikiPathways под CC0 waiver.                               | Папка `reference/wikipathways/` с 3–6 файлов: `*.json` и (желательно) `*.png` для выбранных pathways + `reference/wikipathways_license.md`. ([WikiPathways][3])                                                        |
| **MiMeDB (Microbial Metabolome DB)** |                   **ДА** | “Microbe ↔ metabolite evidence” слой: показывает справочные связи микробов и метаболитов (для правдоподобия X→M в вашей модели). Важно: лицензирование BY-NC (некоммерческое).                                         | `reference/mimedb_links_min.csv` или `.json` (только нужные поля/строки) + `reference/mimedb_citation_license.md` (BY-NC). ([OUP Academic][4])                                                                         |
| **PubChem**                          |                  **НЕТ** | Не используем в v1: добавляет сетевую зависимость/лимиты и не критично для судейского результата (уже хватает Reactome/WikiPathways/MiMeDB). PubChem отдельно отмечает, что “API keys” не выдаются и есть ограничения. | Ничего не готовить/не загружать. ([PubChem][5])                                                                                                                                                                        |
| **HMDB**                             |                  **НЕТ** | Не используем: больше рисков по лицензированию/объёму, и для вашего “judge-ready” сценария избыточно (MiMeDB + Reactome покрывают нужное).                                                                             | Ничего не готовить/не загружать. ([Human Metabolome Database][6])                                                                                                                                                      |

---

## Как именно эти внешние данные будут “встроены” в приложение (без сети)

### 1) FDC (USDA) — нутриенты как объяснение Diet Score

* **UI:** панель “Nutrition Evidence” (в Methods & Rigor / Simulator).
* **Функция:** когда пользователь в симуляторе меняет “diet quality”, приложение показывает *какие нутриенты обычно двигаются* и почему это логично.
* **Технически:** приложение читает **локальный JSON**, никакого живого API.
* **Почему так:** FDC API требует **data.gov API key** и ключ нельзя публиковать (его могут отключить), плюс есть rate limits. ([FoodData Central][1])
  Поэтому для демонстрации судье безопаснее “snapshot”.

### 2) Reactome — карточки путей (Pathway Cards)

* **UI:** “Pathway Cards” блок с 5–10 карточками, каждая: название → краткое описание → “why it matters” (без медицинских утверждений) → ссылка/цитирование.
* **Технически:** локальный `reactome_pathways_min.json`.
* **Лицензии:** Reactome явно описывает лицензии (CC0 для data, CC BY 4.0 для иллюстраций). ([Reactome][2])

### 3) WikiPathways — локальные pathway-диаграммы

* **UI:** маленькая галерея (2–4) диаграмм/схем в “Methods & Rigor”.
* **Технически:** локальные `*.json` (и/или `*.png`), никаких запросов.
* **Лицензии:** CC0 waiver. ([WikiPathways][3])

### 4) MiMeDB — справочник “микроб ↔ метаболит”

* **UI:** “Evidence table” (поиск/фильтр) + “link-outs”.
* **Технически:** локальный CSV/JSON, предварительно урезанный до небольшого набора строк и полей (чтобы быстро грузилось).
* **Данные доступны для скачивания (есть большие файлы, поэтому важно брать только минимум).** ([MiMeDB][7])
* **Лицензирование:** BY-NC (некоммерческое). ([OUP Academic][4])

---

## Что вам нужно создать и загрузить в Lovable

Да: вам нужно подготовить **один “External Reference Pack”** (папка или zip), который Lovable использует как контекст и как статические файлы проекта.

Lovable поддерживает загрузку файлов (включая CSV/PDF и др.) и умеет превращать CSV/XLSX в дашборды, но для “reference snapshots” мы делаем **JSON/CSV** + 1 файл с лицензиями/цитированием. ([FoodData Central][8])

### Структура “External Reference Pack” (рекомендую именно так)

```
reference/
  fdc_foods_min.json
  fdc_nutrients_map.json
  reactome_pathways_min.json
  wikipathways/
    WP_xxx.json
    WP_xxx.png
  mimedb_links_min.csv   (или .json)
  REFERENCES_AND_LICENSES.md
```

### Что конкретно требуется для FDC (USDA FoodData Central)

**Вам НЕ нужно делать API key для приложения**, потому что мы **не используем живой API**.

Но **вам нужно создать локальный snapshot**:

1. `fdc_foods_min.json`
   Минимальный набор: 30–80 типичных продуктов (овощи, цельнозерно, сладкие напитки/десерты, фастфуд), где для каждого есть:

   * `name`
   * `fdcId` (если есть)
   * нутриенты: `fiber_g`, `added_sugars_g` (если доступно), `saturated_fat_g`, `protein_g`, `total_fat_g`, `carbs_g`, `energy_kcal`

2. `fdc_nutrients_map.json`
   Карта: какие нутриенты вы используете как объяснение “diet quality”, и как это отображается на ваши “diet components”.

3. В `REFERENCES_AND_LICENSES.md` вставить:

   * короткую строку, что данные FDC public domain / CC0 ([FoodData Central][1])
   * рекомендуемую цитату USDA (она прямо в API Guide) ([FoodData Central][1])

*(Если хотите — я могу дать вам шаблоны JSON (структуру полей) под ваш UI, чтобы вы просто заполнили значения.)*

---

## Короткое резюме по-русски

* **Используем внешние источники ДА:** FDC (USDA), Reactome, WikiPathways, MiMeDB.
* **НЕ используем:** PubChem и HMDB (в v1 не нужно для выигрыша и добавляет риски).
* Вам надо собрать и загрузить в Lovable **External Reference Pack** (локальные JSON/CSV snapshots) + файл `REFERENCES_AND_LICENSES.md`. Для FDC **API key не нужен**, потому что используем **локальный snapshot**, а не живой API. ([FoodData Central][1])

[1]: https://fdc.nal.usda.gov/api-guide "API Guide | USDA FoodData Central"
[2]: https://reactome.org/license "License Agreement - Reactome Pathway Database"
[3]: https://classic.wikipathways.org/index.php/WikiPathways%3ALicense_Terms "WikiPathways:License Terms - WikiPathways"
[4]: https://academic.oup.com/nar/article/51/D1/D611/6754917?utm_source=chatgpt.com "MiMeDB: the Human Microbial Metabolome Database"
[5]: https://pubchem.ncbi.nlm.nih.gov/docs/programmatic-access?utm_source=chatgpt.com "Programmatic Access - PubChem - NIH"
[6]: https://hmdb.ca/downloads?utm_source=chatgpt.com "Human Metabolome Database: Downloads"
[7]: https://mimedb.org/downloads "MiMeDB: Downloads"
[8]: https://fdc.nal.usda.gov/api-guide?utm_source=chatgpt.com "FoodData Central API Guide - USDA"
~~~
@@@FILE_END path="external_sources_for_Gut_overview.txt"@@@

@@@FILE_BEGIN path="foundation_pack/BRD/brd.json" type="json" sha256="e9eaf3dcde201473d2aa922b1f942f3d9b4342900f0d9435d1dee12d04aa1d3b"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "BRD/brd.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "INCEPTION",
    "adlc_state": "Final",
    "adlc_work_cnt": 3,
    "last_updated_utc": "2026-03-01T00:12:29Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft BRD. Not READY until HPO approves user_requirements.json and blocking open questions are resolved. | Phase 2: updated module scope per confirmed decisions; removed blocking open questions."
  },
  "template_id": "DF.OUTPUT.BRD.BRD.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "INCEPTION",
  "objective": {
    "primary": "Support Yana’s science fair judging by providing a reproducible, judge-friendly simulator + validation dashboard for the diet→microbiome→metabolites→cognition pipeline.",
    "evidence": [
      {
        "source_id": "prompt_to_create_gut_brd_srs.txt",
        "loc": "L1-L2",
        "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
      },
      {
        "source_id": "Project Plan.pdf",
        "loc": "L5-L11",
        "snippet": "Modeling Diet-Driven Microbiome and Neurotransmitter Pathways"
      },
      {
        "source_id": "Project Plan.pdf",
        "loc": "L62-L68",
        "snippet": "This approach allows for simulation of how changes in diet propagate through biological systems  and influence cognitive outcomes. "
      }
    ]
  },
  "non_goals": [
    "Medical diagnosis, treatment, or personalized clinical recommendations.",
    "Collection of new human subject data.",
    "Proving causality; the app is a simulator/hypothesis generator."
  ],
  "personas": [
    {
      "id": "PERS-01",
      "name": "Yana (student presenter)",
      "goals": [
        "Explain project quickly",
        "Demonstrate rigor",
        "Export report"
      ],
      "constraints": [
        "Time-limited live judging"
      ],
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        }
      ]
    },
    {
      "id": "PERS-02",
      "name": "Science fair judge",
      "goals": [
        "Assess methodology and validity",
        "See real results",
        "Identify limitations"
      ],
      "constraints": [
        "Skepticism about correlation vs mechanism"
      ],
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L186-L190",
          "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
        }
      ]
    }
  ],
  "problems": [
    {
      "id": "PRB-01",
      "statement": "Static documents are insufficient to communicate multi-stage biological mechanism and ML rigor quickly.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L62-L68",
          "snippet": "This approach allows for simulation of how changes in diet propagate through biological systems  and influence cognitive outcomes. "
        }
      ]
    },
    {
      "id": "PRB-02",
      "statement": "Pilot dataset supports correlation but lacks microbiome/metabolite measurements; miscommunication risk is high.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L135-L141",
          "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
        },
        {
          "source_id": "Data Sheet 1.csv",
          "loc": "rows=66, cols=14",
          "snippet": "File contains 66 rows of pilot data with diet score and cognitive tests (Stroop, Language, Memory, Logical, Overall)."
        }
      ]
    }
  ],
  "solution_high_level": {
    "modules": [
      {
        "name": "Pilot Results",
        "description": "Load bundled pilot dataset (n=66) for offline demo and also allow upload-at-runtime; render charts/tables and basic stats.",
        "evidence": [
          {
            "source_id": "Data Sheet 1.csv",
            "loc": "rows=66, cols=14",
            "snippet": "File contains 66 rows of pilot data with diet score and cognitive tests (Stroop, Language, Memory, Logical, Overall)."
          },
          {
            "source_id": "MultimodalText Deep Research.md",
            "loc": "L186-L190",
            "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
          }
        ]
      },
      {
        "name": "Simulator",
        "description": "Deterministic 3-stage simulator using frozen model artifacts (JSON): diet inputs → modeled microbiome (Bifidobacterium, Lactobacillus, F:B ratio) → modeled metabolites (acetate/propionate/butyrate + 5-HTP precursor index) → modeled cognition outputs (Stroop, memory, language, logical, overall).",
        "evidence": [
          {
            "source_id": "Project Plan.pdf",
            "loc": "L58-L64",
            "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
          },
          {
            "source_id": "Project Plan.pdf",
            "loc": "L62-L68",
            "snippet": "This approach allows for simulation of how changes in diet propagate through biological systems  and influence cognitive outcomes. "
          }
        ]
      },
      {
        "name": "Methods & Rigor",
        "description": "Leakage guardrails, limitations, disclaimers, and data-source transparency.",
        "evidence": [
          {
            "source_id": "Project Plan.pdf",
            "loc": "L137-L143",
            "snippet": "not for model training  Procedure  1. Download dietary intake data from NHANES and extract nutrient intake variables"
          },
          {
            "source_id": "MultimodalText Deep Research.md",
            "loc": "L62-L66",
            "snippet": "**App fix:** add an “Educational research prototype” label + a small disclaimer: *not medical advice; not a diagnostic device.* This is consistent with how consumer microbiome companies themselves pre"
          }
        ]
      },
      {
        "name": "Export",
        "description": "Generate a 1-page report summarizing a run.",
        "evidence": [
          {
            "source_id": "MultimodalText Deep Research.md",
            "loc": "L136-L140",
            "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
          }
        ]
      }
    ]
  },
  "workflows_high_level": [
    {
      "name": "Judge walkthrough",
      "summary": "Pilot Results → Methods & Rigor → Simulator run → Export",
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L186-L190",
          "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L136-L140",
          "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
        }
      ]
    },
    {
      "name": "Scenario exploration",
      "summary": "Adjust diet variables → compare outputs → export comparison",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L62-L68",
          "snippet": "This approach allows for simulation of how changes in diet propagate through biological systems  and influence cognitive outcomes. "
        }
      ]
    }
  ],
  "success_metrics": {
    "metrics": [
      {
        "metric": "Demo reliability",
        "target": null,
        "unit": null,
        "notes": "cannot confirm; define measurable success metrics for the showcase (see OQ-010)."
      },
      {
        "metric": "Time-to-insight for judge walkthrough",
        "target": 120,
        "unit": "seconds",
        "notes": "assumption; adjust if you have a different target."
      },
      {
        "metric": "Export success rate during demo",
        "target": 0.99,
        "unit": "fraction",
        "notes": "assumption; adjust if you prefer a different metric."
      }
    ],
    "evidence": [
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L136-L140",
        "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
      },
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L186-L190",
        "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
      }
    ]
  },
  "constraints": [
    {
      "constraint": "Pilot dataset must be validation-only and not used for training.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L135-L141",
          "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L137-L143",
          "snippet": "not for model training  Procedure  1. Download dietary intake data from NHANES and extract nutrient intake variables"
        }
      ]
    },
    {
      "constraint": "All data used are public and/or de-identified; no new human participants recruited.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L185-L191",
          "snippet": "chemicals, or biological agents. No new human participants are recruited. All training datasets  are publicly available and fully de-identified. The only human-related data used consist of  de-identif"
        }
      ]
    },
    {
      "constraint": "Avoid diagnostic/medical framing.",
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L62-L66",
          "snippet": "**App fix:** add an “Educational research prototype” label + a small disclaimer: *not medical advice; not a diagnostic device.* This is consistent with how consumer microbiome companies themselves pre"
        }
      ]
    }
  ],
  "risks": [
    {
      "risk": "Overclaiming causality or diagnostic value during judging",
      "mitigation": "Use simulator/hypothesis-generator language and add disclaimer.",
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L62-L66",
          "snippet": "**App fix:** add an “Educational research prototype” label + a small disclaimer: *not medical advice; not a diagnostic device.* This is consistent with how consumer microbiome companies themselves pre"
        }
      ]
    },
    {
      "risk": "Cross-dataset integration misunderstood as paired training",
      "mitigation": "Explicitly label paired vs unpaired datasets and state what is used for training vs reference.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L125-L131",
          "snippet": "○ NHANES dietary intake datasets for nutrient intake variables  ○ USDA Food and Nutrient Database for nutrient definition standardization and  nutrient mapping"
        }
      ]
    },
    {
      "risk": "No available model artifacts for numeric simulation outputs",
      "mitigation": "Confirm artifacts; otherwise use explicit qualitative outputs and mark limits.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L58-L64",
          "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
        }
      ]
    }
  ],
  "open_questions": [
    "OQ-004",
    "OQ-007",
    "OQ-008",
    "OQ-009",
    "OQ-010"
  ],
  "brd_requirements": [
    {
      "id": "BRD-REQ-001",
      "statement": "Provide a judge-ready dashboard that visualizes the real de-identified teen pilot dataset (n=66) with charts and summary tables.",
      "priority": "P0",
      "rationale": "Real validation evidence is required for judging confidence.",
      "acceptance_signal": "Pilot tab shows n=66 and renders charts/tables without errors.",
      "trace_target": "SRS-REQ-001..SRS-REQ-006"
    },
    {
      "id": "BRD-REQ-002",
      "statement": "Provide a deterministic simulator that composes diet→microbiome→metabolites→cognition layers and records run provenance.",
      "priority": "P0",
      "rationale": "Core project value is mechanistic simulation.",
      "acceptance_signal": "Same inputs+model_version produce identical outputs; run_id/model_version shown.",
      "trace_target": "SRS-REQ-007..SRS-REQ-013"
    },
    {
      "id": "BRD-REQ-003",
      "statement": "Include a Methods & Rigor section with explicit non-causality language, leakage guardrails, and non-diagnostic disclaimer.",
      "priority": "P0",
      "rationale": "Prevents overclaiming and addresses judge questions.",
      "acceptance_signal": "Rigor page includes: validation-only pilot, leakage definition, disclaimer.",
      "trace_target": "SRS-REQ-014..SRS-REQ-016"
    },
    {
      "id": "BRD-REQ-004",
      "statement": "Enable one-click export of a 1-page report that includes inputs, outputs, pilot visuals, and disclaimers.",
      "priority": "P0",
      "rationale": "Judges value take-home artifacts; reinforces reproducibility.",
      "acceptance_signal": "Export generated successfully in PDF/HTML with required sections.",
      "trace_target": "SRS-REQ-017..SRS-REQ-020"
    },
    {
      "id": "BRD-REQ-005",
      "statement": "Support a presenter workflow that can be completed in ~2 minutes and reset to a known demo state.",
      "priority": "P1",
      "rationale": "Demo clarity under time pressure.",
      "acceptance_signal": "Presenter Mode exists and reset button restores default state.",
      "trace_target": "SRS-REQ-021..SRS-REQ-022"
    },
    {
      "id": "BRD-REQ-006",
      "statement": "Do not collect or store PII; keep pilot data de-identified numeric values only.",
      "priority": "P0",
      "rationale": "Teen data privacy and compliance.",
      "acceptance_signal": "No personal fields; stored data are numeric only.",
      "trace_target": "SRS-REQ-023"
    },
    {
      "id": "BRD-REQ-007",
      "statement": "Label microbiome/metabolite outputs as modeled proxies and not measured teen biomarkers.",
      "priority": "P0",
      "rationale": "Avoids misrepresentation of pilot data.",
      "acceptance_signal": "Every relevant UI element uses 'simulated/proxy' labels.",
      "trace_target": "SRS-REQ-024"
    },
    {
      "id": "BRD-REQ-008",
      "statement": "Provide a clear explanation of data sources per stage (public datasets for training/reference; pilot dataset for validation only).",
      "priority": "P1",
      "rationale": "Avoids judge confusion about paired/unpaired training.",
      "acceptance_signal": "Data Sources panel lists datasets per stage and labels training vs reference vs validation.",
      "trace_target": "SRS-REQ-025..SRS-REQ-026"
    },
    {
      "id": "BRD-REQ-009",
      "statement": "Meet basic performance for live demos (fast load, fast simulation).",
      "priority": "P2",
      "rationale": "Reduces demo risk.",
      "acceptance_signal": "Load and simulation meet budgets in NFR.",
      "trace_target": "SRS-REQ-027"
    },
    {
      "id": "BRD-REQ-010",
      "statement": "Optionally provide evidence references (citations) supporting key modules (SCFAs, tryptophan metabolites).",
      "priority": "P2",
      "rationale": "Improves credibility.",
      "acceptance_signal": "Evidence panel shows curated citations or tooltips.",
      "trace_target": "SRS-REQ-028"
    },
    {
      "id": "BRD-REQ-011",
      "statement": "Provide an in-app Help/Docs viewer that exposes the submitted foundation pack and reference snapshots for transparency during judging.",
      "priority": "P2",
      "rationale": "Judges can verify scope, rigor, and limitations quickly inside the demo app.",
      "acceptance_signal": "Help/Docs screen lists and renders all packaged docs offline.",
      "trace_target": "SRS-REQ-029..SRS-REQ-030"
    }
  ]
}
~~~
@@@FILE_END path="foundation_pack/BRD/brd.json"@@@

@@@FILE_BEGIN path="foundation_pack/BRD/business_knowledge.json" type="json" sha256="4b23574e629e2294062815198a51b937cfdf1c72da2c083596e13e8a3d4a5c5c"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "BRD/business_knowledge.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "INCEPTION",
    "adlc_state": "Final",
    "adlc_work_cnt": 2,
    "last_updated_utc": "2026-02-28T21:25:04Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft business/domain knowledge, grounded only in provided project documents. | Phase 2: aligned domain vocabulary with confirmed simulator I/O."
  },
  "template_id": "DF.OUTPUT.BRD.BUSINESS_KNOWLEDGE.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "INCEPTION",
  "business_idea": {
    "summary": "Judge-ready Gut–Brain Simulator web app that demonstrates a computational pipeline from diet to predicted microbiome changes to metabolite proxies to cognitive performance signals, and validates with a de-identified teen pilot dataset (n=66).",
    "context": "Regeneron ISEF / Hudson County STEM Showcase computational biology project demo app.",
    "evidence": [
      {
        "source_id": "prompt_to_create_gut_brd_srs.txt",
        "loc": "L1-L2",
        "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
      },
      {
        "source_id": "Project Plan.pdf",
        "loc": "L5-L11",
        "snippet": "Modeling Diet-Driven Microbiome and Neurotransmitter Pathways"
      }
    ]
  },
  "domain_summary": {
    "summary": "Gut–brain axis research suggests diet can influence cognition through intermediate biological layers: microbiome composition and microbial metabolites (e.g., SCFAs). This project builds a computational simulator to model these layers and validate against a separate de-identified teen pilot dataset.",
    "cannot_confirm": false,
    "evidence": [
      {
        "source_id": "Project Plan.pdf",
        "loc": "L58-L64",
        "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
      },
      {
        "source_id": "Project Plan.pdf",
        "loc": "L62-L68",
        "snippet": "This approach allows for simulation of how changes in diet propagate through biological systems  and influence cognitive outcomes. "
      },
      {
        "source_id": "Project Plan.pdf",
        "loc": "L135-L141",
        "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
      }
    ]
  },
  "vocabulary": [
    {
      "term": "Gut–brain axis",
      "definition": "Bidirectional signaling network linking GI tract and CNS via neural, immune, endocrine, and metabolic pathways.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L58-L64",
          "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
        }
      ]
    },
    {
      "term": "Microbiome (gut)",
      "definition": "Community of microorganisms in the human gut; represented here as modeled genus-level relative abundances (Bifidobacterium, Lactobacillus) plus Firmicutes:Bacteroidetes ratio.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L125-L131",
          "snippet": "○ NHANES dietary intake datasets for nutrient intake variables  ○ USDA Food and Nutrient Database for nutrient definition standardization and  nutrient mapping"
        }
      ]
    },
    {
      "term": "SCFAs",
      "definition": "Short-chain fatty acids (acetate, propionate, butyrate) used as modeled metabolite proxy outputs (standardized scores).",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L125-L131",
          "snippet": "○ NHANES dietary intake datasets for nutrient intake variables  ○ USDA Food and Nutrient Database for nutrient definition standardization and  nutrient mapping"
        }
      ]
    },
    {
      "term": "Pilot dataset (n=66)",
      "definition": "De-identified teen dataset with diet quality score and cognitive test metrics used for validation only.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L135-L141",
          "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
        },
        {
          "source_id": "Data Sheet 1.csv",
          "loc": "rows=66, cols=14",
          "snippet": "File contains 66 rows of pilot data with diet score and cognitive tests (Stroop, Language, Memory, Logical, Overall)."
        }
      ]
    },
    {
      "term": "Data leakage",
      "definition": "Any training/tuning step that uses validation-only data (pilot dataset) or uses preprocessing fitted on full data before splitting.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L137-L143",
          "snippet": "not for model training  Procedure  1. Download dietary intake data from NHANES and extract nutrient intake variables"
        }
      ]
    }
  ],
  "user_segments": [
    {
      "segment": "Student presenter",
      "needs": [
        "Fast, reliable demo",
        "Clear talking points on rigor and limitations",
        "Export artifact"
      ],
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        }
      ]
    },
    {
      "segment": "Judges",
      "needs": [
        "Transparent explanation of methodology",
        "Real validation results",
        "No overclaiming"
      ],
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L186-L190",
          "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L62-L66",
          "snippet": "**App fix:** add an “Educational research prototype” label + a small disclaimer: *not medical advice; not a diagnostic device.* This is consistent with how consumer microbiome companies themselves pre"
        }
      ]
    }
  ],
  "competitors": {
    "direct": null,
    "indirect": null,
    "notes": "cannot confirm; not doing full competitor research in this phase."
  },
  "risks": [
    {
      "risk": "Overclaiming causality or diagnostic value during judging",
      "mitigation": "Use simulator/hypothesis-generator language and add disclaimer.",
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L62-L66",
          "snippet": "**App fix:** add an “Educational research prototype” label + a small disclaimer: *not medical advice; not a diagnostic device.* This is consistent with how consumer microbiome companies themselves pre"
        }
      ]
    },
    {
      "risk": "Cross-dataset integration misunderstood as paired training",
      "mitigation": "Explicitly label paired vs unpaired datasets and state what is used for training vs reference.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L125-L131",
          "snippet": "○ NHANES dietary intake datasets for nutrient intake variables  ○ USDA Food and Nutrient Database for nutrient definition standardization and  nutrient mapping"
        }
      ]
    },
    {
      "risk": "No available model artifacts for numeric simulation outputs",
      "mitigation": "Confirm artifacts; otherwise use explicit qualitative outputs and mark limits.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L58-L64",
          "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
        }
      ]
    }
  ],
  "assumptions": [
    "ASM-001",
    "ASM-002",
    "ASM-003",
    "ASM-004",
    "ASM-005",
    "ASM-006"
  ],
  "unknowns": [
    "OQ-001",
    "OQ-002",
    "OQ-003",
    "OQ-004",
    "OQ-005",
    "OQ-006",
    "OQ-007",
    "OQ-008",
    "OQ-009",
    "OQ-010"
  ],
  "sources": [
    {
      "source_id": "prompt_to_create_gut_brd_srs.txt",
      "sha256": "6c089d663b1339cb032e90477bfe5ddc265ee877f4d5e67d877478586d597083",
      "notes": ""
    },
    {
      "source_id": "Yana_Gut_Package_for_Stem_Showcase.zip",
      "sha256": "cb02a0400e86cbb139714e5fd5f3be89895dbdfbe389b59f5a8629c725f28ab8",
      "notes": ""
    },
    {
      "source_id": "foundation_docs.zip",
      "sha256": "e8ff0300233f74315cdec43272468ea8f2c82430bf352348e1227d3c3d28e34b",
      "notes": ""
    },
    {
      "source_id": "Project Plan.pdf",
      "sha256": "09c0ff5f2c0a13465c409c22543426108e073b63ed646dd733b82d943582299e",
      "notes": ""
    },
    {
      "source_id": "Project Abstract.pdf",
      "sha256": "bb53f4b86ba7f1f17e78c2b349a626e1e5cd9b036dfd464881f407a536dd24e8",
      "notes": ""
    },
    {
      "source_id": "Student Checklist 1A - Checklist Research Plan.pdf",
      "sha256": "8162f9de2f6049acee7e1ba185954b09c2639b53ec65243432b269428c8b28e7",
      "notes": ""
    },
    {
      "source_id": "ISEF Form 7 - Continuation Projects.pdf",
      "sha256": "b9b16b19cd391dd2addb4feb516d6e9bb1b973819800ae54188bada45c9a8c5a",
      "notes": ""
    },
    {
      "source_id": "Data Sheet 1.csv",
      "sha256": "1da31235481832fb30a63566bc56b2afe7aaa5dbe1cc75f60d6e620459a63c67",
      "notes": ""
    },
    {
      "source_id": "Yana Gut project - MultimodalText Deep Research A Judge-Ready Diet-Microbiome-Metabolites-Cognition Simulator App.md",
      "sha256": "39d1d4356a95cb8ddcf6045d358fe5e9dcc433aa983f53666991223119aaeb22",
      "notes": ""
    }
  ]
}
~~~
@@@FILE_END path="foundation_pack/BRD/business_knowledge.json"@@@

@@@FILE_BEGIN path="foundation_pack/SRS/agentic_prompt_gates.json" type="json" sha256="e407cd248020ca75b525a8dac0f9e2712e26f1c414a831ee9ca8e98dca06cdc7"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "SRS/agentic_prompt_gates.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "DESIGN",
    "adlc_state": "Final",
    "adlc_work_cnt": 2,
    "last_updated_utc": "2026-02-28T21:25:04Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft agentic prompt gates for building this app with AI tools (Lovable/Cursor). | Phase 2: aligned gates with demo-artifact + replaceable-artifact plan. | Phase 2: updated input gates to remove resolved OQs and reflect demo-artifact plan."
  },
  "template_id": "DF.OUTPUT.SRS.AGENTIC_PROMPT_GATES.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "DESIGN",
  "purpose": "Define deterministic gates and guardrails for AI-assisted implementation to prevent scope drift, hallucinations, and rewrite storms.",
  "global_rules": [
    "No invention: if a required fact is missing, set it to null and record an open question.",
    "Stop-and-ask: if a required input is missing for build (e.g., pilot CSV, demo model artifacts under /public/models), stop and request it. If final artifacts are not ready, use bundled demo artifacts and expose 'Load model artifact' controls (OQ-002).",
    "Data-first: implement schema/contracts before complex UI behaviors.",
    "Traceability-first: every implemented feature must map to SRS-REQ and at least one test.",
    "Non-diagnostic language: never output medical advice or diagnostic claims in UI copy."
  ],
  "input_gates": [
    {
      "gate_id": "GATE-INPUT-001",
      "name": "Sources completeness check",
      "blocking": true,
      "checklist": [
        "Pilot dataset CSV is available either bundled (demo build) or via upload flow.",
        "Model artifacts available: bundled demo JSON artifacts under /public/models OR finalized artifacts loaded via admin controls.",
        "Target hosting/platform confirmed (Lovable web app; optional PWA)."
      ],
      "open_questions": []
    },
    {
      "gate_id": "GATE-INPUT-002",
      "name": "HPO approval gate",
      "blocking": true,
      "checklist": [
        "HPO approves user_requirements.json and records approval.",
        "Blocking open questions resolved or explicitly deferred."
      ],
      "notes": "HPO MUST approve user_requirements.json before BRD/SRS are treated as READY_FOR_BUILD."
    }
  ],
  "state_transition_gates": [
    {
      "from_state": "DRAFT",
      "to_state": "REVIEW",
      "requirements": [
        "All pack files exist and are valid JSON.",
        "open_questions.json and assumptions.json updated."
      ]
    },
    {
      "from_state": "REVIEW",
      "to_state": "APPROVED",
      "requirements": [
        "HPO signoff recorded for user_requirements.json.",
        "No blocking open questions remain."
      ]
    },
    {
      "from_state": "APPROVED",
      "to_state": "READY_FOR_BUILD",
      "requirements": [
        "Traceability complete BRD→SRS→Tests.",
        "NFR budgets defined and accepted."
      ]
    }
  ],
  "rewrite_storm_prevention": {
    "rules": [
      "Minimize diffs: do not rewrite unrelated files.",
      "Use small, atomic changes (<=100 lines) where possible.",
      "After each change, run tests and validate JSON pack.",
      "If two consecutive attempts fail for the same reason, stop and escalate via open_questions."
    ]
  },
  "evidence_rules": {
    "mode_standardize_existing_app": {
      "policy": "For each non-trivial decision, include an evidence pointer with source_id + loc.",
      "allowed_sources": "Only provided artifacts unless explicit domain research is approved.",
      "note": "Line numbers for PDFs refer to extracted text lines."
    }
  },
  "tool_allowlist_notes": [
    "Lovable (UI build and hosting)",
    "Supabase (optional persistence)",
    "Local validation script: foundation_docs/tools/validate_pack.py"
  ]
}
~~~
@@@FILE_END path="foundation_pack/SRS/agentic_prompt_gates.json"@@@

@@@FILE_BEGIN path="foundation_pack/SRS/data_contracts.json" type="json" sha256="20f1860b474390f8013f51f9df67b5c14220dbd2c88777268aa8f0c50ffe7334"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "SRS/data_contracts.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "DESIGN",
    "adlc_state": "Final",
    "adlc_work_cnt": 2,
    "last_updated_utc": "2026-02-28T21:25:04Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft data contracts for app APIs/DB RPC. Some fields depend on hosting/auth decisions. | Phase 2: aligned endpoints with confirmed kiosk mode and simulator I/O."
  },
  "template_id": "DF.OUTPUT.SRS.DATA_CONTRACTS.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "DESIGN",
  "purpose": "Define external and internal data contracts for ingesting the pilot CSV, running simulations, and generating exports.",
  "integrations": [
    {
      "name": "Supabase/Postgres",
      "type": "database",
      "notes": "Confirmed primary stack choice (ASM-001), but can be omitted for a fully client-side offline demo if persistence not required."
    },
    {
      "name": "USDA FoodData Central",
      "type": "external_api",
      "notes": "optional; requires API key (OQ-004).",
      "contract": null
    }
  ],
  "endpoints": [
    {
      "id": "EP-001",
      "name": "Ingest pilot CSV",
      "method": "POST",
      "path": "/api/pilot-datasets/ingest",
      "auth": "admin_only_optional",
      "request_schema": {
        "content_type": "multipart/form-data",
        "fields": {
          "file": "csv",
          "dataset_name": "string",
          "column_map_override": "json (optional)"
        }
      },
      "response_schema": {
        "dataset_id": "uuid",
        "row_count": "int",
        "column_map": "json",
        "warnings": "array[string]"
      },
      "validation_rules": [
        "Reject if any column contains non-numeric values for canonical metrics (diet_score, tests).",
        "Reject if row_count < 1.",
        "Warn if duplicate diet score columns exist; require mapping."
      ],
      "errors": [
        {
          "code": "PILOT_CSV_INVALID",
          "http_status": 400,
          "message": "CSV failed validation."
        },
        {
          "code": "PILOT_CSV_MAPPING_REQUIRED",
          "http_status": 400,
          "message": "Column mapping required due to ambiguous columns."
        }
      ],
      "evidence": [
        {
          "source_id": "Data Sheet 1.csv",
          "loc": "rows=66, cols=14",
          "snippet": "File contains 66 rows of pilot data with diet score and cognitive tests (Stroop, Language, Memory, Logical, Overall)."
        }
      ],
      "notes": "Default kiosk mode; dataset ingestion/upload is optional and should be protected behind hidden admin controls (OQ-003)."
    },
    {
      "id": "EP-002",
      "name": "Run simulation",
      "method": "POST",
      "path": "/api/simulations/run",
      "auth": "none",
      "request_schema": {
        "diet_features": {
          "fiber_g_per_day": "number|null",
          "added_sugar_g_per_day": "number|null",
          "saturated_fat_g_per_day": "number|null",
          "omega3_proxy_g_per_day": "number|null",
          "calories_kcal_per_day": "number|null"
        },
        "model_version_id": "string|null",
        "notes": "string|null"
      },
      "response_schema": {
        "run_id": "uuid",
        "run_hash": "string",
        "model_version_ids": "array[string]|null",
        "outputs": {
          "microbiome": {
            "bifidobacterium_rel_abundance": "number",
            "lactobacillus_rel_abundance": "number",
            "firmicutes_bacteroidetes_ratio": "number"
          },
          "metabolites": {
            "acetate_score": "number",
            "propionate_score": "number",
            "butyrate_score": "number",
            "five_htp_precursor_index": "number"
          },
          "cognition": {
            "stroop_modeled": "number",
            "memory_modeled": "number",
            "language_modeled": "number",
            "logical_modeled": "number",
            "overall_modeled": "number"
          }
        },
        "warnings": "array[string]"
      },
      "validation_rules": [
        "At least one diet feature must be provided.",
        "If model_version_id is null, use the system default model bundle.",
        "All outputs must be deterministic for the same (normalized inputs + model_version_ids)."
      ],
      "errors": [
        {
          "code": "SIM_INPUT_INVALID",
          "http_status": 400,
          "message": "Diet feature input invalid."
        },
        {
          "code": "SIM_MODEL_NOT_FOUND",
          "http_status": 404,
          "message": "Model version not found."
        }
      ],
      "notes": "Confirmed I/O via OQ-006. Models are frozen JSON artifacts per OQ-001/OQ-002."
    },
    {
      "id": "EP-003",
      "name": "Generate export report",
      "method": "POST",
      "path": "/api/exports",
      "auth": "none",
      "request_schema": {
        "run_id": "uuid",
        "format": "pdf|html",
        "include_pilot_visuals": "boolean"
      },
      "response_schema": {
        "export_id": "uuid",
        "artifact_uri": "string|null",
        "format": "pdf|html"
      },
      "validation_rules": [
        "run_id must exist.",
        "format must be allowed (OQ-007)."
      ],
      "errors": [
        {
          "code": "EXPORT_RUN_NOT_FOUND",
          "http_status": 404,
          "message": "Simulation run not found."
        }
      ],
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L136-L140",
          "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
        }
      ]
    }
  ],
  "events": [
    {
      "id": "EVT-001",
      "name": "simulation_run_created",
      "payload_schema": {
        "run_id": "uuid",
        "run_hash": "string",
        "created_at": "timestamptz"
      },
      "notes": "Optional; useful for audit/telemetry."
    }
  ],
  "validation_rules": [
    "All user-visible numeric outputs must be derived from deterministic computation or stored artifacts, never from synthetic random data (unless explicitly labeled as such).",
    "Pilot dataset must remain isolated from any training/tuning logic; the app must not claim it was used for training."
  ],
  "error_model": {
    "shape": {
      "code": "string",
      "message": "string",
      "details": "object|null",
      "trace_id": "string|null"
    }
  },
  "security_notes": {
    "posture": "Minimal; science-fair demo prototype. Avoid PII. Optional admin-only actions for dataset ingestion.",
    "cannot_confirm": false,
    "open_questions": []
  }
}
~~~
@@@FILE_END path="foundation_pack/SRS/data_contracts.json"@@@

@@@FILE_BEGIN path="foundation_pack/SRS/database_schema.json" type="json" sha256="fd8adb6800ce0ffc9242e37fb0c5b2d82906c39f4ba5c8e85f3677396a66a084"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "SRS/database_schema.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "DESIGN",
    "adlc_state": "Final",
    "adlc_work_cnt": 2,
    "last_updated_utc": "2026-02-28T21:25:04Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft database schema. Fields may remain null where blocked by open questions. | Phase 2: clarified model artifact location expectations."
  },
  "template_id": "DF.OUTPUT.SRS.DATABASE_SCHEMA.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "DESIGN",
  "purpose": "Define the minimum relational schema to store pilot dataset metadata, simulation runs, model versions, and export artifacts for the Gut–Brain Simulator app.",
  "entities": [
    {
      "name": "PilotDataset",
      "description": "Metadata about a de-identified pilot dataset CSV used for validation charts."
    },
    {
      "name": "PilotRecord",
      "description": "One row from the pilot dataset (numeric metrics only)."
    },
    {
      "name": "ModelVersion",
      "description": "Versioned simulator model artifact(s) for reproducible runs."
    },
    {
      "name": "SimulationRun",
      "description": "A single simulator execution with inputs, outputs, provenance, and run_hash."
    },
    {
      "name": "ExportArtifact",
      "description": "Generated 1-page report artifact metadata."
    }
  ],
  "tables": [
    {
      "name": "pilot_datasets",
      "purpose": "Track available pilot datasets (bundled or uploaded) and their column mapping.",
      "columns": [
        {
          "name": "id",
          "type": "uuid",
          "pk": true,
          "nullable": false
        },
        {
          "name": "name",
          "type": "text",
          "nullable": false
        },
        {
          "name": "source",
          "type": "text",
          "nullable": true,
          "notes": "e.g., bundled, upload"
        },
        {
          "name": "sha256",
          "type": "text",
          "nullable": true
        },
        {
          "name": "row_count",
          "type": "int",
          "nullable": true
        },
        {
          "name": "column_map",
          "type": "jsonb",
          "nullable": true,
          "notes": "maps CSV column names to canonical fields"
        },
        {
          "name": "created_at",
          "type": "timestamptz",
          "nullable": false
        },
        {
          "name": "notes",
          "type": "text",
          "nullable": true
        }
      ]
    },
    {
      "name": "pilot_records",
      "purpose": "Store numeric validation data only (no PII).",
      "columns": [
        {
          "name": "id",
          "type": "uuid",
          "pk": true,
          "nullable": false
        },
        {
          "name": "dataset_id",
          "type": "uuid",
          "fk": "pilot_datasets.id",
          "nullable": false
        },
        {
          "name": "diet_score",
          "type": "float",
          "nullable": false
        },
        {
          "name": "stroop_test",
          "type": "float",
          "nullable": true
        },
        {
          "name": "language_test",
          "type": "float",
          "nullable": true
        },
        {
          "name": "memory_test",
          "type": "float",
          "nullable": true
        },
        {
          "name": "logical_test",
          "type": "float",
          "nullable": true
        },
        {
          "name": "overall_score",
          "type": "float",
          "nullable": true
        },
        {
          "name": "raw_row",
          "type": "jsonb",
          "nullable": true,
          "notes": "optional: preserve raw row for audit"
        }
      ]
    },
    {
      "name": "model_versions",
      "purpose": "Store version metadata for each simulator stage artifact.",
      "columns": [
        {
          "name": "id",
          "type": "text",
          "pk": true,
          "nullable": false,
          "notes": "human-readable id, e.g., MV-2026-02-28-A"
        },
        {
          "name": "stage",
          "type": "text",
          "nullable": false,
          "notes": "diet_to_microbiome | microbiome_to_metabolites | metabolites_to_cognition | composite"
        },
        {
          "name": "artifact_format",
          "type": "text",
          "nullable": true,
          "notes": "e.g., json, onnx, pickle"
        },
        {
          "name": "artifact_sha256",
          "type": "text",
          "nullable": true
        },
        {
          "name": "artifact_uri",
          "type": "text",
          "nullable": true,
          "notes": "If bundled: /public/models/<file>.json. If external: Supabase Storage URI."
        },
        {
          "name": "created_at",
          "type": "timestamptz",
          "nullable": false
        },
        {
          "name": "notes",
          "type": "text",
          "nullable": true
        }
      ]
    },
    {
      "name": "simulation_runs",
      "purpose": "Persist simulator runs for reproducibility and exports.",
      "columns": [
        {
          "name": "id",
          "type": "uuid",
          "pk": true,
          "nullable": false
        },
        {
          "name": "run_hash",
          "type": "text",
          "nullable": false,
          "unique": true
        },
        {
          "name": "created_at",
          "type": "timestamptz",
          "nullable": false
        },
        {
          "name": "input_diet_features",
          "type": "jsonb",
          "nullable": false
        },
        {
          "name": "output_microbiome",
          "type": "jsonb",
          "nullable": true
        },
        {
          "name": "output_metabolites",
          "type": "jsonb",
          "nullable": true
        },
        {
          "name": "output_cognition",
          "type": "jsonb",
          "nullable": true
        },
        {
          "name": "model_version_ids",
          "type": "jsonb",
          "nullable": true,
          "notes": "list of model version ids used"
        },
        {
          "name": "notes",
          "type": "text",
          "nullable": true
        }
      ]
    },
    {
      "name": "export_artifacts",
      "purpose": "Track generated reports.",
      "columns": [
        {
          "name": "id",
          "type": "uuid",
          "pk": true,
          "nullable": false
        },
        {
          "name": "run_id",
          "type": "uuid",
          "fk": "simulation_runs.id",
          "nullable": false
        },
        {
          "name": "format",
          "type": "text",
          "nullable": false,
          "notes": "pdf | html"
        },
        {
          "name": "artifact_uri",
          "type": "text",
          "nullable": true,
          "notes": "storage location"
        },
        {
          "name": "created_at",
          "type": "timestamptz",
          "nullable": false
        },
        {
          "name": "notes",
          "type": "text",
          "nullable": true
        }
      ]
    }
  ],
  "relationships": [
    {
      "from": "pilot_records.dataset_id",
      "to": "pilot_datasets.id",
      "type": "many_to_one"
    },
    {
      "from": "export_artifacts.run_id",
      "to": "simulation_runs.id",
      "type": "many_to_one"
    }
  ],
  "indexes": [
    {
      "table": "pilot_records",
      "columns": [
        "dataset_id"
      ],
      "type": "btree"
    },
    {
      "table": "simulation_runs",
      "columns": [
        "run_hash"
      ],
      "type": "btree"
    },
    {
      "table": "export_artifacts",
      "columns": [
        "run_id"
      ],
      "type": "btree"
    }
  ],
  "data_retention": {
    "policy": "Keep pilot datasets and runs for the duration of the project; allow manual purge.",
    "default_days": null,
    "notes": "cannot confirm retention requirements; set to null if not specified."
  },
  "integrity_rules": [
    "pilot_records must contain numeric values only; no PII fields allowed.",
    "run_hash must be computed from (normalized inputs + model_version_ids) to ensure deterministic reproducibility.",
    "If pilot dataset is 'bundled', treat it as read-only."
  ]
}
~~~
@@@FILE_END path="foundation_pack/SRS/database_schema.json"@@@

@@@FILE_BEGIN path="foundation_pack/SRS/gui_spec.json" type="json" sha256="914b35ba61bb736e0c398d0af0c3226caebc86be4d5168d873e7aad3ebaf4c3e"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "SRS/gui_spec.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "DESIGN",
    "adlc_state": "Final",
    "adlc_work_cnt": 3,
    "last_updated_utc": "2026-03-01T00:12:29Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft GUI spec for judge-ready demo. | Phase 2: aligned UI spec with confirmed I/O and dataset handling."
  },
  "template_id": "DF.OUTPUT.SRS.GUI_SPEC.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "DESIGN",
  "purpose": "Define UI/UX screens and flows for the Gut–Brain Simulator app, optimized for science fair judging.",
  "platforms": {
    "targets": [
      "Web",
      "Desktop",
      "MobilePWA"
    ],
    "responsive": "Mobile-first responsive layout; desktop-optimized charts."
  },
  "core_flows": [
    {
      "flow_id": "FLOW-01",
      "name": "Judge walkthrough",
      "screen_path": [
        "SCR-001",
        "SCR-002",
        "SCR-003",
        "SCR-004"
      ]
    },
    {
      "flow_id": "FLOW-02",
      "name": "Pilot dataset check",
      "screen_path": [
        "SCR-001",
        "SCR-005"
      ]
    },
    {
      "flow_id": "FLOW-03",
      "name": "Scenario comparison",
      "screen_path": [
        "SCR-001",
        "SCR-003",
        "SCR-006",
        "SCR-004"
      ]
    },
    {
      "flow_id": "FLOW-04",
      "name": "Transparency: Foundation Docs",
      "screen_path": [
        "SCR-001",
        "SCR-007"
      ]
    }
  ],
  "screens": [
    {
      "id": "SCR-001",
      "name": "Home / Dashboard",
      "purpose": "Entry point with quick links to Pilot Results, Simulator, Methods & Rigor, and Export.",
      "key_components": [
        "Navigation tiles",
        "Current model version badge",
        "Last run summary"
      ],
      "data_dependencies": [
        "model_versions (default)",
        "optional last simulation run"
      ],
      "acceptance_notes": "Must load without login in kiosk mode (confirmed OQ-003). Help/Docs button must be visible."
    },
    {
      "id": "SCR-002",
      "name": "Pilot Results (n=66)",
      "purpose": "Show real validation charts and tables from the pilot dataset.",
      "key_components": [
        "Dataset selector (bundled default + upload/replace in admin mode)",
        "Summary statistics table",
        "Scatter plots per cognitive metric",
        "Correlation table"
      ],
      "data_dependencies": [
        "pilot_datasets",
        "pilot_records"
      ],
      "open_questions": []
    },
    {
      "id": "SCR-003",
      "name": "Simulator",
      "purpose": "Run diet→microbiome→metabolites→cognition simulation and show outputs.",
      "key_components": [
        "Diet inputs: fiber, added sugar, saturated fat, omega-3 proxy (optional calories)",
        "Run button",
        "Stage outputs panels: Microbiome (Bifidobacterium, Lactobacillus, F:B ratio), Metabolites (acetate/propionate/butyrate + 5-HTP index), Cognition (Stroop/memory/language/logical/overall)",
        "Run id / provenance (run_hash + model versions)"
      ],
      "data_dependencies": [
        "model_versions",
        "simulation_runs"
      ],
      "open_questions": []
    },
    {
      "id": "SCR-004",
      "name": "Export Report",
      "purpose": "Generate and preview/download a 1-page report for a run.",
      "key_components": [
        "Run selector",
        "Format toggle (PDF/HTML)",
        "Preview",
        "Generate button"
      ],
      "data_dependencies": [
        "simulation_runs",
        "export_artifacts"
      ],
      "open_questions": [
        "OQ-007"
      ]
    },
    {
      "id": "SCR-005",
      "name": "Methods & Rigor",
      "purpose": "Explain limitations, leakage guardrails, dataset boundaries, and disclaimers.",
      "key_components": [
        "Leakage checklist",
        "Causality disclaimer card",
        "Data sources panel"
      ],
      "data_dependencies": [
        "static content"
      ],
      "acceptance_notes": "Must explicitly state pilot validation-only and non-diagnostic disclaimer (UR-004)."
    },
    {
      "id": "SCR-006",
      "name": "Scenario Comparison",
      "purpose": "Compare two scenarios side-by-side and export.",
      "key_components": [
        "Scenario A controls",
        "Scenario B controls",
        "Comparison charts",
        "Save/export"
      ],
      "data_dependencies": [
        "simulation_runs"
      ],
      "acceptance_notes": "Optional v1 (UR-014)."
    },
    {
      "id": "SCR-007",
      "name": "Help / Docs (Foundation Pack Viewer)",
      "purpose": "Show all packaged foundation documents and reference snapshots to judges; render JSON/CSV/MD/TXT offline.",
      "key_components": [
        "Document category tabs: Foundation, Reference, Data",
        "Search + filter (by title, category, type)",
        "Document list loaded from /foundation_pack/docs_index.json",
        "Viewer panel with on-the-fly rendering: JSON (pretty + optional derived table), CSV table preview, Markdown render, Text render",
        "Copy-to-clipboard and Download link for the current document"
      ],
      "data_dependencies": [
        "static asset: /foundation_pack/docs_index.json",
        "static assets: files referenced by docs_index items"
      ],
      "acceptance_notes": "Must work fully offline and load within 1s after app shell loads; Help button visible on every screen."
    }
  ],
  "accessibility_notes": [
    "Charts must have readable labels and sufficient contrast.",
    "Keyboard navigation for key controls.",
    "Avoid tiny fonts; judge viewing distance can be >1 meter."
  ],
  "open_questions": [
    "OQ-007",
    "OQ-009"
  ],
  "global_components": [
    "Top app bar: CogniBiome title, model-version badge, kiosk/offline indicator, Export button (optional), Help/Docs button (always visible).",
    "Help/Docs opens SCR-007 and is accessible from every screen.",
    "All content is read-only; no user accounts; no PHI."
  ]
}
~~~
@@@FILE_END path="foundation_pack/SRS/gui_spec.json"@@@

@@@FILE_BEGIN path="foundation_pack/SRS/nfr_budgets.json" type="json" sha256="61a65a0010a4aa9af0911b74e86fda47c082a783f06e3fa73a85ef87bde391b9"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "SRS/nfr_budgets.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "DESIGN",
    "adlc_state": "Final",
    "adlc_work_cnt": 2,
    "last_updated_utc": "2026-02-28T21:25:04Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft non-functional budgets for a science-fair demo app. | Phase 2: no numeric budget changes; confirmed app is judge-demo focused."
  },
  "template_id": "DF.OUTPUT.SRS.NFR_BUDGETS.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "DESIGN",
  "purpose": "Set practical performance, reliability, and integrity budgets for a judge-facing demo app.",
  "performance_budgets": {
    "cold_start_ui_seconds": 3,
    "simulation_latency_ms": 500,
    "pilot_charts_render_seconds": 2,
    "notes": "Targets are assumptions; confirm via OQ-010."
  },
  "reliability_targets": {
    "export_success_rate": 0.99,
    "crash_free_session_rate": 0.99,
    "notes": "Assumptions for demo context."
  },
  "data_integrity_targets": {
    "pilot_csv_validation": "Strict numeric validation with clear mapping for ambiguous columns.",
    "no_synthetic_pilot_data": "Pilot charts must reflect loaded dataset only."
  },
  "cost_budget": {
    "target_monthly_usd": 0,
    "notes": "For science fair demo, prefer free/low-cost hosting; cannot confirm budget."
  },
  "privacy_security_posture": {
    "pii_collection": "none",
    "data_classification": "De-identified teen data (still treat as sensitive).",
    "auth": "kiosk by default; admin-only for ingestion if enabled (OQ-003)."
  },
  "observability": {
    "client_logging": "Capture errors with a trace_id; show user-friendly errors.",
    "audit_trail": "Store run_id/run_hash and export events for reproducibility.",
    "notes": "No heavy telemetry required."
  }
}
~~~
@@@FILE_END path="foundation_pack/SRS/nfr_budgets.json"@@@

@@@FILE_BEGIN path="foundation_pack/SRS/test_plan_and_ci.json" type="json" sha256="1e61b8e075516f0d4c32b4b51831fd0d22083a855aff0c06d12e9c799765c814"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "SRS/test_plan_and_ci.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "DESIGN",
    "adlc_state": "Final",
    "adlc_work_cnt": 3,
    "last_updated_utc": "2026-03-01T00:12:29Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft test plan and CI expectations. | Phase 2: updated open-questions list; tests unchanged."
  },
  "template_id": "DF.OUTPUT.SRS.TEST_PLAN_AND_CI.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "DESIGN",
  "purpose": "Define test coverage needed to prevent data integrity and demo failures for the Gut–Brain Simulator app.",
  "test_levels": [
    {
      "level": "unit",
      "scope": "CSV parsing/mapping, stats computation, deterministic hashing"
    },
    {
      "level": "integration",
      "scope": "Simulation execution with persisted runs; export generation"
    },
    {
      "level": "e2e",
      "scope": "Judge walkthrough flow across screens"
    },
    {
      "level": "manual",
      "scope": "Wording/disclaimer audit for non-diagnostic and non-causal phrasing"
    }
  ],
  "test_cases": [
    {
      "id": "TST-001",
      "level": "unit",
      "title": "Pilot CSV column mapping and numeric validation",
      "objective": "Reject invalid CSVs and correctly map duplicated columns (Diet Score.*) to canonical fields.",
      "steps": [
        "Load Data Sheet 1.csv.",
        "Apply default column mapping.",
        "Assert row_count == 66 and all canonical numeric fields parse."
      ],
      "expected_result": "Ingestion succeeds with row_count=66 and produces canonical columns diet_score, stroop_test, language_test, memory_test, logical_test, overall_score.",
      "related_requirements": [
        "SRS-REQ-001",
        "SRS-REQ-002"
      ],
      "evidence": [
        {
          "source_id": "Data Sheet 1.csv",
          "loc": "rows=66, cols=14",
          "snippet": "File contains 66 rows of pilot data with diet score and cognitive tests (Stroop, Language, Memory, Logical, Overall)."
        }
      ]
    },
    {
      "id": "TST-002",
      "level": "unit",
      "title": "Pilot stats and correlation computation",
      "objective": "Compute summary stats and correlations without errors.",
      "steps": [
        "Using canonical pilot records, compute mean/median for each metric.",
        "Compute correlation between diet_score and each test."
      ],
      "expected_result": "Stats and correlations computed; NaNs handled deterministically.",
      "related_requirements": [
        "SRS-REQ-003",
        "SRS-REQ-004"
      ]
    },
    {
      "id": "TST-003",
      "level": "integration",
      "title": "Simulation determinism",
      "objective": "Same inputs + model_version produce identical outputs and run_hash.",
      "steps": [
        "Run simulation twice with identical inputs and explicit model_version_id.",
        "Compare outputs and run_hash."
      ],
      "expected_result": "Outputs identical; run_hash identical.",
      "related_requirements": [
        "SRS-REQ-007",
        "SRS-REQ-010"
      ]
    },
    {
      "id": "TST-004",
      "level": "e2e",
      "title": "Judge walkthrough flow",
      "objective": "Ensure the presenter can complete Flow-01 without blockers.",
      "steps": [
        "Open app in fresh session.",
        "Navigate Dashboard → Pilot Results → Methods & Rigor → Simulator → Export.",
        "Generate an export."
      ],
      "expected_result": "No authentication prompt; all screens load; export completes.",
      "related_requirements": [
        "SRS-REQ-005",
        "SRS-REQ-014",
        "SRS-REQ-017"
      ]
    },
    {
      "id": "TST-005",
      "level": "integration",
      "title": "Export content completeness",
      "objective": "Export includes required sections and disclaimers.",
      "steps": [
        "Generate export for a simulation run.",
        "Parse/export preview to verify required sections present."
      ],
      "expected_result": "Report includes: inputs, outputs, pilot visuals, leakage notes, disclaimer, run_id/model_version.",
      "related_requirements": [
        "SRS-REQ-017",
        "SRS-REQ-018",
        "SRS-REQ-019"
      ]
    },
    {
      "id": "TST-006",
      "level": "manual",
      "title": "Non-diagnostic and proxy labeling audit",
      "objective": "Verify UI wording avoids causal/diagnostic claims.",
      "steps": [
        "Review Methods & Rigor page.",
        "Review Simulator outputs labels."
      ],
      "expected_result": "Disclaimer present; outputs labeled simulated/proxy; no 'proves' language.",
      "related_requirements": [
        "SRS-REQ-015",
        "SRS-REQ-016",
        "SRS-REQ-024"
      ]
    },
    {
      "id": "TST-007",
      "level": "integration",
      "title": "Help/Docs index load + renderer smoke test",
      "objective": "Verify docs_index loads, list is non-empty, and renderer supports JSON/CSV/MD/TXT offline.",
      "steps": [
        "Load the app in offline mode (no network).",
        "Open Help/Docs (SCR-007).",
        "Assert docs_index loads and contains expected key items (e.g., gui_spec.json, user_requirements.json, brd.json, pilot_dataset_n66.csv).",
        "Open one JSON doc and verify pretty formatting renders.",
        "Open pilot_dataset_n66.csv and verify table preview renders.",
        "Open a Markdown doc (e.g., reference/README_data_build.md) and verify markdown renders.",
        "Open a TXT doc (external_sources_for_Gut_overview.txt) and verify text renders."
      ],
      "expected_result": "All document types render correctly without network and without runtime errors.",
      "related_requirements": [
        "SRS-REQ-029",
        "SRS-REQ-030"
      ]
    }
  ],
  "ci_commands": {
    "lint": null,
    "unit_tests": null,
    "build": null,
    "notes": "cannot confirm CI commands until tech stack is finalized (ASM-001)."
  },
  "coverage_expectations": {
    "unit": "Core data parsing and deterministic hashing must be covered.",
    "integration": "Simulation and export must be covered with at least one golden test.",
    "e2e": "At least one judge-walkthrough smoke test."
  },
  "open_questions": [
    "OQ-007"
  ]
}
~~~
@@@FILE_END path="foundation_pack/SRS/test_plan_and_ci.json"@@@

@@@FILE_BEGIN path="foundation_pack/SRS/traceable_requirements.json" type="json" sha256="b9418dbb6e43e2cf90b165169dcabb6b0eb83e252c673a2c3e3d5b2b5618f5ee"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "SRS/traceable_requirements.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "DESIGN",
    "adlc_state": "Final",
    "adlc_work_cnt": 3,
    "last_updated_utc": "2026-03-01T00:12:29Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft SRS requirements with BRD and test traceability. | Phase 2: removed resolved dependencies; traceability unchanged."
  },
  "template_id": "DF.OUTPUT.SRS.TRACEABLE_REQUIREMENTS.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "DESIGN",
  "purpose": "Provide implementation-ready, traceable SRS requirements for the Gut–Brain Simulator app.",
  "requirement_format": {
    "id_format": "SRS-REQ-{3 digits}",
    "fields": [
      "id",
      "type",
      "statement",
      "priority",
      "rationale",
      "depends_on",
      "data_entities",
      "trace_to_brd",
      "test_ids",
      "notes"
    ]
  },
  "requirements": [
    {
      "id": "SRS-REQ-001",
      "type": "functional",
      "statement": "Implement pilot CSV ingestion with deterministic column mapping into canonical fields (diet_score, stroop_test, language_test, memory_test, logical_test, overall_score).",
      "priority": "MUST",
      "rationale": "Needed to show real pilot results.",
      "depends_on": [
        "EP-001 / pilot_datasets",
        "pilot_records"
      ],
      "data_entities": [
        "PilotDataset",
        "PilotRecord"
      ],
      "trace_to_brd": [
        "BRD-REQ-001"
      ],
      "test_ids": [
        "TST-001"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-002",
      "type": "functional",
      "statement": "Detect and require resolution of ambiguous/duplicated CSV columns (e.g., Diet Score, Diet Score.1, etc.) before computing stats.",
      "priority": "MUST",
      "rationale": "Current CSV appears to contain duplicated Diet Score columns; must avoid silent mis-mapping.",
      "depends_on": [
        "EP-001"
      ],
      "data_entities": [
        "PilotDataset"
      ],
      "trace_to_brd": [
        "BRD-REQ-001"
      ],
      "test_ids": [
        "TST-001"
      ],
      "notes": "evidence: Data Sheet 1.csv has multiple Diet Score.* columns; mapping must be explicit."
    },
    {
      "id": "SRS-REQ-003",
      "type": "functional",
      "statement": "Compute and display summary statistics for each pilot metric (mean, median, n).",
      "priority": "MUST",
      "rationale": "Judges expect quantitative summaries.",
      "depends_on": [
        "pilot_records"
      ],
      "data_entities": [
        "PilotRecord"
      ],
      "trace_to_brd": [
        "BRD-REQ-001"
      ],
      "test_ids": [
        "TST-002"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-004",
      "type": "functional",
      "statement": "Compute and display correlation signals between diet_score and each cognitive metric.",
      "priority": "MUST",
      "rationale": "Shows measurable relationship in pilot dataset.",
      "depends_on": [
        "pilot_records"
      ],
      "data_entities": [
        "PilotRecord"
      ],
      "trace_to_brd": [
        "BRD-REQ-001"
      ],
      "test_ids": [
        "TST-002"
      ],
      "notes": "Do not claim causality."
    },
    {
      "id": "SRS-REQ-005",
      "type": "functional",
      "statement": "Render pilot dataset charts (scatter plots) for diet_score vs each cognitive metric and overall_score.",
      "priority": "MUST",
      "rationale": "Core judge-facing visuals.",
      "depends_on": [
        "GUI:SCR-002"
      ],
      "data_entities": [
        "PilotRecord"
      ],
      "trace_to_brd": [
        "BRD-REQ-001"
      ],
      "test_ids": [
        "TST-004"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-006",
      "type": "functional",
      "statement": "Provide dataset metadata display (row count, file hash, last loaded time).",
      "priority": "SHOULD",
      "rationale": "Supports transparency and reproducibility.",
      "depends_on": [
        "pilot_datasets"
      ],
      "data_entities": [
        "PilotDataset"
      ],
      "trace_to_brd": [
        "BRD-REQ-001",
        "BRD-REQ-008"
      ],
      "test_ids": [
        "TST-001"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-007",
      "type": "functional",
      "statement": "Provide diet input UI controls for the chosen nutrient variables and validate ranges.",
      "priority": "MUST",
      "rationale": "Enables simulation runs.",
      "depends_on": [
        "GUI:SCR-003"
      ],
      "data_entities": [
        "DietScenario"
      ],
      "trace_to_brd": [
        "BRD-REQ-002"
      ],
      "test_ids": [
        "TST-004"
      ],
      "notes": "Exact variable set depends on OQ-006."
    },
    {
      "id": "SRS-REQ-008",
      "type": "functional",
      "statement": "Normalize diet inputs into a canonical feature vector used to compute run_hash.",
      "priority": "MUST",
      "rationale": "Ensures deterministic hashing and reproducibility.",
      "depends_on": [
        "simulation_runs"
      ],
      "data_entities": [
        "SimulationRun"
      ],
      "trace_to_brd": [
        "BRD-REQ-002"
      ],
      "test_ids": [
        "TST-003"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-009",
      "type": "functional",
      "statement": "Execute the stage pipeline (diet→microbiome→metabolites→cognition) using the selected runtime approach.",
      "priority": "MUST",
      "rationale": "Core simulation behavior.",
      "depends_on": [
        "EP-002 / model_versions"
      ],
      "data_entities": [
        "ModelVersion",
        "SimulationRun"
      ],
      "trace_to_brd": [
        "BRD-REQ-002"
      ],
      "test_ids": [
        "TST-003"
      ],
      "notes": "blocks on OQ-001/OQ-002/OQ-006."
    },
    {
      "id": "SRS-REQ-010",
      "type": "functional",
      "statement": "Compute run_hash deterministically from normalized diet inputs + model_version_ids.",
      "priority": "MUST",
      "rationale": "Reproducibility.",
      "depends_on": [
        "simulation_runs"
      ],
      "data_entities": [
        "SimulationRun",
        "ModelVersion"
      ],
      "trace_to_brd": [
        "BRD-REQ-002"
      ],
      "test_ids": [
        "TST-003"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-011",
      "type": "functional",
      "statement": "Persist simulation runs (inputs, outputs, provenance) for later export.",
      "priority": "MUST",
      "rationale": "Exports require stored run context.",
      "depends_on": [
        "simulation_runs"
      ],
      "data_entities": [
        "SimulationRun"
      ],
      "trace_to_brd": [
        "BRD-REQ-002",
        "BRD-REQ-004"
      ],
      "test_ids": [
        "TST-004"
      ],
      "notes": "Storage may be optional if exports are immediate; confirm via OQ-003."
    },
    {
      "id": "SRS-REQ-012",
      "type": "functional",
      "statement": "Display stage outputs with clear labels and units; if unknown, show null with 'cannot confirm'.",
      "priority": "MUST",
      "rationale": "Avoids hallucinated precision.",
      "depends_on": [
        "GUI:SCR-003"
      ],
      "data_entities": [
        "SimulationRun"
      ],
      "trace_to_brd": [
        "BRD-REQ-002"
      ],
      "test_ids": [
        "TST-004"
      ],
      "notes": "Depends on OQ-006."
    },
    {
      "id": "SRS-REQ-013",
      "type": "functional",
      "statement": "Support side-by-side comparison of two scenarios (optional v1).",
      "priority": "SHOULD",
      "rationale": "Improves interpretability and dose-response demonstrations.",
      "depends_on": [
        "GUI:SCR-006"
      ],
      "data_entities": [
        "SimulationRun"
      ],
      "trace_to_brd": [
        "BRD-REQ-005"
      ],
      "test_ids": [
        "TST-004"
      ],
      "notes": "May be deferred."
    },
    {
      "id": "SRS-REQ-014",
      "type": "functional",
      "statement": "Provide a Methods & Rigor screen containing: dataset boundary statement, leakage definition, and limitations.",
      "priority": "MUST",
      "rationale": "Judge-facing rigor.",
      "depends_on": [
        "GUI:SCR-005"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-003"
      ],
      "test_ids": [
        "TST-004"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-015",
      "type": "functional",
      "statement": "Include a visible non-diagnostic disclaimer and non-causality language in UI and exports.",
      "priority": "MUST",
      "rationale": "Risk reduction.",
      "depends_on": [
        "GUI:SCR-005",
        "GUI:SCR-004"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-003"
      ],
      "test_ids": [
        "TST-006",
        "TST-005"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-016",
      "type": "functional",
      "statement": "Label microbiome/metabolite outputs as simulated proxies; state that teens have no stool/metabolite measurements.",
      "priority": "MUST",
      "rationale": "Prevent misrepresentation.",
      "depends_on": [
        "GUI:SCR-003",
        "GUI:SCR-005"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-007"
      ],
      "test_ids": [
        "TST-006"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-017",
      "type": "functional",
      "statement": "Generate a 1-page report for a selected simulation run.",
      "priority": "MUST",
      "rationale": "Deliverable artifact.",
      "depends_on": [
        "EP-003 / export_artifacts"
      ],
      "data_entities": [
        "ExportArtifact",
        "SimulationRun"
      ],
      "trace_to_brd": [
        "BRD-REQ-004"
      ],
      "test_ids": [
        "TST-004",
        "TST-005"
      ],
      "notes": "Format depends on OQ-007."
    },
    {
      "id": "SRS-REQ-018",
      "type": "functional",
      "statement": "Export must include run_id/run_hash and model_version_ids.",
      "priority": "MUST",
      "rationale": "Reproducibility.",
      "depends_on": [
        "export_artifacts"
      ],
      "data_entities": [
        "ExportArtifact",
        "ModelVersion"
      ],
      "trace_to_brd": [
        "BRD-REQ-004"
      ],
      "test_ids": [
        "TST-005"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-019",
      "type": "functional",
      "statement": "Export must include diet inputs, stage outputs, and pilot visuals (or pilot summary) when enabled.",
      "priority": "MUST",
      "rationale": "Completeness for judges.",
      "depends_on": [
        "export_artifacts"
      ],
      "data_entities": [
        "ExportArtifact"
      ],
      "trace_to_brd": [
        "BRD-REQ-004"
      ],
      "test_ids": [
        "TST-005"
      ],
      "notes": "Pilot visuals inclusion depends on OQ-005."
    },
    {
      "id": "SRS-REQ-020",
      "type": "functional",
      "statement": "Export must include leakage guardrails checklist and disclaimers.",
      "priority": "MUST",
      "rationale": "Rigor and safety.",
      "depends_on": [
        "export_artifacts"
      ],
      "data_entities": [
        "ExportArtifact"
      ],
      "trace_to_brd": [
        "BRD-REQ-003",
        "BRD-REQ-004"
      ],
      "test_ids": [
        "TST-005"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-021",
      "type": "functional",
      "statement": "Provide a Presenter Mode that highlights the minimal demo path and hides advanced controls.",
      "priority": "SHOULD",
      "rationale": "2-minute demo support.",
      "depends_on": [
        "GUI:global"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-005"
      ],
      "test_ids": [
        "TST-004"
      ],
      "notes": "Depends on OQ-009."
    },
    {
      "id": "SRS-REQ-022",
      "type": "functional",
      "statement": "Provide a 'Reset demo state' action that restores default dataset and default scenario.",
      "priority": "SHOULD",
      "rationale": "Demo reliability.",
      "depends_on": [
        "GUI:global"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-005"
      ],
      "test_ids": [
        "TST-004"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-023",
      "type": "constraint",
      "statement": "Do not store or request PII; restrict stored pilot records to numeric metrics only.",
      "priority": "MUST",
      "rationale": "Privacy compliance.",
      "depends_on": [
        "database_schema integrity_rules"
      ],
      "data_entities": [
        "PilotRecord"
      ],
      "trace_to_brd": [
        "BRD-REQ-006"
      ],
      "test_ids": [
        "TST-001",
        "TST-006"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-024",
      "type": "constraint",
      "statement": "Do not imply measured microbiome/metabolite values for pilot participants; show them only as modeled variables.",
      "priority": "MUST",
      "rationale": "Scientific honesty.",
      "depends_on": [
        "UI wording rules"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-007"
      ],
      "test_ids": [
        "TST-006"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-025",
      "type": "functional",
      "statement": "Provide a Data Sources panel listing which datasets are used per stage and whether they are training, reference, or validation-only.",
      "priority": "SHOULD",
      "rationale": "Prevents judge confusion about dataset pairing.",
      "depends_on": [
        "static content"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-008"
      ],
      "test_ids": [
        "TST-004"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-026",
      "type": "functional",
      "statement": "Explicitly label any unpaired datasets as reference-only if they are not used for supervised paired training.",
      "priority": "SHOULD",
      "rationale": "Avoids methodological confusion.",
      "depends_on": [
        "static content"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-008"
      ],
      "test_ids": [
        "TST-004"
      ],
      "notes": "Depends on OQ-001."
    },
    {
      "id": "SRS-REQ-027",
      "type": "non_functional",
      "statement": "Meet NFR budgets for demo performance (cold start, simulation latency, chart render).",
      "priority": "SHOULD",
      "rationale": "Live demo reliability.",
      "depends_on": [
        "SRS/nfr_budgets.json"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-009"
      ],
      "test_ids": [
        "TST-004"
      ],
      "notes": ""
    },
    {
      "id": "SRS-REQ-028",
      "type": "functional",
      "statement": "If enabled, provide an Evidence panel with curated citations per module, presented as plausibility support only.",
      "priority": "SHOULD",
      "rationale": "Credibility enhancement.",
      "depends_on": [
        "GUI:optional"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-010"
      ],
      "test_ids": [
        "TST-006"
      ],
      "notes": "Depends on OQ-008."
    },
    {
      "id": "SRS-REQ-029",
      "type": "functional",
      "statement": "Provide a Help/Docs screen (GUI:SCR-007) that lists all packaged documentation items from /foundation_pack/docs_index.json and opens each item in a viewer, fully offline.",
      "priority": "MUST",
      "rationale": "Transparency and judge-ready auditability.",
      "depends_on": [
        "GUI:SCR-007",
        "static asset: /foundation_pack/docs_index.json"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-011"
      ],
      "test_ids": [
        "TST-007"
      ],
      "notes": "Read-only; no user-generated content."
    },
    {
      "id": "SRS-REQ-030",
      "type": "functional",
      "statement": "The Help/Docs viewer must render JSON/CSV/MD/TXT documents in-browser: JSON pretty-print (and optional derived table for known schemas), CSV table preview, Markdown render, and plain text render.",
      "priority": "MUST",
      "rationale": "Usable, consistent doc viewing on demo devices without external tools.",
      "depends_on": [
        "SRS-REQ-029"
      ],
      "data_entities": [],
      "trace_to_brd": [
        "BRD-REQ-011"
      ],
      "test_ids": [
        "TST-007"
      ],
      "notes": "Rendering must not execute scripts; treat content as untrusted text."
    }
  ],
  "traceability": {
    "brd_to_srs_rule": "Each SRS requirement must reference at least one BRD-REQ id.",
    "srs_to_tests_rule": "Each SRS requirement must reference at least one TST id (placeholder allowed).",
    "notes": "Some requirements depend on blocking open questions; see open_questions."
  },
  "open_questions": [
    "OQ-001",
    "OQ-002",
    "OQ-003",
    "OQ-005",
    "OQ-006"
  ]
}
~~~
@@@FILE_END path="foundation_pack/SRS/traceable_requirements.json"@@@

@@@FILE_BEGIN path="foundation_pack/SRS/trd.json" type="json" sha256="dd3c1f6deb271a30aa0d80c22723f7a84eaad3be7dec71af0aedac83a9655f8a"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "SRS/trd.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "DESIGN",
    "adlc_state": "Final",
    "adlc_work_cnt": 3,
    "last_updated_utc": "2026-03-01T00:14:30Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft technical requirements/design. Hosting and stack depend on assumptions/open questions. | Phase 2: updated architecture notes using confirmed runtime approach."
  },
  "template_id": "DF.OUTPUT.SRS.TRD.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "DESIGN",
  "purpose": "Describe the intended technical architecture and hosting for the Gut–Brain Simulator web app in a build-ready way (without writing production code).",
  "architecture_overview": {
    "summary": "Client-first web app with deterministic simulation module and a thin persistence layer for runs/exports. Pilot dataset visualization is performed client-side from a bundled or uploaded CSV.",
    "components": [
      {
        "name": "UI (SPA/PWA)",
        "responsibilities": [
          "Pilot charts",
          "Simulator controls",
          "Rigor page",
          "Exports",
          "Help/Docs viewer"
        ],
        "notes": "assumption ASM-001"
      },
      {
        "name": "Simulation Engine",
        "responsibilities": [
          "Normalize diet inputs",
          "Run stage pipeline",
          "Return outputs + run_hash"
        ],
        "notes": "Confirmed OQ-001/OQ-002: frozen regression artifacts (JSON) and deterministic execution; supports loading replacement artifacts via hidden admin controls."
      },
      {
        "name": "Persistence (optional)",
        "responsibilities": [
          "Store runs, model versions, exports"
        ],
        "notes": "depends on auth/hosting decisions (OQ-003, ASM-001)."
      }
    ],
    "evidence": [
      {
        "source_id": "Project Plan.pdf",
        "loc": "L62-L68",
        "snippet": "This approach allows for simulation of how changes in diet propagate through biological systems  and influence cognitive outcomes. "
      },
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L186-L190",
        "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
      }
    ]
  },
  "hosting_choice": {
    "primary": "Lovable-hosted web app",
    "alternatives": [
      "Cloudflare Pages/Workers",
      "Local hosting on a laptop for offline judging"
    ],
    "notes": "Confirmed primary choice Lovable-hosted web app (ASM-001)."
  },
  "external_dependencies": [
    {
      "name": "Charts library",
      "choice": null,
      "notes": "cannot confirm; likely Recharts or similar."
    },
    {
      "name": "CSV parsing",
      "choice": null,
      "notes": "cannot confirm; choose a deterministic CSV parser."
    }
  ],
  "data_storage": {
    "choice": "Supabase/Postgres (optional)",
    "notes": "assumption ASM-001; can be omitted for fully client-side demo if persistence is not needed.",
    "schema_reference": "SRS/database_schema.json"
  },
  "ai_usage": {
    "runtime_ai": "None required at runtime; simulator uses frozen model artifacts (JSON) executed deterministically client-side or in a thin API layer.",
    "devtime_ai": "Agentic workflows (Cursor/Lovable prompts) with gates defined in SRS/agentic_prompt_gates.json.",
    "notes": "blocked by OQ-008 if evidence assistant is desired."
  },
  "ops_considerations": {
    "observability": "Basic client error logging and export failure reporting; no heavy telemetry required.",
    "backups": "If Supabase used, export runs/exports for backup.",
    "data_privacy": "Do not store PII; treat pilot dataset as sensitive even if de-identified.",
    "notes": "Minimal ops due to science-fair scope."
  }
}
~~~
@@@FILE_END path="foundation_pack/SRS/trd.json"@@@

@@@FILE_BEGIN path="foundation_pack/assumptions.json" type="json" sha256="4a0884661ea47317a54e7362c9e90091b829e43c6c99ad1f26d3f8f2b6cd4459"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "assumptions.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "INCEPTION",
    "adlc_state": "Final",
    "adlc_work_cnt": 2,
    "last_updated_utc": "2026-02-28T21:25:04Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 proposed assumptions to confirm or override. | Phase 2: confirmed ASM-001/002; edited ASM-006 with demo/public-deploy caveat."
  },
  "template_id": "DF.OUTPUT.ASSUMPTIONS.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "INCEPTION",
  "assumptions": [
    {
      "id": "ASM-001",
      "assumption": "The app will be implemented as a Lovable-hosted web app (Web + Desktop) with optional Mobile PWA support.",
      "why_needed": "Templates require a concrete platform target; many UI and NFR budgets depend on platform.",
      "impact": "Medium. If platform changes (e.g., Telegram mini-app), UI and hosting constraints change.",
      "blocks_progress": false,
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        }
      ],
      "status": "confirmed",
      "user_override": null
    },
    {
      "id": "ASM-002",
      "assumption": "Default deployment is 'kiosk/presenter mode' (no user login), with optional admin-only controls for uploading/replacing datasets.",
      "why_needed": "Science fair demos usually require immediate access without credentials; protects from accidental edits.",
      "impact": "Medium.",
      "blocks_progress": false,
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        }
      ],
      "status": "confirmed",
      "user_override": null
    },
    {
      "id": "ASM-003",
      "assumption": "All simulation outputs are deterministic for the same (inputs + model_version), and each run records a run_hash for reproducibility.",
      "why_needed": "Judge trust and scientific rigor; supports export reproducibility.",
      "impact": "High on credibility, low on scope.",
      "blocks_progress": false,
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L62-L68",
          "snippet": "This approach allows for simulation of how changes in diet propagate through biological systems  and influence cognitive outcomes. "
        }
      ],
      "status": "proposed",
      "user_override": null
    },
    {
      "id": "ASM-004",
      "assumption": "No personally identifiable information is stored. Pilot dataset remains de-identified numeric metrics only.",
      "why_needed": "Privacy posture for a teen dataset, and to avoid human-subjects compliance issues.",
      "impact": "High (compliance).",
      "blocks_progress": false,
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L135-L141",
          "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L137-L143",
          "snippet": "not for model training  Procedure  1. Download dietary intake data from NHANES and extract nutrient intake variables"
        },
        {
          "source_id": "Data Sheet 1.csv",
          "loc": "rows=66, cols=14",
          "snippet": "File contains 66 rows of pilot data with diet score and cognitive tests (Stroop, Language, Memory, Logical, Overall)."
        }
      ],
      "status": "proposed",
      "user_override": null
    },
    {
      "id": "ASM-005",
      "assumption": "The app includes a visible disclaimer: educational research prototype; not medical advice; not a diagnostic tool.",
      "why_needed": "Avoids medical/diagnostic overreach during judging and demos.",
      "impact": "Low on cost, high on risk reduction.",
      "blocks_progress": false,
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L62-L66",
          "snippet": "**App fix:** add an “Educational research prototype” label + a small disclaimer: *not medical advice; not a diagnostic device.* This is consistent with how consumer microbiome companies themselves pre"
        }
      ],
      "status": "proposed",
      "user_override": null
    },
    {
      "id": "ASM-006",
      "assumption": "The pilot dataset file provided (Data Sheet 1.csv) is allowed to be embedded in the app for demo purposes.",
      "why_needed": "If embedding is not allowed, app must upload at runtime, affecting hosting and demo flow.",
      "impact": "Medium.",
      "blocks_progress": false,
      "evidence": [
        {
          "source_id": "Data Sheet 1.csv",
          "loc": "rows=66, cols=14",
          "snippet": "File contains 66 rows of pilot data with diet score and cognitive tests (Stroop, Language, Memory, Logical, Overall)."
        }
      ],
      "status": "edited",
      "user_override": "Bundle the de-identified pilot CSV for the offline judging build, but also support upload-at-runtime and include a note to remove bundled data for any public deployment."
    }
  ]
}
~~~
@@@FILE_END path="foundation_pack/assumptions.json"@@@

@@@FILE_BEGIN path="foundation_pack/docs_index.json" type="json" sha256="02be61fd1507e157eb4af47812e8ff790e823128287a4e1fd115094eaded99ac"@@@
~~~json
{
  "schema_version": "cognibiome.docs_index.v1",
  "generated_utc": "2026-03-01T00:12:29Z",
  "items": [
    {
      "id": "DOC-001",
      "title": "User Requirements (UR)",
      "path": "/foundation_pack/user_requirements.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Primary user-level scope and acceptance criteria."
    },
    {
      "id": "DOC-002",
      "title": "BRD",
      "path": "/foundation_pack/BRD/brd.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Business requirements and success metrics."
    },
    {
      "id": "DOC-003",
      "title": "SRS Requirements (Traceable)",
      "path": "/foundation_pack/SRS/traceable_requirements.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Functional and non-functional requirements with traceability."
    },
    {
      "id": "DOC-004",
      "title": "GUI Spec",
      "path": "/foundation_pack/SRS/gui_spec.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Screens and flows for judge walkthrough."
    },
    {
      "id": "DOC-005",
      "title": "Database Schema",
      "path": "/foundation_pack/SRS/database_schema.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Entities and relationships."
    },
    {
      "id": "DOC-006",
      "title": "Data Contracts",
      "path": "/foundation_pack/SRS/data_contracts.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Ingestion and internal data shapes."
    },
    {
      "id": "DOC-007",
      "title": "NFR Budgets",
      "path": "/foundation_pack/SRS/nfr_budgets.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Performance budgets for demo reliability."
    },
    {
      "id": "DOC-008",
      "title": "Test Plan & CI",
      "path": "/foundation_pack/SRS/test_plan_and_ci.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Test cases and CI commands."
    },
    {
      "id": "DOC-009",
      "title": "Agentic Prompt Gates",
      "path": "/foundation_pack/SRS/agentic_prompt_gates.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Prompt-level guardrails for automation."
    },
    {
      "id": "DOC-010",
      "title": "Technical Requirements (TRD)",
      "path": "/foundation_pack/SRS/trd.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Implementation guidance and constraints."
    },
    {
      "id": "DOC-011",
      "title": "Assumptions",
      "path": "/foundation_pack/assumptions.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Assumptions to revisit and validate."
    },
    {
      "id": "DOC-012",
      "title": "Open Questions",
      "path": "/foundation_pack/open_questions.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Unknowns and blockers tracking."
    },
    {
      "id": "DOC-013",
      "title": "Questionnaire Answers",
      "path": "/foundation_pack/user_questionnaire_answers.json",
      "category": "Foundation",
      "media_type": "application/json",
      "description": "Answered questionnaire to ground requirements."
    },
    {
      "id": "DOC-014",
      "title": "Pilot Dataset (n=66)",
      "path": "/pilot/pilot_dataset_n66.csv",
      "category": "Data",
      "media_type": "text/csv",
      "description": "De-identified pilot dataset used for dashboard validation."
    },
    {
      "id": "DOC-015",
      "title": "External Sources Overview",
      "path": "/external_sources_for_Gut_overview.txt",
      "category": "Reference",
      "media_type": "text/plain",
      "description": "Source list used for evidence and background."
    },
    {
      "id": "DOC-016",
      "title": "Reference Data Build Notes",
      "path": "/reference/README_data_build.md",
      "category": "Reference",
      "media_type": "text/markdown",
      "description": "How reference snapshots were prepared."
    },
    {
      "id": "DOC-017",
      "title": "References & Licenses",
      "path": "/reference/REFERENCES_AND_LICENSES.md",
      "category": "Reference",
      "media_type": "text/markdown",
      "description": "Licenses and attribution notes for reference snapshots."
    },
    {
      "id": "DOC-018",
      "title": "Upload Manifest (SHA256)",
      "path": "/UPLOAD_FILES_MANIFEST.md",
      "category": "Reference",
      "media_type": "text/markdown",
      "description": "Integrity list of uploaded artifacts with hashes."
    }
  ]
}
~~~
@@@FILE_END path="foundation_pack/docs_index.json"@@@

@@@FILE_BEGIN path="foundation_pack/open_questions.json" type="json" sha256="52796fff9331647f5176295b429602e00916fbee5b94df49120e6f3b29956292"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "open_questions.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "INCEPTION",
    "adlc_state": "Final",
    "adlc_work_cnt": 2,
    "last_updated_utc": "2026-02-28T21:25:04Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft. Blocking questions prevent READY_FOR_BUILD. | Phase 2: applied user answers/confirmations; closed blocking questions OQ-001/002/003/005/006."
  },
  "template_id": "DF.OUTPUT.OPEN_QUESTIONS.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "INCEPTION",
  "questions": [
    {
      "id": "OQ-001",
      "question": "What is the exact runtime modeling approach for the simulator stages (diet→microbiome, microbiome→metabolites, metabolites→cognition): pre-trained ML models, lookup tables, or heuristic rules?",
      "context": "This determines whether the app can produce numeric predictions, how determinism is enforced, and what model artifacts must be bundled or hosted.",
      "options_if_any": [
        "Option A: Bundle fixed, pre-trained model artifacts (recommended for judge-ready reproducibility).",
        "Option B: Use fixed lookup tables / parameterized curves calibrated from training outputs.",
        "Option C: Use simple directional/qualitative rules only (lowest effort, weakest scientific impact)."
      ],
      "impact": "High. Affects app credibility, implementation complexity, and schema/contracts for runs + model versioning.",
      "blocks_progress": false,
      "depends_on_requirement_ids": [
        "UR-003",
        "UR-006",
        "UR-009",
        "UR-012"
      ],
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L58-L64",
          "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L62-L68",
          "snippet": "This approach allows for simulation of how changes in diet propagate through biological systems  and influence cognitive outcomes. "
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L186-L190",
          "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
        }
      ],
      "status": "answered",
      "resolution": "Use pre-trained supervised regression models trained offline in Python (scikit-learn, gradient boosting). At runtime, execute frozen deterministic model artifacts stored as JSON (either coefficient tables or compact GBDT/tree representation)."
    },
    {
      "id": "OQ-002",
      "question": "Do you already have trained model artifacts (files) for each stage? If yes, provide file names/formats (e.g., sklearn pickle, ONNX, JSON coefficients) and where they should live (client bundle vs Supabase storage).",
      "context": "Without real artifacts, the simulator output must be placeholder or rule-based, which changes scope.",
      "options_if_any": [],
      "impact": "High. Determines if outputs are numeric and whether the app can be 'judge-ready' without placeholder data.",
      "blocks_progress": false,
      "depends_on_requirement_ids": [
        "UR-003",
        "UR-006",
        "UR-012"
      ],
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L58-L64",
          "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
        }
      ],
      "status": "answered",
      "resolution": "Cannot confirm final artifacts exist today. Phase-2 decision: ship bundled demo artifacts so the app works offline, and provide 'Load model artifact' controls to replace them when final training is completed. Recommended locations: /public/models/stage1_D_to_X.json, /public/models/stage2_X_to_M.json, /public/models/stage3_M_to_Y.json (each includes version, notes, and coefficients/trees; UI displays model hash/version)."
    },
    {
      "id": "OQ-003",
      "question": "Should the app run without login (kiosk/presenter mode) or require authentication (e.g., to protect de-identified pilot data and prevent edits)?",
      "context": "Impacts database schema (users, roles), UI flows, and deployment configuration.",
      "options_if_any": [
        "No login (kiosk mode)",
        "Simple password for admin actions only",
        "Full auth (Supabase auth / email)"
      ],
      "impact": "Medium-High. Changes core flows and storage security posture.",
      "blocks_progress": false,
      "depends_on_requirement_ids": [
        "UR-001",
        "UR-004",
        "UR-008"
      ],
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        },
        {
          "source_id": "Data Sheet 1.csv",
          "loc": "rows=66, cols=14",
          "snippet": "File contains 66 rows of pilot data with diet score and cognitive tests (Stroop, Language, Memory, Logical, Overall)."
        }
      ],
      "status": "answered",
      "resolution": "Default is no-login kiosk/presenter mode for judging. Optional hidden admin controls (e.g., load artifacts / load pilot CSV) behind a local-only toggle (URL param or secret click). No full authentication in MVP."
    },
    {
      "id": "OQ-004",
      "question": "Should diet input be manual nutrient sliders only, or also support food search via USDA FoodData Central (requires API key)?",
      "context": "Food lookup adds UX value but adds integration + key management.",
      "options_if_any": [
        "Manual nutrients only (default)",
        "Manual + FoodData Central lookup"
      ],
      "impact": "Medium. Changes integrations and UI complexity.",
      "blocks_progress": false,
      "depends_on_requirement_ids": [
        "UR-002",
        "UR-003"
      ],
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L125-L131",
          "snippet": "○ NHANES dietary intake datasets for nutrient intake variables  ○ USDA Food and Nutrient Database for nutrient definition standardization and  nutrient mapping"
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L73-L77",
          "snippet": "**FoodData Central provides an API guide and API key signup, enabling programmatic nutrient lookup for foods, which is ideal for a Lovable front-en"
        }
      ],
      "status": "open",
      "resolution": null
    },
    {
      "id": "OQ-005",
      "question": "How should the pilot dataset be handled in the app: bundled as a built-in dataset, or user-uploaded at runtime?",
      "context": "Bundling improves demo reliability; upload improves privacy and flexibility.",
      "options_if_any": [
        "Bundled dataset (read-only)",
        "Upload at runtime",
        "Both (bundle default + allow replace)"
      ],
      "impact": "Medium. Impacts storage and demo readiness.",
      "blocks_progress": false,
      "depends_on_requirement_ids": [
        "UR-006",
        "UR-007"
      ],
      "evidence": [
        {
          "source_id": "Data Sheet 1.csv",
          "loc": "rows=66, cols=14",
          "snippet": "File contains 66 rows of pilot data with diet score and cognitive tests (Stroop, Language, Memory, Logical, Overall)."
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L186-L190",
          "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
        }
      ],
      "status": "answered",
      "resolution": "Support both: bundle a read-only pilot dataset for reliable offline demo AND allow upload-at-runtime to replace/remove the dataset for any public deployment. Pilot dataset remains validation-only (not used for training)."
    },
    {
      "id": "OQ-006",
      "question": "What exact outputs and units should each stage display (microbiome taxa list, metabolite list, cognition metrics and scales)?",
      "context": "The project plan names examples (SCFAs; serotonin/dopamine/GABA-related metabolites; Stroop/memory/language/logical). The UI must be consistent and not overclaim.",
      "options_if_any": [],
      "impact": "High. Controls UI fields, schema, and exports.",
      "blocks_progress": false,
      "depends_on_requirement_ids": [
        "UR-003",
        "UR-006",
        "UR-012"
      ],
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L125-L131",
          "snippet": "○ NHANES dietary intake datasets for nutrient intake variables  ○ USDA Food and Nutrient Database for nutrient definition standardization and  nutrient mapping"
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L58-L64",
          "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
        }
      ],
      "status": "answered",
      "resolution": "Define MVP outputs/units: Diet inputs: fiber (g/day), added sugar (g/day), saturated fat (g/day), omega-3 proxy/PUFA (g/day), optional calories. Microbiome outputs: Bifidobacterium (0–1 or %), Lactobacillus (0–1 or %), Firmicutes:Bacteroidetes ratio (unitless). Metabolites: acetate/propionate/butyrate (standardized z-score or low/medium/high bins), plus 5-HTP precursor index (standardized). Cognition: modeled predicted Stroop, memory recall, language accuracy, logical reasoning, and overall composite (same scale as pilot or percentile), all labeled MODELED/proxy; pilot charts show actual scores from CSV."
    },
    {
      "id": "OQ-007",
      "question": "Export format requirement: PDF, HTML, or both? Any required branding (school, fair name, title page)?",
      "context": "The MD suggests PDF/HTML 1-page export; branding requirements are not specified.",
      "options_if_any": [
        "HTML only",
        "PDF only",
        "Both (default)"
      ],
      "impact": "Medium. Affects implementation complexity.",
      "blocks_progress": false,
      "depends_on_requirement_ids": [
        "UR-010"
      ],
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L136-L140",
          "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
        },
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        }
      ],
      "status": "open",
      "resolution": null
    },
    {
      "id": "OQ-008",
      "question": "Should the app include an 'Evidence Library' panel with curated 2025+ citations, or keep evidence as static text in Methods & Rigor?",
      "context": "Evidence library boosts judge confidence but adds content management work.",
      "options_if_any": [
        "Static Methods & Rigor only",
        "Evidence Library with curated citations (recommended)"
      ],
      "impact": "Low-Medium.",
      "blocks_progress": false,
      "depends_on_requirement_ids": [
        "UR-011"
      ],
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L1-L40",
          "snippet": "Document proposes adding 2025–2026 citations and an in-app Evidence panel."
        }
      ],
      "status": "open",
      "resolution": null
    },
    {
      "id": "OQ-009",
      "question": "Do you want a 'Judge Walkthrough / Presenter Mode' that hides advanced controls and guarantees a clean demo in <2 minutes?",
      "context": "Useful for live judging.",
      "options_if_any": [
        "Yes",
        "No"
      ],
      "impact": "Medium. Changes UX flows and screen design.",
      "blocks_progress": false,
      "depends_on_requirement_ids": [
        "UR-004",
        "UR-005"
      ],
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        }
      ],
      "status": "open",
      "resolution": null
    },
    {
      "id": "OQ-010",
      "question": "What are the concrete success metrics for this app at the STEM Showcase (e.g., time-to-demo, number of exports, judge comprehension outcomes)?",
      "context": "The questionnaire requires a measurable success metric; the current sources only state the goal of winning and being judge-ready.",
      "options_if_any": [
        "Demo readiness only (qualitative)",
        "Quantitative: load time, error-free exports, # successful demo runs"
      ],
      "impact": "Low-Medium. Helps prioritize engineering tradeoffs (performance vs features).",
      "blocks_progress": false,
      "depends_on_requirement_ids": [
        "UR-013"
      ],
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        }
      ],
      "status": "open",
      "resolution": null
    }
  ]
}
~~~
@@@FILE_END path="foundation_pack/open_questions.json"@@@

@@@FILE_BEGIN path="foundation_pack/user_questionnaire_answers.json" type="json" sha256="cd5cde498329abc4297ebb08c7c1ce91c8f1e77aa62a70b79ab5fbbd00cb206e"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "user_questionnaire_answers.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "INCEPTION",
    "adlc_state": "Final",
    "adlc_work_cnt": 2,
    "last_updated_utc": "2026-02-28T21:25:04Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft questionnaire answers derived from provided project documents. Line numbers for PDFs refer to extracted text lines. | Phase 2: incorporated confirmations; remaining unknowns are non-blocking."
  },
  "template_id": "DF.TEMPLATE.PACK.USER_QUESTIONNAIRE_ANSWERS.JSON.V1",
  "template_version": "2026-02-28",
  "template_kind": "artifact_template",
  "phase": "INCEPTION",
  "mode": "standardize_existing_app",
  "sources": [
    {
      "source_id": "prompt_to_create_gut_brd_srs.txt",
      "sha256": "6c089d663b1339cb032e90477bfe5ddc265ee877f4d5e67d877478586d597083",
      "notes": ""
    },
    {
      "source_id": "Yana_Gut_Package_for_Stem_Showcase.zip",
      "sha256": "cb02a0400e86cbb139714e5fd5f3be89895dbdfbe389b59f5a8629c725f28ab8",
      "notes": ""
    },
    {
      "source_id": "foundation_docs.zip",
      "sha256": "e8ff0300233f74315cdec43272468ea8f2c82430bf352348e1227d3c3d28e34b",
      "notes": ""
    },
    {
      "source_id": "Project Plan.pdf",
      "sha256": "09c0ff5f2c0a13465c409c22543426108e073b63ed646dd733b82d943582299e",
      "notes": ""
    },
    {
      "source_id": "Project Abstract.pdf",
      "sha256": "bb53f4b86ba7f1f17e78c2b349a626e1e5cd9b036dfd464881f407a536dd24e8",
      "notes": ""
    },
    {
      "source_id": "Student Checklist 1A - Checklist Research Plan.pdf",
      "sha256": "8162f9de2f6049acee7e1ba185954b09c2639b53ec65243432b269428c8b28e7",
      "notes": ""
    },
    {
      "source_id": "ISEF Form 7 - Continuation Projects.pdf",
      "sha256": "b9b16b19cd391dd2addb4feb516d6e9bb1b973819800ae54188bada45c9a8c5a",
      "notes": ""
    },
    {
      "source_id": "Data Sheet 1.csv",
      "sha256": "1da31235481832fb30a63566bc56b2afe7aaa5dbe1cc75f60d6e620459a63c67",
      "notes": ""
    },
    {
      "source_id": "Yana Gut project - MultimodalText Deep Research A Judge-Ready Diet-Microbiome-Metabolites-Cognition Simulator App.md",
      "sha256": "39d1d4356a95cb8ddcf6045d358fe5e9dcc433aa983f53666991223119aaeb22",
      "notes": ""
    }
  ],
  "answers": [
    {
      "question_id": "Q00",
      "value": "A judge-ready Gut–Brain Simulator web app for the project “Modeling Diet-Driven Microbiome and Neurotransmitter Pathways Influencing Cognitive Performance”. Users adjust diet inputs and see simulated microbiome shifts, metabolite proxies, and cognitive performance signals, plus real pilot (n=66) validation plots and 1-page export reports.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L5-L11",
          "snippet": "Modeling Diet-Driven Microbiome and Neurotransmitter Pathways"
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L62-L68",
          "snippet": "This approach allows for simulation of how changes in diet propagate through biological systems  and influence cognitive outcomes. "
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L186-L190",
          "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L136-L140",
          "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
        }
      ],
      "notes": ""
    },
    {
      "question_id": "Q01",
      "value": "Enable Yana to demonstrate a transparent, reproducible diet→microbiome→metabolites→cognition simulation with clear anti-leakage guardrails and an exportable 1-page judge report.",
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L58-L64",
          "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L136-L140",
          "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
        }
      ],
      "notes": ""
    },
    {
      "question_id": "Q02",
      "value": "Primary user: Yana (student presenter) demonstrating to STEM Showcase judges; secondary users: teacher/mentor and curious viewers.",
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        }
      ],
      "notes": ""
    },
    {
      "question_id": "Q03",
      "value": "Communicating the mechanistic pathway and scientific rigor is hard with static slides. A live simulator + real pilot validation charts reduce judge skepticism and make the project easier to understand quickly.",
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L62-L68",
          "snippet": "This approach allows for simulation of how changes in diet propagate through biological systems  and influence cognitive outcomes. "
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L186-L190",
          "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
        }
      ],
      "notes": ""
    },
    {
      "question_id": "Q04",
      "value": null,
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        }
      ],
      "notes": "Still not fully specified; see OQ-010."
    },
    {
      "question_id": "Q05",
      "value": [
        "Pilot dataset viewer: load the n=66 de-identified teen dataset CSV and generate charts/tables.",
        "Simulator: diet inputs → predicted microbiome → predicted metabolite proxies → predicted cognition outputs.",
        "Methods & Rigor: leakage guardrails + limitations + disclaimers.",
        "Export: generate a 1-page report (PDF/HTML) for a run."
      ],
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L186-L190",
          "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L136-L140",
          "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L137-L143",
          "snippet": "not for model training  Procedure  1. Download dietary intake data from NHANES and extract nutrient intake variables"
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L62-L66",
          "snippet": "**App fix:** add an “Educational research prototype” label + a small disclaimer: *not medical advice; not a diagnostic device.* This is consistent with how consumer microbiome companies themselves pre"
        }
      ],
      "notes": ""
    },
    {
      "question_id": "Q06",
      "value": [
        "No medical diagnosis or treatment recommendations.",
        "No collection of new human subject data (no surveys, no stool samples).",
        "No live training of large multi-omics ML models inside the app."
      ],
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L185-L191",
          "snippet": "chemicals, or biological agents. No new human participants are recruited. All training datasets  are publicly available and fully de-identified. The only human-related data used consist of  de-identif"
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L62-L66",
          "snippet": "**App fix:** add an “Educational research prototype” label + a small disclaimer: *not medical advice; not a diagnostic device.* This is consistent with how consumer microbiome companies themselves pre"
        }
      ],
      "notes": ""
    },
    {
      "question_id": "Q07",
      "value": [
        "Must remain consistent with a computational project using public de-identified datasets and a separate de-identified teen pilot validation dataset (not used for training).",
        "Must be ready for live STEM Showcase judging and avoid language implying causality/proof.",
        "Must keep data de-identified."
      ],
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L135-L141",
          "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L137-L143",
          "snippet": "not for model training  Procedure  1. Download dietary intake data from NHANES and extract nutrient intake variables"
        }
      ],
      "notes": ""
    },
    {
      "question_id": "Q08",
      "value": [
        "Diet scenario inputs (nutrient variables such as fiber, added sugar/total sugar, saturated fat, omega-3/polyunsaturated fat proxies).",
        "Pilot dataset CSV upload/selection (de-identified numeric diet score + cognitive test metrics)."
      ],
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L125-L131",
          "snippet": "○ NHANES dietary intake datasets for nutrient intake variables  ○ USDA Food and Nutrient Database for nutrient definition standardization and  nutrient mapping"
        },
        {
          "source_id": "Data Sheet 1.csv",
          "loc": "rows=66, cols=14",
          "snippet": "File contains 66 rows of pilot data with diet score and cognitive tests (Stroop, Language, Memory, Logical, Overall)."
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L135-L141",
          "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
        }
      ],
      "notes": ""
    },
    {
      "question_id": "Q09",
      "value": [
        "Interactive charts/tables for pilot dataset results (diet score vs cognitive tests).",
        "Simulator outputs for microbiome/metabolite/cognition layers (with clear 'modeled/proxy' labeling).",
        "Exportable 1-page report (PDF/HTML)."
      ],
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L186-L190",
          "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L136-L140",
          "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
        }
      ],
      "notes": ""
    },
    {
      "question_id": "Q10",
      "value": null,
      "evidence": [],
      "notes": "Optional: FoodData Central lookup can be added; requires API key (OQ-004)."
    },
    {
      "question_id": "Q11",
      "value": [
        "Web",
        "Desktop",
        "MobilePWA"
      ],
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        }
      ],
      "notes": "Confirmed (ASM-001)."
    },
    {
      "question_id": "Q12",
      "value": [
        "Flow 1 (Judge walkthrough): open app → Pilot Results (n=66) → Methods & Rigor → run a Simulator scenario → Export 1-page report.",
        "Flow 2 (Data check): upload/select pilot CSV → verify summary stats → view correlation plots → export pilot summary.",
        "Flow 3 (Scenario exploration): adjust diet inputs → compare two scenarios → inspect microbiome/metabolite proxy differences → export comparison."
      ],
      "evidence": [
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L186-L190",
          "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
        },
        {
          "source_id": "MultimodalText Deep Research.md",
          "loc": "L136-L140",
          "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
        }
      ],
      "notes": ""
    },
    {
      "question_id": "Q13",
      "value": [
        "Overclaiming mechanism/medical inference during judging.",
        "Lack of available model artifacts for numeric simulation outputs.",
        "Confusion about data leakage and cross-dataset integration."
      ],
      "evidence": [
        {
          "source_id": "Project Plan.pdf",
          "loc": "L135-L141",
          "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L137-L143",
          "snippet": "not for model training  Procedure  1. Download dietary intake data from NHANES and extract nutrient intake variables"
        }
      ],
      "notes": ""
    },
    {
      "question_id": "Q14",
      "value": [
        "FoodData Central integration decision (OQ-004).",
        "Export format requirement and branding (OQ-007).",
        "Evidence Library panel vs static text (OQ-008).",
        "Presenter Mode preference details (OQ-009).",
        "Concrete success metrics targets (OQ-010)."
      ],
      "evidence": [
        {
          "source_id": "prompt_to_create_gut_brd_srs.txt",
          "loc": "L1-L2",
          "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L58-L64",
          "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
        },
        {
          "source_id": "Project Plan.pdf",
          "loc": "L135-L141",
          "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
        }
      ],
      "notes": "Blocking questions resolved; remaining open questions are non-blocking."
    }
  ]
}
~~~
@@@FILE_END path="foundation_pack/user_questionnaire_answers.json"@@@

@@@FILE_BEGIN path="foundation_pack/user_requirements.json" type="json" sha256="84d109f300dd8f246c801acca2a55549d7086004f7af62bd9b6a86d07ee5cd92"@@@
~~~json
{
  "meta": {
    "schema_version": "adlc_meta.v1",
    "canonical_path": "user_requirements.json",
    "owner": "HPO",
    "maintainer": "APO",
    "adlc_product": "DARKFACTORY",
    "adlc_category": "Artifact",
    "adlc_phase": "INCEPTION",
    "adlc_state": "Final",
    "adlc_work_cnt": 3,
    "last_updated_utc": "2026-03-01T00:12:29Z",
    "last_editor": "chatgpt",
    "last_writer": "bot",
    "notes": "Phase 1 draft. HPO MUST approve user_requirements.json before BRD/SRS are treated as READY_FOR_BUILD. | Phase 2: updated requirements using answered OQs; removed blocking unknowns."
  },
  "template_id": "DF.OUTPUT.USER_REQUIREMENTS.JSON.V2",
  "template_version": "2026-02-28",
  "template_kind": "artifact",
  "phase": "INCEPTION",
  "gates": [
    {
      "gate_id": "GATE.HPO.APPROVE.USER_REQUIREMENTS",
      "blocking": true,
      "what_must_be_true": [
        "HPO explicitly approves user_requirements.json before any BRD or SRS is treated as ready.",
        "Approval is recorded with date and hash."
      ],
      "evidence_path": "00_admin/APPROVALS/HPO_SIGNOFF.md"
    }
  ],
  "business_idea": {
    "summary": "Judge-ready Gut–Brain Simulator web app that demonstrates a computational pipeline from diet to predicted microbiome changes to metabolite proxies to cognitive performance signals, and validates with a de-identified teen pilot dataset (n=66).",
    "evidence": [
      {
        "source_id": "Project Plan.pdf",
        "loc": "L5-L11",
        "snippet": "Modeling Diet-Driven Microbiome and Neurotransmitter Pathways"
      },
      {
        "source_id": "Project Plan.pdf",
        "loc": "L58-L64",
        "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
      },
      {
        "source_id": "Project Plan.pdf",
        "loc": "L135-L141",
        "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
      },
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L186-L190",
        "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
      }
    ]
  },
  "goal": {
    "statement": "Make it easy for judges to understand and trust the project’s mechanistic simulation and pilot validation within a short live demo, with reproducible exports.",
    "evidence": [
      {
        "source_id": "prompt_to_create_gut_brd_srs.txt",
        "loc": "L1-L2",
        "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
      },
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L136-L140",
        "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
      }
    ]
  },
  "primary_user": {
    "role": "High school student presenter (Yana) demonstrating to STEM Showcase judges.",
    "context": "Live demo during science fair judging; needs a stable, low-friction walkthrough.",
    "constraints": [
      "No new human subjects; pilot dataset is de-identified and validation-only.",
      "Avoid medical/diagnostic claims."
    ],
    "evidence": [
      {
        "source_id": "prompt_to_create_gut_brd_srs.txt",
        "loc": "L1-L2",
        "snippet": "Review the attachments to create brd/src pack as defined in the brd_srs_packs.zip and to improve the GUT app prompt for lovable to create this application. The created brd/src foundation documentation"
      },
      {
        "source_id": "Project Plan.pdf",
        "loc": "L135-L141",
        "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
      },
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L62-L66",
        "snippet": "**App fix:** add an “Educational research prototype” label + a small disclaimer: *not medical advice; not a diagnostic device.* This is consistent with how consumer microbiome companies themselves pre"
      }
    ]
  },
  "problem_statement": {
    "current_state": "Most gut–brain studies (and student projects) are judged as correlational; it is hard to communicate intermediate biological mechanisms and ML rigor quickly during judging.",
    "desired_state": "A transparent simulator dashboard that shows the multi-stage pipeline, real pilot validation charts, and explicit leakage/limitation guardrails.",
    "evidence": [
      {
        "source_id": "Project Plan.pdf",
        "loc": "L58-L64",
        "snippet": "datasets are rarely integrated into a unified biological framework. This project uses a multi-stage  machine learning approach to explicitly model the biological sequence linking diet to cognition.  I"
      },
      {
        "source_id": "Project Plan.pdf",
        "loc": "L62-L68",
        "snippet": "This approach allows for simulation of how changes in diet propagate through biological systems  and influence cognitive outcomes. "
      },
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L186-L190",
        "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
      }
    ]
  },
  "success_metrics": {
    "metrics": [
      {
        "metric": "Demo reliability",
        "target": null,
        "unit": null,
        "notes": "cannot confirm; define measurable success metrics for the showcase (see OQ-010)."
      },
      {
        "metric": "Time-to-insight for judge walkthrough",
        "target": 120,
        "unit": "seconds",
        "notes": "assumption; adjust if you have a different target."
      },
      {
        "metric": "Export success rate during demo",
        "target": 0.99,
        "unit": "fraction",
        "notes": "assumption; adjust if you prefer a different metric."
      }
    ],
    "evidence": [
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L136-L140",
        "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
      },
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L186-L190",
        "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
      }
    ]
  },
  "scope": {
    "in_scope": [
      "Pilot dataset visualization (n=66): summary stats + charts + correlations.",
      "Simulator: diet inputs → modeled microbiome → modeled metabolites → modeled cognition.",
      "Methods & Rigor: leakage guardrails, limitations, and disclaimers.",
      "Export: 1-page report (PDF/HTML) for a run."
    ],
    "out_of_scope": [
      "Medical diagnosis, treatment, or personalized clinical guidance.",
      "Collecting new human subject data (surveys, stool samples, etc.).",
      "Live re-training of large multi-omics models in the app."
    ],
    "evidence": [
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L186-L190",
        "snippet": "- **Pilot Results (n=66)**: upload/select the real CSV → auto-generate charts and a clean summary table.   - **Simulator**: nutrient inputs (manual or FoodData Central lookup) → predicted microbiome s"
      },
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L136-L140",
        "snippet": "Your “Export 1-page report (PDF/HTML)” should include: - Inputs (diet features),"
      },
      {
        "source_id": "MultimodalText Deep Research.md",
        "loc": "L62-L66",
        "snippet": "**App fix:** add an “Educational research prototype” label + a small disclaimer: *not medical advice; not a diagnostic device.* This is consistent with how consumer microbiome companies themselves pre"
      },
      {
        "source_id": "Project Plan.pdf",
        "loc": "L135-L141",
        "snippet": "○ De-identified 2025 student dataset containing only numeric diet quality scores and  cognitive performance metrics, used solely for validation and benchmarking and  not for model training"
      }
    ]
  },
  "platforms": {
    "targets": [
      "Web",
      "Desktop",
      "MobilePWA"
    ],
    "notes": "Confirmed via ASM-001."
  },
  "user_flows": [
    {
      "id": "FLOW-01",
      "name": "Judge walkthrough",
      "steps": [
        "Open app (kiosk/presenter mode).",
        "Show Pilot Results (n=66) charts/tables.",
        "Show Methods & Rigor (limitations + leakage guardrails + disclaimer).",
        "Run a Simulator scenario with diet inputs.",
        "Generate/export 1-page report."
      ]
    },
    {
      "id": "FLOW-02",
      "name": "Pilot dataset check",
      "steps": [
        "Upload/select pilot CSV.",
        "Validate column mapping and row count.",
        "Compute summary stats and correlations.",
        "Export pilot summary."
      ]
    },
    {
      "id": "FLOW-03",
      "name": "Scenario comparison",
      "steps": [
        "Create Scenario A diet inputs.",
        "Create Scenario B diet inputs.",
        "Compare predicted microbiome/metabolite/cognition outputs side-by-side.",
        "Export comparison."
      ]
    }
  ],
  "requirements": [
    {
      "id": "UR-001",
      "statement": "The app must support a low-friction 'kiosk/presenter mode' suitable for live judging (no login by default).",
      "priority": "MUST",
      "rationale": "Reduces demo friction and risk of authentication failures during judging.",
      "acceptance_criteria": [
        "Opening the app lands on the main dashboard without authentication prompts.",
        "Admin actions (if any) are protected separately (password or hidden toggle)."
      ],
      "notes": "Confirmed by OQ-003: kiosk/presenter mode by default; optional hidden admin controls."
    },
    {
      "id": "UR-002",
      "statement": "The app must allow users to define a diet scenario using explicit nutrient variables relevant to the project (e.g., fiber, sugar, saturated fat, omega-3/polyunsaturated fat proxy).",
      "priority": "MUST",
      "rationale": "These inputs drive the simulator pipeline.",
      "acceptance_criteria": [
        "Diet scenario inputs include numeric controls for: fiber_g_per_day, added_sugar_g_per_day, saturated_fat_g_per_day, omega3_proxy_g_per_day.",
        "Optional input calories_kcal_per_day can be enabled.",
        "UI validates ranges and missing values with clear error messages."
      ],
      "notes": "Confirmed by OQ-006 (exact MVP inputs/units)."
    },
    {
      "id": "UR-003",
      "statement": "The app must run a deterministic, multi-stage simulation pipeline: diet → microbiome composition → metabolite proxies → cognition outputs.",
      "priority": "MUST",
      "rationale": "This is the core scientific contribution and demonstration.",
      "acceptance_criteria": [
        "The simulator runs three sequential stages and returns structured outputs for microbiome, metabolites, and cognition.",
        "Simulation uses frozen, versioned model artifacts (JSON coefficients/trees) and is deterministic for the same (inputs + model_version_ids).",
        "UI displays model version identifiers and run_hash for every run."
      ],
      "notes": "Resolved by OQ-001 and OQ-002; artifacts are expected under /public/models/*.json."
    },
    {
      "id": "UR-004",
      "statement": "The app must contain a judge-readable 'Methods & Rigor' section that explains limitations, leakage guardrails, and non-diagnostic disclaimer.",
      "priority": "MUST",
      "rationale": "Prevents overclaiming and addresses judge concerns.",
      "acceptance_criteria": [
        "Methods & Rigor includes: 'validation-only pilot dataset' statement, leakage definition, and 'not medical advice / not diagnostic' disclaimer.",
        "The text avoids 'proves' language and uses 'simulates' / 'hypothesis generator' framing."
      ],
      "notes": "see ASM-005."
    },
    {
      "id": "UR-005",
      "statement": "The app should include a 'Judge Walkthrough' or 'Presenter Mode' that guides a 2-minute demo.",
      "priority": "SHOULD",
      "rationale": "Maximizes clarity under time pressure.",
      "acceptance_criteria": [
        "Presenter Mode highlights the minimal set of screens and hides advanced settings.",
        "Presenter Mode can be reset to a known state."
      ],
      "notes": "see OQ-009."
    },
    {
      "id": "UR-006",
      "statement": "The app must visualize the de-identified teen pilot dataset (n=66) with real charts and tables (no synthetic data).",
      "priority": "MUST",
      "rationale": "Provides real validation evidence supporting the project.",
      "acceptance_criteria": [
        "App can load a bundled read-only pilot dataset and shows row count = 66.",
        "App supports upload-at-runtime to replace/remove pilot dataset for non-demo deployments.",
        "Pilot dataset is labeled 'validation-only' and is never used for simulator training."
      ],
      "notes": "Resolved by OQ-005; ASM-006 edited with demo/public-deploy caveat."
    },
    {
      "id": "UR-007",
      "statement": "The app must compute and display basic statistics for the pilot dataset (summary stats and correlation/regression signals).",
      "priority": "MUST",
      "rationale": "Judges expect quantitative analysis, not only visuals.",
      "acceptance_criteria": [
        "App shows at least: mean/median for Diet Score and each cognitive metric.",
        "App shows correlation coefficient between Diet Score and each cognitive metric."
      ],
      "notes": "exact statistical methods can be simple; avoid overclaiming causality."
    },
    {
      "id": "UR-008",
      "statement": "The app must not collect or store personally identifiable information, and must label the pilot dataset as de-identified.",
      "priority": "MUST",
      "rationale": "Compliance and privacy protection for teen data.",
      "acceptance_criteria": [
        "No UI fields request names/emails/phones for pilot data.",
        "Stored records contain numeric metrics only."
      ],
      "notes": "see ASM-004."
    },
    {
      "id": "UR-009",
      "statement": "The app must show model provenance: model version identifiers and a run identifier (hash) for each simulation run.",
      "priority": "MUST",
      "rationale": "Reproducibility and scientific rigor.",
      "acceptance_criteria": [
        "UI displays model_version_ids used for the run (stage1/stage2/stage3).",
        "UI displays a stable run_hash computed from normalized inputs + model_version_ids.",
        "If the user loads a different artifact file, the model_version_id and artifact hash change and are reflected in subsequent runs/exports."
      ],
      "notes": "Aligned with OQ-002 recommended artifact paths and provenance display."
    },
    {
      "id": "UR-010",
      "statement": "The app must generate an exportable 1-page report (PDF/HTML) containing inputs, outputs, pilot validation visuals, and key disclaimers.",
      "priority": "MUST",
      "rationale": "Judges value a take-home artifact and it reinforces reproducibility.",
      "acceptance_criteria": [
        "Export includes: diet inputs, stage outputs, pilot charts/tables, leakage guardrails, disclaimers, and run_id/model_version.",
        "Export generation succeeds without external tooling beyond the app deployment."
      ],
      "notes": "Export should include inputs/outputs, pilot visuals, disclaimers, and run provenance. Export format still open (OQ-007)."
    },
    {
      "id": "UR-011",
      "statement": "The app should provide evidence references for each simulator module (e.g., SCFAs and tryptophan metabolites) in a judge-friendly way.",
      "priority": "SHOULD",
      "rationale": "Strengthens credibility without overclaiming.",
      "acceptance_criteria": [
        "Evidence is presented as citations/links or a curated evidence panel.",
        "Evidence claims are phrased as 'supports plausibility' not 'proves'."
      ],
      "notes": "see OQ-008."
    },
    {
      "id": "UR-012",
      "statement": "All microbiome/metabolite outputs shown for teens must be labeled as modeled proxy variables, not measured biomarkers.",
      "priority": "MUST",
      "rationale": "The pilot dataset does not contain microbiome/metabolite measurements; avoiding misrepresentation is critical.",
      "acceptance_criteria": [
        "UI uses labels such as 'simulated' / 'estimated' / 'proxy'.",
        "Methods & Rigor states that teens have no stool/metabolite measurements."
      ],
      "notes": "Confirmed by OQ-006: outputs shown for teens are modeled/proxy variables; pilot has no microbiome/metabolite measurements."
    },
    {
      "id": "UR-013",
      "statement": "The app should meet basic performance targets suitable for live demos (fast load and fast simulation).",
      "priority": "SHOULD",
      "rationale": "Reduces demo risk under poor network or device constraints.",
      "acceptance_criteria": [
        "Cold start loads core UI in under 3 seconds on a typical laptop.",
        "A single simulation run completes in under 500 ms once loaded."
      ],
      "notes": "targets are assumptions; confirm or adjust via OQ-010."
    },
    {
      "id": "UR-014",
      "statement": "The app should support side-by-side comparison of two diet scenarios and their predicted outputs.",
      "priority": "SHOULD",
      "rationale": "Improves interpretability and demonstrates dose-response behavior.",
      "acceptance_criteria": [
        "User can save two scenarios and compare outputs on one screen.",
        "Export can include the comparison."
      ],
      "notes": "may be deferred if schedule is tight."
    },
    {
      "id": "UR-015",
      "statement": "The app must include an in-app Help/Docs screen that displays all submitted foundation documents and reference snapshots in read-only form, rendering JSON/CSV/MD/TXT in the browser while offline.",
      "priority": "MUST",
      "rationale": "Improves transparency and judge trust by making the submitted packet and engineering artifacts available inside the demo app.",
      "acceptance_criteria": [
        "Help/Docs is accessible from every screen via a consistent top-bar button.",
        "Docs list is complete (driven by docs_index.json) and opens documents without network access.",
        "JSON renders with stable formatting; CSV renders as a table preview; MD renders as Markdown; TXT renders as text."
      ],
      "notes": "Read-only. No PHI. No new scientific claims; presentation-only."
    }
  ],
  "unknowns": {
    "open_questions": [],
    "assumptions_to_confirm": [],
    "notes": "Blocking questions answered. Remaining open questions are non-blocking."
  }
}
~~~
@@@FILE_END path="foundation_pack/user_requirements.json"@@@

@@@FILE_BEGIN path="pilot/pilot_dataset_n66.csv" type="csv" sha256="90f26f961daa3b559297cc41d3256c3b490876fef2970711edcd0714cea836d3"@@@
~~~csv
diet_score,stroop_test,language_test,memory_test,logical_test,overall_score
21,17.0,19,8,14,58.0
19,18.7,14,10,12,54.7
16,20.0,7,12,14,53.0
19,19.0,14,8,10,51.0
16,18.7,16,9,16,59.7
10,19.3,12,5,8,44.3
14,11.7,14,3,10,38.7
18,18.7,10,5,16,49.7
17,19.3,12,9,16,56.3
20,20.0,14,7,14,55.0
21,18.3,14,9,12,53.3
16,20.0,15,7,14,56.0
14,20.0,14,10,10,54.0
23,19.3,17,3,14,53.3
12,17.7,12,3,14,46.7
15,20.0,15,3,10,48.0
16,19.3,17,5,16,57.3
15,19.3,8,7,10,44.3
26,20.0,17,5,18,60.0
17,19.7,14,5,18,56.7
16,17.0,14,4,8,43.0
11,19.0,11,12,14,56.0
18,18.3,15,6,10,49.3
15,19.0,13,4,14,50.0
22,20.0,13,2,14,49.0
13,19.3,14,3,6,42.3
15,19.3,14,6,16,55.3
14,19.7,16,7,14,56.7
18,20.0,17,5,12,54.0
14,19.0,16,4,10,49.0
11,20.0,14,1,8,43.0
14,19.0,14,6,12,51.0
11,20.0,13,3,12,48.0
11,19.0,11,3,12,45.0
15,19.7,14,5,18,56.7
10,18.7,13,6,14,51.7
21,19.7,16,5,14,54.7
20,19.3,15,8,16,58.3
21,20.0,15,4,16,55.0
13,18.3,10,2,10,40.3
12,20.0,11,7,16,54.0
16,19.7,9,3,8,39.7
23,20.0,14,6,12,52.0
17,19.7,16,3,16,54.7
21,19.0,15,4,18,56.0
20,19.0,17,6,10,52.0
17,20.0,13,4,12,49.0
15,20.0,17,6,16,59.0
17,20.0,13,6,14,53.0
20,18.7,10,4,12,44.7
15,19.7,15,4,16,54.7
12,20.0,15,4,12,51.0
18,19.3,15,3,18,55.3
15,19.7,14,5,12,50.7
15,18.7,15,5,10,48.7
14,18.3,12,3,8,41.3
14,19.3,12,4,10,45.3
12,19.7,13,5,12,49.7
10,20.0,14,6,14,54.0
21,18.7,16,2,8,44.7
25,19.3,17,1,14,51.3
20,19.0,13,6,16,54.0
23,20.0,11,6,16,53.0
21,19.7,17,14,20,70.7
15,19.7,10,3,4,36.7
14,19.7,15,5,10,49.7
~~~
@@@FILE_END path="pilot/pilot_dataset_n66.csv"@@@

@@@FILE_BEGIN path="prompt_description_en.md" type="md" sha256="98871d4186c8d0f14b4e8f90c6f27c02c799e3d8b8284b9f4b65582508f4a4f8"@@@
~~~text
# CogniBiome Lovable Prompt — Detailed Description (English)

## Goal
This prompt instructs Lovable to generate a **judge‑ready, offline‑first PWA** called **CogniBiome** for the project:

**“Modeling Diet‑Driven Microbiome and Neurotransmitter Pathways Influencing Cognitive Performance.”**

The app must align with the submitted packet framing:
- It is a **deterministic simulator / hypothesis generator** (not a causal proof).
- It is **not medical advice** and **not a diagnostic device**.
- The teen pilot dataset (**n=66**) is **de‑identified** and **validation‑only**.
- Teens do **not** have measured microbiome/metabolomics; those layers are **modeled proxies**.

## Why “offline‑first” matters for judging
Science fair judging often happens with unreliable Wi‑Fi. The prompt therefore forces:
- local pilot charts computed from the CSV
- local deterministic simulation using frozen artifacts
- offline export to HTML (and optional print‑to‑PDF)

If required data is missing, the UI must request upload instead of inventing values.

## What “World Modeling” means here (practical, not philosophical)
“World modeling” in this app means building a **small typed graph** that represents the domain objects and their wiring:

**Entities**
- DietFeatures (inputs): fiber, added sugar, saturated fat, omega‑3 proxy (plus optional calories)
- NutrientProxies: definitions + units + tooltips
- MicrobeGenera (modeled): e.g., Bifidobacterium, Lactobacillus, F/B ratio
- MetaboliteProxies (modeled): acetate/propionate/butyrate scores, 5‑HTP precursor index
- CognitiveDomains (modeled): Stroop, memory, language, logical, overall
- EvidenceSources: USDA FDC / Reactome / WikiPathways / MiMeDB metadata and pathway IDs
- DatasetArtifacts: pilot CSV and model artifact bundles

**Relations**
DietFeatures → MicrobeGenera → MetaboliteProxies → CognitiveDomains

The purpose is **engineering consistency**:
- one canonical place for labels, units, ranges, disclaimers, and wiring
- deterministic behavior and UI generation
- easier traceability back to UR‑### and SRS‑REQ‑### requirements

This is not claiming a true biological causal graph; it is a controlled internal representation for a simulator.

## External reference snapshots (one JSON per source)
The app includes an “Evidence” layer that is **offline** and reads these files:

- `usda_fdc.json` — nutrient proxy definitions and a mapping from diet components to proxies (heuristic, clearly labeled)
- `reactome.json` — curated Reactome pathway IDs for pathway cards
- `wikipathways.json` — curated WikiPathways IDs (plus optional local diagram pointers)
- `mimedb.json` — schema placeholder for microbe↔metabolite evidence table (empty unless you later populate it)

These are used only for **tooltips, evidence cards, and references**, not for training models.

## Data leakage guardrails (judge‑facing)
The prompt forces a clear “Leakage Guardrails” explanation:
- pilot CSV is validation‑only
- no training/tuning on pilot data
- preprocessing “fit only on train” rule (if any model artifacts are swapped later)

## Deliverables the app must include
- Dashboard
- Pilot Results (real charts/tables from CSV; no synthetic points)
- Simulator (deterministic multi-stage run + run_hash)
- Methods & Rigor (limitations + disclaimers + leakage definition)
- Compare Scenarios (optional/SHOULD)
- Export 1‑page report (offline HTML, optional PDF)

## How to use this package in Lovable
Upload everything in this zip together with the prompt. The prompt explicitly lists every uploaded file and instructs Lovable to copy them into:
- `/app_context/...` (audit copies)
- `/public/reference/...` and `/public/pilot/...` (runtime)
~~~
@@@FILE_END path="prompt_description_en.md"@@@

@@@FILE_BEGIN path="prompt_lovable_CogniBiome.txt" type="txt" sha256="72d87aed3755a46ab47f7b6ed086f10a2e9b9c5ef3aad63258688ae1201367f0"@@@
~~~text
ROLE
You are Lovable’s senior full-stack engineer (React/TypeScript) and scientific-dashboard UX designer.

MISSION
Build a best-in-class (2026), judge-ready, offline-first PWA for the project:
“Modeling Diet-Driven Microbiome and Neurotransmitter Pathways Influencing Cognitive Performance”.
App name: “CogniBiome”.

NON-NEGOTIABLE FRAMING (MUST MATCH PROJECT PACKET)
- This is a deterministic simulator / hypothesis generator.
- It does NOT prove causality.
- It is NOT medical advice and NOT a diagnostic device.
- The teen pilot dataset (n=66) is de-identified and validation-only.
- Teens do NOT have measured microbiome/metabolomics in the pilot; microbiome/metabolites shown are modeled proxy variables.

WORLD MODELING REQUIREMENT (FOR CONSISTENCY + TRACEABILITY)
Represent the domain as a small, explicit “world model” (typed graph) that drives both the simulator and the UI.
- Entities: DietFeatures, NutrientProxies, MicrobeGenera (modeled), MetaboliteProxies (modeled), CognitiveDomains (modeled), EvidenceSources, DatasetArtifacts.
- Relations: DietFeatures→MicrobeGenera, MicrobeGenera→MetaboliteProxies, MetaboliteProxies→CognitiveDomains, plus EvidenceSources that justify each module.
- Implementation: create /src/world_model/worldModel.ts (and/or JSON under /src/world_model/world_model.json) and have the simulator read from it.
- This is NOT a “knowledge graph claim.” It is an internal representation to keep labels, units, tooltips, and module wiring deterministic and consistent with UR/SRS.


STACK (MUST USE)
- React + Vite + TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- PWA offline-first: after first load, core experience works with no network.


OFFLINE-FIRST HARD RULE
- Do not call external APIs at runtime for evidence or definitions. Use the uploaded /public/reference/*.json snapshots.
- Network may be unavailable during judging. If the browser is offline, the judge path must still work fully.

CRITICAL BUILD GUARDRAILS (ANTI-DRIFT / ANTI-HALLUCINATION)
1) Implement ONLY what is needed to satisfy the foundation pack requirements (UR-* + SRS-REQ-*). Do not add unrelated features.
2) Never fabricate pilot results. All pilot charts/tables must be computed directly from the loaded CSV.
3) If a required input is missing (pilot CSV or model artifacts), do NOT invent data. Show a clear UI state: “Upload required file to proceed.”
4) All simulator outputs must be labeled “MODELED / ESTIMATED (proxy)”.
5) Keep dependencies minimal and stable (avoid niche libraries). Performance must stay within demo budgets.

UPLOADED FILES WITH THIS PROMPT (YOU MUST USE THEM)

You are given a set of uploaded files. Start by reading them all. Then, create the same files inside the generated repo so the project is self-contained.

A) Canonical foundation pack (treat as source-of-truth requirements; do not rewrite content)
- foundation_pack/user_requirements.json — user-level MUST/SHOULD requirements (UR-###)
- foundation_pack/BRD/brd.json — business requirements (BRD-REQ-###)
- foundation_pack/SRS/traceable_requirements.json — traceable software requirements (SRS-REQ-###)
- foundation_pack/SRS/gui_spec.json — screens + UI spec (SCR-###)
- foundation_pack/SRS/agentic_prompt_gates.json — anti-drift / anti-hallucination gates
- foundation_pack/SRS/nfr_budgets.json — performance budgets
- foundation_pack/SRS/test_plan_and_ci.json — minimal tests that must exist in repo
- plus the remaining JSONs in foundation_pack/ as supporting context (assumptions, open_questions, etc.)

B) External reference snapshots (offline evidence; one JSON per source)
- reference/usda_fdc.json — FoodData Central snapshot metadata + nutrient proxy mapping (no live API calls)
- reference/reactome.json — curated Reactome pathway IDs for evidence cards
- reference/wikipathways.json — curated WikiPathways IDs + optional local diagram pointers
- reference/mimedb.json — schema placeholder for microbe↔metabolite evidence table (not populated)
- reference/REFERENCES_AND_LICENSES.md — license & citation notes

C) Pilot dataset (real data; used only for validation charts/tables, never for training)
- pilot/pilot_dataset_n66.csv — numeric-only teen pilot dataset (n=66)

D) Decision memo (human-readable; may be used to inform UI copy)
- external_sources_for_Gut_overview.txt — external sources plan and offline-first rationale

REPO FILE PLACEMENT RULES (IMPORTANT)
- Keep an exact copy of all uploaded files under /app_context/... for auditability:
  /app_context/foundation_pack/...
  /app_context/reference/...
  /app_context/pilot/...
  /app_context/external_sources_for_Gut_overview.txt
- For runtime use, also copy reference JSONs into /public/reference/ and the default pilot CSV into /public/pilot/
- The app must still work if the reference files are missing (show a clear “reference pack not present” empty state), but MUST work with the files provided here.


OUTPUT REQUIRED
A complete Lovable project implementing the app described below.

===========================================================
1) INFORMATION ARCHITECTURE (MUST FOLLOW SRS GUI SPEC)
===========================================================

LEFT SIDEBAR NAV (6 items)
1) Dashboard (SCR-001)
2) Pilot Results (SCR-002)
3) Simulator (SCR-003)
4) Export Report (SCR-004)
5) Methods & Rigor (SCR-005)
6) Compare Scenarios (SCR-006)

Global controls (top-right)
- Presenter Mode toggle (simplifies UI for judging)
- Reset demo state (restores default dataset + default scenario + clears runs)

Visual style
- “Modern AI research console”: dark theme, high contrast, clean typography, dense but readable.
- No gamification, no playful illustrations, no medical branding.

===========================================================
2) PILOT DATASET (MUST BE REAL, n=66)
===========================================================

Goal: implement SRS-REQ-001..SRS-REQ-006 and tests TST-001..TST-002.

A) Default pilot dataset
- If a pilot CSV is provided in context, bundle it as: /public/pilot/pilot_dataset_n66.csv
- If not provided, ship WITHOUT a default dataset and require upload in Admin mode (do not add synthetic data).

B) Ingestion + validation (robust)
- Allow loading from bundled default OR from local upload (CSV file input).
- Drop columns matching: /^Unnamed:/.
- Detect and handle duplicate diet score columns: Diet Score, Diet Score.1, Diet Score.2, Diet Score.3, Diet Score.4
  - Default mapping: use the first non-empty Diet Score column.
  - If multiple are present, verify row-wise equality; if not equal, require the user to choose mapping.
- Canonical fields (store internally with these names):
  - diet_score
  - stroop_test
  - language_test
  - memory_test
  - logical_test
  - overall_score
- Integrity check (MUST):
  overall_score == stroop_test + language_test + memory_test + logical_test (row-wise).
  If mismatch exists, show a red warning banner and mark dataset “integrity_failed”.

C) Pilot Results screen (SCR-002)
- Summary statistics table: mean, median, n for each canonical metric.
- Correlation table:
  - Pearson r (diet_score vs each cognitive metric including overall_score).
  - p-value for each correlation.
- Charts:
  - Scatter plot for diet_score vs each cognitive metric (5 plots).
  - Toggle: regression line on/off.
  - Toggle: show quartiles on/off.
- Prominent badge:
  “REAL DATA (de-identified teen pilot, n=66) • computed live from CSV • no synthetic points”.

===========================================================
3) SIMULATOR (DETERMINISTIC, OFFLINE)
===========================================================

Goal: implement SRS-REQ-007..SRS-REQ-013.

Diet input variables (D) (SCR-003)
- Provide 4 sliders with numeric ranges and helper text:
  - fiber_proxy
  - added_sugar_proxy
  - sat_fat_proxy
  - omega3_proxy
- Show derived diet_score_proxy (deterministic mapping from the 4 inputs).
- Validate ranges and show units (even if “proxy units”).

Simulation engine (D→X→M→Y)
- Run is deterministic: same normalized inputs + same model artifacts => same outputs + same run_hash.
- Compute run_hash = sha256(JSON.stringify({normalized_inputs, model_versions}))
- Persist runs locally (IndexedDB or localStorage) with:
  - run_hash, timestamp, inputs, outputs, model_versions, notes

Model artifacts (NO LIVE TRAINING)
- Preferred: read fixed JSON artifacts from /public/models/:
  - stage1.json (D→X)
  - stage2.json (X→M)
  - stage3.json (M→Y)
- If real artifacts are not provided, create a bundled “Demo Param Set v0” that is:
  - monotonic and directionally consistent with the hypothesis
  - explicitly labeled “Demo parameters (directional), replaceable”
- Provide hidden “Admin” controls (only when a local admin toggle is enabled) to load replacement model JSON files.
- Never claim models were trained inside the app.

Stage outputs (must match scope)
X (Microbiome, modeled proxy)
- Show numeric proxy outputs (0..1 or %), labeled clearly as modeled.
- At minimum show:
  - Bifidobacterium
  - Lactobacillus
  - Firmicutes:Bacteroidetes ratio

M (Metabolites, modeled proxy)
- At minimum show:
  - acetate
  - propionate
  - butyrate
  - 5-HTP index (explicitly as “precursor proxy”, not “serotonin in brain”)

Y (Cognition, modeled proxy)
- At minimum show:
  - stroop_test
  - language_test
  - memory_test
  - logical_test
  - overall_score

Provenance panel (SCR-003)
- Show model version identifiers (hash or semantic version) and run_hash.
- “Frozen before pilot validation” (text only, no fabricated metrics).

===========================================================
4) METHODS & RIGOR (JUDGE-FACING)
===========================================================

Goal: implement SRS-REQ-014..SRS-REQ-016 and BRD-REQ-003/006/007/008.

Methods & Rigor screen (SCR-005) must include three card sections:

A) Limitations and correct scientific wording
- Teens do not have measured microbiome/metabolomics; X and M are modeled proxies.
- Non-causality disclaimer: simulator generates testable hypotheses; does not prove mechanism.
- Non-diagnostic disclaimer: educational research prototype; not medical advice.

B) Leakage guardrails (checklist UI)
- Pilot dataset is validation-only and not used for training/tuning.
- No peeking during tuning (conceptual).
- Fit-only-on-train (conceptual).
- Duplicate/near-duplicate awareness (conceptual).
Important: do not invent model performance numbers.

C) Data Sources panel (paired vs unpaired)
- Present a simple table with columns:
  Stage | Inputs | Outputs | Dataset types | Notes
- If a dataset is unpaired, label it “reference-only” (not used for supervised paired training).

Optional (SHOULD): Evidence panel
- Preload a small local JSON library of 6–10 citations.
- Each stage output has a tooltip “Evidence (plausibility)” linking to 1–2 citations.

===========================================================
5) EXPORT (1-PAGE REPORT, OFFLINE)
===========================================================

Goal: implement SRS-REQ-017..SRS-REQ-020.

Export Report screen (SCR-004)
- Select a stored run by run_hash.
- Generate a one-page report as:
  - HTML file download (always works offline), and
  - PDF via print-to-PDF workflow (window.print) OR client-side PDF library if reliable offline.
- Report MUST include:
  - Run provenance: run_hash + model versions
  - Diet inputs (sliders values + diet_score_proxy)
  - Stage outputs X/M/Y with “MODELED / proxy” labels
  - Pilot summary (at least one scatter plot OR a compact correlation table, computed from loaded CSV)
  - Leakage checklist status
  - Disclaimers (non-diagnostic, non-causal)

===========================================================
6) PRESENTER MODE + RESET
===========================================================

Presenter Mode (SRS-REQ-021)
- Hides admin and advanced controls
- Shows a “2-minute demo path” helper:
  Pilot Results → Methods & Rigor → Simulator → Export

Reset demo state (SRS-REQ-022)
- Restores default scenario values and clears stored runs (with confirmation)

===========================================================
7) PERFORMANCE + RELIABILITY
===========================================================

Meet NFR budgets (SRS/nfr_budgets.json):
- Cold start UI <= 3s (typical laptop)
- Simulation run <= 500ms
- Pilot charts render <= 2s

===========================================================
8) TESTS (IN REPO)
===========================================================

Add a minimal test setup (Vitest preferred):
- TST-001: Pilot CSV parsing/mapping + row_count==66 (when default CSV present) + integrity check.
- TST-002: Stats/correlation computation returns stable values (no NaNs, no crashes).

===========================================================
DONE = SUCCESS CRITERIA
===========================================================

The build is complete when:
- All MUST requirements UR-001..UR-015 and SRS-REQ-001..SRS-REQ-030 are implemented.
- App works as a kiosk demo without login.
- Pilot Results show real charts from the loaded CSV (no synthetic points).
- Simulator runs deterministically, stores runs, shows run_hash, and exports a one-page report offline.===========================================================
0) EVIDENCE LIBRARY (OFFLINE)
===========================================================

Use /public/reference/*.json to power an Evidence panel:
- Nutrient proxy definitions (from usda_fdc.json)
- Pathway cards (from reactome.json and wikipathways.json)
- Optional microbe↔metabolite links table (from mimedb.json; show empty-state if not populated)

Rules:
- Evidence panels must use cautious language: “supports plausibility”, “associated with”, “hypothesis generator”.
- Never present evidence as medical advice or diagnosis.




HELP / DOCS (FOUNDATION PACK VIEWER) [NEW, REQUIRED]
- Add a global top-bar Help/Docs button visible on every screen.
- Implement screen SCR-007 using GUI spec guidance in foundation_pack/SRS/gui_spec.json.
- Load /foundation_pack/docs_index.json (static asset) to enumerate documents.
- Render documents offline with a safe renderer:
  - JSON: pretty-print; for known schemas show a derived table view (e.g., list of requirements).
  - CSV: parse and show a table preview (first 100 rows) + basic stats (row count).
  - Markdown: render Markdown to HTML safely.
  - TXT: render as text (preformatted).
- Read-only. Do not execute scripts or HTML embedded in docs.
- Provide Copy and Download actions for each document.
~~~
@@@FILE_END path="prompt_lovable_CogniBiome.txt"@@@

@@@FILE_BEGIN path="reference/README_data_build.md" type="md" sha256="869fadaf4b442f6c89ad468cea047f209e013df79e7316b39cb218f795dd1ae4"@@@
~~~text
# How external reference snapshots are built (CogniBiome)

This project is offline-first for judge review:
- The app must NOT call external APIs at runtime.
- External sources are packaged as small “reference snapshots” under /reference/.

If you want to refresh them, use one of:
1) Manual download + filtering (Excel / pandas)
2) A web-enabled agent (ChatGPT Agent Mode) that downloads official datasets, filters a small subset, and writes JSON files back into the zip.

See:
- /agent/AGENT_MODE_DATA_COLLECTION_PROMPT.md
~~~
@@@FILE_END path="reference/README_data_build.md"@@@

@@@FILE_BEGIN path="reference/REFERENCES_AND_LICENSES.md" type="md" sha256="02cc0c3c5b09ade1ca7162e2587bae2285bb125dd38a0f9defd1c72bbe8b29d8"@@@
~~~text
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
~~~
@@@FILE_END path="reference/REFERENCES_AND_LICENSES.md"@@@

@@@FILE_BEGIN path="reference/mimedb.json" type="json" sha256="df11a30ab5f48c87d6674e211419038601a10395e0d6344477f8add0ede78a4f"@@@
~~~json
{
  "metadata": {
    "source": "Literature-derived microbial metabolite evidence (proxy for MiMeDB)",
    "notes": "Direct MiMeDB downloads were inaccessible due to website security restrictions. Microbe–metabolite links were derived from accessible scientific publications.",
    "download_date": "2026-02-28",
    "license": "CC BY-NC (data reused under non-commercial terms)",
    "is_seed_subset": true,
    "why_subset": "Full MiMeDB bulk downloads are large (tens of MB) and were not embedded to keep the app lightweight and within upload limits. This file is a curated, judge-friendly subset focusing on gut–brain relevant metabolites.",
    "official_bulk_downloads": {
      "downloads_page": "https://mimedb.org/downloads",
      "example_files": [
        "All MiMe Compounds (CSV/XML/SDF)",
        "All Microbes (CSV/XML)"
      ],
      "note": "Use official downloads to rebuild a larger local dataset if needed."
    },
    "last_verified_downloads_page": "2026-02-28"
  },
  "links": [
    {
      "metabolite_name": "butyrate",
      "mimedb_metabolite_id": null,
      "microbe_name": "Faecalibacterium prausnitzii",
      "mimedb_microbe_id": null,
      "evidence_type": "butyrate-producing bacterium; upregulation of host gene expression",
      "citation": "【84461377747758†L441-L449】"
    },
    {
      "metabolite_name": "butyrate",
      "mimedb_metabolite_id": null,
      "microbe_name": "Roseburia intestinalis",
      "mimedb_microbe_id": null,
      "evidence_type": "butyrate-producing bacterium; supernatant induces Dact3 expression",
      "citation": "【84461377747758†L441-L449】"
    },
    {
      "metabolite_name": "acetate",
      "mimedb_metabolite_id": null,
      "microbe_name": "Bacteroides thetaiotaomicron",
      "mimedb_microbe_id": null,
      "evidence_type": "Metabolism of dietary fibres generates short-chain fatty acids such as acetate and propionate",
      "citation": "【601844926681412†L186-L192】"
    },
    {
      "metabolite_name": "propionate",
      "mimedb_metabolite_id": null,
      "microbe_name": "Bacteroides thetaiotaomicron",
      "mimedb_microbe_id": null,
      "evidence_type": "Metabolic activity produces propionate from complex carbohydrates",
      "citation": "【601844926681412†L186-L192】"
    },
    {
      "metabolite_name": "indole-3-propionic acid",
      "mimedb_metabolite_id": null,
      "microbe_name": "Clostridium sporogenes",
      "mimedb_microbe_id": null,
      "evidence_type": "C. sporogenes metabolises tryptophan to produce indole-3-propionic acid (IPA)",
      "citation": "【501402467638980†L199-L201】"
    },
    {
      "metabolite_name": "GABA",
      "mimedb_metabolite_id": null,
      "microbe_name": "Levilactobacillus brevis (L. brevis)",
      "mimedb_microbe_id": null,
      "evidence_type": "L. brevis CRL 2013 is an efficient GABA-producing lactic acid bacterium; L. brevis strains are competitive for GABA production",
      "citation": "【677264825719946†L197-L203】【677264825719946†L269-L272】"
    },
    {
      "metabolite_name": "serotonin",
      "mimedb_metabolite_id": null,
      "microbe_name": "Indigenous spore-forming microbes (Clostridia)",
      "mimedb_microbe_id": null,
      "evidence_type": "Spore-forming gut microbes from mice and humans mediate microbiota-driven increases in colonic and blood serotonin",
      "citation": "【769176822493020†L815-L827】"
    },
    {
      "metabolite_name": "tryptophan",
      "mimedb_metabolite_id": null,
      "microbe_name": "Clostridium sporogenes",
      "mimedb_microbe_id": null,
      "evidence_type": "C. sporogenes metabolises tryptophan and produces indole-3-propionic acid and other metabolites",
      "citation": "【501402467638980†L199-L205】"
    }
  ]
}
~~~
@@@FILE_END path="reference/mimedb.json"@@@

@@@FILE_BEGIN path="reference/reactome.json" type="json" sha256="92d7690571f6c2b81975ac6fdc22c4fcf08a100c6f7137cf76e79fc8e85a94d0"@@@
~~~json
{
  "metadata": {
    "source": "Reactome database",
    "release_version": "current as of 2026-02-28"
  },
  "pathways": [
    {
      "reactome_id": "R-HSA-888590",
      "name": "GABA synthesis, release, reuptake and degradation",
      "species": "Homo sapiens",
      "top_level_parent": "Neuronal System \u2192 Transmission across Chemical Synapses \u2192 Neurotransmitter release cycle",
      "short_summary": "Gamma-aminobutyric acid (GABA) is a major inhibitory neurotransmitter. It is synthesised in presynaptic neurons, loaded into synaptic vesicles, released into the synaptic cleft and then recaptured by transporters or taken up by astrocytes for metabolism.",
      "citation": "\u3010222754517448648\u2020L860-L865\u3011\u3010963220768469669\u2020L185-L189\u3011"
    },
    {
      "reactome_id": "R-HSA-71240",
      "name": "Tryptophan catabolism",
      "species": "Homo sapiens",
      "top_level_parent": "Metabolism \u2192 Metabolism of amino acids and derivatives",
      "short_summary": "Tryptophan is catabolised in seven steps to yield aminomuconate; intermediates in this process are also used to synthesise serotonin and kynurenine.",
      "citation": "\u301061025227191290\u2020L842-L845\u3011\u3010896023150879508\u2020L184-L191\u3011"
    },
    {
      "reactome_id": "R-HSA-209931",
      "name": "Serotonin and melatonin biosynthesis",
      "species": "Homo sapiens",
      "top_level_parent": "Metabolism \u2192 Metabolism of amino acids and derivatives \u2192 Metabolism of amine-derived hormones",
      "short_summary": "Serotonin (5-HT) is a hormone and neurotransmitter involved in many physiological functions and serves as a precursor for melatonin. It is synthesised from tryptophan and can be further converted to melatonin.",
      "citation": "\u3010420996985920844\u2020L856-L860\u3011\u3010169970217285775\u2020L184-L188\u3011"
    },
    {
      "reactome_id": "R-HSA-380612",
      "name": "Metabolism of serotonin",
      "species": "Homo sapiens",
      "top_level_parent": "Neuronal System \u2192 Transmission across Chemical Synapses \u2192 Neurotransmitter clearance \u2192 Serotonin clearance from the synaptic cleft",
      "short_summary": "Serotonin released into the synaptic cleft is metabolised to 5-hydroxyindole acetaldehyde by monoamine oxidase and then to 5-hydroxyindoleacetic acid by aldehyde dehydrogenase.",
      "citation": "\u3010611227375037093\u2020L880-L884\u3011\u3010476045600366150\u2020L184-L189\u3011"
    },
    {
      "reactome_id": "R-HSA-390666",
      "name": "Serotonin receptors",
      "species": "Homo sapiens",
      "top_level_parent": "Signal Transduction \u2192 Signaling by GPCR \u2192 GPCR ligand binding \u2192 Class A/1 (Rhodopsin-like receptors) \u2192 Amine ligand-binding receptors",
      "short_summary": "Serotonin (5-hydroxytryptamine) modulates multiple physiological functions such as mood and appetite. Seven families of serotonin receptors exist; all except the 5-HT3 family are G protein\u2011coupled receptors (GPCRs).",
      "citation": "\u3010711614200324502\u2020L892-L895\u3011\u30108256827742453\u2020L180-L186\u3011"
    },
    {
      "reactome_id": "R-HSA-168164",
      "name": "Toll-like receptor 3 (TLR3) cascade",
      "species": "Homo sapiens",
      "top_level_parent": "Immune System \u2192 Innate Immune System \u2192 Toll-like Receptor Cascades",
      "short_summary": "Toll\u2011like receptor 3 (TLR3) is expressed in dendritic cells and intestinal cells. It recognises double\u2011stranded RNA, signalling through the adaptor TRIF to activate NF\u2011kappa\u2011B and induce type I interferon genes.",
      "citation": "\u3010828576529763095\u2020L865-L868\u3011\u3010725612490274013\u2020L185-L189\u3011"
    }
  ]
}
~~~
@@@FILE_END path="reference/reactome.json"@@@

@@@FILE_BEGIN path="reference/usda_fdc.json" type="json" sha256="395f1f80f6919b35c06ce9e4cfa76a35374e9e7045c4694b4c3f226d7d660845"@@@
~~~json
{
  "metadata": {
    "source": "USDA FoodData Central, foundation and SR legacy datasets",
    "download_date": "2026-02-28",
    "release_info": {
      "foundation_release": "2025-12-18",
      "sr_legacy_release": "2018-04"
    }
  },
  "foods": [
    {
      "food_name": "Oats, rolled (old-fashioned)",
      "fdc_id": 2346396,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 10.42,
        "total_sugars_g": 0.0,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Oats, steel-cut",
      "fdc_id": 2346397,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 11.95,
        "total_sugars_g": 0.0,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Oat milk, unsweetened",
      "fdc_id": 2257046,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 2.32,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Beans, black, raw",
      "fdc_id": 747444,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 4.2,
        "total_sugars_g": 0.0,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Lentils, raw",
      "fdc_id": 2644283,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 0.0,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Chickpeas, raw",
      "fdc_id": 2644282,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 0.0,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Broccoli, raw",
      "fdc_id": 747447,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 2.4,
        "total_sugars_g": 1.4,
        "sat_fat_g": 0.04
      }
    },
    {
      "food_name": "Almonds",
      "fdc_id": 325198,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 2.63,
        "sat_fat_g": 18.1
      }
    },
    {
      "food_name": "Sunflower seeds",
      "fdc_id": 325524,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 10.3,
        "total_sugars_g": 3.14,
        "sat_fat_g": 5.36
      }
    },
    {
      "food_name": "Bread, whole wheat",
      "fdc_id": 335240,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 6.0,
        "total_sugars_g": 4.41,
        "sat_fat_g": 0.73
      }
    },
    {
      "food_name": "Blueberries",
      "fdc_id": 2346411,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 9.36,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Raspberries",
      "fdc_id": 2346410,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 2.68,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Blackberries",
      "fdc_id": 2727581,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 5.3,
        "total_sugars_g": 6.52,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Pears",
      "fdc_id": 2710836,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 2.64,
        "total_sugars_g": 7.8,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Apples",
      "fdc_id": 1750343,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 1.72,
        "total_sugars_g": 12.37,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Greek yogurt, plain nonfat",
      "fdc_id": 330137,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 3.27,
        "sat_fat_g": 0.11
      }
    },
    {
      "food_name": "Yogurt, plain whole milk",
      "fdc_id": 2259793,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 4.09,
        "sat_fat_g": 2.32
      }
    },
    {
      "food_name": "Greek yogurt, plain whole milk",
      "fdc_id": 2259794,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 3.25,
        "sat_fat_g": 2.39
      }
    },
    {
      "food_name": "Greek yogurt, strawberry nonfat",
      "fdc_id": 330415,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.6,
        "total_sugars_g": 11.5,
        "sat_fat_g": 0.1
      }
    },
    {
      "food_name": "Pickles, cucumber dill",
      "fdc_id": 324653,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 1.0,
        "total_sugars_g": 1.28,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Candy, Almond Joy bar",
      "fdc_id": 167562,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 5.0,
        "total_sugars_g": 48.34,
        "sat_fat_g": 17.59
      }
    },
    {
      "food_name": "Candy, Bit-O-Honey",
      "fdc_id": 167564,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.2,
        "total_sugars_g": 48.0,
        "sat_fat_g": 5.5
      }
    },
    {
      "food_name": "Candy, Twizzlers strawberry twists",
      "fdc_id": 167583,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 39.64,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Candy, Caramello bar",
      "fdc_id": 167975,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 1.2,
        "total_sugars_g": 56.92,
        "sat_fat_g": 12.72
      }
    },
    {
      "food_name": "Candy, 5th Avenue bar",
      "fdc_id": 167985,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 3.1,
        "total_sugars_g": 47.19,
        "sat_fat_g": 6.65
      }
    },
    {
      "food_name": "Soda, cream",
      "fdc_id": 173199,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 13.3,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Soda, grape",
      "fdc_id": 173203,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 0.0,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Soda, lemon-lime",
      "fdc_id": 173205,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 10.38,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Cheddar cheese",
      "fdc_id": 328637,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 0.33,
        "sat_fat_g": 19.2
      }
    },
    {
      "food_name": "Butter, unsalted",
      "fdc_id": 789828,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 0.0,
        "sat_fat_g": 0.0
      }
    },
    {
      "food_name": "Bacon, cured",
      "fdc_id": 749420,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 3.14,
        "sat_fat_g": 12.6
      }
    },
    {
      "food_name": "Beef steak, ribeye, raw",
      "fdc_id": 2646172,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 0.0,
        "sat_fat_g": 7.97
      }
    },
    {
      "food_name": "Chorizo sausage",
      "fdc_id": 746781,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 0.0,
        "sat_fat_g": 9.45
      }
    },
    {
      "food_name": "Italian pork sausage",
      "fdc_id": 746780,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 1.46,
        "sat_fat_g": 9.15
      }
    },
    {
      "food_name": "Beef steak, porterhouse",
      "fdc_id": 746762,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 0.0,
        "total_sugars_g": 0.0,
        "sat_fat_g": 2.07
      }
    },
    {
      "food_name": "Cheeseburger, fast food",
      "fdc_id": 170293,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 1.0,
        "total_sugars_g": 4.16,
        "sat_fat_g": 6.96
      }
    },
    {
      "food_name": "Cheeseburger, fast food, double",
      "fdc_id": 170294,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 1.7,
        "total_sugars_g": 4.67,
        "sat_fat_g": 6.87
      }
    },
    {
      "food_name": "Pizza, cheese, fast food",
      "fdc_id": 170317,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 2.2,
        "total_sugars_g": 3.57,
        "sat_fat_g": 4.27
      }
    },
    {
      "food_name": "French fries, steak style",
      "fdc_id": 168445,
      "serving_g": 100,
      "nutrients_per_100g": {
        "fiber_g": 2.6,
        "total_sugars_g": 0.25,
        "sat_fat_g": 0.74
      }
    }
  ],
  "nutrient_mapping": {
    "fiber_g": {
      "nutrient_ids": [
        2033,
        1079,
        1006
      ],
      "description": "Total dietary fiber (AOAC 2011.25) and related IDs"
    },
    "total_sugars_g": {
      "nutrient_ids": [
        2000,
        1063,
        1235
      ],
      "description": "Total sugars including 1063 and 1235 if available"
    },
    "sat_fat_g": {
      "nutrient_ids": [
        1258
      ],
      "description": "Total saturated fat (fatty acids, total saturated)"
    }
  }
}
~~~
@@@FILE_END path="reference/usda_fdc.json"@@@

@@@FILE_BEGIN path="reference/wikipathways.json" type="json" sha256="c3bd40d9e197d4a9f5aebba68ea680c58442a0f7ea8fd0ee6bb9b18b9c61c8e3"@@@
~~~json
{
  "metadata": {
    "source": "WikiPathways",
    "download_date": "2026-02-28"
  },
  "pathways": [
    {
      "wpid": "WP465",
      "title": "Tryptophan metabolism",
      "species": "Homo sapiens",
      "local_png_path": "reference/_build_artifacts/WP465.png",
      "notes": "Tryptophan metabolism has three major routes: direct transformation by gut microbiota, the kynurenine pathway in immune or epithelial cells, and serotonin production in enterochromaffin cells. The pathway includes Aryl hydrocarbon receptor signalling and shows the interplay between microbial and host enzymes.",
      "citation": "\u3010503417426545434\u2020L41-L50\u3011"
    },
    {
      "wpid": "WP4157",
      "title": "GABA metabolism (GHB metabolism)",
      "species": "Homo sapiens",
      "local_png_path": "reference/_build_artifacts/WP4157.png",
      "notes": "Gamma\u2011hydroxybutyric acid (GHB) is a neurotransmitter, a precursor for the inhibitory neurotransmitter GABA and a psychoactive drug. The pathway describes its production via succinic semialdehyde and notes fermentation sources and diseases such as succinic semialdehyde dehydrogenase deficiency.",
      "citation": "\u3010747654640290279\u2020L41-L50\u3011"
    },
    {
      "wpid": "WP4210",
      "title": "Tryptophan catabolism leading to NAD+ production",
      "species": "Homo sapiens",
      "local_png_path": "reference/_build_artifacts/WP4210.png",
      "notes": "Tryptophan is mainly used for protein synthesis but can be catabolised via the kynurenine pathway to generate intermediate metabolites culminating in NAD+ formation. This pathway emphasises that tryptophan is also a precursor to serotonin, melatonin and indole derivatives.",
      "citation": "\u3010480882251501725\u2020L41-L64\u3011"
    },
    {
      "wpid": "WP4159",
      "title": "GABA receptor signaling",
      "species": "Homo sapiens",
      "local_png_path": "reference/_build_artifacts/WP4159.png",
      "notes": "GABA is the main inhibitory neurotransmitter in the vertebrate central nervous system. GABA receptor signaling involves three receptor classes: GABAA and GABAC are ligand\u2011gated ion channels while GABAB is a G protein\u2011coupled receptor; receptor activity can be modulated by barbiturates and benzodiazepines.",
      "citation": "\u3010401337962315670\u2020L41-L53\u3011"
    }
  ]
}
~~~
@@@FILE_END path="reference/wikipathways.json"@@@
