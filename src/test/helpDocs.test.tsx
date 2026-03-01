/**
 * TST-007 — HelpDocs offline smoke test
 * Mocks fetch() to provide a fake docs_index and various document types,
 * then asserts that JSON, CSV, Markdown, and TXT render paths all work.
 *
 * Since the document list now lives in AppSidebar (not HelpDocs), tests
 * pre-select documents via the ?doc= URL query param using MemoryRouter.
 *
 * Also covers Task D fixes:
 * - Missing sections are NOT rendered (no "cannot confirm" text)
 * - Array-of-objects renders as a table (obj-array-table)
 * - Top-level JSON arrays render as tables
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HelpDocs from '@/pages/HelpDocs';

// ---------------------------------------------------------------------------
// Fake data fixtures
// ---------------------------------------------------------------------------

const FAKE_INDEX = {
  items: [
    {
      id: 'D001',
      title: 'JSON Doc',
      path: '/test/doc.json',
      category: 'Foundation',
      media_type: 'application/json',
      description: 'A JSON document',
    },
    {
      id: 'D001b',
      title: 'Rich JSON Doc',
      path: '/test/rich.json',
      category: 'Foundation',
      media_type: 'application/json',
      description: 'A richer JSON document with known fields',
    },
    {
      id: 'D001c',
      title: 'No-Purpose JSON Doc',
      path: '/test/nopurpose.json',
      category: 'Foundation',
      media_type: 'application/json',
      description: 'A JSON doc without purpose/objective fields',
    },
    {
      id: 'D001d',
      title: 'Evidence JSON Doc',
      path: '/test/evidence.json',
      category: 'Foundation',
      media_type: 'application/json',
      description: 'A JSON doc with evidence as array-of-objects',
    },
    {
      id: 'D001e',
      title: 'Array JSON Doc',
      path: '/test/array.json',
      category: 'Foundation',
      media_type: 'application/json',
      description: 'A top-level JSON array',
    },
    {
      id: 'D002',
      title: 'CSV Doc',
      path: '/test/data.csv',
      category: 'Foundation',
      media_type: 'text/csv',
      description: 'A CSV dataset',
    },
    {
      id: 'D003',
      title: 'Markdown Doc',
      path: '/test/readme.md',
      category: 'Foundation',
      media_type: 'text/markdown',
      description: 'A markdown file',
    },
    {
      id: 'D004',
      title: 'Text Doc',
      path: '/test/notes.txt',
      category: 'Foundation',
      media_type: 'text/plain',
      description: 'A plain text file',
    },
  ],
};

const FAKE_JSON = { hello: 'world', count: 42 };

// A richer JSON doc with fields the Human View knows about
// assumptions is an obj-array → renders as ObjArrayTable (not a list)
const FAKE_RICH_JSON = {
  title: 'Sample Requirements',
  purpose: 'Demonstrate human-readable rendering of a foundation document.',
  assumptions: [
    { id: 'ASM-001', assumption: 'App runs offline' },
    { id: 'ASM-002', assumption: 'No medical claims' },
  ],
  open_questions: [
    { id: 'OQ-001', question: 'Which datasets are in scope?' },
  ],
  risks: ['No live API calls allowed', 'Data must be de-identified'],
  meta: { adlc_state: 'Draft', adlc_phase: 'INCEPTION', last_updated_utc: '2026-03-01T00:00:00Z' },
};

// A JSON doc WITHOUT purpose/objective (Task D test: no "cannot confirm" text)
const FAKE_NO_PURPOSE_JSON = {
  title: 'Some Custom Doc',
  // No purpose, no objective, no summary, no description
  some_custom_field: 'hello',
};

// A JSON doc with evidence as an array of objects (Task D test: renders as table)
const FAKE_EVIDENCE_JSON = {
  title: 'Evidence Doc',
  purpose: 'Show evidence as a table.',
  data_sources: [
    { source_id: 'src-1', loc: 'L1-L5', snippet: 'First snippet' },
    { source_id: 'src-2', loc: 'L10-L15', snippet: 'Second snippet' },
  ],
};

// A top-level JSON array (Task D test: renders as obj-array-table)
const FAKE_ARRAY_JSON = [
  { dataset: 'NHANES', included: true, row_count: 11 },
  { dataset: 'HMP', included: false, reason: 'Not accessible' },
];

const FAKE_CSV = `name,score\nAlice,95\n"Bob, Jr.",87\nCarol,100`;
const FAKE_MD = `# Hello\n\nThis is **markdown** content.`;
const FAKE_TXT = `Line one\nLine two`;

function makeFetch(extraResponses: Record<string, unknown> = {}) {
  const responses: Record<string, unknown> = {
    '/foundation_pack/docs_index.json': FAKE_INDEX,
    '/test/doc.json': FAKE_JSON,
    '/test/rich.json': FAKE_RICH_JSON,
    '/test/nopurpose.json': FAKE_NO_PURPOSE_JSON,
    '/test/evidence.json': FAKE_EVIDENCE_JSON,
    '/test/array.json': FAKE_ARRAY_JSON,
    '/test/data.csv': FAKE_CSV,
    '/test/readme.md': FAKE_MD,
    '/test/notes.txt': FAKE_TXT,
    ...extraResponses,
  };

  return vi.fn(async (url: string) => {
    const body = responses[url];
    if (body === undefined) {
      return { ok: false, status: 404, text: async () => 'not found', json: async () => ({}) };
    }
    const text = typeof body === 'string' ? body : JSON.stringify(body);
    return {
      ok: true,
      status: 200,
      text: async () => text,
      json: async () => (typeof body === 'string' ? JSON.parse(text) : body),
    };
  });
}

/** Helper: render HelpDocs with a specific ?doc=ID pre-selected */
function renderWithDoc(docId: string) {
  return render(
    <MemoryRouter initialEntries={[`/help?doc=${docId}`]}>
      <HelpDocs />
    </MemoryRouter>
  );
}

