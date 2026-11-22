import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testMatch: 'firebase.spec.ts',
  use: { ...base.use, geolocation: { latitude: -15.6, longitude: -56.1 }, permissions: ['geolocation'] },
  webServer: { command: 'node scripts/serve-preview.cjs dist-emulator', url: 'http://127.0.0.1:4173' },
});
