<template>
  <!-- <form @submit.prevent="register">
    <h1>注册账号</h1>
    <el-input v-model="registerForm.username"   placeholder="请设置用户名" clearable  :prefix-icon="User"/>
    <el-input v-model="registerForm.password"  type="password" placeholder="请设置密码" show-password  :prefix-icon="Key"/>
    <el-input v-model="registerForm.phone"  placeholder="可用于登录和找回密码" clearable :prefix-icon="Iphone"/>
    <el-input v-model="captcha" style="width: 100px" placeholder="验证码" :prefix-icon="Warning" />
    <div class="bt-position"><el-button color="#626aef" :dark="isDark" size="large" round>注&emsp;册</el-button></div>
  </form> -->
  <div class="lr-form">
    <el-form ref="registerRef" :model="registerForm" :rules="rules">
      <h1>注册账号</h1>
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" placeholder="请设置用户名" clearable :prefix-icon="User" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="请设置密码" clearable show-password
          :prefix-icon="Key" />
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="registerForm.phone" placeholder="可用于登录和找回密码" clearable :prefix-icon="Iphone" />
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input v-model="captcha" style="width: 100px" placeholder="验证码" clearable
          :prefix-icon="Warning" />
      </el-form-item>
      <div class="bt-position">
        <el-button @click="handleSubmit" color="#626aef" :dark="isDark" size="large" :loading="loading"
          round>注&emsp;册</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, Key, Warning, Iphone } from '@element-plus/icons-vue'
import { defineEmits } from 'vue';
import { registerFn } from '@/api/modules/login';
import { throttle } from 'lodash'
import { CODE_SUCCESS } from '@/api/helper/codeStatus';

const emit = defineEmits(['changeIsLogging']);

const registerRef = ref<FormInstance>()
const captcha = ref('');

const isDark = ref(false);
const loading = ref(false);

const registerForm = reactive({
  username: '',
  password: '',
  phone: ''
});

const clearForm = (formRef) => {
  formRef.value.resetFields();
}

const handleSubmit = throttle((evt) => {
  console.log('注册节流');
  submitForm(registerRef.value);
}, 1500)

const register = async () => {
  try {
    loading.value = true;
    const res = await registerFn(registerForm);
    if (res.code === CODE_SUCCESS) {
      ElMessage({
        type: 'success',
        message: '注册成功',
      })
      emit('changeIsLogging')
      clearForm(registerRef)
      // localStorage.setItem('userInfo', JSON.stringify(res.data))//存进本地缓存，记得转为json字符串
    } else {
      registerForm.password = '';
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
  }
  catch (error) {
    ElMessage({
      type: 'error',
      message: '注册失败',
    })
  } finally {
    loading.value = false;
  }
}

const submitForm = async(formEl: FormInstance | undefined) => {
  if (!formEl) return; // 确保formEl存在
  formEl.validate((valid) => {
    if (valid) {
      console.log('注册提交成功!');
      register();
    } else {
      console.log('注册提交错误!');
      setTimeout(() => {
        formEl.clearValidate(); // 清除验证状态
      }, 2000); // 延迟2000毫秒
    }
  });
};

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 16, message: '长度最少2位，最多16位', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur', },
    { min: 4, max: 16, message: '长度最少4位，最多16位', trigger: 'change' },
  ],
  phone: [
    { required: false, message: '请输入手机号', trigger: 'blur', },
    { min: 11, max: 11, message: '长度11位', trigger: 'change' },
  ],
  captcha: [
    { required: false, message: '请输入验证码', trigger: 'blur' },
  ]
})

</script>

<style scoped>
@import url(../styles/modules/LRForm.css);
</style>