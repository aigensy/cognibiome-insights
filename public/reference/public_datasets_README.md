# Public Datasets Reference Snapshots

This repository contains small, aggregated reference tables to
support the project plan.  Each table summarises key features
from a much larger dataset but omits any individual or
controlled‑access data.  Entries marked as not included in
the manifest are accompanied by download instructions.  All
data sources are official repositories managed by government
agencies or international consortia.  Access dates below
reflect the date this snapshot was prepared (2026-03-01).

## NHANES nutrient reference

The `nhanes_nutrient_reference.csv` file is derived from the
*Dietary Interview – Total Nutrient Intakes, Day 1 (DR1TOT_L)*
documentation for the 2021–2022 cycle of the National Health
and Nutrition Examination Survey (NHANES).  The codebook lists
each nutrient variable along with its label and the range of
observed values.  We extracted a small set of macro- and
micro-nutrients (energy, protein, carbohydrate, sugars, fiber,
fats and cholesterol) and recorded their variable codes, names,
units, and value ranges.  No participant identifiers or
individual-level data are included.  Use of NHANES public
datasets is governed by the National Center for Health Statistics
(NCHS) Data User Agreement, which permits only statistical
analysis and reporting and prohibits any attempt to identify
individuals【680486935310208†L94-L134】.

Provenance: the variable names and ranges were transcribed
manually from the DR1TOT_L codebook available on the CDC
website【783734059706994†L1418-L1542】.

## HMP genus reference

The Human Microbiome Project (HMP) Data Analysis and
Coordination Center publishes value‑added QIIME community
profiling outputs summarising 16S rRNA sequencing data.  These
outputs are hosted at `downloads.hmpdacc.org`.  In this
environment we were unable to access the OTU abundance tables
(e.g., `otu_table_psn_v35.txt.gz`) due to network restrictions
and therefore could not construct a genus reference table.
Researchers may download the OTU tables and associated mapping
files directly from the HMP DACC website (for example,
`http://downloads.hmpdacc.org/data/HMQCP/otu_table_psn_v35.txt.gz`)
and process them locally using QIIME or phyloseq.  The manifest
marks this dataset as not included.

## American Gut genus reference

The American Gut Project (AGP) data are hosted through Qiita
(study ID 10317) and the European Nucleotide Archive (ENA).  
Public BIOM and metadata files are available via Qiita but
require user authentication, and we were unable to download them
within this environment.  The ENA accession `PRJEB11419`
provides access to raw sequence reads but not processed genus
abundance tables【887764672911045†L34-L47】.  Consequently, no AGP genus
reference table is included.  Interested users should log into
Qiita and download the processed BIOM table and mapping file
for study 10317, then summarize the data to genus level.

## MetaboLights and Metabolomics Workbench

MetaboLights is an EMBL‑EBI repository for metabolomics studies.
Data are governed by EMBL‑EBI’s Terms of Use and may carry
dataset‑specific licences【844499878334676†L124-L126】.  Because each study
may have its own licence and many datasets contain sensitive
metabolomics measurements, we did not attempt to redistribute any
data.

The NIH Metabolomics Workbench hosts metabolomics datasets for
research use.  The terms of use stipulate that data are for
personal, non‑commercial research only and forbid redistribution
without permission (the full terms are available on the
Metabolomics Workbench website).  Due to these restrictions and
the fact that we could not access the site in this environment,
no Metabolomics Workbench snapshots are included.
