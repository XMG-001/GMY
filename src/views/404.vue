<template>
    <el-result title="404" sub-title="页面不存在">
        <template #icon>
            <el-image
                src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" />
        </template>
        <template #extra>
            <router-link :to="{name : 'Gmy'}"><el-button type="primary">返回首页</el-button></router-link>
            <p><label for="testId">testId: </label><input v-model="test" type="text" name="" id="testId"></p>
        </template>
    </el-result>
</template>


<script setup lang="ts">
import {ref,onMounted} from 'vue'
import {useRoute } from 'vue-router';

const route = useRoute()
const test = ref(route.params.testId)


</script>

<style scoped>
.el-result{
    position: relative;
    z-index: 5;
}
</style>