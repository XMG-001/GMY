<template>
    <div class="demo-pagination-block">
        <el-pagination :default-current-page="defaultCurrentPage" :default-page-size="defaultPageSize"
            :pager-count="pagerCount" :v-model:current-page="currentPage" :v-model:page-size="pageSize"
            :page-sizes="pageSizes" :size="size" :disabled="disabled" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import usePagingInfoStore from '../store/modules/pagingInfo';

const pagingInfo = usePagingInfoStore();

const total = computed(() => pagingInfo.total);

const currentPage = computed(() => pagingInfo.currentPage);
const pageSize = computed(() => pagingInfo.pageSize);

const defaultCurrentPage = computed(() => pagingInfo.currentPage);
const defaultPageSize = computed(() => pagingInfo.pageSize);

const size = ref('small')
const pagerCount = ref(5)
const pageSizes = ref([2, 5, 10, 20, 30, 40, 50])
const disabled = ref(false)
const background = ref(true)

//具体对象前要加()=>
// watch(() => pagingInfo.total, () => {
//     total.value = pagingInfo.total
// })

//computed也能达到效果
// const getTotal = computed(() => {
//     return pagingInfo.total;
// })

const handleCurrentChange = (val: number) => {
    pagingInfo.setData(val, pageSize.value)
    // currentPage.value = pagingInfo.currentPage
    console.log(`当前页: ${currentPage.value}`)
}

const handleSizeChange = (val: number) => {
    pagingInfo.setData(currentPage.value, val)
    // pageSize.value = pagingInfo.pageSize
    console.log(`${pageSize.value} 条/页`)
}

</script>

<script lang="ts">

</script>

<style scoped>
.demo-pagination-block {
    justify-content: center;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
}
/* 
:deep(.el-pagination.is-background .el-pager li.is-active){
    background-color: var(--gmy-theme-color);
}
:deep(.el-pagination.is-background .el-pager li:hover){
    color: var(--gmy-theme-color);
} */

/* ::v-deep .el-pagination{
} */
</style>