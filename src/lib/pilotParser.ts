// Pilot CSV Parser — client-side ingestion with strict validation

export interface PilotRecord {
  diet_score: number;
  stroop_test: number;
  language_test: number;
  memory_test: number;
  logical_test: number;
  overall_score: number;
}

export interface PilotDataset {
  records: PilotRecord[];
  rowCount: number;
  integrityPassed: boolean;
  integrityErrors: string[];
  warnings: string[];
  loadedAt: string;
  source: 'bundled' | 'upload';
  /** SHA-256 of the raw CSV text (hex, computed via Web Crypto when available) */
  sha256: string | null;
  /** True when there are multiple Diet Score columns with differing values — stats are blocked until resolved */
  mappingRequired: boolean;
  /** Candidate column names when mappingRequired is true */
  dietScoreCandidates: string[];
  /** True when required columns are missing or non-numeric values are found */
  datasetInvalid: boolean;
  /** Primary error message when datasetInvalid is true */
  invalidReason: string | null;
}

const REQUIRED_FIELDS: Array<keyof PilotRecord> = [
  'diet_score',
  'stroop_test',
  'language_test',
  'memory_test',
  'logical_test',
  'overall_score',
];

export function parsePilotCSV(
  csvText: string,
  source: 'bundled' | 'upload' = 'bundled',
  selectedDietScoreHeader?: string
): PilotDataset {
  const empty = (reason: string): PilotDataset => ({
    records: [],
    rowCount: 0,
    integrityPassed: false,
    integrityErrors: [],
    warnings: [],
    loadedAt: new Date().toISOString(),
    source,
    sha256: null,
    mappingRequired: false,
    dietScoreCandidates: [],
    datasetInvalid: true,
    invalidReason: reason,
  });

  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    return empty('CSV has no data rows.');
  }

  const headerLine = lines[0];
  let headers = headerLine.split(',').map(h => h.trim().replace(/\r$/, ''));

  // Drop Unnamed: columns, track valid indices
  const validIndices: number[] = [];
  const cleanHeaders: string[] = [];
  headers.forEach((h, i) => {
    if (!/^Unnamed:/i.test(h)) {
      validIndices.push(i);
      cleanHeaders.push(h);
    }
  });

  // Detect Diet Score column candidates
  const dietScoreCols = cleanHeaders
    .map((h, i) => ({ header: h, index: i }))
    .filter(x => /diet.?score/i.test(x.header.replace(/[._\s]/g, ' ')));

  const warnings: string[] = [];

  const findCol = (patterns: RegExp[]): number => {
    for (const p of patterns) {
      const idx = cleanHeaders.findIndex(h => p.test(h.toLowerCase().replace(/[._]/g, ' ')));
      if (idx >= 0) return idx;
    }
    return -1;
  };

  const canonicalMap: Record<string, number> = {};

  // Resolve Diet Score column
  if (dietScoreCols.length === 0) {
    // Try generic patterns
    const idx = findCol([/^diet.?score$/, /^diet$/]);
    if (idx < 0) {
      return empty('Required column "diet_score" not found in CSV headers.');
    }
    canonicalMap['diet_score'] = idx;
  } else if (dietScoreCols.length === 1) {
    canonicalMap['diet_score'] = dietScoreCols[0].index;
  } else {
    // Multiple Diet Score columns
    if (selectedDietScoreHeader) {
      const chosen = dietScoreCols.find(c => c.header === selectedDietScoreHeader);
      if (!chosen) {
        return empty(`Selected Diet Score column "${selectedDietScoreHeader}" not found.`);
      }
      canonicalMap['diet_score'] = chosen.index;
      warnings.push(`Using selected Diet Score column: "${selectedDietScoreHeader}".`);
    } else {
      // Check row-wise equality across all candidate columns
      const candidateIndices = dietScoreCols.map(c => c.index);
      let allEqual = true;

      for (let i = 1; i < lines.length && allEqual; i++) {
        const line = lines[i].trim().replace(/\r$/, '');
        if (!line) continue;
        const rawCells = line.split(',');
        const cells = validIndices.map(idx => rawCells[idx]?.trim() ?? '');
        const values = candidateIndices.map(idx => cells[idx] ?? '');
        const nonEmpty = values.filter(v => v !== '');
        if (nonEmpty.length > 1) {
          const first = nonEmpty[0];
          if (!nonEmpty.every(v => v === first)) {
            allEqual = false;
          }
        }
      }

      if (allEqual) {
        // Auto-select the first candidate
        canonicalMap['diet_score'] = dietScoreCols[0].index;
        warnings.push(
          `Found ${dietScoreCols.length} Diet Score columns — all values equal. Auto-selected "${dietScoreCols[0].header}".`
        );
      } else {
        // Cannot auto-resolve — signal mapping required
        return {
          records: [],
          rowCount: 0,
          integrityPassed: false,
          integrityErrors: [],
          warnings: [`Multiple Diet Score columns found with differing values: ${dietScoreCols.map(c => c.header).join(', ')}`],
          loadedAt: new Date().toISOString(),
          source,
          sha256: null,
          mappingRequired: true,
          dietScoreCandidates: dietScoreCols.map(c => c.header),
          datasetInvalid: false,
          invalidReason: null,
        };
      }
    }
  }

  // Map remaining canonical fields
  canonicalMap['stroop_test'] = findCol([/stroop/]);
  canonicalMap['language_test'] = findCol([/language/]);
  canonicalMap['memory_test'] = findCol([/memory/]);
  canonicalMap['logical_test'] = findCol([/logical/]);
  canonicalMap['overall_score'] = findCol([/overall/]);

  // Strict validation: ensure all required fields are mapped
  for (const field of REQUIRED_FIELDS) {
    if (canonicalMap[field] === undefined || canonicalMap[field] < 0) {
      return empty(`Required column "${field}" is missing from CSV headers.`);
    }
  }

  const records: PilotRecord[] = [];
  const integrityErrors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim().replace(/\r$/, '');
    if (!line) continue;
    const rawCells = line.split(',');
    const cells = validIndices.map(idx => rawCells[idx]?.trim() ?? '');

    const getNum = (field: string): number => {
      const idx = canonicalMap[field];
      if (idx === undefined || idx < 0 || idx >= cells.length) return NaN;
      return parseFloat(cells[idx]);
    };

    const record: PilotRecord = {
      diet_score: getNum('diet_score'),
      stroop_test: getNum('stroop_test'),
      language_test: getNum('language_test'),
      memory_test: getNum('memory_test'),
      logical_test: getNum('logical_test'),
      overall_score: getNum('overall_score'),
    };

    // Strict: reject rows with NaN in any required canonical field
    const nanFields = REQUIRED_FIELDS.filter(f => isNaN(record[f]));
    if (nanFields.length > 0) {
      integrityErrors.push(
        `Row ${i}: non-numeric value in field(s): ${nanFields.join(', ')}`
      );
    }

    // Integrity check: overall == sum of subtests (±0.15)
    const expectedOverall =
      record.stroop_test + record.language_test + record.memory_test + record.logical_test;
    if (!isNaN(record.overall_score) && !isNaN(expectedOverall)) {
      if (Math.abs(record.overall_score - expectedOverall) > 0.15) {
        integrityErrors.push(
          `Row ${i}: overall_score (${record.overall_score}) ≠ sum of subtests (${expectedOverall.toFixed(1)})`
        );
      }
    }

    records.push(record);
  }

  const hasNanRows = integrityErrors.some(e => e.includes('non-numeric'));

  return {
    records,
    rowCount: records.length,
    integrityPassed: integrityErrors.length === 0,
    integrityErrors,
    warnings,
    loadedAt: new Date().toISOString(),
    source,
    sha256: null, // filled by loadBundledPilot via async sha256
    mappingRequired: false,
    dietScoreCandidates: [],
    datasetInvalid: hasNanRows,
    invalidReason: hasNanRows
      ? `${integrityErrors.filter(e => e.includes('non-numeric')).length} rows contain non-numeric values in required fields.`
      : null,
  };
}

async function computeSha256(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = new TextEncoder().encode(text);
    const hashBuf = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hashBuf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return 'unavailable';
}

export async function loadBundledPilot(): Promise<PilotDataset | null> {
  try {
    const resp = await fetch('/pilot/pilot_dataset_n66.csv');
    if (!resp.ok) return null;
    const text = await resp.text();
    const dataset = parsePilotCSV(text, 'bundled');
    const hash = await computeSha256(text);
    return { ...dataset, sha256: hash };
  } catch {
    return null;
  }
}

export async function loadPilotWithSha256(
  csvText: string,
  source: 'bundled' | 'upload',
  selectedDietScoreHeader?: string
): Promise<PilotDataset> {
  const dataset = parsePilotCSV(csvText, source, selectedDietScoreHeader);
  const hash = await computeSha256(csvText);
  return { ...dataset, sha256: hash };
}
