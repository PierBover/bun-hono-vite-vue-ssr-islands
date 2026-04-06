<script setup lang='ts' generic='T extends Component'>
	import * as devalue from 'devalue';
	import { computed, type Component } from 'vue';

	// A more reliable way to extract props for the template
	type InferProps<T> = T extends new (...args: any[]) => { $props: infer P }
		? P
		: T extends (props: infer P, ...args: any[]) => any
			? P
			: Record<string, any>;

	const props = withDefaults(defineProps<{
		component: T;
		islandProps?: InferProps<T>|null;
		clientOnly?:boolean|null;
		hydrateOnVisible?:boolean|null;
	}>(), {islandProps:null, clientOnly:null, hydrateOnVisible: null});

	const comp = props.component as any;
	const componentName = comp.__name || comp.name;
	const jsonProps = props.islandProps ? devalue.stringify(props.islandProps) : null;
</script>

<template>
	<div :data-island="componentName" :data-props="jsonProps" :data-client-only="clientOnly" :data-hydrate-on-visible="hydrateOnVisible"><component v-if="!clientOnly" :is="component" v-bind="(islandProps as any)" /></div>
</template>