import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Eye, Code2, ChevronDown, ChevronRight } from 'lucide-react';
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
const KNOWN_OBJ_KEY_ORDER = [
  'id', 'gate_id', 'flow_id', 'screen_id', 'source_id', 'loc', 'snippet',
  'type', 'name', 'role', 'priority', 'statement', 'rationale',
  'acceptance_criteria', 'depends_on', 'data_entities', 'trace_to_brd',
  'test_ids', 'notes', 'blocking', 'what_must_be_true', 'evidence_path',
  'sha256', 'url', 'dataset', 'file', 'included', 'reason', 'description',
];

/** Determine stable column order for an array of objects. */
function deriveColumns(items: Record<string, unknown>[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const k of KNOWN_OBJ_KEY_ORDER) {
    if (items.some(item => k in item)) { ordered.push(k); seen.add(k); }
  }
  for (const item of items) {
    for (const k of Object.keys(item)) {
      if (!seen.has(k)) { ordered.push(k); seen.add(k); }
    }
  }
  return ordered;
}

/** Whether an array is entirely objects (not primitives). */
function isObjArray(arr: unknown[]): arr is Record<string, unknown>[] {
  return arr.length > 0 && arr.every(v => typeof v === 'object' && v !== null && !Array.isArray(v));
}

/** Safely coerce a leaf value to string for plain display. Never returns [object Object]. */
function leafStr(v: unknown): string {
  if (v === undefined || v === null) return '';
  if (typeof v === 'boolean') return v ? 'yes' : 'no';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  return JSON.stringify(v, null, 2);
}

/** Try to parse a string as JSON; returns parsed value or null. */
function tryParseJson(s: string): unknown | null {
  const t = s.trim();
  if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
    try { return JSON.parse(t); } catch { /* fall through */ }
  }
  return null;
}

// ---------------------------------------------------------------------------
// SmartValue — type-aware recursive value renderer (never [object Object])
// ---------------------------------------------------------------------------

/**
 * Collapsible block for large values (objects / arrays with many entries).
 * Shows a one-line summary and expands to full pretty-printed JSON on click.
 */
function CollapsibleJson({ value, label }: { value: unknown; label?: string }) {
  const [open, setOpen] = useState(false);
  const json = JSON.stringify(value, null, 2);
  const lineCount = json.split('\n').length;
  const summaryLabel = label ?? (Array.isArray(value) ? `[${(value as unknown[]).length} items]` : '{object}');
  if (lineCount <= 4) {
    // Small enough to just show inline
    return <pre className="text-[11px] font-mono bg-muted/30 rounded p-1 whitespace-pre-wrap break-all">{json}</pre>;
  }
  return (
    <div>
      <button
        className="flex items-center gap-1 text-[11px] text-primary hover:underline"
        onClick={() => setOpen(o => !o)}
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {open ? 'Collapse' : `Expand ${summaryLabel}`}
      </button>
      {open && (
        <pre className="mt-1 text-[11px] font-mono bg-muted/30 rounded p-2 whitespace-pre-wrap break-all overflow-auto max-h-64">
          {json}
        </pre>
      )}
    </div>
  );
}

/** Evidence list — special treatment for [{source_id, loc, snippet}] arrays. */
function EvidenceList({ items }: { items: Record<string, unknown>[] }) {
  const [showAll, setShowAll] = useState(false);
  const PREVIEW = 3;
  const visible = showAll ? items : items.slice(0, PREVIEW);
  return (
    <div className="space-y-1.5">
      {visible.map((ev, i) => {
        const src = leafStr(ev['source_id']);
        const loc = leafStr(ev['loc']);
        const snippet = leafStr(ev['snippet']);
        const others = Object.entries(ev).filter(([k]) => !['source_id', 'loc', 'snippet'].includes(k));
        return (
          <div key={i} className="rounded border border-border/50 bg-muted/10 p-2 text-xs space-y-0.5">
            <div className="flex gap-2 flex-wrap">
              {src && <span className="font-semibold text-primary">{src}</span>}
              {loc && <span className="text-muted-foreground font-mono">{loc}</span>}
            </div>
            {snippet && (
              <p className="whitespace-pre-wrap break-words text-muted-foreground leading-relaxed">{snippet}</p>
            )}
            {others.map(([k, v]) => (
              <div key={k} className="flex gap-1">
                <span className="font-mono text-muted-foreground">{k}:</span>
                <SmartValue value={v} compact />
              </div>
            ))}
          </div>
        );
      })}
      {items.length > PREVIEW && (
        <button className="text-[10px] text-primary underline" onClick={() => setShowAll(a => !a)}>
          {showAll ? `Show fewer` : `Show all ${items.length} evidence items`}
        </button>
      )}
    </div>
  );
}

/**
 * SmartValue — the single, type-aware renderer for any JSON value.
 * Used in both section-level rendering and inside table cells.
 *
 * compact=true → more concise, suitable for table cells (clamped height + expand).
 */
