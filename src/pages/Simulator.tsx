import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Play, Hash } from 'lucide-react';
import { useAppState } from '@/contexts/AppContext';
import { DIET_FEATURES, MICROBE_GENERA, METABOLITE_PROXIES, COGNITIVE_DOMAINS, DISCLAIMERS, computeDietScoreProxy } from '@/world_model/worldModel';
import { runSimulation, saveRun, type DietInputs, type SimulationResult } from '@/lib/simulator';
import { useToast } from '@/hooks/use-toast';

export default function Simulator() {
  const { setLastRun } = useAppState();
  const { toast } = useToast();
  const [inputs, setInputs] = useState<DietInputs>({
    fiber_proxy: 25, added_sugar_proxy: 30, sat_fat_proxy: 15, omega3_proxy: 2,
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);

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
    } finally { setRunning(false); }
  };

  const updateInput = (key: keyof DietInputs, val: number) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulator</h1>
        <p className="text-xs text-muted-foreground mt-1">Diet → Microbiome → Metabolites → Cognition (deterministic pipeline)</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Diet Inputs (D)</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {DIET_FEATURES.map(f => (
              <div key={f.id} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{f.label}</span>
                  <span className="font-mono text-primary">{inputs[f.id as keyof DietInputs]} {f.unit}</span>
                </div>
                <Slider
                  min={f.min} max={f.max} step={f.step}
                  value={[inputs[f.id as keyof DietInputs]]}
                  onValueChange={([v]) => updateInput(f.id as keyof DietInputs, v)}
                />
                <p className="text-[10px] text-muted-foreground">{f.description}</p>
              </div>
            ))}
            <Separator />
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
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><Hash className="h-3 w-3" /> Run Hash</div>
                  <p className="text-[10px] font-mono break-all">{result.runHash}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{DISCLAIMERS.demoParams}</p>
                  <p className="text-[10px] text-muted-foreground">Frozen before pilot validation.</p>
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
