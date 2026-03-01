import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Eye, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

/** Stable key order for known object fields in evidence/sources arrays. */
const KNOWN_OBJ_KEY_ORDER = ['source_id', 'loc', 'snippet', 'sha256', 'url', 'notes', 'dataset', 'file', 'included', 'reason'];

/** Determine stable column order for an array of objects. */
function deriveColumns(items: Record<string, unknown>[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  // First, prefer known key order
  for (const k of KNOWN_OBJ_KEY_ORDER) {
    if (items.some(item => k in item)) {
      ordered.push(k);
      seen.add(k);
    }
  }
  // Then any remaining keys
  for (const item of items) {
    for (const k of Object.keys(item)) {
      if (!seen.has(k)) {
        ordered.push(k);
        seen.add(k);
      }
    }
  }
  return ordered;
}

/** Render a value for display in a table cell. */
function cellValue(v: unknown): string {
  if (v === undefined || v === null) return '';
  if (typeof v === 'boolean') return v ? 'yes' : 'no';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  if (Array.isArray(v)) return v.join(', ');
  return JSON.stringify(v);
}

/** Table rendered from an array of objects, with "Show more" expand. */
function ObjArrayTable({ items }: { items: Record<string, unknown>[] }) {
  const [showAll, setShowAll] = useState(false);
  const PAGE = 25;
  const cols = deriveColumns(items);
  const visible = showAll ? items : items.slice(0, PAGE);

  return (
    <div className="space-y-1">
      <div className="overflow-auto max-h-48 rounded border border-border" data-testid="obj-array-table">
        <table className="text-xs border-collapse w-full">
          <thead className="sticky top-0">
            <tr>
              {cols.map(c => (
                <th key={c} className="border border-border px-2 py-1 text-left bg-muted/80 font-medium whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, ri) => (
              <tr key={ri} className="hover:bg-muted/20">
                {cols.map(c => (
                  <td key={c} className="border border-border px-2 py-1 font-mono max-w-[200px] truncate" title={cellValue(row[c])}>
                    {cellValue(row[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length > PAGE && (
        <button
          className="text-[10px] text-primary underline"
          onClick={() => setShowAll(a => !a)}
        >
          {showAll ? `Show first ${PAGE}` : `Show all ${items.length} rows`}
        </button>
      )}
    </div>
  );
}

/** Pretty key/value grid for a plain object. */
function ObjGrid({ obj }: { obj: Record<string, unknown> }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs" data-testid="obj-grid">
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-mono text-muted-foreground whitespace-nowrap">{k}</dt>
          <dd className="break-words">{cellValue(v)}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Whether an array is entirely objects (not primitives). */
function isObjArray(arr: unknown[]): arr is Record<string, unknown>[] {
  return arr.length > 0 && arr.every(v => typeof v === 'object' && v !== null && !Array.isArray(v));
}

/**
 * Render a field value: array-of-objects → table, plain object → grid, else → string.
 */
function FieldValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    if (isObjArray(value)) return <ObjArrayTable items={value} />;
    // Primitive array
    return (
      <ul className="list-disc list-inside space-y-0.5">
        {value.map((s, i) => (
          <li key={i} className="text-xs leading-relaxed">{cellValue(s)}</li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'object' && value !== null) {
    return <ObjGrid obj={value as Record<string, unknown>} />;
  }
  return <span className="text-xs leading-relaxed">{cellValue(value)}</span>;
}

/** Extract a single string from a value, or null if absent/empty. */
function fieldStr(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    for (const k of ['primary', 'text', 'value']) {
      const v = fieldStr(obj[k]);
      if (v) return v;
    }
  }
  return null;
}

/** Extract a list of strings from array values, or null if absent/empty. */
function fieldStrList(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const results: string[] = [];
  for (const item of value) {
    if (typeof item === 'string') { results.push(item); continue; }
    for (const key of ['assumption', 'question', 'requirement', 'text', 'description', 'title', 'statement', 'name', 'primary']) {
      if (typeof (item as Record<string, unknown>)[key] === 'string') {
        const prefix = (item as Record<string, unknown>)['id'] ? `[${(item as Record<string, unknown>)['id']}] ` : '';
        results.push(`${prefix}${(item as Record<string, unknown>)[key]}`);
        break;
      }
    }
  }
  return results.length > 0 ? results : null;
}

/**
 * HumanView — renders a JSON doc as human-readable sections.
 * RULE: if a field is absent, do not render that section at all.
 * No "cannot confirm (missing field)" text is shown to the user.
 */
function HumanView({ parsed }: { parsed: unknown }) {
  // Handle top-level arrays (e.g. manifest JSON)
  if (Array.isArray(parsed)) {
    if (isObjArray(parsed)) {
      return (
        <div className="overflow-auto max-h-[60vh] p-1" data-testid="human-view">
          <ObjArrayTable items={parsed} />
        </div>
      );
    }
    return (
      <div className="overflow-auto max-h-[60vh] p-1" data-testid="human-view">
        <ul className="list-disc list-inside text-xs space-y-0.5">
          {(parsed as unknown[]).map((v, i) => (
            <li key={i}>{cellValue(v)}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return (
      <div className="overflow-auto max-h-[60vh] p-1 text-xs" data-testid="human-view">
        {String(parsed)}
      </div>
    );
  }

  const doc = parsed as Record<string, unknown>;
  const meta = doc['meta'] as Record<string, unknown> | undefined;

  // Extract optional fields — null means absent/empty, do not render section
  const title = fieldStr(doc['title'] ?? doc['name'] ?? meta?.['canonical_path'] ?? doc['template_id']);
  const purposeRaw = doc['purpose'] ?? doc['objective'] ?? doc['summary'] ?? doc['description'];
  const purpose = typeof purposeRaw === 'object' && purposeRaw !== null
    ? fieldStr((purposeRaw as Record<string, unknown>)['primary'] ?? (purposeRaw as Record<string, unknown>)['text'])
    : fieldStr(purposeRaw);

  const phase = fieldStr(doc['phase'] ?? meta?.['adlc_phase']);
  const state = fieldStr(meta?.['adlc_state'] ?? doc['state'] ?? doc['status']);
  const updated = fieldStr(meta?.['last_updated_utc'] ?? doc['last_updated_utc'] ?? doc['generated_utc'] ?? doc['build_timestamp']);

  // Sections that render as string lists (if extractable)
  const decisionsRaw = doc['key_decisions'] ?? doc['features'] ?? doc['decisions'] ?? doc['key_points'] ?? doc['modules'];
  const decisionsStr = fieldStrList(decisionsRaw);
  // For decisions, if it's an obj-array, fall through to generic rendering below
  const decisionsFull = Array.isArray(decisionsRaw) && isObjArray(decisionsRaw as unknown[]) ? decisionsRaw as Record<string, unknown>[] : null;

  const assumptionsStr = fieldStrList(doc['assumptions']);
  const assumptionsFull = Array.isArray(doc['assumptions']) && isObjArray(doc['assumptions'] as unknown[]) ? doc['assumptions'] as Record<string, unknown>[] : null;

  const questionsStr = fieldStrList(doc['questions'] ?? doc['open_questions']);
  const questionsFull = Array.isArray(doc['questions'] ?? doc['open_questions']) && isObjArray((doc['questions'] ?? doc['open_questions']) as unknown[]) ? (doc['questions'] ?? doc['open_questions']) as Record<string, unknown>[] : null;

  const risksStr = fieldStrList(doc['risks'] ?? doc['non_goals']);
  const risksFull = Array.isArray(doc['risks'] ?? doc['non_goals']) && isObjArray((doc['risks'] ?? doc['non_goals']) as unknown[]) ? (doc['risks'] ?? doc['non_goals']) as Record<string, unknown>[] : null;

  const sourcesRaw = doc['data_sources'] ?? doc['sources'] ?? doc['references'] ?? doc['evidence'];
  const sourcesStr = fieldStrList(sourcesRaw);
  const sourcesFull = Array.isArray(sourcesRaw) && isObjArray(sourcesRaw as unknown[]) ? sourcesRaw as Record<string, unknown>[] : null;

  const limitsRaw = doc['limitations'] ?? doc['constraints'] ?? doc['caveats'];
  const limitsStr = fieldStrList(limitsRaw);
  const limitsFull = Array.isArray(limitsRaw) && isObjArray(limitsRaw as unknown[]) ? limitsRaw as Record<string, unknown>[] : null;

  const hasAny = title || purpose || decisionsStr || decisionsFull || assumptionsStr || assumptionsFull ||
    questionsStr || questionsFull || risksStr || risksFull || sourcesStr || sourcesFull || limitsStr || limitsFull;

  const Section = ({ heading, children }: { heading: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">{heading}</h3>
      {children}
    </div>
  );

  const StrListSection = ({ heading, items, full }: { heading: string; items: string[] | null; full: Record<string, unknown>[] | null }) => {
    if (!items && !full) return null;
    return (
      <Section heading={heading}>
        {full ? (
          <ObjArrayTable items={full} />
        ) : (
          <ul className="list-disc list-inside space-y-0.5">
            {items!.map((s, i) => <li key={i} className="text-xs leading-relaxed">{s}</li>)}
          </ul>
        )}
      </Section>
    );
  };

  return (
    <div className="overflow-auto max-h-[60vh] space-y-1 p-1" data-testid="human-view">
      {/* Metadata badges */}
      <div className="flex flex-wrap gap-1 mb-3">
        {phase && <Badge variant="outline" className="text-[10px]">Phase: {phase}</Badge>}
        {state && <Badge variant="outline" className="text-[10px]">State: {state}</Badge>}
        {updated && <Badge variant="outline" className="text-[10px]">Updated: {updated.replace('T', ' ').replace('Z', ' UTC')}</Badge>}
      </div>

      {title && <Section heading="Title / Document"><p className="text-xs leading-relaxed">{title}</p></Section>}
      {purpose && <Section heading="Purpose / Objective"><p className="text-xs leading-relaxed">{purpose}</p></Section>}
      <StrListSection heading="Key Decisions / Modules" items={decisionsStr} full={decisionsFull} />
      <StrListSection heading="Assumptions" items={assumptionsStr} full={assumptionsFull} />
      <StrListSection heading="Open Questions" items={questionsStr} full={questionsFull} />
      <StrListSection heading="Risks / Non-Goals" items={risksStr} full={risksFull} />
      <StrListSection heading="Data Sources / Evidence" items={sourcesStr} full={sourcesFull} />
      <StrListSection heading="Limitations / Constraints" items={limitsStr} full={limitsFull} />

      {!hasAny && (
        <p className="text-xs italic text-muted-foreground">
          This document uses a custom schema. Switch to Raw JSON to view full content.
        </p>
      )}
    </div>
  );
}

export default function HelpDocs() {
  const [items, setItems] = useState<DocItem[]>([]);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [jsonView, setJsonView] = useState<'human' | 'raw'>('human');
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Load docs index
  useEffect(() => {
    fetch('/foundation_pack/docs_index.json')
      .then(r => r.json())
      .then(data => setItems(data.items ?? []))
      .catch(() => setItems([]));
  }, []);

  // Resolve selected item from URL param
  const selectedId = searchParams.get('doc');
  const selected = useMemo(
    () => items.find(i => i.id === selectedId) ?? null,
    [items, selectedId]
  );

  const loadDoc = useCallback(async (item: DocItem) => {
    setLoading(true);
    setContent('');
    setJsonView('human');
    try {
      const r = await fetch(item.path);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const text = await r.text();
      // Detect Vite SPA fallback — server returned HTML instead of the requested file
      if (text.trimStart().startsWith('<!doctype') || text.trimStart().startsWith('<!DOCTYPE')) {
        throw new Error(`File not found on server. The docs bundle may not be fully extracted.`);
      }
      setContent(text);
    } catch (e) {
      setContent(`Error loading document: ${e}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load when selected doc changes
  useEffect(() => {
    if (selected) {
      loadDoc(selected);
    } else {
      setContent('');
    }
  }, [selected, loadDoc]);

  const renderContent = () => {
    if (loading) {
      return <p className="text-muted-foreground text-sm animate-pulse">Loading…</p>;
    }
    if (!selected) {
      return (
        <div className="text-muted-foreground text-sm space-y-2 py-4">
          <p>Select a document from the sidebar to view it.</p>
          <p className="text-xs">Expand the <strong>Docs</strong> section in the left navigation to browse Foundation, Data, and Reference documents.</p>
        </div>
      );
    }
    if (!content) {
      return <p className="text-muted-foreground text-sm">Empty document.</p>;
    }

    // Error state
    if (content.startsWith('Error loading document:')) {
      return <p className="text-destructive text-xs font-mono">{content}</p>;
    }

    const mt = selected.media_type;

    if (mt.includes('json')) {
      try {
        const parsed: unknown = JSON.parse(content);
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
          <table className="text-xs border-collapse w-full" data-testid="csv-table">
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
        <div className="max-h-[60vh] overflow-auto text-[12px] leading-5">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-auto my-2 rounded border border-border">
                  <table className="w-full border-collapse text-[11px]">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
              th: ({ children }) => (
                <th className="border border-border px-2 py-1 text-left font-semibold whitespace-nowrap">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-2 py-1 align-top break-words">{children}</td>
              ),
              h1: ({ children }) => <h1 className="text-base font-semibold mt-2 mb-1">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-semibold mt-2 mb-1">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xs font-semibold mt-2 mb-1">{children}</h3>,
              p: ({ children }) => <p className="mb-1.5 text-[12px] leading-5">{children}</p>,
              li: ({ children }) => <li className="text-[12px] leading-5">{children}</li>,
              code: ({ children }) => (
                <code className="text-[11px] px-1 py-0.5 rounded bg-muted/50 border border-border">{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="text-[11px] p-2 rounded bg-muted/30 border border-border overflow-auto">{children}</pre>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
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
      <div>
        <h1 className="text-2xl font-bold">Help / Docs</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Foundation pack and reference snapshots — fully offline, read-only.
          {selected && (
            <span className="ml-2 text-muted-foreground/70">
              {selected.category} › {selected.title}
            </span>
          )}
        </p>
      </div>

      <Card className="min-h-[500px]">
        <CardHeader className="pb-2 flex-row items-center justify-between flex-wrap gap-1">
          <CardTitle className="text-sm">
            {selected?.title ?? 'Document Viewer'}
          </CardTitle>
          {selected && (
            <div className="flex gap-1 flex-wrap items-center">
              <Badge variant="outline" className="text-[10px] mr-1">{selected.category}</Badge>
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
  );
}
