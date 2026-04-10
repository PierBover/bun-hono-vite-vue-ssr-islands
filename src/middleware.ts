import {file} from 'bun';
import {createMiddleware} from 'hono/factory'
import {html, raw} from 'hono/html';
import type {Manifest, ViteDevServer} from 'vite';
import {createSSRApp} from 'vue';
import {renderToString} from 'vue/server-renderer';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

const viteManifest = isProd ? await file('dist/client/.vite/manifest.json').text() : null;
const viteManifestJson = viteManifest ? JSON.parse(viteManifest) as Manifest : null;

export const renderVuePage = createMiddleware(async (c, next) => {

	c.renderVuePage = async (Component, props = {}) => {

		//const ssrContext: { modules?: Set<string> } = {}
		const vueApp = createSSRApp(Component, props);
		const vueHtml = await renderToString(vueApp);
		const hasIslands = vueHtml.includes('data-island');

		const styleUrls:string[] = [];

		if (isDev) {
			const devCssUrls = await getCssUrlsFromViteDevServer(c.env.vite);
			styleUrls.push(...devCssUrls);
		}

		if (isProd) {
			const stylesEntry = viteManifestJson!['style.css']!;
			styleUrls.push(stylesEntry.file);
		}

		return c.html(html`
			<!DOCTYPE html>
			<html>
				<head>
					${isProd && raw(getPreloadHeaders())}
					${isDev && raw(`<script type="module" src="/@vite/client"></script>`)}
					${raw(styleUrls.map( url => `<link href="${url}" rel="stylesheet"/>`).join(''))}
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

function getIslandsEntry () {
	// during dev just return the actual file and Vite will do the rest
	if (isDev) return '<script type="module" src="src/islands-entry.ts"></script>';

	// after building get the hashed path from the manifest
	if (!viteManifestJson) throw 'No Vite manifest found!';
	return `<script type="module" src="${viteManifestJson['src/islands-entry.ts']!.file}"></script>`
}

function getPreloadHeaders () {
	if (!viteManifestJson) throw 'No vite manifest!';
	const allFiles = Object.keys(viteManifestJson).map(key => viteManifestJson[key]!.file);
	const uniqueFiles = Array.from(new Set(allFiles));
	return uniqueFiles.map(file => `<link rel="modulepreload" href="/${file}" fetchpriority="low">`).join('');
}

async function getCssUrlsFromViteDevServer(viteDevServer: ViteDevServer):Promise<string[]> {
	const styleUrls: Set<string> = new Set();
	const walkedModuleIds: Set<string> = new Set();

	function walkModule(moduleNode: any) {
		if (!moduleNode || walkedModuleIds.has(moduleNode.id)) return;
		walkedModuleIds.add(moduleNode.id)

		if (moduleNode.url.endsWith('.css') || moduleNode.url.includes('vue&type=style')) styleUrls.add(moduleNode.url);

		for (const importedModule of moduleNode.importedModules) {
			walkModule(importedModule)
		}
	}

	//await viteDevServer.ssrLoadModule('/src/styles-entry.ts');
	const stylesEntryModule = await viteDevServer.moduleGraph.getModuleByUrl('/src/styles-entry.ts');
	if (stylesEntryModule) walkModule(stylesEntryModule);

	return Array.from(styleUrls);
}