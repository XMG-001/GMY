<template>
  <div class="header-top" ref="headerTop">
    <div class="header-left">
      <div v-if="true" class="header-aside flex-center">
        <img src="@/assets/tomato.webp" style="height: 100%" />
        <h3>GMY-管理平台</h3>
      </div>
      <AsideMenu :menuConfig="menuConfig"></AsideMenu>
    </div>

    <div class="header-right" ref="headerRight">
      <div class="toolbar">
        <el-icon>
          <MoreFilled />
        </el-icon>
        <el-icon>
          <Search />
        </el-icon>
        <!-- <el-icon><Brush /></el-icon> -->
        <el-icon>
          <Bell />
        </el-icon>
        <el-icon @click="reload">
          <Refresh />
        </el-icon>
        <el-tooltip :content="settingStore.maximize ? '退出全屏' : '全屏'" effect="dark">
          <el-icon @click="toggleFullscreen">
            <FullScreen />
          </el-icon>
        </el-tooltip>

        <Setting></Setting>
      </div>
    </div>
    <Personal></Personal>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "../modules/Breadcrumb.vue";
import Setting from "../modules/Setting.vue";
import Personal from "@/components/Personal.vue";
import useSettingStore from "@/store/modules/setting";
import AsideMenu from "../modules/AsideMenu.vue";
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useFullscreen } from "@/hooks/useFullscreen";
import { DEFAULT_PRIMARY } from "@/config";
import { getCssRoot } from "@/utils/color";

const settingStore = useSettingStore();

const primaryColor = getCssRoot("--el-color-primary-light-2");

const menuConfig = computed(() => {
  return {
    mode: "horizontal",
    backgroundColor: "transparent",
    textColor: "#000",
    activeTextColor: primaryColor,
    style: "background-color: transparent;",
  };
});

const reload = () => {
  window.location.reload();
}

const headerTop = ref<HTMLElement | null>(null);
const headerRight = ref<HTMLElement | null>(null);

const isBreadcrumbVisible = ref(true);

const { isFullscreen, toggleFullscreen } = useFullscreen();
watch(isFullscreen, () => {
  settingStore.setGlobalState("maximize", isFullscreen);
})

const mediaQuery = window.matchMedia("(max-width: 768px)");

// 处理屏幕宽度变化
const updateBreadcrumbVisibility = () => {
  isBreadcrumbVisible.value = !mediaQuery.matches;
};

onMounted(() => {
  // 初始化时设置一次
  updateBreadcrumbVisibility();

  // 添加监听器
  mediaQuery.addEventListener("change", updateBreadcrumbVisibility);
});

onUnmounted(() => {
  // 组件卸载时移除监听器
  mediaQuery.removeEventListener("change", updateBreadcrumbVisibility);
});
</script>

<style></style>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
}

.el-menu {
  width: 100%;
  height: 50px;
  border-right: none;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  color: var(--el-color-primary-light-9) !important;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  color: var(--el-text-color-primary);
}

:deep(.el-menu--horizontal > .el-sub-menu .el-sub-menu__title) {
  color: var(--el-text-color-primary);
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom: none;
  color: var(--el-color-primary-light-9);
  background-color: var(--gmy-theme-color);
}

:deep(.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title) {
  border-bottom: none;
  color: var(--el-color-primary-light-9);
  background-color: var(--gmy-theme-color);
}

.header-top {
  height: 50px;
  width: 100%;
  padding: 0 0 0 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  /* 确保子元素不会超出 */
}

.header-left {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  flex: 1;
}

.header-right {
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /*注意，这里要设置成flex-start，不能是center，否则会显示不完全*/
  overflow-x: auto;
  /* 横向滚动 */
  overflow-y: hidden;
  /* 如果只需要横向滚动 */
  white-space: nowrap;
  /*防止内容换行，从而触发横向滚动 */
  min-width: 80px;
}

.is-collapse {
  display: flex;
  justify-content: center;
  width: 50px;
}

.is-collapse .el-icon {
  transition: transform 0.3s ease-in-out;
  /* 平滑过渡效果 */
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 添加一个类来表示旋转状态 */
.rotate {
  /* transform: rotate(180deg); */
  transform: scale(-1, 1);
  /* 水平镜像翻转 */
}

.toolbar .el-icon {
  cursor: pointer;
  margin: 0 10px;
  font-size: 20px;
  transition: transform 0.3s ease-in-out;
}

.toolbar .el-icon:hover {
  transform: scale(1.1);
}

.header-aside {
  width: 250px;
  height: 50px;
  text-align: center;
}

h3 {
  color: #2f2f2f;
  white-space: nowrap;
  overflow: hidden;
}
</style>
