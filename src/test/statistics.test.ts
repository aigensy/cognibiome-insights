/**
 * TST-002 — Statistics engine unit tests
 * Uses a small deterministic fixture to verify summaryStats and correlations.
 */
import { describe, it, expect } from 'vitest';
import { computeSummaryStats, computeCorrelations, pearsonR } from '@/lib/statistics';
import type { PilotRecord } from '@/lib/pilotParser';

// Small deterministic fixture: 5 rows with known values
const FIXTURE: PilotRecord[] = [
  { diet_score: 10, stroop_test: 10, language_test: 10, memory_test: 5,  logical_test: 5,  overall_score: 30 },
  { diet_score: 15, stroop_test: 13, language_test: 12, memory_test: 7,  logical_test: 8,  overall_score: 40 },
  { diet_score: 20, stroop_test: 16, language_test: 15, memory_test: 9,  logical_test: 10, overall_score: 50 },
  { diet_score: 25, stroop_test: 19, language_test: 18, memory_test: 11, logical_test: 12, overall_score: 60 },
  { diet_score: 30, stroop_test: 22, language_test: 20, memory_test: 13, logical_test: 15, overall_score: 70 },
];

describe('pearsonR', () => {
  it('returns 1.0 for perfectly correlated data', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [2, 4, 6, 8, 10];
    expect(pearsonR(x, y)).toBeCloseTo(1.0, 5);
  });

  it('returns -1.0 for perfectly anti-correlated data', () => {
    const x = [1, 2, 3, 4, 5];
    const y = [10, 8, 6, 4, 2];
    expect(pearsonR(x, y)).toBeCloseTo(-1.0, 5);
  });

  it('returns 0 for fewer than 3 pairs', () => {
    expect(pearsonR([1, 2], [3, 4])).toBe(0);
  });
});

describe('computeSummaryStats (TST-002)', () => {
  const stats = computeSummaryStats(FIXTURE);

  it('returns stats for all 6 fields', () => {
    expect(stats).toHaveLength(6);
  });

  it('computes correct n for diet_score', () => {
    const ds = stats.find(s => s.field === 'diet_score');
    expect(ds?.n).toBe(5);
  });

  it('computes correct mean for diet_score', () => {
    // (10+15+20+25+30)/5 = 20
    const ds = stats.find(s => s.field === 'diet_score');
    expect(ds?.mean).toBeCloseTo(20, 2);
  });

  it('computes correct median for diet_score', () => {
    const ds = stats.find(s => s.field === 'diet_score');
    expect(ds?.median).toBe(20);
  });

  it('computes correct min/max for diet_score', () => {
    const ds = stats.find(s => s.field === 'diet_score');
    expect(ds?.min).toBe(10);
    expect(ds?.max).toBe(30);
  });

  it('computes correct stdDev for diet_score', () => {
    // Sample stdev of [10,15,20,25,30] = sqrt(250/4) = sqrt(62.5) ≈ 7.906
    const ds = stats.find(s => s.field === 'diet_score');
    expect(ds?.stdDev).toBeCloseTo(7.91, 1);
  });
});

describe('computeCorrelations (TST-002)', () => {
  const correlations = computeCorrelations(FIXTURE);

  it('returns correlations for 5 cognitive fields', () => {
    expect(correlations).toHaveLength(5);
  });

  it('correlation for stroop_test is high and positive', () => {
    const c = correlations.find(c => c.fieldY === 'stroop_test');
    expect(c?.pearsonR).toBeGreaterThan(0.99);
    expect(c?.n).toBe(5);
  });

  it('correlation for overall_score is high and positive', () => {
    const c = correlations.find(c => c.fieldY === 'overall_score');
    expect(c?.pearsonR).toBeGreaterThan(0.99);
  });

  it('uses paired filtering correctly (NaN rows excluded from both axes)', () => {
    // Add a row with NaN diet_score — should be excluded from pairs
    const withNaN: PilotRecord[] = [
      ...FIXTURE,
      { diet_score: NaN, stroop_test: 100, language_test: 100, memory_test: 100, logical_test: 100, overall_score: 400 },
    ];
    const corrs = computeCorrelations(withNaN);
    // n should still be 5 (not 6), since the NaN row is excluded
    const c = corrs.find(c => c.fieldY === 'stroop_test');
    expect(c?.n).toBe(5);
  });

  it('uses paired filtering correctly (NaN target rows excluded)', () => {
    // Add a row with NaN stroop_test — should be excluded from stroop correlation only
    const withNaN: PilotRecord[] = [
      ...FIXTURE,
      { diet_score: 18, stroop_test: NaN, language_test: 14, memory_test: 7, logical_test: 10, overall_score: 49 },
    ];
    const corrs = computeCorrelations(withNaN);
    const stroopCorr = corrs.find(c => c.fieldY === 'stroop_test');
    const langCorr = corrs.find(c => c.fieldY === 'language_test');
    // Stroop n=5 (NaN row excluded), language n=6 (that row is fine for language)
    expect(stroopCorr?.n).toBe(5);
    expect(langCorr?.n).toBe(6);
  });
});
