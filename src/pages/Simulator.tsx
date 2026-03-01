import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Play, Hash, ChevronDown, ChevronRight } from 'lucide-react';
import { useAppState } from '@/contexts/AppContext';
import { DIET_FEATURES, MICROBE_GENERA, METABOLITE_PROXIES, COGNITIVE_DOMAINS, DISCLAIMERS, computeDietScoreProxy } from '@/world_model/worldModel';
import { runSimulation, saveRun, type DietInputs, type SimulationResult } from '@/lib/simulator';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// ---------------------------------------------------------------------------
// NHANES reference ranges mini-panel (UI-only context, no model math changes)
// ---------------------------------------------------------------------------
interface NhanesRow { variable_code: string; nutrient_name: string; unit: string; min_value: string; max_value: string; source_year_range: string; }

const SLIDER_TO_NHANES: Record<string, { code: string; note?: string }> = {
  fiber_proxy:       { code: 'DR1TFIBE' },
  sat_fat_proxy:     { code: 'DR1TSFAT' },
  omega3_proxy:      { code: 'DR1TPFAT', note: 'NHANES: Total polyunsaturated fatty acids (proxy reference for Omega-3/PUFA).' },
  added_sugar_proxy: { code: 'DR1TSUGR', note: 'NHANES snapshot includes Total sugars (DR1TSUGR) only; used as a proxy reference where needed.' },
};

