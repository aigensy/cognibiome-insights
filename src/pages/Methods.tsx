import { useEffect, useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle2, AlertTriangle, ShieldCheck, FlaskConical, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DISCLAIMERS } from '@/world_model/worldModel';
import { useAppState } from '@/contexts/AppContext';

const leakageItems = [
  { label: 'Pilot dataset is validation-only', desc: 'Not used for training or tuning.', ok: true },
  { label: 'No peeking during tuning', desc: 'Model artifacts frozen before pilot validation.', ok: true },
  { label: 'Fit-only-on-train', desc: 'Preprocessing fitted on training data only (conceptual).', ok: true },
  { label: 'Duplicate/near-duplicate awareness', desc: 'Pilot records are unique de-identified entries.', ok: true },
];

const dataSources = [
  {
    stage: 'D→X',
    inputs: 'Fiber, Sugar, Sat Fat, Omega-3',
    outputs: 'Bifidobacterium, Lactobacillus, F:B ratio',
    datasets: 'Current v0.1 (UNPAIRED): frozen demo coefficients (not trained on NHANES). Future (PAIRED): train on paired cohorts where permitted (e.g., ZOE PREDICT; iHMP/IBDMDB).',
    notes: 'NHANES codebook used as UI reference context only — not a training source in this build.',
  },
  {
    stage: 'X→M',
    inputs: 'Microbiome proxies',
    outputs: 'Acetate, Propionate, Butyrate, 5-HTP Index',
    datasets: 'Current v0.1 (UNPAIRED): frozen demo coefficients. Future (PAIRED): train on iHMP/IBDMDB (longitudinal paired multi-omics) where available.',
    notes: 'MiMeDB evidence used for reference context; all microbe↔metabolite links are labeled unconfirmed.',
  },
  {
    stage: 'M→Y',
    inputs: 'Metabolite proxies',
    outputs: 'Stroop, Language, Memory, Logical, Overall',
    datasets: 'Current v0.1 (UNPAIRED): frozen demo coefficients. Future (PAIRED): requires a properly paired cohort with cognitive + metabolomics data.',
    notes: 'Pilot dataset (n=66) is validation-only — never used for training.',
  },
  {
    stage: 'Validation',
    inputs: 'Diet Score',
    outputs: 'Cognitive metrics (Diet Score ↔ Cognitive metrics only)',
    datasets: 'Teen pilot (n=66, de-identified) — PAIRED for Diet Score ↔ Cognitive metrics only. No paired microbiome or metabolomics in pilot.',
    notes: 'De-identified. Never used for training.',
  },
];

interface MiMeDBMetabolite {
  id: string | null;
  mime_id: string | null;
  name: string | null;
  hmdb_id: string | null;
  cas: string | null;
  formula: string | null;
  average_mass: number | null;
  microbe_relation_count: number | null;
  app_role: string;
}

interface MiMeDBMicrobe {
  id: string | null;
  microbe_id: string | null;
  name: string | null;
  species: string | null;
  genus: string | null;
  phylum: string | null;
  gram: string | null;
  activity: string | null;
  health_type: string | null;
}

/**
 * MiMeDBLink accepts both old schema (evidence, note) and new schema
 * (evidence_note, literature_context, source_in_mimedb_csv) without crashing.
 */
interface MiMeDBLink {
  metabolite_name: string;
  metabolite_mime_id: string;
  microbe_genera: string[];
  // Old schema fields
  evidence?: string;
  note?: string;
  // New schema fields
  evidence_note?: string;
  literature_context?: string;
  source_in_mimedb_csv?: boolean;
}

interface MiMeDBSnapshot {
  metadata: {
    source: string;
    build_timestamp: string;
    row_count_metabolites: number;
    row_count_microbes: number;
    matched_metabolites: number;
    matched_microbes: number;
    limitations: string[];
    license: string;
  };
  metabolites: MiMeDBMetabolite[];
  microbes: MiMeDBMicrobe[];
  microbe_metabolite_links: MiMeDBLink[];
}

