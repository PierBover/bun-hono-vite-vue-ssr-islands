import {file} from 'bun';
import {createMiddleware} from 'hono/factory'
import {html, raw} from 'hono/html';
import {createSSRApp} from 'vue';
import {renderToString} from 'vue/server-renderer';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

const viteManifest = isProd ? await file('dist/client/.vite/manifest.json').text() : null;
const viteManifestJson = viteManifest ? JSON.parse(viteManifest) : null;

function getIslandsEntry () {
	// during dev just return the actual file and Vite will do the rest
	if (isDev) return '<script type="module" src="src/islands-entry.ts"></script>';

	// after building get the hashed path from the manifest
	if (!viteManifestJson) throw 'No Vite manifest found!';
	return `<script type="module" src="${viteManifestJson['src/islands-entry.ts'].file}"></script>`
}

function getPreloadHeaders () {
	const allFiles = Object.keys(viteManifestJson).map(key => viteManifestJson[key].file);
	const uniqueFiles = Array.from(new Set(allFiles));
	return uniqueFiles.map(file => `<link rel="modulepreload" href="/${file}" fetchpriority="low">`).join('');
}

export const renderVuePage = createMiddleware(async (c, next) => {

	c.renderVuePage = async (Component, props = {}) => {

		const vueApp = createSSRApp(Component, props);
		const vueHtml = await renderToString(vueApp);

		const hasIslands = vueHtml.includes('data-island');

		return c.html(html`
			<!DOCTYPE html>
			<html>
				<head>
					${isProd && raw(getPreloadHeaders())}
					${isDev && raw('<script type="module" src="/@vite/client"></script>')}
				</head>
				<body>
					<div id="vue">${raw(vueHtml)}</div>
					${hasIslands ? raw(getIslandsEntry()) : ''}
				</body>
			</html>
		`);
	};

	await next();
});