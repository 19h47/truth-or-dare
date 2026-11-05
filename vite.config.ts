import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	base: '/truth-or-dare/',
	plugins: [vue()],
	build: {
		cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5'],
		rolldownOptions: {
			input: {
				en: fileURLToPath(new URL('./index.html', import.meta.url)),
				fr: fileURLToPath(new URL('./fr/index.html', import.meta.url)),
			},
		},
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
});
