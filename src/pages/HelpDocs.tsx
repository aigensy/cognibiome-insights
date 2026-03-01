import { useEffect, useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Search, Eye, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface DocItem {
  id: string;
  title: string;
  path: string;
  category: string;
  media_type: string;
  description: string;
}

/**
 * RFC-4180 compliant CSV parser. Handles quoted fields containing commas and newlines.
 */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        row.push(field);
        field = '';
        i++;
      } else if (ch === '\n' || ch === '\r') {
        row.push(field);
        field = '';
        if (ch === '\r' && text[i + 1] === '\n') i++;
        if (row.some(c => c !== '') || rows.length > 0) {
          rows.push(row);
        }
        row = [];
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }
  // Flush last field/row
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Human-readable view for JSON foundation-pack documents
// ---------------------------------------------------------------------------

/** Extract a displayable string or "cannot confirm (missing field)". */
function fieldOrMissing(value: unknown): string {
  if (value === undefined || value === null || value === '') return 'cannot confirm (missing field)';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

/** Pull a list of string items from various array-of-{id, text, ...} shapes. */
function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(item => {
    if (typeof item === 'string') return item;
    // Common patterns: {assumption, question, requirement, text, description, title, statement}
    for (const key of ['assumption', 'question', 'requirement', 'text', 'description', 'title', 'statement', 'name', 'primary']) {
      if (typeof item[key] === 'string') {
        const prefix = item['id'] ? `[${item['id']}] ` : '';
        return `${prefix}${item[key]}`;
      }
    }
    return JSON.stringify(item);
  });
}

/**
 * Mapping layer: attempts to render a JSON doc in human-readable sections.
 * Falls back to "cannot confirm (missing field)" when fields are absent.
 */
