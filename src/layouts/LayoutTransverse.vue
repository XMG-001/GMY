<template>
    <el-container class="layout-container-demo" style="height: 100%">
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

</template>

<script lang="ts" setup>
import TabMenu from './modules/TabMenu.vue';
import useSettingStore from '@/store/modules/setting';

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

.layout-container-demo .el-menu {
    border-right: none;
}

/* .el-main {
    z-index: 4;
} */

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


/* ::v-deep .el-menu {
    background-color: aqua;
} */
</style>