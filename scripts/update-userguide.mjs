#!/usr/bin/env node
/**
 * Update Developer Guide screenshots
 *
 * 1. Build the app
 * 2. Run Playwright E2E tests with screenshots output to public/docs/screenshots/app/
 * 3. Verify expected PNGs exist
 * 4. Update developer_guide.md timestamp if needed
 * 5. Git commit changes (public/docs/screenshots, public/docs/developer_guide.md)
 *
 * Usage: node scripts/update-userguide.mjs
 * Env: GUIDE_COMMIT_MSG overrides default commit message
 */

import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SCREENSHOT_DIR = path.join(ROOT, 'public', 'docs', 'screenshots', 'app');
const DEVELOPER_GUIDE = path.join(ROOT, 'public', 'docs', 'developer_guide.md');

const MIN_EXPECTED_PNGS = 7;

function run(cmd, opts = {}) {
  const r = spawnSync(cmd, { shell: true, stdio: 'inherit', cwd: ROOT, ...opts });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

function preflight() {
  try {
    execSync('git rev-parse --git-dir', { cwd: ROOT, stdio: 'pipe' });
  } catch {
    console.error('Error: git is required');
    process.exit(1);
  }
  const mergeHeads = [
    path.join(ROOT, '.git', 'MERGE_HEAD'),
    path.join(ROOT, '.git', 'REBASE_HEAD'),
  ];
  for (const p of mergeHeads) {
    if (fs.existsSync(p)) {
      console.error('Error: cannot run during merge or rebase');
      process.exit(1);
    }
  }
}

function buildAndScreenshot() {
  console.log('Building...');
  run('npm run build');

  console.log('Running Playwright (screenshots -> public/docs/screenshots/app/)...');
  const env = { ...process.env, COGNIBIOME_SCREENSHOT_DIR: SCREENSHOT_DIR };
  const r = spawnSync('npx playwright test e2e/presenterMode.spec.ts', {
    shell: true,
    stdio: 'inherit',
    cwd: ROOT,
    env,
  });
  if (r.status !== 0) {
    console.error('Playwright tests failed');
    process.exit(r.status ?? 1);
  }

  const files = fs.readdirSync(SCREENSHOT_DIR, { withFileTypes: true });
  const pngs = files.filter((f) => f.isFile() && f.name.endsWith('.png'));
  if (pngs.length < MIN_EXPECTED_PNGS) {
    console.error(
      `Error: expected at least ${MIN_EXPECTED_PNGS} PNGs in ${SCREENSHOT_DIR}, found ${pngs.length}`
    );
    process.exit(1);
  }
  console.log(`Verified ${pngs.length} screenshots in ${SCREENSHOT_DIR}`);
}

function updateDeveloperGuideTimestamp() {
  const today = new Date().toISOString().slice(0, 10);
  let content = fs.readFileSync(DEVELOPER_GUIDE, 'utf8');

  const pattern = /Screenshots updated: \d{4}-\d{2}-\d{2}/;
  const replacement = `Screenshots updated: ${today}`;
  if (pattern.test(content)) {
    content = content.replace(pattern, replacement);
  } else {
    content = content.replace(
      /(\*\*Version:\*\* [^\n]+\n)/,
      `$1**Screenshots updated:** ${today}\n`
    );
  }
  fs.writeFileSync(DEVELOPER_GUIDE, content);
}

function ensureImageRefsExist() {
  const content = fs.readFileSync(DEVELOPER_GUIDE, 'utf8');
  const refs = [...content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
  const docDir = path.dirname(DEVELOPER_GUIDE);
  for (const ref of refs) {
    if (ref.startsWith('screenshots/')) {
      const fullPath = path.join(docDir, ref);
      if (!fs.existsSync(fullPath)) {
        console.warn(`Warning: image not found: ${ref}`);
      }
    }
  }
}

function gitCommit() {
  if (process.env.SKIP_GIT_COMMIT === '1') {
    console.log('Skipping git commit (SKIP_GIT_COMMIT=1).');
    return;
  }
  run('git add public/docs/screenshots public/docs/developer_guide.md', {
    stdio: 'pipe',
  });
  const status = execSync('git diff --cached --name-only', {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
  if (!status) {
    console.log('No screenshot changes to commit.');
    return;
  }
  const msg = process.env.GUIDE_COMMIT_MSG || 'docs: update developer guide screenshots';
  run(`git commit -m "${msg.replace(/"/g, '\\"')}"`);
  console.log('Committed:', status);
}

preflight();
buildAndScreenshot();
ensureImageRefsExist();
updateDeveloperGuideTimestamp();
gitCommit();