function HumanView({ parsed }: { parsed: Record<string, unknown> }) {
  // Title — try multiple locations
  const title =
    fieldOrMissing(
      parsed['title'] ??
      parsed['name'] ??
      (parsed['meta'] as Record<string, unknown> | undefined)?.['canonical_path'] ??
      parsed['template_id']
    );

  // Purpose / objective
  const purposeRaw = parsed['purpose'] ?? parsed['objective'] ?? parsed['summary'] ?? parsed['description'];
  const purpose =
    typeof purposeRaw === 'object' && purposeRaw !== null
      ? fieldOrMissing((purposeRaw as Record<string, unknown>)['primary'] ?? (purposeRaw as Record<string, unknown>)['text'])
      : fieldOrMissing(purposeRaw);

  // Key decisions / features / sections
  const decisionsRaw =
    parsed['key_decisions'] ?? parsed['features'] ?? parsed['decisions'] ?? parsed['key_points'] ?? parsed['modules'];
  const decisions = toStringList(decisionsRaw);

  // Assumptions
  const assumptionsRaw = parsed['assumptions'];
  const assumptions = toStringList(assumptionsRaw);

  // Open questions
  const questionsRaw = parsed['questions'] ?? parsed['open_questions'];
  const questions = toStringList(questionsRaw);

  // Risks
  const risksRaw = parsed['risks'] ?? parsed['non_goals'];
  const risks = toStringList(risksRaw);

  // Data sources / references
  const sourcesRaw = parsed['data_sources'] ?? parsed['sources'] ?? parsed['references'] ?? parsed['evidence'];
  const sources = toStringList(sourcesRaw);

  // Limitations / constraints
  const limitsRaw = parsed['limitations'] ?? parsed['constraints'] ?? parsed['caveats'];
  const limits = toStringList(limitsRaw);

  // Phase / state metadata
  const meta = parsed['meta'] as Record<string, unknown> | undefined;
  const phase = fieldOrMissing(parsed['phase'] ?? meta?.['adlc_phase']);
  const state = fieldOrMissing(meta?.['adlc_state'] ?? parsed['state'] ?? parsed['status']);
  const updated = fieldOrMissing(meta?.['last_updated_utc'] ?? parsed['last_updated_utc'] ?? parsed['generated_utc'] ?? parsed['build_timestamp']);

  const Section = ({
    heading,
    items,
    text,
  }: {
    heading: string;
    items?: string[];
    text?: string;
  }) => (
    <div className="mb-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{heading}</h3>
      {text !== undefined && (
        <p className={`text-xs leading-relaxed ${text.startsWith('cannot confirm') ? 'italic text-muted-foreground' : ''}`}>
          {text}
        </p>
      )}
      {items !== undefined && items.length === 0 && (
        <p className="text-xs italic text-muted-foreground">cannot confirm (missing field)</p>
      )}
      {items !== undefined && items.length > 0 && (
        <ul className="list-disc list-inside space-y-0.5">
          {items.map((s, i) => (
            <li key={i} className="text-xs leading-relaxed">{s}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="overflow-auto max-h-[60vh] space-y-1 p-1" data-testid="human-view">
      {/* Header strip */}
      <div className="flex flex-wrap gap-1 mb-3">
        {phase !== 'cannot confirm (missing field)' && (
          <Badge variant="outline" className="text-[10px]">Phase: {phase}</Badge>
        )}
        {state !== 'cannot confirm (missing field)' && (
          <Badge variant="outline" className="text-[10px]">State: {state}</Badge>
        )}
        {updated !== 'cannot confirm (missing field)' && (
          <Badge variant="outline" className="text-[10px]">Updated: {updated.replace('T', ' ').replace('Z', ' UTC')}</Badge>
        )}
      </div>

      <Section heading="Title / Document" text={title} />
      <Section heading="Purpose / Objective" text={purpose} />
      {decisions.length > 0 && <Section heading="Key Decisions / Modules" items={decisions} />}
      {assumptions.length > 0 && <Section heading="Assumptions" items={assumptions} />}
      {questions.length > 0 && <Section heading="Open Questions" items={questions} />}
      {risks.length > 0 && <Section heading="Risks / Non-Goals" items={risks} />}
      {sources.length > 0 && <Section heading="Data Sources / Evidence" items={sources} />}
      {limits.length > 0 && <Section heading="Limitations / Constraints" items={limits} />}

      {/* Show note if very few fields could be mapped */}
      {[decisions, assumptions, questions, risks, sources, limits].every(l => l.length === 0) &&
        purpose.startsWith('cannot confirm') && (
          <p className="text-xs italic text-muted-foreground">
            This document uses a custom schema. Switch to Raw JSON to view full content.
          </p>
        )}
    </div>
  );
}

export default function HelpDocs() {
  const [items, setItems] = useState<DocItem[]>([]);
  const [selected, setSelected] = useState<DocItem | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [jsonView, setJsonView] = useState<'human' | 'raw'>('human');
  const { toast } = useToast();

  useEffect(() => {
    fetch('/foundation_pack/docs_index.json')
      .then(r => r.json())
      .then(data => setItems(data.items ?? []))
      .catch(() => setItems([]));
  }, []);

  const loadDoc = async (item: DocItem) => {
    setSelected(item);
    setLoading(true);
    setContent('');
    setJsonView('human');
    try {
      const r = await fetch(item.path);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setContent(await r.text());
    } catch (e) {
      setContent(`Error loading document: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.path.toLowerCase().includes(q)
    );
  }, [items, search]);

  const categories = useMemo(
    () => [...new Set(filteredItems.map(i => i.category))],
    [filteredItems]
  );

  const renderContent = () => {
    if (loading) {
      return <p className="text-muted-foreground text-sm animate-pulse">Loading…</p>;
    }
    if (!selected) {
      return <p className="text-muted-foreground text-sm">Select a document to view.</p>;
    }
    if (!content) {
      return <p className="text-muted-foreground text-sm">Empty document.</p>;
    }

    const mt = selected.media_type;

    if (mt.includes('json')) {
      try {
        const parsed = JSON.parse(content) as Record<string, unknown>;
        if (jsonView === 'human') {
          return <HumanView parsed={parsed} />;
        }
        return (
          <pre className="text-xs font-mono overflow-auto max-h-[60vh] whitespace-pre-wrap" data-testid="raw-json">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        );
      } catch {
        return (
          <pre className="text-xs font-mono overflow-auto max-h-[60vh] whitespace-pre-wrap">
            {content}
          </pre>
        );
      }
    }

    if (mt.includes('csv')) {
      const rows = parseCSV(content.trim());
      const headers = rows[0] ?? [];
      const dataRows = rows.slice(1, 101);
      return (
        <div className="overflow-auto max-h-[60vh]">
          <p className="text-[10px] text-muted-foreground mb-2">
            {rows.length - 1} rows total (showing first {Math.min(dataRows.length, 100)})
          </p>
          <table className="text-xs border-collapse w-full">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="border border-border px-2 py-1 text-left bg-muted/50">
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((c, ci) => (
                    <td key={ci} className="border border-border px-2 py-1 font-mono">
                      {c.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (mt.includes('markdown')) {
      return (
        <div className="prose prose-invert prose-sm max-w-none max-h-[60vh] overflow-auto">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      );
    }

    // plain text / fallback
    return (
      <pre className="text-xs font-mono overflow-auto max-h-[60vh] whitespace-pre-wrap">
        {content}
      </pre>
    );
  };

  const copyContent = () => {
    navigator.clipboard.writeText(content).then(() => toast({ title: 'Copied to clipboard' }));
  };

  const downloadContent = () => {
    if (!selected) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selected.path.split('/').pop() ?? 'document';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Help / Docs</h1>
      <p className="text-xs text-muted-foreground">
        Foundation pack and reference snapshots — fully offline, read-only.
      </p>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search documents…"
          className="pl-8 h-8 text-xs"
          aria-label="Search documents"
        />
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No documents loaded. Run <code>npm run extract:bundle</code> to populate the docs index.
        </p>
      )}

      {filteredItems.length === 0 && items.length > 0 && (
        <p className="text-sm text-muted-foreground">No documents match your search.</p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-2">
          {categories.length > 0 && (
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="w-full flex-wrap h-auto">
                {categories.map(c => (
                  <TabsTrigger key={c} value={c} className="text-xs">
                    {c}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map(c => (
                <TabsContent key={c} value={c} className="space-y-1 mt-2">
                  {filteredItems
                    .filter(i => i.category === c)
                    .map(item => (
                      <button
                        key={item.id}
                        onClick={() => loadDoc(item)}
                        className={`w-full text-left px-3 py-2 rounded text-xs hover:bg-muted/50 transition-colors ${
                          selected?.id === item.id
                            ? 'bg-primary/10 text-primary border border-primary/30'
                            : 'border border-transparent'
                        }`}
                      >
                        <p className="font-medium">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground">{item.description}</p>
                      </button>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2 flex-row items-center justify-between flex-wrap gap-1">
              <CardTitle className="text-sm">{selected?.title ?? 'Document Viewer'}</CardTitle>
              {selected && (
                <div className="flex gap-1 flex-wrap">
                  {selected.media_type.includes('json') && (
                    <>
                      <Button
                        variant={jsonView === 'human' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => setJsonView('human')}
                        aria-pressed={jsonView === 'human'}
                        data-testid="toggle-human-view"
                      >
                        <Eye className="h-3 w-3" /> Human View
                      </Button>
                      <Button
                        variant={jsonView === 'raw' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={() => setJsonView('raw')}
                        aria-pressed={jsonView === 'raw'}
                        data-testid="toggle-raw-json"
                      >
                        <Code2 className="h-3 w-3" /> Raw JSON
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={copyContent}
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={downloadContent}
                  >
                    <Download className="h-3 w-3" /> Download
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>{renderContent()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
