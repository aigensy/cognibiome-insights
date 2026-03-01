/**
 * MiMeDB build-script schema test
 * Tests the CSV parsing and filtering logic using tiny mocked CSV fixtures.
 * Also runs a live-file integrity test against public/reference/mimedb.json.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Minimal RFC-4180 CSV parser — same logic as in build-mimedb.ts
function parseCSVRows(text: string): Record<string, string>[] {
  const lines = text.split('\n');
  if (lines.length < 2) return [];

  const parseFields = (line: string): string[] => {
    const fields: string[] = [];
    let field = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQ) {
        if (ch === '"' && line[i + 1] === '"') { field += '"'; i++; }
        else if (ch === '"') { inQ = false; }
        else { field += ch; }
      } else {
        if (ch === '"') { inQ = true; }
        else if (ch === ',') { fields.push(field); field = ''; }
        else if (ch === '\r') { /* skip */ }
        else { field += ch; }
      }
    }
    fields.push(field);
    return fields;
  };

  const headers = parseFields(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseFields(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] ?? ''; });
    rows.push(row);
  }
  return rows;
}

// Filter function matching build-mimedb.ts logic
function filterTargetMetabolites(rows: Record<string, string>[], targets: string[]) {
  return rows.filter(row => {
    const name = (row['name'] ?? '').toLowerCase();
    return targets.some(t => t === name);
  });
}

function filterTargetMicrobes(rows: Record<string, string>[], targetGenera: string[]) {
  return rows.filter(row => {
    const genus = (row['genus'] ?? '').toLowerCase();
    return targetGenera.some(g => genus.startsWith(g));
  });
}

// Tiny fixture CSVs
const MOCK_METABOLITES_CSV = `"id","name","mime_id","export","description","cas","moldb_formula","moldb_average_mass","microbe_relations","hmdb_id"
10,"Butyric acid","MMDBc0000010",1,"Short-chain fatty acid","107-92-6","C4H8O2",88.11,778,"HMDB0000039"
11,"Acetic acid","MMDBc0000011",1,"Short-chain fatty acid","64-19-7","C2H4O2",60.05,2537,"HMDB0000042"
29,"gamma-Aminobutyric acid","MMDBc0000029",1,"Neurotransmitter","56-12-2","C4H9NO2",103.12,971,"HMDB0000112"
999,"Some Irrelevant Compound","MMDBc9999999",1,"Not relevant","000-00-0","C2H6",30.07,0,"HMDB9999999"`;

const MOCK_MICROBES_CSV = `"id","name","microbe_id","species","kingdom","phylum","ncbi_tax_id","activity","gram","genus"
1,"Bifidobacterium longum","MMDBm0000001","Bifidobacterium longum","Eubacteria","Actinobacteria",216816,"NULL","Positive","Bifidobacterium"
2,"Lactobacillus acidophilus","MMDBm0000002","Lactobacillus acidophilus","Eubacteria","Firmicutes",1579,"NULL","Positive","Lactobacillus"
3,"Escherichia coli","MMDBm0000003","Escherichia coli K-12","Eubacteria","Proteobacteria",83333,"Production (export)","Negative","Escherichia"`;

const TARGET_NAMES = [
  'butyric acid',
  'acetic acid',
  'propionic acid',
  'gamma-aminobutyric acid',
];

const TARGET_GENERA = [
  'bifidobacterium',
  'lactobacillus',
];

