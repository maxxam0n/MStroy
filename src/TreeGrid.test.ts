import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TreeGrid from './TreeGrid.vue'
import { items } from './mock-data'
import type { TreeItemId } from './types'

interface RowData {
	id: TreeItemId
}

describe('App rowData', () => {
	it('корректно строит rowData из TreeStore', () => {
		const wrapper = mount(TreeGrid, {
			props: { items },
		})

		const vm = wrapper.vm as unknown as { rowData: RowData[] }
		const rowData = vm.rowData

		expect(rowData).toHaveLength(items.length)

		const item4 = rowData.find((i: RowData) => i.id === 4)

		expect(item4).toEqual({
			id: 4,
			parent: '91064cee',
			label: 'Айтем 4',
			hasChildren: true,
			path: ['1', '91064cee', '4'],
		})
	})
})
