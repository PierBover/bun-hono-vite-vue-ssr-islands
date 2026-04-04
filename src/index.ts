import {Hono} from 'hono';
import {html, raw} from 'hono/html';
import {createSSRApp} from 'vue';
import {renderToString} from 'vue/server-renderer';
import Page from './Page.vue';

const app = new Hono();

app.get('/', async (c) => {

	const vueApp = createSSRApp(Page);
	const vueHtml = await renderToString(vueApp);

	return c.html(html`
		<!DOCTYPE html>
		<html>
			<head>
				<script type="module" src="/@vite/client"></script>
			</head>
			<body>
				<div id="app">
					<h1>Hello Vite</h1>
					${raw(vueHtml)}
				</div>
			</body>
		</html>
	`);
});

export default app