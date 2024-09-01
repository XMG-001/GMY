<template>
  <el-watermark
    id="watermark"
    :font="font"
    :content="watermark ? [userInfoStore.userInfo.username || 'GMY Admin'] : ''"
    style="height: 100%"
  >
    <component :is="layout">
      <template #aside>
        <Aside :key="settingStore.randomKey"></Aside>
      </template>
      <template #header>
        <component :key="settingStore.randomKey" :is="layoutHeader"></component>
      </template>

      <template #main>
        <Main></Main>
      </template>
      <template #footer>
        <Footer></Footer>
      </template>
    </component>
  </el-watermark>
</template>

<script lang="ts" setup>
import Aside from "./Aside/Aside.vue";
import Header from "./Header/Header.vue";
import HeaderTransverse from "./Header/HeaderTransverse.vue";
import Main from "./Main/Main.vue";
import Footer from "./Footer/Footer.vue";
import Layout from "./Layout.vue";
import LayoutTransverse from "./LayoutTransverse.vue";
import { ref, computed, reactive, onMounted } from "vue";
import useSettingStore from "@/store/modules/setting";
import useUserInfoStore from "@/store/modules/userInfo";
import { ElNotification } from "element-plus";
import { getTimeState } from "@/utils";

onMounted(() => {
  ElNotification({
    title: `${userInfoStore.userInfo.username},${getTimeState()}`,
    //message:,
  });
});

const settingStore = useSettingStore();
const userInfoStore = useUserInfoStore();

const layout = computed(() => {
  switch (settingStore.layout) {
    case "transverse":
      return LayoutTransverse;
    default:
      return Layout;
  }
});

const layoutHeader = computed(() => {
  switch (settingStore.layout) {
    case "transverse":
      return HeaderTransverse;
    default:
      return Header;
  }
});

const watermark = computed(() => settingStore.watermark);
const font = reactive({ color: "rgba(0, 0, 0, .15)" });
</script>

<style scoped>
@media screen and (max-width: 768px) {
}
</style>
