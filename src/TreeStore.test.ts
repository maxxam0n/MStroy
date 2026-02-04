import { describe, it, expect, beforeEach } from 'vitest'
import { TreeStore } from './TreeStore'
import { items } from './mock-data'

describe('TreeStore', () => {
	let store: TreeStore

	beforeEach(() => {
		store = new TreeStore(items)
	})

	it('getAll возвращает все элементы', () => {
		expect(store.getAll()).toHaveLength(8)
	})

	it('getItem возвращает элемент по id', () => {
		expect(store.getItem('91064cee')).toEqual({
			id: '91064cee',
			parent: 1,
			label: 'Айтем 2',
		})
	})

	it('getItem возвращает undefined для неизвестного id', () => {
		expect(store.getItem(0)).toBeUndefined()
	})

	it('getChildren возвращает прямые дочерние элементы', () => {
		const children = store.getChildren(1)
		expect(children.map(i => i.id)).toEqual(['91064cee', 3])
	})

	it('getChildren возвращает пустой массив для элемента без дочерних элементов', () => {
		expect(store.getChildren(3)).toEqual([])
	})

	it('getChildren возвращает пустой массив для неизвестного id', () => {
		expect(store.getChildren(0)).toEqual([])
	})

	it('getAllChildren возвращает все вложенные дочерние элементы', () => {
		const children = store.getAllChildren(1)
		expect(children.map(i => i.id)).toEqual(['91064cee', 4, 7, 8, 5, 6, 3])
	})

	it('getAllChildren возвращает пустой массив для элемента без дочерних элементов', () => {
		expect(store.getAllChildren(3)).toEqual([])
	})

	it('getAllParents возвращает цепочку от элемента до корня', () => {
		const parents = store.getAllParents(4)
		expect(parents.map(i => i.id)).toEqual([4, '91064cee', 1])
	})

	it('getAllParents возвращает только сам элемент для корня', () => {
		const parents = store.getAllParents(1)
		expect(parents.map(i => i.id)).toEqual([1])
	})

	it('getAllParents возвращает пустой массив для неизвестного id', () => {
		expect(store.getAllParents(0)).toEqual([])
	})

	it('addItem добавляет новый корневой элемент', () => {
		store.addItem({ id: 9, parent: null, label: 'Айтем 9' })
		expect(store.getItem(9)).toBeDefined()
	})

	it('addItem добавляет дочерний элемент к родителю', () => {
		store.addItem({ id: 9, parent: 5, label: 'Айтем 9' })
		expect(store.getChildren(5).map(i => i.id)).toContain(9)
	})

	it('removeItem удаляет элемент и все его дочерние элементы', () => {
		store.removeItem('91064cee')

		expect(store.getItem('91064cee')).toBeUndefined()
		expect(store.getItem(4)).toBeUndefined()
		expect(store.getItem(5)).toBeUndefined()
		expect(store.getItem(6)).toBeUndefined()
		expect(store.getItem(7)).toBeUndefined()
		expect(store.getItem(8)).toBeUndefined()
	})

	it('не ломается на циклических ссылках', () => {
		store.updateItem({ id: 1, parent: 4, label: 'Айтем 1' })

		expect(() => store.getAllParents(1)).not.toThrow()
		expect(() => store.getAllChildren(1)).not.toThrow()
	})
})
