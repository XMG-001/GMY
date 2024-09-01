import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { getMyMenuFn, getAllMenuFn } from "@/api/modules/menu";
import { getMyRouteFn } from "@/api/modules/route";
import { useRetryRequest } from "@/hooks/useRetryRequest";
import { CODE_SUCCESS } from "@/api/helper/codeStatus";
import { initDynamicRouter } from "@/router/modules/handleRouter";
import router from "@/router";

//最好用use开头
const useMenuInfoStore = defineStore("menuInfo", {
  //数据
  state: () => ({
    menuList: [],
    routeList: [],
    activeRoutes: [],
    allMenu: [],
  }),
  //计算属性
  getters: {},
  //方法
  actions: {
    async resetAll() {
      this.$reset();
    },
    setMenuList(val) {
      this.menuList = val;
    },
    setRouteList(val) {
      this.routeList = val;
    },
    setActiveRoutes(val) {
      this.activeRoutes = [];
      this.activeRoutes.push(val);
    },
    async fetchAllMenuList() {
      const res = await getAllMenuFn();
      if (res.code === CODE_SUCCESS) {
        this.allMenu = res.data;
      }
    },
    async fetchMenuList() {
      try {
        const { res, error, loading } = await useRetryRequest(
          getMyMenuFn,
          {},
          2,
          1000
        );
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
        console.log(err);
        return false;
      }
      return true;
    },
    async fetchRouteList() {
      try {
        const { res, error, loading } = await useRetryRequest(
          getMyRouteFn,
          {},
          2,
          1000
        );
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
        console.log(err);
        return false;
      }
      return true;
    },
  },
  persist: {
    beforeRestore: async (context) => {
      //   const menuInfoStore = context.store;
      //   router.addRoute(menuInfoStore.$state.activeRoutes);
      //   console.log("when",menuInfoStore.activeRoutes);
      //   return menuInfoStore.$state; // 返回修改后的状态
    },
    afterRestore: async (context) => {
      // context包含以下属性：
      // - key: 存储状态的键
      // - storage: 用于存储状态的存储对象（例如localStorage或sessionStorage）
      // - state: 从存储中检索到的状态
      // - store: Pinia store 实例
      // 你可以在这里修改即将恢复的状态
      //const xxxStore = context.store
    },
    key: "gmy-menuInfo", //存储名称
    // storage: sessionStorage, // 存储方式
    paths: ["menuList", "activeRoutes"], //指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
  },
});

export default useMenuInfoStore;
