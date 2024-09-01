<template>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" @close="handleClose" draggable center>
        <el-form :model="formModel" :rules="formRules" ref="formRef">
            <el-form-item v-for="field in fields" :key="field.prop" :label="field.label" :prop="field.prop"
                label-width="100px">
                <component :is="field.type" v-bind="field.attrs" v-model="formModel[field.prop]" clearable :show-password="field.type === 'password'">
                    <!-- 处理动态插槽内容，如选择选项或单选选项 -->
                    <template v-if="field.type === 'el-select'" #default>
                        <el-option v-for="option in field.options" :key="option.value" :label="option.label"
                            :value="option.value">
                            <el-tag>{{ option.value }}</el-tag></el-option>
                    </template>
                    <template v-if="field.type === 'el-radio-group'" #default>
                        <el-radio v-for="option in field.options" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </el-radio>
                    </template>
                    <template v-if="field.type === 'el-checkbox-group'" #default>
                        <el-checkbox v-for="option in field.options" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </el-checkbox>
                    </template>
                </component>
                <!-- 如果定义了插槽名，使用插槽 -->
                <template v-if="field.slotName">
                    <slot :name="field.slotName"></slot>
                </template>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
        </span>
    </el-dialog>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import cloneDeep from "lodash/cloneDeep";
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

const formRef = ref(null);

const handleClose = () => {
    dialogVisible.value = false;
    setTimeout(() => {
        formRef.value.clearValidate(); // 清除验证状态
    }, 0); // 延迟0毫秒
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

.el-form {
    padding: 20px 40px;
}
</style>
