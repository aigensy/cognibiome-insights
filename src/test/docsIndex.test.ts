import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const INDEX_PATH = path.join(REPO_ROOT, 'public', 'foundation_pack', 'docs_index.json');

type DocItem = {
  id: string;
  title: string;
  path: string;
  category: string;
  media_type: string;
  description?: string;
};

type DocsIndex = {
  schema_version: string;
  items: DocItem[];
};

const REQUIRED_DOCS: { id: string; file: string }[] = [
  { id: 'DOC-004', file: 'public/foundation_pack/SRS/gui_spec.json' },
  { id: 'DOC-001', file: 'public/foundation_pack/user_requirements.json' },
  { id: 'DOC-019', file: 'public/docs/cognibiome_user_guide.md' },
  { id: 'DOC-020', file: 'public/reference/public_datasets_manifest.json' },
  { id: 'DOC-014', file: 'public/pilot/pilot_dataset_n66.csv' },
  { id: 'DOC-026', file: 'public/docs/presenter_guide.md' },
];

function diskPath(docPath: string): string {
  // docPath is like "/docs/cognibiome_user_guide.md" — served from /public root
  return path.join(REPO_ROOT, 'public', docPath);
}

function loadIndex(): DocsIndex {
  const raw = fs.readFileSync(INDEX_PATH, 'utf-8');
  return JSON.parse(raw) as DocsIndex;
}

describe('docs_index.json — path integrity', () => {
  it('index file exists and parses', () => {
    expect(fs.existsSync(INDEX_PATH), `index not found at ${INDEX_PATH}`).toBe(true);
    const idx = loadIndex();
    expect(idx.schema_version).toBeTruthy();
    expect(Array.isArray(idx.items)).toBe(true);
  });

  it('has at least 26 items', () => {
    const { items } = loadIndex();
    expect(items.length).toBeGreaterThanOrEqual(26);
  });

  it('every item has required fields: id, title, path, category, media_type', () => {
    const { items } = loadIndex();
    for (const item of items) {
      expect(typeof item.id, `id missing on ${JSON.stringify(item)}`).toBe('string');
      expect(item.id.length, `empty id`).toBeGreaterThan(0);
      expect(typeof item.title, `title missing on ${item.id}`).toBe('string');
      expect(item.title.length, `empty title on ${item.id}`).toBeGreaterThan(0);
      expect(typeof item.path, `path missing on ${item.id}`).toBe('string');
      expect(item.path.length, `empty path on ${item.id}`).toBeGreaterThan(0);
      expect(typeof item.category, `category missing on ${item.id}`).toBe('string');
      expect(typeof item.media_type, `media_type missing on ${item.id}`).toBe('string');
    }
  });

  it('required docs exist in index and their files exist on disk', () => {
    const { items } = loadIndex();
    const byId = new Map(items.map(i => [i.id, i]));
    for (const req of REQUIRED_DOCS) {
      expect(byId.has(req.id), `${req.id} missing from index`).toBe(true);
      const fullPath = path.join(REPO_ROOT, req.file);
      expect(fs.existsSync(fullPath), `file for ${req.id} missing: ${fullPath}`).toBe(true);
    }
  });

  it('no item path leads to a missing file', () => {
    const { items } = loadIndex();
    const missing: string[] = [];
    for (const item of items) {
      const p = diskPath(item.path);
      if (!fs.existsSync(p)) missing.push(`${item.id}: ${p}`);
    }
    expect(missing, `Missing files:\n${missing.join('\n')}`).toHaveLength(0);
  });

  it('JSON docs are valid JSON', () => {
    const { items } = loadIndex();
    const jsonItems = items.filter(i => i.media_type === 'application/json');
    expect(jsonItems.length).toBeGreaterThan(0);
    for (const item of jsonItems) {
      const p = diskPath(item.path);
      const raw = fs.readFileSync(p, 'utf-8');
      expect(() => JSON.parse(raw), `${item.id} is not valid JSON`).not.toThrow();
    }
  });

  it('CSV docs have at least a header row', () => {
    const { items } = loadIndex();
    const csvItems = items.filter(i => i.media_type === 'text/csv');
    expect(csvItems.length).toBeGreaterThan(0);
    for (const item of csvItems) {
      const p = diskPath(item.path);
      const raw = fs.readFileSync(p, 'utf-8');
      const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
      expect(lines.length, `${item.id} CSV has no rows`).toBeGreaterThan(0);
      // Header must be a non-empty comma-separated line
      expect(lines[0].includes(','), `${item.id} CSV header has no commas`).toBe(true);
    }
  });

  it('Markdown docs are non-empty strings', () => {
    const { items } = loadIndex();
    const mdItems = items.filter(i => i.media_type === 'text/markdown');
    expect(mdItems.length).toBeGreaterThan(0);
    for (const item of mdItems) {
      const p = diskPath(item.path);
      const raw = fs.readFileSync(p, 'utf-8');
      expect(raw.trim().length, `${item.id} Markdown is empty`).toBeGreaterThan(0);
    }
  });
});
