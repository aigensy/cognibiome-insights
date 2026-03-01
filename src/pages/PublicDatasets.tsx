/**
 * PublicDatasets — Project-plan dataset status screen.
 *
 * Shows manifest-driven factual status for each dataset. The manifest
 * (/public/reference/public_datasets_manifest.json) is the source of truth.
 *
 * GUARDRAILS:
 * - No runtime external API calls (offline-first).
 * - No invented datasets, results, or evidence links.
 * - UI only claims datasets are included when manifest says so.
 */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle2, XCircle, Info, Eye, Download, ExternalLink, Search } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ManifestEntry {
  dataset: string;
  file: string;
  included: boolean;
  row_count?: number;
  sha256?: string;
  reason?: string;
  provenance?: {
    source_url?: string;
    notes?: string;
  };
}

interface NhanesRow {
  variable_code: string;
  nutrient_name: string;
  unit: string;
  min_value: string;
  max_value: string;
  source_year_range: string;
}

// ---------------------------------------------------------------------------
// NHANES slider mapping (UI-only reference context, does not affect model math)
// ---------------------------------------------------------------------------
const NHANES_SLIDER_MAP: Record<string, { variable_code: string; note?: string }> = {
  fiber_proxy: { variable_code: 'DR1TFIBE' },
  sat_fat_proxy: { variable_code: 'DR1TSFAT' },
  omega3_proxy: {
    variable_code: 'DR1TPFAT',
    note: 'Total polyunsaturated fatty acids used as proxy reference for Omega-3/PUFA slider.',
  },
  added_sugar_proxy: {
    variable_code: 'DR1TSUGR',
    note: 'NHANES snapshot includes Total sugars (DR1TSUGR) only; used as a proxy reference where needed.',
  },
};

// ---------------------------------------------------------------------------
// Static per-dataset background info (not from manifest; for context only)
// ---------------------------------------------------------------------------
interface DatasetContext {
  what: string;
  modelRole: string;
  usageConstraints?: string[];
  accessNotes?: string[];
}

const DATASET_CONTEXT: Record<string, DatasetContext> = {
  NHANES: {
    what: 'A US nationwide survey combining dietary interviews (24-hour recall), physical exams, and laboratory results for a representative civilian, non-institutionalized population.',
    modelRole:
      'Stage 1 (Diet → Microbiome proxy): NHANES dietary recall data grounds diet-quality inputs and provides population-level reference distributions for fiber, added-sugar, and saturated-fat intake.',
    usageConstraints: [
      'NHANES public-use data files may not be used for any purpose that could identify individual respondents.',
      'Any analysis should be for statistical reporting and educational use only.',
      'Cite as: "Data from the National Health and Nutrition Examination Survey, CDC/NCHS."',
    ],
  },
  HMP: {
    what: 'A US NIH initiative that characterized the microbiome of healthy adults across multiple body sites. HMP2/iHMP added longitudinal data including gut microbiome + metabolomics.',
    modelRole:
      'Stage 2 (Microbiome → Metabolites): HMP QIIME community profiling outputs would provide reference microbiome compositions to validate Stage 1 X-vector outputs.',
    accessNotes: [
      'HMP data is publicly accessible via HMPDACC (https://hmpdacc.org/).',
      'QIIME community profiling outputs (16S) are available for download without registration.',
      '"Value added" datasets (processed summaries) are also available via HMP DACC.',
    ],
  },
  'American Gut': {
    what: 'A citizen-science gut microbiome study (n > 10,000 participants) that collected self-reported dietary habits, health status, and 16S rRNA sequencing of fecal samples.',
    modelRole:
      'Stage 2 (Microbiome composition reference): American Gut genus-level summaries would provide a large, diet-annotated reference for the microbiome composition vector.',
    accessNotes: [
      'Sequences and metadata available via EBI accession PRJEB11419.',
      'Also available via Qiita (https://qiita.ucsd.edu/) study ID 10317.',
      'Processed BIOM artifacts can be downloaded without running raw sequence processing.',
    ],
  },
  MetaboLights: {
    what: 'An EMBL-EBI-hosted public repository for metabolomics experiments, covering a wide range of organisms, sample types, and analytical platforms.',
    modelRole:
      'Stage 3 (Metabolites → Cognition): MetaboLights studies with gut metabolite + behavioral/cognitive outcome data would provide reference for the M→Y stage.',
    usageConstraints: [
      'MetaboLights data is governed by EMBL-EBI Terms of Use (https://www.ebi.ac.uk/about/terms-of-use/).',
      'EMBL-EBI generally imposes no additional restrictions beyond those set by the data owners.',
      'Attribution is expected: cite the MetaboLights study accession and the original publication.',
    ],
  },
  'Metabolomics Workbench': {
    what: 'A US NIH-funded public repository for metabolomics studies, providing raw and processed metabolite measurements and reference standards from thousands of studies.',
    modelRole:
      'Stage 3 (Metabolites → Cognition): Metabolomics Workbench datasets with gut metabolite profiling matched with cognitive or behavioral outcomes would ground the M→Y stage coefficients.',
    usageConstraints: [
      'Content is for personal, non-commercial educational and research use.',
      'Do not redistribute raw study data unless redistribution is clearly permitted by the study data use agreement.',
      'See: https://www.metabolomicsworkbench.org/about/termsofuse.php',
    ],
  },
};

