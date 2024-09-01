<template>
    <div class="table-container">
        <div class="table-header">
            <div class="search-container">
                <SearchForm v-model:info="tableConfig.searchModel" @submitSearchForm="handleSearchForm"></SearchForm>
            </div>
            <div class="table-tool">
                <el-button type="primary" @click="">新增</el-button>
                <el-button type="info" :disabled="!isbatchDelete" @click="toggleSelection()">清除选中项</el-button>
                <el-button type="danger" :disabled="!isbatchDelete" @click="batchDelete()">批量删除</el-button>
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
                <template #username="{ scope }">
                    <div class="flex-center">
                        <StatusDot v-if="userInfoStore.userInfo.username === scope.row.username"></StatusDot>
                        <span style="overflow: hidden">{{ scope.row.username }}</span>
                    </div>
                </template>
                <template #nickname="{ scope }">
                    <el-popover effect="light" trigger="hover" placement="bottom" width="auto">
                        <template #default>
                            <div>name: {{ scope.row.name }}</div>
                            <div>avatarUrl: {{ scope.row.avatarUrl }}</div>
                            <div>authList: {{ scope.row.authList }}</div>
                            <div>creatorId: {{ scope.row.creatorId }}</div>
                            <div>ts: {{ scope.row.ts }}</div>
                            <div>deleteFlag: {{ scope.row.deleteFlag }}</div>
                        </template>
                        <template #reference>
                            <el-tag type="info">{{ scope.row.name }}</el-tag>
                        </template>
                    </el-popover>
                </template>
                <template #roleList="{ scope }">
                    <el-tag v-for="item in scope.row.roleList" :key="item.id" style="margin: 0 5px">{{ item.role
                        }}</el-tag>
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
                    <el-button :disabled="!(
                        hasRoles(['GMY']) ||
                        scope.row.username === userInfoStore.userInfo.username
                    )" link type="primary" size="small" @click="resetPwd(scope.$index, scope.row)">
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
        <FormDialog :dialogTitle="editDialogTitle" v-model:visible="editVisible" :fields="editFormFields"
            :initialData="editFormData" :formRules="editFormRules" @submit="handleEditFormSubmit">
        </FormDialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed, readonly } from "vue";
import GmyTable from "@/components/GmyTable/index.vue";
import { ElMessage } from "element-plus";
import { User } from "@element-plus/icons-vue";
import SearchForm from "@/components/GmyTable/components/SearchForm.vue";
import { CODE_SUCCESS } from "@/api/helper/codeStatus";
import {
    getUserByPageFn,
    deleteUserByIdFn,
    resetPwdByIdFn,
} from "@/api/modules/user";
import { useHandleData } from "@/hooks/useHandleData";
import { useRetryRequest } from "@/hooks/useRetryRequest";
import StatusDot from "./StatusDot.vue";
import useUserInfoStore from "@/store/modules/userInfo";
import { hasRoles } from "@/hooks/useHasRoles";
import FormDialog from "./FormDialog/index.vue";

const userInfoStore = useUserInfoStore();

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

const searchPayloads = reactive({
    username: "",
    name: "",
    email: "",
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
        username: { data: "", placeholder: "请输入用户名", prefixIcon: "User" },
        name: { data: "", placeholder: "请输入昵称" },
        email: { data: "", placeholder: "请输入邮箱", prefixIcon: "Message" },
    },
    //showOverflowTooltip超出时隐藏
    columns: [
        { type: "selection", width: "60" }, // 选择框列
        { type: "index", label: "#", width: "60" }, // 索引列
        { prop: "username", label: "用户名", slotName: "username", sortable: true },
        { prop: "name", label: "Nickname", slotName: "nickname" },
        {
            prop: "roleList",
            label: "角色标识",
            slotName: "roleList",
            sortable: true,
        },
        { prop: "createTime", label: "创建时间", sortable: true },
        { prop: "email", label: "邮箱" },
        {
            prop: "operation",
            label: "操作",
            fixed: "right",
            width: "300",
            slotName: "operation",
        },
    ],
    data: [], //表格渲染数据
    dataTotal: 0, //要给分页组件传递的total值
    options: {
        stripe: false,
        border: true,
        size: "large",
        rowKey: "id",
        treeProps: {
            children: "children",
        },
        defaultExpandAll: false,
    },
});