/** Helper: render HelpDocs with no doc selected */
function renderEmpty() {
  return render(
    <MemoryRouter initialEntries={['/help']}>
      <HelpDocs />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('HelpDocs (TST-007)', () => {
  it('shows placeholder text when no document is selected', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderEmpty();
    await waitFor(() => {
      expect(screen.getByText(/Select a document from the sidebar/)).toBeInTheDocument();
    });
  });

  it('renders JSON document as pretty-printed raw JSON when Raw JSON toggle is clicked', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderWithDoc('D001');
    // Wait for the doc to load and the Raw JSON toggle to appear
    await waitFor(() => screen.getByTestId('toggle-raw-json'));
    fireEvent.click(screen.getByTestId('toggle-raw-json'));
    await waitFor(() => {
      expect(screen.getByTestId('raw-json')).toBeInTheDocument();
      expect(screen.getByText(/"hello":/)).toBeInTheDocument();
    });
  });

  it('renders CSV document as a table with RFC-4180 parsing (quoted commas)', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderWithDoc('D002');
    await waitFor(() => {
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob, Jr.')).toBeInTheDocument();
    });
  });

  it('renders Markdown document via react-markdown', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderWithDoc('D003');
    await waitFor(() => {
      const headings = screen.getAllByRole('heading', { level: 1 });
      expect(headings.some(h => h.textContent === 'Hello')).toBe(true);
    });
  });

  it('renders plain text document in a pre block', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderWithDoc('D004');
    await waitFor(() => {
      expect(screen.getByText(/Line one/)).toBeInTheDocument();
    });
  });

  it('shows empty state when docs_index fails to load', async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 500,
      text: async () => '',
      json: async () => { throw new Error('fail'); },
    })) as unknown as typeof fetch;
    renderEmpty();
    await waitFor(() => {
      expect(screen.getByText(/Select a document from the sidebar/)).toBeInTheDocument();
    });
  });

  it('renders JSON doc in Human View by default (shows key headings)', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderWithDoc('D001b');
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
    });
    expect(screen.getByText(/Title \/ Document/i)).toBeInTheDocument();
    expect(screen.getByText(/Purpose \/ Objective/i)).toBeInTheDocument();
    expect(screen.getByText(/Assumptions/i)).toBeInTheDocument();
  });

  it('Human View renders assumptions as an obj-array-table (not raw JSON)', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderWithDoc('D001b');
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
    });
    // assumptions is an array of objects → should render as at least one table
    const tables = screen.getAllByTestId('obj-array-table');
    expect(tables.length).toBeGreaterThan(0);
    // The column header for 'assumption' should appear in the assumptions table
    expect(screen.getByText('assumption')).toBeInTheDocument();
  });

  it('Raw JSON toggle switches to raw pre block and back', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderWithDoc('D001b');
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('toggle-raw-json'));
    await waitFor(() => {
      expect(screen.getByTestId('raw-json')).toBeInTheDocument();
      expect(screen.queryByTestId('human-view')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('toggle-human-view'));
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
      expect(screen.queryByTestId('raw-json')).not.toBeInTheDocument();
    });
  });

  // ---- Task D: missing-section fix tests ----

  it('D.1 — JSON doc without purpose/objective does NOT show "cannot confirm" text', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderWithDoc('D001c');
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
    });
    // Must NOT contain "cannot confirm" anywhere in the rendered output
    expect(screen.queryByText(/cannot confirm/i)).not.toBeInTheDocument();
  });

  it('D.1 — JSON doc without purpose/objective does NOT render the "Purpose / Objective" section header', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderWithDoc('D001c');
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
    });
    expect(screen.queryByText(/Purpose \/ Objective/i)).not.toBeInTheDocument();
  });

  it('D.2 — JSON doc with evidence as array-of-objects renders as a table', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderWithDoc('D001d');
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
    });
    // Should render as obj-array-table, not raw JSON blob
    expect(screen.getByTestId('obj-array-table')).toBeInTheDocument();
    // Column headers should be present
    expect(screen.getByText('source_id')).toBeInTheDocument();
    expect(screen.getByText('snippet')).toBeInTheDocument();
    // Row values should be visible
    expect(screen.getByText('src-1')).toBeInTheDocument();
    // Must NOT show raw "{" JSON blob
    expect(screen.queryByText(/^\{/)).not.toBeInTheDocument();
  });

  it('D.3 — Top-level JSON array renders as a table in Human View', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    renderWithDoc('D001e');
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
    });
    // Should show a table with columns from the objects
    expect(screen.getByTestId('obj-array-table')).toBeInTheDocument();
    expect(screen.getByText('dataset')).toBeInTheDocument();
    expect(screen.getByText('NHANES')).toBeInTheDocument();
    expect(screen.getByText('HMP')).toBeInTheDocument();
  });

  // ---- Task 2: Vite HTML fallback detection ----

  it('TASK2 — loadDoc() shows error when server returns HTML (Vite SPA fallback)', async () => {
    // Simulate Vite dev-server returning its index.html for a missing JSON path
    const VITE_HTML = `<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8" /><title>CogniBiome</title></head>
  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>`;

    const fetchWithHtmlFallback = vi.fn(async (url: string) => {
      if (url === '/foundation_pack/docs_index.json') {
        return {
          ok: true, status: 200,
          text: async () => JSON.stringify(FAKE_INDEX),
          json: async () => FAKE_INDEX,
        };
      }
      // All doc fetches return HTML (Vite fallback)
      return {
        ok: true, status: 200,
        headers: { get: (h: string) => h === 'content-type' ? 'text/html' : null },
        text: async () => VITE_HTML,
        json: async () => { throw new Error('not json'); },
      };
    });

    global.fetch = fetchWithHtmlFallback as unknown as typeof fetch;
    renderWithDoc('D001');

    await waitFor(() => {
      // Should show an error message, NOT the raw HTML content
      const errorEl = screen.queryByText(/Error loading document:/i);
      const htmlEl = screen.queryByText(/<!doctype/i);
      expect(htmlEl).not.toBeInTheDocument();
      expect(errorEl).toBeInTheDocument();
    });
  });

  it('TASK2 — loadDoc() shows error when content-type is text/html', async () => {
    const HTML_BODY = '<!DOCTYPE html><html><body>fallback</body></html>';

    const fetchWithHtmlContentType = vi.fn(async (url: string) => {
      if (url === '/foundation_pack/docs_index.json') {
        return {
          ok: true, status: 200,
          text: async () => JSON.stringify(FAKE_INDEX),
          json: async () => FAKE_INDEX,
          headers: { get: () => 'application/json' },
        };
      }
      return {
        ok: true, status: 200,
        headers: { get: (h: string) => h === 'content-type' ? 'text/html; charset=utf-8' : null },
        text: async () => HTML_BODY,
        json: async () => { throw new Error('not json'); },
      };
    });

    global.fetch = fetchWithHtmlContentType as unknown as typeof fetch;
    renderWithDoc('D001');

    await waitFor(() => {
      expect(screen.queryByText(/<!DOCTYPE/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Error loading document:/i)).toBeInTheDocument();
    });
  });
});

