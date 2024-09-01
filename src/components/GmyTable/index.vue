<template>
    <div class="gmy-table">
        <el-table ref="tableRef" :data="tableData" :row-key="rowKey"
        :tree-props="treeProps" :stripe="stripe" :border="border" :size="size" style="width: 100%"
            @selection-change="emitSelectionChange" :default-expand-all="defaultExpandAll">
            <el-table-column v-for="(column, index) in columns" 
                :key="index" 
                :type="column.type || undefined"
                :prop="column.prop" 
                :label="column.label" 
                :width="column.width || undefined" 
                :align="column.align || 'center'"
                :sortable="column.sortable || false" 
                :fixed="column.fixed || false"
                :show-overflow-tooltip="column.showOverflowTooltip || true">
                <!-- 如果定义了插槽名，使用插槽 -->
                <template v-if="column.slotName" #default="scope">
                    <slot :name="column.slotName" :scope="scope"></slot>
                </template>
                <!-- 如果没有插槽名且不是特定类型的列，展示默认内容 -->
                <template v-else-if="!column.type" #default="scope">
                    {{ scope.row[column.prop] }}
                </template>
            </el-table-column>
        </el-table>
        <div class="gmy-table-paging">
            <Paging :total="dataTotal" @emitPageInfo="emitPageInfo"></Paging>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits, defineExpose } from 'vue';
import Paging from './components/Paging.vue';
import { ElTable } from 'element-plus'


const props = defineProps({
    config: {
        type: Object,
        required: true,
        default: () => ({
            columns: [],
            data: [],
            options: {},
        }),
    }
});
const emits = defineEmits(['selection-change', 'pageInfo']);

const emitSelectionChange = (selection) => {
    emits('selection-change', selection);
};
const emitPageInfo = (val) => {
    emits('pageInfo', val);
};

const hasData = computed(() => {
    return Array.isArray(props.config.data) && props.config.data.length > 0;
});

const columns = computed(() => props.config.columns);
const tableData = computed(() => props.config.data);
const dataTotal = computed(() => props.config.dataTotal);

const options = computed(() => props.config.options || {});

const stripe = computed(() => options.value.stripe || false);
const border = computed(() => options.value.border || true);
const size = computed(() => options.value.size || 'default');
const rowKey = computed(() => options.value.rowKey || 'id');
const treeProps = computed(() => options.value.treeProps || { children: 'children'});
const defaultExpandAll = computed(() => options.value.defaultExpandAll || false);


const tableRef = ref<InstanceType<typeof ElTable>>()

const toggleSelection = (rows) => {
    if (rows) {
        rows.forEach((row) => {
            // TODO: improvement typing when refactor table
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            tableRef.value!.toggleRowSelection(row, undefined)
        })
    } else {
        tableRef.value!.clearSelection()
    }
}
// 使用 defineExpose 来暴露方法
defineExpose({
    toggleSelection,
});

</script>

<style scoped>
.gmy-table {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.gmy-table-paging {
    margin-top: 20px;
    position: relative;
    min-height: 60px;
    max-height: 60px;;
}

/* :deep(.el-table__placeholder){
    display: none;
} */
</style>