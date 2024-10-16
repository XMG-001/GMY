<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    class="demo-tabs"
    @tab-remove="removeTab"
    @tab-change="changeTab"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="item.close"
    >
      <template #label>
        <span class="custom-tabs-label">
          <el-icon v-show="settingStore.tabsIcon">
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import Sortable from "sortablejs";
import { ref, reactive, computed, watch, onMounted, watchEffect } from "vue";
import router from "@/router";
import { onBeforeRouteUpdate, onBeforeRouteEnter, useRoute } from "vue-router";
import useTabInfoStore from "@/store/modules/tabInfo";
import useSettingStore from "@/store/modules/setting";

const route = useRoute();

const tabInfoStore = useTabInfoStore();
const settingStore = useSettingStore();

const banAddTab = ref(false);

// 初始化 tabs
tabInfoStore.initializeTabs();

// 监听 homeTab 的变化并更新 editableTabs
watch(
  () => tabInfoStore.homeTab,
  (newHomeTab) => {
    tabInfoStore.editableTabs[0] = newHomeTab;
  }
);

//由于v-model，不设置成计算属性
const editableTabsValue = ref(tabInfoStore.editableTabsValue);
watch(
  () => tabInfoStore.editableTabsValue,
  () => {
    editableTabsValue.value = tabInfoStore.editableTabsValue;
  }
);

const editableTabs = computed(() => tabInfoStore.editableTabs);

onMounted(() => {
  tabsDrop();
});

// tabs 拖拽排序
const tabsDrop = () => {
  Sortable.create(document.querySelector(".el-tabs__nav") as HTMLElement, {
    draggable: ".el-tabs__item",
    animation: 300,
    onEnd({ newIndex, oldIndex }) {
      const tabsList = [...editableTabs.value];
      const currRow = tabsList.splice(oldIndex as number, 1)[0];
      tabsList.splice(newIndex as number, 0, currRow);
      tabInfoStore.setEditableTabs(tabsList);
    },
  });
};

//监听不重新渲染的路由变化
watchEffect(() => {
  let activePath = route.path;
  let activeTitle = route.meta.title || route.name;
  let activeIcon = route.meta.icon || "Menu";
  let activeTab = tabInfoStore.filterTab(activePath);
  if (activeTab) {
    tabInfoStore.setEditableTabsValue(activeTab.name);
  } else if (!banAddTab.value) {
    if (route.params.testId) {
      activeTitle = `${route.meta.title}: ${route.params.testId}`; //硬编码，记得改
    }
    console.log("add tab");
    tabInfoStore.addTab(activeTitle, activePath, activeIcon);
  }
});

// watch加上immediate也行
// watch(() => route.path, (newPath, oldPath) => {
//     console.log('New Path:', newPath);
//     console.log('Old Path:', oldPath);

//     if (newPath) {
//         if (oldPath !== undefined) {
//             let activePath = route.path;
//             let activeTitle = route.name;
//             let activeTab = tabInfoStore.filterTab(activePath)
//             if (activeTab) {
//                 tabInfoStore.setEditableTabsValue(activeTab.name);
//             } else {
//                 tabInfoStore.addTab(activeTitle, activePath);
//             }
//         }
//     }
// }, { immediate: true });

// onBeforeRouteUpdate((to, from, next) => {
//     if (to.path !== from.path) {
//         let activePath = to.path;
//         let activeTitle = to.name;
//         let activeTab = tabInfoStore.filterTab(activePath)
//         if (activeTab) {
//             tabInfoStore.setEditableTabsValue(activeTab.name);
//         } else {
//             tabInfoStore.addTab(activeTitle, activePath);
//         }
//     } else {
//         console.log('same path');
//     }
//     next();
// })

const changeTab = async (targetName: string) => {
  const targetTab = editableTabs.value.find((tab) => tab.name === targetName);
  if (targetTab) {
    try {
      await router.push(targetTab.path);
    } catch (error) {
      console.error("选择标签错误:", error);
    }
  } else {
    console.error(`标签名 "${targetName}" not found.`);
  }
};

const removeTab = (targetName: string) => {
  const tabs = editableTabs.value;
  let activeName = editableTabsValue.value;
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
        }
      }
    });
  }

  tabInfoStore.setEditableTabsValue(activeName);
  const filterEditableTabs = tabs.filter((tab) => tab.name !== targetName);
  tabInfoStore.setEditableTabs(filterEditableTabs);
  // 调用一个异步函数来处理router.push
  const handleChangeTab = async () => {
    banAddTab.value = true;
    await changeTab(activeName);
    banAddTab.value = false;
  };
  handleChangeTab();
};
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  display: none;
}

.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}

.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}

.el-tabs__header {
  margin: 0;
}

.el-tabs--border-card {
  box-sizing: border-box;
  /* border: none; */
}

.el-tabs--border-card > .el-tabs__header {
  /* border: none; */
  background: #fff;
  box-sizing: border-box;
  height: 40px;
  margin: 0;
}

:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #afafaf;
  border: none;
}

:deep(.el-tabs__item) {
  color: #afafaf;
  font-weight: 520;
}

:deep(.el-tabs__item.is-active) {
  color: var(--gmy-theme-color);
}

:deep(.el-tabs__item:hover) {
  color: var(--gmy-theme-color);
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item.is-active) {
  border-bottom: 2px solid var(--gmy-theme-color);
}

/* .el-tabs--card>.el-tabs__header .el-tabs__item {
} */
:deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border-top: none;
  border-bottom: none;
}
</style>
<style>
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom: 2px solid var(--gmy-theme-color);
}
</style>
