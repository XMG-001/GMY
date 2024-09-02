import { defineStore } from "pinia";
import useMenuInfoStore from "./menuInfo";

// 最好用 use 开头
const useTabInfoStore = defineStore("tabInfo", {
  // 数据
  state: () => ({
    tabIndex: 1, // 标签页的索引
    editableTabsValue: "1", // 当前选中的标签页
    editableTabs: [], // 标签页数组
  }),
  // 计算属性
  getters: {
    homeTab(state) {
      const menuInfoStore = useMenuInfoStore();
      const homeMenu = menuInfoStore.menuList[0] || {};
      return {
        title: homeMenu.menuName || "Home",
        name: "1",
        path: homeMenu.path || "/",
        icon: homeMenu.icon || "home",
        close: false,
      };
    },
    // 可以启用此计算属性来动态计算标签页的数量
    // tabCount: (state) => state.editableTabs.length,
  },
  // 方法
  actions: {
    initializeTabs() {
      // 初始化 editableTabs 的第一项为 homeTab
      if (this.editableTabs.length === 0) {
        this.editableTabs = [this.homeTab];
      }
    },
    async resetAll() {
      this.$reset();
    },
    incrementTabIndex() {
      this.tabIndex++;
    },
    setEditableTabsValue(val) {
      this.editableTabsValue = val;
    },
    addEditableTabs(tab) {
      this.editableTabs.push(tab);
    },
    setEditableTabs(tabs) {
      this.editableTabs = tabs;
    },
    filterTab(activePath) {
      return this.editableTabs.find(tab => tab.path === activePath) || false;
    },
    addTab(title, path, icon) {
      // 如果标签页已经存在，则更新当前选中的标签页
      if (this.filterTab(path)) {
        const existingTab = this.filterTab(path);
        this.setEditableTabsValue(existingTab.name);
        return;
      }
      this.incrementTabIndex();
      const newTab = {
        title,
        name: `${this.tabIndex}`,
        path,
        icon,
        close: true,
      };
      this.addEditableTabs(newTab);
      this.setEditableTabsValue(newTab.name);
    },
  },
  persist: {
    key: "gmy-tabInfo", // 存储名称
    storage: sessionStorage, // 存储方式
    paths: ["tabIndex", "editableTabsValue", "editableTabs"], // 指定 state 中哪些数据需要被持久化
    debug: true,
  },
});

export default useTabInfoStore;
