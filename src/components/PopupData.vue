<script setup>
import { ref } from 'vue';
import Popup from './Popup.vue';

// 弹窗内容数据
const popups = [
  { id: 1, title: '欢迎您来到我们的纪念空间！', content: '<p style="text-align:center;">遥望去年今日，有请两位主角登场！</p><p>⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣</p><br><img style="width:100%;height:100%" src=""/>' },
  { id: 2, title: '让我们一起回味这一段旅程吧！', content: '<p>1️⃣欢迎来到我们的纪念空间！😁</p><p>2️⃣点击图片可以放大噢~😊</p><p>3️⃣点击右上角可以开关背景音乐！⚠️</p><p>4️⃣空间还有不足之处，有待完善，还请见谅！😏</p><p>5️⃣有任何问题可以☎️13556650166</p>'},
];

const currentPopupIndex = ref(0);

// 关闭弹窗方法
const closePopup = () => {
  if (currentPopupIndex.value < popups.length - 1) {
    currentPopupIndex.value++; // 显示下一个弹窗
  } else {
    currentPopupIndex.value = null; // 所有弹窗关闭
  }
};
</script>

<template>
  <!-- 弹窗组件 -->
  <Popup v-if="currentPopupIndex !== null" :popup="popups[currentPopupIndex]" @close="closePopup">
    <template #header="{ popup }">
      <h2>{{ popup.title }}</h2>
    </template>
    <template #content="{ popup }">
      <div v-html="popup.content"></div>
    </template>
  </Popup>
</template>

<style scoped>
</style>
