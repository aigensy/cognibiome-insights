import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DISCLAIMERS } from '@/world_model/worldModel';

const leakageItems = [
  { label: 'Pilot dataset is validation-only', desc: 'Not used for training or tuning.', ok: true },
  { label: 'No peeking during tuning', desc: 'Model artifacts frozen before pilot validation.', ok: true },
  { label: 'Fit-only-on-train', desc: 'Preprocessing fitted on training data only (conceptual).', ok: true },
  { label: 'Duplicate/near-duplicate awareness', desc: 'Pilot records are unique de-identified entries.', ok: true },
];

const dataSources = [
  { stage: 'D→X', inputs: 'Fiber, Sugar, Sat Fat, Omega-3', outputs: 'Bifidobacterium, Lactobacillus, F:B ratio', datasets: 'NHANES (training), USDA FDC (reference-only)', notes: 'Reference datasets not used for supervised paired training.' },
  { stage: 'X→M', inputs: 'Microbiome proxies', outputs: 'Acetate, Propionate, Butyrate, 5-HTP Index', datasets: 'Public microbiome-metabolite studies (training)', notes: 'Unpaired datasets labeled reference-only where applicable.' },
  { stage: 'M→Y', inputs: 'Metabolite proxies', outputs: 'Stroop, Language, Memory, Logical, Overall', datasets: 'Cognitive-metabolite literature (training)', notes: 'Pilot dataset (n=66) is validation-only.' },
  { stage: 'Validation', inputs: 'Diet Score', outputs: 'Cognitive metrics', datasets: 'Teen pilot (n=66)', notes: 'De-identified. Never used for training.' },
];

export default function Methods() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Methods & Rigor</h1>

      {/* A: Limitations */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Limitations & Scientific Wording</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <div className="p-3 rounded bg-muted/50 border border-border">
            <p className="font-medium text-foreground">{DISCLAIMERS.modeledProxy}</p>
          </div>
          <div className="p-3 rounded bg-muted/50 border border-border">
            <p className="font-medium text-foreground">{DISCLAIMERS.nonCausal}</p>
          </div>
          <div className="p-3 rounded bg-muted/50 border border-border">
            <p className="font-medium text-foreground">{DISCLAIMERS.nonDiagnostic}</p>
          </div>
          <p className="text-[10px]">Teens in the pilot study do not have measured microbiome or metabolomics data. All intermediate outputs (X, M) are modeled proxy variables derived from published reference datasets — not biomarker measurements from pilot participants.</p>
        </CardContent>
      </Card>

      {/* B: Leakage Guardrails */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success" /> Leakage Guardrails</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {leakageItems.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground mt-2">No model performance numbers are fabricated. Demo parameters are directional placeholders.</p>
        </CardContent>
      </Card>

      {/* C: Data Sources */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Data Sources (Paired vs Unpaired)</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Stage</TableHead>
                  <TableHead className="text-xs">Inputs</TableHead>
                  <TableHead className="text-xs">Outputs</TableHead>
                  <TableHead className="text-xs">Dataset Types</TableHead>
                  <TableHead className="text-xs">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataSources.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-mono">{d.stage}</TableCell>
                    <TableCell className="text-xs">{d.inputs}</TableCell>
                    <TableCell className="text-xs">{d.outputs}</TableCell>
                    <TableCell className="text-xs">{d.datasets}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{d.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
