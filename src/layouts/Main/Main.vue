<template>
    <div class="card main-bg">
        <router-view v-slot="{ Component, route }">
            <transition-group name="MainFade" :key="route.path">
                <!-- :include="" -->
                <keep-alive :key="route.path">
                    <component :is="Component" :key="route.path" />
                </keep-alive>
            </transition-group>
        </router-view>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
/* 渐变设置 */
.MainFade-enter-from,
.MainFade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}

.MainFade-enter-to,
.MainFade-leave-from {
    opacity: 1;
}

.MainFade-enter-active {
    transition: all 0.7s ease;
}

.MainFade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.6, 0.6, 1);
}

.main-bg {
    position: relative;
    height: 100%;
}

@media screen and (max-width: 768px) {}
</style>