<template>
  <!-- <form @submit.prevent="login">
    <h1>登录账号</h1>
    <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable :prefix-icon="User" />
    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password :prefix-icon="Key" />
    <el-input v-model="captcha" style="width: 100px" placeholder="验证码" :prefix-icon="Warning" />
    <el-button color="#626aef" :dark="isDark" size="large" round>登&emsp;录</el-button></div>
    
  </form> -->
  <div class="lr-form">
    <el-form ref="loginRef" :model="loginForm" :rules="rules" @keyup.enter="handleSubmit">
      <h1>登录账号</h1>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
          clearable
          :prefix-icon="User"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          clearable
          show-password
          :prefix-icon="Key"
        />
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input
          v-model="captcha"
          style="width: 100px"
          placeholder="验证码"
          clearable
          :prefix-icon="Warning"
        />
      </el-form-item>
      <div class="bt-position">
        <el-button
          @click="handleSubmit"
          color="#626aef"
          :dark="isDark"
          size="large"
          :loading="loading"
          round
          >登&emsp;录</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage,ElNotification } from 'element-plus'
import { User, Key, Warning } from '@element-plus/icons-vue'
import router from '@/router';
import useUserInfoStore from '@/store/modules/userInfo';
import useMenuInfoStore from '@/store/modules/menuInfo';
import { loginFn } from '@/api/modules/login';
import { Loading } from 'element-plus/es/components/loading/src/service.mjs';
import { throttle } from 'lodash'
import { CODE_SUCCESS } from '@/api/helper/codeStatus';
import { initDynamicRouter } from '@/router/modules/handleRouter'


const userInfoStore = useUserInfoStore();
const menuInfoStore = useMenuInfoStore();

const loginRef = ref<FormInstance>()
const captcha = ref('');
const isDark = ref(false);
const loading = ref(false);

const loginForm = reactive({
  username: '',
  password: ''
});

const clearForm = (formRef) => {
  formRef.value.resetFields();
}

// const handleSubmit = () => {
//   console.log('登录节流1');
//   submitForm(loginRef.value);
// }

const handleSubmit = throttle((evt) => {
  console.log('登录节流');
  submitForm(loginRef.value);
}, 1500)


const login = async () => {
  try {
    loading.value = true;
    const res = await loginFn(loginForm);
    if (res.code === CODE_SUCCESS && res.data) {
      userInfoStore.setToken(res.data);
      // localStorage.setItem('token', JSON.stringify(res.data))//存进本地缓存，记得转为json字符串
      //等待路由菜单初始化
      await initDynamicRouter();
      //获取用户信息
      const okUser = await userInfoStore.fetchUserInfo();
      const okMenu = await menuInfoStore.fetchMenuList();
      if (okUser && okMenu) {
        userInfoStore.setIsLogged(true);
        ElMessage({
          type: 'success',
          message: '登录成功',
        })
        await router.replace({ name: 'Home' });
        //一定要刷新,防止守卫里不重新拉取数据
        window.location.reload();

      } else {
        userInfoStore.resetAll();
      }
    } else {
      ElMessage({
        type: 'error',
        message: res.message,
      })
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '登录失败',
    })
  } finally {
    clearForm(loginRef);
    loading.value = false;
  }

  // request.post('/login', loginForm).then(res => {
  //   if (res.code === CODE_SUCCESS) {
  //     localStorage.setItem('token', JSON.stringify(res.data))//存进本地缓存，记得转为json字符串
  //     ElMessage({
  //       type: 'success',
  //       message: '登录成功',
  //     })
  //     router.push({name:'home'});
  //   } else {
  //     ElMessage({
  //       type: 'error',
  //       message: res.message,
  //     })
  //   }
  // })
}


const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('登录提交成功!')
      login();
    } else {
      console.log('登录提交错误!')
      setTimeout(() => {
        formEl.clearValidate(); // 清除验证状态
      }, 2000); // 延迟2000毫秒
    }
  })
}


const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 16, message: '长度最少2位，最多16位', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur', },
    { min: 4, max: 16, message: '长度最少4位，最多16位', trigger: 'change' },
  ],
  captcha: [
    { required: false, message: '请输入验证码', trigger: 'blur' },
  ]
})
</script>

<style scoped>
@import url(../styles/modules/LRForm.css);
</style>
