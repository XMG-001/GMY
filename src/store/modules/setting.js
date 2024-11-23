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
      if (typeof key !== "string" || key === "") {
        return;
      }
      switch (key) {
        case "randomKey":
          this.randomKey = value;
          break;
        case "drawerVisible":
          this.drawerVisible = value;
          break;
        case "isCollapse":
          this.isCollapse = value;
          break;
        case "currentPath":
          this.currentPath = value;
          break;
        case "layout":
          this.layout = value;
          break;
        case "assemblySize":
          this.assemblySize = value;
          break;
        case "language":
          this.language = value;
          break;
        case "maximize":
          this.maximize = value;
          break;
        case "primary":
          this.primary = value;
          break;
        case "isDark":
          this.isDark = value;
          break;
        case "isGrey":
          this.isGrey = value;
          break;
        case "isWeak":
          this.isWeak = value;
          break;
        case "asideInverted":
          this.asideInverted = value;
          break;
        case "headerInverted":
          this.headerInverted = value;
          break;
        case "accordion":
          this.accordion = value;
          break;
        case "watermark":
          this.watermark = value;
          break;
        case "breadcrumb":
          this.breadcrumb = value;
          break;
        case "breadcrumbIcon":
          this.breadcrumbIcon = value;
          break;
        case "tabs":
          this.tabs = value;
          break;
        case "tabsIcon":
          this.tabsIcon = value;
          break;
        case "footer":
          this.footer = value;
          break;
        default:
          console.warn(`Invalid key: ${key}`);
          break;
      }
    }    
    
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
