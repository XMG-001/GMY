<template>
        <div class="gmy-bg">
        </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.gmy-bg {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-image: url('@/assets/gmy.webp');
    background-repeat: no-repeat;
    background-position: center;
    /* 背景图居中 */
    background-size: contain;
    /* 背景图将完整显示在容器内 */
    filter: blur(5px);
    /* 毛玻璃效果，模糊半径为5px */
    z-index: 0;
}

</style>