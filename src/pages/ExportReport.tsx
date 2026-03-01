import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, Printer, FileText } from 'lucide-react';
import { getSavedRuns, type SimulationResult } from '@/lib/simulator';
import { DISCLAIMERS } from '@/world_model/worldModel';
import { useAppState } from '@/contexts/AppContext';
import { computeSummaryStats, computeCorrelations } from '@/lib/statistics';
import type { PilotRecord } from '@/lib/pilotParser';

const LEAKAGE_ITEMS = [
  { label: 'Pilot dataset is validation-only', desc: 'Not used for training or tuning.' },
  { label: 'No peeking during tuning', desc: 'Model artifacts frozen before pilot validation.' },
  { label: 'Fit-only-on-train', desc: 'Preprocessing fitted on training data only (conceptual).' },
  { label: 'Duplicate/near-duplicate awareness', desc: 'Pilot records are unique de-identified entries.' },
];

interface GenerateOptions {
  includePilotSummary: boolean;
  includeLeakageChecklist: boolean;
  pilotRecords: PilotRecord[];
}

export function generateHTML(run: SimulationResult, opts: GenerateOptions): string {
  const { includePilotSummary, includeLeakageChecklist, pilotRecords } = opts;

  let pilotSection = '';
  if (includePilotSummary && pilotRecords.length > 0) {
    const stats = computeSummaryStats(pilotRecords);
    const corrs = computeCorrelations(pilotRecords);

    const statsRows = stats
      .map(
        s =>
          `<tr><td>${s.label}</td><td>${s.n}</td><td>${s.mean}</td><td>${s.median}</td>` +
          `<td>${s.stdDev}</td><td>${s.min}</td><td>${s.max}</td></tr>`
      )
      .join('');

    const corrRows = corrs
      .map(
        c =>
          `<tr><td>${c.labelY}</td><td>${c.pearsonR.toFixed(3)}</td>` +
          `<td>${c.pValue !== null ? c.pValue.toFixed(4) : '—'}</td><td>${c.n}</td></tr>`
      )
      .join('');

    pilotSection = `
<h2>Pilot Dataset Summary (n=${pilotRecords.length})</h2>
<p class="warn">REAL DATA — de-identified teen pilot. No synthetic points. Validation-only.</p>
<h3>Summary Statistics</h3>
<table>
  <tr><th>Metric</th><th>n</th><th>Mean</th><th>Median</th><th>SD</th><th>Min</th><th>Max</th></tr>
  ${statsRows}
</table>
<h3>Correlations (Diet Score vs Cognitive Metrics)</h3>
<p class="note">p-values are approximate (Abramowitz &amp; Stegun). Not proof of causality.</p>
<table>
  <tr><th>Metric</th><th>Pearson r</th><th>p-value (approx)</th><th>n</th></tr>
  ${corrRows}
</table>`;
  } else if (includePilotSummary && pilotRecords.length === 0) {
    pilotSection = `<h2>Pilot Dataset Summary</h2><p class="warn">Cannot confirm — pilot dataset not loaded.</p>`;
  }

  let leakageSection = '';
  if (includeLeakageChecklist) {
    const items = LEAKAGE_ITEMS.map(
      item => `<li><strong>${item.label}</strong> — ${item.desc}</li>`
    ).join('');
    leakageSection = `
<h2>Leakage Guardrails Checklist</h2>
<ul>${items}</ul>
<p class="note">No model performance numbers are fabricated. Demo parameters are directional placeholders.</p>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>CogniBiome Report — ${run.runHash.slice(0, 12)}</title>
<style>
body{font-family:system-ui,sans-serif;max-width:820px;margin:auto;padding:24px;color:#e2e8f0;background:#0f172a}
h1{font-size:1.4em;margin-bottom:0.25em}
h2{font-size:1.1em;margin-top:1.5em;border-top:1px solid #334155;padding-top:0.5em}
h3{font-size:0.95em;margin-top:1em;color:#94a3b8}
table{width:100%;border-collapse:collapse;font-size:0.82em;margin:0.5em 0}
td,th{padding:4px 8px;border:1px solid #334155;text-align:left}
th{background:#1e293b}
.badge{background:#1e40af;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.72em;display:inline-block}
.warn{color:#fbbf24;font-size:0.8em}
.note{color:#94a3b8;font-size:0.78em;font-style:italic}
ul{font-size:0.85em;margin:0.5em 0;padding-left:1.4em}
li{margin-bottom:0.4em}
</style>
</head>
<body>
<h1>CogniBiome Simulation Report</h1>
<span class="badge">MODELED / ESTIMATED (proxy)</span>

<h2>Run Provenance</h2>
<table>
  <tr><th>Run Hash</th><td style="font-family:monospace;font-size:0.75em">${run.runHash}</td></tr>
  <tr><th>Timestamp</th><td>${run.timestamp}</td></tr>
  <tr><th>Stage 1</th><td>${run.modelVersions.stage1}</td></tr>
  <tr><th>Stage 2</th><td>${run.modelVersions.stage2}</td></tr>
  <tr><th>Stage 3</th><td>${run.modelVersions.stage3}</td></tr>
</table>

<h2>Diet Inputs</h2>
<table>
  <tr><th>Fiber</th><td>${run.inputs.fiber_proxy} g/day</td><th>Added Sugar</th><td>${run.inputs.added_sugar_proxy} g/day</td></tr>
  <tr><th>Sat Fat</th><td>${run.inputs.sat_fat_proxy} g/day</td><th>Omega-3</th><td>${run.inputs.omega3_proxy} g/day</td></tr>
  <tr><th>Diet Score (proxy)</th><td colspan="3">${run.dietScoreProxy}</td></tr>
</table>

<h2>Microbiome (Modeled Proxy)</h2>
<table>
  <tr><th>Bifidobacterium</th><td>${run.microbiome.bifidobacterium.toFixed(3)}</td>
      <th>Lactobacillus</th><td>${run.microbiome.lactobacillus.toFixed(3)}</td></tr>
  <tr><th>F:B Ratio</th><td colspan="3">${run.microbiome.fb_ratio.toFixed(3)}</td></tr>
</table>

<h2>Metabolites (Modeled Proxy)</h2>
<table>
  <tr><th>Acetate</th><td>${run.metabolites.acetate.toFixed(3)}</td>
      <th>Propionate</th><td>${run.metabolites.propionate.toFixed(3)}</td></tr>
  <tr><th>Butyrate</th><td>${run.metabolites.butyrate.toFixed(3)}</td>
      <th>5-HTP Index</th><td>${run.metabolites.five_htp_index.toFixed(3)}</td></tr>
</table>

<h2>Cognition (Modeled Proxy)</h2>
<table>
  <tr><th>Stroop</th><td>${run.cognition.stroop_test.toFixed(2)}</td>
      <th>Language</th><td>${run.cognition.language_test.toFixed(2)}</td></tr>
  <tr><th>Memory</th><td>${run.cognition.memory_test.toFixed(2)}</td>
      <th>Logical</th><td>${run.cognition.logical_test.toFixed(2)}</td></tr>
  <tr><th>Overall</th><td colspan="3">${run.cognition.overall_score.toFixed(2)}</td></tr>
</table>

${pilotSection}
${leakageSection}

<h2>Disclaimers</h2>
<p class="warn">⚠ ${DISCLAIMERS.nonCausal}</p>
<p class="warn">⚠ ${DISCLAIMERS.nonDiagnostic}</p>
<p class="warn">⚠ ${DISCLAIMERS.modeledProxy}</p>
<p class="warn">⚠ ${DISCLAIMERS.pilotValidation}</p>
<p class="warn">⚠ ${DISCLAIMERS.demoParams}</p>
</body>
</html>`;
}

export default function ExportReport() {
  const { pilotDataset } = useAppState();
  const runs = getSavedRuns();
  const [selectedHash, setSelectedHash] = useState(runs[0]?.runHash ?? '');
  const [includePilotSummary, setIncludePilotSummary] = useState(true);
  const [includeLeakageChecklist, setIncludeLeakageChecklist] = useState(true);

  const selectedRun = runs.find(r => r.runHash === selectedHash);

  const buildOptions = (): GenerateOptions => ({
    includePilotSummary,
    includeLeakageChecklist,
    pilotRecords: pilotDataset?.records ?? [],
  });

  const downloadHTML = () => {
    if (!selectedRun) return;
    const html = generateHTML(selectedRun, buildOptions());
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognibiome-report-${selectedRun.runHash.slice(0, 8)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPDF = () => {
    if (!selectedRun) return;
    const html = generateHTML(selectedRun, buildOptions());
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
      w.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Export Report</h1>

      {runs.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No simulation runs yet. Run a simulation first.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Run selection */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" /> Select Run
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedHash} onValueChange={setSelectedHash}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a run" />
                </SelectTrigger>
                <SelectContent>
                  {runs.map(r => (
                    <SelectItem key={r.runHash} value={r.runHash}>
                      <span className="font-mono text-xs">{r.runHash.slice(0, 12)}…</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(r.timestamp).toLocaleString()}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Report options */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Report Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pilot-summary" className="text-sm">Include Pilot Summary</Label>
                  <p className="text-xs text-muted-foreground">
                    n, mean/median table and diet↔cognition correlations from the real pilot dataset.
                    {(!pilotDataset || pilotDataset.records.length === 0) && (
                      <span className="text-yellow-500"> (Pilot not loaded — will show "cannot confirm" note.)</span>
                    )}
                  </p>
                </div>
                <Switch
                  id="pilot-summary"
                  checked={includePilotSummary}
                  onCheckedChange={setIncludePilotSummary}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="leakage-checklist" className="text-sm">Include Leakage Checklist</Label>
                  <p className="text-xs text-muted-foreground">
                    Adds the Methods &amp; Rigor leakage guardrails as a checklist block.
                  </p>
                </div>
                <Switch
                  id="leakage-checklist"
                  checked={includeLeakageChecklist}
                  onCheckedChange={setIncludeLeakageChecklist}
                />
              </div>
            </CardContent>
          </Card>

          {/* Format & Export */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Format &amp; Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={downloadHTML}
                  disabled={!selectedRun}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" /> Download HTML
                </Button>
                <Button
                  variant="outline"
                  onClick={printPDF}
                  disabled={!selectedRun}
                  className="gap-2"
                >
                  <Printer className="h-4 w-4" /> Print to PDF
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                HTML: self-contained file. PDF: opens print dialog in new tab (print to PDF via browser).
              </p>
            </CardContent>
          </Card>

          {/* Preview */}
          {selectedRun && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Run Preview</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1 font-mono">
                <p>Hash: {selectedRun.runHash.slice(0, 24)}…</p>
                <p>Diet Score Proxy: {selectedRun.dietScoreProxy}</p>
                <p>Overall Cognition (modeled proxy): {selectedRun.cognition.overall_score.toFixed(2)}</p>
                <p className="text-muted-foreground text-[10px] pt-0.5">Stage 1: {selectedRun.modelVersions.stage1}</p>
                <p className="text-muted-foreground text-[10px]">Stage 2: {selectedRun.modelVersions.stage2}</p>
                <p className="text-muted-foreground text-[10px]">Stage 3: {selectedRun.modelVersions.stage3}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {includePilotSummary && (
                    <Badge variant="secondary" className="text-[9px]">+ Pilot Summary</Badge>
                  )}
                  {includeLeakageChecklist && (
                    <Badge variant="secondary" className="text-[9px]">+ Leakage Checklist</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