function SmartValue({ value, compact = false }: { value: unknown; compact?: boolean }) {
  // Null / undefined
  if (value === null || value === undefined) return <span className="text-muted-foreground text-xs">—</span>;

  // Boolean
  if (typeof value === 'boolean') {
    return <Badge variant="outline" className="text-[10px]">{value ? 'yes' : 'no'}</Badge>;
  }

  // String — may be JSON-encoded nested value
  if (typeof value === 'string') {
    const parsed = tryParseJson(value);
    if (parsed !== null) return <SmartValue value={parsed} compact={compact} />;
    if (!compact) return <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">{value}</p>;
    return <ExpandableText text={value} />;
  }

  // Number
  if (typeof value === 'number') {
    return <span className="text-xs font-mono">{String(value)}</span>;
  }

  // Array
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground text-xs">[ ]</span>;

    // Evidence arrays [{source_id, loc, snippet}]
    if (isObjArray(value) && value.some(v => 'source_id' in v || 'snippet' in v)) {
      return compact
        ? <CollapsibleJson value={value} label={`[${value.length} evidence items]`} />
        : <EvidenceList items={value} />;
    }

    // Generic object arrays → table
    if (isObjArray(value)) {
      return compact
        ? <CollapsibleJson value={value} label={`[${value.length} items]`} />
        : <ObjArrayTable items={value} />;
    }

    // Mixed/primitive arrays → bullet list
    return (
      <ul className="list-disc list-inside space-y-0.5">
        {value.map((item, i) => (
          <li key={i} className="text-xs leading-relaxed">
            <SmartValue value={item} compact />
          </li>
        ))}
      </ul>
    );
  }

  // Plain object
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    // Wrapper objects like {summary, evidence} or {primary, evidence} — render structured
    const keys = Object.keys(obj);
    const hasEvidence = 'evidence' in obj && Array.isArray(obj['evidence']);
    if (!compact && (hasEvidence || keys.length <= 8)) {
      return <SmartObject obj={obj} />;
    }

    return <CollapsibleJson value={value} />;
  }

  return <span className="text-xs">{leafStr(value)}</span>;
}

/** Expandable text for long strings inside compact (table-cell) context. */
function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const CLAMP = 120;
  if (text.length <= CLAMP) {
    return <span className="text-xs whitespace-pre-wrap break-words">{text}</span>;
  }
  return (
    <span className="text-xs whitespace-pre-wrap break-words">
      {expanded ? text : text.slice(0, CLAMP) + '…'}
      <button
        className="ml-1 text-primary underline text-[10px]"
        onClick={() => setExpanded(e => !e)}
      >
        {expanded ? 'less' : 'more'}
      </button>
    </span>
  );
}

/** Renders a plain object as a key/value definition list, each value via SmartValue. */
function SmartObject({ obj }: { obj: Record<string, unknown> }) {
  return (
    <dl className="space-y-1 text-xs" data-testid="obj-grid">
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} className="grid grid-cols-[auto_1fr] gap-x-3 items-start">
          <dt className="font-mono text-muted-foreground whitespace-nowrap pt-0.5">{k}</dt>
          <dd><SmartValue value={v} /></dd>
        </div>
      ))}
    </dl>
  );
}

