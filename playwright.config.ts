import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  timeout: 60000,

  expect: {
    timeout: 10000,
  },

  use: {
    trace: 'on-first-retry',
    viewport: { width: 1920, height: 1080 },
  },

  projects: [
    {
      name: 'ui-tests',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: true,
        testIdAttribute: 'data-testid',
        locale: 'en-GB',
        screenshot: 'only-on-failure',
        baseURL: 'https://dev.fashion.funnel-fuel.com',
        permissions: ['payment-handler']
      },
      testDir: './tests/ui',
      fullyParallel: true,
    },
    {
      name: 'api-tests',
      use: {
        baseURL: 'https://api.dev.shadow.funnel-fuel.com',
        extraHTTPHeaders: {
          contentType: "application/json"
        }
      },
      testDir: './tests/api'
    },
  ],
});
