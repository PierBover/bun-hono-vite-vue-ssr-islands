<script setup lang="ts">
	import Island from './Island.vue';
	import CurrentTime from './islands/CurrentTime.vue';
	const serverTime = (new Date()).toISOString()
</script>

<template>
	<h2>Hello from Vue with SSR</h2>
	<Island :component='CurrentTime' :islandProps='{serverTime}'/>
</template>