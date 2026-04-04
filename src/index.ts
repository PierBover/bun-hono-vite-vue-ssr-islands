import {Hono} from 'hono';
import {html} from 'hono/html';

const app = new Hono();

app.get('/', (c) => {
	return c.html(html`
		<!DOCTYPE html>
		<html>
			<head>
				<script type="module" src="/@vite/client"></script>
			</head>
			<body>
				<div id="app">
					<h1>Hello Vite</h1>
				</div>
			</body>
		</html>
	`);
});

export default app