<script setup lang="ts">
	import {ref} from 'vue';
	const count = ref(0);
</script>
<template>
	<div>
		<h4>{{ count }}</h4>
		<button @click="() => count ++">Add</button>
	</div>
</template>