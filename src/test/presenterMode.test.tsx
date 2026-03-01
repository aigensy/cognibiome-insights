/**
 * Presenter Mode visual cues regression tests.
 *
 * Verifies that when presenterMode is true:
 *   - PilotResults renders "Mention in speech" on Overall Score and Language Test rows
 *   - Simulator shows the run-hash presenter cue element after a run
 *   - Methods highlights the disclaimers card
 *   - Sidebar includes Methods and Export in presenter mode
 * Also verifies:
 *   - HelpDocs markdown renderer replaces <a> links with non-clickable plain text
 *
 * Keeps tests minimal: query by testid / text, avoid inspecting styles.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { SimulationResult, DietInputs } from '@/lib/simulator';
import type { PilotDataset } from '@/lib/pilotParser';

// Stub ResizeObserver — required by Recharts ResponsiveContainer and Radix UI Slider
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// ---------------------------------------------------------------------------
// Minimal pilot dataset fixture (5 rows, all fields numeric)
// ---------------------------------------------------------------------------
const PILOT_RECORDS = Array.from({ length: 5 }, (_, i) => ({
  diet_score: 10 + i * 2,
  stroop_test: 15 + i,
  language_test: 12 + i,
  memory_test: 8 + i,
  logical_test: 10 + i,
  overall_score: 50 + i * 3,
}));

const PILOT_DATASET: PilotDataset = {
  records: PILOT_RECORDS,
  rowCount: PILOT_RECORDS.length,
  source: 'bundled',
  loadedAt: new Date().toISOString(),
  sha256: 'a'.repeat(64),
  integrityPassed: true,
  datasetInvalid: false,
  mappingRequired: false,
  dietScoreCandidates: [],
  integrityErrors: [],
  warnings: [],
};

const SIMULATION_RESULT: SimulationResult = {
  runHash: 'c'.repeat(64),
  timestamp: '2026-03-01T10:00:00.000Z',
  inputs: { fiber_proxy: 30, added_sugar_proxy: 20, sat_fat_proxy: 12, omega3_proxy: 3 } as DietInputs,
  dietScoreProxy: 18,
  microbiome: { bifidobacterium: 0.5, lactobacillus: 0.35, fb_ratio: 1.1 },
  metabolites: { acetate: 0.65, propionate: 0.45, butyrate: 0.40, five_htp_index: 0.60 },
  cognition: { stroop_test: 18.0, language_test: 15.0, memory_test: 9.0, logical_test: 13.0, overall_score: 55.0 },
  modelVersions: { stage1: 'stage1-v1@1.0.0', stage2: 'stage2-v1@1.0.0', stage3: 'stage3-v1@1.0.0' },
  notes: '',
};

// ---------------------------------------------------------------------------
// Context value builders
// ---------------------------------------------------------------------------

function makeContextValue(overrides: Partial<{
  presenterMode: boolean;
  pilotDataset: PilotDataset | null;
  lastRun: SimulationResult | null;
  simulatorInputs: DietInputs;
}> = {}) {
  return {
    presenterMode: false,
    setPresenterMode: vi.fn(),
    adminMode: false,
    pilotDataset: null,
    setPilotDataset: vi.fn(),
    lastRun: null,
    setLastRun: vi.fn(),
    simulatorInputs: { fiber_proxy: 25, added_sugar_proxy: 30, sat_fat_proxy: 15, omega3_proxy: 2 } as DietInputs,
    setSimulatorInputs: vi.fn(),
    resetDemoState: vi.fn(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Mock strategy: vi.mock the entire AppContext module so useAppState returns
// whatever we tell it to. This is the standard approach when a component calls
// useAppState() internally.
// ---------------------------------------------------------------------------

vi.mock('@/contexts/AppContext', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/contexts/AppContext')>();
  return {
    ...original,
    useAppState: vi.fn(() => makeContextValue()),
  };
});

// We also need to mock the pilot loader so PilotResults doesn't actually fetch.
vi.mock('@/lib/pilotParser', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/pilotParser')>();
  return {
    ...original,
    loadBundledPilot: vi.fn(async () => PILOT_DATASET),
    loadPilotWithSha256: vi.fn(async () => PILOT_DATASET),
  };
});

// Mock the simulator so Simulator.tsx doesn't try to do real computation.
vi.mock('@/lib/simulator', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/simulator')>();
  return {
    ...original,
    runSimulation: vi.fn(async () => SIMULATION_RESULT),
    saveRun: vi.fn(),
    clearRuns: vi.fn(),
    getRuns: vi.fn(() => []),
  };
});

// ---------------------------------------------------------------------------
// Helpers to set the mock return value for useAppState.
// ---------------------------------------------------------------------------

async function getUseAppState() {
  const mod = await import('@/contexts/AppContext');
  return mod.useAppState as ReturnType<typeof vi.fn>;
}

// ---------------------------------------------------------------------------
// Test suites
// ---------------------------------------------------------------------------

describe('PilotResults — presenter mode row highlights', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "Mention in speech" badge on Overall Score row when presenterMode=true', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeContextValue({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: PilotResults } = await import('@/pages/PilotResults');
    render(
      <MemoryRouter>
        <PilotResults />
      </MemoryRouter>
    );

    await waitFor(() => {
      // "Mention in speech" badge must appear (at least one row — Overall Score)
      const badges = screen.getAllByTestId('mention-in-speech-badge');
      expect(badges.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows "Mention in speech" on Overall Score, Language Test, and Logical Reasoning rows', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeContextValue({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: PilotResults } = await import('@/pages/PilotResults');
    render(
      <MemoryRouter>
        <PilotResults />
      </MemoryRouter>
    );

    await waitFor(() => {
      const badges = screen.getAllByTestId('mention-in-speech-badge');
      // overall_score, language_test, and logical_test rows should all be highlighted (>= 3 badges)
      expect(badges.length).toBeGreaterThanOrEqual(3);
    });

    // The badge text should match
    const allBadgeTexts = screen.getAllByTestId('mention-in-speech-badge').map(el => el.textContent);
    expect(allBadgeTexts.every(t => t === 'Mention in speech')).toBe(true);
  });

  it('does NOT show "Mention in speech" badges when presenterMode=false', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeContextValue({ presenterMode: false, pilotDataset: PILOT_DATASET }));

    const { default: PilotResults } = await import('@/pages/PilotResults');
    render(
      <MemoryRouter>
        <PilotResults />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Correlation table should be present
      expect(screen.getByText('Correlations (Diet Score vs Cognitive Metrics)')).toBeInTheDocument();
    });

    expect(screen.queryAllByTestId('mention-in-speech-badge')).toHaveLength(0);
  });
});

describe('Simulator — run hash presenter cue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Stub toast
    vi.stubGlobal('fetch', vi.fn());
  });

  it('shows run-hash-presenter-cue element after a run when presenterMode=true', async () => {
    const useAppState = await getUseAppState();
    // Use a ref to capture setLastRun so we can control result display
    const mockSetLastRun = vi.fn();
    const mockSetSimulatorInputs = vi.fn();
    useAppState.mockReturnValue(makeContextValue({
      presenterMode: true,
      simulatorInputs: { fiber_proxy: 30, added_sugar_proxy: 20, sat_fat_proxy: 12, omega3_proxy: 3 },
      lastRun: null,
    }));

    const { default: Simulator } = await import('@/pages/Simulator');
    render(
      <MemoryRouter>
        <Simulator />
      </MemoryRouter>
    );

    // Click Run Simulation
    const runBtn = screen.getByRole('button', { name: /Run Simulation/i });
    fireEvent.click(runBtn);

    // After the async run, the result card with Run Hash should appear
    await waitFor(() => {
      expect(screen.getByTestId('run-hash-presenter-cue')).toBeInTheDocument();
    });
  });

  it('does NOT show run-hash-presenter-cue when presenterMode=false', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeContextValue({
      presenterMode: false,
      simulatorInputs: { fiber_proxy: 30, added_sugar_proxy: 20, sat_fat_proxy: 12, omega3_proxy: 3 },
    }));

    const { default: Simulator } = await import('@/pages/Simulator');
    render(
      <MemoryRouter>
        <Simulator />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Run Simulation/i }));

    await waitFor(() => {
      // Run hash text should exist (it always shows after a run)
      expect(screen.getByText(/Run Hash/i)).toBeInTheDocument();
    });

    expect(screen.queryByTestId('run-hash-presenter-cue')).not.toBeInTheDocument();
  });
});

describe('Methods — disclaimers section highlight', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // MiMeDB fetch — return error so the section degrades gracefully in tests
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false,
      status: 404,
      text: async () => '',
      json: async () => { throw new Error('not found'); },
    })));
  });

  it('renders the disclaimers card with data-testid when presenterMode=true', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeContextValue({ presenterMode: true }));

    const { default: Methods } = await import('@/pages/Methods');
    render(
      <MemoryRouter>
        <Methods />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('disclaimers-card')).toBeInTheDocument();
    });

    // "Presenter cue" badge should appear in presenter mode
    expect(screen.getByText('Presenter cue')).toBeInTheDocument();
  });

  it('renders the disclaimers card without "Presenter cue" when presenterMode=false', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeContextValue({ presenterMode: false }));

    const { default: Methods } = await import('@/pages/Methods');
    render(
      <MemoryRouter>
        <Methods />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('disclaimers-card')).toBeInTheDocument();
    });

    expect(screen.queryByText('Presenter cue')).not.toBeInTheDocument();
  });

  it('data sources table shows "Current v0.1: frozen demo coefficients" wording', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeContextValue({ presenterMode: false }));

    const { default: Methods } = await import('@/pages/Methods');
    render(
      <MemoryRouter>
        <Methods />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Data Sources (Paired vs Unpaired)')).toBeInTheDocument();
    });

    // Should include the "frozen demo coefficients" language across multiple rows
    const frozenCells = screen.getAllByText(/frozen demo coefficients/i);
    expect(frozenCells.length).toBeGreaterThan(0);
    // Should NOT claim NHANES is a training source
    expect(screen.queryByText(/NHANES \(training\)/i)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// AppSidebar — presenter mode navigation
// ---------------------------------------------------------------------------

// AppSidebar needs SidebarProvider, router, and AppContext.
// Import SidebarProvider to wrap the component properly.

describe('AppSidebar — presenter mode nav items', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // fetch for docs_index.json — return empty items so sidebar still renders nav
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ items: [] }),
      text: async () => '{"items":[]}',
    })));
  });

  async function renderSidebar(presenterMode: boolean) {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeContextValue({ presenterMode }));
    const { AppSidebar } = await import('@/components/AppSidebar');
    const { SidebarProvider } = await import('@/components/ui/sidebar');
    render(
      <MemoryRouter initialEntries={['/']}>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </MemoryRouter>
    );
  }

  it('shows Methods & Rigor in presenter mode sidebar', async () => {
    await renderSidebar(true);
    await waitFor(() => {
      expect(screen.getByText('Methods & Rigor')).toBeInTheDocument();
    });
  });

  it('shows Export Report in presenter mode sidebar', async () => {
    await renderSidebar(true);
    await waitFor(() => {
      expect(screen.getByText('Export Report')).toBeInTheDocument();
    });
  });

  it('shows Public Datasets when presenterMode is false', async () => {
    await renderSidebar(false);
    await waitFor(() => {
      expect(screen.getByText('Public Datasets')).toBeInTheDocument();
    });
  });

  it('hides Public Datasets in presenter mode', async () => {
    await renderSidebar(true);
    await waitFor(() => {
      expect(screen.getByText('Pilot Results')).toBeInTheDocument();
    });
    expect(screen.queryByText('Public Datasets')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// HelpDocs — external link safety
// ---------------------------------------------------------------------------

const FAKE_INDEX_FOR_LINK_TEST = {
  items: [
    {
      id: 'LINK001',
      title: 'Link Test Doc',
      path: '/test/linkdoc.md',
      category: 'Foundation',
      media_type: 'text/markdown',
      description: 'A markdown doc with external links',
    },
  ],
};

const MARKDOWN_WITH_LINKS = `
# Test Document

Here is a reference link: [MiMeDB](https://mimedb.org/)

And a bare URL reference: see https://example.com for details.

And [NHANES data](https://wwwn.cdc.gov/nchs/) for nutrient reference.
`;

describe('HelpDocs — external links rendered as safe (non-navigable) text', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url === '/foundation_pack/docs_index.json') {
        return { ok: true, status: 200, json: async () => FAKE_INDEX_FOR_LINK_TEST, text: async () => JSON.stringify(FAKE_INDEX_FOR_LINK_TEST) };
      }
      if (url === '/test/linkdoc.md') {
        return { ok: true, status: 200, text: async () => MARKDOWN_WITH_LINKS, json: async () => ({}) };
      }
      return { ok: false, status: 404, text: async () => '', json: async () => ({}) };
    }));
  });

  it('renders markdown with links without any <a> href that would navigate', async () => {
    const { default: HelpDocs } = await import('@/pages/HelpDocs');
    render(
      <MemoryRouter initialEntries={['/help?doc=LINK001']}>
        <HelpDocs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('markdown-view')).toBeInTheDocument();
    });

    // The link text should be visible as text
    expect(screen.getByText('MiMeDB')).toBeInTheDocument();

    // No <a> element with an href should exist inside the markdown view
    const markdownView = screen.getByTestId('markdown-view');
    const anchors = markdownView.querySelectorAll('a[href]');
    expect(anchors).toHaveLength(0);
  });

  it('renders safe-link spans with data-href attribute instead of live anchors', async () => {
    const { default: HelpDocs } = await import('@/pages/HelpDocs');
    render(
      <MemoryRouter initialEntries={['/help?doc=LINK001']}>
        <HelpDocs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('markdown-view')).toBeInTheDocument();
    });

    // safe-link spans should carry the URL as a data attribute
    const safeLinks = screen.getAllByTestId('safe-link');
    expect(safeLinks.length).toBeGreaterThan(0);

    const hrefs = safeLinks.map(el => el.getAttribute('data-href'));
    expect(hrefs.some(h => h?.includes('mimedb.org'))).toBe(true);
  });
});
