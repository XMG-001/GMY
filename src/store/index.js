//创建大仓库
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const store = createPinia();
store.use(piniaPluginPersistedstate)

export default store;