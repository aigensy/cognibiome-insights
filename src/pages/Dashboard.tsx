import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Cpu, FileOutput, ShieldCheck, GitCompare, AlertTriangle } from 'lucide-react';
import { useAppState } from '@/contexts/AppContext';
import { loadBundledPilot } from '@/lib/pilotParser';
import { getSavedRuns } from '@/lib/simulator';
import { DISCLAIMERS } from '@/world_model/worldModel';

const tiles = [
  { title: 'Pilot Results', desc: 'View real teen pilot data (n=66)', icon: BarChart3, url: '/pilot' },
  { title: 'Simulator', desc: 'Run diet→microbiome→cognition pipeline', icon: Cpu, url: '/simulator' },
  { title: 'Export Report', desc: 'Generate 1-page report', icon: FileOutput, url: '/export' },
  { title: 'Methods & Rigor', desc: 'Limitations, guardrails, disclaimers', icon: ShieldCheck, url: '/methods' },
  { title: 'Compare Scenarios', desc: 'Side-by-side scenario comparison', icon: GitCompare, url: '/compare' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { pilotDataset, setPilotDataset, presenterMode } = useAppState();
  const runs = getSavedRuns();

  useEffect(() => {
    if (!pilotDataset) {
      loadBundledPilot().then(d => { if (d) setPilotDataset(d); });
    }
  }, [pilotDataset, setPilotDataset]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">CogniBiome Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Modeling Diet-Driven Microbiome and Neurotransmitter Pathways Influencing Cognitive Performance
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="border-primary/40 text-primary font-mono text-xs">
          Demo Param Set v0
        </Badge>
        <Badge variant="outline" className="border-accent/40 text-accent font-mono text-xs">
          {pilotDataset ? `Pilot: n=${pilotDataset.rowCount}` : 'Pilot: not loaded'}
        </Badge>
        <Badge variant="outline" className="font-mono text-xs">
          Runs: {runs.length}
        </Badge>
      </div>

      {presenterMode && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-primary">🎯 2-Minute Demo Path</p>
            <p className="text-xs text-muted-foreground mt-1">
              Pilot Results → Methods & Rigor → Simulator → Export
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map(t => (
          <Card key={t.url} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate(t.url)}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <t.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm">{t.title}</CardTitle>
              </div>
              <CardDescription className="text-xs">{t.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="pt-4 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">{DISCLAIMERS.nonDiagnostic}</p>
            <p>{DISCLAIMERS.nonCausal}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
