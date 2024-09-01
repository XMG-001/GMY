<template>
    <div class="table-main">
        <div class="table-header">
            <div class="search-container">
                <SearchForm v-model:info="usernameSearchForm" @submitSearchForm="handleForm"></SearchForm>
            </div>
            <div class="table-tool">
                <el-button type="primary" :disabled="!isbatchDelete" @click="toggleSelection()">清除选中项</el-button>
                <el-button type="danger" :disabled="!isbatchDelete" @click="batchDelete()">批量删除</el-button>
            </div>
        </div>
        <el-table ref="tableRef" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange"
            :default-sort="{ prop: 'username', order: 'descending' }" :show-overflow-tooltip="true">
            <el-table-column type="selection" width="60" />
            <el-table-column type="expand" width="60" />
            <el-table-column label="Username" property="username" :sortable="true">
            </el-table-column>
            <el-table-column label="Name">
                <template #default="scope">
                    <el-popover effect="light" trigger="hover" placement="bottom" width="auto">
                        <template #default>
                            <div>name: {{ scope.row.name }}</div>
                            <div>avatarUrl: {{ scope.row.avatarUrl }}</div>
                            <div>creatorId: {{ scope.row.creatorId }}</div>
                            <div>ts: {{ scope.row.ts }}</div>
                            <div>deleteFlag: {{ scope.row.deleteFlag }}</div>
                        </template>
                        <template #reference>
                            <el-tag>{{ scope.row.name }}</el-tag>
                        </template>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="createTime" property="createTime" :sortable="true">
            </el-table-column>
            <el-table-column label="Email" property="email">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="300">
                <template #default="scope">
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
                    <el-button link type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">
                        <el-icon>
                            <Delete />
                        </el-icon>删除
                    </el-button>
                </template>

            </el-table-column>
        </el-table>

    </div>
</template>

<script lang="ts" setup>
import request from '../utils/request'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import SearchForm from './SearchForm.vue'
import usePagingInfoStore from '../store/modules/pagingInfo';
import { CODE_SUCCESS } from '../api/helper/codeStatus';
import { getUserByPageFn, deleteUserByIdFn } from '@/api/modules/user';
import { useHandleData } from '../hooks/useHandleData';
import { ElTable } from 'element-plus'

//面向对象
interface User {
    authList: [];
    avatarUrl: string;
    createTime: string;
    creatorId: string;
    deleteFlag: string;
    email: string;
    id: string;
    name: string;
    role: string;
    roleId: string;
    roleIds: [];
    roleList: [];
    ts: string;
    username: string;
}


const pagingInfo = usePagingInfoStore();


const tableData = ref([])

const searchForm = reactive({
    username: '',
    name: '',
    email: ''
})

const usernameSearchForm = reactive({
    username: {
        data: '', //响应的值
        placeholder: '请输入用户名', // 输入框的提示文字
        prefixIcon: 'User', // 输入框的前缀图标el-icon
    },
    name: {
        data: '', //响应的值
        placeholder: '请输入昵称', // 输入框的提示文字
        prefixIcon: 'User', // 输入框的前缀图标el-icon
    },
    email: {
        data: '', //响应的值
        placeholder: '请输入邮箱', // 输入框的提示文字
        prefixIcon: 'Message', // 输入框的前缀图标el-icon
    }
});


onMounted(() => {
    selectUserInfo();
});

watch(
    [() => pagingInfo.currentPage, () => pagingInfo.pageSize],
    () => {
        selectUserInfo();
    },
    { deep: true }
);

const tableRef = ref<InstanceType<typeof ElTable>>()

const tableSelection = ref<User[]>([])

const tableSelectionIds = ref<string[]>([])

const isbatchDelete = computed(() => tableSelectionIds.value.length > 0);

const toggleSelection = (rows?: User[]) => {
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

const handleSelectionChange = (val: User[]) => {
    tableSelection.value = val
    tableSelectionIds.value = [];
    tableSelection.value.forEach((item) => {
        tableSelectionIds.value.push(item.id);
    })
    console.log([...tableSelectionIds.value])
}

const handleEdit = (index: number, row: User) => {
    console.log(index, row.id)
}
const handleDelete = async (index: number, row: User) => {
    console.log(index, [row.id])
    await useHandleData(deleteUserByIdFn, { ids: [row.id] }, `删除【${row.username}】信息`)
    selectUserInfo();
}

const batchDelete = async () => {
    await useHandleData(deleteUserByIdFn, { ids: tableSelectionIds.value }, `批量删除【${tableSelectionIds.value.length}】条信息`)
    selectUserInfo();
}


const handleForm = () => {
    searchForm.username = usernameSearchForm.username.data;
    searchForm.name = usernameSearchForm.name.data;
    searchForm.email = usernameSearchForm.email.data;
    selectUserInfo(); //调用查询函数
}

const selectUserInfo = async () => {
    try {
        let payloads = {
            currentPage: pagingInfo.currentPage,
            pageSize: pagingInfo.pageSize,
            username: searchForm.username,
            name: searchForm.name,
            email: searchForm.email
        }
        const res = await getUserByPageFn(payloads);
        if (res.code === CODE_SUCCESS && res.data) {
            tableData.value = res.data.records;
            pagingInfo.setTotal(res.data.total);
        } else {
            ElMessage({
                type: 'error',
                message: res.message,
            })
        }
    } catch (error) {
        console.log('查询失败');
        // ElMessage({
        //     type: 'error',
        //     message: '查询失败',
        // })
    } finally {
        console.log('getUserByPageFn');
    }
}



</script>

<script lang="ts">
export default {
}
</script>

<style scoped>
.table-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

.table-header {
    width: 100%;
}

.search-container {
    width: 100%;
    height: 50px;
    background-color: #fff;
    z-index: 3;
    overflow-x: auto;
}

.table-tool {
    width: 100%;
    height: 50px;
    background-color: #fff;
    overflow-x: auto;
    white-space: nowrap;
}

:deep(.el-table .el-table__cell) {
    text-align: center;
}

:deep(.el-table .cell.el-tooltip) {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>