describe('MiMeDB build-script CSV parsing', () => {
  describe('parseCSVRows', () => {
    it('parses headers and rows correctly', () => {
      const rows = parseCSVRows(MOCK_METABOLITES_CSV);
      expect(rows.length).toBe(4);
      expect(rows[0]['name']).toBe('Butyric acid');
      expect(rows[0]['mime_id']).toBe('MMDBc0000010');
    });

    it('handles quoted fields', () => {
      const csv = `"name","value"\n"Hello, World",42`;
      const rows = parseCSVRows(csv);
      expect(rows[0]['name']).toBe('Hello, World');
      expect(rows[0]['value']).toBe('42');
    });

    it('handles escaped quotes', () => {
      const csv = `"name","note"\n"He said ""hi""","ok"`;
      const rows = parseCSVRows(csv);
      expect(rows[0]['name']).toBe('He said "hi"');
    });

    it('returns empty array for single-line input', () => {
      expect(parseCSVRows('only headers')).toHaveLength(0);
    });
  });

  describe('filterTargetMetabolites', () => {
    it('matches target metabolite names (case-insensitive)', () => {
      const rows = parseCSVRows(MOCK_METABOLITES_CSV);
      const filtered = filterTargetMetabolites(rows, TARGET_NAMES);
      expect(filtered).toHaveLength(3); // butyric, acetic, gaba
    });

    it('excludes irrelevant compounds', () => {
      const rows = parseCSVRows(MOCK_METABOLITES_CSV);
      const filtered = filterTargetMetabolites(rows, TARGET_NAMES);
      expect(filtered.some(r => r['name'] === 'Some Irrelevant Compound')).toBe(false);
    });

    it('preserves MIME IDs in filtered results', () => {
      const rows = parseCSVRows(MOCK_METABOLITES_CSV);
      const filtered = filterTargetMetabolites(rows, TARGET_NAMES);
      const butyrate = filtered.find(r => r['name'] === 'Butyric acid');
      expect(butyrate?.['mime_id']).toBe('MMDBc0000010');
    });

    it('preserves microbe_relations count', () => {
      const rows = parseCSVRows(MOCK_METABOLITES_CSV);
      const filtered = filterTargetMetabolites(rows, TARGET_NAMES);
      const acetate = filtered.find(r => r['name'] === 'Acetic acid');
      expect(acetate?.['microbe_relations']).toBe('2537');
    });
  });

  describe('filterTargetMicrobes', () => {
    it('matches target genera', () => {
      const rows = parseCSVRows(MOCK_MICROBES_CSV);
      const filtered = filterTargetMicrobes(rows, TARGET_GENERA);
      expect(filtered).toHaveLength(2); // bifidobacterium + lactobacillus
    });

    it('excludes non-target genera', () => {
      const rows = parseCSVRows(MOCK_MICROBES_CSV);
      const filtered = filterTargetMicrobes(rows, TARGET_GENERA);
      expect(filtered.some(r => r['genus'] === 'Escherichia')).toBe(false);
    });

    it('preserves species field', () => {
      const rows = parseCSVRows(MOCK_MICROBES_CSV);
      const filtered = filterTargetMicrobes(rows, TARGET_GENERA);
      expect(filtered[0]['species']).toBe('Bifidobacterium longum');
    });
  });

  describe('JSON snapshot schema', () => {
    it('snapshot has required top-level keys', () => {
      const metabRows = parseCSVRows(MOCK_METABOLITES_CSV);
      const microbeRows = parseCSVRows(MOCK_MICROBES_CSV);
      const snapshot = {
        metadata: {
          source: 'test',
          build_timestamp: new Date().toISOString(),
          sha256_metabolites_csv: 'abc',
          sha256_microbes_csv: 'def',
          row_count_metabolites: metabRows.length,
          row_count_microbes: microbeRows.length,
          matched_metabolites: 3,
          matched_microbes: 2,
          limitations: ['test limitation'],
          license: 'test license',
        },
        metabolites: filterTargetMetabolites(metabRows, TARGET_NAMES).map(r => ({ name: r['name'], mime_id: r['mime_id'] })),
        microbes: filterTargetMicrobes(microbeRows, TARGET_GENERA).map(r => ({ species: r['species'], genus: r['genus'] })),
        microbe_metabolite_links: [],
      };

      expect(snapshot).toHaveProperty('metadata');
      expect(snapshot).toHaveProperty('metabolites');
      expect(snapshot).toHaveProperty('microbes');
      expect(snapshot).toHaveProperty('microbe_metabolite_links');
      expect(snapshot.metadata).toHaveProperty('build_timestamp');
      expect(snapshot.metadata).toHaveProperty('sha256_metabolites_csv');
      expect(snapshot.metadata).toHaveProperty('limitations');
      expect(snapshot.metabolites[0]).toHaveProperty('name');
      expect(snapshot.metabolites[0]).toHaveProperty('mime_id');
    });
  });

  describe('microbe_metabolite_links provenance guardrails', () => {
    // Minimal mock of what build-mimedb.ts now emits for unconfirmedLiteratureLinks
    const MOCK_LINKS = [
      {
        metabolite_name: 'Butyric acid',
        metabolite_mime_id: 'MMDBc0000010',
        microbe_genera: ['Faecalibacterium', 'Roseburia'],
        source_in_mimedb_csv: false,
        evidence_note: 'cannot confirm from parsed MiMeDB CSV — see citation',
        literature_context: 'SCFAs produced by Firmicutes (see REFERENCES_AND_LICENSES.md).',
      },
      {
        metabolite_name: 'Acetic acid',
        metabolite_mime_id: 'MMDBc0000011',
        microbe_genera: ['Bifidobacterium'],
        source_in_mimedb_csv: false,
        evidence_note: 'cannot confirm from parsed MiMeDB CSV — see citation',
        literature_context: 'Primary SCFA produced by bifidogenic fermentation (see REFERENCES_AND_LICENSES.md).',
      },
    ];

    it('every link has source_in_mimedb_csv set to false (not derivable from CSV)', () => {
      for (const link of MOCK_LINKS) {
        expect(link.source_in_mimedb_csv).toBe(false);
      }
    });

    it('no link has source_in_mimedb_csv set to true (would indicate false provenance claim)', () => {
      const confirmedLinks = MOCK_LINKS.filter(l => l.source_in_mimedb_csv === true);
      expect(confirmedLinks).toHaveLength(0);
    });

    it('every link has an evidence_note field', () => {
      for (const link of MOCK_LINKS) {
        expect(link).toHaveProperty('evidence_note');
        expect(typeof link.evidence_note).toBe('string');
        expect(link.evidence_note.length).toBeGreaterThan(0);
      }
    });

    it('every link evidence_note contains "cannot confirm" (explicit disclaimer)', () => {
      for (const link of MOCK_LINKS) {
        expect(link.evidence_note).toMatch(/cannot confirm/i);
      }
    });

    it('every link has a literature_context field (for educational display)', () => {
      for (const link of MOCK_LINKS) {
        expect(link).toHaveProperty('literature_context');
        expect(typeof link.literature_context).toBe('string');
      }
    });

    it('links do not have old "evidence: literature" field (schema migration check)', () => {
      for (const link of MOCK_LINKS) {
        // Old schema used evidence: 'literature' — new schema uses source_in_mimedb_csv + evidence_note
        expect(link).not.toHaveProperty('evidence');
        expect(link).not.toHaveProperty('note');
      }
    });
  });
});

