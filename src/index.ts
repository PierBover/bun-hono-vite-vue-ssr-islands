import {Hono} from 'hono';
import {compress} from 'hono/compress';
import {serveStatic} from 'hono/bun';
import Page from './Page.vue';
import {renderVuePage} from './middleware';
import './styles-entry';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

const app = new Hono();

if (isProd) {
	app.use('*', compress());
	app.use('/assets/*', serveStatic({ root: './dist/client' }));
}

app.get(
	'/',
	renderVuePage,
	async (c) => {
		return c.renderVuePage(Page);
	}
);

export default app