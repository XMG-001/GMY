<template>
    <el-form ref="searchRef" :model=props.info style="display: flex;">
        <el-form-item v-for="(value, key) in props.info" :prop=key class="search-input">
            <el-input v-model=value.data :placeholder="value.placeholder || '请输入'" clearable
                :prefix-icon="value.prefixIcon || 'Search'" />
        </el-form-item>
        <div class="search-button">
            <el-button @click="submitForm(searchRef)" type="primary" size="default">
                <el-icon size="20">
                    <Search />
                </el-icon>
            </el-button>
            <el-tooltip class="box-item" effect="dark" content="重置" placement="right">
                <el-button @click="resetForm(searchRef)" type="primary" size="default" circle plain>
                    <el-icon size="20">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
    </el-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps(['info']);
const $emit = defineEmits(['updata:info', 'submitSearchForm'])

const searchRef = ref<FormInstance>()


const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return // 确保formEl存在
    formEl.validate((valid) => {
        if (valid) {
            console.log('分页查询提交成功!');
            $emit('updata:info', props.info);
            $emit('submitSearchForm');
        } else {
            console.log('分页查询提交错误!');
            setTimeout(() => {
                formEl.clearValidate(); // 清除验证状态
            }, 2000); // 延迟2000毫秒
        }
    });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  submitForm(formEl);
}
</script>

<style scoped>
.search-input {
    max-width: 220px;
    margin-right: 10px;
}
.search-button{
    display: flex;;
}
</style>