import { defineStore } from "pinia";
import { getUserInfoFn, getUserRoleFn } from "@/api/modules/login";
import { ElMessage } from 'element-plus';
import router from '@/router';
import { CODE_SUCCESS } from '@/api/helper/codeStatus';
import { useRetryRequest } from "@/hooks/useRetryRequest";

// 最好用 use 开头
const useUserInfoStore = defineStore("userInfo", {
  state: () => ({
    isLogged: false,
    token: '',
    userInfo: {}, // 注意! 这里不能用 null，因为是一个对象，不然会有白屏错误
    roles: [],
  }),
  getters: {},
  actions: {
    async resetAll() {
      this.$reset();
    },
    setIsLogged(val) {
      this.isLogged = val;
    },
    setToken(val) {
      this.token = val;
    },
    setUserInfo(val) {
      this.userInfo = val;
    },
    async fetchUserInfo() {
      try {
        const { res, error, loading } = await useRetryRequest(getUserInfoFn, {}, 3, 1000);
        if (res.value.code === CODE_SUCCESS) {
          const response = await getUserRoleFn();
          if (response.code === CODE_SUCCESS) {
            this.userInfo = res.value.data;
            this.roles = response.data;
            console.log("userInfo", this.userInfo, this.roles);
            if (Object.keys(this.userInfo).length === 0 || this.roles.length === 0) {
              ElMessage.error('获取个人信息失败');
              return false;
            }
          } else {
            ElMessage.error('获取用户角色失败');
            return false;
          }
        } else {
          ElMessage.error('获取用户信息失败');
          return false;
        }
      } catch (err) {
        console.error(err);
        ElMessage.error('获取用户信息异常');
        return false;
      }
      this.isLogged = true;
      return true; // 成功获取用户信息
    }
  },
  persist: {
    key: 'gmy-userInfo', // 存储名称
    // storage: sessionStorage, // 如果需要使用 sessionStorage，请取消注释
    paths: ['isLogged', 'token', 'userInfo'], // 指定 state 中哪些数据需要被持久化
    afterRestore: async (context) => {
      const userInfoStore = context.store;
      console.log('从本地获取:', userInfoStore.$state);
      if (userInfoStore.isLogged) {
        // 重新获取用户信息
        const success = await userInfoStore.fetchUserInfo();
        if (!success) {
          userInfoStore.resetAll();
        }
      }
      return userInfoStore.$state; // 返回修改后的状态
    },
    debug: true,
  }
});

export default useUserInfoStore;
