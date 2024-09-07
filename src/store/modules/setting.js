import { defineStore } from "pinia";
import { DEFAULT_PRIMARY } from "@/config";
import { useTheme } from "@/hooks/useTheme";

// 最好用 use 开头
const useSettingStore = defineStore("setting", {
  state: () => ({
    randomKey: 0,
    // 打开主题
    drawerVisible: false,
    // 折叠菜单
    isCollapse: false,
    // 当前路由
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
  getters: {},
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
      this.randomKey = Math.floor(Math.random() * 100000); // 修正 Math.random 的用法
    },
    setGlobalState(key, value) {
      this.$patch({ [key]: value });
    },
  },
  persist: {
    key: "gmy-setting", 
    storage: sessionStorage, 
    afterRestore: async (context) => {
      const settingStore = context.store;
      const { changePrimary } = useTheme();
      await changePrimary(settingStore.primary); 
    },
    debug: true,
  },
});

export default useSettingStore;
