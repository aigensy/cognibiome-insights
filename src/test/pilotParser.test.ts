/**
 * TST-001 — Pilot CSV parser unit tests
 */
import { describe, it, expect } from 'vitest';
import { parsePilotCSV } from '@/lib/pilotParser';

// The actual canonical CSV from public/pilot/pilot_dataset_n66.csv
const CANONICAL_CSV = `diet_score,stroop_test,language_test,memory_test,logical_test,overall_score
21,17.0,19,8,14,58.0
19,18.7,14,10,12,54.7
16,20.0,7,12,14,53.0
19,19.0,14,8,10,51.0
16,18.7,16,9,16,59.7
10,19.3,12,5,8,44.3
14,11.7,14,3,10,38.7
18,18.7,10,5,16,49.7
17,19.3,12,9,16,56.3
20,20.0,14,7,14,55.0
21,18.3,14,9,12,53.3
16,20.0,15,7,14,56.0
14,20.0,14,10,10,54.0
23,19.3,17,3,14,53.3
12,17.7,12,3,14,46.7
15,20.0,15,3,10,48.0
16,19.3,17,5,16,57.3
15,19.3,8,7,10,44.3
26,20.0,17,5,18,60.0
17,19.7,14,5,18,56.7
16,17.0,14,4,8,43.0
11,19.0,11,12,14,56.0
18,18.3,15,6,10,49.3
15,19.0,13,4,14,50.0
22,20.0,13,2,14,49.0
13,19.3,14,3,6,42.3
15,19.3,14,6,16,55.3
14,19.7,16,7,14,56.7
18,20.0,17,5,12,54.0
14,19.0,16,4,10,49.0
11,20.0,14,1,8,43.0
14,19.0,14,6,12,51.0
11,20.0,13,3,12,48.0
11,19.0,11,3,12,45.0
15,19.7,14,5,18,56.7
10,18.7,13,6,14,51.7
21,19.7,16,5,14,54.7
20,19.3,15,8,16,58.3
21,20.0,15,4,16,55.0
13,18.3,10,2,10,40.3
12,20.0,11,7,16,54.0
16,19.7,9,3,8,39.7
23,20.0,14,6,12,52.0
17,19.7,16,3,16,54.7
21,19.0,15,4,18,56.0
20,19.0,17,6,10,52.0
17,20.0,13,4,12,49.0
15,20.0,17,6,16,59.0
17,20.0,13,6,14,53.0
20,18.7,10,4,12,44.7
15,19.7,15,4,16,54.7
12,20.0,15,4,12,51.0
18,19.3,15,3,18,55.3
15,19.7,14,5,12,50.7
15,18.7,15,5,10,48.7
14,18.3,12,3,8,41.3
14,19.3,12,4,10,45.3
12,19.7,13,5,12,49.7
10,20.0,14,6,14,54.0
21,18.7,16,2,8,44.7
25,19.3,17,1,14,51.3
20,19.0,13,6,16,54.0
23,20.0,11,6,16,53.0
21,19.7,17,14,20,70.7
15,19.7,10,3,4,36.7
14,19.7,15,5,10,49.7`;

