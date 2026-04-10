import {defineConfig, type Plugin} from 'vite';
import devServer from '@hono/vite-dev-server';
import bunAdapter from '@hono/vite-dev-server/bun'
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ isSsrBuild }) => {
	return {
		plugins: [
			vue(),
			devServer({
				entry: 'src/index.ts',
				adapter: bunAdapter
			}),
		],
		optimizeDeps: {
			exclude: ['bun'],
		},
		build: {
			cssCodeSplit: false,
			rollupOptions: {
				input: isSsrBuild ? 'src/index.ts' : ['src/islands-entry.ts', 'src/styles-entry.ts'],
				external: ['bun'],
			},
			outDir: isSsrBuild ? 'dist/server' : 'dist/client',
			emptyOutDir: true,
			manifest: true,
		},
		ssr: {
			external: ['bun', 'hono', '@hono/vite-dev-server']
		},
	};
});