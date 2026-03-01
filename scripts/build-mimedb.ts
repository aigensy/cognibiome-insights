#!/usr/bin/env node
/**
 * build-mimedb.ts
 * Reads local/mimedb_metabolites_v2.csv and local/mimedb_microbes_v2.csv,
 * produces a judge-ready snapshot at public/reference/mimedb.json.
 *
 * If local/ files are absent, exits 0 with a warning (bundle-extracted stub remains).
 *
 * Note: The MiMeDB CSVs do not include a metabolite↔microbe join table in these exports.
 * The microbe_relations column in the metabolites CSV is a count only (no microbe IDs).
 * Therefore, microbe links are derived from literature-known associations for our target
 * metabolites (documented in the limitation notes).
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const METABOLITES_CSV = path.join(REPO_ROOT, 'local', 'mimedb_metabolites_v2.csv');
const MICROBES_CSV = path.join(REPO_ROOT, 'local', 'mimedb_microbes_v2.csv');
const OUTPUT_PUBLIC = path.join(REPO_ROOT, 'public', 'reference', 'mimedb.json');
const OUTPUT_AUDIT = path.join(REPO_ROOT, 'app_context', 'reference', 'mimedb.json');

// Target metabolites relevant to the D→X→M→Y model
const TARGET_METABOLITE_NAMES = [
  'acetic acid',       // acetate proxy
  'propionic acid',    // propionate proxy
  'butyric acid',      // butyrate proxy
  'l-tryptophan',      // tryptophan
  'indole',            // indole
  'indole-3-propionic acid', // IPA
  'gamma-aminobutyric acid', // GABA
  'serotonin',         // serotonin
  '5-hydroxytryptophan',     // 5-HTP
];

// Gut microbe genera of interest for the CogniBiome model
const TARGET_GENERA = [
  'bifidobacterium',
  'lactobacillus',
  'faecalibacterium',
  'akkermansia',
  'roseburia',
  'clostridium',
  'bacteroides',
  'ruminococcus',
  'limosilactobacillus',
  'ligilactobacillus',
];

function sha256File(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function sha256String(text: string): string {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function ensureDir(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

/**
 * Minimal RFC-4180 CSV parser (handles quoted fields).
 */