describe('parsePilotCSV (TST-001)', () => {
  describe('Case A: canonical CSV parses correctly', () => {
    it('returns rowCount = 66', () => {
      const result = parsePilotCSV(CANONICAL_CSV, 'bundled');
      expect(result.rowCount).toBe(66);
    });

    it('passes integrity check', () => {
      const result = parsePilotCSV(CANONICAL_CSV, 'bundled');
      expect(result.integrityPassed).toBe(true);
      expect(result.integrityErrors).toHaveLength(0);
    });

    it('has no mapping required', () => {
      const result = parsePilotCSV(CANONICAL_CSV, 'bundled');
      expect(result.mappingRequired).toBe(false);
    });

    it('is not marked invalid', () => {
      const result = parsePilotCSV(CANONICAL_CSV, 'bundled');
      expect(result.datasetInvalid).toBe(false);
    });

    it('parses numeric values correctly for first row', () => {
      const result = parsePilotCSV(CANONICAL_CSV, 'bundled');
      expect(result.records[0].diet_score).toBe(21);
      expect(result.records[0].stroop_test).toBeCloseTo(17.0);
      expect(result.records[0].overall_score).toBeCloseTo(58.0);
    });
  });

  describe('Case B: duplicate Diet Score columns with equal values → auto-select', () => {
    const CSV_EQUAL_DUPES = `diet_score,diet_score_v2,stroop_test,language_test,memory_test,logical_test,overall_score
21,21,17.0,19,8,14,58.0
19,19,18.7,14,10,12,54.7
16,16,20.0,7,12,14,53.0`;

    it('does NOT set mappingRequired when duplicates are equal', () => {
      const result = parsePilotCSV(CSV_EQUAL_DUPES, 'bundled');
      expect(result.mappingRequired).toBe(false);
    });

    it('auto-selects the first candidate and adds a warning', () => {
      const result = parsePilotCSV(CSV_EQUAL_DUPES, 'bundled');
      expect(result.warnings.some(w => /auto-selected/i.test(w))).toBe(true);
    });

    it('parses records correctly after auto-selection', () => {
      const result = parsePilotCSV(CSV_EQUAL_DUPES, 'bundled');
      expect(result.records[0].diet_score).toBe(21);
      expect(result.rowCount).toBe(3);
    });
  });

  describe('Case C: duplicate Diet Score columns with unequal values → mappingRequired', () => {
    const CSV_UNEQUAL_DUPES = `diet_score,diet_score_v2,stroop_test,language_test,memory_test,logical_test,overall_score
21,18,17.0,19,8,14,58.0
19,22,18.7,14,10,12,54.7
16,16,20.0,7,12,14,53.0`;

    it('sets mappingRequired = true', () => {
      const result = parsePilotCSV(CSV_UNEQUAL_DUPES, 'bundled');
      expect(result.mappingRequired).toBe(true);
    });

    it('populates dietScoreCandidates', () => {
      const result = parsePilotCSV(CSV_UNEQUAL_DUPES, 'bundled');
      expect(result.dietScoreCandidates.length).toBeGreaterThanOrEqual(2);
    });

    it('returns empty records (stats blocked)', () => {
      const result = parsePilotCSV(CSV_UNEQUAL_DUPES, 'bundled');
      expect(result.records).toHaveLength(0);
    });

    it('resolves correctly when user selects a column', () => {
      const intermediate = parsePilotCSV(CSV_UNEQUAL_DUPES, 'bundled');
      const col = intermediate.dietScoreCandidates[0];
      const resolved = parsePilotCSV(CSV_UNEQUAL_DUPES, 'bundled', col);
      expect(resolved.mappingRequired).toBe(false);
      expect(resolved.rowCount).toBe(3);
    });
  });

  describe('Strict validation: missing columns', () => {
    it('marks datasetInvalid when a required column is missing', () => {
      const csv = `diet_score,stroop_test,language_test,memory_test,logical_test\n21,17,19,8,14`;
      const result = parsePilotCSV(csv, 'bundled');
      expect(result.datasetInvalid).toBe(true);
      expect(result.invalidReason).toMatch(/overall_score/);
    });
  });

  describe('Strict validation: non-numeric values', () => {
    it('marks integrityErrors for rows with non-numeric values', () => {
      const csv = `diet_score,stroop_test,language_test,memory_test,logical_test,overall_score\nN/A,17,19,8,14,58\n21,17,19,8,14,58`;
      const result = parsePilotCSV(csv, 'bundled');
      expect(result.integrityErrors.some(e => /non-numeric/i.test(e))).toBe(true);
      expect(result.datasetInvalid).toBe(true);
    });
  });
});
