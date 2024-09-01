
<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>


<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { nextTick, provide, ref } from "vue"

const isRouter = ref(true)
const reload = () => {
    isRouter.value = false
    nextTick(() => {
        isRouter.value = true
    })
}
provide("reload", reload)
</script>


<style>
@import url(./styles/index.scss);
</style>
