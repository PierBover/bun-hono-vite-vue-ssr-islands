import {defineConfig} from 'vite';
import devServer from '@hono/vite-dev-server';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [
		vue(),
		devServer({
			entry: 'src/index.ts'
		})
	],
	build: {
		ssr: true,
		rollupOptions: {
			input: 'src/index.ts'
		}
	}
});