// Statistics engine — Pearson r and summary statistics

import type { PilotRecord } from './pilotParser';

export interface SummaryStats {
  field: string;
  label: string;
  n: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
}

export interface CorrelationResult {
  fieldX: string;
  fieldY: string;
  labelY: string;
  pearsonR: number;
  pValue: number | null; // approximate, labeled as such in UI
  n: number;
}

function getValidValues(records: PilotRecord[], field: keyof PilotRecord): number[] {
  return records.map(r => r[field]).filter(v => !isNaN(v));
}

function mean(vals: number[]): number {
  if (vals.length === 0) return 0;
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

function median(vals: number[]): number {
  if (vals.length === 0) return 0;
  const sorted = [...vals].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function stdDev(vals: number[], m: number): number {
  if (vals.length < 2) return 0;
  const variance = vals.reduce((s, v) => s + (v - m) ** 2, 0) / (vals.length - 1);
  return Math.sqrt(variance);
}

export function computeSummaryStats(records: PilotRecord[]): SummaryStats[] {
  const fields: { field: keyof PilotRecord; label: string }[] = [
    { field: 'diet_score', label: 'Diet Score' },
    { field: 'stroop_test', label: 'Stroop Test' },
    { field: 'language_test', label: 'Language Test' },
    { field: 'memory_test', label: 'Memory Test' },
    { field: 'logical_test', label: 'Logical Test' },
    { field: 'overall_score', label: 'Overall Score' },
  ];

  return fields.map(({ field, label }) => {
    const vals = getValidValues(records, field);
    const m = mean(vals);
    return {
      field,
      label,
      n: vals.length,
      mean: Math.round(m * 100) / 100,
      median: Math.round(median(vals) * 100) / 100,
      min: vals.length > 0 ? Math.min(...vals) : 0,
      max: vals.length > 0 ? Math.max(...vals) : 0,
      stdDev: Math.round(stdDev(vals, m) * 100) / 100,
    };
  });
}

export function pearsonR(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 3) return 0;
  const mx = mean(x.slice(0, n));
  const my = mean(y.slice(0, n));
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : num / denom;
}

// Approximate two-tailed p-value for Pearson r using Abramowitz & Stegun
function approxPValue(r: number, n: number): number | null {
  if (n < 4) return null;
  const t = r * Math.sqrt((n - 2) / (1 - r * r + 1e-15));
  const absT = Math.abs(t);
  const p = Math.exp(-0.717 * absT - 0.416 * absT * absT);
  return Math.min(1, Math.max(0, 2 * p));
}

export function computeCorrelations(records: PilotRecord[]): CorrelationResult[] {
  const targets: { field: keyof PilotRecord; label: string }[] = [
    { field: 'stroop_test', label: 'Stroop Test' },
    { field: 'language_test', label: 'Language Test' },
    { field: 'memory_test', label: 'Memory Test' },
    { field: 'logical_test', label: 'Logical Test' },
    { field: 'overall_score', label: 'Overall Score' },
  ];

  return targets.map(({ field, label }) => {
    // Paired filtering: only include rows where BOTH diet_score and target field are valid numbers.
    // This prevents index misalignment from separate filtered arrays.
    const pairs = records.filter(
      r => !isNaN(r.diet_score) && !isNaN(r[field])
    );
    const xVals = pairs.map(r => r.diet_score);
    const yVals = pairs.map(r => r[field] as number);
    const r = pearsonR(xVals, yVals);
    return {
      fieldX: 'diet_score',
      fieldY: field,
      labelY: label,
      pearsonR: Math.round(r * 1000) / 1000,
      pValue: approxPValue(r, pairs.length),
      n: pairs.length,
    };
  });
}

export function computeRegressionLine(x: number[], y: number[]): { slope: number; intercept: number } {
  const n = Math.min(x.length, y.length);
  if (n < 2) return { slope: 0, intercept: 0 };
  const mx = mean(x.slice(0, n));
  const my = mean(y.slice(0, n));
  let num = 0, denom = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - mx) * (y[i] - my);
    denom += (x[i] - mx) ** 2;
  }
  const slope = denom === 0 ? 0 : num / denom;
  return { slope, intercept: my - slope * mx };
}
