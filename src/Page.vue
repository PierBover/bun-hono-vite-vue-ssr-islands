<script setup lang="ts">
	const now:Date = new Date();
</script>

<template>
	<h2>Hello from Vue with SSR</h2>
	<h3>{{ now.toISOString() }}</h3>
</template>