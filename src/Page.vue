<script setup lang="ts">
	import {ref, onMounted, onUnmounted} from 'vue';
	const now = ref('');
	let intervalId:ReturnType<typeof setInterval>;

	function update () {
		now.value = (new Date()).toISOString()
	}

	onMounted(() => {
		update();
		intervalId = setInterval(update, 1000);
	});

	onUnmounted(() => {
		if (intervalId) clearInterval(intervalId);
	})
</script>

<template>
	<h2>Hello from Vue with SSR</h2>
	<h3>{{ now }}</h3>
</template>