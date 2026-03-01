/**
 * CogniBiome — Playwright E2E screen-contract tests (CI / headless)
 *
 * What these tests do:
 *   1. Enable Presenter Mode by clicking the TopBar toggle button (aria-label="Presenter mode").
 *   2. Assert that the button reflects the ON state (visible text "Presenter ON").
 *   3. Navigate to each judge-critical route.
 *   4. Assert that key judge-critical strings are present in the DOM.
 *   5. Take a full-page screenshot saved to e2e/screenshots/.
 *
 * NOTE: These tests require `npm run build` to have been run first.
 *       The CI workflow handles this before running Playwright.
 *
 * Presenter Mode is React state managed by AppContext (not localStorage).
 * Activation is done by clicking the TopBar button, which is the same action
 * a real presenter would take — reliable, no internal state hacks needed.
 */

import { test, expect, Page } from '@playwright/test';
import path, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots');

function ensureScreenshotDir() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
}

/**
 * Click the Presenter Mode toggle button and assert it switched ON.
 *
 * The button has aria-label="Presenter mode" (stable selector) and its
 * visible text changes from "Presenter" to "Presenter ON" when active.
 */
async function activatePresenterMode(page: Page) {
  const toggleBtn = page.getByRole('button', { name: 'Presenter mode' });
  await toggleBtn.waitFor({ state: 'visible', timeout: 5_000 });
  await toggleBtn.click();

  // Assert the button now shows "Presenter ON" — confirming state is active
  await expect(page.getByRole('button', { name: 'Presenter mode' }))
    .toContainText('Presenter ON', { timeout: 3_000 });
}

async function screenshot(page: Page, name: string) {
  ensureScreenshotDir();
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${name}.png`),
    fullPage: true,
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Presenter Mode — screen contracts (E2E)', () => {

  test('Dashboard (/) — Demo Sequence card visible in presenter mode', async ({ page }) => {
    await page.goto('/');
    await activatePresenterMode(page);

    await expect(page.getByText(/Demo Sequence — Judge Path/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/NOT medical advice/i)).toBeVisible();

    await screenshot(page, '01-dashboard-presenter');
  });

  test('PilotResults (/pilot) — REAL DATA badge visible', async ({ page }) => {
    await page.goto('/');
    await activatePresenterMode(page);
    await page.goto('/pilot');

    // Wait for pilot data to load
    await expect(page.getByText(/REAL DATA/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/p-value \(approx\)/i)).toBeVisible();
    await expect(page.getByText(/Pearson r/i)).toBeVisible();

    await screenshot(page, '02-pilot-presenter');
  });

  test('Simulator (/simulator) — MODELED PROXY badge after run', async ({ page }) => {
    await page.goto('/');
    await activatePresenterMode(page);
    await page.goto('/simulator');

    // Click Run Simulation
    await page.getByRole('button', { name: /Run Simulation/i }).click();

    // Wait for results to render
    await expect(page.getByText(/MODELED PROXY/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Run Hash/i)).toBeVisible();

    await screenshot(page, '03-simulator-presenter');
  });

  test('Methods (/methods) — Presenter cue and license badge visible', async ({ page }) => {
    await page.goto('/');
    await activatePresenterMode(page);
    await page.goto('/methods');

    await expect(page.getByText(/License not confirmed/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Presenter cue/i)).toBeVisible();
    await expect(page.getByText(/UNPAIRED/i).first()).toBeVisible();

    await screenshot(page, '04-methods-presenter');
  });

  test('Compare (/compare) — modeled proxies text visible', async ({ page }) => {
    // Run a simulation first so Compare has saved run data
    await page.goto('/');
    await activatePresenterMode(page);
    await page.goto('/simulator');
    await page.getByRole('button', { name: /Run Simulation/i }).click();
    await expect(page.getByText(/Run Hash/i)).toBeVisible({ timeout: 15_000 });

    await page.goto('/compare');
    await expect(page.getByText(/modeled proxies/i).first()).toBeVisible({ timeout: 10_000 });

    await screenshot(page, '05-compare-presenter');
  });

  test('ExportReport (/export) — Download HTML button visible', async ({ page }) => {
    // Run a simulation first so Export has a run to select
    await page.goto('/');
    await activatePresenterMode(page);
    await page.goto('/simulator');
    await page.getByRole('button', { name: /Run Simulation/i }).click();
    await expect(page.getByText(/Run Hash/i)).toBeVisible({ timeout: 15_000 });

    await page.goto('/export');
    await expect(page.getByText(/Download HTML/i)).toBeVisible({ timeout: 10_000 });

    await screenshot(page, '06-export-presenter');
  });

  test('HelpDocs (/help?doc=DOC-026) — Presenter Guide rendered', async ({ page }) => {
    await page.goto('/');
    await activatePresenterMode(page);
    await page.goto('/help?doc=DOC-026');

    await expect(page.getByText(/Presenter Guide \(Presenter Mode\)/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/educational hypothesis generator/i)).toBeVisible();

    await screenshot(page, '07-helpdocs-presenter-guide');
  });
});
