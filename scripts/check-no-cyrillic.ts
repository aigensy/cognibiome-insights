#!/usr/bin/env node
/**
 * check-no-cyrillic.ts
 * CI gate: fail if any runtime-shipped document under /public/ contains Cyrillic characters.
 *
 * Scope: /public/foundation_pack/**, /public/reference/**, /public/pilot/**,
 *        and any other .json/.csv/.txt/.md files at the root of /public/
 *        EXCEPT the large build-time artifact COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md
 *        (which is an intermediate input to extract:bundle, not a runtime doc).
 *
 * Exit 0 = clean. Exit 1 = Cyrillic found (CI fails).
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');

// Files/directories to exclude from the check (build artifacts, not runtime docs)
const EXCLUDED_FILES = new Set([
  path.join(PUBLIC_DIR, 'COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md'),
]);

const CYRILLIC_RE = /\p{Script=Cyrillic}/u;

const CHECKED_EXTENSIONS = new Set(['.json', '.csv', '.txt', '.md', '.html']);

function collectFiles(dir: string, results: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, results);
    } else if (entry.isFile() && CHECKED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      if (!EXCLUDED_FILES.has(fullPath)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function main(): void {
  const files = collectFiles(PUBLIC_DIR);
  const violations: string[] = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (CYRILLIC_RE.test(content)) {
      violations.push(path.relative(REPO_ROOT, filePath));
    }
  }

  if (violations.length === 0) {
    console.log(`[check-no-cyrillic] OK — checked ${files.length} file(s), no Cyrillic found in runtime docs.`);
    process.exit(0);
  } else {
    console.error(`[check-no-cyrillic] FAIL — Cyrillic characters found in ${violations.length} shipped file(s):`);
    for (const v of violations) {
      console.error(`  - ${v}`);
    }
    console.error('');
    console.error('Action required: remove or translate any Russian-language content from runtime-shipped docs.');
    process.exit(1);
  }
}

main();