function parseCSVRows(text: string): Record<string, string>[] {
  const lines = text.split('\n');
  if (lines.length < 2) return [];

  // Parse headers (may be quoted)
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

function main(): void {
  // Check if local files exist
  if (!fs.existsSync(METABOLITES_CSV) || !fs.existsSync(MICROBES_CSV)) {
    console.warn('[build-mimedb] local/ CSV files not found. Skipping build.');
    console.warn(`  Expected: ${METABOLITES_CSV}`);
    console.warn(`  Expected: ${MICROBES_CSV}`);
    console.warn('[build-mimedb] Bundle-extracted stub mimedb.json will be used instead.');
    process.exit(0);
  }

  console.log('[build-mimedb] Reading CSV files…');
  const metabText = fs.readFileSync(METABOLITES_CSV, 'utf8');
  const microbesText = fs.readFileSync(MICROBES_CSV, 'utf8');

  const sha256Metabolites = sha256File(METABOLITES_CSV);
  const sha256Microbes = sha256File(MICROBES_CSV);

  console.log('[build-mimedb] Parsing metabolites CSV…');
  const metabRows = parseCSVRows(metabText);
  console.log(`  Found ${metabRows.length} metabolite rows.`);

  console.log('[build-mimedb] Parsing microbes CSV…');
  const microbeRows = parseCSVRows(microbesText);
  console.log(`  Found ${microbeRows.length} microbe rows.`);

  // Detect key columns from headers
  const metabHeaders = Object.keys(metabRows[0] ?? {});
  const microbeHeaders = Object.keys(microbeRows[0] ?? {});

  console.log(`[build-mimedb] Metabolite columns: ${metabHeaders.slice(0, 8).join(', ')}…`);
  console.log(`[build-mimedb] Microbe columns: ${microbeHeaders.slice(0, 8).join(', ')}…`);

  // Filter target metabolites
  const targetMetabolites = metabRows
    .filter(row => {
      const name = (row['name'] ?? '').toLowerCase();
      return TARGET_METABOLITE_NAMES.some(t => t === name);
    })
    .map(row => ({
      id: row['id'] ?? null,
      mime_id: row['mime_id'] ?? null,
      name: row['name'] ?? null,
      hmdb_id: row['hmdb_id'] ?? null,
      cas: row['cas'] ?? null,
      formula: row['moldb_formula'] ?? null,
      average_mass: row['moldb_average_mass'] ? parseFloat(row['moldb_average_mass']) : null,
      microbe_relation_count: row['microbe_relations'] ? parseInt(row['microbe_relations']) : null,
      app_role: resolveAppRole(row['name'] ?? ''),
    }));

  console.log(`[build-mimedb] Matched ${targetMetabolites.length} target metabolites.`);

  // Filter target microbe genera
  const targetMicrobes = microbeRows
    .filter(row => {
      const genus = (row['genus'] ?? '').toLowerCase();
      return TARGET_GENERA.some(g => genus.startsWith(g));
    })
    .reduce<typeof microbeRows>((acc, row) => {
      // Deduplicate by species
      const species = row['species'] ?? '';
      if (!acc.some(r => r['species'] === species)) acc.push(row);
      return acc;
    }, [])
    .slice(0, 100) // Cap at 100 for snapshot size
    .map(row => ({
      id: row['id'] ?? null,
      microbe_id: row['microbe_id'] ?? null,
      name: row['name'] ?? null,
      species: row['species'] ?? null,
      genus: row['genus'] ?? null,
      phylum: row['phylum'] ?? null,
      gram: row['gram'] ?? null,
      activity: (row['activity'] && row['activity'] !== 'NULL') ? row['activity'] : null,
      health_type: (row['health_type'] && row['health_type'] !== 'NULL') ? row['health_type'] : null,
    }));

  console.log(`[build-mimedb] Matched ${targetMicrobes.length} target microbe entries.`);

  // Microbe↔metabolite associations NOT derivable from official MiMeDB CSV exports.
  //
  // The MiMeDB v2 CSV exports used here (mimedb_metabolites_v2.csv, mimedb_microbes_v2.csv)
  // contain no join/association table. The `microbe_relations` column in the metabolites CSV
  // is a COUNT only — it does not list microbe IDs or genera.
  //
  // These associations are therefore CANNOT BE CONFIRMED from the official MiMeDB source files
  // we parsed. Each entry carries:
  //   source_in_mimedb_csv: false   — not derivable from the files above
  //   evidence_note: "cannot confirm from parsed MiMeDB CSV — see citation"
  //   literature_context: a brief description for educational context (NOT a factual claim
  //                       attributable to MiMeDB; see cited publications in REFERENCES_AND_LICENSES.md)
  //
  // Per project guardrails: do not present these as MiMeDB-confirmed edges. Any UI that
  // displays this section must label it clearly as "not confirmed from official source files".
  const unconfirmedLiteratureLinks = [
    {
      metabolite_name: 'Butyric acid',
      metabolite_mime_id: 'MMDBc0000010',
      microbe_genera: ['Faecalibacterium', 'Roseburia', 'Clostridium'],
      source_in_mimedb_csv: false,
      evidence_note: 'cannot confirm from parsed MiMeDB CSV — see citation',
      literature_context: 'SCFAs produced by Firmicutes via fiber fermentation (see REFERENCES_AND_LICENSES.md).',
    },
    {
      metabolite_name: 'Acetic acid',
      metabolite_mime_id: 'MMDBc0000011',
      microbe_genera: ['Bifidobacterium', 'Lactobacillus', 'Akkermansia'],
      source_in_mimedb_csv: false,
      evidence_note: 'cannot confirm from parsed MiMeDB CSV — see citation',
      literature_context: 'Primary SCFA produced by bifidogenic fermentation (see REFERENCES_AND_LICENSES.md).',
    },
    {
      metabolite_name: 'Propionic acid',
      metabolite_mime_id: 'MMDBc0000080',
      microbe_genera: ['Bacteroides', 'Roseburia'],
      source_in_mimedb_csv: false,
      evidence_note: 'cannot confirm from parsed MiMeDB CSV — see citation',
      literature_context: 'SCFA via propionate pathway in gut bacteria (see REFERENCES_AND_LICENSES.md).',
    },
    {
      metabolite_name: 'gamma-Aminobutyric acid',
      metabolite_mime_id: 'MMDBc0000029',
      microbe_genera: ['Lactobacillus', 'Bifidobacterium'],
      source_in_mimedb_csv: false,
      evidence_note: 'cannot confirm from parsed MiMeDB CSV — see citation',
      literature_context: 'GABA produced by certain lactic acid bacteria (see REFERENCES_AND_LICENSES.md).',
    },
    {
      metabolite_name: 'Serotonin',
      metabolite_mime_id: 'MMDBc0047905',
      microbe_genera: ['Lactobacillus', 'Bifidobacterium', 'Clostridium'],
      source_in_mimedb_csv: false,
      evidence_note: 'cannot confirm from parsed MiMeDB CSV — see citation',
      literature_context: '~90% of serotonin is in the gut; microbial influence on enterochromaffin cells (see REFERENCES_AND_LICENSES.md).',
    },
    {
      metabolite_name: 'L-Tryptophan',
      metabolite_mime_id: 'MMDBc0000170',
      microbe_genera: ['Lactobacillus', 'Clostridium', 'Ruminococcus'],
      source_in_mimedb_csv: false,
      evidence_note: 'cannot confirm from parsed MiMeDB CSV — see citation',
      literature_context: 'Tryptophan metabolized by gut bacteria to indole and serotonin (see REFERENCES_AND_LICENSES.md).',
    },
    {
      metabolite_name: 'Indole-3-propionic acid',
      metabolite_mime_id: 'MMDBc0000589',
      microbe_genera: ['Clostridium', 'Lactobacillus'],
      source_in_mimedb_csv: false,
      evidence_note: 'cannot confirm from parsed MiMeDB CSV — see citation',
      literature_context: 'IPA: neuroprotective tryptophan metabolite from gut bacteria (see REFERENCES_AND_LICENSES.md).',
    },
  ];

  const snapshot = {
    metadata: {
      source: 'MiMeDB v2 (local CSV build)',
      build_timestamp: new Date().toISOString(),
      sha256_metabolites_csv: sha256Metabolites,
      sha256_microbes_csv: sha256Microbes,
      row_count_metabolites: metabRows.length,
      row_count_microbes: microbeRows.length,
      matched_metabolites: targetMetabolites.length,
      matched_microbes: targetMicrobes.length,
      limitations: [
        'The MiMeDB v2 CSV exports do not include a microbe↔metabolite join table. The microbe_relations column is a COUNT only — it does not list microbe IDs or genera.',
        'All entries in microbe_metabolite_links have source_in_mimedb_csv: false. They cannot be confirmed from the parsed MiMeDB files. They are retained as educational context only with explicit "cannot confirm" labels.',
        'activity field is often NULL in this dataset; health_type may be more informative.',
        'This snapshot covers only metabolites relevant to the D→X→M→Y CogniBiome model.',
        'For the full MiMeDB dataset, see: https://mimedb.org (not accessed at runtime; offline-only).',
      ],
      license: 'MiMeDB data is for non-commercial, reference-only use. See /reference/REFERENCES_AND_LICENSES.md.',
    },
    metabolites: targetMetabolites,
    microbes: targetMicrobes,
    microbe_metabolite_links: unconfirmedLiteratureLinks,
  };

  const outputJson = JSON.stringify(snapshot, null, 2);
  const outputSha256 = sha256String(outputJson);
  console.log(`[build-mimedb] Output SHA-256: ${outputSha256}`);

  ensureDir(OUTPUT_PUBLIC);
  ensureDir(OUTPUT_AUDIT);
  fs.writeFileSync(OUTPUT_PUBLIC, outputJson, 'utf8');
  fs.writeFileSync(OUTPUT_AUDIT, outputJson, 'utf8');

  console.log(`[build-mimedb] Written to:`);
  console.log(`  ${OUTPUT_PUBLIC}`);
  console.log(`  ${OUTPUT_AUDIT}`);
  console.log('[build-mimedb] Done.');
}

function resolveAppRole(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('acetic')) return 'acetate_proxy';
  if (lower.includes('propionic')) return 'propionate_proxy';
  if (lower.includes('butyric')) return 'butyrate_proxy';
  if (lower.includes('aminobutyric')) return 'gaba';
  if (lower.includes('serotonin')) return 'serotonin_5ht';
  if (lower.includes('tryptophan') && !lower.includes('indole')) return 'tryptophan';
  if (lower.includes('hydroxytryptophan')) return '5_htp';
  if (lower.includes('indole-3-propionic')) return 'ipa';
  if (lower.includes('indole')) return 'indole';
  return 'other';
}

main();
