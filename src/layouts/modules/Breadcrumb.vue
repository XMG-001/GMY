<template>
    <div class="breadx">
        <el-breadcrumb :separator-icon="ArrowRight" style="display: flex;">
            <el-breadcrumb-item :to="{ path: HOME_URL }">
                <el-icon v-show="settingStore.breadcrumbIcon"><component  :is="home.icon"></component></el-icon>
                <span>{{ home.menuName }}</span></el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index" :to="{ path: item.path ? item.path : undefined }">
                <el-icon v-show="settingStore.breadcrumbIcon"><component  :is="item.icon"></component></el-icon>
                <span>{{ item.menuName }}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
import useMenuInfoStore from '@/store/modules/menuInfo';
import useSettingStore from '@/store/modules/setting';
import { watch, watchEffect, ref, computed } from 'vue';
import { HOME_URL } from '@/config';

const route = useRoute();
const menuInfoStore = useMenuInfoStore();
const settingStore = useSettingStore();

const breadcrumb = ref([]);

const home = computed(() => {
    return menuInfoStore.menuList[0] || [];
})

const findMenuItem = (menuList, activePath, indexPath = []) => {
    for (let i = 0; i < menuList.length; i++) {
        let item = menuList[i];
        let currentIndexPath = [...indexPath, i];

        if (item.path === activePath) {
            return { item: item, indexPath: currentIndexPath };
        }
        if (item.children && item.children.length > 0) {
            let result = findMenuItem(item.children, activePath, currentIndexPath);
            if (result) {
                return result;
            }
        }
    }
    return null;
};

const handleChangeTab = () => {
    const mList = menuInfoStore.menuList;
    const activePath = route.path;
    const result = findMenuItem(mList, activePath);
    // 用来存储新数组的变量
    const newResult = [];
    if (result && result.indexPath[0] !== 0) {
        let currentElement = mList;
        let indices = result.indexPath;
        for (let i = 0; i < indices.length; i++) {
            currentElement = currentElement[indices[i]];
            newResult.push(currentElement);
            if (currentElement.children) {
                currentElement = currentElement.children
            }
        }
        breadcrumb.value = newResult;
    }
    else {
        breadcrumb.value = [];
    }
};


// 使用 watch 来观察响应式数据的变化
watch(() => route.path, () => handleChangeTab(), { immediate: true });
// watch(() => menuInfoStore.menuList, () => handleChangeTab(), { immediate: true });


</script>

<style scoped>
.breadx {
    display: flex;
}

.el-breadcrumb__icon {
    color: var(--el-text-color-placeholder);
}

.el-breadcrumb .el-icon {
    vertical-align: middle;
}

.el-breadcrumb span {
    vertical-align: middle;
    margin-left: 4px;
}
</style>
