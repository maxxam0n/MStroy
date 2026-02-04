import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import {
	ModuleRegistry,
	ClientSideRowModelModule,
	ColumnApiModule,
} from 'ag-grid-community'

import { TreeDataModule } from 'ag-grid-enterprise'

ModuleRegistry.registerModules([
	ClientSideRowModelModule,
	TreeDataModule,
	ColumnApiModule,
])

createApp(App).mount('#app')
