<template>
    <div class="table-container">
        <div class="table-header">
            <div class="search-container">
                <SearchForm v-model:info="tableConfig.searchModel" @submitSearchForm="handleSearchForm"></SearchForm>
            </div>
            <div class="table-tool">
                <el-button type="primary" @click="handleAdd()">新增</el-button>
                <el-button type="info" :disabled="!isbatchDelete" @click="toggleSelection()">清除选中项</el-button>
                <el-button v-if="true" type="danger" :disabled="!isbatchDelete" @click="batchDelete()">批量删除</el-button>
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
                <template #role="{ scope }">
                    <el-tag>{{ scope.row.role }}</el-tag>
                </template>
                <template #menuList="{ scope }">
                    <el-button type="primary" round plain @click="handleTree(scope.$index, scope.row)">菜单列表</el-button>
                </template>

                <template #operation="{ scope }">
                    <el-button link type="primary" size="small" @click="handleTree(scope.$index, scope.row)">
                        <el-icon>
                            <View />
                        </el-icon>查看
                    </el-button>
                    <el-button :disabled="!true" link type="primary" size="small"
                        @click="handleEdit(scope.$index, scope.row)">
                        <el-icon>
                            <EditPen />
                        </el-icon>编辑
                    </el-button>
                    <el-button link type="primary" size="small">
                        <el-icon>
                            <Refresh />
                        </el-icon>重置
                    </el-button>
                    <el-button :disabled="!true" link type="danger" size="small"
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
        <TreeFormDialog :dialogTitle="'分配菜单'" v-model:treeVisiable="treeVisiable" :treeDefineProps="treeDefineProps"
            :treeAllData="allMenu" :treeDefaultData="treeDefaultData" :submitDisabled="true"
            @submit="handleEditTreeSubmit">
        </TreeFormDialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed } from "vue";
import GmyTable from "@/components/GmyTable/index.vue";
import { ElMessage } from "element-plus";
import SearchForm from "@/components/GmyTable/components/SearchForm.vue";
import { CODE_SUCCESS } from "@/api/helper/codeStatus";
import { getAllRoleMenuByPageFn, deleteRoleByIdFn, saveOrUpdateRoleFn } from "@/api/modules/role";
import { saveRoleMenuFn } from "@/api/modules/roleMenu";
import { useHandleData } from "@/hooks/useHandleData";
import { hasRoles } from "@/hooks/useHasRoles";
import FormDialog from "./FormDialog/index.vue";
import TreeFormDialog from "./TreeFormDialog/index.vue";
import useMenuInfoStore from "@/store/modules/menuInfo";
import useSettingStore from "@/store/modules/setting";


const menuInfoStore = useMenuInfoStore();

const editId = ref();

//对象
interface Role {
    id: string;
    roleName: string;
    role: string;
    creatorId: string;
    createTime: string;
    ts: string;
    deleteFlag: number;
    menuList: [];
}

