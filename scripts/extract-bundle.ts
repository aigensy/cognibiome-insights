#!/usr/bin/env node
/**
 * extract-bundle.ts
 * Parses public/COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md, extracts all virtual files.
 *
 * Marker format:
 *   @@@FILE_BEGIN path="some/path.json" type="json" sha256="abc..."@@@
 *   ...content...
 *   @@@FILE_END path="some/path.json"@@@
 *
 * Writes to:
 *   app_context/<path>  — audit copy (always)
 *   public/<path>       — runtime copy (for foundation_pack/**, reference/**, pilot/**)
 *
 * Also verifies embedded SHA-256 vs actual content SHA-256.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

/**
 * Resolve the bundle path.
 * Priority:
 *   1. --bundle <path> CLI argument
 *   2. app_context/COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md
 *   3. local/incoming/COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md
 *   4. public/COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md  (last resort)
 */
function resolveBundlePath(): string | null {
  const args = process.argv.slice(2);
  const bundleArgIdx = args.indexOf('--bundle');
  if (bundleArgIdx !== -1 && args[bundleArgIdx + 1]) {
    const explicit = path.resolve(args[bundleArgIdx + 1]);
    return explicit;
  }

  const candidates = [
    path.join(REPO_ROOT, 'app_context', 'COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md'),
    path.join(REPO_ROOT, 'local', 'incoming', 'COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md'),
    path.join(REPO_ROOT, 'public', 'COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

const BUNDLE_PATH_RESOLVED = resolveBundlePath();

// Paths that also get a runtime copy under public/
const RUNTIME_PREFIXES = [
  'foundation_pack/',
  'reference/',
  'pilot/',
  'external_sources_for_Gut_overview.txt',
  'UPLOAD_FILES_MANIFEST.md',
];

function sha256Hex(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

function ensureDir(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFileContent(filePath: string, content: string): void {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
}

interface ExtractedFile {
  virtualPath: string;
  content: string;
  embeddedSha256: string | null;
  actualSha256: string;
}

/**
 * Strip markdown code fence wrapper like:
 *   ~~~json
 *   { ... }
 *   ~~~
 * Returns the inner content unchanged if no fence is detected.
 */
function stripCodeFence(content: string): string {
  const lines = content.split('\n');
  if (lines.length >= 2 && /^~~~/.test(lines[0])) {
    const lastLine = lines[lines.length - 1];
    if (lastLine === '~~~' || lastLine === '~~~\r') {
      return lines.slice(1, -1).join('\n');
    }
    // Opening fence but no closing — still strip the opening line
    return lines.slice(1).join('\n');
  }
  return content;
}

function extractVirtualFiles(bundleText: string): ExtractedFile[] {
  const files: ExtractedFile[] = [];

  // Match: @@@FILE_BEGIN path="..." [type="..."] [sha256="..."]@@@
  const beginRe = /@@@FILE_BEGIN\s+path="([^"]+)"(?:[^@]*)(?:sha256="([a-f0-9]{64})")?[^@]*@@@/g;

  let m: RegExpExecArray | null;
  while ((m = beginRe.exec(bundleText)) !== null) {
    const virtualPath = m[1];
    const embeddedSha256 = m[2] ?? null;
    const afterBeginEnd = m.index + m[0].length;

    // The content starts after the marker line (skip the newline)
    const afterNewline = bundleText[afterBeginEnd] === '\n' ? afterBeginEnd + 1 : afterBeginEnd;

    // Find the matching @@@FILE_END path="<virtualPath>"@@@
    const endMarker = `@@@FILE_END path="${virtualPath}"@@@`;
    const endIndex = bundleText.indexOf(endMarker, afterNewline);

    if (endIndex === -1) {
      console.warn(`[warn] No FILE_END found for ${virtualPath}, skipping.`);
      continue;
    }

    // Content is everything between the end of BEGIN marker and start of END marker
    let content = bundleText.slice(afterNewline, endIndex);
    // Strip single trailing newline (the one right before FILE_END)
    if (content.endsWith('\n')) content = content.slice(0, -1);

    // Strip markdown code fence wrapper (~~~TYPE ... ~~~) added by the bundle format
    content = stripCodeFence(content);

    const actualSha256 = sha256Hex(content);
    files.push({ virtualPath, content, embeddedSha256, actualSha256 });
  }

  return files;
}

function main(): void {
  // --force: overwrite existing public/ files (default: skip to avoid reverting hand-edited docs)
  const FORCE = process.argv.includes('--force');
  if (FORCE) {
    console.log('[extract-bundle] --force mode: existing /public files WILL be overwritten.');
  } else {
    console.log('[extract-bundle] Safe mode (default): existing /public files will NOT be overwritten. Pass --force to override.');
  }

  if (!BUNDLE_PATH_RESOLVED) {
    console.log('[extract-bundle] No bundle file found. Checked:');
    console.log('  app_context/COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md');
    console.log('  local/incoming/COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md');
    console.log('  public/COGNIBIOME_SINGLE_UPLOAD_BUNDLE.md');
    console.log('[extract-bundle] The repo already contains extracted runtime files — nothing to do.');
    console.log('[extract-bundle] To supply a bundle, use: npm run extract:bundle -- --bundle <path>');
    process.exit(0);
  }

  console.log(`[extract-bundle] Reading bundle: ${BUNDLE_PATH_RESOLVED}`);
  const bundleText = fs.readFileSync(BUNDLE_PATH_RESOLVED, 'utf8');

  const files = extractVirtualFiles(bundleText);
  console.log(`[extract-bundle] Found ${files.length} virtual files.`);

  if (files.length === 0) {
    console.error('[error] No virtual files found. Check bundle format.');
    process.exit(1);
  }

  let warnCount = 0;
  let writtenCount = 0;

  for (const file of files) {
    const { virtualPath, content, embeddedSha256, actualSha256 } = file;

    // Verify SHA-256 if embedded
    if (embeddedSha256 && actualSha256 !== embeddedSha256) {
      console.warn(`[warn] SHA-256 mismatch for ${virtualPath}`);
      console.warn(`  embedded: ${embeddedSha256}`);
      console.warn(`  actual:   ${actualSha256}`);
      warnCount++;
      // Still write — bundle content is authoritative source
    }

    // Always write audit copy to app_context/
    const auditPath = path.join(REPO_ROOT, 'app_context', virtualPath);
    writeFileContent(auditPath, content);
    writtenCount++;

    // Write runtime copy to public/ for applicable prefixes (skip if exists unless --force)
    const isRuntime = RUNTIME_PREFIXES.some(prefix => virtualPath.startsWith(prefix));
    if (isRuntime) {
      const publicPath = path.join(REPO_ROOT, 'public', virtualPath);
      if (!FORCE && fs.existsSync(publicPath)) {
        console.log(`  [skip-exists]   ${virtualPath}  (use --force to overwrite)`);
      } else {
        writeFileContent(publicPath, content);
        writtenCount++;
        console.log(`  [runtime+audit] ${virtualPath}`);
      }
    } else {
      console.log(`  [audit]         ${virtualPath}`);
    }
  }

  console.log(`\n[extract-bundle] Done. Wrote ${writtenCount} file copies from ${files.length} virtual files. Warnings: ${warnCount}`);

  // Verify critical runtime files
  const critical = [
    'public/foundation_pack/docs_index.json',
    'public/pilot/pilot_dataset_n66.csv',
    'public/reference/mimedb.json',
    'public/reference/usda_fdc.json',
    'public/reference/reactome.json',
    'public/reference/wikipathways.json',
  ];
  console.log('\n[extract-bundle] Critical file check:');
  for (const rel of critical) {
    const abs = path.join(REPO_ROOT, rel);
    if (fs.existsSync(abs)) {
      console.log(`  [ok]      ${rel}`);
    } else {
      console.warn(`  [missing] ${rel}`);
    }
  }
}

main();
