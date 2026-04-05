/// <reference lib='dom' />

import { createSSRApp, defineAsyncComponent, createApp } from 'vue';
import * as devalue from 'devalue';

const modules = import.meta.glob('./islands/*.vue');

const hydrate = async () => {
	const elements = document.querySelectorAll('[data-island]');

	for (const element of elements) {
		const componentName = element.getAttribute('data-island');
		const props = devalue.parse(element.getAttribute('data-props') || '{}');

		const importFunction = modules[`./islands/${componentName}.vue`];

		if (importFunction) {
			const clientOnly = element.getAttribute('data-client-only') === 'true';
			const Component = defineAsyncComponent(importFunction as any);

			if (clientOnly) {
				createApp(Component, props).mount(element);
			} else {
				createSSRApp(Component, props).mount(element);
			}
		}
	}
};

hydrate();