const searchPayloads = reactive({
    roleName: "",
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
        roleName: {
            data: "",
            placeholder: "请输入角色名",
            prefixIcon: "UserFilled",
        },
    },
    //showOverflowTooltip超出时隐藏
    columns: [
        { type: "selection", width: "60" }, // 选择框列
        { type: "index", label: "#", width: "60" },
        // { type: 'expand', label: '#', width: '60' },
        { prop: "roleName", label: "角色名", sortable: true },
        { prop: "role", label: "角色标识", slotName: "role", sortable: true },
        { prop: "createTime", label: "创建时间", sortable: true },
        { prop: "menuList", label: "查看菜单权限", slotName: "menuList" },
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

const tableSelection = ref<Role[]>([]);

const tableSelectionIds = ref<string[]>([]);

const isbatchDelete = computed(() => tableSelectionIds.value.length > 0);

const handleSelectionChange = (val: Role[]) => {
    tableSelection.value = val;
    tableSelectionIds.value = [];
    tableSelection.value.forEach((item) => {
        tableSelectionIds.value.push(item.id);
    });
    console.log([...tableSelectionIds.value]);
};

const handleDelete = async (index: number, row: Role) => {
    console.log(index, [row.id]);
    await useHandleData(
        deleteRoleByIdFn,
        { ids: [row.id] },
        `删除【${row.roleName}】信息`
    );
    selectDataInfo();
};

const batchDelete = async () => {
    await useHandleData(
        deleteRoleByIdFn,
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
    searchPayloads.roleName = tableConfig.searchModel.roleName.data;
    selectDataInfo(); //调用查询函数
};

const selectDataInfo = async () => {
    try {
        const res = await getAllRoleMenuByPageFn(searchPayloads);
        if (res.code === CODE_SUCCESS && res.data) {
            tableConfig.data = res.data.records;
            console.log(tableConfig.data);
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
        console.log("getAllRoleMenuByPageFn");
    }
};


const editDialogTitle = ref<string>();
const editVisible = ref<boolean>(false);
const editFormData = ref<Object>();
const editFormRules = ref<Object>();
const editFormFields = ref<Array<any>>();

const handleEdit = (index: number, row: Role) => {
    editDialogTitle.value = '编辑角色信息';
    editFormFields.value = [
        {
            label: "角色名",
            prop: "roleName",
            type: "el-input",
            attrs: { placeholder: "请输入角色名" },
        },
        {
            label: "角色标识",
            prop: "role",
            type: "el-select",
            options: [
                { label: "GMY", value: "GMY" },
                { label: "ADMIN", value: "ADMIN" },
                { label: "USER", value: "USER" },
                { label: "VISITOR", value: "VISITOR" },
                { label: "TEST", value: "TEST" },
            ],
            attrs: { disabled: false },
        },
    ];
    //暂时清空校验
    editFormRules.value = {};
    editVisible.value = true;
    editFormData.value = row; // 深拷贝 row 到 editFormData.value
};

const handleEditFormSubmit = async (data) => {
    await useHandleData(
        saveOrUpdateRoleFn,
        data,
        `提交【${data.roleName}】信息`
    );
    selectDataInfo();
    console.log("提交的数据:", data);
};

const treeVisiable = ref(false);
const treeDefineProps = {
    children: "children",
    label: "menuName",
    id: "id",
};

const allMenu = ref();
const treeDefaultData = ref();

const handleTree = async (index: number, row: Role) => {
    if (menuInfoStore.allMenu.length === 0) {
        await menuInfoStore.fetchAllMenuList();
    }
    editId.value = row.id;
    treeVisiable.value = true;
    allMenu.value = menuInfoStore.allMenu;
    treeDefaultData.value = fliterTreeIds(allMenu.value, row.menuList);
};

const fliterTreeIds = (allList: any[], partList: any[]): number[] => {
    const partIds = partList.map((item) => item.id); // 获取 partList 中的所有 id
    const resultIds: number[] = [];

    const traverse = (list: any[]) => {
        for (const item of list) {
            if (partIds.includes(item.id)) {
                resultIds.push(item.id); // 如果 id 存在于 partList 中，记录下来
            }
            if (item.children && item.children.length > 0) {
                traverse(item.children); // 递归处理子节点
            }
        }
    };
    traverse(allList);
    return resultIds;
};

//无变化不会产生值
const handleEditTreeSubmit = async (data) => {
    if (data && data.length > 0) {
        let roleId = editId.value;
        let payloads: Array<any> = [];
        data.forEach(item => {
            let obj = {
                roleId: roleId,
                menuId: item
            }
            payloads.push(obj);
        })
        console.log("payloads", payloads)
        await useHandleData(
            saveRoleMenuFn,
            payloads,
            `提交【${JSON.stringify(payloads)}】信息`
        );
        selectDataInfo();
    }
    console.log("提交的数据:", editId.value, data);
};




const handleAdd = () => {
    editDialogTitle.value = '新增角色';
    editFormData.value = {};
    editFormFields.value = [
        {
            label: "角色名",
            prop: "roleName",
            type: "el-input",
            attrs: { placeholder: "请输入角色名" },
        },
        {
            label: "角色标识",
            prop: "role",
            type: "el-select",
            options: [
                { label: "GMY", value: "GMY" },
                { label: "ADMIN", value: "ADMIN" },
                { label: "USER", value: "USER" },
                { label: "VISITOR", value: "VISITOR" },
                { label: "TEST", value: "TEST" },
            ],
            attrs: { disabled: false },
        },
    ];
    editFormRules.value = {
        roleName: [{ required: true, message: "请输入角色名", trigger: "change" }],
        role: [{ required: true, message: "请选择角色标识", trigger: "change" }],
    };
    editVisible.value = true;
};
</script>

<style scoped>
@import url(@/styles/modules/table.css);
</style>
