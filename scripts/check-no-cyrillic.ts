#!/usr/bin/env node
/**
 * check-no-cyrillic.ts
 * CI/test gate: fail if any file under /public/** contains Cyrillic characters.
 *
 * Scope: ALL regular files under /public/** (no exclusions).
 *
 * Exit 0 = clean. Exit 1 = Cyrillic found (CI fails).
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');

const CYRILLIC_RE = /\p{Script=Cyrillic}/u;

function collectFiles(dir: string, results: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, results);
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

function main(): void {
  const files = collectFiles(PUBLIC_DIR);
  const violations: string[] = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath).toString('utf8');
    if (CYRILLIC_RE.test(content)) {
      violations.push(path.relative(REPO_ROOT, filePath));
    }
  }

  if (violations.length === 0) {
    console.log(`[check-no-cyrillic] OK — checked ${files.length} file(s), no Cyrillic found under /public/**.`);
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
