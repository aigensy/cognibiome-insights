/**
 * CogniBiome — Playwright E2E screen-contract tests (CI / headless)
 *
 * What these tests do:
 *   1. Enable Presenter Mode via localStorage before each page load.
 *   2. Navigate to each judge-critical route.
 *   3. Assert that the key strings required by TASK A are present in the DOM.
 *   4. Take a full-page screenshot, saved to e2e/screenshots/.
 *
 * Presenter Mode is activated by setting localStorage.presenterMode = "true"
 * before navigation. The app's AppContext reads this key on init via useState
 * with a localStorage initializer — or we use a storage state that survives
 * across page loads within one browser context.
 *
 * NOTE: These tests require `npm run build` to have been run first.
 *       The CI workflow handles this before running Playwright.
 */

import { test, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SCREENSHOT_DIR = path.resolve(__dirname, 'screenshots');

function ensureScreenshotDir() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
}

/**
 * Enable presenter mode via localStorage, then navigate to the given path.
 * The app reads presenterMode from localStorage on initial render (via
 * the AppProvider which uses useState initializer from localStorage).
 *
 * If the app doesn't persist presenterMode to localStorage on its own we
 * inject it directly before navigation so the SPA picks it up on mount.
 */
async function gotoWithPresenterMode(page: Page, route: string) {
  // Open a blank page first so we can set localStorage before SPA boot
  await page.goto('about:blank');
  await page.evaluate(() => {
    // The app may not use localStorage for presenterMode — we inject a flag
    // that AppContext can pick up if it is wired to do so, or alternatively
    // we rely on the URL query param ?presenterMode=1 pattern.
    localStorage.setItem('presenterMode', 'true');
  });
  // Navigate to the route; the SPA will mount with localStorage already set
  await page.goto(route);
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
  // Because the app uses React state (not localStorage) for presenterMode,
  // we activate it via the TopBar toggle button after page load.
  // This is more realistic than localStorage injection.

  async function activatePresenterMode(page: Page) {
    // Click the presenter mode toggle in the TopBar
    const toggleBtn = page.getByRole('button', { name: /presenter mode/i });
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      // Wait a moment for state to propagate
      await page.waitForTimeout(300);
    }
  }

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

    // Wait for results
    await expect(page.getByText(/MODELED PROXY/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Run Hash/i)).toBeVisible();

    await screenshot(page, '03-simulator-presenter');
  });

  test('Methods (/methods) — License not confirmed badge visible', async ({ page }) => {
    await page.goto('/');
    await activatePresenterMode(page);
    await page.goto('/methods');

    await expect(page.getByText(/License not confirmed/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/Presenter cue/i)).toBeVisible();
    await expect(page.getByText(/UNPAIRED/i).first()).toBeVisible();

    await screenshot(page, '04-methods-presenter');
  });

  test('Compare (/compare) — modeled proxies text visible', async ({ page }) => {
    // Run a simulation first so Compare has data
    await page.goto('/');
    await activatePresenterMode(page);
    await page.goto('/simulator');
    await page.getByRole('button', { name: /Run Simulation/i }).click();
    await page.waitForTimeout(1000);

    await page.goto('/compare');
    await expect(page.getByText(/modeled proxies/i).first()).toBeVisible({ timeout: 10_000 });

    await screenshot(page, '05-compare-presenter');
  });

  test('ExportReport (/export) — Download HTML button visible', async ({ page }) => {
    // Need at least one simulation run
    await page.goto('/');
    await activatePresenterMode(page);
    await page.goto('/simulator');
    await page.getByRole('button', { name: /Run Simulation/i }).click();
    await page.waitForTimeout(1000);

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
