<template>
  <div> <el-dialog :title="dialogTitle" v-model="dialogVisible" @close="handleClose" draggable center>
      <slot></slot>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{ dialogClose }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ dialogSubmit }}</el-button>
      </span>
    </el-dialog>
    <el-button @click="xxx">djw</el-button>
  </div>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import cloneDeep from "lodash/cloneDeep";
import { getTimeState } from '@/utils'

const xxx = () => {
  console.log("getTimeStat", getTimeState())
}

import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
} from "element-plus";

const props = defineProps({
  dialogTitle: {
    type: String,
    default: "表单对话框",
  },
  visible: {
    type: Boolean,
    default: false,
  },
  fields: {
    type: Array,
    default: () => [],
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
  formRules: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:visible", "submit"]);

const { visible, initialData } = toRefs(props);

const dialogVisible = ref(visible.value);
const formModel = ref(cloneDeep(initialData.value)); // 深拷贝 initialData

watch(visible, (newVal) => {
  dialogVisible.value = newVal;
  if (newVal) {
    formModel.value = cloneDeep(initialData.value); // 当对话框打开时重置表单数据
    console.log(formModel.value);
  }
});

watch(dialogVisible, (newVal) => {
  if (!newVal) {
    emit("update:visible", false);
  }
});


const handleClose = () => {
  dialogVisible.value = false;
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    emit("submit", cloneDeep(formModel.value)); // 提交深拷贝后的表单数据
    handleClose();
  } catch (error) {
    console.error("表单检验失败:", error);
  }
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
