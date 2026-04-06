/// <reference lib='dom' />

import { createSSRApp, defineAsyncComponent, createApp } from 'vue';
import * as devalue from 'devalue';

// get all the island modules for importing later
// this doesn't bundle those module in this chunk
const modules = import.meta.glob('./islands/*.vue');

async function hydrateIsland (element:HTMLElement) {
	console.log('hydrating', element);
	const componentName = element.getAttribute('data-island');
	const propsString = element.getAttribute('data-props');
	const props = propsString ? devalue.parse(propsString) : {};

	const importFunction = modules[`./islands/${componentName}.vue`];

	if (importFunction) {
		const clientOnly = element.getAttribute('data-client-only') === 'true';
		// this will import() the component dynamically on run time from its own chunk
		const Component = defineAsyncComponent(importFunction as any);

		if (clientOnly) {
			createApp(Component, props).mount(element);
		} else {
			createSSRApp(Component, props).mount(element);
		}
	}
}

// look for islands that don't use the intersection observer
const elements = document.querySelectorAll('[data-island]:not([data-hydrate-on-visible])') as NodeListOf<HTMLElement>;
for (const element of elements) hydrateIsland(element);

// look for islands that use the intersection observer
const elementsToObserve = document.querySelectorAll('[data-island][data-hydrate-on-visible]') as NodeListOf<HTMLElement>;

if (elementsToObserve.length > 0) {

	function onObserve (entries:IntersectionObserverEntry[], observer:IntersectionObserver) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				observer.unobserve(entry.target);
				hydrateIsland(entry.target as HTMLElement);
			};
		});
	}

	const observer = new IntersectionObserver(onObserve);

	for (const element of elementsToObserve) observer.observe(element);
}