/** Table rendered from an array of objects, with "Show more" expand. */
function ObjArrayTable({ items }: { items: Record<string, unknown>[] }) {
  const [showAll, setShowAll] = useState(false);
  const PAGE = 25;
  const cols = deriveColumns(items);
  const visible = showAll ? items : items.slice(0, PAGE);

  return (
    <div className="space-y-1">
      <div className="overflow-auto max-h-[60vh] rounded border border-border" data-testid="obj-array-table">
        <table className="text-xs border-collapse" style={{ minWidth: '100%', tableLayout: 'auto' }}>
          <thead className="sticky top-0 z-10">
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
              <tr key={ri} className="hover:bg-muted/20 align-top">
                {cols.map(c => (
                  <td key={c} className="border border-border px-2 py-1 max-w-[280px]">
                    <SmartValue value={row[c]} compact />
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

// ---------------------------------------------------------------------------
// Section-level label map: maps JSON field names to human-readable headings
// ---------------------------------------------------------------------------
const SECTION_LABELS: Record<string, string> = {
  title: 'Title / Document',
  name: 'Name',
  purpose: 'Purpose / Objective',
  objective: 'Purpose / Objective',
  summary: 'Summary',
  description: 'Description',
  goal: 'Goal',
  business_idea: 'Business Idea',
  problem_statement: 'Problem Statement',
  primary_user: 'Primary User',
  success_metrics: 'Success Metrics',
  scope: 'Scope',
  platforms: 'Platforms',
  user_flows: 'User Flows',
  core_flows: 'Core Flows',
  screens: 'Screens',
  requirements: 'Requirements',
  requirement_format: 'Requirement Format',
  unknowns: 'Open Unknowns',
  gates: 'Approval Gates',
  key_decisions: 'Key Decisions',
  features: 'Features',
  decisions: 'Decisions',
  key_points: 'Key Points',
  modules: 'Modules',
  assumptions: 'Assumptions',
  questions: 'Open Questions',
  open_questions: 'Open Questions',
  risks: 'Risks',
  non_goals: 'Non-Goals',
  data_sources: 'Data Sources',
  sources: 'Sources',
  references: 'References',
  evidence: 'Evidence',
  limitations: 'Limitations',
  constraints: 'Constraints',
  caveats: 'Caveats',
  personas: 'Personas',
  pages: 'Document Pages',
  records: 'Records',
  provenance: 'Provenance',
};

// Fields we skip in generic rendering (schema metadata, already extracted as badges)
const SKIP_FIELDS = new Set([
  'meta', 'schema_version', 'template_id', 'template_version', 'template_kind',
  'phase', 'state', 'status', 'generated_utc', 'last_updated_utc', 'build_timestamp',
  'doc_id', 'source', 'outline',
]);

/**
 * HumanView — renders a JSON doc as human-readable sections.
 * Every value is rendered through SmartValue, which never shows [object Object].
 */
function HumanView({ parsed }: { parsed: unknown }) {
  // Handle top-level arrays (e.g. manifest JSON)
  if (Array.isArray(parsed)) {
    return (
      <div className="overflow-auto max-h-[60vh] p-1" data-testid="human-view">
        <SmartValue value={parsed} />
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

  const phase = fieldStr(doc['phase'] ?? meta?.['adlc_phase']);
  const state = fieldStr(meta?.['adlc_state'] ?? doc['state'] ?? doc['status']);
  const updated = fieldStr(meta?.['last_updated_utc'] ?? doc['last_updated_utc'] ?? doc['generated_utc'] ?? doc['build_timestamp']);

  const Section = ({ heading, children }: { heading: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1 border-b border-border/30 pb-0.5">
        {heading}
      </h3>
      {children}
    </div>
  );

  // If pages[] is present and non-empty, skip full_text / full_content — duplicate of Pages section.
  const hasPages = Array.isArray(doc['pages']) && (doc['pages'] as unknown[]).length > 0;
  const effectiveSkip = hasPages
    ? new Set([...SKIP_FIELDS, 'full_text', 'full_content', 'text'])
    : SKIP_FIELDS;

  // Collect sections: known fields first (in SECTION_LABELS order), then any remainder
  const renderedKeys = new Set<string>();
  const sections: Array<{ key: string; heading: string; value: unknown }> = [];

  for (const key of Object.keys(SECTION_LABELS)) {
    const val = doc[key];
    if (val !== undefined && val !== null && val !== '' && !effectiveSkip.has(key)) {
      sections.push({ key, heading: SECTION_LABELS[key], value: val });
      renderedKeys.add(key);
    }
  }

  for (const key of Object.keys(doc)) {
    if (!renderedKeys.has(key) && !effectiveSkip.has(key)) {
      const val = doc[key];
      if (val !== undefined && val !== null && val !== '') {
        const heading = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        sections.push({ key, heading, value: val });
      }
    }
  }

  return (
    <div className="overflow-auto max-h-[60vh] space-y-1 p-1" data-testid="human-view">
      {/* Metadata badges */}
      <div className="flex flex-wrap gap-1 mb-3">
        {phase && <Badge variant="outline" className="text-[10px]">Phase: {phase}</Badge>}
        {state && <Badge variant="outline" className="text-[10px]">State: {state}</Badge>}
        {updated && <Badge variant="outline" className="text-[10px]">Updated: {updated.replace('T', ' ').replace('Z', ' UTC')}</Badge>}
      </div>

      {sections.map(({ key, heading, value }) => (
        <Section key={key} heading={heading}>
          <SmartValue value={value} />
        </Section>
      ))}

      {sections.length === 0 && (
        <p className="text-xs italic text-muted-foreground">
          No displayable fields found. Switch to Raw JSON to view full content.
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
      // Detect Vite SPA fallback via Content-Type header
      const ct = r.headers?.get?.('content-type') ?? '';
      if (ct.toLowerCase().startsWith('text/html')) {
        throw new Error(
          `Document missing from /public. Run build steps to populate /public/foundation_pack/**.`
        );
      }
      const text = await r.text();
      // Secondary guard: body-level doctype detection
      if (text.trimStart().startsWith('<!doctype') || text.trimStart().startsWith('<!DOCTYPE')) {
        throw new Error(
          `Document missing from /public. Run build steps to populate /public/foundation_pack/**.`
        );
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
        <div className="overflow-auto max-h-[60vh]" data-testid="csv-view">
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
        <div className="max-h-[60vh] overflow-auto text-[12px] leading-5" data-testid="markdown-view">
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
              // External links are rendered as non-clickable plain text with a URL label.
              // This prevents accidental browser navigation during live demos.
              a: ({ href, children }) => (
                <span
                  className="inline-flex flex-wrap items-baseline gap-x-1"
                  data-testid="safe-link"
                  data-href={href}
                >
                  <span className="text-primary">{children}</span>
                  {href && (
                    <span className="text-[10px] font-mono text-muted-foreground break-all">
                      [{href}]
                    </span>
                  )}
                </span>
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
