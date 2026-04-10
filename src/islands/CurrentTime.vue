<script setup lang="ts">
	import {ref, onMounted, onUnmounted} from 'vue';

	const {serverTime} = defineProps<{serverTime:string;}>();
	const now = ref(serverTime);
	let intervalId:ReturnType<typeof setInterval>;

	function updateTime () {
		now.value = (new Date()).toISOString()
	}

	onMounted(() => {
		updateTime();
		intervalId = setInterval(updateTime, 1000);
	});

	onUnmounted(() => {
		if (intervalId) clearInterval(intervalId);
	})
</script>

<template>
	<h3>The time is:{{ now }}</h3>
</template>

<style>
	h3 {
		font-weight: normal;
	}
</style>