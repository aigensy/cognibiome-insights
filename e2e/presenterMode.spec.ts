/**
 * CogniBiome — Playwright E2E screen-contract tests + per-section screenshot capture
 *
 * What these tests do:
 *   1. Navigate directly to each target route.
 *   2. Enable Presenter Mode by clicking the TopBar toggle button (aria-label="Presenter mode").
 *   3. Assert that key judge-critical strings are present in the DOM.
 *   4. Take targeted per-section screenshots saved to e2e/screenshots/.
 *
 * NOTE: These tests require `npm run build` to have been run first.
 *       The CI workflow handles this before running Playwright.
 *
 * IMPORTANT: Presenter Mode is React context state — it resets on every full page load
 * (i.e. every page.goto()). Therefore, presenter mode is activated on each test's own
 * page rather than navigating away from a pre-activated root.
 */

import { test, expect, Page, Locator } from '@playwright/test';
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
 * The button has aria-label="Presenter mode" and its visible text changes
 * from "Presenter" to "Presenter ON" when active.
 */
async function activatePresenterMode(page: Page) {
  const toggleBtn = page.getByRole('button', { name: 'Presenter mode' });
  await toggleBtn.waitFor({ state: 'visible', timeout: 8_000 });
  await toggleBtn.click();
  await expect(page.getByRole('button', { name: 'Presenter mode' }))
    .toContainText('Presenter ON', { timeout: 5_000 });
}