function MiMeDBSection({ presenterMode }: { presenterMode: boolean }) {
  const [data, setData] = useState<MiMeDBSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'metabolites' | 'microbes' | 'links'>(presenterMode ? 'metabolites' : 'links');

  useEffect(() => {
    fetch('/reference/mimedb.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const q = search.trim().toLowerCase();

  const filteredMetabolites = useMemo(() => {
    if (!data) return [];
    if (!q) return data.metabolites;
    return data.metabolites.filter(m =>
      (m.name ?? '').toLowerCase().includes(q) ||
      (m.mime_id ?? '').toLowerCase().includes(q) ||
      (m.app_role ?? '').toLowerCase().includes(q)
    );
  }, [data, q]);

  const filteredMicrobes = useMemo(() => {
    if (!data) return [];
    if (!q) return data.microbes.slice(0, 50);
    return data.microbes.filter(m =>
      (m.species ?? '').toLowerCase().includes(q) ||
      (m.genus ?? '').toLowerCase().includes(q) ||
      (m.phylum ?? '').toLowerCase().includes(q)
    ).slice(0, 50);
  }, [data, q]);

  const filteredLinks = useMemo(() => {
    if (!data) return [];
    if (!q) return data.microbe_metabolite_links;
    return data.microbe_metabolite_links.filter(l =>
      l.metabolite_name.toLowerCase().includes(q) ||
      l.microbe_genera.some(g => g.toLowerCase().includes(q))
    );
  }, [data, q]);

  if (loading) {
    return <p className="text-xs text-muted-foreground animate-pulse">Loading MiMeDB snapshot…</p>;
  }

  if (error || !data) {
    return (
      <Alert>
        <AlertDescription className="text-xs">
          MiMeDB snapshot not available: {error ?? 'file not found'}.
          Run <code>npm run build:mimedb</code> to generate it from local CSV files.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Source</p>
          <p className="font-medium">{data.metadata.source}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Built</p>
          <p className="font-medium">{new Date(data.metadata.build_timestamp).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Metabolites</p>
          <p className="font-mono font-medium">{data.metadata.matched_metabolites} / {data.metadata.row_count_metabolites.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Microbes</p>
          <p className="font-mono font-medium">{data.metadata.matched_microbes} / {data.metadata.row_count_microbes.toLocaleString()}</p>
        </div>
      </div>

      {/* License */}
      <p className="text-[10px] text-muted-foreground border border-border rounded px-2 py-1">
        {data.metadata.license}
      </p>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search metabolite or microbe…"
          className="pl-8 h-8 text-xs"
        />
      </div>

      {/* Tab buttons */}
      <div className="flex gap-2">
        {(['links', 'metabolites', 'microbes'] as const).map(t => {
          if (t === 'links' && presenterMode) return null;
          const label = t === 'links'
            ? 'Example links (unconfirmed)'
            : t.charAt(0).toUpperCase() + t.slice(1);
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-3 py-1 rounded border transition-colors ${
                tab === t
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'border-transparent hover:bg-muted/50 text-muted-foreground'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === 'links' && (
        <>
          <p className="text-[10px] text-amber-400/80 border border-amber-700/30 rounded px-2 py-1">
            All links below are <strong>unconfirmed</strong> — not derivable from the official MiMeDB CSV exports
            (no join table is present). Retained for educational context only.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Metabolite</TableHead>
                <TableHead className="text-xs">MIME ID</TableHead>
                <TableHead className="text-xs">Microbe Genera</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                {!presenterMode && <TableHead className="text-xs">Context</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.map((link, i) => {
                // Support both old schema (evidence/note) and new schema (evidence_note/literature_context)
                const statusText = link.evidence_note ?? link.evidence ?? 'cannot confirm';
                const contextText = link.literature_context ?? link.note ?? '';
                return (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-medium">{link.metabolite_name}</TableCell>
                    <TableCell className="text-[10px] font-mono text-muted-foreground">{link.metabolite_mime_id}</TableCell>
                    <TableCell className="text-xs">{link.microbe_genera.join(', ')}</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className="text-[9px] text-amber-400 border-amber-700/40">
                        unconfirmed
                      </Badge>
                    </TableCell>
                    {!presenterMode && (
                      <TableCell className="text-[10px] text-muted-foreground max-w-[200px]" title={statusText + ' — ' + contextText}>
                        {contextText}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}

      {tab === 'metabolites' && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">MIME ID</TableHead>
              <TableHead className="text-xs">App Role</TableHead>
              <TableHead className="text-xs">Formula</TableHead>
              <TableHead className="text-xs text-right">Avg Mass</TableHead>
              <TableHead
                className="text-xs text-right"
                title="Count only; export does not list microbes."
              >
                Relations count (export)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMetabolites.map((m, i) => (
              <TableRow key={i}>
                <TableCell className="text-xs font-medium">{m.name}</TableCell>
                <TableCell className="text-[10px] font-mono text-muted-foreground">{m.mime_id}</TableCell>
                <TableCell className="text-[10px]">
                  <Badge variant="secondary" className="text-[9px]">{m.app_role}</Badge>
                </TableCell>
                <TableCell className="text-xs font-mono">{m.formula ?? '—'}</TableCell>
                <TableCell className="text-xs text-right font-mono">{m.average_mass?.toFixed(2) ?? '—'}</TableCell>
                <TableCell className="text-xs text-right font-mono">{m.microbe_relation_count ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {tab === 'microbes' && (
        <>
          <p className="text-[10px] text-muted-foreground">Showing first 50 matching microbe entries.</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Species</TableHead>
                <TableHead className="text-xs">Genus</TableHead>
                <TableHead className="text-xs">Phylum</TableHead>
                <TableHead className="text-xs">Gram</TableHead>
                <TableHead className="text-xs">Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMicrobes.map((m, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs italic">{m.species}</TableCell>
                  <TableCell className="text-xs">{m.genus}</TableCell>
                  <TableCell className="text-xs">{m.phylum}</TableCell>
                  <TableCell className="text-xs">{m.gram ?? '—'}</TableCell>
                  <TableCell className="text-xs">{m.activity ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {/* Limitations */}
      <div className="space-y-1">
        <p className="text-[10px] font-medium text-muted-foreground">Limitations:</p>
        {data.metadata.limitations.map((l, i) => (
          <p key={i} className="text-[10px] text-muted-foreground">• {l}</p>
        ))}
      </div>
    </div>
  );
}

export default function Methods() {
  const { presenterMode } = useAppState();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Methods & Rigor</h1>

      {/* A: Limitations / Disclaimers */}
      <Card
        className={presenterMode ? 'ring-2 ring-primary/40 shadow-md shadow-primary/10' : ''}
        data-testid="disclaimers-card"
      >
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> Limitations & Scientific Wording
            {presenterMode && (
              <Badge
                className="text-[9px] bg-primary/20 text-primary border-primary/30 px-1.5 py-0 ml-1"
                title="Presenter cue: point to these three lines"
              >
                Presenter cue
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <div className={`p-3 rounded border ${presenterMode ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-border'}`}>
            <p className="font-medium text-foreground">{DISCLAIMERS.modeledProxy}</p>
          </div>
          <div className={`p-3 rounded border ${presenterMode ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-border'}`}>
            <p className="font-medium text-foreground">{DISCLAIMERS.nonCausal}</p>
          </div>
          <div className={`p-3 rounded border ${presenterMode ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-border'}`}>
            <p className="font-medium text-foreground">{DISCLAIMERS.nonDiagnostic}</p>
          </div>
          <p className="text-[10px]">
            Teens in the pilot study do not have measured microbiome or metabolomics data.
            All intermediate outputs (X, M) are <strong>proxy models vs measured data</strong> — modeled proxy variables
            derived from published reference datasets, not biomarker measurements from pilot participants.
          </p>
        </CardContent>
      </Card>

      {/* B: Leakage Guardrails */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" /> Leakage Guardrails
          </CardTitle>
        </CardHeader>
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
          <p className="text-[10px] text-muted-foreground mt-2">
            No model performance numbers are fabricated. Demo parameters are directional placeholders.
          </p>
        </CardContent>
      </Card>

      {/* C: Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Data Sources (Paired vs Unpaired)</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            <strong>Paired</strong> = inputs and outputs measured in the same participants (needed to train ML).{' '}
            <strong>Unpaired</strong> = separate studies/knowledge bases combined as reference context.
            Current v0.1 simulator stages are <strong>UNPAIRED</strong> and use frozen demo coefficients.
          </p>
        </CardHeader>
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

      {/* D: MiMeDB Evidence */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-accent" /> MiMeDB Evidence
            <Badge variant="outline" className="text-[9px]">License not confirmed</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            We bundle a build-time offline snapshot derived from MiMeDB v2 CSV exports (metabolites + microbes).
            The CSV exports do not include a verified microbe↔metabolite join table in this build.
            Therefore we do not claim confirmed microbe↔metabolite links from MiMeDB offline;
            any "links" (if shown) are labeled unconfirmed.
          </p>
          <MiMeDBSection presenterMode={presenterMode} />
        </CardContent>
      </Card>
    </div>
  );
}
