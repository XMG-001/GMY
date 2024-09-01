<template>
    <div class="header-top" ref="headerTop">

        <div class="header-left">
            <div class="is-collapse">
                <el-icon size="20" :class="{ 'rotate': settingStore.isCollapse }" @click="changeCollapse">
                    <Fold />
                </el-icon>
            </div>
            <Breadcrumb v-show="settingStore.breadcrumb && isBreadcrumbVisible"></Breadcrumb>
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
    </div>
</template>

<script setup lang="ts">
import Breadcrumb from '../modules/Breadcrumb.vue';
import Setting from '../modules/Setting.vue';
import useSettingStore from '@/store/modules/setting';
import TabMenu from '../modules/TabMenu.vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useFullscreen } from '@/hooks/useFullscreen'

const settingStore = useSettingStore();

const changeCollapse = () => {
    settingStore.setIsCollapse();
}

const headerTop = ref<HTMLElement | null>(null);
const headerRight = ref<HTMLElement | null>(null);

const reload = () => {
    window.location.reload();
}

const isBreadcrumbVisible = ref(true);

const { isFullscreen, toggleFullscreen } = useFullscreen();
watch(isFullscreen, () => {
    settingStore.setGlobalState("maximize", isFullscreen);
})


const mediaQuery = window.matchMedia('(max-width: 768px)');

// 处理屏幕宽度变化
const updateBreadcrumbVisibility = () => {
    isBreadcrumbVisible.value = !mediaQuery.matches;
};

onMounted(() => {
    // 初始化时设置一次
    updateBreadcrumbVisibility();

    // 添加监听器
    mediaQuery.addEventListener('change', updateBreadcrumbVisibility);
});

onUnmounted(() => {
    // 组件卸载时移除监听器
    mediaQuery.removeEventListener('change', updateBreadcrumbVisibility);
});
</script>

<style scoped>
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
</style>