/** Take a full-page screenshot. */
async function screenshotFull(page: Page, name: string) {
  ensureScreenshotDir();
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${name}.png`),
    fullPage: true,
  });
}

/**
 * Take a screenshot of a specific locator.
 * Falls back to a viewport screenshot (not full-page) on error to avoid
 * "browser closed" crashes that happen with full-page on timing edge cases.
 */
async function screenshotLocator(locator: Locator, name: string, page: Page) {
  ensureScreenshotDir();
  try {
    await locator.waitFor({ state: 'visible', timeout: 3_000 });
    await locator.screenshot({ path: path.join(SCREENSHOT_DIR, `${name}.png`) });
  } catch {
    try {
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${name}.png`), fullPage: false });
    } catch {
      // ignore — screenshot is best-effort, don't fail the test
    }
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Presenter Mode — screen contracts (E2E)', () => {

  // -------------------------------------------------------------------------
  // Dashboard
  // -------------------------------------------------------------------------
  test('Dashboard (/) — Demo Sequence card visible in presenter mode', async ({ page }) => {
    await page.goto('/');
    await activatePresenterMode(page);

    await expect(page.getByText(/Demo Sequence — Judge Path/i)).toBeVisible({ timeout: 10_000 });
    // Use .first() to avoid strict-mode violation when text appears in sidebar footer too
    await expect(page.getByText(/NOT medical advice/i).first()).toBeVisible();

    await screenshotFull(page, '01_Dashboard_Overview');

    const headerArea = page.locator('h1', { hasText: 'CogniBiome Dashboard' });
    await screenshotLocator(headerArea.locator('..').locator('..'), '01_Dashboard_Header', page);

    const judgeCard = page.getByText(/Demo Sequence — Judge Path/i).locator('../..');
    await screenshotLocator(judgeCard, '01_Dashboard_JudgePath', page);

    const tilesGrid = page.locator('.grid.gap-4').first();
    await screenshotLocator(tilesGrid, '01_Dashboard_Tiles', page);

    const disclaimerCard = page.getByText(/NOT medical advice/i).first().locator('../..');
    await screenshotLocator(disclaimerCard, '01_Dashboard_Disclaimer', page);
  });

  // -------------------------------------------------------------------------
  // Pilot Results
  // -------------------------------------------------------------------------
  test('PilotResults (/pilot) — REAL DATA badge visible', async ({ page }) => {
    // Activate presenter mode on the pilot page directly
    await page.goto('/pilot');
    await activatePresenterMode(page);

    await expect(page.getByText(/REAL DATA/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/p-value \(approx\)/i).first()).toBeVisible();
    await expect(page.getByText(/Pearson r/i)).toBeVisible();

    await screenshotFull(page, '02_Pilot_Overview');

    const badgeArea = page.getByText(/REAL DATA/i).locator('../..');
    await screenshotLocator(badgeArea, '02_Pilot_DataBadge', page);

    const metadataCard = page.getByText('Dataset Metadata').locator('../../..');
    await screenshotLocator(metadataCard, '02_Pilot_MetadataCard', page);

    const statsCard = page.getByText('Summary Statistics').locator('../../..');
    await screenshotLocator(statsCard, '02_Pilot_SummaryStats', page);

    const corrCard = page.getByText(/Correlations \(Diet Score vs Cognitive Metrics\)/i).locator('../../..');
    await screenshotLocator(corrCard, '02_Pilot_Correlations', page);

    const scatterGrid = page.locator('.grid.gap-4.md\\:grid-cols-2').first();
    await screenshotLocator(scatterGrid, '02_Pilot_ScatterPlots', page);
  });

  // -------------------------------------------------------------------------
  // Simulator
  // -------------------------------------------------------------------------
  test('Simulator (/simulator) — MODELED PROXY badge after run', async ({ page }) => {
    // Activate presenter mode on the simulator page directly
    await page.goto('/simulator');
    await activatePresenterMode(page);

    // Screenshot controls before running
    await screenshotFull(page, '03_Simulator_Controls');

    // Screenshot the Diet Inputs card (identified by card title text)
    const controlsCard = page.getByText(/Diet Inputs \(D\)/i).locator('../../..');
    await screenshotLocator(controlsCard, '03_Simulator_Sliders', page);

    // Run the simulation
    await page.getByRole('button', { name: /Run Simulation/i }).click();

    // Wait for results — use exact text to avoid strict-mode violation
    await expect(page.getByText(/MODELED PROXY/i).first()).toBeVisible({ timeout: 15_000 });
    // Use exact: true to pick the card header "Run Hash" not the toast "Run hash: …"
    await expect(page.getByText('Run Hash', { exact: true })).toBeVisible({ timeout: 5_000 });

    await screenshotFull(page, '03_Simulator_Results');

    const proxyBadge = page.getByText(/MODELED PROXY/i).first().locator('../..');
    await screenshotLocator(proxyBadge, '03_Simulator_ProxyBadge', page);

    const runHashCard = page.getByText('Run Hash', { exact: true }).locator('../../..');
    await screenshotLocator(runHashCard, '03_Simulator_RunHash', page);
  });

  // -------------------------------------------------------------------------
  // Methods & Rigor
  // -------------------------------------------------------------------------
  test('Methods (/methods) — Presenter cue and license badge visible', async ({ page }) => {
    // Activate presenter mode on the methods page directly
    await page.goto('/methods');
    await activatePresenterMode(page);

    await expect(page.getByText(/License not confirmed/i)).toBeVisible({ timeout: 10_000 });
    // "Presenter cue" is badge text visible only when presenterMode is active
    await expect(page.getByText('Presenter cue', { exact: true })).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText(/UNPAIRED/i).first()).toBeVisible();

    await screenshotFull(page, '04_Methods_Overview');

    const presenterCueBadge = page.getByText('Presenter cue', { exact: true });
    await screenshotLocator(presenterCueBadge.locator('../../../..'), '04_Methods_PresenterCue', page);

    const leakageCard = page.getByText(/Leakage Guardrails/i).locator('../../..');
    await screenshotLocator(leakageCard, '04_Methods_LeakageGuardrails', page);

    const dataSourcesCard = page.getByText('Data Sources (Paired vs Unpaired)', { exact: true }).locator('../../..');
    await screenshotLocator(dataSourcesCard, '04_Methods_DataSources', page);

    const mimedbCard = page.getByText(/MiMeDB Evidence/i).locator('../../..').first();
    await screenshotLocator(mimedbCard, '04_Methods_MiMeDB', page);
  });

  // -------------------------------------------------------------------------
  // Compare Scenarios
  // -------------------------------------------------------------------------
  test('Compare (/compare) — modeled proxies text visible', async ({ page }) => {
    // First run a simulation (activate presenter mode then run)
    await page.goto('/simulator');
    await activatePresenterMode(page);
    await page.getByRole('button', { name: /Run Simulation/i }).click();
    // Use exact text to avoid strict-mode with toast "Run hash: …"
    await expect(page.getByText('Run Hash', { exact: true })).toBeVisible({ timeout: 15_000 });

    // Navigate within the SPA (client-side, preserves React state)
    await page.getByRole('link', { name: /Compare/i }).click();
    await expect(page.getByText(/modeled proxies/i).first()).toBeVisible({ timeout: 10_000 });

    await screenshotFull(page, '05_Compare_Overview');

    const selectorArea = page.locator('[role="combobox"]').first().locator('../..');
    await screenshotLocator(selectorArea, '05_Compare_Selectors', page);

    const compareTable = page.locator('table').first();
    await screenshotLocator(compareTable, '05_Compare_Table', page);
  });

  // -------------------------------------------------------------------------
  // Export Report
  // -------------------------------------------------------------------------
  test('ExportReport (/export) — Download HTML button visible', async ({ page }) => {
    // Run a simulation first (activate presenter mode then run)
    await page.goto('/simulator');
    await activatePresenterMode(page);
    await page.getByRole('button', { name: /Run Simulation/i }).click();
    await expect(page.getByText('Run Hash', { exact: true })).toBeVisible({ timeout: 15_000 });

    // Navigate within the SPA (client-side, preserves React state)
    await page.getByRole('link', { name: /Export/i }).click();
    await expect(page.getByText(/Download HTML/i)).toBeVisible({ timeout: 10_000 });

    await screenshotFull(page, '06_Export_Overview');

    const selectorCard = page.getByText(/Select Run/i).locator('../../..').first();
    await screenshotLocator(selectorCard, '06_Export_RunSelector', page);

    const downloadBtn = page.getByText(/Download HTML/i).locator('../..');
    await screenshotLocator(downloadBtn, '06_Export_DownloadControls', page);
  });

  // -------------------------------------------------------------------------
  // Help / Docs
  // -------------------------------------------------------------------------
  test('HelpDocs (/help?doc=DOC-026) — Presenter Guide rendered', async ({ page }) => {
    // Activate presenter mode on the help page directly
    await page.goto('/help?doc=DOC-026');
    await activatePresenterMode(page);

    await expect(page.getByText(/Presenter Guide \(Presenter Mode\)/i).first()).toBeVisible({ timeout: 15_000 });
    // Use .first() to avoid strict-mode when the text appears in both the doc body and a list item
    await expect(page.getByText(/educational hypothesis generator/i).first()).toBeVisible();

    await screenshotFull(page, '07_Help_PresenterGuide');

    const sidebar = page.locator('[data-slot="sidebar"]').first();
    await screenshotLocator(sidebar, '07_Help_Sidebar', page);

    const mainContent = page.getByTestId('markdown-view');
    await screenshotLocator(mainContent, '07_Help_DocContent', page);
  });
});
