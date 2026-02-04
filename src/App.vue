<template>
	<div class="app">
		<div class="app__header">Режим: просмотр</div>
		<TreeGrid :items="items"></TreeGrid>
	</div>
</template>

<script setup lang="ts">
import TreeGrid from './components/TreeGrid.vue'
import { items } from './shared/mock-data'
</script>

<style>
.app {
	height: 100%;
	background-color: #e6e6e6;
	padding: 20px;
}

.app__header {
	font-size: 14px;
	margin-bottom: 10px;
	color: #00a2ff;
}
</style>
