import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PUBLIC_PATH = path.join(REPO_ROOT, 'public', 'reference', 'mimedb.json');
const AUDIT_PATH = path.join(REPO_ROOT, 'app_context', 'reference', 'mimedb.json');

function sha256File(p: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

type MimedbSnapshot = {
  metadata: {
    license?: string;
    [key: string]: unknown;
  };
  microbe_metabolite_links: Array<{
    source_in_mimedb_csv?: boolean;
    evidence_note?: string;
    literature_context?: string;
    evidence?: unknown;
    note?: unknown;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

describe('mimedb.json — public and audit copy consistency', () => {
  it('both files exist', () => {
    expect(fs.existsSync(PUBLIC_PATH)).toBe(true);
    expect(fs.existsSync(AUDIT_PATH)).toBe(true);
  });

  it('public and audit copies are byte-for-byte identical (sha256)', () => {
    const h1 = sha256File(PUBLIC_PATH);
    const h2 = sha256File(AUDIT_PATH);
    expect(h1).toBe(h2);
  });

  it('both copies parse as valid JSON with expected top-level keys', () => {
    for (const p of [PUBLIC_PATH, AUDIT_PATH]) {
      const raw = fs.readFileSync(p, 'utf-8');
      const data = JSON.parse(raw) as MimedbSnapshot;
      expect(data).toHaveProperty('metadata');
      expect(data).toHaveProperty('metabolites');
      expect(data).toHaveProperty('microbes');
      expect(data).toHaveProperty('microbe_metabolite_links');
    }
  });

  it('no link has source_in_mimedb_csv === true (provenance guardrail)', () => {
    const data = JSON.parse(fs.readFileSync(PUBLIC_PATH, 'utf-8')) as MimedbSnapshot;
    for (const link of data.microbe_metabolite_links) {
      expect(link.source_in_mimedb_csv).not.toBe(true);
    }
  });

  it('every link has evidence_note and literature_context (new schema only)', () => {
    const data = JSON.parse(fs.readFileSync(PUBLIC_PATH, 'utf-8')) as MimedbSnapshot;
    for (const link of data.microbe_metabolite_links) {
      expect(typeof link.evidence_note).toBe('string');
      expect(typeof link.literature_context).toBe('string');
    }
  });

  it('no link has legacy "evidence" or "note" fields', () => {
    const data = JSON.parse(fs.readFileSync(PUBLIC_PATH, 'utf-8')) as MimedbSnapshot;
    for (const link of data.microbe_metabolite_links) {
      expect(link).not.toHaveProperty('evidence');
      expect(link).not.toHaveProperty('note');
    }
  });

  it('license field does not contain unsubstantiated BY-NC claim', () => {
    const data = JSON.parse(fs.readFileSync(PUBLIC_PATH, 'utf-8')) as MimedbSnapshot;
    const license = (data.metadata.license ?? '').toLowerCase();
    expect(license).not.toContain('by-nc');
    expect(license).not.toContain('cc by');
  });
});
