<template>
    <el-container class="layout-container-demo" style="height: 100%">
        <el-aside class="jx-aside" :class="[
            { 'is-collapsed ': settingStore.isCollapse },
            { 'jx-aside-theme': settingStore.primary == DEFAULT_PRIMARY }
        ]">
            <slot name="aside"></slot>
        </el-aside>

        <el-container>
            <el-header class="jx-header">
                <slot name="header"></slot>
            </el-header>
            <TabMenu v-show="settingStore.tabs"></TabMenu>

            <el-main class="jx-main">
                <slot name="main"></slot>
            </el-main>
            <el-footer v-show="settingStore.footer" class="jx-footer">
                <slot name="footer"></slot>
            </el-footer>
        </el-container>
    </el-container>

</template>

<script lang="ts" setup>
import TabMenu from './modules/TabMenu.vue';
import useSettingStore from '@/store/modules/setting';
import { DEFAULT_PRIMARY } from '@/config'

const settingStore = useSettingStore();

</script>

<script lang="ts">

export default {


}

</script>

<style scoped>
.layout-container-demo .el-header {
    position: relative;
    padding: 0;
    box-sizing: border-box;
    background-color: var(--el-bg-color);
    color: var(--el-text-color-primary);
    border-bottom: 1px solid #ddd;
}

.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    /* background: var(--el-color-primary-light-8); */
}

.layout-container-demo .el-menu {
    border-right: none;
}

/* .layout-container-demo .el-main {
} */

.jx-aside-theme {
    background: linear-gradient(to top left, #88aaff, #521baa) !important;
}

.jx-aside {
    /* #95bbfd */
    background: linear-gradient(to top left, var(--el-color-primary-light-5), var(--el-color-primary-dark-2));
    position: relative;
    width: 200px;
    transition: width 0.3s;
    /* 平滑过渡效果 */
}

.jx-header {
    height: 50px;
}

.jx-main {
    padding: 10px 12px;
    overflow-x: hidden;
    box-sizing: border-box;
    background: #f1f1f1;
}

.jx-footer {
    height: 30px;
}

.is-collapsed {
    width: calc(1px + var(--el-menu-icon-width) + var(--el-menu-base-level-padding)* 2);
    /* 折叠后的宽度 */
}

/* ::v-deep .el-menu {
    background-color: aqua;
} */
</style>