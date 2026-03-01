/**
 * Regression test: every manifest entry with included:true must have a
 * corresponding entry in docs_index.json, and its file must exist on disk.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(__dirname, '..', '..');

type ManifestEntry = {
  dataset: string;
  file: string;
  included: boolean;
};

type DocItem = {
  id: string;
  path: string;
};

type DocsIndex = {
  items: DocItem[];
};

describe('docs_index ↔ public_datasets_manifest cross-check', () => {
  it('every included manifest entry has a matching docs_index item and file on disk', () => {
    const manifestPath = path.join(REPO_ROOT, 'public', 'reference', 'public_datasets_manifest.json');
    const indexPath = path.join(REPO_ROOT, 'public', 'foundation_pack', 'docs_index.json');

    expect(fs.existsSync(manifestPath), `manifest missing: ${manifestPath}`).toBe(true);
    expect(fs.existsSync(indexPath), `docs_index missing: ${indexPath}`).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as ManifestEntry[];
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as DocsIndex;

    expect(Array.isArray(manifest)).toBe(true);
    expect(Array.isArray(index.items)).toBe(true);

    // Build a set of all paths in docs_index (normalised to leading slash)
    const indexPaths = new Set(index.items.map(i => i.path));

    const missing: string[] = [];
    const missingFiles: string[] = [];

    for (const entry of manifest) {
      if (!entry.included || entry.file === 'N/A') continue;

      // The path in docs_index uses a leading slash, e.g. "/reference/foo.json"
      const expectedPath = `/${entry.file}`;
      if (!indexPaths.has(expectedPath)) {
        missing.push(`${entry.dataset}: "${expectedPath}" not in docs_index`);
      }

      // The file must exist on disk under public/
      const diskPath = path.join(REPO_ROOT, 'public', entry.file);
      if (!fs.existsSync(diskPath)) {
        missingFiles.push(`${entry.dataset}: ${diskPath}`);
      }
    }

    expect(missing, `Manifest entries missing from docs_index:\n${missing.join('\n')}`).toHaveLength(0);
    expect(missingFiles, `Manifest files missing on disk:\n${missingFiles.join('\n')}`).toHaveLength(0);
  });

  it('app_context docs_index is byte-for-byte identical to public docs_index', () => {
    const pub = path.join(REPO_ROOT, 'public', 'foundation_pack', 'docs_index.json');
    const ctx = path.join(REPO_ROOT, 'app_context', 'foundation_pack', 'docs_index.json');
    expect(fs.existsSync(pub)).toBe(true);
    expect(fs.existsSync(ctx)).toBe(true);
    expect(fs.readFileSync(pub, 'utf-8')).toEqual(fs.readFileSync(ctx, 'utf-8'));
  });
});
