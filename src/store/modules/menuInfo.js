import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { getMyMenuFn, getAllMenuFn } from "@/api/modules/menu";
import { getMyRouteFn } from "@/api/modules/route";
import { useRetryRequest } from "@/hooks/useRetryRequest";
import { CODE_SUCCESS } from "@/api/helper/codeStatus";
import { initDynamicRouter } from "@/router/modules/handleRouter";
import router from "@/router";

// 最好用 use 开头
const useMenuInfoStore = defineStore("menuInfo", {
  // 数据
  state: () => ({
    menuList: [],
    routeList: [],
    activeRoutes: [],
    allMenu: [],
  }),
  // 计算属性
  getters: {},
  // 方法
  actions: {
    async resetAll() {
      this.$reset();
    },
    setMenuList(menuList) {
      this.menuList = menuList;
    },
    setRouteList(routeList) {
      this.routeList = routeList;
    },
    setActiveRoutes(activeRoutes) {
      this.activeRoutes = Array.isArray(activeRoutes) ? activeRoutes : [activeRoutes];
    },
    async fetchAllMenuList() {
      try {
        const { res } = await useRetryRequest(getAllMenuFn, {}, 2, 1000);
        if (res.value.code === CODE_SUCCESS) {
          this.allMenu = res.value.data;
        }
      } catch (err) {
        console.error("Failed to fetch all menu list:", err);
      }
    },
    async fetchMenuList() {
      try {
        const { res } = await useRetryRequest(getMyMenuFn, {}, 2, 1000);
        if (res.value.code === CODE_SUCCESS) {
          this.menuList = res.value.data;
          if (this.menuList.length === 0) {
            ElMessage({
              type: "error",
              message: "获取菜单信息失败",
            });
            return false;
          }
        } else {
          return false;
        }
      } catch (err) {
        console.error("Failed to fetch menu list:", err);
        return false;
      }
      return true;
    },
    async fetchRouteList() {
      try {
        const { res } = await useRetryRequest(getMyRouteFn, {}, 2, 1000);
        if (res.value.code === CODE_SUCCESS) {
          this.routeList = res.value.data;
          if (this.routeList.length === 0) {
            ElMessage({
              type: "error",
              message: "获取路由信息失败",
            });
            return false;
          }
        } else {
          return false;
        }
      } catch (err) {
        console.error("Failed to fetch route list:", err);
        return false;
      }
      return true;
    },
  },
  persist: {
    beforeRestore: async (context) => {
      // 在这里可以处理在恢复之前的逻辑，例如动态路由设置
      // const menuInfoStore = context.store;
      // router.addRoute(menuInfoStore.$state.activeRoutes);
      // console.log("beforeRestore:", menuInfoStore.activeRoutes);
    },
    afterRestore: async (context) => {
      // 在这里可以处理恢复之后的逻辑
      // const menuInfoStore = context.store;
      // console.log("afterRestore:", menuInfoStore.$state);
    },
    key: "gmy-menuInfo", // 存储名称
    storage: sessionStorage, // 存储方式
    paths: ["menuList", "activeRoutes"], // 指定 state 中哪些数据需要被持久化
    debug: true,
  },
});

export default useMenuInfoStore;
