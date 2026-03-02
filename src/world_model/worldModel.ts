// World Model — typed graph driving simulator + UI labels
// This is NOT a knowledge graph claim. It is an internal representation for consistency.

export interface DietFeature {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  default: number;
  step: number;
  description: string;
}

export interface MicrobeGenus {
  id: string;
  label: string;
  unit: string;
  description: string;
  disclaimer: string;
}

export interface MetaboliteProxy {
  id: string;
  label: string;
  unit: string;
  description: string;
  disclaimer: string;
}

export interface CognitiveDomain {
  id: string;
  label: string;
  unit: string;
  description: string;
  pilotField: string;
}

export interface StageRelation {
  from: string;
  to: string;
  stage: 'D→X' | 'X→M' | 'M→Y';
  modelArtifact: string;
}

export const DIET_FEATURES: DietFeature[] = [
  { id: 'fiber_proxy', label: 'Fiber Intake', unit: 'g/day (proxy)', min: 0, max: 50, default: 25, step: 1, description: 'Dietary fiber from whole grains, legumes, vegetables, and fruits.' },
  { id: 'added_sugar_proxy', label: 'Added Sugar', unit: 'g/day (proxy)', min: 0, max: 100, default: 30, step: 1, description: 'Added sugars from processed foods, beverages, and desserts.' },
  { id: 'sat_fat_proxy', label: 'Saturated Fat', unit: 'g/day (proxy)', min: 0, max: 50, default: 15, step: 1, description: 'Saturated fatty acids from animal and processed food sources.' },
  { id: 'omega3_proxy', label: 'Omega-3 / PUFA', unit: 'g/day (proxy)', min: 0, max: 10, default: 2, step: 0.5, description: 'Omega-3 polyunsaturated fatty acid intake (EPA/DHA proxy).' },
];

export const MICROBE_GENERA: MicrobeGenus[] = [
  { id: 'bifidobacterium', label: 'Bifidobacterium', unit: 'relative abundance (proxy)', description: 'Beneficial genus associated with fiber fermentation and SCFA production.', disclaimer: 'MODELED proxy — not measured in pilot participants.' },
  { id: 'lactobacillus', label: 'Lactobacillus', unit: 'relative abundance (proxy)', description: 'Probiotic genus associated with gut barrier integrity.', disclaimer: 'MODELED proxy — not measured in pilot participants.' },
  { id: 'fb_ratio', label: 'Firmicutes:Bacteroidetes Ratio', unit: 'ratio (unitless)', description: 'Community-level compositional proxy. Higher ratios are associated with Western-style diets.', disclaimer: 'MODELED proxy — not measured in pilot participants.' },
];

export const METABOLITE_PROXIES: MetaboliteProxy[] = [
  { id: 'acetate', label: 'Acetate', unit: 'standardized score (proxy)', description: 'Short-chain fatty acid produced by gut microbial fermentation of fiber.', disclaimer: 'MODELED proxy — not measured in pilot participants.' },
  { id: 'propionate', label: 'Propionate', unit: 'standardized score (proxy)', description: 'SCFA involved in gluconeogenesis and satiety signaling.', disclaimer: 'MODELED proxy — not measured in pilot participants.' },
  { id: 'butyrate', label: 'Butyrate', unit: 'standardized score (proxy)', description: 'SCFA critical for colonocyte energy, gut barrier function, and anti-inflammatory effects.', disclaimer: 'MODELED proxy — not measured in pilot participants.' },
  { id: 'five_htp_index', label: '5-HTP Precursor Index', unit: 'precursor proxy index', description: 'Proxy for serotonin precursor availability influenced by tryptophan metabolism. This is NOT serotonin in the brain.', disclaimer: 'MODELED proxy — precursor availability, not neurotransmitter level.' },
];

export const COGNITIVE_DOMAINS: CognitiveDomain[] = [
  { id: 'stroop_test', label: 'Stroop Test', unit: 'score', description: 'Measures selective attention and cognitive flexibility.', pilotField: 'stroop_test' },
  { id: 'language_test', label: 'Language Test', unit: 'score', description: 'Measures verbal comprehension and fluency.', pilotField: 'language_test' },
  { id: 'memory_test', label: 'Memory Test', unit: 'score', description: 'Measures working memory and recall.', pilotField: 'memory_test' },
  { id: 'logical_test', label: 'Logical Reasoning', unit: 'score', description: 'Measures logical and analytical reasoning.', pilotField: 'logical_test' },
  { id: 'overall_score', label: 'Overall Score', unit: 'composite', description: 'Sum of all cognitive sub-tests.', pilotField: 'overall_score' },
];

export const STAGE_RELATIONS: StageRelation[] = [
  { from: 'diet_features', to: 'microbe_genera', stage: 'D→X', modelArtifact: '/models/stage1.json' },
  { from: 'microbe_genera', to: 'metabolite_proxies', stage: 'X→M', modelArtifact: '/models/stage2.json' },
  { from: 'metabolite_proxies', to: 'cognitive_domains', stage: 'M→Y', modelArtifact: '/models/stage3.json' },
];

export const DISCLAIMERS = {
  nonCausal: 'This simulator generates testable hypotheses. It does NOT prove causality or mechanism.',
  nonDiagnostic: 'Educational research prototype. NOT medical advice. NOT a diagnostic device.',
  modeledProxy: 'All microbiome and metabolite outputs are MODELED / ESTIMATED proxies — not measured biomarkers from pilot participants.',
  pilotValidation: 'The teen pilot dataset (n=66) is de-identified and used for association benchmarking only (results charts). It has no microbiome/metabolomics measurements and is never used to fit or tune simulator parameters.',
  demoParams: 'Demo parameters (directional), replaceable with trained model artifacts.',
};

export function computeDietScoreProxy(inputs: Record<string, number>): number {
  const fiber = inputs.fiber_proxy ?? 25;
  const sugar = inputs.added_sugar_proxy ?? 30;
  const satFat = inputs.sat_fat_proxy ?? 15;
  const omega3 = inputs.omega3_proxy ?? 2;
  // Simple deterministic composite: higher fiber + omega3 = better, higher sugar + sat_fat = worse
  const raw = (fiber * 0.8 + omega3 * 3.0) - (sugar * 0.3 + satFat * 0.4);
  return Math.max(0, Math.min(30, Math.round(raw * 10) / 10 + 10));
}
