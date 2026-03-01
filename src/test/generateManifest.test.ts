import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import * as crypto from 'node:crypto';
import { generateManifest, sha256Hex } from '../../scripts/generate-upload-files-manifest';

function sha256OfString(s: string): string {
  return crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex');
}

describe('generate-upload-files-manifest', () => {
  let tmpDir: string;
  let outputFile: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-test-'));
    outputFile = path.join(tmpDir, 'MANIFEST.md');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('lists two files with correct sha256', () => {
    const contentA = 'hello world\n';
    const contentB = '{"key": "value"}\n';

    fs.writeFileSync(path.join(tmpDir, 'alpha.txt'), contentA, 'utf8');
    fs.writeFileSync(path.join(tmpDir, 'beta.json'), contentB, 'utf8');

    const entries = generateManifest(tmpDir, outputFile);

    const nonSelf = entries.filter(e => e.sha256 !== '(self)');
    const alpha = nonSelf.find(e => e.relativePath === 'alpha.txt');
    const beta = nonSelf.find(e => e.relativePath === 'beta.json');

    expect(alpha).toBeDefined();
    expect(beta).toBeDefined();

    expect(alpha!.sha256).toBe(sha256OfString(contentA));
    expect(beta!.sha256).toBe(sha256OfString(contentB));
  });

  it('excludes the output manifest file from hashing (marks as self)', () => {
    fs.writeFileSync(path.join(tmpDir, 'data.txt'), 'some data', 'utf8');
    // Pre-create the output file so it gets discovered during the walk
    fs.writeFileSync(outputFile, '', 'utf8');

    const entries = generateManifest(tmpDir, outputFile);
    const selfEntry = entries.find(e => e.sha256 === '(self)');

    expect(selfEntry).toBeDefined();
    expect(selfEntry!.relativePath).toBe('MANIFEST.md');
  });

  it('entries are sorted alphabetically by path', () => {
    fs.writeFileSync(path.join(tmpDir, 'z_last.txt'), 'z', 'utf8');
    fs.writeFileSync(path.join(tmpDir, 'a_first.txt'), 'a', 'utf8');
    fs.writeFileSync(path.join(tmpDir, 'm_middle.txt'), 'm', 'utf8');

    const entries = generateManifest(tmpDir, outputFile);
    const paths = entries.map(e => e.relativePath);

    const sorted = [...paths].sort((a, b) => a.localeCompare(b));
    expect(paths).toEqual(sorted);
  });

  it('sha256Hex produces correct hash for known input', () => {
    const data = Buffer.from('abc', 'utf8');
    // SHA-256("abc") standard test vector
    const expected = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
    expect(sha256Hex(data)).toBe(expected);
  });

  it('writes a valid markdown table to the output file', () => {
    fs.writeFileSync(path.join(tmpDir, 'sample.txt'), 'content', 'utf8');

    generateManifest(tmpDir, outputFile);

    const written = fs.readFileSync(outputFile, 'utf8');
    expect(written).toContain('# Upload Files Manifest');
    expect(written).toContain('| Path | Size (bytes) | SHA256 |');
    expect(written).toContain('sample.txt');
  });
});
