import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Printer } from 'lucide-react';
import { getSavedRuns, type SimulationResult } from '@/lib/simulator';
import { DISCLAIMERS } from '@/world_model/worldModel';

function generateHTML(run: SimulationResult): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CogniBiome Report — ${run.runHash.slice(0,12)}</title>
<style>body{font-family:system-ui;max-width:800px;margin:auto;padding:24px;color:#e2e8f0;background:#0f172a}
h1{font-size:1.4em}h2{font-size:1.1em;margin-top:1em}table{width:100%;border-collapse:collapse;font-size:0.85em}
td,th{padding:4px 8px;border:1px solid #334155;text-align:left}.badge{background:#1e40af;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.75em}
.warn{color:#fbbf24;font-size:0.8em}</style></head><body>
<h1>CogniBiome Simulation Report</h1>
<p class="badge">MODELED / ESTIMATED (proxy)</p>
<h2>Run Provenance</h2><table><tr><th>Run Hash</th><td style="font-family:monospace;font-size:0.75em">${run.runHash}</td></tr>
<tr><th>Timestamp</th><td>${run.timestamp}</td></tr>
<tr><th>Stage 1</th><td>${run.modelVersions.stage1}</td></tr>
<tr><th>Stage 2</th><td>${run.modelVersions.stage2}</td></tr>
<tr><th>Stage 3</th><td>${run.modelVersions.stage3}</td></tr></table>
<h2>Diet Inputs</h2><table><tr><th>Fiber</th><td>${run.inputs.fiber_proxy} g/day</td><th>Added Sugar</th><td>${run.inputs.added_sugar_proxy} g/day</td></tr>
<tr><th>Sat Fat</th><td>${run.inputs.sat_fat_proxy} g/day</td><th>Omega-3</th><td>${run.inputs.omega3_proxy} g/day</td></tr>
<tr><th>Diet Score (proxy)</th><td colspan="3">${run.dietScoreProxy}</td></tr></table>
<h2>Microbiome (Modeled Proxy)</h2><table><tr><th>Bifidobacterium</th><td>${run.microbiome.bifidobacterium.toFixed(3)}</td>
<th>Lactobacillus</th><td>${run.microbiome.lactobacillus.toFixed(3)}</td></tr>
<tr><th>F:B Ratio</th><td colspan="3">${run.microbiome.fb_ratio.toFixed(3)}</td></tr></table>
<h2>Metabolites (Modeled Proxy)</h2><table><tr><th>Acetate</th><td>${run.metabolites.acetate.toFixed(3)}</td>
<th>Propionate</th><td>${run.metabolites.propionate.toFixed(3)}</td></tr>
<tr><th>Butyrate</th><td>${run.metabolites.butyrate.toFixed(3)}</td>
<th>5-HTP Index</th><td>${run.metabolites.five_htp_index.toFixed(3)}</td></tr></table>
<h2>Cognition (Modeled Proxy)</h2><table><tr><th>Stroop</th><td>${run.cognition.stroop_test.toFixed(2)}</td>
<th>Language</th><td>${run.cognition.language_test.toFixed(2)}</td></tr>
<tr><th>Memory</th><td>${run.cognition.memory_test.toFixed(2)}</td>
<th>Logical</th><td>${run.cognition.logical_test.toFixed(2)}</td></tr>
<tr><th>Overall</th><td colspan="3">${run.cognition.overall_score.toFixed(2)}</td></tr></table>
<h2>Disclaimers</h2>
<p class="warn">⚠ ${DISCLAIMERS.nonCausal}</p>
<p class="warn">⚠ ${DISCLAIMERS.nonDiagnostic}</p>
<p class="warn">⚠ ${DISCLAIMERS.modeledProxy}</p>
<p class="warn">⚠ ${DISCLAIMERS.pilotValidation}</p>
</body></html>`;
}

export default function ExportReport() {
  const runs = getSavedRuns();
  const [selectedHash, setSelectedHash] = useState(runs[0]?.runHash ?? '');
  const selectedRun = runs.find(r => r.runHash === selectedHash);

  const downloadHTML = () => {
    if (!selectedRun) return;
    const html = generateHTML(selectedRun);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `cognibiome-report-${selectedRun.runHash.slice(0,8)}.html`;
    a.click(); URL.revokeObjectURL(url);
  };

  const printPDF = () => {
    if (!selectedRun) return;
    const html = generateHTML(selectedRun);
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Export Report</h1>

      {runs.length === 0 ? (
        <Card><CardContent className="pt-6 text-center text-muted-foreground">
          No simulation runs yet. Run a simulation first.
        </CardContent></Card>
      ) : (
        <>
          <Select value={selectedHash} onValueChange={setSelectedHash}>
            <SelectTrigger><SelectValue placeholder="Select a run" /></SelectTrigger>
            <SelectContent>
              {runs.map(r => (
                <SelectItem key={r.runHash} value={r.runHash}>
                  <span className="font-mono text-xs">{r.runHash.slice(0,12)}…</span>
                  <span className="text-xs text-muted-foreground ml-2">{new Date(r.timestamp).toLocaleString()}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button onClick={downloadHTML} disabled={!selectedRun} className="gap-2">
              <Download className="h-4 w-4" /> Download HTML
            </Button>
            <Button variant="outline" onClick={printPDF} disabled={!selectedRun} className="gap-2">
              <Printer className="h-4 w-4" /> Print to PDF
            </Button>
          </div>

          {selectedRun && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent className="text-xs space-y-1 font-mono">
                <p>Hash: {selectedRun.runHash.slice(0,24)}…</p>
                <p>Diet Score Proxy: {selectedRun.dietScoreProxy}</p>
                <p>Overall Cognition: {selectedRun.cognition.overall_score.toFixed(2)}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
