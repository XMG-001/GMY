import { el } from "element-plus/es/locale/index.mjs";
import { defineStore } from "pinia";
import useMenuInfoStore from "./menuInfo";

//最好用use开头
const useTabInfoStore = defineStore("tabInfo", {
  //数据
  state: () => ({
    tabIndex: 1, //总数
    editableTabsValue: "1",
    editableTabs: [],
  }),
  //计算属性
  getters: {
    homeTab(state) {
      const menuInfoStore = useMenuInfoStore();
      const homeMenu = menuInfoStore.menuList[0];
      return {
        title: homeMenu.menuName,
        name: "1",
        path: homeMenu.path,
        icon: homeMenu.icon,
        close: false,
      };
    },
    // tabIndex: (state) => state.editableTabs.length, // 计算属性，返回 editableTabs 列表的长度
  },
  //方法
  actions: {
    initializeTabs() {
      // 初始化 editableTabs 的第一项为 homeTab
      if(this.editableTabs.length === 0){
        this.editableTabs = [this.homeTab];
      }
    },
    async resetAll() {
      this.$reset();
    },
    setTabIndex() {
      this.tabIndex++;
    },
    setEditableTabsValue(val) {
      this.editableTabsValue = val;
    },
    addEditableTabs(val) {
      this.editableTabs.push(val);
    },
    setEditableTabs(val) {
      this.editableTabs = val;
    },
    filterTab(activePath) {
      const activeTab = this.editableTabs.find(
        (tab) => tab.path === activePath
      );
      if (activeTab) {
        return activeTab;
      } else {
        return false;
      }
    },
    addTab(activeTitle, activePath, activeIcon) {
      // if (this.filterTab(activePath)) {
      //     let activeTab = this.filterTab(activePath)
      //     this.setEditableTabsValue(activeTab.name);
      //     return;
      // }
      this.setTabIndex();
      const newTabName = `${this.tabIndex}`;
      const newTab = {
        title: activeTitle,
        name: newTabName,
        path: activePath,
        icon: activeIcon,
        close: true,
      };
      this.addEditableTabs(newTab);
      this.setEditableTabsValue(newTabName);
    },
  },
  persist: {
    key: "gmy-tabInfo", //存储名称
    storage: sessionStorage, // 存储方式
    paths: ["tabIndex", "editableTabsValue", "editableTabs"], //指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
  },
});

export default useTabInfoStore;