// ---- Task E: PublicDatasets manifest + NHANES tests ----

describe('PublicDatasets manifest tests', () => {
  const FAKE_MANIFEST = [
    {
      dataset: 'NHANES',
      file: 'reference/nhanes_nutrient_reference.csv',
      included: true,
      row_count: 11,
      sha256: 'abc123',
      provenance: { source_url: 'https://cdc.gov', notes: 'Test notes' },
    },
    {
      dataset: 'HMP',
      file: 'public/reference/hmp_genus_reference.csv',
      included: false,
      reason: 'Network restrictions',
      provenance: { source_url: 'http://hmpdacc.org', notes: '' },
    },
  ];

  const FAKE_NHANES_CSV = `variable_code,nutrient_name,unit,min_value,max_value,source_year_range
DR1TFIBE,Dietary fiber,gm,0,127.3,2021-2022
DR1TSFAT,Total saturated fatty acids,gm,0,208.842,2021-2022`;

  function makeManifestFetch() {
    return vi.fn(async (url: string) => {
      if (url === '/reference/public_datasets_manifest.json') {
        return { ok: true, status: 200, json: async () => FAKE_MANIFEST, text: async () => JSON.stringify(FAKE_MANIFEST) };
      }
      if (url === '/reference/nhanes_nutrient_reference.csv') {
        return { ok: true, status: 200, text: async () => FAKE_NHANES_CSV, json: async () => ({}) };
      }
      return { ok: false, status: 404, text: async () => '', json: async () => ({}) };
    });
  }

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('E.1 — manifest loads and NHANES row is marked as included', async () => {
    const { default: PublicDatasets } = await import('@/pages/PublicDatasets');
    global.fetch = makeManifestFetch() as unknown as typeof fetch;
    render(
      <MemoryRouter>
        <PublicDatasets />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('manifest-table')).toBeInTheDocument();
    });
    // NHANES appears multiple times (summary table + card title), use getAllByText
    const nhanesElements = screen.getAllByText('NHANES');
    expect(nhanesElements.length).toBeGreaterThan(0);
    // manifest table is present
    expect(screen.getByTestId('manifest-table')).toBeInTheDocument();
  });

  it('E.2 — NHANES card shows Preview and Download buttons', async () => {
    const { default: PublicDatasets } = await import('@/pages/PublicDatasets');
    global.fetch = makeManifestFetch() as unknown as typeof fetch;
    render(
      <MemoryRouter>
        <PublicDatasets />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('preview-btn-NHANES')).toBeInTheDocument();
    });
    expect(screen.getByTestId('download-btn-NHANES')).toBeInTheDocument();
  });

  it('E.3 — NHANES preview shows the nutrient table after clicking Preview', async () => {
    const { default: PublicDatasets } = await import('@/pages/PublicDatasets');
    global.fetch = makeManifestFetch() as unknown as typeof fetch;
    render(
      <MemoryRouter>
        <PublicDatasets />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByTestId('preview-btn-NHANES'));
    fireEvent.click(screen.getByTestId('preview-btn-NHANES'));
    await waitFor(() => {
      expect(screen.getByTestId('nhanes-preview')).toBeInTheDocument();
    });
    // Column headers from the CSV
    expect(screen.getByText('Variable Code')).toBeInTheDocument();
    expect(screen.getByText('Nutrient Name')).toBeInTheDocument();
    // Row values — DR1TFIBE appears in both the preview table and slider mapping panel
    // so use getAllByText and ensure at least one exists
    const fiberElements = screen.getAllByText('DR1TFIBE');
    expect(fiberElements.length).toBeGreaterThan(0);
    const dietaryFiberElements = screen.getAllByText('Dietary fiber');
    expect(dietaryFiberElements.length).toBeGreaterThan(0);
  });
});
