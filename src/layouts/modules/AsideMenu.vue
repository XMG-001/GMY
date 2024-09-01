<template>
    <el-menu :mode="props.menuConfig.mode || undefined" router :default-active="defaultActive" :default-openeds="[]"
        class="el-menu-vertical-demo" :collapse="settingStore.isCollapse" @select="handleSelect" @open="handleOpen"
        :unique-opened = "settingStore.accordion"
        :background-color="props.menuConfig.backgroundColor || 'transparent'"
        :text-color="props.menuConfig.textColor || '#000'"
        :active-text-color="props.menuConfig.activeTextColor || '#f1f1f1'"
        :style="props.menuConfig.style || 'background-color: transparent;'">
        <!-- 递归生成菜单 -->
        <MenuItem v-for="(item, index) in menuList" :key="index" :item="item" :index="item.path || item.id.toString()">
        </MenuItem>
    </el-menu>
</template>

<script lang="ts" setup>
import { ref, computed, watch, reactive, watchEffect } from "vue";
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import MenuItem from "./MenuItem.vue";
import useSettingStore from '@/store/modules/setting';
import useMenuInfoStore from "@/store/modules/menuInfo";
import { getCssRoot } from '@/utils/color';


const darkTwo = getCssRoot('--el-color-primary-dark-2');

watch(() => darkTwo, () => {
    document.documentElement.style.setProperty("--el-menu-bg-color", darkTwo);
    document.documentElement.style.setProperty("--el-menu-active-color", darkTwo);
    document.documentElement.style.setProperty("--el-menu-hover-bg-color", darkTwo);
})

const props = defineProps(['menuConfig']);

const settingStore = useSettingStore();
const menuInfoStore = useMenuInfoStore();
const route = useRoute();

const defaultActive = computed(() => {
    return settingStore.currentPath.path;
});

// @open="handleOpen" @close="handleClose"
// const handleOpen = (key: string, keyPath: string[]) => {
//     // keyPath = keyPath.filter((item, index) => keyPath.indexOf(item) === index);//暂时去除重复项,时间复杂度高，所以用set
//     let uniqueKeyPath = [...new Set(keyPath)];//展开运算符...是必要的，因为Set对象本身不支持数组的方法，如map、filter等，因此我们需要将其转换回数组以使用这些方法。
//     console.log(key, uniqueKeyPath)
// }
// const handleClose = (key: string, keyPath: string[]) => {
//     let uniqueKeyPath = [...new Set(keyPath)];
//     console.log(key, uniqueKeyPath)
// }
const handleSelect = (key: string, keyPath: string[]) => {
    let uniqueKeyPath = [...new Set(keyPath)];
    console.log(key, uniqueKeyPath, route.meta.title)
}
const handleOpen = (key: string, keyPath: string[]) => {
    let uniqueKeyPath = [...new Set(keyPath)];
    console.log(key, uniqueKeyPath, route.meta.title)
}

const menuList = computed(() => {
    return menuInfoStore.menuList;
})
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    /* min-height: 400px; */
}

.el-menu {
    border-right: none;
    --el-menu-active-color: var(--el-color-primary) !important;
    --el-menu-text-color: var(--el-color-primary-light-9) !important;
    --el-menu-hover-text-color: var(--el-color-primary-light-9) !important;
    --el-menu-bg-color: var(--el-fill-color-blank) !important;
    --el-menu-hover-bg-color: var(--el-color-primary) !important;
}

</style>