// ---------------------------------------------------------------------------
// CSV parser (same RFC-4180 logic used in HelpDocs)
// ---------------------------------------------------------------------------
function parseSimpleCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQ = false;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 2; }
      else if (ch === '"') { inQ = false; i++; }
      else { field += ch; i++; }
    } else {
      if (ch === '"') { inQ = true; i++; }
      else if (ch === ',') { row.push(field); field = ''; i++; }
      else if (ch === '\n' || ch === '\r') {
        row.push(field); field = '';
        if (ch === '\r' && text[i + 1] === '\n') i++;
        if (row.some(c => c !== '') || rows.length > 0) rows.push(row);
        row = []; i++;
      } else { field += ch; i++; }
    }
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function parseNhanesCSV(text: string): NhanesRow[] {
  const rows = parseSimpleCSV(text.trim());
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim());
  return rows.slice(1).map(r => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => { obj[h] = (r[idx] ?? '').trim(); });
    return obj as unknown as NhanesRow;
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const StatusBadge = ({ included }: { included: boolean }) =>
  included ? (
    <Badge className="bg-green-700/20 text-green-400 border-green-700/40 gap-1 shrink-0">
      <CheckCircle2 className="h-3 w-3" /> Snapshot bundled
    </Badge>
  ) : (
    <Badge variant="outline" className="text-amber-400 border-amber-700/40 gap-1 shrink-0">
      <XCircle className="h-3 w-3" /> Not bundled
    </Badge>
  );

