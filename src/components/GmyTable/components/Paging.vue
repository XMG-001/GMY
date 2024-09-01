<template>
    <div class="demo-pagination-block">
        <el-pagination :default-current-page="defaultCurrentPage" :default-page-size="defaultPageSize"
            :pager-count="pagerCount" :v-model:current-page="currentPage" :v-model:page-size="pageSize"
            :page-sizes="pageSizes" :size="size" :disabled="disabled" :background="background"
            layout="total, sizes, prev, pager, next, jumper" :total="props.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineProps,defineEmits} from 'vue';


const currentPage = ref(1)
const pageSize = ref(10)

const defaultCurrentPage = ref(1)
const defaultPageSize = ref(10)

const size = ref('small')
const pagerCount = ref(5)
const pageSizes = ref([2, 5, 10, 20, 30, 40, 50])
const disabled = ref(false)
const background = ref(true)

const props = defineProps({
    total: {
        type: Number,
        required: true,
        default: 0
    },
});

const emits = defineEmits(['emitPageInfo']);
const emitPageInfoSunzi = () => {
    let val = {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
    }
    emits('emitPageInfo', val);
};

const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    defaultCurrentPage.value = val;
    emitPageInfoSunzi();
    console.log(`当前页: ${currentPage.value}`)
}

const handleSizeChange = (val: number) => {
    pageSize.value = val;
    defaultPageSize.value = val;
    emitPageInfoSunzi();
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
</style>