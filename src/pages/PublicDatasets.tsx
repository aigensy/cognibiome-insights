/**
 * PublicDatasets — Project-plan dataset status screen.
 *
 * Shows factual, cautious status for each dataset listed in the Project Plan
 * (NHANES, HMP, American Gut, Metabolomics Workbench, MetaboLights).
 * Also documents the SHAP / explainability gap per task E.
 *
 * GUARDRAILS:
 * - No runtime external API calls (offline-first).
 * - No invented datasets, results, or evidence links.
 * - Unimplemented features are labelled "Not implemented" with reasons + next steps.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';

interface DatasetEntry {
  id: string;
  name: string;
  what: string;
  modelRole: string;
  implemented: boolean;
  whyNot?: string;
  nextSteps?: string;
  usageConstraints?: string[];
  accessNotes?: string[];
}

const DATASETS: DatasetEntry[] = [
  {
    id: 'NHANES',
    name: 'NHANES (National Health and Nutrition Examination Survey)',
    what:
      'A US nationwide survey combining dietary interviews (24-hour recall), physical exams, and laboratory results for a representative civilian, non-institutionalized population.',
    modelRole:
      'Stage 1 (Diet → Microbiome proxy): NHANES dietary recall data would ground the diet-quality inputs and provide population-level reference distributions for fiber, added-sugar, and saturated-fat intake.',
    implemented: false,
    whyNot:
      'NHANES public-use files are large (>50 MB per survey cycle), require harmonization across cycles (I, II, III, continuous), and the microbiome linkage is not in the standard public-use files. ' +
      'A meaningful offline snapshot would require custom preprocessing scripts and IRB-level awareness of re-identification risk.',
    nextSteps:
      'Feasible next step: download NHANES 2017–March 2020 dietary recall data (DR1TOT_P.XPT), filter to age 13–19, select 4–6 nutrient columns (DR1TFIBE, DR1TSUGR, DR1TSFAT, DR1TCALS), sample ≤300 rows, convert to CSV. ' +
      'Plug in as a "Reference Population" overlay on the Pilot Results page scatter plots.',
    usageConstraints: [
      'NHANES public-use data files may not be used for any purpose that could identify individual respondents.',
      'Any analysis should be for statistical reporting and educational use only — not for identifying or re-identifying individuals.',
      'Cite as: "Data from the National Health and Nutrition Examination Survey, CDC/NCHS."',
      'See: https://www.cdc.gov/nchs/nhanes/about_nhanes.htm',
    ],
  },
  {
    id: 'HMP',
    name: 'HMP (Human Microbiome Project)',
    what:
      'A US NIH initiative that characterized the microbiome of healthy adults across multiple body sites (gut, oral, skin, urogenital). ' +
      'HMP1 established reference ranges; HMP2 / iHMP added longitudinal data including gut microbiome + metabolomics for IBD, T2D, and preterm birth cohorts.',
    modelRole:
      'Stage 2 (Microbiome → Metabolites): HMP QIIME community profiling outputs (16S OTU tables, genus-level relative abundances) would provide reference microbiome compositions to validate the X-vector outputs of Stage 1.',
    implemented: false,
    whyNot:
      'The QIIME/biom outputs are large multi-GB files. Even the summarized OTU tables require bioinformatics tooling (QIIME2, biom-format) to process. ' +
      'There is no single small download that covers both microbiome composition and matched dietary data for teenagers.',
    nextSteps:
      'Feasible next step: download the HMP DACC "value added" genus-level summary table for the gut microbiome reference set (available at https://hmpdacc.org/hmp/). ' +
      'Filter to the 10 genera of interest (Bifidobacterium, Lactobacillus, Faecalibacterium, Akkermansia, Roseburia, Clostridium, Bacteroides, Ruminococcus). ' +
      'Store as a ≤300-row JSON snapshot. Plug in as reference ranges on the Simulator output panel.',
    accessNotes: [
      'HMP data is publicly accessible via HMPDACC (https://hmpdacc.org/).',
      'QIIME community profiling outputs (16S) are available for download without registration.',
      '"Value added" datasets (processed summaries) are also available via HMP DACC.',
      'No special data use agreement is required for the public-use files, but citation is expected.',
      'Cite as: "Data from the Human Microbiome Project, NIH."',
    ],
  },
  {
    id: 'AMERICAN_GUT',
    name: 'American Gut Project',
    what:
      'A citizen-science gut microbiome study (n > 10,000 participants) that collected self-reported dietary habits, health status, and 16S rRNA sequencing of fecal samples. ' +
      'It is now one of the largest open-access microbiome datasets available.',
    modelRole:
      'Stage 2 (Microbiome composition reference): American Gut genus-level summaries would provide a large, diet-annotated reference for the microbiome composition vector, ' +
      'allowing the Simulator to show where the model-predicted composition sits relative to real participants.',
    implemented: false,
    whyNot:
      'The full dataset is hosted on EBI (PRJEB11419) and Qiita (study 10317) as raw FASTQ sequences — terabytes of data. ' +
      'Processed summaries exist but require bioinformatics pipeline runs (DEBLUR/DADA2 + QIIME2) to produce genus-level tables.',
    nextSteps:
      'Feasible next step: access the Qiita public download endpoint for study 10317 (see access notes below). ' +
      'Download the pre-computed BIOM artifact, subset to ≤300 samples with diet quality metadata, extract genus-level relative abundances for the 10 target genera. ' +
      'Store as a JSON snapshot and plug into the reference overlay on the Simulator page.',
    accessNotes: [
      'Sequences and metadata are publicly available via EBI under project accession PRJEB11419.',
      'Also available via Qiita (https://qiita.ucsd.edu/) study ID 10317.',
      'Qiita provides a direct public download endpoint for approved studies — no authentication is required for public studies.',
      'Processed BIOM artifacts (OTU/feature tables) can be downloaded directly without running raw sequence processing.',
      'Data is released under a CC0 waiver (sequences) and EBI standard terms (metadata). Attribution expected.',
    ],
  },
  {
    id: 'METABOLOMICS_WORKBENCH',
    name: 'Metabolomics Workbench',
    what:
      'A US NIH-funded public repository for metabolomics studies, providing raw and processed metabolite measurements, study metadata, and reference standards from thousands of studies.',
    modelRole:
      'Stage 3 (Metabolites → Cognition): Metabolomics Workbench datasets that include gut metabolite profiling (SCFAs, tryptophan metabolites) matched with cognitive or behavioral outcomes ' +
      'would ground the M→Y stage coefficients.',
    implemented: false,
    whyNot:
      'Individual studies vary widely in metabolite panel, sample matrix (plasma, urine, fecal), and population. ' +
      'Finding a study with matched gut microbiome + metabolomics + cognitive outcomes in adolescents is non-trivial. ' +
      'Harmonizing metabolite names/IDs (HMDB, KEGG, CAS) across studies adds complexity. ' +
      'Data sizes are moderate (MBs per study) but processing requires domain expertise.',
    nextSteps:
      'Feasible next step: search Metabolomics Workbench (https://www.metabolomicsworkbench.org/) for studies tagged with "gut" + "SCFA" or "tryptophan". ' +
      'Download summary statistics (mean ± SD per group) for ≤10 metabolites from a single study. ' +
      'Store as a ≤300-row reference table. Plug in as "reference ranges" on the Simulator metabolite output panel.',
    usageConstraints: [
      'Metabolomics Workbench content is for personal, non-commercial educational and research use.',
      'Do not redistribute raw study data unless redistribution is clearly permitted by the study\'s own data use agreement.',
      'Always check the individual study\'s data use policy on the Metabolomics Workbench study page before redistribution.',
      'Attribution: cite the Metabolomics Workbench repository and the original study.',
      'See: https://www.metabolomicsworkbench.org/about/termsofuse.php',
    ],
  },
  {
    id: 'METABOLIGHTS',
    name: 'MetaboLights',
    what:
      'An EMBL-EBI-hosted public repository for metabolomics experiments, including raw data, processed results, and experimental metadata, ' +
      'covering a wide range of organisms, sample types, and analytical platforms.',
    modelRole:
      'Stage 3 (Metabolites → Cognition): MetaboLights studies with gut metabolite + behavioral/cognitive outcome data would provide an additional reference for the M→Y stage, ' +
      'complementing Metabolomics Workbench with European cohort data.',
    implemented: false,
    whyNot:
      'Same harmonization complexity as Metabolomics Workbench. ' +
      'Studies relevant to gut-brain axis with cognitive outcomes are sparse. ' +
      'EMBL-EBI data download works well but study-level data use agreements vary.',
    nextSteps:
      'Feasible next step: browse MetaboLights (https://www.ebi.ac.uk/metabolights/) for studies tagged with "gut microbiome" or "short-chain fatty acids" + human subjects. ' +
      'Download the processed metabolite summary for ≤10 target compounds from a single study. ' +
      'Store as a ≤300-row JSON/CSV and plug into the Simulator reference overlay.',
    usageConstraints: [
      'MetaboLights data is governed by EMBL-EBI Terms of Use (https://www.ebi.ac.uk/about/terms-of-use/).',
      'EMBL-EBI generally imposes no additional restrictions beyond those set by the data owners (original study PIs).',
      'Attribution is expected: cite the MetaboLights study accession and the original publication.',
      'Review the individual study\'s data use agreement on the MetaboLights study page before redistribution.',
    ],
  },
];

const StatusBadge = ({ ok }: { ok: boolean }) =>
  ok ? (
    <Badge className="bg-green-700/20 text-green-400 border-green-700/40 gap-1">
      <CheckCircle2 className="h-3 w-3" /> Implemented
    </Badge>
  ) : (
    <Badge variant="outline" className="text-amber-400 border-amber-700/40 gap-1">
      <XCircle className="h-3 w-3" /> Not implemented
    </Badge>
  );

export default function PublicDatasets() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Public Datasets Status</h1>
        <p className="text-xs text-muted-foreground mt-1">
          NHANES · HMP · American Gut · Metabolomics Workbench · MetaboLights
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Offline-first guardrail</AlertTitle>
        <AlertDescription className="text-xs">
          The Project Plan lists these datasets for the 3-stage model (Diet → Microbiome → Metabolites → Cognition).
          This screen documents current implementation status honestly.{' '}
          <strong>The app makes no runtime API calls</strong> — any dataset integration must be a pre-built offline
          snapshot bundled with the project.
        </AlertDescription>
      </Alert>

      {DATASETS.map(ds => (
        <Card key={ds.id}>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <CardTitle className="text-base leading-snug">{ds.name}</CardTitle>
              <StatusBadge ok={ds.implemented} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">
                What it is
              </span>
              <p className="mt-0.5 leading-relaxed">{ds.what}</p>
            </div>

            <div>
              <span className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">
                Role in 3-stage model
              </span>
              <p className="mt-0.5 leading-relaxed">{ds.modelRole}</p>
            </div>

            {!ds.implemented && ds.whyNot && (
              <div>
                <span className="font-semibold text-amber-400 uppercase tracking-wide text-[10px]">
                  Why not implemented
                </span>
                <p className="mt-0.5 leading-relaxed text-muted-foreground">{ds.whyNot}</p>
              </div>
            )}

            {!ds.implemented && ds.nextSteps && (
              <div>
                <span className="font-semibold text-sky-400 uppercase tracking-wide text-[10px]">
                  Next steps (feasible offline snapshot)
                </span>
                <p className="mt-0.5 leading-relaxed">{ds.nextSteps}</p>
              </div>
            )}

            {ds.usageConstraints && ds.usageConstraints.length > 0 && (
              <div>
                <span className="font-semibold text-orange-400 uppercase tracking-wide text-[10px]">
                  Usage constraints / terms
                </span>
                <ul className="mt-0.5 list-disc list-inside space-y-0.5 text-muted-foreground">
                  {ds.usageConstraints.map((c, i) => (
                    <li key={i} className="leading-relaxed">{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {ds.accessNotes && ds.accessNotes.length > 0 && (
              <div>
                <span className="font-semibold text-purple-400 uppercase tracking-wide text-[10px]">
                  Access / availability notes
                </span>
                <ul className="mt-0.5 list-disc list-inside space-y-0.5 text-muted-foreground">
                  {ds.accessNotes.map((n, i) => (
                    <li key={i} className="leading-relaxed">{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* SHAP / Explainability Gap (Task E) */}
      <Card className="border-amber-700/30">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">
              SHAP / Explainability Analysis
            </CardTitle>
            <Badge variant="outline" className="text-amber-400 border-amber-700/40 gap-1">
              <AlertTriangle className="h-3 w-3" /> Not implemented in MVP
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div>
            <span className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">
              What the Project Plan specifies
            </span>
            <p className="mt-0.5 leading-relaxed">
              The Project Plan lists SHAP (SHapley Additive exPlanations) for explainable-AI analysis —
              specifically, per-feature importance scores at each model stage to show which dietary or
              microbiome features drive a given prediction.
            </p>
          </div>

          <div>
            <span className="font-semibold text-amber-400 uppercase tracking-wide text-[10px]">
              Current status
            </span>
            <p className="mt-0.5 leading-relaxed text-muted-foreground">
              <strong>Not implemented in MVP.</strong> The current Simulator uses pre-trained coefficient
              arrays (stage1.json, stage2.json, stage3.json) that produce numeric outputs but do not
              expose per-feature SHAP values. No SHAP library is bundled in the frontend.
            </p>
          </div>

          <div>
            <span className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">
              Where it would appear if implemented
            </span>
            <ul className="mt-0.5 list-disc list-inside space-y-0.5">
              <li>
                <strong>Simulator page:</strong> a "Feature Importance" panel per stage showing SHAP bar
                charts (e.g. fiber contribution to microbiome shift at Stage 1).
              </li>
              <li>
                <strong>Export Report:</strong> a SHAP summary table included in the downloadable HTML report.
              </li>
              <li>
                <strong>Methods & Rigor:</strong> a section explaining SHAP methodology and its
                interpretation guardrails (correlation ≠ causation).
              </li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-sky-400 uppercase tracking-wide text-[10px]">
              Planned path (offline training notebooks only)
            </span>
            <p className="mt-0.5 leading-relaxed">
              SHAP analysis is planned for offline Jupyter notebooks that train the stage models.
              The training notebook would: (1) fit the regression/ensemble model, (2) run{' '}
              <code>shap.Explainer</code> on the validation set, (3) export per-feature mean |SHAP|
              values as a small JSON artifact (e.g. <code>public/models/shap_stage1.json</code>).
              The frontend would then render these pre-computed values — no runtime SHAP computation needed,
              consistent with the offline-first guardrail.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
