import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

type ManifestEntry = {
  dataset: string;
  file: string;
  included: boolean;
  row_count?: number;
  sha256?: string;
  provenance?: { source_url?: string; notes?: string };
};

function sha256File(p: string): string {
  const buf = fs.readFileSync(p);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function countCsvDataRows(text: string): number {
  // Simple CSV: count non-empty lines minus header.
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return 0;
  return lines.length - 1;
}

describe('public_datasets_manifest.json', () => {
  it('bundled entries point to existing files with matching sha256 and row_count', () => {
    const repoRoot = path.resolve(__dirname, '..', '..');
    const manifestPath = path.join(repoRoot, 'public', 'reference', 'public_datasets_manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as ManifestEntry[];
    expect(Array.isArray(manifest)).toBe(true);
    expect(manifest.length).toBeGreaterThanOrEqual(5);

    for (const entry of manifest) {
      expect(typeof entry.dataset).toBe('string');
      expect(typeof entry.included).toBe('boolean');
      expect(typeof entry.file).toBe('string');
      expect(entry.provenance?.source_url).toBeTruthy();

      if (!entry.included) continue;
      expect(entry.file).not.toBe('N/A');

      // Manifest 'file' is served from /public root, so on disk it lives under ./public/<file>
      const diskPath = path.join(repoRoot, 'public', entry.file);
      expect(fs.existsSync(diskPath)).toBe(true);

      const sha = sha256File(diskPath);
      expect(entry.sha256).toBeTruthy();
      expect(sha).toBe(entry.sha256);

      if (entry.file.endsWith('.json')) {
        const parsed = JSON.parse(fs.readFileSync(diskPath, 'utf-8')) as { records?: unknown[] };
        expect(Array.isArray(parsed.records)).toBe(true);
        if (typeof entry.row_count === 'number') {
          expect(parsed.records!.length).toBe(entry.row_count);
        }
      } else if (entry.file.endsWith('.csv')) {
        const txt = fs.readFileSync(diskPath, 'utf-8');
        const rows = countCsvDataRows(txt);
        if (typeof entry.row_count === 'number') {
          expect(rows).toBe(entry.row_count);
        }
      }
    }
  });
});
