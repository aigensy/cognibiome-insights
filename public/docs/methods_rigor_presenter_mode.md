# Methods & Rigor — Presenter Mode (User Guide)

The **Methods & Rigor** screen is the "trust layer" for judges. In **Presenter Mode**, it is designed to answer two questions quickly:

1. **What is real measured data vs what is modeled?**
2. **What data sources are used now, and what would be needed for true training later?**

---

## 1) Limitations & Scientific Wording (Presenter cue)

![Methods & Rigor — Limitations and Leakage Guardrails](/docs/screenshots/methods_limitations_and_guardrails.png)

This top card is the **primary Presenter Mode talking point**. It contains three short statements intended to be read almost verbatim:

- **"All microbiome and metabolite outputs are MODELED / ESTIMATED proxies — not measured biomarkers from pilot participants."**
- **"This simulator generates testable hypotheses. It does NOT prove causality or mechanism."**
- **"Educational research prototype. NOT medical advice. NOT a diagnostic device."**

### Presenter cue badge

A small **"Presenter cue"** badge appears in Presenter Mode.
It is **not a button**. It is a visual reminder of what the presenter should point to and say.

### Important clarification line (small text under the three statements)

This line explains the key limitation of the pilot dataset:

- The teen pilot **does not include measured microbiome or metabolomics**.
- Intermediate outputs (**X = microbiome**, **M = metabolites**) are **proxy model outputs**, derived from published reference context, not from the pilot participants.

---

## 2) Leakage Guardrails (validation integrity)

This card explains how the app avoids "data leakage" claims during judging:

- **Pilot dataset is validation-only** — Not used for training or tuning.
- **No peeking during tuning** — Model artifacts are frozen before pilot validation.
- **Fit-only-on-train (conceptual)** — Preprocessing would be fit on training data only in a future training pipeline.
- **Duplicate/near-duplicate awareness** — Pilot records are unique de-identified entries.

Footer note:

- **No performance numbers are fabricated.**
- Demo parameters are directional placeholders.

---

## 3) Data Sources (Paired vs Unpaired)

![Data Sources — Paired vs Unpaired table](/docs/screenshots/methods_data_sources_table.png)

This table is the most important "anti-overclaim" element on the screen.

### What "Paired vs Unpaired" means

- **Paired** = inputs and outputs measured in the **same participants** (needed to train supervised ML).
- **Unpaired** = separate studies / knowledge bases used as **reference context** (not sufficient to claim trained predictive mapping).

The screen explicitly states: current **v0.1 simulator stages are UNPAIRED** and use frozen demo coefficients.

### Table columns

| Column | Meaning |
|---|---|
| Stage | Which link in the pipeline is being discussed (D→X, X→M, M→Y, Validation) |
| Inputs / Outputs | What each stage consumes and produces |
| Dataset Types | What is used now vs what would be needed in the future |
| Notes | Guardrails to prevent incorrect training claims |

### Row meanings (v0.1)

**D→X (Diet → Microbiome proxies)**
- Current v0.1 is **UNPAIRED** (frozen demo coefficients; **not trained on NHANES**).
- NHANES is listed only as **UI reference context** (codebook-style), not training data.

**X→M (Microbiome proxies → Metabolite proxies)**
- Current v0.1 is **UNPAIRED** (frozen demo coefficients).
- MiMeDB is used as **reference context**, but any microbe→metabolite links are treated as **unconfirmed** in this build.

**M→Y (Metabolite proxies → Cognitive outputs)**
- Current v0.1 is **UNPAIRED** (frozen demo coefficients).
- Future requires a properly paired cohort that includes **cognitive + metabolomics** in the same participants.

**Validation**
- The teen pilot (n=66, de-identified) is **PAIRED only for Diet Score ↔ Cognitive metrics**.
- The pilot contains **no paired microbiome or metabolomics**.

---

## 4) MiMeDB Evidence (offline snapshot, licensing caution)

![MiMeDB Evidence — Metabolites tab](/docs/screenshots/methods_mimedb_metabolites_tab.png)

![MiMeDB Evidence — Microbes tab](/docs/screenshots/methods_mimedb_microbes_tab.png)

This section documents what is bundled offline from MiMeDB and what is **not** claimable.

### License status

A badge states **"License not confirmed"**. This is deliberate: the app **does not claim** license terms from within the repo.

### What is bundled in this build

A **build-time offline snapshot** derived from **MiMeDB v2 CSV exports** (metabolites + microbes). The screen displays:

- Source label (local CSV build)
- Build date
- Counts (how many records are shown vs total exports)

### What is NOT bundled / not claimable

- The CSV exports **do not include a verified microbe↔metabolite join table** in this build.
- Therefore the app **does not claim confirmed microbe↔metabolite links** offline.
- Any "links" concept must be treated as **unconfirmed**.

### Tabs and tables

**Metabolites tab**
- Shows a small curated list of metabolites relevant to the simulator.
- Columns: Name, MIME ID, App Role, Formula, Avg Mass, Relations count (export).
- **Relations count (export)** = a count field from exports — not a verified join table.

**Microbes tab**
- Shows a small curated list of microbes from the export.
- Columns: Species, Genus, Phylum, Gram, Activity.
- "Activity" values may be sparse; this is noted as a limitation.

### Limitations list (bottom of the MiMeDB panel)

- No join table in exports (count-only relations field).
- Links cannot be confirmed from the parsed MiMeDB files in this build.
- Some fields can be NULL (activity often missing).
- Snapshot is intentionally small and aligned to the simulator scope.
- Official terms should be checked on the MiMeDB site (not accessed at runtime).

---

## Presenter-safe wording (what to say)

Use these short phrases to stay consistent with the speech and the UI:

- "Pilot data is real and de-identified; it supports correlation, not causation."
- "Microbiome and metabolite values shown in the simulator are modeled proxies, not measured biomarkers from the pilot."
- "v0.1 uses frozen demo coefficients; it is not trained on NHANES in this build."
- "MiMeDB is bundled as an offline reference snapshot; licensing is not asserted here, and microbe↔metabolite links are not claimed as confirmed."

## What NOT to claim (avoid judge pushback)

- Do NOT say the simulator is trained on NHANES, HMP, American Gut, or MiMeDB in the current build.
- Do NOT imply measured microbiome/metabolomics exist for the teen pilot.
- Do NOT imply MiMeDB provides a confirmed microbe↔metabolite join dataset in this build.
