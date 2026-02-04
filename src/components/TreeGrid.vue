<template>
	<AgGridVue
		style="height: 500px"
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
import { TreeStore } from '../shared/TreeStore'
import type { TreeItem } from '../shared/types'

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
		resizable: false,
		headerClass: 'header-cell',
		valueGetter: params => {
			let displayIndex = -1
			params.api.forEachNodeAfterFilterAndSort((node, index) => {
				if (node === params.node) displayIndex = index
			})
			return displayIndex >= 0
				? displayIndex + 1
				: (params.node?.rowIndex ?? 0) + 1
		},
		width: 100,
	},
	{
		colId: 'label',
		headerName: 'Название',
		resizable: false,
		field: 'label',
		flex: 2,
	},
]

const autoGroupColumnDef: ColDef<RowData> = {
	resizable: false,
	headerName: 'Категория',
	headerClass: 'header-cell',
	cellClass: 'header-cell',
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

<style>
.header-cell {
	border-right: 1px solid #cacaca;
}
</style>
