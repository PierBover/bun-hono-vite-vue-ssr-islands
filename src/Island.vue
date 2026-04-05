<script setup lang='ts' generic='T extends Component'>
import { computed, type Component } from 'vue';

// A more reliable way to extract props for the template
type InferProps<T> = T extends new (...args: any[]) => { $props: infer P }
	? P
	: T extends (props: infer P, ...args: any[]) => any
		? P
		: Record<string, any>;

const props = defineProps<{
	component: T;
	islandProps: InferProps<T>;
}>();

const componentName = computed(() => {
	const comp = props.component as any;
	return comp.__name || comp.name || 'Anonymous';
});

const jsonProps = computed(() => JSON.stringify(props.islandProps));
</script>

<template>
	<div :data-island='componentName' :data-props='jsonProps'><component :is='component' v-bind='(islandProps as any)' /></div>
</template>