<template>
    <el-sub-menu v-if="hasChildren" :index="props.index">
        <template #title>
            <el-icon v-if="hasIcon">
                <component :is="props.item.icon"></component>
            </el-icon>
            <span>{{ props.item.menuName }}</span>
        </template>
        <MenuItem v-for="(child, childIndex) in props.item.children" :key="childIndex" :item="child"
            :index="child.path || child.id.toString()">            <!-- `${props.index}-${childIndex}` -->
        </MenuItem>
    </el-sub-menu>

    <el-menu-item v-else :index="props.index">
        <el-icon v-if="hasIcon">
            <component :is="props.item.icon"></component>
        </el-icon>
        <span>{{ props.item.menuName }}</span>
    </el-menu-item>
</template>

<script lang="ts" setup>

const props = defineProps({
    item: {
        type: Object,
        default: {},
    },
    index: {
        type: String,
        required: true,
    },
});

const hasChildren = props.item.children && props.item.children.length > 0;
const hasIcon = props.item.icon && props.item.icon.length > 0;
</script>

<style lang="scss" scoped></style>