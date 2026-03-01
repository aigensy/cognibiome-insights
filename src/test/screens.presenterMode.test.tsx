/**
 * Screen-contract tests — Presenter Mode (headless / CI verifiable)
 *
 * For every judge-facing route we render the page in MemoryRouter with
 * presenterMode = true (via vi.mock of AppContext) and assert that the
 * key judge-critical strings are present in the rendered output.
 *
 * Design principles:
 *  - Uses `toContain` / substring matching so cosmetic layout changes
 *    don't break the suite.
 *  - Each route section is an independent describe block.
 *  - No snapshot files — avoids fragile large-DOM diffs.
 *  - External fetches are stubbed; no real network calls.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { SimulationResult, DietInputs } from '@/lib/simulator';
import type { PilotDataset } from '@/lib/pilotParser';

// ---------------------------------------------------------------------------
// Browser API stubs (required by Recharts, Radix UI, etc.)
// ---------------------------------------------------------------------------

if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// ---------------------------------------------------------------------------
// Fixtures
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

// Two saved runs for Compare / Export tests
const RUN_A: SimulationResult = {
  runHash: 'a'.repeat(64),
  timestamp: '2026-03-01T08:00:00.000Z',
  inputs: { fiber_proxy: 25, added_sugar_proxy: 30, sat_fat_proxy: 15, omega3_proxy: 2 } as DietInputs,
  dietScoreProxy: 14,
  microbiome: { bifidobacterium: 0.45, lactobacillus: 0.30, fb_ratio: 1.2 },
  metabolites: { acetate: 0.60, propionate: 0.40, butyrate: 0.35, five_htp_index: 0.55 },
  cognition: { stroop_test: 17.0, language_test: 14.0, memory_test: 8.0, logical_test: 12.0, overall_score: 51.0 },
  modelVersions: { stage1: 'stage1-v1@1.0.0', stage2: 'stage2-v1@1.0.0', stage3: 'stage3-v1@1.0.0' },
  notes: '',
};

const RUN_B: SimulationResult = {
  runHash: 'b'.repeat(64),
  timestamp: '2026-03-01T09:00:00.000Z',
  inputs: { fiber_proxy: 35, added_sugar_proxy: 15, sat_fat_proxy: 10, omega3_proxy: 4 } as DietInputs,
  dietScoreProxy: 21,
  microbiome: { bifidobacterium: 0.58, lactobacillus: 0.41, fb_ratio: 0.9 },
  metabolites: { acetate: 0.75, propionate: 0.52, butyrate: 0.48, five_htp_index: 0.68 },
  cognition: { stroop_test: 19.0, language_test: 16.5, memory_test: 10.0, logical_test: 14.0, overall_score: 59.5 },
  modelVersions: { stage1: 'stage1-v1@1.0.0', stage2: 'stage2-v1@1.0.0', stage3: 'stage3-v1@1.0.0' },
  notes: '',
};

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('@/contexts/AppContext', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/contexts/AppContext')>();
  return {
    ...original,
    useAppState: vi.fn(() => makeCtx()),
  };
});

vi.mock('@/lib/pilotParser', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/pilotParser')>();
  return {
    ...original,
    loadBundledPilot: vi.fn(async () => PILOT_DATASET),
    loadPilotWithSha256: vi.fn(async () => PILOT_DATASET),
  };
});

vi.mock('@/lib/simulator', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/simulator')>();
  return {
    ...original,
    runSimulation: vi.fn(async () => SIMULATION_RESULT),
    saveRun: vi.fn(),
    clearRuns: vi.fn(),
    getSavedRuns: vi.fn(() => [RUN_A, RUN_B]),
    getRuns: vi.fn(() => [RUN_A, RUN_B]),
  };
});

// ---------------------------------------------------------------------------
// Context helpers
// ---------------------------------------------------------------------------

function makeCtx(overrides: Partial<{
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

async function getUseAppState() {
  const mod = await import('@/contexts/AppContext');
  return mod.useAppState as ReturnType<typeof vi.fn>;
}

// ---------------------------------------------------------------------------
// Fake fetch factory used by multiple suites
// ---------------------------------------------------------------------------

function stubFetch(handlers: Record<string, () => unknown>) {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    for (const [pattern, handler] of Object.entries(handlers)) {
      if (url.includes(pattern)) {
        const data = handler();
        return {
          ok: true,
          status: 200,
          json: async () => data,
          text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
          headers: { get: () => null },
        };
      }
    }
    return {
      ok: false,
      status: 404,
      json: async () => ({}),
      text: async () => '',
      headers: { get: () => null },
    };
  }));
}

// ---------------------------------------------------------------------------
// ROUTE: / (Dashboard)
// ---------------------------------------------------------------------------

describe('Dashboard (/) — presenter mode screen contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stubFetch({});
  });

  it('shows "Demo Sequence — Judge Path" card when presenterMode=true', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: Dashboard } = await import('@/pages/Dashboard');
    render(<MemoryRouter><Dashboard /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/Demo Sequence — Judge Path/)).toBeInTheDocument();
    });
  });

  it('shows judge path ordered list items', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: Dashboard } = await import('@/pages/Dashboard');
    render(<MemoryRouter><Dashboard /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/Pilot Results — real n=66 data/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Simulator — deterministic/i)).toBeInTheDocument();
    expect(screen.getByText(/Methods.*Rigor — disclaimers/i)).toBeInTheDocument();
    expect(screen.getByText(/Export Report — auditable/i)).toBeInTheDocument();
  });

  it('shows the non-diagnostic disclaimer text (always visible)', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: Dashboard } = await import('@/pages/Dashboard');
    render(<MemoryRouter><Dashboard /></MemoryRouter>);

    await waitFor(() => {
      // DISCLAIMERS.nonDiagnostic: "Educational research prototype. NOT medical advice..."
      expect(screen.getByText(/NOT medical advice/i)).toBeInTheDocument();
    });
  });

  it('does NOT show "Demo Sequence" card when presenterMode=false', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: false, pilotDataset: PILOT_DATASET }));

    const { default: Dashboard } = await import('@/pages/Dashboard');
    render(<MemoryRouter><Dashboard /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('CogniBiome Dashboard')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Demo Sequence — Judge Path/)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ROUTE: /pilot (PilotResults)
// ---------------------------------------------------------------------------

describe('PilotResults (/pilot) — presenter mode screen contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stubFetch({});
  });

  it('shows "REAL DATA" badge when presenterMode=true', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: PilotResults } = await import('@/pages/PilotResults');
    render(<MemoryRouter><PilotResults /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/REAL DATA/i)).toBeInTheDocument();
    });
  });

  it('shows "p-value (approx)" in correlations table header', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: PilotResults } = await import('@/pages/PilotResults');
    render(<MemoryRouter><PilotResults /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/p-value \(approx\)/i)).toBeInTheDocument();
    });
  });

  it('shows "Pearson r" column header in correlations table', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: PilotResults } = await import('@/pages/PilotResults');
    render(<MemoryRouter><PilotResults /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/Pearson r/i)).toBeInTheDocument();
    });
  });

  it('shows presenter highlight badges for key fields', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: PilotResults } = await import('@/pages/PilotResults');
    render(<MemoryRouter><PilotResults /></MemoryRouter>);

    await waitFor(() => {
      const badges = screen.getAllByTestId('mention-in-speech-badge');
      expect(badges.length).toBeGreaterThanOrEqual(1);
    });
  });
});

// ---------------------------------------------------------------------------
// ROUTE: /simulator (Simulator)
// ---------------------------------------------------------------------------

describe('Simulator (/simulator) — presenter mode screen contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stubFetch({ nhanes: () => '' }); // NHANES CSV returns empty
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows "MODELED PROXY" badge after running simulation', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({
      presenterMode: true,
      simulatorInputs: { fiber_proxy: 30, added_sugar_proxy: 20, sat_fat_proxy: 12, omega3_proxy: 3 },
    }));

    const { default: Simulator } = await import('@/pages/Simulator');
    render(<MemoryRouter><Simulator /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: /Run Simulation/i }));

    await waitFor(() => {
      const badges = screen.getAllByText(/MODELED PROXY/i);
      expect(badges.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows "Run Hash" provenance block after running simulation', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({
      presenterMode: true,
      simulatorInputs: { fiber_proxy: 30, added_sugar_proxy: 20, sat_fat_proxy: 12, omega3_proxy: 3 },
    }));

    const { default: Simulator } = await import('@/pages/Simulator');
    render(<MemoryRouter><Simulator /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: /Run Simulation/i }));

    await waitFor(() => {
      expect(screen.getByText(/Run Hash/i)).toBeInTheDocument();
    });
  });

  it('shows the run-hash-presenter-cue element when presenterMode=true', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({
      presenterMode: true,
      simulatorInputs: { fiber_proxy: 30, added_sugar_proxy: 20, sat_fat_proxy: 12, omega3_proxy: 3 },
    }));

    const { default: Simulator } = await import('@/pages/Simulator');
    render(<MemoryRouter><Simulator /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: /Run Simulation/i }));

    await waitFor(() => {
      expect(screen.getByTestId('run-hash-presenter-cue')).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// ROUTE: /methods (Methods)
// ---------------------------------------------------------------------------

describe('Methods (/methods) — presenter mode screen contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // MiMeDB fetch fails gracefully — section shows error message
    stubFetch({});
  });

  it('shows "Paired =" wording in data sources table header', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true }));

    const { default: Methods } = await import('@/pages/Methods');
    render(<MemoryRouter><Methods /></MemoryRouter>);

    await waitFor(() => {
      // Multiple "Paired" occurrences are expected (header subtitle + table rows)
      const matches = screen.getAllByText(/Paired/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows "UNPAIRED" in data sources description', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true }));

    const { default: Methods } = await import('@/pages/Methods');
    render(<MemoryRouter><Methods /></MemoryRouter>);

    await waitFor(() => {
      // "UNPAIRED" appears in the card subtitle text and in table rows
      const matches = screen.getAllByText(/UNPAIRED/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows "License not confirmed" badge on MiMeDB Evidence card', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: false }));

    const { default: Methods } = await import('@/pages/Methods');
    render(<MemoryRouter><Methods /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/License not confirmed/i)).toBeInTheDocument();
    });
  });

  it('shows "Relations count (export)" column header in MiMeDB metabolites table when data loads', async () => {
    // Provide a minimal mimedb.json so the metabolites tab renders
    const mimedbData = {
      metadata: {
        source: 'MiMeDB',
        build_timestamp: '2026-03-01T00:00:00Z',
        row_count_metabolites: 2,
        row_count_microbes: 2,
        matched_metabolites: 2,
        matched_microbes: 2,
        limitations: ['test limitation'],
        license: 'CC-BY-4.0 (not confirmed)',
      },
      metabolites: [
        { id: '1', mime_id: 'MIME001', name: 'Butyrate', hmdb_id: null, cas: null, formula: 'C4H8O2', average_mass: 88.1, microbe_relation_count: 3, app_role: 'scfa' },
        { id: '2', mime_id: 'MIME002', name: 'Acetate', hmdb_id: null, cas: null, formula: 'C2H4O2', average_mass: 60.1, microbe_relation_count: 2, app_role: 'scfa' },
      ],
      microbes: [],
      microbe_metabolite_links: [],
    };

    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.includes('mimedb.json')) {
        return { ok: true, status: 200, json: async () => mimedbData, text: async () => JSON.stringify(mimedbData), headers: { get: () => null } };
      }
      return { ok: false, status: 404, json: async () => ({}), text: async () => '', headers: { get: () => null } };
    }));

    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true }));

    const { default: Methods } = await import('@/pages/Methods');
    render(<MemoryRouter><Methods /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/Relations count \(export\)/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows Presenter cue badge when presenterMode=true', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true }));

    const { default: Methods } = await import('@/pages/Methods');
    render(<MemoryRouter><Methods /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('Presenter cue')).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// ROUTE: /compare (Compare)
// ---------------------------------------------------------------------------

describe('Compare (/compare) — presenter mode screen contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // getSavedRuns is mocked at top of file to return [RUN_A, RUN_B]
    localStorage.setItem('cognibiome_runs', JSON.stringify([RUN_A, RUN_B]));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders "Compare Scenarios" heading', async () => {
    const { default: Compare } = await import('@/pages/Compare');
    render(<MemoryRouter><Compare /></MemoryRouter>);
    expect(screen.getByText('Compare Scenarios')).toBeInTheDocument();
  });

  it('shows "modeled proxies" disclaimer text', async () => {
    const { default: Compare } = await import('@/pages/Compare');
    render(<MemoryRouter><Compare /></MemoryRouter>);

    await waitFor(() => {
      // Multiple occurrences expected — verify at least one is present
      const matches = screen.getAllByText(/modeled proxies/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows "not measured values" phrasing in subtitle', async () => {
    const { default: Compare } = await import('@/pages/Compare');
    render(<MemoryRouter><Compare /></MemoryRouter>);

    await waitFor(() => {
      // "All outputs are modeled proxies — not measured values."
      expect(screen.getByText(/not measured values/i)).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// ROUTE: /export (ExportReport)
// ---------------------------------------------------------------------------

describe('ExportReport (/export) — presenter mode screen contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('cognibiome_runs', JSON.stringify([RUN_A, RUN_B]));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders "Download HTML" button', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: ExportReport } = await import('@/pages/ExportReport');
    render(<MemoryRouter><ExportReport /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/Download HTML/i)).toBeInTheDocument();
    });
  });

  it('renders "Print to PDF" button', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: ExportReport } = await import('@/pages/ExportReport');
    render(<MemoryRouter><ExportReport /></MemoryRouter>);

    await waitFor(() => {
      const matches = screen.getAllByText(/Print to PDF/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows run selection control', async () => {
    const useAppState = await getUseAppState();
    useAppState.mockReturnValue(makeCtx({ presenterMode: true, pilotDataset: PILOT_DATASET }));

    const { default: ExportReport } = await import('@/pages/ExportReport');
    render(<MemoryRouter><ExportReport /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/Select Run/i)).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// ROUTE: /help?doc=DOC-026 (HelpDocs — Presenter Guide)
// ---------------------------------------------------------------------------

const PRESENTER_GUIDE_INDEX = {
  items: [
    {
      id: 'DOC-026',
      title: 'Presenter Guide (Presenter Mode)',
      path: '/docs/presenter_guide.md',
      category: 'User Docs',
      media_type: 'text/markdown',
      description: 'Presenter-mode demo script + control-by-control explanation.',
    },
  ],
};

const PRESENTER_GUIDE_CONTENT = `# CogniBiome — Presenter Guide (Presenter Mode)

## 0) One-sentence disclaimer (say this at any time if needed)

> "This version is an **educational hypothesis generator**, not a medical device."

## 1) Demo Sequence

Run through the judge path in order.
`;

describe('HelpDocs (/help?doc=DOC-026) — presenter mode screen contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.includes('docs_index.json')) {
        return { ok: true, status: 200, json: async () => PRESENTER_GUIDE_INDEX, text: async () => JSON.stringify(PRESENTER_GUIDE_INDEX), headers: { get: () => 'application/json' } };
      }
      if (url.includes('presenter_guide.md')) {
        return { ok: true, status: 200, text: async () => PRESENTER_GUIDE_CONTENT, json: async () => ({}), headers: { get: () => 'text/markdown' } };
      }
      return { ok: false, status: 404, text: async () => '', json: async () => ({}), headers: { get: () => null } };
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows "Presenter Guide (Presenter Mode)" as doc title in index', async () => {
    const { default: HelpDocs } = await import('@/pages/HelpDocs');
    render(
      <MemoryRouter initialEntries={['/help?doc=DOC-026']}>
        <HelpDocs />
      </MemoryRouter>
    );

    await waitFor(() => {
      // May appear multiple times (sidebar + heading) — check at least one
      const matches = screen.getAllByText(/Presenter Guide \(Presenter Mode\)/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders the markdown view with the one-sentence disclaimer line', async () => {
    const { default: HelpDocs } = await import('@/pages/HelpDocs');
    render(
      <MemoryRouter initialEntries={['/help?doc=DOC-026']}>
        <HelpDocs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('markdown-view')).toBeInTheDocument();
    });

    // The one-sentence disclaimer from the guide
    expect(screen.getByText(/educational hypothesis generator/i)).toBeInTheDocument();
    expect(screen.getByText(/not a medical device/i)).toBeInTheDocument();
  });

  it('renders external links as non-navigable safe-link spans (no live <a> hrefs)', async () => {
    const guideWithLinks = PRESENTER_GUIDE_CONTENT + '\n\nSee [MiMeDB](https://mimedb.org/) for reference.\n';
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.includes('docs_index.json')) {
        return { ok: true, status: 200, json: async () => PRESENTER_GUIDE_INDEX, text: async () => JSON.stringify(PRESENTER_GUIDE_INDEX), headers: { get: () => 'application/json' } };
      }
      if (url.includes('presenter_guide.md')) {
        return { ok: true, status: 200, text: async () => guideWithLinks, json: async () => ({}), headers: { get: () => 'text/markdown' } };
      }
      return { ok: false, status: 404, text: async () => '', json: async () => ({}), headers: { get: () => null } };
    }));

    const { default: HelpDocs } = await import('@/pages/HelpDocs');
    render(
      <MemoryRouter initialEntries={['/help?doc=DOC-026']}>
        <HelpDocs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('markdown-view')).toBeInTheDocument();
    });

    // Link text visible
    expect(screen.getByText('MiMeDB')).toBeInTheDocument();

    // No live anchor tags inside markdown view
    const view = screen.getByTestId('markdown-view');
    expect(view.querySelectorAll('a[href]')).toHaveLength(0);

    // Safe-link span carries the URL
    const safeLinks = screen.getAllByTestId('safe-link');
    expect(safeLinks.length).toBeGreaterThan(0);
    expect(safeLinks.some(el => el.getAttribute('data-href')?.includes('mimedb.org'))).toBe(true);
  });
});
