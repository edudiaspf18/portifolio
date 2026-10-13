import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  use: { baseURL: 'http://localhost:3100' },
  webServer: {
    command: 'NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run build && NEXT_PUBLIC_SITE_URL=http://localhost:3100 npx next start -p 3100',
    url: 'http://localhost:3100/pt',
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
