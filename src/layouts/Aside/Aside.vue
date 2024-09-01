<template>
    <div class="aside-header flex-center">
        <img src="@/assets/tomato.webp" style="height: 100%;">
        <h3 v-if="!settingStore.isCollapse">GMY-管理平台</h3>
    </div>
    <el-scrollbar style="height:calc(100% - 110px);">
        <AsideMenu :menuConfig="menuConfig"></AsideMenu>
    </el-scrollbar>

    <Personal></Personal>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import useSettingStore from '@/store/modules/setting';
import { Menu as IconMenu, Setting } from '@element-plus/icons-vue'
import AsideMenu from '../modules/AsideMenu.vue';
import Personal from '@/components/Personal.vue';
import { getCssRoot } from '@/utils/color';

const settingStore = useSettingStore();

const primaryColor = getCssRoot('--el-color-primary');
const darkTwo = getCssRoot('--el-color-primary-dark-2');
const lightNine = getCssRoot('--el-color-primary-light-9')

const menuConfig = computed(() => {
    return {
        mode: "",
        backgroundColor: primaryColor ,//一定要是transparent
        textColor: lightNine,
        activeTextColor: darkTwo,
        style: ""
    }
})

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}

</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    /* min-height: 400px; */
}

.aside-header {
    background: #00000008;
    width: 100%;
    height: 50px;
    text-align: center;

}

h3 {
    color: #2f2f2f;
    white-space: nowrap;
    overflow: hidden;
}

:deep(.el-menu-item.is-active){
    background: linear-gradient(45deg,
            var(--el-color-primary-light-6),
            var(--el-color-primary-light-5),
            var(--el-color-primary-light-3),
            var(--el-color-primary-light-5),
            var(--el-color-primary-light-6));
    background-size: 400% 400%;
    animation: gradientRotation 5s linear infinite;
}
/* 更炫酷的动画效果 */
@keyframes gradientRotation {
    0% {
        background-position: 0% 0%;
        /* transform: rotate(0deg); */
    }
    25% {
        background-position: 100% 100%;
        /* transform: rotate(10deg); */
    }
    50% {
        background-position: 0% 0%;
        /* transform: rotate(0deg); */
    }
    75% {
        background-position: 0% 0%;
        /* transform: rotate(-10deg); */
    }
    100% {
        background-position: 0% 0%;
        /* transform: rotate(0deg); */
    }
}

</style>

<style>
</style>