import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  testMatch: 'visitante.spec.ts',
  fullyParallel: false,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 390, height: 844 },
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined },
    screenshot: 'only-on-failure',
  },
  webServer: { command: 'node scripts/serve-preview.cjs', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
