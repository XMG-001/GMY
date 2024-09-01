import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
// import store from './store'
import router from "./router/index";
import request from "./utils/request"; // 引入request.js
import "./router/permit";
import "nprogress/nprogress.css";
import directives from "./directives/index";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import useMenuInfoStore from "@/store/modules/menuInfo"; // 导入 store
import  LazyLoadPlugin  from 'vue3-lazyload';//懒加载插件

const app = createApp(App);
//启动浏览器拓展，再注释掉
const store = createPinia();
store.use(piniaPluginPersistedstate);
app.use(store);
app.use(directives);
app.use(router);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 注册全局属性
app.config.globalProperties.$request = request;
// 配置 lazyload 插件
app.use(LazyLoadPlugin, {
  // 这里可以配置 lazyload 插件的选项
  // 比如：
  loading: '',  // 加载中的图片
  error: '',      // 加载失败的图片
  attempt: 3,
  delay: 100,
});
app.mount("#app");