//实例化GmyTable组件
const gmyTableRef = ref();

const toggleSelection = () => {
    gmyTableRef.value?.toggleSelection(); //使用组件暴露的清空方法
};

const tableSelection = ref<User[]>([]);

const tableSelectionIds = ref<string[]>([]);

const isbatchDelete = computed(() => tableSelectionIds.value.length > 0);

const handleSelectionChange = (val: User[]) => {
    tableSelection.value = val;
    tableSelectionIds.value = [];
    tableSelection.value.forEach((item) => {
        tableSelectionIds.value.push(item.id);
    });
    console.log([...tableSelectionIds.value]);
};

const handleEdit = (index: number, row: User) => {
    console.log(index, row.id);
};

const handleDelete = async (index: number, row: User) => {
    console.log(index, [row.id]);
    await useHandleData(
        deleteUserByIdFn,
        { ids: [row.id] },
        `删除【${row.username}】信息`
    );
    selectDataInfo();
};

const batchDelete = async () => {
    await useHandleData(
        deleteUserByIdFn,
        { ids: tableSelectionIds.value },
        `批量删除【${tableSelectionIds.value.length}】条信息`
    );
    selectDataInfo();
};

const handlePageInfo = (pageInfo: {
    currentPage: number;
    pageSize: number;
}) => {
    searchPayloads.currentPage = pageInfo.currentPage;
    searchPayloads.pageSize = pageInfo.pageSize;
    selectDataInfo();
};

const handleSearchForm = () => {
    searchPayloads.username = tableConfig.searchModel.username.data;
    searchPayloads.name = tableConfig.searchModel.name.data;
    searchPayloads.email = tableConfig.searchModel.email.data;
    selectDataInfo(); //调用查询函数
};

const selectDataInfo = async () => {
    try {
        const res = await getUserByPageFn(searchPayloads);
        if (res.code === CODE_SUCCESS && res.data) {
            tableConfig.data = res.data.records;
            tableConfig.dataTotal = res.data.total;
        } else {
            ElMessage({
                type: "error",
                message: res.message,
            });
        }
    } catch (error) {
        console.log("查询失败");
    } finally {
        console.log("getUserByPageFn");
    }
};

const editDialogTitle = ref<string>();
const editVisible = ref<boolean>(false);
const editFormData = ref<Object>();
const editFormRules = ref<Object>();
const editFormFields = ref<Array<any>>();

const resetPwd = (index: number, row: User) => {
    editDialogTitle.value = "重置用户密码";
    editVisible.value = true;
    const updataPwdDto = {
        id: row.id,
        username: row.username,
    };
    editFormData.value = updataPwdDto;
    editFormRules.value = {
        newPwd: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 4, max: 16, message: "长度最少4位，最多16位", trigger: "change" },
        ],
    };
    editFormFields.value = [
        {
            label: "用户名",
            prop: "username",
            type: "el-input",
            attrs: { placeholder: "请输入角色名", readonly: true },
        },
        {
            label: "新密码",
            prop: "newPwd",
            type: "el-input",
            attrs: {
                type: "password", placeholder: "请输入密码"
            },
        },
    ];
};

const handleEditFormSubmit = async (data) => {
    try {
        const { res } = await useRetryRequest(
            resetPwdByIdFn,
            data,
            3,
            1000
        );
        if (res.value.code === CODE_SUCCESS) {
            if (userInfoStore.userInfo.username === data.username) {
                userInfoStore.setToken(res.value.data)
            }
            ElMessage({
                type: "success",
                message: `【${data.username}】操作成功`,
            });
        } else {
            ElMessage({
                type: "error",
                message: "操作失败",
            });
        }
    } catch (err) {
        console.log(err);
    }
    console.log("data", data);
};
</script>

<style scoped>
@import url(@/styles/modules/table.css);
</style>
