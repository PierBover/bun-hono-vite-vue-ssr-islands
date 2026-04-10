<script setup lang="ts">
	import Island from './Island.vue';
	import CurrentTime from './islands/CurrentTime.vue';
	import Counter from './islands/Counter.vue';
	const serverTime = (new Date()).toISOString()
</script>

<template>
	<h2>Hello from Vue with SSR</h2>
	<!--<Island :component='CurrentTime' :islandProps='{serverTime}' clientOnly/>-->
	<Island :component='CurrentTime' :islandProps='{serverTime}'/>
	<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
	<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
	<Island :component='Counter' hydrateOnVisible/>
</template>

<style>
	h2 {
		font-weight: normal;
		color: #42b883;
	}
</style>