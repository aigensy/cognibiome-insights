import { useEffect, useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Upload, Database } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { useAppState } from '@/contexts/AppContext';
import { loadBundledPilot, loadPilotWithSha256, parsePilotCSV, type PilotRecord } from '@/lib/pilotParser';
import { computeSummaryStats, computeCorrelations, computeRegressionLine } from '@/lib/statistics';

const CHART_FIELDS: { field: keyof PilotRecord; label: string; color: string }[] = [
  { field: 'stroop_test', label: 'Stroop Test', color: 'hsl(210, 100%, 56%)' },
  { field: 'language_test', label: 'Language Test', color: 'hsl(172, 66%, 45%)' },
  { field: 'memory_test', label: 'Memory Test', color: 'hsl(280, 65%, 60%)' },
  { field: 'logical_test', label: 'Logical Reasoning', color: 'hsl(45, 93%, 58%)' },
  { field: 'overall_score', label: 'Overall Score', color: 'hsl(0, 72%, 55%)' },
];

export default function PilotResults() {
  const { pilotDataset, setPilotDataset, adminMode } = useAppState();
  const [showRegression, setShowRegression] = useState(true);
  const [showQuartiles, setShowQuartiles] = useState(false);
  const [uploadText, setUploadText] = useState<string | null>(null);
  const [selectedDietCol, setSelectedDietCol] = useState<string>('');

  useEffect(() => {
    if (!pilotDataset) {
      loadBundledPilot().then(d => { if (d) setPilotDataset(d); });
    }
  }, [pilotDataset, setPilotDataset]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      setUploadText(text);
      const dataset = await loadPilotWithSha256(text, 'upload');
      setPilotDataset(dataset);
    };
    reader.readAsText(file);
  };

  const handleMappingConfirm = async () => {
    if (!selectedDietCol || !uploadText) return;
    const dataset = await loadPilotWithSha256(uploadText, 'upload', selectedDietCol);
    setPilotDataset(dataset);
    setSelectedDietCol('');
    setUploadText(null);
  };

  const stats = useMemo(
    () => (pilotDataset && !pilotDataset.mappingRequired ? computeSummaryStats(pilotDataset.records) : []),
    [pilotDataset]
  );
  const correlations = useMemo(
    () => (pilotDataset && !pilotDataset.mappingRequired ? computeCorrelations(pilotDataset.records) : []),
    [pilotDataset]
  );

  if (!pilotDataset) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Pilot Results</h1>
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <p>Loading pilot dataset…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const records = pilotDataset.records;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Mapping required dialog */}
      <Dialog open={pilotDataset.mappingRequired}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Multiple Diet Score Columns Detected</DialogTitle>
            <DialogDescription>
              The uploaded CSV contains multiple Diet Score columns with differing values.
              Select which column to use as the canonical Diet Score for analysis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Candidates: {pilotDataset.dietScoreCandidates.join(', ')}
            </p>
            <Select value={selectedDietCol} onValueChange={setSelectedDietCol}>
              <SelectTrigger>
                <SelectValue placeholder="Select Diet Score column…" />
              </SelectTrigger>
              <SelectContent>
                {pilotDataset.dietScoreCandidates.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleMappingConfirm}
              disabled={!selectedDietCol}
              className="w-full"
            >
              Confirm Selection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Pilot Results</h1>
          <Badge className="mt-1 bg-success/20 text-success border-success/30 text-[10px]">
            REAL DATA (de-identified teen pilot, n={pilotDataset.rowCount}) • computed live from CSV • no synthetic points
          </Badge>
        </div>
        {adminMode && (
          <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground border border-border rounded px-3 py-1.5 hover:bg-muted/50">
            <Upload className="h-3.5 w-3.5" /> Upload CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleUpload} />
          </label>
        )}
      </div>

      {/* Dataset invalid error */}
      {pilotDataset.datasetInvalid && pilotDataset.invalidReason && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Dataset invalid:</strong> {pilotDataset.invalidReason}
            {pilotDataset.integrityErrors.slice(0, 3).map((e, i) => (
              <p key={i} className="text-xs mt-1 opacity-80">{e}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Integrity check warnings */}
      {!pilotDataset.integrityPassed && !pilotDataset.datasetInvalid && pilotDataset.integrityErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Integrity check failed: {pilotDataset.integrityErrors.slice(0, 3).join('; ')}
            {pilotDataset.integrityErrors.length > 3 && ` (+${pilotDataset.integrityErrors.length - 3} more)`}
          </AlertDescription>
        </Alert>
      )}

      {/* Warnings (non-fatal) */}
      {pilotDataset.warnings.map((w, i) => (
        <Alert key={i}>
          <AlertDescription className="text-xs">{w}</AlertDescription>
        </Alert>
      ))}

      {/* Dataset Metadata */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4" /> Dataset Metadata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Rows</p>
              <p className="text-sm font-mono font-medium">{pilotDataset.rowCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Source</p>
              <p className="text-sm font-mono font-medium">{pilotDataset.source}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Loaded At</p>
              <p className="text-xs font-mono">{new Date(pilotDataset.loadedAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">SHA-256</p>
              <p className="text-[10px] font-mono text-muted-foreground break-all">
                {pilotDataset.sha256 ? `${pilotDataset.sha256.slice(0, 16)}…` : 'computing…'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats blocked when mapping required */}
      {pilotDataset.mappingRequired && (
        <Alert>
          <AlertDescription>
            Statistics are blocked until you resolve the Diet Score column mapping above.
          </AlertDescription>
        </Alert>
      )}

      {!pilotDataset.mappingRequired && !pilotDataset.datasetInvalid && (
        <>
          {/* Summary Statistics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Metric</TableHead>
                      <TableHead className="text-xs text-right">n</TableHead>
                      <TableHead className="text-xs text-right">Mean</TableHead>
                      <TableHead className="text-xs text-right">Median</TableHead>
                      <TableHead className="text-xs text-right">SD</TableHead>
                      <TableHead className="text-xs text-right">Min</TableHead>
                      <TableHead className="text-xs text-right">Max</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.map(s => (
                      <TableRow key={s.field}>
                        <TableCell className="text-xs font-medium">{s.label}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{s.n}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{s.mean}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{s.median}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{s.stdDev}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{s.min}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{s.max}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Correlations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Correlations (Diet Score vs Cognitive Metrics)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Metric</TableHead>
                    <TableHead className="text-xs text-right">Pearson r</TableHead>
                    <TableHead className="text-xs text-right">p-value (approx)</TableHead>
                    <TableHead className="text-xs text-right">n</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {correlations.map(c => (
                    <TableRow key={c.fieldY}>
                      <TableCell className="text-xs font-medium">{c.labelY}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{c.pearsonR.toFixed(3)}</TableCell>
                      <TableCell className="text-xs text-right font-mono">
                        {c.pValue !== null ? c.pValue.toFixed(4) : '—'}
                      </TableCell>
                      <TableCell className="text-xs text-right font-mono">{c.n}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-[10px] text-muted-foreground mt-2">
                p-values are approximate (A&S formula). Do not interpret as proof of causality.
              </p>
            </CardContent>
          </Card>

          {/* Toggles */}
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Switch id="regression" checked={showRegression} onCheckedChange={setShowRegression} />
              <Label htmlFor="regression" className="text-xs">Regression line</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="quartiles" checked={showQuartiles} onCheckedChange={setShowQuartiles} />
              <Label htmlFor="quartiles" className="text-xs">Show quartiles</Label>
            </div>
          </div>

          {/* Scatter Plots */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CHART_FIELDS.map(({ field, label, color }) => {
              const data = records.map(r => ({ x: r.diet_score, y: r[field] }));
              const reg = computeRegressionLine(records.map(r => r.diet_score), records.map(r => r[field]));
              const xMin = Math.min(...records.map(r => r.diet_score));
              const xMax = Math.max(...records.map(r => r.diet_score));
              const regData = [
                { x: xMin, y: reg.intercept + reg.slope * xMin },
                { x: xMax, y: reg.intercept + reg.slope * xMax },
              ];

              return (
                <Card key={field}>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-xs">{label} vs Diet Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <ComposedChart data={data} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" />
                        <XAxis dataKey="x" type="number" tick={{ fontSize: 10 }} label={{ value: 'Diet Score', position: 'bottom', fontSize: 10 }} />
                        <YAxis dataKey="y" type="number" tick={{ fontSize: 10 }} label={{ value: label, angle: -90, position: 'insideLeft', fontSize: 10 }} />
                        <Tooltip contentStyle={{ fontSize: 11, background: 'hsl(222, 47%, 8%)', border: '1px solid hsl(217, 33%, 18%)' }} />
                        <Scatter data={data} fill={color} r={3} />
                        {showRegression && (
                          <Line data={regData} dataKey="y" stroke={color} strokeWidth={2} dot={false} type="linear" strokeDasharray="6 3" />
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
