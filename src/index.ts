import {file} from 'bun';
import {Hono} from 'hono';
import {html, raw} from 'hono/html';
import {createSSRApp} from 'vue';
import {renderToString} from 'vue/server-renderer';
import {serveStatic} from 'hono/bun';
import Page from './Page.vue';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const app = new Hono();
// do this only once and not per request
const viteManifest = isProd ? await file('dist/client/.vite/manifest.json').text() : null;
const viteManifestJson = viteManifest ? JSON.parse(viteManifest) : null;

function getClientEntry () {
	// during dev just return the actual file and Vite will do the rest
	if (isDev) return '<script type="module" src="src/client.ts"></script>';

	// after building get the hashed path from the manifest
	if (!viteManifestJson) throw 'No Vite manifest found!';
	return `<script type="module" src="${viteManifestJson['src/client.ts'].file}"></script>`
}

if (isProd) {
	app.use('/assets/*', serveStatic({ root: './dist/client' }));
}

app.get('/', async (c) => {

	const vueApp = createSSRApp(Page);
	const vueHtml = await renderToString(vueApp);

	return c.html(html`
		<!DOCTYPE html>
		<html>
			<head>
				${isDev && raw('<script type="module" src="/@vite/client"></script>')}
			</head>
			<body>
				<div id="vue">${raw(vueHtml)}</div>
				${raw(getClientEntry())}
			</body>
		</html>
	`);
});

export default app