function parseCSVSimple(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let field = ''; let inQ = false; let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (inQ) { if (ch === '"' && text[i+1] === '"') { field += '"'; i += 2; } else if (ch === '"') { inQ = false; i++; } else { field += ch; i++; } }
    else { if (ch === '"') { inQ = true; i++; } else if (ch === ',') { row.push(field); field = ''; i++; } else if (ch === '\n' || ch === '\r') { row.push(field); field = ''; if (ch === '\r' && text[i+1] === '\n') i++; if (row.some(c=>c!=='') || rows.length > 0) rows.push(row); row = []; i++; } else { field += ch; i++; } }
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function NhanesRefPanel() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<NhanesRow[]>([]);

  useEffect(() => {
    if (!open || rows.length > 0) return;
    fetch('/reference/nhanes_nutrient_reference.csv')
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => {
        const parsed = parseCSVSimple(text.trim());
        if (parsed.length < 2) return;
        const headers = parsed[0].map(h => h.trim());
        setRows(parsed.slice(1).map(r => {
          const o: Record<string, string> = {};
          headers.forEach((h, idx) => { o[h] = (r[idx] ?? '').trim(); });
          return o as unknown as NhanesRow;
        }));
      })
      .catch(() => setRows([]));
  }, [open, rows.length]);

  return (
    <div className="rounded border border-border/40 bg-muted/10 text-xs">
      <button
        className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>Reference ranges (NHANES 2021–2022 snapshot) — UI context only</span>
        {open ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2">
          <p className="text-[10px] text-muted-foreground">
            These reference ranges come from the NHANES DR1TOT_L codebook (2021–2022). They are shown for
            context only and do not affect any model computation.
          </p>
          {DIET_FEATURES.map(f => {
            const mapping = SLIDER_TO_NHANES[f.id];
            if (!mapping) return null;
            const ref = rows.find(r => r.variable_code === mapping.code);
            return (
              <div key={f.id} className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="font-medium">{f.label}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-mono text-[10px]">{mapping.code}</span>
                  {ref && (
                    <span className="text-muted-foreground text-[10px]">
                      ({ref.nutrient_name}, {ref.unit}, max {ref.max_value})
                    </span>
                  )}
                </div>
                {mapping.note && (
                  <p className="text-[10px] italic text-amber-400/80">{mapping.note}</p>
                )}
              </div>
            );
          })}
          {rows.length === 0 && open && (
            <p className="text-[10px] text-muted-foreground italic">
              NHANES reference file not found — run the app with public/reference/ files present.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Simulator() {
  const { setLastRun, simulatorInputs, setSimulatorInputs, presenterMode } = useAppState();
  const { toast } = useToast();
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);

  const inputs = simulatorInputs;
  const dietScore = computeDietScoreProxy(inputs as unknown as Record<string, number>);

  const handleRun = async () => {
    setRunning(true);
    try {
      const r = await runSimulation(inputs);
      saveRun(r);
      setResult(r);
      setLastRun(r);
      toast({ title: 'Simulation complete', description: `Run hash: ${r.runHash.slice(0, 12)}…` });
    } catch (e) {
      toast({ title: 'Simulation failed', description: String(e), variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  const updateInput = (key: keyof DietInputs, val: number) => {
    setSimulatorInputs({ ...inputs, [key]: val });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulator</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Diet → Microbiome → Metabolites → Cognition (deterministic pipeline)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Diet Inputs (D)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {DIET_FEATURES.map(f => (
              <div key={f.id} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{f.label}</span>
                  <span className="font-mono text-primary">
                    {inputs[f.id as keyof DietInputs]} {f.unit}
                  </span>
                </div>
                <Slider
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={[inputs[f.id as keyof DietInputs]]}
                  onValueChange={([v]) => updateInput(f.id as keyof DietInputs, v)}
                />
                {!presenterMode && (
                  <p className="text-[10px] text-muted-foreground">{f.description}</p>
                )}
              </div>
            ))}
            <Separator />
            {!presenterMode && <NhanesRefPanel />}
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Derived Diet Score (proxy)</span>
              <Badge variant="outline" className="font-mono">{dietScore}</Badge>
            </div>
            <Button onClick={handleRun} disabled={running} className="w-full gap-2">
              <Play className="h-4 w-4" /> {running ? 'Running…' : 'Run Simulation'}
            </Button>
          </CardContent>
        </Card>

        {/* Outputs */}
        <div className="space-y-4">
          {result ? (
            <>
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    Microbiome (X) <Badge variant="secondary" className="text-[9px]">MODELED PROXY</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {MICROBE_GENERA.map(m => (
                    <div key={m.id} className="flex justify-between text-xs">
                      <span>{m.label}</span>
                      <span className="font-mono text-primary">
                        {(result.microbiome as unknown as Record<string, number>)[m.id]?.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    Metabolites (M) <Badge variant="secondary" className="text-[9px]">MODELED PROXY</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {METABOLITE_PROXIES.map(m => (
                    <div key={m.id} className="flex justify-between text-xs">
                      <span>{m.label}</span>
                      <span className="font-mono text-primary">
                        {(result.metabolites as unknown as Record<string, number>)[m.id]?.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    Cognition (Y) <Badge variant="secondary" className="text-[9px]">MODELED PROXY</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {COGNITIVE_DOMAINS.map(c => (
                    <div key={c.id} className="flex justify-between text-xs">
                      <span>{c.label}</span>
                      <span className="font-mono text-primary">
                        {(result.cognition as unknown as Record<string, number>)[c.id]?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Provenance */}
              <Card className="border-muted">
                <CardContent className="pt-4 space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Hash className="h-3 w-3" /> Run Hash
                    {presenterMode && (
                      <span
                        className="ml-1 inline-flex h-2 w-2 rounded-full bg-primary animate-pulse"
                        data-testid="run-hash-presenter-cue"
                        aria-label="Mention reproducibility"
                        title="Mention: same inputs always produce the same hash — reproducible by design"
                      />
                    )}
                  </div>
                  <p className="text-[10px] font-mono break-all">{result.runHash}</p>
                  {!presenterMode && (
                    <>
                      <p className="text-[10px] text-muted-foreground mt-1">{DISCLAIMERS.demoParams}</p>
                      <p className="text-[10px] text-muted-foreground">Frozen before pilot validation.</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[300px]">
              <CardContent className="text-center text-muted-foreground text-sm">
                Adjust inputs and click <strong>Run Simulation</strong> to see outputs.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
