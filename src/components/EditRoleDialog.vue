<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="编辑信息"
      :width="dialogWidth"
      :before-close="handleClose"
      draggable
      center
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="120px"
      >
        <el-row :gutter="20">
          <!-- 使用通用表单项组件渲染 -->
          <el-col :span="24" v-for="(item, index) in formItems" :key="index">
            <FormItem
              :label="item.label"
              :prop="item.prop"
              v-model="formData"
              :componentType="item.type"
              :componentProps="item.attrs"
              :options="item.options || []"
            />
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import FormItem from "./FormDialog.vue"; // 引入通用表单项组件

const props = defineProps({
  isVisible: Boolean,
  editForm: Object,
});
const $emit = defineEmits(["update:isVisible"]);



const dialogVisible = computed({
  get: () => props.isVisible,
  set: (newVal) => {
    $emit("update:isVisible", newVal);
    if(!newVal){
      formRef.value.resetFields();
    }
  },
});


const dialogWidth = ref("50%");

const formData = ref();

watch(
  () => props.editForm,
  () => {
    formData.value = props.editForm;
  }
);

// interface Role {
//   id: string;
//   roleName: string;
//   role: string;
//   creatorId: string;
//   createTime: string;
//   ts: string;
//   deleteFlag: number;
//   menuList: [];
// }

const rules = {
  roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }],
  role: [{ required: true, message: "请选择角色标识", trigger: "change" }],
  menuList: [{ required: true, message: "菜单权限列表", trigger: "change" }],
  // remarks: [{ required: false }],
};

const formItems = [
  {
    label: "角色名",
    prop: "roleName",
    type: "el-input",
    attrs: { placeholder: "请输入角色名", readonly: true },
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
    ],
  },
  {
    label: "菜单权限",
    prop: "menuList",
    type: "el-input",
    attrs: { type: "textarea", placeholder: "菜单权限", rows: 4 },
  },
];


const formRef = ref(null);

const handleClose = (done) => {
  // formRef.value.resetFields();
  done();
};

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log("表单数据:", formData.value);
      dialogVisible.value = false;
      formRef.value.resetFields();
    } else {
      console.log("表单验证失败");
      return false;
    }
  });
};

const updateDialogWidth = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    dialogWidth.value = "90%";
  } else if (screenWidth < 1200) {
    dialogWidth.value = "70%";
  } else {
    dialogWidth.value = "50%";
  }
};

onMounted(() => {
  updateDialogWidth();
  window.addEventListener("resize", updateDialogWidth);
});
</script>

<style scoped>
.dialog-footer {
  display: flex;
  width: 100%;
  justify-content: center;
}

.el-form {
  padding: 20px 40px;
  overflow: auto;
}
</style>
