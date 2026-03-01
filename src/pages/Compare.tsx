import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeftRight, AlertCircle } from 'lucide-react';
import { getSavedRuns, type SimulationResult } from '@/lib/simulator';

function delta(b: number, a: number): string {
  const d = b - a;
  return (d >= 0 ? '+' : '') + d.toFixed(3);
}

function pctDelta(b: number, a: number): string {
  if (a === 0) return '—';
  const pct = ((b - a) / Math.abs(a)) * 100;
  return (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
}

interface CompareTableRow {
  label: string;
  a: string;
  b: string;
  d: string;
  pct: string;
}

function makeRows(
  labels: string[],
  keysA: number[],
  keysB: number[],
  precision = 3
): CompareTableRow[] {
  return labels.map((label, i) => {
    const a = keysA[i];
    const b = keysB[i];
    return {
      label,
      a: a.toFixed(precision),
      b: b.toFixed(precision),
      d: delta(b, a),
      pct: pctDelta(b, a),
    };
  });
}

function DeltaCell({ value }: { value: string }) {
  const isPos = value.startsWith('+') && value !== '+0.000' && value !== '+0.0%';
  const isNeg = value.startsWith('-');
  const colorClass = isPos
    ? 'text-green-400'
    : isNeg
    ? 'text-red-400'
    : 'text-muted-foreground';
  return <span className={`font-mono text-xs ${colorClass}`}>{value}</span>;
}

function CompareTable({
  title,
  rows,
}: {
  title: string;
  rows: CompareTableRow[];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Metric</TableHead>
              <TableHead className="text-xs text-right">Run A</TableHead>
              <TableHead className="text-xs text-right">Run B</TableHead>
              <TableHead className="text-xs text-right">Δ (B − A)</TableHead>
              <TableHead className="text-xs text-right">% Δ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.label}>
                <TableCell className="text-xs font-medium">{row.label}</TableCell>
                <TableCell className="text-xs text-right font-mono">{row.a}</TableCell>
                <TableCell className="text-xs text-right font-mono">{row.b}</TableCell>
                <TableCell className="text-xs text-right">
                  <DeltaCell value={row.d} />
                </TableCell>
                <TableCell className="text-xs text-right">
                  <DeltaCell value={row.pct} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function runLabel(r: SimulationResult): string {
  return `${r.runHash.slice(0, 12)}… — ${new Date(r.timestamp).toLocaleString()}`;
}

export default function Compare() {
  const runs = getSavedRuns();
  const [hashA, setHashA] = useState(runs[0]?.runHash ?? '');
  const [hashB, setHashB] = useState(runs[1]?.runHash ?? '');

  const runA = useMemo(() => runs.find(r => r.runHash === hashA) ?? null, [runs, hashA]);
  const runB = useMemo(() => runs.find(r => r.runHash === hashB) ?? null, [runs, hashB]);

  const swap = () => {
    const tmp = hashA;
    setHashA(hashB);
    setHashB(tmp);
  };

  if (runs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Compare Scenarios</h1>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3 text-muted-foreground">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">
              No simulation runs found. Run at least two simulations in the Simulator to compare scenarios.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dietRows: CompareTableRow[] = runA && runB
    ? [
        {
          label: 'Fiber (g/day)',
          a: runA.inputs.fiber_proxy.toFixed(1),
          b: runB.inputs.fiber_proxy.toFixed(1),
          d: delta(runB.inputs.fiber_proxy, runA.inputs.fiber_proxy),
          pct: pctDelta(runB.inputs.fiber_proxy, runA.inputs.fiber_proxy),
        },
        {
          label: 'Added Sugar (g/day)',
          a: runA.inputs.added_sugar_proxy.toFixed(1),
          b: runB.inputs.added_sugar_proxy.toFixed(1),
          d: delta(runB.inputs.added_sugar_proxy, runA.inputs.added_sugar_proxy),
          pct: pctDelta(runB.inputs.added_sugar_proxy, runA.inputs.added_sugar_proxy),
        },
        {
          label: 'Sat. Fat (g/day)',
          a: runA.inputs.sat_fat_proxy.toFixed(1),
          b: runB.inputs.sat_fat_proxy.toFixed(1),
          d: delta(runB.inputs.sat_fat_proxy, runA.inputs.sat_fat_proxy),
          pct: pctDelta(runB.inputs.sat_fat_proxy, runA.inputs.sat_fat_proxy),
        },
        {
          label: 'Omega-3 (g/day)',
          a: runA.inputs.omega3_proxy.toFixed(1),
          b: runB.inputs.omega3_proxy.toFixed(1),
          d: delta(runB.inputs.omega3_proxy, runA.inputs.omega3_proxy),
          pct: pctDelta(runB.inputs.omega3_proxy, runA.inputs.omega3_proxy),
        },
        {
          label: 'Diet Score Proxy',
          a: runA.dietScoreProxy.toFixed(1),
          b: runB.dietScoreProxy.toFixed(1),
          d: delta(runB.dietScoreProxy, runA.dietScoreProxy),
          pct: pctDelta(runB.dietScoreProxy, runA.dietScoreProxy),
        },
      ]
    : [];

  const microbiomeRows: CompareTableRow[] = runA && runB
    ? makeRows(
        ['Bifidobacterium', 'Lactobacillus', 'F:B Ratio'],
        [runA.microbiome.bifidobacterium, runA.microbiome.lactobacillus, runA.microbiome.fb_ratio],
        [runB.microbiome.bifidobacterium, runB.microbiome.lactobacillus, runB.microbiome.fb_ratio]
      )
    : [];

  const metaboliteRows: CompareTableRow[] = runA && runB
    ? makeRows(
        ['Acetate', 'Propionate', 'Butyrate', '5-HTP Index'],
        [runA.metabolites.acetate, runA.metabolites.propionate, runA.metabolites.butyrate, runA.metabolites.five_htp_index],
        [runB.metabolites.acetate, runB.metabolites.propionate, runB.metabolites.butyrate, runB.metabolites.five_htp_index]
      )
    : [];

  const cognitionRows: CompareTableRow[] = runA && runB
    ? makeRows(
        ['Stroop Test', 'Language Test', 'Memory Test', 'Logical Test', 'Overall Score'],
        [runA.cognition.stroop_test, runA.cognition.language_test, runA.cognition.memory_test, runA.cognition.logical_test, runA.cognition.overall_score],
        [runB.cognition.stroop_test, runB.cognition.language_test, runB.cognition.memory_test, runB.cognition.logical_test, runB.cognition.overall_score],
        2
      )
    : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Compare Scenarios</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Side-by-side comparison of two saved simulation runs.
          All outputs are modeled proxies — not measured values.
        </p>
      </div>

      {/* Run selection */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[220px] space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Run A</label>
              <Select value={hashA} onValueChange={setHashA}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Run A" />
                </SelectTrigger>
                <SelectContent>
                  {runs.map(r => (
                    <SelectItem key={r.runHash} value={r.runHash}>
                      <span className="font-mono text-xs">{runLabel(r)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 shrink-0"
              onClick={swap}
              title="Swap Run A and Run B"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" /> Swap A/B
            </Button>

            <div className="flex-1 min-w-[220px] space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Run B</label>
              <Select value={hashB} onValueChange={setHashB}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Run B" />
                </SelectTrigger>
                <SelectContent>
                  {runs.map(r => (
                    <SelectItem key={r.runHash} value={r.runHash}>
                      <span className="font-mono text-xs">{runLabel(r)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {runs.length < 2 && (
            <p className="text-xs text-muted-foreground mt-3">
              Only one run available. Run another simulation to enable comparison.
            </p>
          )}
        </CardContent>
      </Card>

      {runA && runB && hashA !== hashB ? (
        <>
          {/* Run hashes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Badge variant="outline" className="text-[10px] font-mono mb-1">Run A</Badge>
              <p className="text-[10px] font-mono text-muted-foreground break-all">{runA.runHash}</p>
              <p className="text-[10px] text-muted-foreground">{new Date(runA.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <Badge variant="outline" className="text-[10px] font-mono mb-1">Run B</Badge>
              <p className="text-[10px] font-mono text-muted-foreground break-all">{runB.runHash}</p>
              <p className="text-[10px] text-muted-foreground">{new Date(runB.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <CompareTable title="Diet Inputs + Diet Score Proxy" rows={dietRows} />
          <CompareTable title="Microbiome Outputs (Modeled Proxy)" rows={microbiomeRows} />
          <CompareTable title="Metabolite Outputs (Modeled Proxy)" rows={metaboliteRows} />
          <CompareTable title="Cognition Outputs (Modeled Proxy)" rows={cognitionRows} />

          <p className="text-[10px] text-muted-foreground">
            Δ = B − A. % Δ = (B − A) / |A| × 100. All outputs are deterministic modeled proxies.
            Green = B higher, Red = B lower. Non-causal, non-diagnostic.
          </p>
        </>
      ) : (
        runA && runB && hashA === hashB && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground text-sm">
              Select two different runs to compare.
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
