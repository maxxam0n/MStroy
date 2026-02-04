<template>
	<TreeGrid :items="items"></TreeGrid>
</template>

<script setup lang="ts">
import TreeGrid from './TreeGrid.vue'
import { items } from './mock-data'
</script>
