export type TreeItemId = string | number

export interface TreeItem {
	id: TreeItemId
	parent: null | TreeItemId
	label: string
}