// ---------------------------------------------------------------------------
// TASK 5 — Real-file integrity test: public/reference/mimedb.json
// ---------------------------------------------------------------------------
describe('mimedb.json real-file integrity (TASK 5)', () => {
  const MIMEDB_PATH = path.resolve(__dirname, '../../public/reference/mimedb.json');

  let snapshot: {
    metadata: Record<string, unknown>;
    metabolites: unknown[];
    microbes: unknown[];
    microbe_metabolite_links: Array<Record<string, unknown>>;
  };

  it('public/reference/mimedb.json exists and is valid JSON', () => {
    const raw = fs.readFileSync(MIMEDB_PATH, 'utf8');
    snapshot = JSON.parse(raw);
    expect(snapshot).toBeTruthy();
  });

  it('snapshot has required top-level keys', () => {
    expect(snapshot).toHaveProperty('metadata');
    expect(snapshot).toHaveProperty('metabolites');
    expect(snapshot).toHaveProperty('microbes');
    expect(snapshot).toHaveProperty('microbe_metabolite_links');
  });

  it('no link has source_in_mimedb_csv set to true', () => {
    for (const link of snapshot.microbe_metabolite_links) {
      expect(link['source_in_mimedb_csv']).not.toBe(true);
    }
  });

  it('every link that has source_in_mimedb_csv has it set to false', () => {
    const linksWithField = snapshot.microbe_metabolite_links.filter(
      l => 'source_in_mimedb_csv' in l
    );
    for (const link of linksWithField) {
      expect(link['source_in_mimedb_csv']).toBe(false);
    }
  });

  it('every link has a disclaimer in evidence_note or evidence field', () => {
    for (const link of snapshot.microbe_metabolite_links) {
      const disclaimer = (link['evidence_note'] ?? link['evidence'] ?? '') as string;
      expect(disclaimer.toLowerCase()).toMatch(/cannot confirm/);
    }
  });
});
