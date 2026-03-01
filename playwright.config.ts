/**
 * Playwright configuration for CogniBiome headless / CI screenshot tests.
 *
 * - Only runs in CI (skip locally unless PLAYWRIGHT_RUN=1 is set).
 * - Spins up `vite preview` against the pre-built dist/ folder.
 * - Takes full-page screenshots for every judge-critical route.
 * - All screenshots land in e2e/screenshots/ and are uploaded as CI artifacts.
 */
import { defineConfig, devices } from '@playwright/test';

const PORT = 4173; // vite preview default
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Reporter to use */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: BASE_URL,
    /* Collect trace only on failure */
    trace: 'on-first-retry',
    /* Full-page screenshots */
    screenshot: 'on',
    /* Headless is always true in CI */
    headless: true,
    /* Reasonable viewport for a dashboard app */
    viewport: { width: 1280, height: 900 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Launch vite preview against the pre-built dist/ before running tests */
  webServer: {
    command: 'npx vite preview --port 4173',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  /* Output directory for test screenshots */
  outputDir: 'e2e/test-results',
});