function NhanesPreview({ rows }: { rows: NhanesRow[] }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      r =>
        r.variable_code.toLowerCase().includes(q) ||
        r.nutrient_name.toLowerCase().includes(q) ||
        r.unit.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const COLS: { key: keyof NhanesRow; label: string }[] = [
    { key: 'variable_code', label: 'Variable Code' },
    { key: 'nutrient_name', label: 'Nutrient Name' },
    { key: 'unit', label: 'Unit' },
    { key: 'min_value', label: 'Min' },
    { key: 'max_value', label: 'Max' },
    { key: 'source_year_range', label: 'Source Year' },
  ];

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-muted-foreground">
        Reference ranges from the NHANES DR1TOT_L codebook (2021–2022). No participant-level data. Not training data.
      </p>
      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search nutrients…"
          className="pl-7 h-7 text-xs"
          aria-label="Search NHANES nutrients"
        />
      </div>
      <div className="overflow-auto max-h-64 rounded border border-border" data-testid="nhanes-preview">
        <table className="text-xs border-collapse w-full">
          <thead className="sticky top-0">
            <tr>
              {COLS.map(c => (
                <th key={c.key} className="border border-border px-2 py-1 text-left bg-muted/80 font-medium">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, ri) => (
              <tr key={ri} className="hover:bg-muted/30">
                {COLS.map(c => (
                  <td key={c.key} className="border border-border px-2 py-1 font-mono">
                    {row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={COLS.length} className="text-center text-muted-foreground px-2 py-3">
                  No rows match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Slider mapping panel */}
      <div className="mt-2 rounded border border-border/50 p-2 bg-muted/20 space-y-1">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          Simulator slider → NHANES reference mapping (UI context only — does not affect model math)
        </p>
        {Object.entries(NHANES_SLIDER_MAP).map(([slider, mapping]) => {
          const nhanesRow = rows.find(r => r.variable_code === mapping.variable_code);
          return (
            <div key={slider} className="text-[10px] flex flex-wrap gap-x-2 gap-y-0.5 items-start">
              <span className="font-mono text-primary">{slider}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-mono">{mapping.variable_code}</span>
              {nhanesRow && (
                <span className="text-muted-foreground">
                  ({nhanesRow.nutrient_name}, {nhanesRow.unit}, max {nhanesRow.max_value})
                </span>
              )}
              {mapping.note && (
                <span className="text-amber-400/80 italic w-full">{mapping.note}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ManifestCard({
  entry,
  nhanesRows,
  navigate,
}: {
  entry: ManifestEntry;
  nhanesRows: NhanesRow[];
  navigate: (path: string) => void;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const ctx = DATASET_CONTEXT[entry.dataset];

  // The NHANES file path served from /public root
  const filePath = entry.file.startsWith('reference/')
    ? `/${entry.file}`
    : `/${entry.file}`;

  return (
    <Card data-testid={`dataset-card-${entry.dataset.replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{entry.dataset}</CardTitle>
          <StatusBadge included={entry.included} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {/* Manifest metadata */}
        <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
          {entry.row_count !== undefined && (
            <span className="font-mono">rows: {entry.row_count}</span>
          )}
          {entry.sha256 && (
            <span className="font-mono">sha256: {entry.sha256.slice(0, 12)}…</span>
          )}
          {entry.provenance?.source_url && (
            <span>source: {entry.provenance.source_url}</span>
          )}
          {entry.provenance?.notes && (
            <span className="italic">{entry.provenance.notes}</span>
          )}
        </div>

        {/* Static context */}
        {ctx && (
          <>
            <div>
              <span className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">
                What it is
              </span>
              <p className="mt-0.5 leading-relaxed">{ctx.what}</p>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">
                Role in 3-stage model
              </span>
              <p className="mt-0.5 leading-relaxed">{ctx.modelRole}</p>
            </div>
          </>
        )}

        {/* Not included reason */}
        {!entry.included && entry.reason && (
          <div>
            <span className="font-semibold text-amber-400 uppercase tracking-wide text-[10px]">
              Why not bundled
            </span>
            <p className="mt-0.5 leading-relaxed text-muted-foreground">{entry.reason}</p>
          </div>
        )}

        {/* Usage constraints */}
        {ctx?.usageConstraints && ctx.usageConstraints.length > 0 && (
          <div>
            <span className="font-semibold text-orange-400 uppercase tracking-wide text-[10px]">
              Usage constraints / terms
            </span>
            <ul className="mt-0.5 list-disc list-inside space-y-0.5 text-muted-foreground">
              {ctx.usageConstraints.map((c, i) => (
                <li key={i} className="leading-relaxed">{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Access notes */}
        {ctx?.accessNotes && ctx.accessNotes.length > 0 && (
          <div>
            <span className="font-semibold text-purple-400 uppercase tracking-wide text-[10px]">
              Access / availability notes
            </span>
            <ul className="mt-0.5 list-disc list-inside space-y-0.5 text-muted-foreground">
              {ctx.accessNotes.map((n, i) => (
                <li key={i} className="leading-relaxed">{n}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions for included datasets */}
        {entry.included && entry.file !== 'N/A' && (
          <div className="flex flex-wrap gap-2 pt-1">
            {entry.dataset === 'NHANES' && (
              <Button
                size="sm"
                variant="secondary"
                className="h-7 text-xs gap-1"
                onClick={() => setShowPreview(p => !p)}
                data-testid={`preview-btn-${entry.dataset.replace(/\s+/g, '-')}`}
              >
                <Eye className="h-3 w-3" /> {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1"
              onClick={() => navigate('/help')}
            >
              <ExternalLink className="h-3 w-3" /> Open in Docs
            </Button>
            <a href={filePath} download>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                data-testid={`download-btn-${entry.dataset.replace(/\s+/g, '-')}`}
              >
                <Download className="h-3 w-3" /> Download
              </Button>
            </a>
          </div>
        )}

        {/* NHANES Preview */}
        {showPreview && entry.dataset === 'NHANES' && nhanesRows.length > 0 && (
          <NhanesPreview rows={nhanesRows} />
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function PublicDatasets() {
  const navigate = useNavigate();
  const [manifest, setManifest] = useState<ManifestEntry[] | null>(null);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [nhanesRows, setNhanesRows] = useState<NhanesRow[]>([]);

  useEffect(() => {
    fetch('/reference/public_datasets_manifest.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: ManifestEntry[]) => {
        setManifest(data);
        // Pre-load NHANES CSV if included
        const nhEntry = data.find(e => e.dataset === 'NHANES' && e.included);
        if (nhEntry && nhEntry.file !== 'N/A') {
          const path = nhEntry.file.startsWith('reference/') ? `/${nhEntry.file}` : `/${nhEntry.file}`;
          fetch(path)
            .then(r2 => (r2.ok ? r2.text() : Promise.reject(new Error(`HTTP ${r2.status}`))))
            .then(csv => setNhanesRows(parseNhanesCSV(csv)))
            .catch(() => setNhanesRows([]));
        }
      })
      .catch(e => setManifestError(String(e)));
  }, []);

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
          Status is driven by{' '}
          <code>/reference/public_datasets_manifest.json</code>.{' '}
          <strong>The app makes no runtime API calls.</strong> Only files listed as{' '}
          <code>included: true</code> in the manifest are actually bundled.
        </AlertDescription>
      </Alert>

      {manifestError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Manifest load error</AlertTitle>
          <AlertDescription className="text-xs">
            {manifestError}. Ensure <code>public/reference/public_datasets_manifest.json</code> exists.
          </AlertDescription>
        </Alert>
      )}

      {manifest === null && !manifestError && (
        <p className="text-sm text-muted-foreground animate-pulse">Loading manifest…</p>
      )}

      {manifest && (
        <>
          {/* Summary table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Snapshot Manifest Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="text-xs border-collapse w-full" data-testid="manifest-table">
                  <thead>
                    <tr>
                      {['Dataset', 'Bundled', 'Rows', 'File', 'Source'].map(h => (
                        <th key={h} className="border border-border px-2 py-1 text-left bg-muted/50 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {manifest.map(entry => (
                      <tr key={entry.dataset} className="hover:bg-muted/20">
                        <td className="border border-border px-2 py-1 font-medium">{entry.dataset}</td>
                        <td className="border border-border px-2 py-1">
                          {entry.included ? (
                            <span className="text-green-400">Yes</span>
                          ) : (
                            <span className="text-amber-400">No</span>
                          )}
                        </td>
                        <td className="border border-border px-2 py-1 font-mono">
                          {entry.row_count ?? '—'}
                        </td>
                        <td className="border border-border px-2 py-1 font-mono text-[10px] max-w-[200px] truncate">
                          {entry.file}
                        </td>
                        <td className="border border-border px-2 py-1 text-[10px] max-w-[200px] truncate text-muted-foreground">
                          {entry.provenance?.source_url ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Per-dataset detail cards */}
          {manifest.map(entry => (
            <ManifestCard
              key={entry.dataset}
              entry={entry}
              nhanesRows={nhanesRows}
              navigate={navigate}
            />
          ))}
        </>
      )}

      {/* SHAP / Explainability Gap */}
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
              per-feature importance scores at each model stage.
            </p>
          </div>
          <div>
            <span className="font-semibold text-amber-400 uppercase tracking-wide text-[10px]">
              Current status
            </span>
            <p className="mt-0.5 leading-relaxed text-muted-foreground">
              <strong>Not implemented in MVP.</strong> The Simulator uses pre-trained coefficient arrays
              that produce numeric outputs but do not expose per-feature SHAP values. No SHAP library is bundled.
            </p>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">
              Where it would appear if implemented
            </span>
            <ul className="mt-0.5 list-disc list-inside space-y-0.5">
              <li><strong>Simulator page:</strong> Feature Importance panel per stage (SHAP bar charts).</li>
              <li><strong>Export Report:</strong> SHAP summary table in the downloadable HTML report.</li>
              <li><strong>Methods & Rigor:</strong> SHAP methodology + interpretation guardrails.</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-sky-400 uppercase tracking-wide text-[10px]">
              Planned path (offline training notebooks only)
            </span>
            <p className="mt-0.5 leading-relaxed">
              SHAP analysis is planned for offline Jupyter notebooks. The training notebook would:
              (1) fit the model, (2) run <code>shap.Explainer</code>, (3) export per-feature mean |SHAP|
              values as a small JSON artifact (e.g. <code>public/models/shap_stage1.json</code>).
              The frontend would render these pre-computed values — no runtime SHAP computation, consistent
              with the offline-first guardrail.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}