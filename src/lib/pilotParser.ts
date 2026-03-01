// Pilot CSV Parser — client-side ingestion with validation

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
}

export function parsePilotCSV(csvText: string, source: 'bundled' | 'upload' = 'bundled'): PilotDataset {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    return { records: [], rowCount: 0, integrityPassed: false, integrityErrors: ['CSV has no data rows.'], warnings: [], loadedAt: new Date().toISOString(), source };
  }

  const headerLine = lines[0];
  let headers = headerLine.split(',').map(h => h.trim());

  // Drop Unnamed: columns
  const validIndices: number[] = [];
  const cleanHeaders: string[] = [];
  headers.forEach((h, i) => {
    if (!/^Unnamed:/i.test(h)) {
      validIndices.push(i);
      cleanHeaders.push(h);
    }
  });

  // Handle duplicate Diet Score columns
  const dietScoreCols = cleanHeaders.map((h, i) => ({ header: h, index: i }))
    .filter(x => /^diet.?score/i.test(x.header.replace(/[._]/g, ' ')));

  // Map headers to canonical names
  const canonicalMap: Record<string, number> = {};
  const warnings: string[] = [];

  const findCol = (patterns: RegExp[]) => {
    for (const p of patterns) {
      const idx = cleanHeaders.findIndex(h => p.test(h.toLowerCase().replace(/[._]/g, ' ')));
      if (idx >= 0) return idx;
    }
    return -1;
  };

  if (dietScoreCols.length > 1) {
    warnings.push(`Found ${dietScoreCols.length} Diet Score columns. Using first: "${dietScoreCols[0].header}".`);
  }

  canonicalMap['diet_score'] = dietScoreCols.length > 0 ? dietScoreCols[0].index : findCol([/^diet.?score$/]);
  canonicalMap['stroop_test'] = findCol([/stroop/]);
  canonicalMap['language_test'] = findCol([/language/]);
  canonicalMap['memory_test'] = findCol([/memory/]);
  canonicalMap['logical_test'] = findCol([/logical/]);
  canonicalMap['overall_score'] = findCol([/overall/]);

  const records: PilotRecord[] = [];
  const integrityErrors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
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

    // Integrity check: overall == sum of subtests
    const expectedOverall = record.stroop_test + record.language_test + record.memory_test + record.logical_test;
    if (!isNaN(record.overall_score) && !isNaN(expectedOverall)) {
      if (Math.abs(record.overall_score - expectedOverall) > 0.15) {
        integrityErrors.push(`Row ${i}: overall_score (${record.overall_score}) ≠ sum of subtests (${expectedOverall.toFixed(1)})`);
      }
    }

    records.push(record);
  }

  return {
    records,
    rowCount: records.length,
    integrityPassed: integrityErrors.length === 0,
    integrityErrors,
    warnings,
    loadedAt: new Date().toISOString(),
    source,
  };
}

export async function loadBundledPilot(): Promise<PilotDataset | null> {
  try {
    const resp = await fetch('/pilot/pilot_dataset_n66.csv');
    if (!resp.ok) return null;
    const text = await resp.text();
    return parsePilotCSV(text, 'bundled');
  } catch {
    return null;
  }
}
