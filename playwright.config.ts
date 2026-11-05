import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://localhost:4173/truth-or-dare/';

export default defineConfig({
	testDir: 'tests',
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	use: { baseURL },
	projects: [
		{ name: 'chromium', use: devices['Desktop Chrome'] },
		{ name: 'firefox', use: devices['Desktop Firefox'] },
		{ name: 'webkit', use: devices['Desktop Safari'] },
	],
	webServer: {
		command: 'pnpm build && pnpm preview --port 4173 --strictPort',
		url: baseURL,
		reuseExistingServer: !process.env.CI,
	},
});
