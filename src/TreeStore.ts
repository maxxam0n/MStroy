import { TreeItem, TreeItemId } from './types'

interface TreeStoreItem {
	self: TreeItem
	children: Set<TreeItemId>
}

export class TreeStore {
	private itemsMap = new Map<TreeItemId, TreeStoreItem>()

	constructor(items: TreeItem[]) {
		for (const item of items) {
			this.itemsMap.set(item.id, {
				self: item,
				children: new Set(),
			})
		}

		// Второй цикл освобождает конструктор от условия порядка элементов, при котором дети идут только после родителя
		for (const item of items) {
			if (item.parent !== null) {
				this.itemsMap.get(item.parent)?.children.add(item.id)
			}
		}
	}

	// Возвращает плоский список элементов
	public getAll(): TreeItem[] {
		return Array.from(this.itemsMap.values(), i => i.self)
	}

	// Возвращает объект элемента по id
	public getItem(id: TreeItemId): TreeItem | undefined {
		return this.itemsMap.get(id)?.self
	}

	// Возвращает массив дочерних элементов для элемента, id которого передали
	public getChildren(id: TreeItemId): TreeItem[] {
		const storeItem = this.itemsMap.get(id)
		if (!storeItem) return []

		return Array.from(storeItem.children)
			.map(id => this.itemsMap.get(id)?.self)
			.filter(Boolean) as TreeItem[]
	}

	/**
	 * Возвращает массив дочерних элементов для элемента,
	 * id которого передали, и дочерних элементов, которые имеют свои дочерние элементы
	 */
	public getAllChildren(id: TreeItemId): TreeItem[] {
		const result: TreeItem[] = []
		const visited = new Set<TreeItemId>()

		const dfs = (currentId: TreeItemId) => {
			if (visited.has(currentId)) return
			visited.add(currentId)

			const storeItem = this.itemsMap.get(currentId)
			if (!storeItem) return

			for (const childId of storeItem.children) {
				const child = this.itemsMap.get(childId)?.self
				if (child) {
					result.push(child)
					dfs(childId)
				}
			}
		}

		dfs(id)
		return result
	}

	/**
	 * Возвращает массив из упорядоченной цепочки родительских элементов,
	 * начиная с самого элемента, чей id был передан
	 */
	public getAllParents(id: TreeItemId): TreeItem[] {
		const result: TreeItem[] = []
		// Для предотвращения циклических ссылок
		const visited = new Set<TreeItemId>()

		let current = this.itemsMap.get(id)?.self

		while (current && !visited.has(current.id)) {
			visited.add(current.id)
			result.push(current)
			current =
				current.parent !== null
					? this.itemsMap.get(current.parent)?.self
					: undefined
		}

		return result
	}

	// Принимает объект нового элемента и добавляет его в общую структуру хранилища
	public addItem(item: TreeItem) {
		if (this.itemsMap.has(item.id)) {
			console.error(`Item with id "${item.id}" already exists`)
			return
		}

		this.itemsMap.set(item.id, { self: item, children: new Set() })

		if (item.parent !== null) {
			this.itemsMap.get(item.parent)?.children.add(item.id)
		}
	}

	/**
	 * Удаляет элемент по переданному id этого элемента,
	 * а так же его прямые и вложенные дочерние элементы
	 */
	public removeItem(id: TreeItemId) {
		const toRemove = this.getAllChildren(id).map(i => i.id)
		toRemove.push(id)

		const parentId = this.itemsMap.get(id)?.self.parent
		if (parentId !== null && parentId !== undefined) {
			this.itemsMap.get(parentId)?.children.delete(id)
		}

		for (const id of toRemove) {
			this.itemsMap.delete(id)
		}
	}

	// Принимает объект обновленного айтема и актуализирует этот айтем в хранилище
	public updateItem(item: TreeItem) {
		const storeItem = this.itemsMap.get(item.id)
		if (!storeItem) return

		const oldParent = storeItem.self.parent
		const newParent = item.parent

		// Убираем из старого родителя
		if (oldParent !== null && oldParent !== newParent) {
			this.itemsMap.get(oldParent)?.children.delete(item.id)
		}

		// Добавляем к новому родителю
		if (newParent !== null && oldParent !== newParent) {
			this.itemsMap.get(newParent)?.children.add(item.id)
		}

		storeItem.self = item
	}
}
