#!/usr/bin/env node
/**
 * generate-upload-files-manifest.ts
 * Walks a target directory, hashes every regular file, and writes a
 * deterministic markdown table sorted by relative path.
 *
 * Usage:
 *   tsx scripts/generate-upload-files-manifest.ts <targetDir> <outputFile>
 *
 * Examples:
 *   tsx scripts/generate-upload-files-manifest.ts public public/UPLOAD_FILES_MANIFEST.md
 *   tsx scripts/generate-upload-files-manifest.ts app_context app_context/UPLOAD_FILES_MANIFEST.md
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

export interface ManifestEntry {
  relativePath: string;
  sizeBytes: number;
  sha256: string;
}

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

export function sha256Hex(data: Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function collectFiles(dir: string, results: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, results);
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

export function generateManifest(
  targetDir: string,
  outputFile: string,
): ManifestEntry[] {
  const absTarget = path.resolve(targetDir);
  const absOutput = path.resolve(outputFile);

  if (!fs.existsSync(absTarget)) {
    console.error(`[generate-manifest] Error: target directory not found: ${absTarget}`);
    process.exit(1);
  }

  const allFiles = collectFiles(absTarget).sort();
  const entries: ManifestEntry[] = [];

  for (const filePath of allFiles) {
    if (path.resolve(filePath) === absOutput) {
      entries.push({
        relativePath: path.relative(absTarget, filePath),
        sizeBytes: 0,
        sha256: '(self)',
      });
      continue;
    }

    const data = fs.readFileSync(filePath);
    const relativePath = path.relative(absTarget, filePath);
    const sizeBytes = data.length;
    const sha256 = sha256Hex(data);

    entries.push({ relativePath, sizeBytes, sha256 });
  }

  entries.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  const rows = entries
    .map(e => `| ${e.relativePath} | ${e.sizeBytes === 0 && e.sha256 === '(self)' ? '(self)' : e.sizeBytes} | ${e.sha256} |`)
    .join('\n');

  const markdown = [
    '# Upload Files Manifest (auto-generated)',
    '',
    `Generated: ${now}`,
    '',
    '| Path | Size (bytes) | SHA256 |',
    '|---|---:|---|',
    rows,
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(absOutput), { recursive: true });
  fs.writeFileSync(absOutput, markdown, 'utf8');

  console.log(`[generate-manifest] Wrote ${entries.length} entries to ${path.relative(REPO_ROOT, absOutput)}`);
  return entries;
}

// CLI entry point
if (process.argv[1] && path.resolve(process.argv[1]).endsWith('generate-upload-files-manifest.ts')) {
  const [, , targetDirArg, outputFileArg] = process.argv;
  if (!targetDirArg || !outputFileArg) {
    console.error('Usage: tsx scripts/generate-upload-files-manifest.ts <targetDir> <outputFile>');
    process.exit(1);
  }
  generateManifest(targetDirArg, outputFileArg);
}
