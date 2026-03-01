/**
 * Compare.tsx smoke test — renders with two mocked runs in localStorage.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Compare from '@/pages/Compare';
import type { SimulationResult } from '@/lib/simulator';

const RUN_A: SimulationResult = {
  runHash: 'aaa111aaa111aaa111aaa111aaa111aaa111aaa111aaa111aaa111aaa111aaaa',
  timestamp: '2026-02-28T10:00:00.000Z',
  inputs: { fiber_proxy: 25, added_sugar_proxy: 30, sat_fat_proxy: 15, omega3_proxy: 2 },
  dietScoreProxy: 14.5,
  microbiome: { bifidobacterium: 0.45, lactobacillus: 0.32, fb_ratio: 1.2 },
  metabolites: { acetate: 0.6, propionate: 0.4, butyrate: 0.35, five_htp_index: 0.55 },
  cognition: { stroop_test: 17.5, language_test: 14.0, memory_test: 8.0, logical_test: 12.0, overall_score: 51.5 },
  modelVersions: { stage1: 'stage1-v1@1.0.0', stage2: 'stage2-v1@1.0.0', stage3: 'stage3-v1@1.0.0' },
  notes: '',
};

const RUN_B: SimulationResult = {
  runHash: 'bbb222bbb222bbb222bbb222bbb222bbb222bbb222bbb222bbb222bbb222bbbb',
  timestamp: '2026-02-28T11:00:00.000Z',
  inputs: { fiber_proxy: 35, added_sugar_proxy: 15, sat_fat_proxy: 10, omega3_proxy: 4 },
  dietScoreProxy: 21.0,
  microbiome: { bifidobacterium: 0.58, lactobacillus: 0.41, fb_ratio: 0.9 },
  metabolites: { acetate: 0.75, propionate: 0.52, butyrate: 0.48, five_htp_index: 0.68 },
  cognition: { stroop_test: 19.2, language_test: 16.5, memory_test: 10.0, logical_test: 14.0, overall_score: 59.7 },
  modelVersions: { stage1: 'stage1-v1@1.0.0', stage2: 'stage2-v1@1.0.0', stage3: 'stage3-v1@1.0.0' },
  notes: '',
};

beforeEach(() => {
  localStorage.setItem('cognibiome_runs', JSON.stringify([RUN_A, RUN_B]));
});

afterEach(() => {
  localStorage.clear();
});

describe('Compare page (smoke test)', () => {
  it('renders without crashing', () => {
    render(<Compare />);
    expect(screen.getByText('Compare Scenarios')).toBeInTheDocument();
  });

  it('shows run selection controls', () => {
    render(<Compare />);
    // There are multiple "Run A"/"Run B" elements (labels + select options) — use getAllByText
    expect(screen.getAllByText('Run A').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Run B').length).toBeGreaterThan(0);
  });

  it('shows the Swap A/B button', () => {
    render(<Compare />);
    expect(screen.getByText('Swap A/B')).toBeInTheDocument();
  });

  it('renders comparison tables when two different runs are selected', () => {
    render(<Compare />);
    expect(screen.getByText('Diet Inputs + Diet Score Proxy')).toBeInTheDocument();
    expect(screen.getByText('Microbiome Outputs (Modeled Proxy)')).toBeInTheDocument();
    expect(screen.getByText('Metabolite Outputs (Modeled Proxy)')).toBeInTheDocument();
    expect(screen.getByText('Cognition Outputs (Modeled Proxy)')).toBeInTheDocument();
  });

  it('shows empty state when no runs exist', () => {
    localStorage.clear();
    render(<Compare />);
    expect(screen.getByText(/No simulation runs found/)).toBeInTheDocument();
  });

  it('renders delta values', () => {
    render(<Compare />);
    // Diet score delta: 21.0 - 14.5 = +6.5
    expect(screen.getByText('+6.500')).toBeInTheDocument();
  });
});
