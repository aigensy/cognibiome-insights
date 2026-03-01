#!/usr/bin/env node
/**
 * check-no-cyrillic.ts
 * CI/test gate: fail if any text asset under /public/** contains Cyrillic characters.
 *
 * Scope: text-like extensions only (.md .txt .json .html .css .js .mjs .ts .tsx .csv .svg).
 * Binary files (.png .jpg .jpeg .gif .webp .pdf .ico .woff .woff2 .ttf .zip …) are skipped
 * entirely to avoid false positives from binary content decoded as UTF-8.
 * The public/docs/screenshots/ subtree is also excluded unconditionally.
 *
 * Exit 0 = clean. Exit 1 = Cyrillic found (CI fails).
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');

const CYRILLIC_RE = /\p{Script=Cyrillic}/u;

/** Extensions that carry human-readable text and should be scanned. */
const TEXT_EXTENSIONS = new Set([
  '.md', '.txt', '.json', '.html', '.htm', '.css', '.js', '.mjs', '.cjs',
  '.ts', '.tsx', '.csv', '.svg', '.xml', '.yaml', '.yml', '.toml',
]);

/** Subtrees to skip entirely (relative to PUBLIC_DIR, using forward slashes). */
const SKIP_SUBTREES = [
  path.join(PUBLIC_DIR, 'docs', 'screenshots'),
];

function isSkippedSubtree(fullPath: string): boolean {
  return SKIP_SUBTREES.some(subtree => fullPath.startsWith(subtree + path.sep) || fullPath === subtree);
}

function isTextFile(filePath: string): boolean {
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function collectFiles(dir: string, results: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (isSkippedSubtree(fullPath)) continue;
    if (entry.isDirectory()) {
      collectFiles(fullPath, results);
    } else if (entry.isFile() && isTextFile(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

function main(): void {
  const files = collectFiles(PUBLIC_DIR);
  const violations: string[] = [];

  for (const filePath of files) {
    let content: string;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      // Unreadable as UTF-8 — skip silently (shouldn't happen for text extensions)
      continue;
    }
    if (CYRILLIC_RE.test(content)) {
      violations.push(path.relative(REPO_ROOT, filePath));
    }
  }

  if (violations.length === 0) {
    console.log(`[check-no-cyrillic] OK — checked ${files.length} text file(s), no Cyrillic found under /public/**.`);
    process.exit(0);
  } else {
    console.error(`[check-no-cyrillic] FAIL — Cyrillic characters found in ${violations.length} shipped file(s):`);
    for (const v of violations) {
      console.error(`  - ${v}`);
    }
    console.error('');
    console.error('Action required: remove or translate any Russian-language content from runtime-shipped text assets.');
    process.exit(1);
  }
}

main();
