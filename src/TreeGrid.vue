<template>
	<AgGridVue
		style="height: 100%"
		:treeData="true"
		:rowData="rowData"
		:columnDefs="columnDefs"
		:autoGroupColumnDef="autoGroupColumnDef"
		:getDataPath="data => data.path"
		@grid-ready="onGridReady"
	/>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type {
	ColDef,
	GridReadyEvent,
	ICellRendererParams,
} from 'ag-grid-community'
import { TreeStore } from './TreeStore'
import type { TreeItem } from './types'

interface RowData extends TreeItem {
	path: string[]
	hasChildren: boolean
}

const props = defineProps<{
	items: TreeItem[]
}>()

const treeStore = computed(() => new TreeStore(props.items))

const rowData = computed<RowData[]>(() =>
	treeStore.value.getAll().map(item => ({
		...item,
		path: getPath(item),
		hasChildren: treeStore.value.getChildren(item.id).length > 0,
	}))
)

const columnDefs: ColDef<RowData>[] = [
	{
		colId: 'order',
		headerName: '№ п/п',
		valueGetter: params => {
			let displayIndex = -1
			params.api.forEachNodeAfterFilterAndSort((node, index) => {
				if (node === params.node) displayIndex = index
			})
			return displayIndex >= 0
				? displayIndex + 1
				: (params.node?.rowIndex ?? 0) + 1
		},
		flex: 1,
	},
	{
		colId: 'label',
		headerName: 'Название',
		field: 'label',
		flex: 1,
	},
]

const autoGroupColumnDef: ColDef<RowData> = {
	headerName: 'Категория',
	flex: 1,
	cellRendererParams: {
		suppressCount: true,
		innerRenderer: (params: ICellRendererParams<RowData>) =>
			params.data?.hasChildren ? 'Группа' : 'Элемент',
	},
}

const onGridReady = (params: GridReadyEvent<RowData>) => {
	params.api.applyColumnState({
		state: [
			{ colId: 'order' },
			{ colId: 'ag-Grid-AutoColumn' },
			{ colId: 'label' },
		],
		applyOrder: true,
	})
}

function getPath(item: TreeItem): string[] {
	return treeStore.value
		.getAllParents(item.id)
		.reverse()
		.map(i => i.id.toString())
}
</script>
