// Deterministic simulation engine — D→X→M→Y pipeline

export interface DietInputs {
  fiber_proxy: number;
  added_sugar_proxy: number;
  sat_fat_proxy: number;
  omega3_proxy: number;
}

export interface MicrobiomeOutputs {
  bifidobacterium: number;
  lactobacillus: number;
  fb_ratio: number;
}

export interface MetaboliteOutputs {
  acetate: number;
  propionate: number;
  butyrate: number;
  five_htp_index: number;
}

export interface CognitionOutputs {
  stroop_test: number;
  language_test: number;
  memory_test: number;
  logical_test: number;
  overall_score: number;
}

export interface SimulationResult {
  runHash: string;
  timestamp: string;
  inputs: DietInputs;
  dietScoreProxy: number;
  microbiome: MicrobiomeOutputs;
  metabolites: MetaboliteOutputs;
  cognition: CognitionOutputs;
  modelVersions: { stage1: string; stage2: string; stage3: string };
  notes: string;
}

interface StageArtifact {
  meta: { id: string; version: string; is_demo: boolean };
  coefficients: Record<string, Record<string, number>>;
  output_ranges: Record<string, { min: number; max: number }>;
}

let cachedArtifacts: { stage1: StageArtifact; stage2: StageArtifact; stage3: StageArtifact } | null = null;

export async function loadModelArtifacts(): Promise<{ stage1: StageArtifact; stage2: StageArtifact; stage3: StageArtifact }> {
  if (cachedArtifacts) return cachedArtifacts;
  const [s1, s2, s3] = await Promise.all([
    fetch('/models/stage1.json').then(r => r.json()),
    fetch('/models/stage2.json').then(r => r.json()),
    fetch('/models/stage3.json').then(r => r.json()),
  ]);
  cachedArtifacts = { stage1: s1, stage2: s2, stage3: s3 };
  return cachedArtifacts;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function linearPredict(coefficients: Record<string, number>, inputs: Record<string, number>, ranges?: { min: number; max: number }): number {
  let result = coefficients.intercept ?? 0;
  for (const [key, weight] of Object.entries(coefficients)) {
    if (key === 'intercept') continue;
    result += weight * (inputs[key] ?? 0);
  }
  if (ranges) result = clamp(result, ranges.min, ranges.max);
  return Math.round(result * 1000) / 1000;
}

// SHA-256 hash (browser native)
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function runSimulation(inputs: DietInputs, notes: string = ''): Promise<SimulationResult> {
  const artifacts = await loadModelArtifacts();
  const { stage1, stage2, stage3 } = artifacts;

  // Stage 1: D→X
  const dietInputRecord: Record<string, number> = { ...inputs };
  const microbiome: MicrobiomeOutputs = {
    bifidobacterium: linearPredict(stage1.coefficients.bifidobacterium, dietInputRecord, stage1.output_ranges?.bifidobacterium),
    lactobacillus: linearPredict(stage1.coefficients.lactobacillus, dietInputRecord, stage1.output_ranges?.lactobacillus),
    fb_ratio: linearPredict(stage1.coefficients.fb_ratio, dietInputRecord, stage1.output_ranges?.fb_ratio),
  };

  // Stage 2: X→M
  const microInputRecord: Record<string, number> = { ...microbiome };
  const metabolites: MetaboliteOutputs = {
    acetate: linearPredict(stage2.coefficients.acetate, microInputRecord, stage2.output_ranges?.acetate),
    propionate: linearPredict(stage2.coefficients.propionate, microInputRecord, stage2.output_ranges?.propionate),
    butyrate: linearPredict(stage2.coefficients.butyrate, microInputRecord, stage2.output_ranges?.butyrate),
    five_htp_index: linearPredict(stage2.coefficients.five_htp_index, microInputRecord, stage2.output_ranges?.five_htp_index),
  };

  // Stage 3: M→Y
  const metaInputRecord: Record<string, number> = { ...metabolites };
  const cognition: CognitionOutputs = {
    stroop_test: linearPredict(stage3.coefficients.stroop_test, metaInputRecord, stage3.output_ranges?.stroop_test),
    language_test: linearPredict(stage3.coefficients.language_test, metaInputRecord, stage3.output_ranges?.language_test),
    memory_test: linearPredict(stage3.coefficients.memory_test, metaInputRecord, stage3.output_ranges?.memory_test),
    logical_test: linearPredict(stage3.coefficients.logical_test, metaInputRecord, stage3.output_ranges?.logical_test),
    overall_score: 0,
  };
  cognition.overall_score = Math.round((cognition.stroop_test + cognition.language_test + cognition.memory_test + cognition.logical_test) * 1000) / 1000;

  const modelVersions = {
    stage1: stage1.meta.id + '@' + stage1.meta.version,
    stage2: stage2.meta.id + '@' + stage2.meta.version,
    stage3: stage3.meta.id + '@' + stage3.meta.version,
  };

  const normalizedInputs = { ...inputs };
  const hashInput = JSON.stringify({ normalized_inputs: normalizedInputs, model_versions: modelVersions });
  const runHash = await sha256(hashInput);

  const { computeDietScoreProxy } = await import('../world_model/worldModel');
  const dietInputsRecord: Record<string, number> = {
    fiber_proxy: inputs.fiber_proxy,
    added_sugar_proxy: inputs.added_sugar_proxy,
    sat_fat_proxy: inputs.sat_fat_proxy,
    omega3_proxy: inputs.omega3_proxy,
  };

  return {
    runHash,
    timestamp: new Date().toISOString(),
    inputs,
    dietScoreProxy: computeDietScoreProxy(dietInputsRecord),
    microbiome,
    metabolites,
    cognition,
    modelVersions,
    notes,
  };
}

// localStorage persistence
const RUNS_KEY = 'cognibiome_runs';

export function getSavedRuns(): SimulationResult[] {
  try {
    const raw = localStorage.getItem(RUNS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveRun(run: SimulationResult): void {
  const runs = getSavedRuns();
  // Avoid duplicate hashes
  if (!runs.some(r => r.runHash === run.runHash)) {
    runs.unshift(run);
    localStorage.setItem(RUNS_KEY, JSON.stringify(runs.slice(0, 50)));
  }
}

export function clearRuns(): void {
  localStorage.removeItem(RUNS_KEY);
}
