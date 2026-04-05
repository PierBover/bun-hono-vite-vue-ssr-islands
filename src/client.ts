/// <reference lib='dom' />

import { createSSRApp, defineAsyncComponent } from 'vue';

const modules = import.meta.glob('./islands/*.vue');

const hydrate = async () => {
	const targets = document.querySelectorAll('[data-island]');

	for (const element of targets) {
		const name = element.getAttribute('data-island');
		const props = JSON.parse(element.getAttribute('data-props') || '{}');

		const importFn = modules[`./islands/${name}.vue`];

		if (importFn) {
			const Component = defineAsyncComponent(importFn as any);
			const app = createSSRApp(Component, props);
			app.mount(element);
		}
	}
};

hydrate();