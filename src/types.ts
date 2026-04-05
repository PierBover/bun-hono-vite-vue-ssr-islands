import 'hono';
import type { DefineComponent } from 'vue';

declare module 'hono' {
	interface Context {
		renderVuePage: (
			Component: DefineComponent<{}, {}, any>,
			props?: Record<string, any>
		) => Promise<Response>;
	}
}