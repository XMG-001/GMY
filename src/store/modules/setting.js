import { set } from "nprogress";
import { defineStore } from "pinia";
import { DEFAULT_PRIMARY } from "@/config";
import { useTheme } from "@/hooks/useTheme";

//最好用use开头
const useSettingStore = defineStore("setting", {
  // 修改默认值之后，需清除 localStorage 数据
  state: () => ({
    randomKey: 0,
    //打开主题
    drawerVisible: false,
    // 折叠菜单
    isCollapse: false,
    //当前路由
    currentPath: {},
    // 布局模式 (默认：default | 横向：transverse | 纵向：vertical | 分栏：columns)
    layout: "default",
    // element 组件大小
    assemblySize: "default",
    // 当前系统语言
    language: null,
    // 当前页面是否全屏
    maximize: false,
    // 主题颜色
    primary: DEFAULT_PRIMARY,
    // 深色模式
    isDark: false,
    // 灰色模式
    isGrey: false,
    // 色弱模式
    isWeak: false,
    // 侧边栏反转
    asideInverted: false,
    // 头部反转
    headerInverted: false,
    // 菜单手风琴
    accordion: true,
    // 页面水印
    watermark: false,
    // 面包屑导航
    breadcrumb: true,
    // 面包屑导航图标
    breadcrumbIcon: true,
    // 标签页
    tabs: true,
    // 标签页图标
    tabsIcon: true,
    // 页脚
    footer: true,
  }),
  //计算属性
  getters: {},
  //方法
  actions: {
    async resetAll() {
      this.$reset();
    },
    setIsCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    setCurrentPath(val) {
      this.currentPath = val;
    },
    setRandomKey() {
      this.randomKey = Math.floor(Math.random(1, 1000) * 100000);
    },
    //输入名字set
    //setGlobalState("isCollapse", true)
    setGlobalState(...args) {
      this.$patch({ [args[0]]: args[1] });
    },
  },
  persist: {
    key: "gmy-setting", //存储名称
    storage: sessionStorage, // 存储方式
    // paths: [
    //   "randomKey",
    //   "drawerVisible",
    //   "isCollapse",
    //   "currentPath",
    //   "layout",
    //   "assemblySize",
    //   "language",
    //   "maximize",
    //   "primary",
    //   "isDark",
    //   "isGrey",
    //   "isWeak",
    //   "asideInverted",
    //   "headerInverted",
    //   "accordion",
    //   "watermark",
    //   "breadcrumb",
    //   "breadcrumbIcon",
    //   "tabs",
    //   "tabsIcon",
    //   "footer",
    // ], //指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
    //持久化储存后立马更新颜色
    afterRestore: async (context) => {
      const settingStore = context.store;
      const { changePrimary } = useTheme();
      changePrimary(settingStore.$state.primary);
    },
  },
});

export default useSettingStore;
