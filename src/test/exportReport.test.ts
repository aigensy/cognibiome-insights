/**
 * TST-005 — ExportReport HTML generation tests
 * Generates HTML for a mocked run and asserts presence of all required sections,
 * disclaimers, leakage block, and pilot summary when toggled ON.
 */
import { describe, it, expect } from 'vitest';
import { generateHTML } from '@/pages/ExportReport';
import type { SimulationResult } from '@/lib/simulator';
import type { PilotRecord } from '@/lib/pilotParser';

const MOCK_RUN: SimulationResult = {
  runHash: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
  timestamp: '2026-02-28T12:00:00.000Z',
  inputs: { fiber_proxy: 30, added_sugar_proxy: 20, sat_fat_proxy: 12, omega3_proxy: 3 },
  dietScoreProxy: 18.5,
  microbiome: { bifidobacterium: 0.5, lactobacillus: 0.35, fb_ratio: 1.1 },
  metabolites: { acetate: 0.65, propionate: 0.45, butyrate: 0.40, five_htp_index: 0.60 },
  cognition: { stroop_test: 18.0, language_test: 15.0, memory_test: 9.0, logical_test: 13.0, overall_score: 55.0 },
  modelVersions: { stage1: 'stage1@1.0.0', stage2: 'stage2@1.0.0', stage3: 'stage3@1.0.0' },
  notes: '',
};

const PILOT_RECORDS: PilotRecord[] = [
  { diet_score: 21, stroop_test: 17.0, language_test: 19, memory_test: 8, logical_test: 14, overall_score: 58.0 },
  { diet_score: 19, stroop_test: 18.7, language_test: 14, memory_test: 10, logical_test: 12, overall_score: 54.7 },
  { diet_score: 16, stroop_test: 20.0, language_test: 7, memory_test: 12, logical_test: 14, overall_score: 53.0 },
  { diet_score: 20, stroop_test: 19.0, language_test: 14, memory_test: 7, logical_test: 14, overall_score: 54.0 },
  { diet_score: 15, stroop_test: 16.0, language_test: 9, memory_test: 4, logical_test: 8, overall_score: 37.0 },
];

describe('generateHTML (TST-005)', () => {
  it('includes run hash in the output', () => {
    const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
    expect(html).toContain('deadbeefdeadbeef');
  });

  it('includes model versions', () => {
    const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
    expect(html).toContain('stage1@1.0.0');
    expect(html).toContain('stage2@1.0.0');
    expect(html).toContain('stage3@1.0.0');
  });

  it('includes timestamp', () => {
    const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
    expect(html).toContain('2026-02-28T12:00:00.000Z');
  });

  it('includes diet inputs', () => {
    const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
    expect(html).toContain('Diet Inputs');
    expect(html).toContain('30 g/day'); // fiber
  });

  it('includes microbiome outputs section', () => {
    const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
    expect(html).toContain('Microbiome');
    expect(html).toContain('Bifidobacterium');
  });

  it('includes metabolite outputs section', () => {
    const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
    expect(html).toContain('Metabolites');
    expect(html).toContain('Butyrate');
  });

  it('includes cognition outputs section', () => {
    const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
    expect(html).toContain('Cognition');
    expect(html).toContain('Stroop');
    expect(html).toContain('55.00'); // overall_score
  });

  describe('Disclaimers', () => {
    it('includes non-causal disclaimer', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
      expect(html.toLowerCase()).toContain('causal');
    });

    it('includes non-diagnostic disclaimer', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
      expect(html.toLowerCase()).toContain('diagnostic');
    });

    it('includes modeled proxy disclaimer', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
      expect(html.toLowerCase()).toContain('proxy');
    });

    it('includes pilot validation disclaimer', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
      expect(html.toLowerCase()).toContain('pilot');
    });
  });

  describe('Pilot Summary section (ON)', () => {
    it('includes Pilot Dataset Summary heading', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: true, includeLeakageChecklist: false, pilotRecords: PILOT_RECORDS });
      expect(html).toContain('Pilot Dataset Summary');
    });

    it('includes summary statistics table', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: true, includeLeakageChecklist: false, pilotRecords: PILOT_RECORDS });
      expect(html).toContain('Summary Statistics');
      expect(html).toContain('Diet Score');
      expect(html).toContain('Stroop Test');
    });

    it('includes correlations table', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: true, includeLeakageChecklist: false, pilotRecords: PILOT_RECORDS });
      expect(html).toContain('Correlations');
      expect(html).toContain('Pearson r');
    });

    it('shows "cannot confirm" when pilot records are empty', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: true, includeLeakageChecklist: false, pilotRecords: [] });
      expect(html).toContain('Cannot confirm');
    });
  });

  describe('Pilot Summary section (OFF)', () => {
    it('does not include Pilot Dataset Summary when OFF', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: PILOT_RECORDS });
      expect(html).not.toContain('Pilot Dataset Summary');
    });
  });

  describe('Leakage Checklist section (ON)', () => {
    it('includes Leakage Guardrails Checklist heading', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: true, pilotRecords: [] });
      expect(html).toContain('Leakage Guardrails Checklist');
    });

    it('includes individual checklist items', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: true, pilotRecords: [] });
      expect(html).toContain('Pilot dataset is benchmark-only');
      expect(html).toContain('Demo coefficients are placeholders');
    });
  });

  describe('Leakage Checklist section (OFF)', () => {
    it('does not include leakage section when OFF', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: false, includeLeakageChecklist: false, pilotRecords: [] });
      expect(html).not.toContain('Leakage Guardrails Checklist');
    });
  });

  describe('Both sections ON', () => {
    it('includes both pilot summary and leakage checklist', () => {
      const html = generateHTML(MOCK_RUN, { includePilotSummary: true, includeLeakageChecklist: true, pilotRecords: PILOT_RECORDS });
      expect(html).toContain('Pilot Dataset Summary');
      expect(html).toContain('Leakage Guardrails Checklist');
    });
  });
});
