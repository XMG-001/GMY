<template>
    <div class="table-container">
        <div class="table-header">
            <div class="search-container">
                <SearchForm v-model:info="tableConfig.searchModel" @submitSearchForm="handleSearchForm"></SearchForm>
            </div>
            <div class="table-tool">
                <el-button type="primary" @click="">新增</el-button>
                <el-button type="info" :disabled="!isbatchDelete" @click="toggleSelection()">清除选中项</el-button>
                <el-button v-if="hasRoles(['GMY'])" type="danger" :disabled="!isbatchDelete"
                    @click="batchDelete()">批量删除</el-button>
            </div>
        </div>
        <!-- 
        pageInfo事件会返回参数
        {
            currentPage: 当前页码,
            pageSize: 每页显示条数
        }
        -->
        <div class="table-main">
            <GmyTable ref="gmyTableRef" :config="tableConfig" @selection-change="handleSelectionChange"
                @pageInfo="handlePageInfo">
                <!-- 自定义操作列 -->
                <template #type="{ scope }">
                    <el-popover effect="light" trigger="hover" placement="bottom" width="auto">
                        <template #default>
                            <div>sort: {{ scope.row.sort }}</div>
                            <div>status: {{ scope.row.status }}</div>
                            <div>creatorId: {{ scope.row.creatorId }}</div>
                            <div>createTime: {{ scope.row.createTime }}</div>
                            <div>ts: {{ scope.row.ts }}</div>
                        </template>
                        <template #reference>
                            <el-tag v-if="scope.row.type === 1">目录</el-tag>
                            <el-tag v-else-if="scope.row.type === 2">菜单</el-tag>
                            <el-tag v-else-if="scope.row.type === 3">按钮</el-tag>
                            <el-tag v-else>未知</el-tag>
                        </template>
                    </el-popover>
                </template>
                <template #icon="{ scope }">
                    <el-icon>
                        <component :is="scope.row.icon"></component>
                    </el-icon>
                </template>
                <template #status="{ scope }">
                    <el-switch v-model="scope.row.status"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" :active-value=1
                        :inactive-value=0 />
                </template>

                <template #operation="{ scope }">
                    <el-button link type="primary" size="small">
                        <el-icon>
                            <View />
                        </el-icon>查看
                    </el-button>
                    <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">
                        <el-icon>
                            <EditPen />
                        </el-icon>编辑
                    </el-button>
                    <el-button link type="primary" size="small">
                        <el-icon>
                            <Refresh />
                        </el-icon>重置
                    </el-button>
                    <el-button :disabled="!hasRoles(['GMY'])" link type="danger" size="small"
                        @click="handleDelete(scope.$index, scope.row)">
                        <el-icon>
                            <Delete />
                        </el-icon>删除
                    </el-button>
                </template>
            </GmyTable>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed } from 'vue'
import GmyTable from '@/components/GmyTable/index.vue';
import { ElMessage } from 'element-plus'
import SearchForm from '@/components/GmyTable/components/SearchForm.vue'
import { CODE_SUCCESS } from '../api/helper/codeStatus';
import { getAllMenuByPageFn, deleteMenuByIdFn } from '@/api/modules/menu';
import { useHandleData } from '@/hooks/useHandleData';
import { hasRoles } from '@/hooks/useHasRoles'

//面向对象
interface Menu {
    id: string;
    parentId: string;
    menuName: string;
    type: number;
    icon: string;
    path: string;
    auth: string;
    sort: number;
    status: number;
    creatorId: string;
    createTime: string;
    ts: string;
    deleteFlag: number;
    children?: Menu[];
}

const searchPayloads = reactive({
    menuName: '',
    auth: '',
    currentPage: 1,
    pageSize: 10,
});


onMounted(() => {
    selectDataInfo();
});

const tableConfig = reactive({
    // data 响应的值
    // placeholder 输入框的提示文字
    // prefixIcon 输入框的前缀图标el-icon
    searchModel: {
        menuName: { data: '', placeholder: '请输入菜单名', prefixIcon: 'Menu' },
        auth: { data: '', placeholder: '请输入权限' },
    },
    //showOverflowTooltip超出时隐藏
    columns: [
        { type: 'selection', width: '60' }, // 选择框列
        // { type: 'index', label: '#', width: '60' }, // 索引列
        // { type: 'expand', label: '#', width: '60' }, 
        { prop: 'menuName', label: '菜单名', align: 'left', sortable: true },
        { prop: 'type', label: '类型', slotName: 'type' },
        { prop: 'icon', label: '图标', slotName: 'icon' },
        { prop: 'path', label: '路由' },
        { prop: 'auth', label: '权限' },
        { prop: 'status', label: '状态', slotName: 'status' },
        { prop: 'createTime', label: '创建时间', sortable: true },
        { prop: 'operation', label: '操作', fixed: 'right', width: '300', slotName: 'operation' },

    ],
    data: [],//表格渲染数据
    dataTotal: 0,//要给分页组件传递的total值
    options: {
        stripe: false,
        border: true,
        size: 'large',
        rowKey: 'id',
        treeProps: {
            children: 'children'
        },
        defaultExpandAll: false,
    }

});

//实例化GmyTable组件
const gmyTableRef = ref()

const toggleSelection = () => {
    gmyTableRef.value?.toggleSelection();//使用组件暴露的清空方法
}

const tableSelection = ref<Menu[]>([])

const tableSelectionIds = ref<string[]>([])

const isbatchDelete = computed(() => tableSelectionIds.value.length > 0);


const handleSelectionChange = (val: Menu[]) => {
    tableSelection.value = val
    tableSelectionIds.value = [];
    tableSelection.value.forEach((item) => {
        tableSelectionIds.value.push(item.id);
    })
    console.log([...tableSelectionIds.value])
}

const handleEdit = (index: number, row: Menu) => {
    console.log(index, row.id)
}
const handleDelete = async (index: number, row: Menu) => {
    console.log(index, [row.id])
    await useHandleData(deleteMenuByIdFn, { ids: [row.id] }, `删除【${row.menuName}】信息`)
    selectDataInfo();
}

const batchDelete = async () => {
    await useHandleData(deleteMenuByIdFn, { ids: tableSelectionIds.value }, `批量删除【${tableSelectionIds.value.length}】条信息`)
    selectDataInfo();
}


const handlePageInfo = (pageInfo: { currentPage: number, pageSize: number }) => {
    searchPayloads.currentPage = pageInfo.currentPage;
    searchPayloads.pageSize = pageInfo.pageSize;
    selectDataInfo();
};


const handleSearchForm = () => {
    searchPayloads.menuName = tableConfig.searchModel.menuName.data;
    searchPayloads.auth = tableConfig.searchModel.auth.data;
    selectDataInfo(); //调用查询函数
}

const selectDataInfo = async () => {
    try {
        const res = await getAllMenuByPageFn(searchPayloads);
        if (res.code === CODE_SUCCESS && res.data) {
            tableConfig.data = res.data.records;
            console.log(tableConfig.data);
            tableConfig.dataTotal = res.data.total;
        } else {
            ElMessage({
                type: 'error',
                message: res.message,
            })
        }
    } catch (error) {
        console.log('查询失败');
    } finally {
        console.log('getUserByPageFn');
    }
}
</script>

<style scoped>
@import url(@/styles/modules/table.css);
</style>