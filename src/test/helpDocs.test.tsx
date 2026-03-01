/**
 * TST-007 — HelpDocs offline smoke test
 * Mocks fetch() to provide a fake docs_index and various document types,
 * then asserts that JSON, CSV, Markdown, and TXT render paths all work.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HelpDocs from '@/pages/HelpDocs';

// Use items all in one category so they all appear in the same tab panel
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

const FAKE_CSV = `name,score\nAlice,95\n"Bob, Jr.",87\nCarol,100`;
const FAKE_MD = `# Hello\n\nThis is **markdown** content.`;
const FAKE_TXT = `Line one\nLine two`;

function makeFetch(extraResponses: Record<string, unknown> = {}) {
  const responses: Record<string, unknown> = {
    '/foundation_pack/docs_index.json': FAKE_INDEX,
    '/test/doc.json': FAKE_JSON,
    '/test/rich.json': FAKE_RICH_JSON,
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

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('HelpDocs (TST-007)', () => {
  it('loads and displays the document list from docs_index', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    render(<HelpDocs />);
    // All items are in Foundation category — the first (default) tab
    await waitFor(() => {
      expect(screen.getByText('JSON Doc')).toBeInTheDocument();
    });
    expect(screen.getByText('CSV Doc')).toBeInTheDocument();
    expect(screen.getByText('Markdown Doc')).toBeInTheDocument();
    expect(screen.getByText('Text Doc')).toBeInTheDocument();
  });

  it('renders JSON document as pretty-printed raw JSON when Raw JSON toggle is clicked', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    render(<HelpDocs />);
    await waitFor(() => screen.getByText('JSON Doc'));
    fireEvent.click(screen.getByText('JSON Doc'));
    // Default is Human View — switch to Raw JSON to see pretty-printed text
    await waitFor(() => screen.getByTestId('toggle-raw-json'));
    fireEvent.click(screen.getByTestId('toggle-raw-json'));
    await waitFor(() => {
      expect(screen.getByTestId('raw-json')).toBeInTheDocument();
      expect(screen.getByText(/"hello":/)).toBeInTheDocument();
    });
  });

  it('renders CSV document as a table with RFC-4180 parsing (quoted commas)', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    render(<HelpDocs />);
    await waitFor(() => screen.getByText('CSV Doc'));
    fireEvent.click(screen.getByText('CSV Doc'));
    await waitFor(() => {
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      // The quoted "Bob, Jr." cell should appear correctly (not split at comma)
      expect(screen.getByText('Bob, Jr.')).toBeInTheDocument();
    });
  });

  it('renders Markdown document via react-markdown', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    render(<HelpDocs />);
    await waitFor(() => screen.getByText('Markdown Doc'));
    fireEvent.click(screen.getByText('Markdown Doc'));
    await waitFor(() => {
      // react-markdown should render the H1 as an actual heading (there may be multiple h1s)
      const headings = screen.getAllByRole('heading', { level: 1 });
      expect(headings.some(h => h.textContent === 'Hello')).toBe(true);
    });
  });

  it('renders plain text document in a pre block', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    render(<HelpDocs />);
    await waitFor(() => screen.getByText('Text Doc'));
    fireEvent.click(screen.getByText('Text Doc'));
    await waitFor(() => {
      expect(screen.getByText(/Line one/)).toBeInTheDocument();
    });
  });

  it('filters documents by search query', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    render(<HelpDocs />);
    await waitFor(() => screen.getByText('JSON Doc'));
    const searchInput = screen.getByPlaceholderText('Search documents…');
    fireEvent.change(searchInput, { target: { value: 'csv' } });
    await waitFor(() => {
      expect(screen.queryByText('JSON Doc')).not.toBeInTheDocument();
    });
    expect(screen.getByText('CSV Doc')).toBeInTheDocument();
  });

  it('shows empty state when docs_index fails to load', async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 500,
      text: async () => '',
      json: async () => { throw new Error('fail'); },
    })) as unknown as typeof fetch;
    render(<HelpDocs />);
    await waitFor(() => {
      expect(screen.getByText(/extract:bundle/)).toBeInTheDocument();
    });
  });

  it('renders JSON doc in Human View by default (shows key headings)', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    render(<HelpDocs />);
    await waitFor(() => screen.getByText('Rich JSON Doc'));
    fireEvent.click(screen.getByText('Rich JSON Doc'));
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
    });
    // Should show section headings
    expect(screen.getByText(/Title \/ Document/i)).toBeInTheDocument();
    expect(screen.getByText(/Purpose \/ Objective/i)).toBeInTheDocument();
    expect(screen.getByText(/Assumptions/i)).toBeInTheDocument();
  });

  it('Human View renders at least one list item from assumptions', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    render(<HelpDocs />);
    await waitFor(() => screen.getByText('Rich JSON Doc'));
    fireEvent.click(screen.getByText('Rich JSON Doc'));
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
    });
    expect(screen.getByText(/\[ASM-001\] App runs offline/)).toBeInTheDocument();
  });

  it('Raw JSON toggle switches to raw pre block and back', async () => {
    global.fetch = makeFetch() as unknown as typeof fetch;
    render(<HelpDocs />);
    await waitFor(() => screen.getByText('Rich JSON Doc'));
    fireEvent.click(screen.getByText('Rich JSON Doc'));
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
    });

    // Switch to raw
    fireEvent.click(screen.getByTestId('toggle-raw-json'));
    await waitFor(() => {
      expect(screen.getByTestId('raw-json')).toBeInTheDocument();
      expect(screen.queryByTestId('human-view')).not.toBeInTheDocument();
    });

    // Switch back to human
    fireEvent.click(screen.getByTestId('toggle-human-view'));
    await waitFor(() => {
      expect(screen.getByTestId('human-view')).toBeInTheDocument();
      expect(screen.queryByTestId('raw-json')).not.toBeInTheDocument();
    });
  });
});
